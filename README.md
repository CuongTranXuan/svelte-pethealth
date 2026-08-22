# Pawline

Pawline is a simple operator workspace for a pet store and clinic. It helps a small team see the day clearly, find customers and pets, manage orders and bills, monitor products, and understand basic revenue trends without a dense enterprise workflow.

The application is a SvelteKit/Svelte 5 reimplementation of the existing `svelte-pethealth` experience. The repository is already transitioning from a legacy Vue implementation; this pass gives the Svelte app a coherent product surface while keeping the existing Supabase and Firebase seams available for a future persistence pass.

## Local development

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:5173` by default. The temporary test server used for this implementation is exposed separately and is not a production deployment.

## Main routes

| Route             | Purpose                                                                  |
| ----------------- | ------------------------------------------------------------------------ |
| `/dashboard`      | Daily overview with KPIs, revenue trend, recent orders, and stock alerts |
| `/orders`         | Searchable orders and payment-status table                               |
| `/orders/new`     | Demo-data-first draft order form                                         |
| `/orders/[id]`    | Order detail, line items, customer/pet context, and bill summary         |
| `/bills`          | Bill history and outstanding payment summary                             |
| `/customers`      | Customer directory with spend, pets, and follow-up state                 |
| `/customers/[id]` | Customer profile with linked pets and orders                             |
| `/pets`           | Pet directory                                                            |
| `/pets/[id]`      | Pet profile and care note                                                |
| `/products`       | Product catalog and inventory health                                     |
| `/statistics`     | Revenue, orders, average order, and repeat-customer signals              |

The root route `/` opens the overview. Legacy create/detail URLs remain compatible where practical and redirect into the current Pawline workflow.

## Current data approach

The primary demo routes use typed fictional fixtures in `src/lib/data/pawline.ts`. This keeps the experience usable without Supabase credentials or schema changes. Currency is formatted as Vietnamese dong with `Intl.NumberFormat`. Forms show local success states but do not process payments or persist records yet.

The next backend pass can connect the same entity boundaries to Supabase: customers, pets, orders/bills, products, and revenue aggregates. Appointments, checkout/payment processing, medical records, staff roles, and multi-branch support are intentionally out of scope for this first reimplementation.

## Quality checks

```bash
npm run validate
npm run build
```

`npm run validate` runs ESLint, Prettier, and `svelte-check`. The implementation should pass these checks before changes are committed.

## Design and transition notes

- Design specification: `docs/superpowers/specs/2026-08-22-pawline-admin-design.md`
- Implementation plan: `docs/superpowers/plans/2026-08-22-pawline-admin.md`
- Research and browser verification notes: `docs/research-notes.md`
- Legacy Vue code remains under `legacy/` and is not used by the Pawline routes.
