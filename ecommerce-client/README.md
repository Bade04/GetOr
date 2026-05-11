# GetOr Frontend

Updated: May 2026

GetOr is a full-stack e-commerce portfolio project with a React + Vite storefront connected to an Express + Sequelize backend. The frontend focuses on a believable shopping flow: searchable product browsing, cart updates, checkout, order history, and package tracking.

## Stack

- React 19
- Vite
- React Router
- Axios
- Vitest
- Playwright

## What This Frontend Shows

- A polished landing experience that explains the product quickly
- Search-driven product discovery
- Cart quantity updates synced with the backend API
- Checkout and payment summary flow
- Orders page with post-purchase tracking links
- Deployment-ready frontend for Vercel

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Add a `.env.local` file if you want to target a custom backend:

```bash
VITE_API_URL=http://localhost:3000
```

3. Start the frontend:

```bash
npm run dev
```

The app expects the backend API to expose routes such as:

- `/api/products`
- `/api/cart-items`
- `/api/payment-summary`
- `/api/orders`

## Scripts

- `npm run dev` starts the Vite dev server
- `npm run build` creates a production build
- `npm run test` runs unit tests with Vitest
- `npm run test:e2e` runs Playwright end-to-end tests

## Portfolio Blurb

Full-stack e-commerce app with React, Vite, Express, Sequelize, Render, and Vercel deployment. Includes searchable product browsing, persistent cart behavior, checkout flow, order history, and package tracking.
