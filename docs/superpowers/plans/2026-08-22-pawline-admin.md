# Pawline Pet Store and Clinic Admin Implementation Plan

> **For agentic workers:** Implement this plan task-by-task in the existing repository, keeping each task independently testable.

**Goal:** Reimplement the selected SvelteKit pet health site as a simple, user-focused Pawline operator dashboard for orders, customers, bills, products, inventory, and lightweight analytics.

**Architecture:** Keep the existing SvelteKit/Svelte 5/Tailwind structure. Consolidate demo entities and formatting helpers in typed modules, create a shared shell and reusable UI primitives, then make the overview, orders, customers, products, and analytics pages consume those fixtures through local derived state. Preserve existing Supabase/auth files but keep the primary demo paths network-independent.

**Tech Stack:** Svelte 5, SvelteKit 2, TypeScript, Tailwind CSS, existing ESLint/Prettier/svelte-check toolchain, SVG/CSS charts without new chart dependencies.

**Spec:** `docs/superpowers/specs/2026-08-22-pawline-admin-design.md`

## Global Constraints

- Preserve the existing SvelteKit project and route conventions.
- Keep primary demo paths usable without Supabase or Firebase credentials.
- Use Vietnamese dong formatting with `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`.
- Keep interactions visible and functional; avoid decorative dead buttons.
- Do not add checkout, payment processing, appointments, medical records, staff roles, or schema migrations in this pass.
- Pass `npm run validate` and `npm run build` before the final commit.

---

### Task 1: Add typed demo domain data and shared utilities

**Files:**

- Create: `src/lib/data/pawline.ts`
- Create: `src/lib/utils/format.ts`
- Modify: `src/lib/index.ts`

**Interfaces:**

- `Customer`, `Pet`, `Order`, `Product`, and `RevenuePoint` types.
- `customers`, `pets`, `orders`, `products`, and `revenueByPeriod` fixture exports.
- `formatCurrency(value: number): string` and `formatDate(value: string): string`.

- [ ] Define the five entity types and the revenue point type exactly as described in the spec.
- [ ] Add 6 fictional customers, 8 fictional pets, 8 orders, 10 products, and 7 revenue points for a current period.
- [ ] Use stable string IDs and cross-reference `customerId` values consistently.
- [ ] Export formatting helpers from `src/lib/index.ts` without removing existing exports.
- [ ] Run `npm run check` and confirm the new modules type-check.

### Task 2: Build the Pawline application shell and navigation

**Files:**

- Modify: `src/routes/+layout.svelte`
- Modify: `src/app.css`
- Modify: `src/lib/components/Navbar.svelte` or replace it with `src/lib/components/AppShell.svelte`
- Create: `src/lib/components/StatusBadge.svelte`
- Create: `src/lib/components/MetricCard.svelte`

**Interfaces:**

- `AppShell` accepts a slot and renders responsive navigation for Overview, Orders, Customers, Products, and Analytics.
- `StatusBadge` accepts `label: string` and `tone: 'positive' | 'attention' | 'danger' | 'neutral'`.
- `MetricCard` accepts `label`, `value`, `detail`, and `tone` strings.

- [ ] Replace the current generic navigation with a Pawline sidebar/top bar that uses real route links.
- [ ] Add active-link styling based on the current page URL.
- [ ] Add mobile-safe collapse behavior using a local toggle and accessible button label.
- [ ] Set the global canvas, typography, focus styles, table surfaces, and color tokens in `src/app.css`.
- [ ] Render a small staff identity chip and a global search affordance without introducing dead interactions.
- [ ] Run `npm run check` and inspect the shell route in the browser.

### Task 3: Implement the overview dashboard

**Files:**

- Modify: `src/routes/dashboard/+page.svelte`
- Modify: `src/routes/+page.svelte`
- Create: `src/lib/components/RevenueChart.svelte`
- Create: `src/lib/components/OrderRow.svelte`

**Interfaces:**

- `RevenueChart` accepts `points: RevenuePoint[]` and renders labeled SVG bars/line segments with text labels.
- `OrderRow` accepts an `Order` and exposes a link to `/orders/{id}`.

- [ ] Make `/` redirect or navigate to `/dashboard` using the existing SvelteKit route pattern.
- [ ] Add four metrics: revenue, orders, outstanding bills, and low-stock products.
- [ ] Add the revenue chart using fixture data and visible labels.
- [ ] Add a recent orders panel with customer, pet, total, date, and payment/fulfillment status.
- [ ] Add a low-stock alert list with product and stock count.
- [ ] Add at least one visible call-to-action that navigates to `/orders/new` or `/orders` and one that navigates to `/products`.
- [ ] Run `npm run check` and verify dashboard navigation in the browser.

### Task 4: Implement orders and bill management

**Files:**

- Create: `src/routes/orders/+page.svelte`
- Create: `src/routes/orders/[id]/+page.svelte`
- Create: `src/routes/orders/new/+page.svelte`
- Modify: `src/routes/bills/+page.svelte`
- Create: `src/lib/components/OrderFilters.svelte`

**Interfaces:**

- `OrderFilters` accepts `orders: Order[]` and dispatches local search/status changes through component state.
- `/orders/[id]` resolves the route ID against the fixture `orders` array and shows a not-found state if absent.

- [ ] Create a searchable, status-filterable orders table with amount, customer/pet, date, payment state, fulfillment state, and row links.
- [ ] Create an order detail page with line items, subtotal/total, customer and pet context, and clear status badges.
- [ ] Add a draft order form with customer, pet, product, quantity, and payment status fields.
- [ ] On submit, show a visible success confirmation and append the draft to local page state without network calls.
- [ ] Rework `/bills` into a compatible bill view that reuses the same order/billing language and links to order details.
- [ ] Run `npm run check` and manually test search, filter, detail, and draft form flows.

### Task 5: Implement customers, pets, and products/inventory

**Files:**

- Modify: `src/routes/customers/+page.svelte`
- Modify: `src/routes/customers/[id]/+page.svelte`
- Modify: `src/routes/pets/+page.svelte`
- Modify: `src/routes/pets/[id]/+page.svelte`
- Create: `src/routes/products/+page.svelte`
- Create: `src/lib/components/EntityTable.svelte`

**Interfaces:**

- `EntityTable` accepts `headers`, `rows`, and a slot for row rendering; if generic typing becomes noisy, use focused local markup instead of weakening entity types.

- [ ] Replace customer and pet pages with searchable tables that show practical operator fields and contextual empty states.
- [ ] Make customer detail show contact data, linked pets, total spend, and recent order history.
- [ ] Make pet detail show owner, species/breed, age, last visit, and care note.
- [ ] Add `/products` with product search, category filter, stock count, reorder threshold, SKU, and stock status.
- [ ] Add a clear low-stock callout and a disabled-but-labeled “Restock” control only if the UI explains that persistence is deferred; otherwise use a working “View product” action.
- [ ] Run `npm run check` and manually test table links and filters.

### Task 6: Implement analytics and remove conflicting legacy presentation

**Files:**

- Modify: `src/routes/statistics/+page.svelte`
- Modify: `src/routes/+layout.svelte` as needed for route-wide metadata
- Modify: `README.md`
- Modify: `CODE_QUALITY.md` only if the transition guidance needs a concise update

**Interfaces:**

- Analytics page derives period-specific cards from `revenueByPeriod` and renders the same `RevenueChart` component.

- [ ] Add period controls for 7 days, 30 days, and quarter using local fixture series.
- [ ] Show revenue, order count, average order value, top product, and repeat customer signal.
- [ ] Add a compact “what changed” explanation so the page answers the operator’s question rather than only showing numbers.
- [ ] Update README with Pawline purpose, local setup, routes, and validation commands.
- [ ] Preserve useful transition notes while removing starter-level copy that no longer describes the application.
- [ ] Run `npm run format:check` and fix all formatting issues.

### Task 7: Verify, refine, and commit

**Files:**

- Modify: any files needed to address validation or browser findings
- Create: `docs/verification.md`

**Interfaces:**

- Verification notes list commands run, routes checked, and known deferred backend work.

- [ ] Run `npm install` if dependencies are not present.
- [ ] Run `npm run validate`; fix lint, formatting, and type errors.
- [ ] Run `npm run build`; fix production build errors.
- [ ] Start `npm run dev -- --host 0.0.0.0` on a test port and check Overview, Orders, an order detail, Customers, Products, and Analytics in the browser.
- [ ] Check mobile-width behavior and keyboard focus on navigation and forms.
- [ ] Write concise verification notes to `docs/verification.md`.
- [ ] Review `git diff`, stage all intended files, and commit with `feat: reimagine pethealth as pawline admin`.
- [ ] Confirm the current branch is `dev` and show the final commit hash and local test URL.
