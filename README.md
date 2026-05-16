# Procurement Application (NestJS + React)

Monorepo containing:
- Backend: NestJS REST API with JWT auth, RBAC, Prisma/PostgreSQL, validation, logging, unit tests
- Client: React + TypeScript app for auth and procurement modules

## Apps
- apps/backend
- apps/client

## Quick Start
1. Create PostgreSQL DB and update apps/backend/.env
2. Install dependencies: npm run install:all
3. Run Prisma migration: npm --workspace apps/backend run prisma:migrate
4. Start backend: npm run dev:backend
5. Start client: npm run dev:client

For a complete dependency and setup checklist for a new machine, see [SETUP.md](./SETUP.md).
