# Deployment

This repo is set up for:

- `ecommerce-client` on Vercel
- `ecommerce-server` on Render

## Frontend on Vercel

Set the Vercel project root to `ecommerce-client`.

Build settings:

- Build command: `npm run build`
- Output directory: `dist`

Environment variables:

- `VITE_API_URL=https://your-render-service.onrender.com`

`vercel.json` is included so React Router routes rewrite to `index.html`.

## Backend on Render

Set the Render service root to `ecommerce-server`, or use the included `render.yaml`.

Build settings:

- Build command: `npm install`
- Start command: `npm start`

Recommended environment variables:

- `NODE_ENV=production`
- `CORS_ORIGINS=https://your-vercel-project.vercel.app,https://*.vercel.app`
- `ENABLE_RESET_ROUTE=false`

Optional database variables for a persistent production database:

- `DB_TYPE=postgres` or `mysql`
- `RDS_HOSTNAME`
- `RDS_PORT`
- `RDS_DB_NAME`
- `RDS_USERNAME`
- `RDS_PASSWORD`

If those database variables are not set, the backend falls back to `database.sqlite`, which is fine for local work but not ideal for long-term production persistence on Render.

## Deploy order

1. Push this repo to GitHub.
2. Deploy the backend to Render first.
3. Copy the live Render URL.
4. Deploy the frontend to Vercel with `VITE_API_URL` set to that Render URL.
5. Add the Vercel domain to `CORS_ORIGINS` on Render.

If you want Vercel preview deployments to work too, include a wildcard origin such as `https://*.vercel.app`.

## Health check

Render can use:

- `/api/health`
