# mern-vite-template

Minimal, production-minded MERN + Vite starter kit with:

- Express + Mongoose REST API (server)
- React + Vite client (client)
- JWT auth, role-based admin guard, password hashing
- Seeding, rate-limiting, basic security headers
- Ready-to-use structure, env examples, .gitignore, and dev scripts

Use this repo as a headstart for new MERN projects — sensible defaults, DX improvements, and a small, extensible codebase.

---

## Quickstart (Windows)

1. Clone
   - git clone <repo-url>
2. Server
   - cd server
   - copy `.env.example` → `.env` and fill values
   - npm install
   - npm run dev (starts server with nodemon)
   - npm run seed (creates admin user from env values)
3. Client
   - cd ../client
   - copy `.env.example` → `.env` and fill values
   - npm install
   - npm run dev (starts Vite dev server)
4. Test protected admin route
   - POST /api/auth/login → get token
   - GET /api/admin/dashboard with header `Authorization: Bearer <token>`

---

## What this template includes

- Server (Express)
  - MongoDB connection via Mongoose
  - JWT authentication and role claims (user/admin)
  - Password hashing with bcrypt (pre-save hook)
  - Rate limiting (express-rate-limit), security headers (helmet), CORS configured via CLIENT_URL
  - Structured controllers / routes / middlewares
  - Seeder script to create an admin user
- Client (React + Vite)
  - React Router for routing
  - ProtectedRoute wrapper for client-side route guarding
  - Axios instance for API calls
  - Example pages and layouts
- Tooling & DX
  - .env.example files, .gitignore
  - ESLint + Prettier (configs present or recommended)
  - npm scripts for dev/start/seed/lint/test
  - Test scaffold suggestion using Jest + Supertest + mongodb-memory-server (recommended)

---

## Tech stack & key packages

- Server
  - express — HTTP server
  - mongoose — MongoDB ODM
  - bcryptjs — password hashing
  - jsonwebtoken — JWT auth
  - dotenv — env
  - express-async-handler — async error handling
  - cors, helmet, express-rate-limit — security and hardening
  - nodemon (dev) — dev restart
  - jest / supertest / mongodb-memory-server — recommended testing stack
- Client
  - react, react-dom
  - vite — build/dev tool
  - react-router-dom — routing
  - axios — HTTP client
  - optional: context/hooks for auth state

---

## Folder structure (what goes where)

### Client (Vite + React)

Root (client/)

- .env / .env.example — client runtime config (VITE\_ prefixed vars). .env.example documents keys; never commit .env.
- eslint.config.js — ESLint config for client code.
- index.html — Vite HTML entry.
- package.json / package-lock.json — client scripts & deps.
- public/ — static assets served as-is (vite.svg, favicon, etc.).
- vite.config.js — Vite config (dev server, aliases, proxy).

src/

- api/
  - axios.js — centralized axios instance (baseURL, interceptors, token handling).
- App.jsx — top-level React component (providers and routes).
- main.jsx — React entry that mounts App.
- index.css — global styles / resets.
- assets/ — images, SVGs and static media used by UI.
- components/
  - common/ — small reusable UI pieces (buttons, inputs, form fields).
  - navigation/ — header, sidebar, nav components.
  - ui/ — design primitives (cards, modals).
- context/ — React Context providers (AuthProvider, ThemeProvider).
- hooks/ — custom hooks (useAuth, useFetch, useForm).
- layouts/
  - MainLayout.jsx — layout wrapper for pages (header/footer/sidebar).
- pages/ — route-level pages (Login, Dashboard, Profile, etc.).
- routes/
  - AppRoutes.jsx — declares app routes with react-router.
  - ProtectedRoute.jsx — client-side guard; redirects to /login when unauthenticated.
- utils/ — small helpers: formatters, validators, constants.

Notes

- Client-side ProtectedRoute is UX-only; always rely on server auth for true protection.
- Keep API URL in env (VITE_API_URL) and use axios instance.

---

### Server (Express + Mongoose)

Root (server/)

- .env / .env.example — server runtime config (MONGO*URI, MONGO_DB_NAME, JWT_SECRET, CLIENT_URL, PORT, ADMIN*\* for seeding).
- package.json / package-lock.json — server scripts & deps.
- server.js — entrypoint: loads env, connects DB, and starts server process.
- app.js — exported Express app (middleware, routes, error handler). Importable in tests.
- seedAdmin.js — idempotent seeder script to create admin user from env vars (relies on model pre-save hashing).

config/

- db.js — mongoose connection logic; reads MONGO_URI and optional MONGO_DB_NAME and handles connection options / logging.

controllers/

- authController.js — register and login handlers, JWT generation, response shaping.

middlewares/

- authMiddleware.js — protect middleware (verifies JWT, attaches req.user) and admin guard (checks req.user.role).
- errorMiddleware.js — centralized error formatter (consistent JSON responses).

models/

- User.js — Mongoose schema for users: fields, validation, unique email(lowercased), password: select:false, pre-save password hashing, matchPassword method. Collection set to `users`.

routes/

- authRoutes.js — /api/auth endpoints (register, login).
- adminRoutes.js — /api/admin endpoints (example protected admin routes; mounted with protect + admin middlewares).

utils/

- helper utilities (token helpers, response helpers, constants). Good place for future services.

Notes

- app.js is exported for testability; server.js performs process lifecycle and DB connect.
- seedAdmin.js should not double-hash passwords — rely on model pre-save for hashing.
- If MONGO_URI has no DB path, set MONGO_DB_NAME to avoid creating the default "test" DB in Atlas.

---

## Important environment variables

(server/.env.example provided)

- MONGO_URI — connection string (mongodb+srv or mongodb)
- MONGO_DB_NAME — optional db name (if omitted and URI lacks path, default "test" used)
- JWT_SECRET — strong secret for signing JWTs
- CLIENT_URL — allowed origin for CORS (e.g., http://localhost:5173)
- PORT — server port (default 5000)
- ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME — seeder values

(client/.env.example provided)

- VITE_API_URL — URL of server API (e.g., http://localhost:5000/api)

Notes:

- Never commit `.env`. Use `.env.example` to document keys.
- If MONGO_URI includes a DB path (mongodb.net/myDB), that DB will be used. If not, set MONGO_DB_NAME.

---

## Auth flow (brief)

- Register: POST /api/auth/register
  - Normalizes email to lowercase, stores hashed password, returns JWT
- Login: POST /api/auth/login
  - Finds by lowercase email, uses .select('+password') since schema hides password, compares with bcrypt
  - Returns JWT with payload { id, role }
- Protected endpoints:
  - protect middleware reads Authorization header `Bearer <token>`, verifies JWT, loads user (without password) into req.user
  - admin middleware checks req.user.role === "admin"
- Client: store token in secure place (HTTP-only cookie recommended for production; localStorage for simple demos). ProtectedRoute only handles client navigation — server must enforce protection.

---

## Seeder notes

- seedAdmin.js uses User.create(...) and relies on the User model pre-save hook to hash the password.
- If you previously created admin records manually, delete or update them before rerunning seeder (avoid double-hash).
- Run: cd server && npm run seed

---

## Scripts (server)

- npm run dev — nodemon server.js (development)
- npm start — node server.js (production)
- npm run seed — run seedAdmin.js
- npm run lint — run ESLint
- npm test — run tests (Jest)

(client scripts generally: npm run dev, npm run build, npm start)

---

## Testing & CI (recommended)

- Integration tests: jest + supertest + mongodb-memory-server for isolated DB tests.
- Add GitHub Actions to run lint and tests on push/PR.
- Example test scaffold exists in suggestions (server/tests).

---

## Docker & deployment (recommended)

- Provide Dockerfile for server and docker-compose for local dev (server + mongo).
- In production, run server behind a reverse proxy (nginx) and use managed MongoDB (Atlas) or a production-grade self-hosted cluster.

---

## Security & Production tips

- Use strong JWT_SECRET, rotate keys if needed.
- Store secrets in environment or secret manager (AWS Secrets Manager, Azure Key Vault, etc.).
- Use HTTPS and secure cookie flags in production.
- Consider account lockout or rate-limited auth endpoints to prevent brute force.
- Add input sanitization (express-mongo-sanitize, xss-clean) and validation for requests.

---

## Contributing / Templates use

- This template is intended as a starting point. Add your features, update configs, and adapt to your infra.
- Provide a LICENSE (MIT recommended) when publishing.
- Keep `.env` out of VCS; update `.env.example` as new env variables are added.

---

If you want, I can:

- Draft a concise README.md in this repo (apply file),
- Add Dockerfile + docker-compose,
- Add Jest + supertest test scaffold and a CI workflow,
- Or create a Postman collection documenting auth endpoints.

Which should I add next?
