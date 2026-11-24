<p align="center">
  <img src="./brand/mKit-brand-logo.png" alt="mKit" height="160" />
</p>

# mKit — MCP Server Boilerplate for Cloudflare Workers

This repository is a boilerplate for bootstrapping MCP servers on Cloudflare Workers with OAuth 2.1, Stripe billing, and OpenAI Apps SDK UI integration.

The included `hello-world` tool accepts an optional name. Its expected response is:

```text
Tool: hello-world
Input: {"name":"Jamie"}
Text response: Hello Jamie!
```

This example comes from the [tool handler](src/tools/free/hello-world.ts); it is not a recording of a deployed service.

## Quickstart

Use **Node.js 22.12.0 or newer on the 22.x line, or Node.js 24+**, pnpm, and Git. These versions meet the locked Vite and Vitest engine requirements. Wrangler is a project dependency and is invoked through pnpm.

### 1) Get the project

```sh
git clone https://github.com/jscraik/mKit.git
cd mKit
pnpm install
```

### 2) Configure your development environment

The setup script prompts for OAuth credentials, optional Stripe settings, and a cookie encryption key. It writes `.env` and updates `wrangler.jsonc`. If you choose to create KV namespaces, it also provisions resources in your Cloudflare account; authenticate with `pnpm wrangler login` before choosing that option.

```sh
pnpm run setup
```

Use `pnpm run setup` to invoke this repository's script. `pnpm setup` is pnpm's own environment-setup command.

Review the resulting `.env` and KV bindings before starting the worker. See [configuration](docs/configuration.md) for the required values and [local development](docs/development.md) for manual configuration. OAuth provider credentials are needed for login; Stripe credentials are needed for payment features.

### 3) Run locally

From the `mKit` checkout, start the UI:

```sh
pnpm dev
```

In a second terminal, change to the same `mKit` directory and start the worker:

```sh
pnpm dev:worker
```

### 4) Verify

Open the local URL printed by Vite. Confirm that both terminals start without errors, then connect an MCP client to `/mcp` on the worker URL printed by Wrangler. List the available tools and call `hello-world` with `{"name":"Jamie"}`. A successful call returns the text `Hello Jamie!` from the example above.

An HTTP response alone does not prove that an MCP tool works: confirm the tool list and the successful call. If configuration or authentication blocks that step, use [Troubleshooting](#troubleshooting).

Next: [add a tool](#create-a-new-tool-to-expose-mcp-functionality), [add a widget](#add-a-new-widget-page-for-the-apps-sdk-ui), or follow the [deployment guide](docs/deployment.md).

## Table of contents

- [Quickstart](#quickstart)
- [Common tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Risks and assumptions](#risks-and-assumptions)
- [Doc requirements](#doc-requirements)
- [Acceptance criteria](#acceptance-criteria)
- [Evidence bundle](#evidence-bundle)
- [Reference](#reference)

## Common tasks

### Create a new tool to expose MCP functionality

- What you get: A new MCP tool registered at server startup.
- Steps:

```sh
# Add a new file under src/tools/free/ or src/tools/paid/
```

- Verify: The tool is registered in the server startup logs.

### Add a new widget page for the Apps SDK UI

- What you get: A new auto-discovered widget route.
- Steps:

```sh
# Add an HTML file in src/app/routes/ and a React component in src/app/components/
```

- Verify: The route is present in the generated manifest at build time.

### Build and deploy to Cloudflare

- What you get: A live MCP endpoint at your worker URL.
- Steps:

```sh
pnpm build-deploy
```

- Verify: `pnpm wrangler deploy` reports success and the worker URL responds.

### Run quality checks

- What you get: Type safety and test validation.
- Steps:

```sh
pnpm typecheck
pnpm lint
pnpm test
```

- Verify: Each command exits with status 0.

## Troubleshooting

### Symptom: `wrangler dev` fails with missing KV namespace

Cause: `wrangler.jsonc` has placeholder KV IDs.
Fix:

```sh
pnpm wrangler kv namespace create OAUTH_KV
```

Update `wrangler.jsonc` with the real IDs and retry.

### Symptom: OAuth login fails or tokens are rejected

Cause: OAuth issuer or JWKS URL is incorrect.
Fix: Re-check `OAUTH_ISSUER` and `OAUTH_JWKS_URI` in `.env`.

### Symptom: Stripe webhooks are rejected

Cause: Webhook signing secret does not match Stripe configuration.
Fix: Update `STRIPE_WEBHOOK_SECRET` with the value from Stripe dashboard.

## Contributing

Use the checkout from [Quickstart](#quickstart), then run `pnpm typecheck`, `pnpm lint`, and `pnpm test` from its root. See [CONTRIBUTING.md](CONTRIBUTING.md) for review requirements and [CODESTYLE.md](CODESTYLE.md) for style guidance.

## Risks and assumptions

- Assumptions: You control the Cloudflare account and any OAuth or Stripe accounts used by the features you enable.
- Risks / blast radius: Misconfigured secrets or webhook signing can cause auth/payment failures.
- Rollback / recovery: Rotate secrets and redeploy; disable affected routes until fixed.

## Doc requirements

Last updated: 2026-11-24
Owner: TBD (set maintainer/team)
Review cadence: Quarterly (confirm)

- Audience tier: Beginner to intermediate
- Scope: Using this repo as a template to configure, run, and deploy an MCP server
- Non-scope: OAuth provider setup details, Stripe account setup, and product-specific UI design
- Required approvals: Maintainer approval for production changes (confirm)

## Acceptance criteria

- [ ] `.env` created from `.env.example` with valid values.
- [ ] KV namespace IDs set in `wrangler.jsonc`.
- [ ] Local dev runs without startup errors.
- [ ] At least one tool is registered and callable.
- [ ] Deployment succeeds in Cloudflare.
- [ ] Troubleshooting steps are validated by maintainers.

## Evidence bundle

- Lint outputs (Vale/markdownlint/link check): Not run (no configs found).
- Brand check output: Not run (no brand check script found).
- Readability output (if available): Not run (no readability script found).
- Checklist snapshot: Pending maintainer confirmation.

## Reference

- Project layout: `src/worker`, `src/auth`, `src/billing`, `src/tools`, `src/app`
- Commands: `pnpm run setup`, `pnpm dev`, `pnpm dev:worker`, `pnpm build`, `pnpm deploy`, `pnpm test`, `pnpm lint`
- Related docs: `docs/architecture.md`, `docs/development.md`, `docs/deployment.md`, `docs/configuration.md`, `docs/runbook.md`

The managed workflow below is for the maintainer's configured workstation. Its absolute paths refer to that environment; public contributors should use [Contributing](#contributing) above. Maintainer verification and PR requirements still apply before merge.

<!-- AGENT-FIRST-WORKFLOW:START -->
## Agent-first workflow

1. Create/update implementation plan using `.agent/PLANS.md` contract.
2. Validate plan graph:

```bash
python3 /Users/jamiecraik/.codex/scripts/plan-graph-lint.py .agent/PLANS.md
```

3. Run canonical verification:

```bash
/Users/jamiecraik/.codex/scripts/verify-work.sh
```

4. Follow global scaffold policy:

- `/Users/jamiecraik/.codex/instructions/agent-first-scaffold-spec.md`
<!-- AGENT-FIRST-WORKFLOW:END -->
