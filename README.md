# Restaurant Ordering Frontend

Frontend application for restaurant ordering, built with Next.js 15, React 19, and Zustand. It connects to the backend API to display the menu, manage the cart, submit checkout requests, and display order history and timeline data.

Repository: [restaurant_ordering_front](https://github.com/JuliGeralDev/restaurant_ordering_front)

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

- [`.env.example`](C:/Users/Bruja/Documents/Proyectos/restaurante_timeline/restaurant_ordering_front/.env.example)

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

- [`.env.example`](C:\Users\Bruja\Documents\Proyectos\restaurante_timeline\restaurant_ordering_front\.env.example)
- [`.env.local`](C:\Users\Bruja\Documents\Proyectos\restaurante_timeline\restaurant_ordering_front\.env.local)
- [`env.ts`](C:\Users\Bruja\Documents\Proyectos\restaurante_timeline\restaurant_ordering_front\src\shared\config\env.ts)

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

- [restaurant_ordering_backend](https://github.com/JuliGeralDev/restaurant_ordering_backend)

## Test User

For local development, the frontend uses a simulated test user instead of a real authentication flow.

That user must be declared in `.env.local` using:

```env
NEXT_PUBLIC_USER_ID=user-test-postman
```

This value is consumed from:

- [`env.ts`](C:\Users\Bruja\Documents\Proyectos\restaurante_timeline\restaurant_ordering_front\src\shared\config\env.ts)
- [`cartStore.ts`](C:\Users\Bruja\Documents\Proyectos\restaurante_timeline\restaurant_ordering_front\src\shared\stores\cartStore.ts)

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

If you are using the backend from this same repository family, follow the setup instructions in:

- [backend README](https://github.com/JuliGeralDev/restaurant_ordering_backend)

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

## Project Structure

```text
src/
|-- app/             # Next.js routes
|-- features/        # Business features: menu, cart, orders
|-- shared/          # Reusable UI, config, stores and utilities
```

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Zustand
- Axios

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

You can verify the configured API URL in:

- [`.env.local`](C:\Users\Bruja\Documents\Proyectos\restaurante_timeline\restaurant_ordering_front\.env.local)

### Port 3001 is already in use

Stop the process using that port, or change the script in [`package.json`](C:\Users\Bruja\Documents\Proyectos\restaurante_timeline\restaurant_ordering_front\package.json).

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

**Juliana Garcia Corredor**  
GitHub: [@JuliGeralDev](https://github.com/JuliGeralDev)
