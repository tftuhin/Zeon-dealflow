# AI Agent Project Context — Zeon DealBridge

> Read this file before making code changes. It records the user’s product decisions, the current interaction model, implementation boundaries, and known environment pitfalls. Update it when the architecture or user-approved requirements change.

## 1. Product identity and purpose

- **Application name:** Zeon DealBridge
- **Subtitle:** Investment Banking Workspace
- **Product concept:** An interactive prototype of a dealflow workspace for an investment-banking team: seller sourcing and readiness, investor relationships, suggested matching, confidential outreach controls, early-term capture, separate principal investing, closeout, and follow-ups.
- Keep the application **generic and Zeon-branded**. The user explicitly said not to include a specific client name such as Nfluence. Do not reintroduce client-specific branding, workspace labels, sample copy, or documentation.
- The app is a **proposal/demo**, not a representation of verified internal procedures. The users’ desired style is practical and understandable to non-finance readers. Label demo records, sample metrics, match rules, timings, and workflows as illustrative where relevant.

## 2. Current user-approved interaction model

### Record cards, quick drawers, and full detail pages

1. Clicking a seller row/lead card opens a **seller quick-view side drawer**.
2. Clicking an investor card opens an **investor quick-view side drawer**. The investor cards have a full-card button hit target; preserve this, since the user previously reported that the cards did not respond.
3. Each quick-view drawer has a button labeled **“Detail profile”**.
4. Clicking **Detail profile** opens a **full detail page inside the main workspace content** (not another overlay or side popup). The workspace sidebar/top bar remain; the underlying workspace view is replaced while the detail page is active.
5. The detail page has a return button to the view from which it was opened. Related matches can navigate to another full detail page.
6. A seller’s detail page must include matching investors. An investor’s detail page must include matching businesses/sellers. Investor detail opened from a particular seller match should keep that seller selected as the comparison business.

The full detail view is currently **state-driven within the single `/` page**, not a distinct URL or new browser tab. Do not accidentally change it back into an overlay. If the user later explicitly asks for bookmarkable routes or browser-back support, implement real routes deliberately and preserve the local demo data/state behavior.

### Detail-page tabs and behaviors

Both seller and investor detail pages contain:
- **Overview:** identity, sample record facts, and a demo/human-review notice.
- **Communications:** fictional example timeline entries plus an “Add log” composer. Saving creates a local demo log only; it must not send an email, message, or call.
- **Documents:** fictional sample document metadata plus an optional local file picker. Selecting a file records its filename/size in local component state only. No file is uploaded, stored, or shared. Keep that limitation clearly stated.
- **Matches:** seller page = ranked investors; investor page = ranked businesses/sellers. Clicking a match opens that related record’s full detail page.

Quick drawers remain useful summaries with stage/profile context and matches. Their Detail profile buttons open the full page via the `openDetailProfile` handler.

## 3. Safeguards and non-negotiable product boundaries

- All seller, investor, task, communication, and document examples are **fictional sample data**. The prototype is not connected to a real company, CRM, investor database, email, or document repository.
- Never imply the prototype has contacted a real investor. Blind outreach is simulated only and requires both seller approval of the anonymous summary and banker approval of the recipient list/outreach.
- Confidential identity disclosure has separate human gates: confidentiality-agreement verification and seller approval. The demo must not reveal identities through its disclosure action.
- Seller fit scores and investor/business match scores are **suggestions**, not final evaluation or approval. Keep human review explicit.
- Zeon principal-investment work must stay distinct from client advisory/fundraising; investment decisions are made by people, not an automated score.
- Early terms are non-binding demo records and require human review.
- Uploaded-document UI is a local prototype only. Do not imply file transfer, secure storage, or real document-room access.
- Communication logs are not actual sent communications.
- Do not claim that metrics, SLAs, workflow steps, decision rules, or bottlenecks are verified operating practices. Treat them as illustrative proposals requiring validation.

## 4. Current stack, commands, and hosting

- Next.js App Router, React client page, JavaScript, plain CSS, and `lucide-react` icons.
- Exact project dependencies/scripts are in `package.json`; lockfile is `package-lock.json`.
- Start locally:
  ```bash
  npm install
  npm run dev
  ```
- Production compile check:
  ```bash
  npm run build
  ```
- Dev and production servers bind to `0.0.0.0` via the package scripts. Preserve this for Arena previews.
- `node_modules` and `.next` are excluded from workspace snapshots and may be absent in a later session. If `next: not found`, run `npm install` before starting the server.
- `next.config.mjs` includes `allowedDevOrigins: ['*.e2b.app']`. **Keep the wildcard.** Arena preview subdomains change between sessions/restarts; a fixed preview hostname previously caused Next.js to block HMR requests and made the live preview appear broken.
- Google Fonts are not imported. The sandboxed preview cannot rely on external network fonts; keep local/system fallbacks.
- Last known checks before this context file was added: `npm run build` passed and the dev server returned HTTP 200 at `/`. Browser automation/screenshot-level interaction testing has not been available; don’t claim it was performed.

## 5. File map

- `app/page.js` — all seed records, state, view navigation, seller/investor cards, quick drawers, full detail page, workflow views, forms, and demo interactions. It is a large client component marked `'use client'`.
- `app/globals.css` — all visual styling, responsive rules, drawer/page overlays, card click targets, profile tabs, communications/documents panels, etc. Styles are mostly compact/minified blocks; append targeted rules carefully and avoid accidentally overriding existing responsive styles.
- `app/layout.js` — document shell and browser metadata. Current title: `Zeon DealBridge | Investment Banking Workspace`.
- `next.config.mjs` — React strict mode and Arena preview origin allowance.
- `package.json` / `package-lock.json` — dependency and script manifests.
- `README.md` — short project overview and run guide.
- `AGENTS.md` — this detailed continuation guide.

Historical workflow artifacts may exist elsewhere in `/home/user` from earlier work. Do not edit those or the earlier PDF unless the user explicitly asks. The branded application must remain client-name-neutral.

## 6. Main navigation and current screens

Navigation IDs and screens are defined near the top of `app/page.js`:
- `overview` — sample metrics, stage chart, attention list, recent leads, upcoming tasks.
- `leads` — inbound form submissions triage; research and populate fields, with one-click qualification converting to seller pipeline or investor network.
- `sellers` — searchable/filterable seller pipeline; row selection opens seller quick drawer.
- `investors` — filterable investor cards; any click on a card opens investor quick drawer.
- `matching` — select a seller, view suggested investor matches; matching rules are explanatory demo logic.
- `readiness` — seller preparation checklist and milestone timeline; dates are examples/estimates.
- `blind` — anonymous teaser, seller/banker outreach approvals, disclosure checks, and non-binding early terms; all actions simulated.
- `investments` — separate Zeon principal-investment screening with human decision controls.
- `afterclose` — closeout checklist and permission-based follow-up examples.
- `tasks` — assigned tasks with due dates and completion toggles.

When a full detail page is active, the main content is `DetailProfilePage` rather than the current workspace screen. The app retains the `view` state so the Back button can return to the correct underlying view. Sidebar navigation clears the active detail profile before changing views.

## 7. Data and state architecture

- Seed entities are declared as `seedSellers`, `seedInvestors`, `seedTasks`, and `seedLeads` in `app/page.js`.
- Main mutable state is in `Home`: current view, sellers, investors, tasks, leads, custom fields (`sellerCustomFields`, `investorCustomFields`), connected mail integration (`connectedEmail`), readiness checklists, selected seller/investor, side drawers, full detail profile, dialogs, toasts, blind-outreach approval flags, and early-term records.
- Best-effort localStorage key: `dealflow-prototype-v1`. It persists sellers, investors, tasks, leads, custom fields, connected email configuration, readiness state, and early terms.
- **Custom fields system**: created with a designated target section (e.g., Financials & Performance, Governance, Mandates); once added, the field dynamically appears across all similar profiles with per-entity value persistence.
- **Integrated communications**: allows mailbox configuration (Google Workspace, Microsoft 365, Custom SMTP) and sending templated advisory emails with delivery tracking logged in the communications timeline.
- **Multi-format document register**: supports PDF, DOC/DOCX, PPTX, images, and Excel spreadsheets with in-app preview lightbox and direct download access.
- `getInvestorMatchScore(investor, seller)` is a deliberately simple demo rule: starts at 55, adds 24 for sector overlap, 8 for broad geography compatibility, and 8 for selected Growth/Series B/Series C stage preferences; capped at 97.
- `openInvestor(investor, preferredSellerId)` chooses the highest-scoring seller unless a preferred seller ID is passed. `openDetailProfile(type, record, preferredSellerId)` closes side drawers, preserves/sets seller context, then activates the full main-content profile page.

## 8. UX and responsive design notes

- The shell uses an executive **light green / sage sidebar** (`#edf5f0`, `#d4e4db` border, `#123724` deep spruce typography, and `#198757` forest green active accents), sticky top bar, light workspace background, cards, badges, and clean teal accents. Brand is **Zeon DealBridge**, subtitle **Investment Banking Workspace**.
- All dropdowns (`select`) use a custom, cross-browser branded design system with custom chevron indicators, hover/focus rings, and consistent sizing.
- Seller pipeline table and terms table switch to card-like layouts on small screens; preserve responsive behavior and avoid introducing horizontal scrolling.
- Investor cards are informational cards with an explicit absolute, card-sized transparent `<button>` hit area. This was added after card clicks were reported as nonfunctional. Keep it wired to `onOpenInvestor`; don’t replace it with a decorative-only CTA or a click handler that only sets a toast.
- Quick drawers use a shared `.seller-drawer` style. The full profile page uses `.detail-profile-page`, not `.detail-profile-panel`/`.detail-profile-scrim`. Some legacy overlay CSS may remain; do not reintroduce it as the full-detail presentation.
- Buttons and labels should clearly distinguish simulated actions from real actions. Keep accessible labels and keyboard support where practical.

## 9. Known placeholders / limitations

- No database, backend, authentication, real user management, document upload, email, calendar, or investor-contact integration.
- Report export, settings, parts of custom checklist management, and adding a principal-investment opportunity may remain prototype placeholders.
- Some sample dates, counts, activity notes, and terms are fictional. When touching content, keep them visibly marked as sample/demo.
- Full profile pages are client-state views under `/`, not route-backed detail endpoints.

## 10. Change workflow for future agents

Before editing:
1. Read this file and the relevant section of `app/page.js` / `app/globals.css`.
2. Preserve Zeon branding and all safeguards above.
3. Keep changes client-side unless the user explicitly requests persistence/integrations.

After editing:
1. Run `npm run build`.
2. If preview changes aren’t visible, check that the dev process is running and inspect its logs for `Blocked cross-origin request`; retain `allowedDevOrigins: ['*.e2b.app']`.
3. Test the root response with `curl -fsS http://127.0.0.1:3000/` where possible; remember this verifies only the HTTP shell, not real browser interactions.
4. Update this file and `README.md` if the user-approved architecture or interaction flow changes.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
