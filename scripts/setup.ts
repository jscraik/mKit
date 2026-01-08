#!/usr/bin/env npx tsx
/**
 * mKit Setup Script
 * Interactive setup for environment variables and KV namespace creation
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import * as readline from "node:readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function prompt(question: string, defaultValue?: string): Promise<string> {
    const suffix = defaultValue ? ` (${defaultValue})` : "";
    return new Promise((resolve) => {
        rl.question(`${question}${suffix}: `, (answer) => {
            resolve(answer.trim() || defaultValue || "");
        });
    });
}

function promptSecret(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(`${question}: `, (answer) => {
            resolve(answer.trim());
        });
    });
}

async function promptYesNo(question: string, defaultYes = true): Promise<boolean> {
    const suffix = defaultYes ? " (Y/n)" : " (y/N)";
    const answer = await prompt(`${question}${suffix}`);
    if (!answer) return defaultYes;
    return answer.toLowerCase().startsWith("y");
}

function runCommand(cmd: string, silent = false): string {
    try {
        return execSync(cmd, { encoding: "utf-8", stdio: silent ? "pipe" : "inherit" }).trim();
    } catch {
        return "";
    }
}

function generateCookieKey(): string {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

async function main() {
    console.log("\n🚀 mKit Setup\n");
    console.log("This script will help you configure your mKit MCP server.\n");

    // Check for wrangler
    const wranglerVersion = runCommand("pnpm wrangler --version", true);
    if (!wranglerVersion) {
        console.error("❌ Wrangler CLI not found. Please run 'pnpm install' first.");
        process.exit(1);
    }
    console.log(`✓ Wrangler ${wranglerVersion}\n`);

    const config: Record<string, string> = {};

    // Base URL
    console.log("─── Base Configuration ───\n");
    config.BASE_URL = await prompt(
        "Base URL for your worker (e.g., https://mkit.your-subdomain.workers.dev)",
        "https://mkit.workers.dev"
    );

    config.WIDGET_DOMAIN = await prompt(
        "Widget domain for OpenAI sandbox (optional, press enter to skip)"
    );

    // OAuth Configuration
    console.log("\n─── OAuth Configuration ───\n");

    const configureGoogle = await promptYesNo("Configure Google OAuth?");
    if (configureGoogle) {
        config.GOOGLE_CLIENT_ID = await prompt("Google Client ID");
        config.GOOGLE_CLIENT_SECRET = await promptSecret("Google Client Secret");
    }

    const configureGitHub = await promptYesNo("Configure GitHub OAuth?");
    if (configureGitHub) {
        config.GITHUB_CLIENT_ID = await prompt("GitHub Client ID");
        config.GITHUB_CLIENT_SECRET = await promptSecret("GitHub Client Secret");
    }

    // OAuth Issuer (optional)
    const configureIssuer = await promptYesNo("Configure custom OAuth issuer?", false);
    if (configureIssuer) {
        config.OAUTH_ISSUER = await prompt("OAuth Issuer URL");
        config.OAUTH_JWKS_URI = await prompt("JWKS URI");
    }

    // Stripe Configuration
    console.log("\n─── Stripe Configuration ───\n");

    const configureStripe = await promptYesNo("Configure Stripe for paid tools?");
    if (configureStripe) {
        config.STRIPE_PUBLISHABLE_KEY = await prompt("Stripe Publishable Key (pk_...)");
        config.STRIPE_SECRET_KEY = await promptSecret("Stripe Secret Key (sk_...)");
        config.STRIPE_WEBHOOK_SECRET = await promptSecret("Stripe Webhook Secret (whsec_...)");

        const configurePrices = await promptYesNo("Configure Stripe price IDs?", false);
        if (configurePrices) {
            config.STRIPE_SUBSCRIPTION_PRICE_ID = await prompt("Subscription Price ID (price_...)");
            config.STRIPE_ONETIME_PRICE_ID = await prompt("One-time Price ID (price_...)");
            config.STRIPE_METERED_PRICE_ID = await prompt("Metered Price ID (price_...)");
        }
    }

    // Cookie encryption key
    console.log("\n─── Security ───\n");
    const generateKey = await promptYesNo("Generate a secure cookie encryption key?");
    if (generateKey) {
        config.COOKIE_ENCRYPTION_KEY = generateCookieKey();
        console.log("✓ Generated 32-byte encryption key");
    } else {
        config.COOKIE_ENCRYPTION_KEY = await promptSecret("Cookie Encryption Key (32 bytes hex)");
    }

    // KV Namespace
    console.log("\n─── KV Namespace ───\n");

    const createKV = await promptYesNo("Create KV namespace for OAuth state?");
    if (createKV) {
        console.log("\nCreating KV namespace...");

        try {
            const output = execSync("pnpm wrangler kv namespace create OAUTH_KV", {
                encoding: "utf-8",
            });

            // Parse the namespace ID from output
            const idMatch = output.match(/id\s*=\s*"([^"]+)"/);
            if (idMatch) {
                config.OAUTH_KV_NAMESPACE_ID = idMatch[1];
                console.log(`✓ Created KV namespace: ${config.OAUTH_KV_NAMESPACE_ID}`);
            }
        } catch (error) {
            console.log("⚠ Could not create KV namespace. You may need to log in with 'pnpm wrangler login' first.");
        }

        // Create preview namespace
        const createPreview = await promptYesNo("Create preview KV namespace for local dev?");
        if (createPreview) {
            try {
                const output = execSync("pnpm wrangler kv namespace create OAUTH_KV --preview", {
                    encoding: "utf-8",
                });

                const idMatch = output.match(/id\s*=\s*"([^"]+)"/);
                if (idMatch) {
                    config.OAUTH_KV_PREVIEW_ID = idMatch[1];
                    console.log(`✓ Created preview KV namespace: ${config.OAUTH_KV_PREVIEW_ID}`);
                }
            } catch {
                console.log("⚠ Could not create preview KV namespace.");
            }
        }
    }

    // Write .env file
    console.log("\n─── Writing Configuration ───\n");

    let envContent = "# mKit Environment Configuration\n# Generated by setup script\n\n";

    for (const [key, value] of Object.entries(config)) {
        if (value && key !== "OAUTH_KV_NAMESPACE_ID" && key !== "OAUTH_KV_PREVIEW_ID") {
            envContent += `${key}=${value}\n`;
        }
    }

    const envPath = ".env";
    const envExists = existsSync(envPath);

    if (envExists) {
        const overwrite = await promptYesNo(".env already exists. Overwrite?", false);
        if (!overwrite) {
            console.log("Skipping .env write. Here's what would have been written:\n");
            console.log(envContent);
        } else {
            writeFileSync(envPath, envContent);
            console.log("✓ Wrote .env");
        }
    } else {
        writeFileSync(envPath, envContent);
        console.log("✓ Created .env");
    }

    // Update wrangler.jsonc with KV namespace IDs
    if (config.OAUTH_KV_NAMESPACE_ID) {
        const wranglerPath = "wrangler.jsonc";
        if (existsSync(wranglerPath)) {
            let wranglerContent = readFileSync(wranglerPath, "utf-8");

            wranglerContent = wranglerContent.replace(
                /"id":\s*"<YOUR_KV_NAMESPACE_ID>"/,
                `"id": "${config.OAUTH_KV_NAMESPACE_ID}"`
            );

            if (config.OAUTH_KV_PREVIEW_ID) {
                wranglerContent = wranglerContent.replace(
                    /"preview_id":\s*"<YOUR_PREVIEW_KV_NAMESPACE_ID>"/,
                    `"preview_id": "${config.OAUTH_KV_PREVIEW_ID}"`
                );
            }

            writeFileSync(wranglerPath, wranglerContent);
            console.log("✓ Updated wrangler.jsonc with KV namespace IDs");
        }
    }

    console.log("\n─── Setup Complete ───\n");
    console.log("Next steps:");
    console.log("  1. Review .env and wrangler.jsonc");
    console.log("  2. Run 'pnpm dev' to start local development");
    console.log("  3. Run 'pnpm build-deploy' to deploy to Cloudflare\n");

    rl.close();
}

main().catch((error) => {
    console.error("Setup failed:", error);
    rl.close();
    process.exit(1);
});
