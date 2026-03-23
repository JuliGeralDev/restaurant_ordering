# Restaurant Ordering Frontend

Frontend application for restaurant ordering, built with Next.js 15, React 19, and Zustand. It connects to the backend API to display the menu, manage the cart, submit checkout requests, and display order history and timeline data.

Repository: [`restaurant_ordering_front`](../restaurant_ordering_front)

The backend and root workspace live alongside this application:

- [`../restaurant_ordering_backend`](../restaurant_ordering_backend)
- [Root README](../README.md) — instructions for running both applications together

## Overview

This application includes:

- Menu listing with product modifiers
- Cart management with quantity updates
- Order confirmation flow
- Order history view
- Order detail page with timeline/events

## Prerequisites

| Tool | Recommended Version | Check |
|------|---------------------|-------|
| Node.js | 18.x LTS or newer | `node --version` |
| npm | 9.x or newer | `npm --version` |

**Install:**

- Node.js: [https://nodejs.org](https://nodejs.org)

### Managing Node.js Version with nvm

If you need to switch Node versions, using `nvm` is recommended:

- **Windows**: install [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)
- **macOS/Linux**: install [nvm-sh](https://github.com/nvm-sh/nvm)

Example with Node 18:

```bash
nvm install 18
nvm use 18
node --version
```

## Getting Started

### Quick Setup (Recommended)

```bash
# 1. Clone and enter the project
git clone <repository-url>
cd restaurant_ordering_front

# 2. Install dependencies
npm install

# 3. Create .env.local from .env.example
# Example:
# NEXT_PUBLIC_API_URL=http://localhost:3000
# NEXT_PUBLIC_USER_ID=user-test-postman

# 4. Start the frontend
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

**Important:** this frontend expects the backend API to be running at `http://localhost:3000`.

If your backend is in a different URL, update `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_USER_ID=user-test-postman
```

## Environment Variables

Create `.env.local` in the project root using:

- [`.env.example`](.env.example)

Example content:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_USER_ID=user-test-postman
```

Required variables:

- `NEXT_PUBLIC_API_URL`: backend base URL used by the frontend
- `NEXT_PUBLIC_USER_ID`: simulated test user used by the app for cart and order requests

Because this project uses a simulated user flow for local development, `NEXT_PUBLIC_USER_ID` must always be present in `.env.local`. There is no real login in this frontend, so this value acts as the active test user during development.

## API Connection

The frontend connects to the backend through the `NEXT_PUBLIC_API_URL` variable defined in:

- [`.env.example`](.env.example)
- `.env.local` (created by you, not committed)
- [`src/shared/config/env.ts`](src/shared/config/env.ts)

Current local example:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_USER_ID=user-test-postman
```

The application uses this base URL for requests such as:

- menu retrieval
- cart item creation/removal
- order confirmation
- order history and order timeline

Backend repository:

- [`../restaurant_ordering_backend`](../restaurant_ordering_backend)

## Test User

For local development, the frontend uses a simulated test user instead of a real authentication flow.

That user must be declared in `.env.local` using:

```env
NEXT_PUBLIC_USER_ID=user-test-postman
```

This value is consumed from:

- [`src/shared/config/env.ts`](src/shared/config/env.ts)
- [`src/shared/stores/cartStore.ts`](src/shared/stores/cartStore.ts)

Important notes:

- this is not a real authenticated session; it is a simulated user identifier
- all cart and order requests are associated with this test user
- the order history shown in `/orders` corresponds to that same user
- if the backend data is filtered by user, you should seed or test with this same identifier

## Run with Backend

For the full flow to work locally:

1. Start the backend API on `http://localhost:3000`
2. Start this frontend on `http://localhost:3001`
3. Open the frontend in the browser

If you are using the backend from this same workspace, follow the setup instructions in:

- [`../restaurant_ordering_backend/README.md`](../restaurant_ordering_backend/README.md)

## Available Scripts

```bash
# Start development server on port 3001
npm run dev

# Create production build
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## Main Routes

- `/` : menu and product selection
- `/cart` : current cart and checkout confirmation
- `/orders` : order history
- `/orders/[orderId]` : order detail and timeline

## Architecture

The frontend uses a feature-oriented structure. Each feature owns its own types, API calls, hooks, and UI components. Shared infrastructure lives in `shared/`.

```text
src/
|-- app/             # Next.js App Router: routes, layout, and global styles
|-- features/        # Business features: menu, cart, orders
`-- shared/          # Reusable config, hooks, stores, lib, and UI components
```

### App layer

Next.js App Router pages that compose feature components into routes.

| Route | File | Description |
|---|---|---|
| `/` | `app/page.tsx` | Menu listing |
| `/cart` | `app/cart/page.tsx` | Cart and checkout |
| `/orders` | `app/orders/page.tsx` | Order history |
| `/orders/[orderId]` | `app/orders/[orderId]/page.tsx` | Order detail and timeline |

### Features layer

Each feature is self-contained with its own types, API functions, hooks, and UI.

**`features/menu`**
- `menu.types.ts` / `menu.mappers.ts`: API response → UI model
- `hooks/useGetMenu.ts`: fetches and maps menu items
- `hooks/useModifiersModal.ts`: manages modifier selection state per product
- `ui/Menu.tsx`: product grid
- `ui/RetroMenuCard.tsx`: individual product card
- `ui/RetroModifiersModal.tsx`: modifier selection modal (required/optional groups, max constraints)

**`features/cart`**
- `cart.types.ts` / `cart.api.ts`: request types and API calls
- `hooks/useAddToCart.ts`: posts to `POST /cart/items`, syncs order state
- `hooks/useEditCartItem.ts`: puts to `PUT /cart/items`
- `hooks/useRemoveCartItem.ts`: deletes from `DELETE /cart/items`
- `hooks/useConfirmOrder.ts`: posts to `POST /orders` with idempotency key, redirects on success
- `hooks/useGetOrder.ts`: fetches the current in-progress order
- `hooks/useGroupedCartItems.ts`: groups items by product + modifier combination for display
- `hooks/useCartPage.ts`: orchestrates all cart page interactions
- `ui/CartPanel.tsx`, `CartContent.tsx`, `CartItemRow.tsx`, `CartOrderSummary.tsx`: cart UI

**`features/orders`**
- `orders.types.ts`: event and order response types
- `hooks/useGetOrderById.ts`: fetches order, polls every 2s while status is `PROCESSING` (max 30 attempts)
- `hooks/useGetOrdersByUser.ts`: fetches order history list
- `hooks/useGetOrderEvents.ts`: fetches paginated timeline events, exposes `loadMore()` and `refresh()`
- `ui/OrderTimeline.tsx`: event list with load-more pagination
- `ui/OrderEventRow.tsx`: single expandable event row
- `ui/EventDetail.tsx`: expanded payload viewer
- `ui/OrderSummaryCard.tsx`: order header with status badge and items
- `ui/orderEvent.config.ts`: maps event types to icons, colors, and labels
- `ui/orderEvent.renderers.tsx`: renders event payloads differently per type

### Shared layer

| Path | Description |
|---|---|
| `shared/config/env.ts` | Validates required env vars at startup; throws if missing |
| `shared/stores/cartStore.ts` | Zustand store — persists `orderId`, `userId`, and `checkoutIdempotencyKey` to `localStorage` |
| `shared/hooks/useGetRequest.ts` | Generic GET hook with loading/error/retry state |
| `shared/lib/api/httpClient.ts` | Axios instance — base URL, 10s timeout, error interceptor |
| `shared/lib/api/apiError.ts` | Custom `ApiError` class wrapping Axios errors |
| `shared/lib/formatters.ts` | `formatCurrency()`, `formatOrderShortId()`, `formatDate()` |
| `shared/lib/idempotency.ts` | `createIdempotencyKey()` — generates UUID for safe checkout retries |
| `shared/ui/` | Base UI components: Button, Badge, Card, Header, Footer, PricingBreakdown, QuantityStepper, OrderStatusBadge, and retro-themed primitives |

### Cart store

The Zustand store in `cartStore.ts` is the coordination layer between pages:

- `orderId`: the active in-progress order id
- `userId`: loaded from `NEXT_PUBLIC_USER_ID`
- `orderData`: latest fetched order (not persisted, refreshed each session)
- `checkoutIdempotencyKey`: UUID created on first checkout attempt for a given order; reused on retries; replaced on a new order

`getOrCreateCheckoutIdempotencyKey(orderId)` ensures the same key is reused if the user retries the checkout for the same order, which prevents duplicate order submissions.

## Tech Stack

- Next.js 15 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS
- Zustand (cart state)
- Axios (HTTP client)
- Vitest + jsdom (testing)
- shadcn/ui base components
- lucide-react icons

## Testing

The project uses Vitest with jsdom for unit and component tests.

```bash
# Run all tests once
npm test

# Run in watch mode
npm run test:watch
```

Test files:

| File | What it tests |
|---|---|
| `shared/lib/__tests__/formatters.test.ts` | Currency, date, and order ID formatters |
| `shared/lib/__tests__/idempotency.test.ts` | UUID generation for idempotency keys |
| `features/menu/hooks/__tests__/useModifiersModal.test.ts` | Modifier selection state and constraints |
| `features/cart/hooks/__tests__/useGroupedCartItems.test.ts` | Cart item grouping by product and modifiers |
| `features/orders/ui/__tests__/OrderEventRow.test.tsx` | Event row rendering and expand/collapse |

## Troubleshooting

### "Missing NEXT_PUBLIC_API_URL environment variable"

Create or update `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_USER_ID=user-test-postman
```

Then restart the dev server.

### "Missing NEXT_PUBLIC_USER_ID environment variable"

Create or update `.env.local` with a simulated test user:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_USER_ID=user-test-postman
```

Then restart the dev server.

### The frontend opens but data does not load

Check that the backend is running on `http://localhost:3000`.

You can verify the configured API URL in `.env.local`.

### Port 3001 is already in use

Stop the process using that port, or change the port in the `dev` script in `package.json`.

### Dependencies fail or the project behaves inconsistently

Run:

```bash
rm -rf node_modules package-lock.json
npm install
```

On Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

## Author

**Juliana García Corredor**  
GitHub: [@JuliGeralDev](https://github.com/JuliGeralDev)  
Email: juligeral.c@gmail.com
