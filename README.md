# Restaurant Ordering + Order Timeline

Restaurant ordering platform with menu browsing, product customization, cart management, asynchronous checkout, and an append-only order timeline for auditability.

This root repository groups two applications that work together as a single local system.

## Repositories

- [`restaurant_ordering_backend`](https://github.com/TU-USUARIO/restaurant_ordering_backend): Serverless API with DynamoDB Local
- [`restaurant_ordering_front`](https://github.com/TU-USUARIO/restaurant_ordering_front): Next.js frontend application

The backend and frontend were originally developed as separate repositories. This root workspace centralizes run instructions, shared setup, and project-level documentation in a single place.


## Repository Structure

```text
restaurante_timeline/
|-- restaurant_ordering_backend/
|-- restaurant_ordering_front/
|-- package.json
|-- README.md
|-- docs/
`-- scripts/
```

## Prerequisites

| Tool | Recommended Version | Purpose |
|---|---|---|
| Node.js | 18.x LTS | Backend and frontend runtime |
| npm | 9+ | Package manager |
| Docker Desktop | Latest | DynamoDB Local |

## Environment Setup

### Backend

Environment file location:

- [`restaurant_ordering_backend/.env`](C:/Users/Bruja/Documents/Proyectos/restaurante_timeline/restaurant_ordering_backend/.env)

Reference template:

- [`restaurant_ordering_backend/.env.example`](C:/Users/Bruja/Documents/Proyectos/restaurante_timeline/restaurant_ordering_backend/.env.example)

Required variables:

- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `DYNAMODB_ENDPOINT`
- `TABLE_ORDERS`
- `TABLE_TIMELINE`
- `TABLE_MENU`
- `TABLE_IDEMPOTENCY`

### Frontend

Environment file location:

- [`restaurant_ordering_front/.env.local`](C:/Users/Bruja/Documents/Proyectos/restaurante_timeline/restaurant_ordering_front/.env.local)

Reference template:

- [`restaurant_ordering_front/.env.example`](C:/Users/Bruja/Documents/Proyectos/restaurante_timeline/restaurant_ordering_front/.env.example)

Recommended local values:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_USER_ID=user-test-postman
```

Required variables:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_USER_ID`

## Ports

| Service | Port |
|---|---:|
| Backend API (`serverless offline`) | `3000` |
| Frontend (`next dev`) | `3001` |
| DynamoDB Local | `8000` |

## Installation

Install both applications from the root:

```bash
npm run install:all
```

Manual installation:

```bash
cd restaurant_ordering_backend
npm install

cd ../restaurant_ordering_front
npm install
```

## Local Run Instructions

Recommended startup order:

1. Install dependencies.
2. Start DynamoDB Local.
3. Initialize tables and seed data.
4. Start the backend API.
5. Start the frontend application.

### Option 1: Root scripts

```bash
npm run docker:up
npm run init:db
npm run dev
```

This starts:

- backend at `http://localhost:3000`
- frontend at `http://localhost:3001`

### Option 2: Separate terminals

Terminal 1:

```bash
npm run docker:up
npm run init:db
npm run dev:backend
```

Terminal 2:

```bash
npm run dev:frontend
```

## Root Scripts

```bash
npm run install:all      # Install backend and frontend dependencies
npm run docker:up        # Start DynamoDB Local through Docker
npm run docker:down      # Stop DynamoDB Local containers
npm run docker:logs      # Show DynamoDB Local container logs
npm run init:db          # Create tables and seed backend data
npm run setup:backend    # Run backend setup workflow
npm run dev:backend      # Start the backend locally
npm run dev:frontend     # Start the frontend locally
npm run dev              # Start backend and frontend together
npm run test:backend     # Run backend test suite
npm run test:frontend    # Run frontend test suite
npm run test             # Run backend and frontend tests
```

## Seed Data

The backend provides a local database initialization flow that:

- creates DynamoDB tables
- seeds menu products
- prepares order, timeline, and idempotency storage

Run:

```bash
npm run init:db
```

## Main Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/menu` | Retrieve menu products |
| `POST` | `/cart/items` | Add item to cart |
| `PUT` | `/cart/items` | Update cart item |
| `DELETE` | `/cart/items` | Remove cart item |
| `POST` | `/orders` | Submit checkout asynchronously |
| `GET` | `/orders` | List orders filtered by `userId` |
| `GET` | `/orders/:orderId` | Retrieve order details |
| `GET` | `/orders/:orderId/timeline` | Retrieve paginated timeline events |

## Postman Collection

The backend repository already includes a Postman collection:

- [`restaurant_ordering_backend/postman_collection.json`](C:/Users/Bruja/Documents/Proyectos/restaurante_timeline/restaurant_ordering_backend/postman_collection.json)

The collection includes:

- end-to-end success flows
- validation scenarios
- error cases
- automated response assertions

## Testing

Backend:

```bash
npm run test:backend
```

Frontend:

```bash
npm run test:frontend
```

All tests:

```bash
npm run test
```



## Additional Notes

- The system runs as two separate applications connected over HTTP, which is a standard local development setup.
- Internal application README files remain available for implementation-specific details.
