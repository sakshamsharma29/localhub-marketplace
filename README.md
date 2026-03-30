# LocalHub Marketplace

A full-stack local business marketplace — Node.js + Express + MySQL backend with a vanilla HTML/CSS/JS frontend.

---

## Project Structure

```
localhub-marketplace/
├── frontend/          # Static HTML/CSS/JS pages
│   ├── index.html         ← Homepage with hero, businesses, products
│   ├── business-list.html ← Browse / filter businesses & view detail
│   ├── product.html       ← Product detail page
│   ├── cart.html          ← Shopping cart
│   ├── checkout.html      ← Checkout & order placement
│   ├── login.html         ← Sign in
│   ├── register.html      ← Create account
│   ├── css/style.css      ← Full design system
│   └── js/
│       ├── main.js         ← API helper, navbar, footer, toasts
│       ├── cart.js         ← Cart logic (localStorage)
│       └── auth.js         ← Login/register forms, guards
├── backend/
│   ├── server.js           ← Express app entry point
│   ├── config/db.js        ← MySQL pool connection
│   ├── models/             ← DB query functions
│   ├── controllers/        ← Business logic
│   └── routes/             ← Express routers + auth middleware
├── database/schema.sql     ← Full MySQL schema + sample data
├── uploads/                ← Uploaded images (auto-created)
├── .env.example
└── package.json
```

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Setup database
```bash
# Create database and import schema
mysql -u root -p < database/schema.sql
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env with your MySQL credentials
```

### 4. Run the server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Open **http://localhost:5000** in your browser.

---

## API Endpoints

### Users
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/users/register | — | Register new user |
| POST | /api/users/login | — | Login, get JWT |
| GET | /api/users/me | ✓ | Get own profile |
| PUT | /api/users/me | ✓ | Update profile |
| PUT | /api/users/me/password | ✓ | Change password |

### Businesses
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/businesses | — | List all (filter: city, category, search) |
| GET | /api/businesses/categories | — | List categories |
| GET | /api/businesses/:id | — | Get single business |
| GET | /api/businesses/my | ✓ | Owner's businesses |
| POST | /api/businesses | ✓ | Create business |
| PUT | /api/businesses/:id | ✓ | Update business |
| DELETE | /api/businesses/:id | ✓ | Delete business |

### Products
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/products | — | List all (filter: businessId, category, search) |
| GET | /api/products/:id | — | Get single product |
| POST | /api/products | ✓ | Create product |
| PUT | /api/products/:id | ✓ | Update product |
| DELETE | /api/products/:id | ✓ | Delete product |

### Orders
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/orders | ✓ | List orders (own / all for admin) |
| GET | /api/orders/:id | ✓ | Get order detail |
| POST | /api/orders | ✓ | Place order |
| PATCH | /api/orders/:id/status | ✓ | Update order status |

---

## Tech Stack
- **Backend**: Node.js, Express, MySQL2, JWT, bcryptjs, Multer
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+), Google Fonts
- **Database**: MySQL 8+
- **Auth**: JWT Bearer tokens stored in localStorage

## Features
- 🔐 JWT authentication with role-based access (customer / business_owner / admin)
- 🛒 Cart with localStorage persistence and same-shop enforcement
- 📦 Order flow with stock decrement and transaction safety
- 🔍 Search + category + city filtering
- 📱 Fully responsive design
- 🖼 Image upload via Multer (logo, banner, products)
- ✅ Input validation on both frontend and backend
