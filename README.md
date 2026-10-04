# Al Qaswa — Fine Jewellery Store

Next.js storefront (`/`) + Node/Express/MongoDB API (`/backend`).

## Run locally
```bash
# 1. API  (needs MongoDB — local, Docker, or a free MongoDB Atlas URI in backend/.env)
cd backend
cp .env.example .env      # set MONGO_URI and a long JWT_SECRET
npm install
npm run seed              # categories, 12 products, WELCOME10 coupon, admin user
npm run dev               # http://localhost:5000

# 2. Storefront
cd ..
cp .env.local.example .env.local
npm install
npm run dev               # http://localhost:3000
```
Admin panel: http://localhost:3000/admin — log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `backend/.env`
(default `admin@alqaswa.pk` / `Admin@12345` — change it after first login).

## Pages
| Route | What |
|---|---|
| `/` | Home (featured products + categories from the API; falls back to `lib/data.ts` if the API is down) |
| `/shop` | All products — `?category=rings&q=gold&sort=price-asc&min=&max=&sale=true&inStock=true&page=2` |
| `/product/[slug]` | Product page: gallery, sizes, qty, buy now, reviews, related |
| `/cart`, `/checkout` | Bag with discount code, checkout (COD / bank transfer, saved addresses) |
| `/order/[number]`, `/track` | Order confirmation & tracking (order no. + phone) |
| `/account`, `/wishlist` | Login/register, orders, cancel, profile, addresses, password; wishlist |
| `/bridal`, `/contact`, `/help/*` | Bridal sitting request, contact form, info pages (copy in `lib/pages.ts`) |
| `/admin/*` | Dashboard, orders, products, categories, discounts, customers, reviews, messages, subscribers, settings |

## Structure
```
app/(store)/      storefront pages (shared Header/Footer layout)
app/admin/        admin panel
components/       Header, ProductCard, PageHead, Sections, Art … ; components/admin = generic CRUD table + form
lib/api.ts        API client & types      lib/store.tsx  cart / auth / wishlist context
app/globals.css   design tokens + home    app/pages.css  inner pages   app/admin/admin.css
backend/          see backend/README.md
```

The free-delivery bar is commented out in `components/Header.tsx`. To show any message there, set
“Top announcement bar” in Admin → Settings. Delivery fee and free-delivery threshold are also set there.
