# car rental app

> car rental app

<div dir="rtl"><b>تاجير سيارات</b> — تاجير سيارات</div>

`car-rental-app` · landing-page · 35 files · generated from the CodeSky template gallery

## What this is

This is a car rental marketplace template built with React, TypeScript, and Tailwind CSS on the frontend, backed by a Node.js/Express API with PostgreSQL. It provides a landing page experience where users can browse cars by category and location, view vehicle details, and submit rental bookings. The template includes database schema and seed data, making it suitable for developers who want a functioning car rental interface without starting from scratch.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18.2.0 + Vite |
| Backend | — |
| Database | SQL schema included |
| Tests | none |
| Container | none |

## Architecture

The frontend is a single-page React application using Vite for development and Tailwind for styling. It communicates with a backend Express API through an axios client, with fallback logic that uses mock data when the API is unavailable. Components include car listings, search filters, booking forms, and detail views, all defined with TypeScript interfaces. The backend exposes RESTful endpoints for cars, bookings, categories, and locations, connecting to PostgreSQL through configuration in database.ts. Two tables—cars and bookings—form the data layer, initialized from schema.sql and populated by seed.sql. Environment variables control database credentials, CORS origins, JWT secrets, and rate limiting, though no authentication middleware is evident in the endpoints themselves. The API service layer logs warnings and switches to mock data whenever backend requests fail, allowing the frontend to function independently during development.

### Layout

```
backend/.env.example
backend/README.md
backend/package.json
backend/src/app.ts
backend/src/config/database.ts
backend/src/controllers/bookingController.ts
backend/src/controllers/carController.ts
backend/src/models/index.ts
backend/src/routes/index.ts
backend/src/server.ts
backend/tsconfig.json
database/README.md
database/schema.sql
database/seed.sql
frontend/index.html
frontend/package.json
frontend/postcss.config.js
frontend/src/App.tsx
frontend/src/api/client.ts
frontend/src/api/mockData.ts
frontend/src/components/BookingForm.tsx
frontend/src/components/CarCard.tsx
frontend/src/components/CarDetails.tsx
frontend/src/components/CarListings.tsx
frontend/src/components/Footer.tsx
frontend/src/components/Header.tsx
frontend/src/components/HomePage.tsx
frontend/src/index.css
frontend/src/main.tsx
frontend/src/services/apiService.ts
frontend/src/types/index.ts
frontend/tailwind.config.js
frontend/tsconfig.json
frontend/tsconfig.node.json
frontend/vite.config.ts
```

### Data model

Tables defined in the SQL schema:

- `bookings`
- `cars`

### API surface

```
DELETE /bookings/:id
GET    /
GET    /bookings
GET    /bookings/:id
GET    /cars
GET    /cars/:id
GET    /cars/search
GET    /categories
GET    /health
GET    /locations
POST   /bookings
PUT    /bookings/:id/status
```

## Running it

```bash
# frontend
cd frontend && npm install && npm run dev
```

Configuration is read from an `.env` file. Copy `.env.example` and set:

- `CORS_ORIGINS`
- `DB_HOST`
- `DB_NAME`
- `DB_PASSWORD`
- `DB_USER`
- `JWT_SECRET`
- `NODE_ENV`
- `PORT`
- `RATE_LIMIT_MAX_REQUESTS`
- `RATE_LIMIT_WINDOW_MS`

## What is next

1. **Add user authentication and authorization** — The template references JWT_SECRET in environment variables but has no login, signup, or protected routes, so bookings are anonymous and unverified.
2. **Remove mock data fallbacks and hardcoded seeds** — The frontend falls back to mock data on every API error, and the database uses seed.sql with sample cars, which are inappropriate for production traffic.
3. **Write unit and integration tests** — No test files exist for either frontend components or backend endpoints, leaving behavior unvalidated and regressions undetected.
4. **Implement booking confirmation and email notifications** — Bookings are created via POST but users receive no confirmation, receipt, or communication about their reservation status.
5. **Add payment processing integration** — The booking flow collects rental details but has no payment step, making it impossible to charge customers or hold deposits.
6. **Containerize with Docker and add CI/CD** — No Dockerfile or CI configuration exists, so deployment and environment consistency depend entirely on manual setup.
7. **Externalize configuration and secrets management** — Database credentials and JWT secrets live in a .env.example file with no guidance on rotation, vaults, or per-environment management.

### Markers left in the code

Found by scanning for TODO/FIXME/placeholder:

```
frontend/src/services/apiService.ts: console.warn('Cars API failed, using mock data:', error);
frontend/src/services/apiService.ts: console.warn(`Car ${id} API failed, using mock data:`, error);
frontend/src/services/apiService.ts: console.warn('Cars search API failed, using mock data:', error);
frontend/src/services/apiService.ts: console.warn('Bookings API failed, using mock data:', error);
frontend/src/services/apiService.ts: console.warn('Categories API failed, using mock data:', error);
frontend/src/services/apiService.ts: console.warn('Locations API failed, using mock data:', error);
```

---

<sub>Exported from the CodeSky template gallery. Generated code — review before production use. <a href="https://codesky.ai">codesky.ai</a></sub>
