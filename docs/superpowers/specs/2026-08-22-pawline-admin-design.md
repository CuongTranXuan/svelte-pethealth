# Pawline Pet Store and Clinic Admin Design

**Status:** Approved for implementation

## Goal

Give a small pet store and clinic operator one calm workspace to understand today’s business, find customers and pets quickly, manage orders and bills, monitor products, and review simple revenue trends without navigating a dense enterprise system.

## Product direction

The existing repository is a SvelteKit application midway through a Vue-to-Svelte transition. The new experience will keep SvelteKit and the existing route family, but present a coherent product surface named **Pawline**. The first implementation is demo-data driven to make the UI testable without requiring database credentials or schema migrations. Existing Supabase integration seams remain available for a later data pass.

The product is intentionally narrower than a full veterinary practice suite. It covers overview, orders and bills, customers and pets, products and inventory, and analytics. Appointments, payments, checkout, medical records, staff administration, and multi-branch support are explicitly deferred.

## Information architecture

| Area                 | Primary user goal                    | Key interactions                                                                          |
| -------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------- |
| Overview             | Know what needs attention today      | View KPI cards, recent orders, low-stock alerts, and revenue trend                        |
| Orders & bills       | Find and manage money-moving records | Search, filter by status, inspect order details, mark payment state, create a draft order |
| Customers & pets     | Understand relationships and history | Search customer/pet records, open profile details, view pet count and recent purchases    |
| Products & inventory | Keep sellable stock healthy          | Search products, filter stock state, view stock counts and reorder cues                   |
| Analytics            | See simple performance patterns      | Change period, compare revenue/orders, review top products and customer retention signal  |

The existing `/dashboard`, `/bills`, `/customers`, `/customers/[id]`, `/pets`, `/pets/[id]`, and `/statistics` routes will continue to work. New `/orders` and `/products` routes will provide clearer nouns for the primary workflows. Existing add/detail routes may be retained or redirected as implementation permits.

## Visual direction

Pawline uses a warm, high-contrast interface with an off-white canvas, deep ink text, muted slate surfaces, and one friendly coral accent for primary actions. Emerald is reserved for positive payment and stock states; amber indicates attention; rose indicates overdue or out-of-stock. The visual rhythm is spacious and card-based, with 14–18px radii, quiet borders, and minimal shadows.

The layout is desktop-first for clinic/store staff but collapses to a single-column mobile layout. A left sidebar exposes the five main areas. The top bar contains the page title, a global search affordance, and a compact staff identity chip. Tables use sticky-style headers, clear empty states, row actions, and status pills. Charts are simple SVG/CSS visualizations to avoid new chart dependencies.

## Data model for the demo surface

The UI will use typed local fixtures with the following entities:

- `Customer`: id, name, initials, phone, email, city, pets, totalSpent, lastVisit, status.
- `Pet`: id, name, species, breed, age, customerId, customerName, color, lastVisit, careNote.
- `Order`: id, customerId, customerName, petName, date, items, total, paymentStatus, fulfillmentStatus.
- `Product`: id, name, category, price, stock, reorderLevel, status, sku.
- `RevenuePoint`: label, revenue, orders.

Currency is Vietnamese dong, formatted with `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`. Fixtures should use realistic but fictional names and values. No personally identifying real data should be added.

## Behavior and state

Navigation is route-based. Search and filters are local and deterministic. Opening an order uses a detail page or in-page panel with line items, customer/pet context, totals, and payment/fulfillment status. Draft creation is a lightweight form that adds an in-memory row and shows a success state; it does not persist to Supabase. Analytics period controls update the displayed fixture series. Buttons must either perform a visible action, navigate to a real route, or be clearly disabled; no decorative dead controls are allowed.

## Accessibility and quality

All form controls have labels, buttons have readable names, focus rings remain visible, status is conveyed with text as well as color, and table content remains understandable at narrow widths. The project must pass `npm run validate` and produce a successful `npm run build`. The UI must not require network access for the primary demo paths.

## Deferred work

A future backend pass can replace fixtures with Supabase queries, add authenticated roles, persist orders and inventory changes, and connect checkout/payment flows. The first pass should not introduce Shopify or a new external commerce stack because this task is an internal operator dashboard rather than a customer storefront and the user approved a demo-data-first implementation.

## References

[1]: https://github.com/spring-petclinic/spring-petclinic-rest 'Spring Petclinic REST repository'
[2]: https://github.com/blingyplus/Vet-Management-System 'Veterinary Hospital Management System repository'
