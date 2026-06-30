# 🛍️ ShopNest — Full Stack MERN E-Commerce Store

A complete, production-style e-commerce web app built with **MongoDB, Express, React, and Node.js**. Includes user auth, product browsing with filters/search, cart, wishlist, checkout, order tracking, reviews, and a full admin dashboard.

## Features

- 🔐 JWT authentication (register/login/profile)
- 🛒 Cart + wishlist (persisted in localStorage)
- 🔍 Product search, category filters, price range, sorting, pagination
- ⭐ Product reviews and ratings
- 📦 Multi-step checkout + order history + order tracking
- ⚙️ Admin dashboard: manage products (CRUD) and orders (status updates)
- 📱 Fully responsive, custom-designed UI (no UI library — hand-built CSS)

## Tech Stack

**Frontend:** React 18, React Router v6, Axios, React Toastify, custom CSS
**Backend:** Node.js, Express, MongoDB + Mongoose, JWT, bcryptjs

---

## 1. Prerequisites

Install these first if you don't have them:

- **Node.js** (v18+) — https://nodejs.org
- **MongoDB** — either:
  - Install locally: https://www.mongodb.com/try/download/community, or
  - Use a free cloud DB at https://www.mongodb.com/cloud/atlas (recommended if you don't want to install MongoDB)

Check versions:
```bash
node -v
npm -v
```

---

## 2. Project Structure

```
ecommerce/
├── backend/         # Express + MongoDB API
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   └── server.js
└── frontend/        # React app
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── App.js
    │   └── index.js
    └── .env.example
```

---

## 3. Run It Locally

### Step 1 — Backend setup

```bash
cd ecommerce/backend
npm install
```

Create your `.env` file from the example:
```bash
cp .env.example .env
```

Open `.env` and set your values:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=replace_this_with_a_long_random_string
NODE_ENV=development
```

> If using MongoDB Atlas instead of local MongoDB, paste your Atlas connection string into `MONGO_URI`, e.g. `mongodb+srv://user:pass@cluster.mongodb.net/ecommerce`

Start the backend:
```bash
npm run dev
```
You should see:
```
✅ MongoDB Connected: ...
🚀 Server running on port 5000
```

### Step 2 — Seed sample products (one-time, optional but recommended)

With the backend running, in a new terminal:
```bash
curl -X POST http://localhost:5000/api/products/seed
```
This loads 12 sample products with real images so the store isn't empty.

### Step 3 — Frontend setup

Open a **new terminal window**:
```bash
cd ecommerce/frontend
npm install
```

Create your `.env`:
```bash
cp .env.example .env
```
(Defaults work fine for local dev — `REACT_APP_API_URL=http://localhost:5000` — the app also uses a CRA proxy to `localhost:5000` automatically.)

Start the frontend:
```bash
npm start
```

The app opens automatically at **http://localhost:3000** 🎉

### Step 4 — Create an admin user (optional)

1. Register a normal account from the UI at `/register`.
2. Open MongoDB (Compass, Atlas UI, or `mongosh`) and find that user in the `users` collection.
3. Change their `role` field from `"user"` to `"admin"`.
4. Log out and log back in — you'll now see an **Admin Panel** link in your account menu, where you can manage products and orders.

---

## 4. Push This Project to GitHub

From the root `ecommerce/` folder:

```bash
cd ecommerce

# Initialize git (skip if already a repo)
git init

# Stage all files (the .gitignore already excludes node_modules, .env, build/)
git add .

# Commit
git commit -m "Initial commit: MERN e-commerce app"
```

Create a new empty repository on GitHub (no README/license, since you already have files):
1. Go to https://github.com/new
2. Name it (e.g. `shopnest-mern`), leave it empty, click **Create repository**
3. Copy the remote URL GitHub shows you (HTTPS or SSH)

Then connect and push:
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

For future changes:
```bash
git add .
git commit -m "Describe your change"
git push
```

> **Important:** never commit your real `.env` files — they're already excluded by `.gitignore`. Anyone cloning your repo should copy `.env.example` → `.env` and fill in their own secrets, as described in Step 1 and Step 3 above.

---

## 5. Deploying (optional next step)

- **Backend:** Render, Railway, or Fly.io (set the same env vars as your `.env`)
- **Database:** MongoDB Atlas (free tier works)
- **Frontend:** Vercel or Netlify (set `REACT_APP_API_URL` to your deployed backend URL)

---

## API Reference (quick overview)

| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create account | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Get current user | User |
| PUT | `/api/auth/profile` | Update profile | User |
| GET | `/api/products` | List products (filters/search/sort/pagination) | Public |
| GET | `/api/products/featured` | Featured products | Public |
| GET | `/api/products/:id` | Product detail | Public |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |
| POST | `/api/products/:id/reviews` | Add review | User |
| POST | `/api/orders` | Place order | User |
| GET | `/api/orders/my` | My orders | User |
| GET | `/api/orders/:id` | Order detail | User/Admin |
| GET | `/api/orders` | All orders | Admin |
| PUT | `/api/orders/:id/status` | Update order status | Admin |

Enjoy your store! 🛍️
