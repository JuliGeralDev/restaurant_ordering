# Restaurant Ordering API

Backend API for restaurant order management built with Clean Architecture, featuring event-driven timeline tracking and DynamoDB.

## Overview

Serverless REST API for restaurant ordering with:
- **Clean Architecture**: Domain, Application, Infrastructure, Interfaces layers
- **Event Timeline**: Complete append-only audit trail for all order lifecycle events
- **TypeScript**: Full type safety end to end
- **DynamoDB Local**: Local development with Docker, no AWS account needed
- **Idempotent Checkout**: Safe retry via `Idempotency-Key` header
- **Server-side Pricing**: Totals are never trusted from the client
- **PII-safe Logging**: Email and phone fields are masked before being logged

## Frontend

The frontend lives in the same workspace:

- [`../restaurant_ordering_front`](../restaurant_ordering_front)
- [`../restaurant_ordering_front/README.md`](../restaurant_ordering_front/README.md)

For instructions on running both applications together, see the [root README](../README.md).

## Development User Model

This system does not include authentication, registration, or user administration.

For local development and manual testing, the frontend and API flow use a fixed user identifier:

```env
NEXT_PUBLIC_USER_ID=user-test
```

This means:

- there is no real login flow
- orders are created and queried for a simulated fixed user
- Postman examples can use that same identifier safely during local testing
- the fixed user is intentional and not an incomplete implementation

## Prerequisites

| Tool | Required Version | Check |
|------|-----------------|-------|
| Node.js | 18.x LTS | `node --version` |
| Docker Desktop | Latest | `docker --version` |
| AWS CLI | v2.x | `aws --version` |

**Install:**
- Node.js: https://nodejs.org
- Docker: https://www.docker.com/products/docker-desktop
- AWS CLI: https://aws.amazon.com/cli/

**Important:** Before running `npm run setup`, `npm run init:db`, or `docker-compose up -d`, make sure Docker Desktop is open and the Docker CLI is running correctly on your machine.

### Managing Node.js Version with nvm

If you don't have Node.js 18.x or need to switch versions, we recommend using **nvm** (Node Version Manager):

**Install nvm:**

- **Windows**: Download and install [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)
- **macOS/Linux**: Run this command:
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  ```

**Use nvm to install and switch to Node.js 18:**

```bash
# Install Node.js 18 LTS
nvm install 18

# Use Node.js 18
nvm use 18

# Verify the version
node --version  # Should show v18.x.x

# (Optional) Set Node.js 18 as default
nvm alias default 18
```

## Getting Started

### Quick Setup (Recommended)

```bash
# 1. Clone and install
git clone <repository-url>
cd restaurant_ordering_backend
npm install

# 2. Setup database (this takes ~15 seconds)
#    - Requires Docker Desktop / Docker CLI to be running
#    - Starts Docker container
#    - Waits for DynamoDB to be ready
#    - Creates tables
#    - Seeds sample data
npm run setup

# 3. Start the API
npm run dev

# 4. Test it
curl http://localhost:3000/menu
```

**Done!** If you see a JSON array of menu products, everything works.

**Note:** The `npm run setup` command includes a 10-second wait to ensure DynamoDB is fully ready before creating tables.

---

### Manual Setup (Step by Step)

If you want to understand each step:

#### Step 1: Install Dependencies

```bash
git clone <repository-url>
cd restaurant_ordering_backend
npm install
```

#### Step 2: Start DynamoDB

Make sure Docker Desktop is open and the Docker CLI is running before executing this step.

```bash
docker-compose up -d
```

Wait 5 seconds, then verify:

```bash
aws dynamodb list-tables --endpoint-url http://localhost:8000 --region us-east-1
```

Should return empty list: `{ "TableNames": [] }`

**⚠️ Important:** DynamoDB runs in-memory mode. All data is lost when you stop the container. Run `npm run init:db` again after restarting.

#### Step 3: Create Tables and Seed Data

```bash
npm run init:db
```

You should see:
```
✓ Connected to DynamoDB Local
✓ Table orders created successfully
✓ Table order_timeline created successfully
✓ Table menu created successfully
✓ Table idempotency created successfully
✓ Added menu item: Classic Burger
...
✅ Database initialization completed successfully!
```

#### Step 4: Start the API

```bash
npm run dev
```

#### Step 5: Test

```bash
curl http://localhost:3000/menu
```

If you see a JSON array of menu products, **you're done!**

## Quick Reference

### Daily Commands

```bash
# Start API
npm run dev

# Stop DynamoDB
docker-compose down

# Start DynamoDB (if stopped)
docker-compose up -d

# View logs
docker-compose logs -f
```

### Reset Database

```bash
docker-compose down
docker volume rm dynamodb_data
docker-compose up -d
npm run init:db
```

## API Endpoints

All endpoints run at `http://localhost:3000` in local development.

### GET /menu

Retrieve all available menu products with their modifier groups.

```bash
curl http://localhost:3000/menu
```

### POST /cart/items

Add a product to the cart. If the same product with the same modifiers already exists in the order, the quantity is incremented instead of creating a duplicate.

```bash
# Simple product (no modifiers)
curl -X POST http://localhost:3000/cart/items \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-test",
    "productId": "1",
    "quantity": 1
  }'

# Customizable product (with modifiers)
curl -X POST http://localhost:3000/cart/items \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-test",
    "productId": "8",
    "quantity": 1,
    "modifiers": [
      { "groupId": "protein", "optionId": "beef" },
      { "groupId": "toppings", "optionId": "cheese" },
      { "groupId": "sauces", "optionId": "bbq" }
    ]
  }'
```

On first call (no `orderId` provided), a new order is created and its `orderId` is returned. Pass `orderId` in subsequent calls to add items to the same order.

### PUT /cart/items

Update a specific cart item by its `cartItemId`. Replaces quantity and modifiers entirely.

```bash
curl -X PUT http://localhost:3000/cart/items \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "<orderId>",
    "userId": "user-test",
    "cartItemId": "<cartItemId>",
    "quantity": 2,
    "modifiers": [
      { "groupId": "protein", "optionId": "chicken" }
    ]
  }'
```

### DELETE /cart/items

Remove a cart item. Supports two modes:

- by `cartItemId`: removes or decrements that specific instance
- by `productId`: removes all instances of that product

```bash
curl -X DELETE http://localhost:3000/cart/items \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "<orderId>",
    "userId": "user-test",
    "cartItemId": "<cartItemId>"
  }'
```

### POST /orders

Submit checkout. Returns `202 Accepted` immediately while the order is finalized asynchronously. The order transitions from `PROCESSING` to `PLACED` after a short delay (~800ms).

Requires an `Idempotency-Key` header to prevent duplicate submissions on retries.

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: <uuid>" \
  -d '{
    "orderId": "<orderId>",
    "userId": "user-test"
  }'
```

### GET /orders

List all orders for a given user.

```bash
curl "http://localhost:3000/orders?userId=user-test"
```

### GET /orders/{orderId}

Get order details including items and pricing breakdown.

```bash
curl http://localhost:3000/orders/<orderId>
```

### GET /orders/{orderId}/timeline

Get the paginated event timeline for an order. Events are always sorted by timestamp. Maximum page size is 50.

```bash
# First page
curl "http://localhost:3000/orders/<orderId>/timeline?pageSize=10"

# Next page using the token returned from the previous response
curl "http://localhost:3000/orders/<orderId>/timeline?pageSize=10&nextToken=<token>"
```

### POST /users/session

Create or recover a mock user session.

```bash
curl -X POST http://localhost:3000/users/session \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juliana",
    "name": "Juliana Garcia",
    "email": "juliana@example.com",
    "phone": "+57 300 111 2233"
  }'
```

### GET /users/{userId}

Retrieve an existing mock user profile.

## Postman Collection

A ready-to-run Postman collection for the local API is included in this repository:

- [`postman/restaurant-ordering.postman_collection.json`](C:/Users/Bruja/Documents/Proyectos/restaurant_ordering/restaurant_ordering_backend/postman/restaurant-ordering.postman_collection.json)

The collection covers the end-to-end local flow:

- get menu
- add simple product
- add customized product
- get order by id
- update item in cart
- remove item from cart
- remove all instances of a product
- list orders by user
- place order with idempotency
- inspect timeline events
- validate common failure scenarios

## Sample Data

After `npm run init:db`, you get **10 menu items**:

- **ID 1**: Classic Burger ($18,000)
- **ID 2**: Double Cheese Burger ($21,000)
- **ID 3**: Pepperoni Pizza ($24,000)
- **ID 4**: Four Cheese Pizza ($25,000)
- **ID 5**: Italian Lasagna ($23,000)
- **ID 6**: Coca-Cola ($6,000)
- **ID 7**: Pepsi ($6,000)
- **ID 8**: Custom Burger ($19,000) - **with modifiers** (protein, toppings, sauces)
- **ID 9**: Custom Hot Dog ($15,000) - **with modifiers** (protein, toppings, sauces)
- **ID 10**: Custom Tacos ($20,000) - **with modifiers** (protein, toppings, sauces)

## Architecture

The backend follows Clean Architecture with four layers that depend inward: the domain has no external dependencies, the application layer depends only on the domain, the infrastructure layer implements domain contracts, and the interfaces layer handles HTTP.

```
src/
├── domain/          # Core business rules. No framework dependencies.
├── application/     # Use cases that orchestrate domain logic.
├── infrastructure/  # DynamoDB clients and repository implementations.
└── interfaces/      # Lambda handlers, validators, and mappers.
```

### Domain layer

Contains everything that defines what the application does, independently of how it does it.

- **Entities**: `Order`, `OrderItem`, `TimelineEvent`, `IdempotencyRecord` — domain objects with identity and behavior.
- **Value objects**: `Money` — encapsulates integer-cent amounts, prevents floating-point math, immutable.
- **Repository interfaces**: `OrderRepository`, `TimelineRepository`, `MenuRepository`, `IdempotencyRepository` — contracts the infrastructure must fulfill.
- **Domain services**: `PricingService` (subtotal, tax, service fee, total), `ModifierSelectionService` (validates required/max constraints per modifier group).
- **Factories**: `TimelineEventFactory` — builds events with monotonic timestamps to guarantee sort order.
- **Errors**: `ValidationError` (400), `NotFoundError` (404), `IdempotencyConflictError` (409).

### Application layer

Contains use cases that coordinate domain objects and services to execute a business operation.

| Use case | Responsibility |
|---|---|
| `AddItemToCartUseCase` | Creates order on first item, merges or appends items, recalculates pricing |
| `UpdateItemInCartUseCase` | Replaces quantity and modifiers for an existing `cartItemId` |
| `RemoveItemFromCartUseCase` | Decrements or removes by `cartItemId`, or removes all by `productId` |
| `PlaceOrderUseCase` | Validates idempotency key, sets status to `PROCESSING`, schedules async completion |

Application services support the use cases:

- **`CartItemService`**: Fetches product from menu, validates modifiers, detects duplicate items.
- **`OrderService`**: Loads order from repository, creates new orders, finds items by id.
- **`OrderPricingService`**: Orchestrates `PricingService` and saves a `PRICING_CALCULATED` event.
- **`CartOperationOrchestrator`**: Sequences save-order → save-item-event → save-pricing-event.
- **`OrderPlacementProcessorService`**: Async finalizer that transitions `PROCESSING → PLACED` after ~800ms.

### Infrastructure layer

Implements the contracts defined by the domain using AWS SDK v3 and DynamoDB Local.

| Class | Table | Key design |
|---|---|---|
| `DynamoOrderRepository` | `orders` | PK `orderId` · GSI `userId-createdAt-index` |
| `DynamoTimelineRepository` | `order_timeline` | PK `eventId` · GSI `orderId-timestamp-index` |
| `DynamoMenuRepository` | `menu` | PK `productId` |
| `DynamoIdempotencyRepository` | `idempotency` | PK `key` |

Event deduplication is enforced with a DynamoDB `ConditionExpression: attribute_not_exists(eventId)` on every timeline write.

Timeline pagination uses `LastEvaluatedKey` encoded as a Base64 `nextToken`.

The `logger` utility wraps all output through `pii-mask.util.ts` before writing to console, masking email and phone fields.

### Interfaces layer

Exposes the application as a set of Lambda functions via Serverless Framework.

- **`apiHandler` wrapper**: Parses body, headers, path and query params; validates payload size (max 16 KB); maps errors to HTTP status codes; records `VALIDATION_FAILED` timeline events when relevant.
- **`OrderMapper`**: Converts domain `Order` → response DTO (Money value objects serialized as plain numbers).
- **Validators**: `cart-validators.ts` enforces required fields and normalizes modifier input before use cases are called.

### Order status flow

```
CREATED  →  (cart operations)  →  PROCESSING  →  PLACED
   ↑                                  ↑               ↑
First item added           POST /orders        ~800ms async
```

### Pricing formula

```
subtotal   = Σ (basePrice × quantity) + Σ (modifierPrice × quantity)
tax        = subtotal × 0.10   (rounded to nearest cent)
serviceFee = subtotal × 0.05   (rounded to nearest cent)
total      = subtotal + tax + serviceFee
```

All values are stored and returned as **integer cents**. The `Money` value object rejects non-integer inputs at construction time.

**Tech Stack:**
- Serverless Framework 3.40.0
- TypeScript 5.9.3
- DynamoDB (AWS SDK v3.967.0)
- esbuild 0.27.4
- Jest 29.x / ts-jest (testing)

## Testing

The project includes comprehensive unit tests covering core business logic.

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage

**53 tests** covering:
- Money value object (12 tests)
- Pricing service (14 tests)
- Timeline event factory (8 tests)
- Order service (11 tests)
- Cart item service (8 tests)

Example output:
```
Test Suites: 5 passed, 5 total
Tests:       53 passed, 53 total
Time:        4.686 s
```

## Troubleshooting

### "Cannot connect to DynamoDB"

Start DynamoDB:
```bash
docker-compose up -d
```

### "Table does not exist"

Create tables:
```bash
npm run init:db
```

### "Port 8000 already in use"

Remove old container:
```bash
docker rm -f dynamodb
docker-compose up -d
```

### "npm run dev failed"

Check if there are TypeScript errors:
```bash
npm install
```

### Complete Reset

```bash
docker-compose down
docker volume rm dynamodb_data
rm -rf node_modules package-lock.json
npm install
docker-compose up -d
npm run init:db
npm run dev
```

## Database Tables

- **orders**: Order data (PK: `orderId`)
- **order_timeline**: Events (PK: `eventId`, GSI: `orderId` + `timestamp`)
- **menu**: Menu items (PK: `productId`)
- **idempotency**: Idempotency keys (PK: `key`)
- **users**: Mock users (PK: `userId`, GSI: `identityKey`)

## Event Types

All events share the same schema: `eventId`, `timestamp` (ISO 8601), `orderId`, `userId`, `type`, `source` (`web | api | worker`), `correlationId`, and `payload`.

| Type | Trigger | Key payload fields |
|---|---|---|
| `CART_ITEM_ADDED` | New item added to cart | `productId`, `name`, `quantity`, `basePrice`, `modifiers` |
| `CART_ITEM_UPDATED` | Quantity or modifiers changed, or duplicate merged | `cartItemId`, `productId`, `quantity` |
| `CART_ITEM_REMOVED` | Item removed from cart | `cartItemId`, `productId`, `removedCount` |
| `PRICING_CALCULATED` | After any cart mutation | `subtotal`, `tax`, `serviceFee`, `total` |
| `ORDER_PLACED` | Checkout accepted | `acceptedAt`, `status: PROCESSING` |
| `ORDER_STATUS_CHANGED` | Any status transition | `from`, `to` |
| `VALIDATION_FAILED` | Request failed validation | `errorMessage`, `validationType`, `attemptedAction` |

Timeline events are **append-only** and **deduplicated** by `eventId` at the database level using DynamoDB condition expressions. The timeline is always sorted by timestamp regardless of arrival order.

## License

ISC

## Author

**Juliana García Corredor**  
GitHub: [@JuliGeralDev](https://github.com/JuliGeralDev)  
Email: juliana.c@gmail.com
