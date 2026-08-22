# Research notes

## Existing repository

The selected repository is a SvelteKit application named `svelte-pethealth`, currently on `main` at commit `635373d` and already transitioning logic from a legacy Vue application into Svelte. The README is still the default Svelte starter text. `package.json` identifies Svelte 5, SvelteKit 2, Vite 6, Tailwind CSS, Supabase, Firebase, ESLint, Prettier, and `svelte-check`. Existing routes include login, customers, pets, bills, and statistics. The codebase contains Supabase queries for customers, pets, bills, and an RPC named `get_bill_stats`. `CODE_QUALITY.md` identifies `legacy/**` as old Vue.js code.

## Transition documentation

The repository's recent commits show the migration direction: `feat: add login page`, `feat: update new project structure via gemini 3`, `feat: add detail pages for customers and pets`, and `fix: clean up lock files and update statistics page`. The transition appears to be an incremental Vue-to-Svelte move rather than a clean greenfield project. The current task should therefore preserve the SvelteKit structure, reuse existing data concepts, and replace the starter/legacy presentation without expanding backend scope unnecessarily.

## External patterns reviewed

1. Spring Petclinic REST (https://github.com/spring-petclinic/spring-petclinic-rest) documents a stable veterinary domain model around owners, pets, veterinarians, pet types, specialties, and visits. It exposes CRUD-style boundaries and owner-to-pet-to-visit relationships. The repository has 601 stars and 931 commits as observed on Aug 22, 2026.
2. blingyplus/Vet-Management-System (https://github.com/blingyplus/Vet-Management-System) describes operational features such as appointment scheduling, pet and owner medical history, vaccination tracking, inventory/POS, staff roles, and responsive interfaces. It is a feature reference rather than a dependency because it has low activity and only 13 commits.

## Product implications

The reimplementation should prioritize a small clinic/store operator dashboard: overview metrics, orders/bills, customers and pets, products/inventory, and simple analytics. It should use a consistent owner/customer + pet relationship, make billing status obvious, and keep actions close to the relevant table rows. The first version can be demo-data driven in the UI while preserving clear seams for Supabase integration.

## Browser verification notes

The Vite dev server required `server.host = true` and `server.allowedHosts = true` in `vite.config.ts` for the temporary exposed hostname. After that adjustment, `/dashboard` loaded successfully at the exposed test URL. The rendered overview showed the Pawline sidebar, four KPI cards, revenue chart, stock-to-watch list, and recent orders table with working links.

The exposed browser test confirmed `/orders` renders the KPI strip, searchable orders table, payment-status filter, and links to new/detail workflows. Typing `Linh Nguyen` into the search field correctly reduced the table to the two matching orders.

The browser test confirmed `/orders/new` renders customer, pet, product, quantity, and payment controls with a calculated total. Clicking **Save draft order** displayed the intended inline success banner and `View orders` link without network dependency.

The browser test confirmed `/customers` renders six customer records with pet counts, spend, status, and profile links. `/products` renders the 10-product catalog with category filtering, stock summaries, low-stock badges, and visible reorder context.

The browser test confirmed `/statistics` renders four KPI cards, an SVG revenue trend, explanation panels, and 7-day/30-day/quarter controls. Switching to **This quarter** updated the totals and chart labels from W1–W4 to Jun–Aug.
