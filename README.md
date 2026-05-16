# Procurement Application

A full-stack procurement management application built with NestJS, React, TypeScript, Prisma, and PostgreSQL.

The project is organized as an npm workspace monorepo:

- `apps/backend`: NestJS REST API with JWT authentication, role-based access control, Prisma, PostgreSQL, Swagger, validation, logging, and unit tests.
- `apps/client`: React + Vite frontend for authentication and procurement workflows.

## Setup Instructions

### Prerequisites

Install these tools before running the application:

- Node.js 20 LTS or newer
- npm 10 or newer
- PostgreSQL 14 or newer
- Git

Verify your installation:

```bash
node --version
npm --version
psql --version
```

### Clone the Repository

```bash
git clone https://github.com/mr-tco/procurement-app.git
cd procurement-app
```

### Install Dependencies

From the project root:

```bash
npm install
```

Alternative workspace command:

```bash
npm run install:all
```

### Configure PostgreSQL

Create a local PostgreSQL database:

```sql
CREATE DATABASE procurement_db;
```

Create the backend environment file:

```bash
cp apps/backend/.env.example apps/backend/.env
```

On Windows PowerShell:

```powershell
Copy-Item apps/backend/.env.example apps/backend/.env
```

Update `apps/backend/.env` for your local PostgreSQL credentials:

```env
DATABASE_URL="postgresql://<postgres-user>:<postgres-password>@localhost:5432/procurement_db?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="1d"
PORT=3000
```

### Set Up Prisma

Generate the Prisma client:

```bash
npm --workspace apps/backend run prisma:generate
```

Run the database migrations:

```bash
npm --workspace apps/backend run prisma:migrate
```

### Run the Application

Start the backend API in one terminal:

```bash
npm run dev:backend
```

Start the React client in another terminal:

```bash
npm run dev:client
```

Open the application:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api`
- Swagger UI: `http://localhost:3000/api/docs`
- Swagger JSON: `http://localhost:3000/api/docs-json`

The frontend currently calls the backend at `http://localhost:3000/api`.

### Build and Test

Build all workspaces:

```bash
npm run build
```

Run backend tests:

```bash
npm test
```

Preview the production frontend build:

```bash
npm --workspace apps/client run preview
```

## API Documentation

The API is served under the `/api` global prefix.

### Authentication

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register a new user. |
| `POST` | `/api/auth/login` | Public | Log in and receive a JWT access token. |

Register request:

```json
{
  "email": "user@example.com",
  "fullName": "Example User",
  "password": "password123"
}
```

Login request:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Authenticated requests should include:

```http
Authorization: Bearer <accessToken>
```

### Items

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| `POST` | `/api/items` | `ADMIN` | Create an item. |
| `GET` | `/api/items` | Authenticated | List items. |
| `GET` | `/api/items/:id` | Authenticated | Get item details. |
| `PATCH` | `/api/items/:id` | `ADMIN` | Update an item. |
| `DELETE` | `/api/items/:id` | `ADMIN` | Delete an item. |

Create item request:

```json
{
  "name": "Laptop",
  "description": "Business laptop",
  "unitPrice": 75000
}
```

### Vendors

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| `POST` | `/api/vendors` | `ADMIN` | Create a vendor. |
| `GET` | `/api/vendors` | Authenticated | List vendors. |
| `GET` | `/api/vendors/:id` | Authenticated | Get vendor details. |
| `PATCH` | `/api/vendors/:id` | `ADMIN` | Update a vendor. |
| `DELETE` | `/api/vendors/:id` | `ADMIN` | Delete a vendor. |

Create vendor request:

```json
{
  "name": "Acme Supplies",
  "contactEmail": "sales@acme.example",
  "phone": "+911234567890"
}
```

### Indents

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| `POST` | `/api/indents` | Authenticated | Create an indent for the logged-in user. |
| `GET` | `/api/indents` | Authenticated | List indents. |
| `GET` | `/api/indents/:id` | Authenticated | Get indent details. |
| `PATCH` | `/api/indents/:id` | `ADMIN` | Update an indent. |
| `DELETE` | `/api/indents/:id` | `ADMIN` | Delete an indent. |

Create indent request:

```json
{
  "requestNumber": "IND-001",
  "itemId": "<item-id>",
  "quantity": 5,
  "status": "OPEN"
}
```

### Material Inward

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| `POST` | `/api/mis` | `ADMIN` | Create a material inward record. |
| `GET` | `/api/mis` | Authenticated | List material inward records. |
| `GET` | `/api/mis/:id` | Authenticated | Get material inward details. |
| `PATCH` | `/api/mis/:id` | `ADMIN` | Update a material inward record. |
| `DELETE` | `/api/mis/:id` | `ADMIN` | Delete a material inward record. |

Create material inward request:

```json
{
  "number": "MI-001",
  "indentId": "<indent-id>",
  "receivedQty": 5,
  "receivedAt": "2026-05-16T10:00:00.000Z"
}
```

### RFQs

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| `POST` | `/api/rfqs` | `ADMIN` | Create an RFQ. |
| `GET` | `/api/rfqs` | Authenticated | List RFQs. |
| `GET` | `/api/rfqs/:id` | Authenticated | Get RFQ details. |
| `PATCH` | `/api/rfqs/:id` | `ADMIN` | Update an RFQ. |
| `DELETE` | `/api/rfqs/:id` | `ADMIN` | Delete an RFQ. |

Create RFQ request:

```json
{
  "number": "RFQ-001",
  "itemId": "<item-id>",
  "vendorId": "<vendor-id>",
  "quantity": 5,
  "quotedPrice": 72500,
  "status": "DRAFT"
}
```

### Users

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| `GET` | `/api/users` | `ADMIN` | List users. |
| `PATCH` | `/api/users/:id/status` | `ADMIN` | Activate or deactivate a user. |
| `PATCH` | `/api/users/:id/role` | `ADMIN` | Assign a user role. |

Update user status request:

```json
{
  "isActive": true
}
```

Assign role request:

```json
{
  "role": "ADMIN"
}
```

## Postman Collection / Swagger Link

Swagger UI is available after starting the backend:

- `http://localhost:3000/api/docs`

Swagger JSON is available at:

- `http://localhost:3000/api/docs-json`

A Postman collection is included in the repository:

- [`docs/postman/procurement-app.postman_collection.json`](./docs/postman/procurement-app.postman_collection.json)

To use it:

1. Import the collection into Postman.
2. Keep `baseUrl` as `http://localhost:3000/api` unless your backend runs elsewhere.
3. Run `Auth / Register`, then `Auth / Login`.
4. Copy the `accessToken` from the login response into the collection variable named `accessToken`.
5. Use the list/create endpoints and update the ID variables as needed.

## Assumptions Made

- PostgreSQL is used as the primary database.
- The backend runs on port `3000` by default.
- The frontend runs on port `5173` by default through Vite.
- New users register with the `USER` role.
- Administrative routes require the `ADMIN` role.
- JWT bearer authentication is used for protected API routes.
- The API is intended to be tested locally through Swagger or Postman.
- `.env` files are local-only and are intentionally excluded from Git.

## Additional Setup Notes

For a more detailed machine setup checklist, see [`SETUP.md`](./SETUP.md).

For a concise run guide, see [`RUNNING.md`](./RUNNING.md).
