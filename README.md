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

## Deploy to Vercel

### Backend

1. Go to https://vercel.com and sign in with GitHub
2. Click **Add New Project**
3. Import your GitHub repository
4. Set **Root Directory** to `backend`
5. Set **Framework Preset** to `Other`
6. Add these Environment Variables:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = your secret key
   - `NODE_ENV` = production
7. Click **Deploy**
8. Copy the live backend URL — you will need it for the frontend

### Frontend

1. Click **Add New Project** again on Vercel
2. Import the same GitHub repository
3. Set **Root Directory** to `frontend`
4. Set **Framework Preset** to `Create React App`
5. Add this Environment Variable:
   - `REACT_APP_API_URL` = your live backend URL from above
6. Click **Deploy**
7. Your frontend is now live

### After any code change

```bash
git add .
git commit -m "your message"
git push origin main
```

Vercel redeploys both frontend and backend automatically.

---

## Push to GitHub

```bash
git add .
git commit -m "your message"
git push origin main
```

---

Built by Shahzaib Khan