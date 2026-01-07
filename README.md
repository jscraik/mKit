# MCP Boilerplate

> A reusable Cloudflare Workers MCP server template with OAuth, Stripe, and OpenAI Apps SDK integration. Designed to be cloned or copied as a starting point for new projects.

A comprehensive template with:
- **OAuth 2.1 authentication** (Google/GitHub + Apps SDK compliance)
- **Stripe monetization** (subscription, one-time, metered billing)
- **OpenAI Apps SDK integration** (React UI widgets + streaming HTTP)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Quick Start

```bash
# Clone this repository
git clone https://github.com/your-username/mcp-boilerplate.git my-project
cd my-project

# Or copy to an existing project
cp -r /path/to/mcp-boilerplate/* /path/to/my-project/

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Create KV namespace
pnpm wrangler kv namespace create OAUTH_KV

# Update wrangler.jsonc with the namespace ID and your account_id

# Deploy
pnpm build-deploy
```

## Features

| Feature | Description |
|---------|-------------|
| **Hybrid Authentication** | Google/GitHub OAuth for web UI + Apps SDK OAuth 2.1 compliance for ChatGPT |
| **Stripe Monetization** | Three payment models: subscription, one-time, and metered/usage-based |
| **Streaming HTTP** | `/mcp` endpoint using Apps SDK's preferred transport |
| **Auto-Discovery UI** | Vite plugin auto-registers React widgets from `src/app/routes/*.html` |
| **Mixed Auth** | Per-tool security (public tools, OAuth-protected tools) |
| **Payment Webhooks** | Stripe webhook handling for subscription/payment events |

## Architecture

```
src/
├── worker/              # MCP server + HTTP routing
│   ├── index.ts         # Main worker entry point
│   ├── mcp.ts           # MCP server with Stripe integration
│   ├── routes.ts        # HTTP router (/mcp, /auth/*, /webhooks/*)
│   └── env.ts           # Environment types
├── auth/                # Authentication providers
│   ├── apps-sdk-oauth.ts    # OAuth 2.1 compliance (metadata, token verification)
│   ├── google-handler.ts    # Google OAuth flow
│   ├── github-handler.ts    # GitHub OAuth flow
│   └── workers-oauth-utils.ts # Approval dialogs, cookie signing
├── billing/             # Stripe integration
│   ├── stripe.ts        # Stripe client + checkout
│   ├── entitlements.ts  # Entitlement status checks
│   └── webhooks.ts      # Webhook handler
├── tools/               # MCP tools
│   ├── free/            # Public tools (no auth/payment)
│   └── paid/            # Monetized tools (Stripe checkout)
├── app/                 # Vite React UI
│   ├── routes/          # Auto-discovered widget pages
│   ├── components/      # React components
│   └── openai/          # Apps SDK hooks + types
├── plugins/             # Vite plugins
│   └── routesManifest.ts # Auto-discovers routes, generates manifest
└── tests/               # Tests
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [pnpm](https://pnpm.io/installation)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/mcp-boilerplate.git
cd mcp-boilerplate

# Install dependencies
pnpm install
```

### Environment Configuration

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Configure the required environment variables:

```bash
# Base URLs
BASE_URL=https://your-worker.workers.dev
WIDGET_DOMAIN=https://your-widget-domain.com

# OAuth 2.1 (for Apps SDK compliance)
OAUTH_ISSUER=https://auth.example.com
OAUTH_JWKS_URI=https://auth.example.com/.well-known/jwks.json

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Cookie encryption (generate 32 random bytes as hex)
COOKIE_ENCRYPTION_KEY=$(openssl rand -hex 32)

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SUBSCRIPTION_PRICE_ID=price_...
STRIPE_ONETIME_PRICE_ID=price_...
STRIPE_METERED_PRICE_ID=price_...
```

### Cloudflare Setup

1. **Create a KV namespace:**
   ```bash
   wrangler kv namespace create OAUTH_KV
   ```

2. **Update `wrangler.jsonc`:**
   Replace `OAUTH_KV_NAMESPACE_ID` with the ID from the previous command.

3. **Deploy to Cloudflare:**
   ```bash
   pnpm build-deploy
   ```

Your MCP endpoint will be available at `https://your-worker.workers.dev/mcp`.

## Development

### Local Development

```bash
# Start Vite dev server (for UI development)
pnpm dev

# Start Wrangler dev server (for Worker development)
pnpm dev:worker
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch
```

## How It Works

### 1. OAuth 2.1 Compliance

The template implements OAuth 2.1 protected resource metadata at `/.well-known/oauth-protected-resource`:

```json
{
  "resource": "https://your-worker.workers.dev",
  "authorization_servers": ["https://auth.example.com"],
  "scopes_supported": ["read", "write"],
  "bearer_methods": ["header"]
}
```

### 2. Mixed Authentication

Tools can declare their authentication requirements:

```typescript
// Free tool (no auth)
server.registerTool("public_tool", { ... });

// Protected tool (OAuth required)
server.registerTool("protected_tool", {
  securitySchemes: [{ type: "oauth2", scopes: ["read"] }],
  ...
});
```

### 3. Stripe Monetization

Three payment models are supported:

**Subscription:**
```typescript
agent.paidTool("subscription_feature", {
  checkout: {
    mode: "subscription",
    line_items: [{ price: env.STRIPE_SUBSCRIPTION_PRICE_ID, quantity: 1 }],
  },
});
```

**One-time:**
```typescript
agent.paidTool("onetime_feature", {
  checkout: {
    mode: "payment",
    line_items: [{ price: env.STRIPE_ONETIME_PRICE_ID, quantity: 1 }],
  },
});
```

**Metered:**
```typescript
agent.paidTool("metered_feature", {
  checkout: { mode: "subscription" },
  meterEvent: "api_call",
});
```

### 4. Auto-Discovery UI

Create a new widget by adding an HTML file to `src/app/routes/`:

```html
<!doctype html>
<html lang="en">
  <body>
    <div id="root"></div>
    <script type="module" src="../components/MyWidget.tsx"></script>
  </body>
</html>
```

The Vite plugin automatically:
1. Discovers the route
2. Generates a content hash for cache busting
3. Updates the manifest
4. Registers it as an MCP resource

## Adding a New Tool

### Free Tool (No Payment)

Create `src/tools/free/my-tool.ts`:

```typescript
import { z } from "zod";

export function registerMyTool(server: McpServer, env: Env) {
  server.registerTool(
    "my_tool",
    {
      title: "My Tool",
      description: "A free tool anyone can use",
      inputSchema: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
    async ({ message }) => ({
      content: [{ type: "text", text: `You said: ${message}` }],
    })
  );
}
```

Register it in `src/tools/index.ts`:

```typescript
import { registerMyTool } from "./free/my-tool.js";

export function registerFreeTools(server: McpServer, env: Env) {
  registerMyTool(server, env);
}
```

### Paid Tool (Stripe Checkout)

Create `src/tools/paid/my-paid-tool.ts`:

```typescript
import { z } from "zod";

export function registerPaidTool(agent: PaidMcpAgent<Env>, env: Env) {
  agent.paidTool(
    "my_paid_tool",
    "A premium feature requiring payment",
    { input: z.string() },
    async ({ input }) => ({
      content: [{ type: "text", text: `Premium result: ${input}` }],
    }),
    {
      checkout: {
        mode: "subscription",
        line_items: [{ price: env.STRIPE_SUBSCRIPTION_PRICE_ID }],
      },
    }
  );
}
```

## Deployment

### Production Build

```bash
pnpm build
pnpm deploy
```

### Continuous Deployment

Connect your repository to Cloudflare Pages or GitHub Actions for automatic deployments.

## Testing with ChatGPT

1. Deploy your worker
2. Copy your MCP endpoint: `https://your-worker.workers.dev/mcp`
3. In ChatGPT Developer Mode, add a new MCP server
4. Paste the endpoint
5. Test your tools!

## Stripe Webhooks

For payment processing to work, configure the Stripe webhook:

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-worker.workers.dev/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.*`
   - `invoice.payment_*`
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

## License

MIT

## Links

- [OpenAI Apps SDK Docs](https://developers.openai.com/apps-sdk/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [MCP Specification](https://modelcontextprotocol.io)
- [Stripe API](https://stripe.com/docs/api)
