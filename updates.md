
Help me get started building on Stripe. Here's my context:

Business: www.mcbridetechservices.com
Description: Provide IT and Engineering Services for startups, non profits, and solo creators. 
Stripe products I need: Payments, Invoicing, Tax

---

Follow these steps in order. The Stripe plugin is the preferred method — only use alternatives if installation fails.

1. Install the Stripe plugin:
  - claude plugin install stripe@claude-plugins-official
  - If the plugin installed but tools aren't available, run /reload-plugins or start a new session.
2. Connect to the Stripe MCP server:
  - Add https://mcp.stripe.com as an MCP server and authenticate when prompted (https://docs.stripe.com/mcp.md).
  - Confirm stripe_implementation_planner is available. If not, reload your tools or start a new session.
3. Generate my integration plan:
  - Use the stripe_implementation_planner tool with my business context to generate a tailored, best-practices Stripe integration plan for my use case.
  - Only if stripe_implementation_planner is still unavailable after steps 1 and 2, fall back to: npx skills add https://docs.stripe.com

Then help me build a Stripe integration using my API keys. If I already have an integration, review it against the plan and suggest improvements.