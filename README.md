# GetOr

GetOr is a full-stack e-commerce portfolio project built to demonstrate more than a static storefront. It combines a React + Vite frontend with an Express + Sequelize backend to show a complete shopping journey: product discovery, cart updates, checkout, order history, and tracking.

## Tech Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Express, Sequelize
- Testing: Vitest, Playwright
- Deployment: Vercel for the client, Render for the server

## Core Features

- Searchable product catalog
- Persistent cart and checkout flow
- Payment summary and order creation
- Orders page with tracking details
- Deployment configuration for separate frontend and backend hosting

## Project Structure

- `ecommerce-client/` contains the React frontend
- `ecommerce-server/` contains the Express API and data layer
- `render.yaml` provides a Render deployment template for the backend
- `DEPLOYMENT.md` documents how to deploy the full stack

## Run Locally

### Frontend

```bash
cd ecommerce-client
npm install
npm run dev
```

### Backend

```bash
cd ecommerce-server
npm install
npm start
```

By default, the frontend can target the backend through `VITE_API_URL`.

## Why This Works As a Portfolio Piece

This project is meant to show product thinking and delivery, not just isolated components. It gives recruiters a quick way to evaluate UI polish, API integration, state management, testing, and deployment readiness inside one app.

## Short Portfolio Description

Full-stack e-commerce app with React, Vite, Express, Sequelize, Render, and Vercel deployment. Built with searchable product browsing, cart persistence, checkout, order history, and shipment tracking.
