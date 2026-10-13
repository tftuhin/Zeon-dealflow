# Zeon DealBridge — Investment Banking Workspace

An interactive, client-side Next.js prototype for exploring a proposed investment-banking dealflow workflow. All company, investor, task, and opportunity records are fictional sample data. This is not an operational system and does not contact real people.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

For detailed AI-agent continuation context, product constraints, interaction behavior, and implementation notes, read [`AGENTS.md`](./AGENTS.md).

## Prototype areas

- **Attio-style Kanban Boards**: Interactive multi-column boards with drag-and-drop, financial column aggregate sums ($M), quick stage shifters, and segmented Board/Table switchers across Deals Pipeline, Ongoing Deals, Inbound Leads, Tasks, and Investor Network
- Overview dashboard with executive stage funnel and live deal volume distribution
- Click-through investor profiles with the highest-fit sample business; seller profiles with ranked investor matches
- Expanded detail profiles with communications logs, document registers, and related investor/business matches
- Seller readiness checklist and milestone timeline
- Anonymous teaser preview, dual seller/banker approval for simulated outreach, and non-binding early-term capture
- Separate Zeon principal-investment screening with explicit human decision controls
- After-close checklist and permission-based follow-ups
- Task creation, assignment, due dates, and completion tracking

Changes are held in browser state and best-effort local storage. Outreach, term collection, disclosure authorization, and decision actions are simulated only. No confidential identity is revealed; no email, message, or real investment decision is made. Scores, workflows, and timing are illustrative hypotheses that require validation.
