# Procurement App Setup Guide

This document lists the software and project dependencies needed to install and run the Procurement Application on another machine.

## 1. System Prerequisites

Install these first:

- Node.js 20 LTS or newer
- npm 10 or newer, included with Node.js
- PostgreSQL 14 or newer
- Git, if cloning from a repository

Verify the main tools:

```bash
node --version
npm --version
psql --version
```

## 2. Project Structure

This is an npm workspace monorepo:

```text
procurement-app/
  apps/backend   NestJS REST API, Prisma, PostgreSQL, JWT auth
  apps/client    React + Vite frontend
```

## 3. Main Runtime Dependencies

Backend dependencies are installed from `apps/backend/package.json`:

- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`
- `@nestjs/config`
- `@nestjs/jwt`, `@nestjs/passport`
- `@nestjs/swagger`, `swagger-ui-express`
- `@prisma/client`, `prisma`
- `passport`, `passport-jwt`
- `bcryptjs`
- `class-validator`, `class-transformer`
- `reflect-metadata`, `rxjs`

Client dependencies are installed from `apps/client/package.json`:

- `react`, `react-dom`
- `react-router-dom`
- `axios`
- `vite`
- `typescript`
- `@vitejs/plugin-react`

Do not install these one by one unless you are repairing the project. Use `npm install` from the repository root so npm installs the workspace dependency tree and uses `package-lock.json`.

## 4. Clone or Copy the Project

```bash
git clone <repository-url>
cd procurement-app
```

If the project is copied manually, make sure the target machine has the full repository contents except generated folders such as `node_modules`, `apps/backend/dist`, and `apps/client/dist`.

## 5. Install Node Dependencies

From the repository root:

```bash
npm install
```

Alternative workspace command:

```bash
npm run install:all
```

## 6. Configure PostgreSQL

Create a PostgreSQL database:

```sql
CREATE DATABASE procurement_db;
```

Create or update the backend environment file:

```bash
cp apps/backend/.env.example apps/backend/.env
```

On Windows PowerShell:

```powershell
Copy-Item apps/backend/.env.example apps/backend/.env
```

Edit `apps/backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/procurement_db?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="1d"
PORT=3000
```

Adjust the PostgreSQL username, password, host, port, and database name to match the target machine.

## 7. Set Up Prisma

Generate the Prisma client:

```bash
npm --workspace apps/backend run prisma:generate
```

Run the database migration:

```bash
npm --workspace apps/backend run prisma:migrate
```

If this is a copied project without migration files, Prisma may ask to create an initial migration from `apps/backend/prisma/schema.prisma`.

## 8. Run the Application

Start the backend API:

```bash
npm run dev:backend
```

Backend URLs:

- API base URL: `http://localhost:3000/api`
- Swagger UI: `http://localhost:3000/api/docs`
- Swagger JSON: `http://localhost:3000/api/docs-json`

Start the React client in a second terminal:

```bash
npm run dev:client
```

Client URL:

- `http://localhost:5173`

The client currently calls the API at `http://localhost:3000/api` from `apps/client/src/api.ts`.

## 9. Authentication for Swagger or API Requests

Register a user:

```http
POST http://localhost:3000/api/auth/register
```

Login:

```http
POST http://localhost:3000/api/auth/login
```

The login response includes:

```json
{
  "accessToken": "<jwt-token>",
  "user": {}
}
```

Use the token in Swagger by clicking `Authorize` and pasting the token value. For API clients, send:

```http
Authorization: Bearer <jwt-token>
```

## 10. Build and Test

Build all workspaces:

```bash
npm run build
```

Run backend tests:

```bash
npm test
```

Preview the built client:

```bash
npm --workspace apps/client run preview
```

## 11. Common Issues

If the backend cannot connect to PostgreSQL, verify:

- PostgreSQL is running
- `DATABASE_URL` in `apps/backend/.env` is correct
- The database exists
- The PostgreSQL user has permission to create tables

If the client cannot call the API, verify:

- Backend is running on port `3000`
- Client is running on port `5173`
- CORS origins in `apps/backend/src/main.ts` include the client URL
- `apps/client/src/api.ts` points to the correct backend API URL

If protected endpoints return `401`, login again and send a valid bearer token.

If protected endpoints return `403`, the logged-in user may not have the required role. New registrations default to the `USER` role.
