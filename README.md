# ☕ Brewhaus Coffee — Online Ordering System

A full-stack online coffee shop ordering website built with **Node.js**, **Express**, **HTML/CSS/JavaScript**, and **JSON file storage**.

---

## 🚀 Features

### Customer Features
- 🍽️ **Full Menu** with categories (Hot, Cold, Blended, Food, Merch)
- 🔍 **Search & Filter** by category or keyword
- ⚙️ **Item Customization** — size, milk type, add-ons per item
- 🛒 **Shopping Cart** with quantity controls, persistent across pages
- 💸 **Promo Codes** — `BREW10` (10% off), `WELCOME` (₱50 off)
- 🏠 **Pickup or Delivery** order type selection
- 💳 **Payment Options** — Cash, GCash, Maya, Card
- 📋 **Order Tracking** with step-by-step status
- 👤 **User Accounts** — register, login, order history
- ⭐ **Loyalty Points** — earn 1 point per ₱10 spent

### Admin Features
- 📊 **Dashboard** with stats (daily orders, revenue, pending)
- 📋 **Order Management** — view all orders, update status
- 🍽️ **Menu Management** — mark items available/sold out

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Backend | Node.js + Express |
| Frontend | Vanilla HTML, CSS, JavaScript |
| Storage | JSON flat files |
| Auth | express-session + bcryptjs |
| Styling | Custom CSS with Google Fonts |

---

## 📦 Installation

### Prerequisites
- Node.js v16+ 
- npm

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/brewhaus-coffee.git
cd brewhaus-coffee

# 2. Install dependencies
npm install

# 3. Start the server
npm start
# or for development with auto-reload:
npm run dev
```

Open your browser at **http://localhost:3000**

---

## 🗂 Project Structure

```
brewhaus/
├── server.js              # Main Express server
├── package.json
├── routes/
│   ├── auth.js            # Login, register, logout
│   ├── menu.js            # Menu API
│   ├── orders.js          # Order placement & tracking
│   ├── users.js           # User profile
│   └── admin.js           # Admin dashboard API
├── data/
│   ├── menu.json          # Menu items & categories
│   ├── orders.json        # Order records
│   └── users.json         # User accounts
└── public/
    ├── css/style.css      # All styles
    ├── js/app.js          # Cart, auth, shared utilities
    ├── index.html         # Homepage
    ├── menu.html          # Menu & ordering
    ├── cart.html          # Cart review
    ├── checkout.html      # Checkout flow
    ├── orders.html        # Order tracking
    ├── account.html       # User account
    └── admin.html         # Admin dashboard
```

---

## 🔐 Default Credentials

| Role | Credentials |
|------|-------------|
| Admin | Password: `brewhaus-admin-2024` (at `/admin`) |
| Customer | Register at the site |

> ⚠️ **Important**: Change the admin password in `routes/admin.js` before deploying.

---

## 🎁 Promo Codes

| Code | Discount |
|------|----------|
| `WELCOME` | ₱50 off first order |
| `BREW10` | 10% off any order |

---

## 🌐 Deployment

For production deployment, consider:

- **Railway** or **Render** — free Node.js hosting
- **Heroku** — easy git-based deployment
- Replace JSON storage with **MongoDB** or **PostgreSQL** for scale
- Add proper environment variables for secrets

---

## 📄 License

MIT — free to use and modify.

---

Made by Geahid Agao
