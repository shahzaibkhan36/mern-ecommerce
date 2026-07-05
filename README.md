# ShopNest - MERN E-Commerce Store

A full stack e-commerce web app built with MongoDB, Express, React, and Node.js.

## Live Site

**Frontend:** https://mern-ecommerce-rho-amber.vercel.app

**Backend:** https://mern-ecommerce-7zth.vercel.app

**Database:** MongoDB Atlas

---

## Features

- Register, login, and manage your profile
- Browse products with search, filters, and sorting
- Add to cart and wishlist
- Checkout with Card or Cash on Delivery
- View order history and track orders
- Admin dashboard to manage products and orders

---

## Run Locally

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in your `.env`:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_random_string
NODE_ENV=development
```

```bash
npm run dev
```

### Seed sample products (run once)

```bash
curl -X POST http://localhost:5000/api/products/seed
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

App runs at **http://localhost:3000**

---

## Push to GitHub

```bash
git add .
git commit -m "your message"
git push origin main
```

Vercel redeploys automatically after every push.

---

Built by Shahzaib Khan