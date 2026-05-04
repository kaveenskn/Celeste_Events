# Céleste Events — Platform Monorepo

Three completely separate deployable apps sharing one MongoDB database.

```
celeste-platform/
├── client/   → User-facing site    (port 3000)
├── admin/    → Admin panel         (port 3002)
├── api/      → Backend API server  (port 3001)
└── package.json  (root scripts)
```

---

## Quick Start (Local Dev)

### 1. Install dependencies
```bash
# From the root folder
npm install          # installs concurrently
npm run install:all  # installs deps in all 3 apps
```

### 2. Set up environment variables

**api/.env.local**
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/celeste-events
JWT_SECRET=your-secret-32-chars-minimum
ADMIN_EMAIL=admin@celeste.com
ADMIN_PASSWORD=your-admin-password
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3002
```

**client/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**admin/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Run all three apps simultaneously
```bash
npm run dev
```

| App    | URL                        | Purpose              |
|--------|----------------------------|----------------------|
| Client | http://localhost:3000      | Users browse & book  |
| API    | http://localhost:3001      | Backend + DB         |
| Admin  | http://localhost:3002/login| Admin manages venues |

### 4. Seed sample data
```
POST http://localhost:3001/api/seed
```
Or visit http://localhost:3000 and click "Seed Sample Data".

---

## Deployment (Vercel — Recommended)

Deploy each app as a **separate Vercel project**. All three share the same MongoDB Atlas database.

### Step 1 — MongoDB Atlas (free)
1. Go to [atlas.mongodb.com](https://atlas.mongodb.com) → Create free cluster
2. Database Access → Add user → set username + password
3. Network Access → Add IP → `0.0.0.0/0` (allow all)
4. Connect → Drivers → copy the URI
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/celeste-events
   ```

### Step 2 — Deploy API first
1. Push `api/` folder to GitHub (or push whole monorepo)
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. **Root Directory**: set to `api`
4. Add environment variables:
   ```
   MONGODB_URI        = mongodb+srv://...
   JWT_SECRET         = your-32-char-secret
   ADMIN_EMAIL        = admin@yoursite.com
   ADMIN_PASSWORD     = secure-password
   CLIENT_URL         = https://celeste-client.vercel.app
   ADMIN_URL          = https://celeste-admin.vercel.app
   ```
5. Deploy → copy the URL (e.g. `https://celeste-api.vercel.app`)

### Step 3 — Deploy Client
1. New Project → same repo → **Root Directory**: `client`
2. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL = https://celeste-api.vercel.app
   ```
3. Deploy → copy URL (e.g. `https://celeste-client.vercel.app`)

### Step 4 — Deploy Admin
1. New Project → same repo → **Root Directory**: `admin`
2. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL = https://celeste-api.vercel.app
   ```
3. Deploy → copy URL (e.g. `https://celeste-admin.vercel.app`)

### Step 5 — Update API with final URLs
Go back to your **API** Vercel project → Settings → Environment Variables → update:
```
CLIENT_URL = https://celeste-client.vercel.app
ADMIN_URL  = https://celeste-admin.vercel.app
```
Then redeploy API.

---

## Custom Domains (Optional)

| App    | Example domain            |
|--------|---------------------------|
| Client | yourvenue.com             |
| Admin  | admin.yourvenue.com       |
| API    | api.yourvenue.com         |

Add each in Vercel → Project → Domains.

---

## App Breakdown

### 🌐 Client (`/client`) — User App
**URL**: `https://celeste-client.vercel.app`

Pages:
- `/` — Homepage with hero slider, trending venues, venue grid, about section
- `/hotels/[id]` — Venue detail with gallery, 360° tour, menu, booking wizard
- `/list-venue` — Marketing page for venue owners
- `/register` — Owner application form
- `/login` — Owner login
- `/owner/dashboard` — Owner's venue management
- `/owner/hotels/new` — Add a hotel
- `/owner/menu-items` — Manage menu
- `/owner/bookings` — View bookings
- `/owner/profile` — Edit profile

### 🛡️ Admin (`/admin`) — Admin Panel
**URL**: `https://celeste-admin.vercel.app`

Pages:
- `/login` — Admin login (redirects here by default)
- `/dashboard` — Stats overview + pending alerts
- `/venues` — **Approve/reject hotels** submitted by owners
- `/applications` — Review owner registration requests
- `/owners` — All approved venue partners
- `/bookings` — All platform bookings

**Default credentials** (change via API env vars):
```
Email:    admin@celeste.com
Password: admin123
```

### ⚙️ API (`/api`) — Backend Server
**URL**: `https://celeste-api.vercel.app`

All routes prefixed with `/api/`:

| Method | Route                          | Auth      | Description               |
|--------|--------------------------------|-----------|---------------------------|
| GET    | /api/hotels                    | Public    | List approved hotels only |
| GET    | /api/hotels/:id                | Public    | Single hotel              |
| GET    | /api/menu-items?hotelId=:id    | Public    | Hotel menu items          |
| GET    | /api/availability?hotelId=:id  | Public    | Date availability         |
| POST   | /api/bookings                  | Public    | Create booking            |
| GET    | /api/bookings/:id              | Public    | Get booking by ID         |
| POST   | /api/auth/register             | Public    | Submit owner application  |
| POST   | /api/auth/login                | Public    | Owner login               |
| POST   | /api/auth/logout               | Public    | Logout                    |
| GET    | /api/auth/me                   | Owner     | Current owner session     |
| POST   | /api/admin/auth                | Public    | Admin login               |
| GET    | /api/admin/stats               | Admin     | Platform statistics       |
| GET    | /api/admin/hotels              | Admin     | All hotels (all statuses) |
| PUT    | /api/admin/hotels/:id          | Admin     | Approve/reject/feature    |
| DELETE | /api/admin/hotels/:id          | Admin     | Delete hotel              |
| GET    | /api/admin/applications        | Admin     | Owner applications        |
| PUT    | /api/admin/applications/:id    | Admin     | Approve/reject owner      |
| GET    | /api/admin/bookings            | Admin     | All bookings              |
| GET    | /api/owner/hotels              | Owner     | Owner's hotels            |
| POST   | /api/owner/hotels              | Owner     | Add hotel (status:pending)|
| PUT    | /api/owner/hotels/:id          | Owner     | Edit own hotel            |
| GET    | /api/owner/menu-items          | Owner     | Owner's menu items        |
| POST   | /api/owner/menu-items          | Owner     | Add menu item             |
| DELETE | /api/owner/menu-items/:id      | Owner     | Delete menu item          |
| GET    | /api/owner/bookings            | Owner     | Owner's bookings          |
| GET    | /api/owner/profile             | Owner     | Owner profile             |
| PUT    | /api/owner/profile             | Owner     | Update profile            |
| POST   | /api/availability              | Public    | Set date status           |
| POST   | /api/seed                      | Public    | Seed sample data          |

---

## How the Approval Flow Works

```
Owner registers → Admin approves owner → Owner logs in
     ↓
Owner adds hotel → Status: PENDING (hidden from users)
     ↓
Admin reviews in /admin/venues → Clicks "APPROVE — MAKE LIVE"
     ↓
Hotel status: APPROVED → Appears on client site for users to book
```

Users on the client site **only ever see approved hotels**.
The `/api/hotels` public endpoint filters `status: 'approved'` strictly.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router) × 3
- **Database**: MongoDB with Mongoose
- **Auth**: JWT via `jose` + HTTP-only cookies
- **Styling**: Inline styles + Tailwind CSS
- **Deployment**: Vercel (each app independently)
- **Images**: Unsplash URLs (swap for Cloudinary in production)
