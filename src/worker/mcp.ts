/**
 * MCP Server with Stripe payment integration
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  experimental_PaidMcpAgent as PaidMcpAgent,
  type PaymentProps,
  type PaymentState,
} from "@stripe/agent-toolkit/cloudflare";
import { registerFreeTools, registerPaidTools } from "../tools/index.js";
import type { Env } from "./env.js";
import { routesManifest } from "./routesManifest.generated.js";

const DEFAULT_RESOURCE_META = {
  "openai/widgetCSP": {
    connect_domains: [] as string[],
    resource_domains: [] as string[],
  },
  "openai/widgetDomain": undefined as string | undefined,
};

/**
 * Auth props from OAuth flow
 */
export type AuthProps = PaymentProps & {
  login: string;
  name: string;
  email: string;
  accessToken: string;
};

/**
 * Main MCP server Durable Object with Stripe payment support
 */
export class BoilerplateMCP extends PaidMcpAgent<Env, PaymentState, AuthProps> {
  server = new McpServer({
    name: "mKit",
    version: "1.0.0",
  });

  async init() {
    const baseUrl = this.env.BASE_URL;

    if (baseUrl) {
      DEFAULT_RESOURCE_META["openai/widgetCSP"].resource_domains.push(baseUrl);
    } else {
      console.error("BASE_URL is not defined. Set BASE_URL in your environment.");
    }

    if (this.env.WIDGET_DOMAIN) {
      DEFAULT_RESOURCE_META["openai/widgetDomain"] = this.env.WIDGET_DOMAIN;
    } else {
      delete DEFAULT_RESOURCE_META["openai/widgetDomain"];
    }

    // Register UI resources from manifest
    for (const [, routeInfo] of Object.entries(routesManifest)) {
      const resourceUri = `ui://widget/${routeInfo.resourceURI}`;

      this.server.registerResource(
        routeInfo.resourceName,
        `ui://widget/${routeInfo.resourceURI}`,
        {},
        async () => {
          const response = await this.env.ASSETS.fetch(
            new Request(`http://localhost${routeInfo.originalUrlPath}`)
          );
          const html = await response.text();

          return {
            contents: [
              {
                uri: resourceUri,
                mimeType: "text/html+skybridge",
                text: html,
                _meta: DEFAULT_RESOURCE_META,
              },
            ],
          };
        }
      );
    }

    // Register free tools (no payment required)
    registerFreeTools(this.server, this.env, routesManifest);

    // Register paid tools (Stripe integration)
    registerPaidTools(this, this.env);
  }
}
