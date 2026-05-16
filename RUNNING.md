# Running the Procurement Application

This guide explains how to install and run the Procurement Application on a local machine.

## Prerequisites

Install these tools first:

- Node.js 20 LTS or newer
- npm 10 or newer
- PostgreSQL 14 or newer
- Git, if cloning from a repository

Verify the tools are available:

```bash
node --version
npm --version
psql --version
```

## Get the Project

Clone the repository, then move into the project directory:

```bash
git clone <repository-url>
cd procurement-app
```

If the project was shared as a folder or archive, open a terminal in the project root directory. The project root is the folder that contains `package.json`, `README.md`, `apps/backend`, and `apps/client`.

## Install Dependencies

From the project root, run:

```bash
npm install
```

You can also use the workspace install script:

```bash
npm run install:all
```

## Configure PostgreSQL

Create a PostgreSQL database for the application:

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

Open `apps/backend/.env` and update the values for your machine:

```env
DATABASE_URL="postgresql://<postgres-user>:<postgres-password>@localhost:5432/procurement_db?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="1d"
PORT=3000
```

Replace `<postgres-user>` and `<postgres-password>` with your local PostgreSQL credentials. If your PostgreSQL server uses a different host, port, or database name, update those parts of `DATABASE_URL` as well.

## Set Up Prisma

Generate the Prisma client:

```bash
npm --workspace apps/backend run prisma:generate
```

Run the database migrations:

```bash
npm --workspace apps/backend run prisma:migrate
```

## Start the Application

Start the backend API in one terminal:

```bash
npm run dev:backend
```

Start the React client in a second terminal:

```bash
npm run dev:client
```

## Open the App

After both services are running, open:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api`
- Swagger API docs: `http://localhost:3000/api/docs`

The frontend expects the backend to be running at `http://localhost:3000/api`.

## Build and Test

Build all workspaces:

```bash
npm run build
```

Run backend tests:

```bash
npm test
```

Preview the built frontend:

```bash
npm --workspace apps/client run preview
```

## Troubleshooting

If the backend cannot connect to PostgreSQL, check that:

- PostgreSQL is running.
- The database exists.
- `apps/backend/.env` contains the correct `DATABASE_URL`.
- The PostgreSQL user has permission to create and update tables.

If the frontend cannot call the API, check that:

- The backend is running on port `3000`.
- The frontend is running on port `5173`.
- The API URL in `apps/client/src/api.ts` matches the backend URL.

If protected API endpoints return `401`, log in again and use a fresh bearer token.

If protected API endpoints return `403`, the logged-in user may not have the required role.
