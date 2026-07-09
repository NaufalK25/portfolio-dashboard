# Portfolio Dashboard

A CMS-style dashboard for managing my portfolio content — repos, repo metadata, and related stats — built with React, TypeScript, and Vite.

## Prerequisites

- **Node.js**: v20 or newer (LTS recommended; developed and tested on v24)
- **npm**: v10 or newer (ships with Node 20+)
- A running instance of the backend API this dashboard talks to (see `VITE_BASE_URL` below)
- A [Google reCAPTCHA](https://www.google.com/recaptcha/admin) site key for the login page

Check your versions:
```bash
node -v
npm -v
```

## Getting Started

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/naufalK25/portfolio-dashboard
   cd portfolio-dashboard
   npm install
   ```

2. **Configure environment variables**

   Copy the example file and fill in your own values:
   ```bash
   cp .env.example .env
   ```
   | Variable | Description |
   |---|---|
   | `VITE_BASE_URL` | Base URL of the backend API this dashboard consumes |
   | `VITE_GOOGLE_SITE_KEY` | Google reCAPTCHA v2 site key used on the login page |

3. **Run the dev server**
   ```bash
   npm run dev
   ```
   Vite will print a local URL (default `http://localhost:5173`).

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check with `tsc`, then build a production bundle to `dist/` |
| `npm run lint` | Run ESLint across the project (fails on warnings) |
| `npm run preview` | Serve the production build from `dist/` locally |

## Tech Stack

- **React 19** + **TypeScript** — UI and type safety
- **Vite** — dev server and build tooling
- **Tailwind CSS 4** + **daisyUI 5** — styling and components
- **React Router 6** — client-side routing
- **Recharts** — dashboard charts
- **react-data-table-component** — data tables
- **react-toastify** — toast notifications
- **ESLint (flat config)** + **typescript-eslint** — linting

## Notes

- Authentication is token-based; the dashboard checks `localStorage` for an `access_token` and redirects to `/login` if missing (see `src/hooks/useAuth.ts`).
- No automated test suite exists yet — verify changes manually by running through the login, dashboard, repo, and repo-name pages.
