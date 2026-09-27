# ERP System

A PERN stack ERP application for managing the sales workflow from customer enquiries through quotations, sales orders, inventory, and dispatches.

## Features

- JWT based authentication with `ADMIN` and `SALES_USER` roles.
- Customer and product records, inventory tracking, and enquiry management.
- Quotation creation and calculation, sales order confirmation, and dispatch management.
- React interface with protected routes and role aware navigation.
- Express REST API backed by PostgreSQL.

## Requirements

- Node.js (18 or later) and npm
- PostgreSQL

## Getting started

1. Create a PostgreSQL database, then initialize it with `backend/sql/schema.sql`. To load the sample records, run `backend/sql/seed.sql` after the schema.
2. Create `backend/.env` with the database connection values and a strong JWT secret:

   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=erp_system
   DB_USER=postgres
   DB_PASSWORD=your_database_password
   JWT_SECRET=replace_with_a_long_random_secret
   JWT_EXPIRES_IN=1d
   CLIENT_URL=http://localhost:5173
   ```

3. In a terminal, install dependencies and start the API:

   ```sh
   cd backend
   npm install
   npm run dev
   ```

4. In another terminal, install frontend dependencies and start Vite:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

   Open the URL printed by Vite (by default `http://localhost:5173`). The frontend API client uses `http://localhost:5000/api` by default; configure `VITE_API_URL` in `frontend/.env` if the API is hosted elsewhere.

The API checks its PostgreSQL connection before listening. Its root endpoint is `GET /` and returns a status message.

## API modules

All API routes are prefixed with `/api`:

| Module | Route prefix |
| --- | --- |
| Authentication | `/auth` |
| Customers | `/customers` |
| Products | `/products` |
| Inventory | `/inventory` |
| Enquiries | `/enquiries` |
| Quotations | `/quotations` |
| Sales orders | `/sales-orders` |
| Dispatches | `/dispatches` |

Most application routes require authentication. See [API documentation](docs/API-DOCUMENTATION.md) and the [Postman collection](postman/PERN-ERP.postman_collection.json) for endpoint details and request examples.

## Project layout

- `backend/` — Express API, PostgreSQL schema and seed data.
- `frontend/` — React application built with Vite.
- `docs/` — API, data model, and workflow documentation.
- `postman/` — Postman collection for the API.
