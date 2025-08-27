# Retail Hub — Storefront (Next.js)

The Retail Hub Storefront is the **customer‑facing surface** of ACME Corp’s flagship commerce platform. It turns the platform’s domain services—Identity, Catalog, Cart, Orders, Payments, and Reports—into a coherent, fast, and secure web experience.

## Strategic Role

- **Single point of experience:** Guides the customer from discovery to purchase with integrity across identity, stock, and settlement.
- **BFF gateway:** Implements a backend‑for‑frontend (BFF) layer to safely stitch multiple microservices, handling cookies, headers, idempotency, and error normalization.
- **Operational clarity:** Surfaces state transitions (e.g., `pending_payment` → `paid`) and supports administrative functions (product management, reporting).

## Architecture Snapshot

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Design:** Tailwind tokens + Radix primitives; accessible and responsive
- **Data:** SSR for SEO‑critical pages; TanStack Query for client state
- **Auth:** JWT in `rh_session` httpOnly cookie; BFF proxies requests to domain services
- **Integrations:**  
  - Accounts → `https://api.retail-hub.com/v1/accounts`  
  - Catalog → `https://api.retail-hub.com/v1/catalog`  
  - Cart → `https://api.retail-hub.com/v1/cart`  
  - Orders → `https://api.retail-hub.com/v1/orders`  
  - Payments → `https://pay.retail-hub.com/v1/payments`  
  - Reports → `https://reports.retail-hub.com/v1/reports`

## Key Pages

- `/` Home (featured catalog), `/catalog`, `/product/[id]`
- `/login`, `/register`, `/account`
- `/cart`, `/checkout`, `/orders`, `/orders/[orderId]`
- `/reports` (admin), `/admin/products*` (admin)

## Environment

Create `.env.local`:
````

ACCOUNTS\_BASE\_URL=...
CATALOG\_BASE\_URL=...
CART\_BASE\_URL=...
ORDERS\_BASE\_URL=...
PAYMENTS\_BASE\_URL=...
REPORTS\_BASE\_URL=...
SESSION\_COOKIE\_NAME=rh\_session
SESSION\_MAX\_AGE=86400

````

## Run

```bash
pnpm install
pnpm dev
# open http://localhost:3000
````

## Build & Ship

```bash
pnpm build
pnpm start
# Docker
docker build -t acmecorp/retail-hub-frontend:dev .
```

## Documentation

* **Technical Design:** [`docs/TECHNICAL_DESIGN.md`](./docs/TECHNICAL_DESIGN.md)
* **Product BRD:** See `acmecorp-hq/catalog/retail-hub/BRD.md`
* **APIs:** See OpenAPI specs in each service repo under `api/openapi.yaml`

## Acceptance (Curator’s checklist)

* Auth works end‑to‑end; cookie is httpOnly, Secure.
* Catalog SSR renders; product detail loads quickly; accessible controls.
* Cart updates are idempotent; UI never double‑adds on refresh.
* Checkout completes with Payments simulation → Orders moves to `paid`.
* Admin can CRUD products; non‑admin gated.
* Reports show aggregates and export CSV.

License: Proprietary