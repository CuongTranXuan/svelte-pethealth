# Pawline Verification

**Date:** 22 August 2026
**Branch:** `dev`

## Automated checks

| Check                  | Result                                                                                       |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| `npm install`          | Passed; dependencies installed. npm reported existing audit findings in the dependency tree. |
| `npm run check`        | Passed with 0 errors and 0 warnings.                                                         |
| `npm run lint`         | Passed.                                                                                      |
| `npm run format:check` | Passed.                                                                                      |
| `npm run validate`     | Passed.                                                                                      |
| `npm run build`        | Passed; SvelteKit production build completed.                                                |

## Browser checks

The development server was started with `npm run dev -- --host 0.0.0.0 --port 5173` and exposed at:

`https://5173-ivf68qryqrwykw9ucezex-4895c75e.sg1.manus.computer`

Verified routes include `/dashboard`, `/orders`, `/orders/new`, `/customers`, `/products`, and `/statistics`. The dashboard rendered the Pawline shell, KPIs, revenue chart, stock alerts, and recent orders. Orders search reduced the table to matching records. The new-order form calculated a total and displayed an inline success state after submission. Customers and Products rendered their searchable tables and status information. Analytics period switching updated the KPI totals and chart labels.

## Notes

The temporary Vite configuration allows the exposed sandbox host for local testing. Demo forms are intentionally local and do not process payments or persist data. Supabase/Firebase integration remains available for a future backend pass. npm reported 35 dependency vulnerabilities during installation; those findings are pre-existing dependency audit output and were not changed as part of this UI reimplementation.

## Vietnamese localization verification

The live `/dashboard` route was refreshed after the localization build. Navigation, headings, date formatting, currency formatting, payment badges, and fulfillment badges rendered in Vietnamese. The test also confirmed the earlier HMR parser overlay was gone after the order-detail page was repaired. Some product fixture names and chart labels remain English in this pass and are candidates for a follow-up content polish; core navigation and operational UI are localized.

The live Orders page shows the Vietnamese headings and localized status badges. A stale Vite overlay reported a table text-node placement error from an earlier hot-reload state; the current source inspected at the same table lines is structurally valid. The payment filter still has one untranslated `Overdue` option and is being corrected before the final refresh.

The final refresh of `/dashboard` confirmed the Vietnamese default end-to-end: navigation, headings, CTA labels, currency/date formats, chart labels, product names, stock labels, table headings, and payment/fulfillment statuses are localized. The final `/orders` refresh confirmed the Vietnamese payment filter options and table copy render without the Vite overlay.

## Permanent hosting decision

The source repository has a committed GitHub Pages workflow and static build configuration. The GitHub Pages API could not be enabled with the available repository token (`403 Resource not accessible by integration`). The account user-site at `https://cuongtranxuan.github.io/` is active but currently serves an existing FDM Face Detection Demo, so it should not be overwritten without explicit approval. The current permanent deployment step therefore requires either enabling Pages for `svelte-pethealth` in repository Settings → Pages with **GitHub Actions** as the source, or choosing a separate hosting account/domain.
