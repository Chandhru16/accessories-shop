# Accessories Shop — Full Setup Guide

This matches your plan exactly:
- Landing page → "Customer Visit" / "Owner Visit"
- Customer: login form (name, mobile, address, pincode) → OTP → home
  (category filter + search + cart) → add to cart → checkout with delivery
  charge → order confirmation (tick + "Order Confirmed") → SMS notification
- Owner: username/password login → dashboard with order list
  (No Stock / Not Deliverable / Delivered-with-tracking-ID buttons) →
  product management with delete icon

## Folder structure
```
accessories-shop/
├── client/   (Vite + React frontend)
└── server/   (Express + MongoDB backend)
```

## 1. Backend setup

```
cd server
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — your MongoDB connection string (local or MongoDB Atlas)
- `JWT_SECRET` — any long random string

Create the owner account (only needs to be done once):
```
node createOwner.js myshopowner mySecurePassword123
```

Start the server:
```
npm run dev
```
Server runs at `http://localhost:5000`.

## 2. Frontend setup

Copy these files into your existing `client` folder (you said it's already
set up — this code assumes the standard Vite React structure).

```
cd client
npm install react-router-dom axios js-cookie react-icons
cp .env.example .env
npm run dev
```
Runs at `http://localhost:5173`.

## 3. How OTP works right now

`server/services/smsService.js` currently just **logs the OTP to your
server's terminal** instead of sending a real SMS — so you can test the
whole flow for free. When you're ready to go live, swap in Twilio or
MSG91 credentials (there's a commented example already in that file) and
add your credentials to `.env`.

## 4. Order status flow (owner dashboard)

Each order row has three action buttons:
- **No Stock** → marks order `NoStock`, sends SMS to customer
- **Not Deliverable** → marks `NotAbleToDeliver`, sends SMS to customer
- **Delivered** → prompts for a courier tracking ID, marks `Delivered`,
  sends SMS with the tracking ID to the customer

## 5. What's mocked vs real

- Products: `client/src/data/products.js` has 4 sample products so the
  home page isn't empty on first run. As soon as `/server` is running and
  you add real products from the Owner Dashboard, the home page
  automatically switches to fetching from the database.
- SMS: mocked (console log) until you add Twilio/MSG91.

## 6. Next steps you'll likely want
- Add pagination or infinite scroll once product count grows
- Add image upload (Cloudinary/Multer) instead of pasting image URLs
- Add order history page for customers
- Deploy: frontend → Vercel, backend → Render, DB → MongoDB Atlas
