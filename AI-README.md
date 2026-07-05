# Leipzig Montage API

Node.js / Express / PostgreSQL / Sequelize backend.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 4
- **Database:** PostgreSQL (via Sequelize 6 ORM)
- **Auth:** JWT (`jsonwebtoken`) + fallback CODE header
- **File upload:** Multer (memory storage) + xlsx parser
- **Password hashing:** bcrypt

---

## Project Structure

```
src/
  server.js              — Entry point: authenticate DB, sync models, start HTTP
  app.js                 — Express app config (CORS, JSON, static, routes)
  config/
    database.js          — Sequelize instance (from .env)
  models/
    index.js             — Associations + re-export
    User.js              — User model (bcrypt hooks)
    Product.js           — Product model
  controllers/
    authController.js    — Login (email + password → JWT)
    userController.js    — CRUD for users
    productController.js — CRUD + pagination + bulk upload
    ghlController.js     — GHL cost calculation
  middleware/
    auth.js              — JWT Bearer token verification
    codeAuth.js          — CODE header verification (for GHL)
    validateProduct.js   — Required field validation (productId, name, minCost, maxCost)
  routes/
    index.js             — Route aggregator
    authRoutes.js        — /api/auth/*
    userRoutes.js        — /api/users/*
    productRoutes.js     — /api/products/*
    ghlRoutes.js         — /api/ghl/*
public/
  index.html             — CSV/XLSX upload form
scripts/
  create_db.js           — Helper: DROP + CREATE "montage" database
```

---

## Environment Variables (.env)

| Variable       | Description                   |
|----------------|-------------------------------|
| `PORT`         | Server port (default: 5000)   |
| `DB_HOST`      | PostgreSQL host               |
| `DB_PORT`      | PostgreSQL port               |
| `DB_NAME`      | Database name (`montage`)     |
| `DB_USER`      | Database user                 |
| `DB_PASSWORD`  | Database password             |
| `CODE`         | Secret code for GHL endpoint  |
| `JWT_SECRET`   | Secret key for JWT signing    |

---

## Database Models

### User (`Users` table)

| Field      | Type         | Notes                    |
|------------|--------------|--------------------------|
| id         | INTEGER (PK) | Auto-increment           |
| username   | STRING(100)  | Default: ''              |
| email      | STRING(150)  | Unique, required         |
| password   | STRING(255)  | Hashed via bcrypt hook   |
| createdAt  | DATE         | Auto                     |
| updatedAt  | DATE         | Auto                     |

**Hooks:** `beforeCreate` / `beforeUpdate` — hashes password with bcrypt (salt rounds: 10).

### Product (`Products` table)

| Field      | Type          | Notes                        |
|------------|---------------|------------------------------|
| id         | INTEGER (PK)  | Auto-increment               |
| productId  | STRING(100)   | Required (business ID)       |
| imageUrl   | STRING(500)   | Nullable                     |
| name       | STRING(200)   | Required                     |
| minCost    | FLOAT         | Nullable                     |
| maxCost    | FLOAT         | Nullable                     |
| userId     | INTEGER (FK)  | References `Users.id`        |
| createdAt  | DATE          | Auto                         |
| updatedAt  | DATE          | Auto                         |

### Associations

- **User** `hasMany` **Product** (foreignKey: `userId`, as: `products`)
- **Product** `belongsTo` **User** (foreignKey: `userId`, as: `user`)

On user delete: associated products are deleted manually in the controller.

---

## API Endpoints

All endpoints are prefixed with `/api`.

### Auth

| Method | Path           | Auth     | Body                         | Response                     |
|--------|----------------|----------|------------------------------|------------------------------|
| POST   | `/auth/login`  | None     | `{ email, password }`        | `{ token, user }`            |

**Response shape:** `{ token: "<jwt>", user: { id, email, username } }`

### Users

| Method | Path          | Auth | Body                        | Response                     |
|--------|---------------|------|-----------------------------|------------------------------|
| GET    | `/users`      | No   | —                           | `[ users with products ]`    |
| GET    | `/users/:id`  | No   | —                           | `{ user with products }`     |
| POST   | `/users`      | No   | `{ username, email, password }` | `{ user }`               |
| PUT    | `/users/:id`  | No   | `{ username?, email?, password? }` | `{ user }`            |
| DELETE | `/users/:id`  | No   | —                           | `204` (cascades products)    |

### Products

**Auth:** All endpoints require `Authorization: Bearer <jwt>` header.

| Method | Path                | Auth | Body / Query                          | Response                             |
|--------|---------------------|------|---------------------------------------|--------------------------------------|
| GET    | `/products`         | JWT  | `?limit=10&offset=0` (limit: 10,20,50,100) | `{ data, total, limit, offset }` |
| GET    | `/products/:id`     | JWT  | —                                     | `{ product with user }`              |
| POST   | `/products`         | JWT  | `{ productId, name, minCost, maxCost, imageUrl?, userId }` | `{ product }` |
| PUT    | `/products/:id`     | JWT  | `{ productId, name, minCost, maxCost, imageUrl? }` | `{ product }` |
| DELETE | `/products/:id`     | JWT  | —                                     | `204`                                |
| POST   | `/products/upload`  | JWT  | FormData: `file` (.csv/.xlsx) + `userId` | `{ message: "N ürün yüklendi" }` |

**Validation (create/update):** `productId`, `name`, `minCost`, `maxCost` are required (via `validateProduct` middleware).

**Pagination defaults:** `limit=10`, `offset=0`. Allowed limits: 10, 20, 50, 100. Invalid limits fall back to 10. Results ordered by `id DESC`.

**Upload format (CSV/XLSX):**

| Column      | Maps to    |
|-------------|------------|
| product_id  | productId  |
| name        | name       |
| min_cost    | minCost    |
| max_cost    | maxCost    |
| image_url   | imageUrl   |

### GHL (GoHighLevel)

**Auth:** Requires `code: <secret>` header (matches `CODE` from .env).

| Method | Path              | Auth  | Body                             | Response                                                     |
|--------|-------------------|-------|----------------------------------|--------------------------------------------------------------|
| POST   | `/ghl/calculate`  | CODE  | `{ product_list: ["id1","id2"] }` | `{ total_min, total_max, calculated_products, not_calculated_ids }` |

Iterates over `product_list` array, looks up each `productId` in the database, and sums `minCost` / `maxCost` for all found products. Products not found are returned in `not_calculated_ids`.

---

## Authentication Details

### JWT Auth (product routes)
- Header: `Authorization: Bearer <token>`
- Token contains: `{ id, email }`
- Expires: 7 days
- Secret: `JWT_SECRET` from .env

### CODE Auth (GHL route)
- Header: `code: <value>`
- Value must match `CODE` from .env

---

## Scripts

```bash
npm start     # node src/server.js
npm run dev   # node --watch src/server.js
```

Startup sequence:
1. Load `.env`
2. Authenticate PostgreSQL connection
3. Sync all models (`ALTER TABLE IF EXISTS` — safe for development)
4. Listen on `PORT`

---

## CSV/XLSX Upload UI

Open `http://localhost:5000/` in a browser to access the upload form. Enter a `userId` and select a `.csv` or `.xlsx` file, then click "Yükle".
