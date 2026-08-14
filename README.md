# MARKSONGLOBAL (MG) STORES — Storefront

Frontend storefront for **MARKSONGLOBAL (MG) STORES**, a nationwide Nigerian digital supermarket selling groceries, provisions, household essentials and genuine electronics.

> Everything You Need. One Store.

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript (strict)
- **Tailwind CSS v4**
- **Medusa v2** headless commerce backend via `@medusajs/js-sdk`
- **TanStack Query** for server state
- **Vitest** for unit tests

## Current phase

Phase 1 — Browse & cart core. This includes the homepage sections, category/product browsing, product cards, cart drawer with line-item management, search bar, navbar/footer, and the Medusa SDK wiring behind all of them.

Not yet built (stubbed routes return a "coming soon" page): product listing/detail pages, checkout, account, search results, and the informational pages (delivery, returns, FAQs, etc.).

## Environment variables

Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your_publishable_key
NEXT_PUBLIC_SITE_URL=http://localhost:8000
```

The storefront needs a running Medusa v2 backend (with products, categories and a region configured) to display live data. Without it, the UI renders but product and category queries have no data to show.

## Scripts

```bash
npm run dev        # development server
npm run build      # production build
npm run lint       # eslint
npm test           # unit tests (vitest)
```

## Design

Deep emerald green + warm gold + cream on white. Typography: Bricolage Grotesque (display) and Figtree (body). Design tokens live in `src/app/globals.css`.