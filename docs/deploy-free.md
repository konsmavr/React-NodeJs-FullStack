# Free Deployment (Fast Path)

This setup uses:

- Frontend + Backend: Render (free)
- Database: Neon Postgres (free)

## 1. Create free Neon database

1. Sign in to Neon.
2. Create a new project.
3. Copy the pooled connection string.
4. Add `?sslmode=require` if not already present.

Example:

`postgresql://user:pass@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

## 2. Deploy on Render from GitHub

1. In Render, click **New +** -> **Blueprint**.
2. Select this repository.
3. Render reads `render.yaml` and creates 2 services:
   - `react-nodejs-api`
   - `react-nodejs-web`

## 3. Set required env vars

For `react-nodejs-api`:

- `DATABASE_URL` = your Neon connection string
- `JWT_SECRET` = long random secret

For `react-nodejs-web`:

- `VITE_API_URL` = `https://<your-api-service>.onrender.com/api`

## 4. Verify live app

- API health: `https://<your-api-service>.onrender.com/health`
- Web app: `https://<your-web-service>.onrender.com`

## 5. Put links in README

Update the top "Live Demo" section in `README.md` with final URLs.
