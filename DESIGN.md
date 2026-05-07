# KiranaConnect: Hyperlocal B2B Ecommerce Platform

## Overview
KiranaConnect is a B2B platform designed for small grocery (Kirana) vendors to order wholesale resupply for their shops at competitive prices.

## Tech Stack
- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Java (Spring Boot)
- **Database:** MongoDB
- **Security:** Spring Security + JWT (JSON Web Tokens)

## Project Structure
```text
KiranaConnect/
├── backend/            # Spring Boot Application
│   ├── src/main/java/com/kiranaconnect/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── services/
│   │   └── security/
│   └── pom.xml
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   ├── tailwind.config.js
│   └── package.json
└── docs/               # Documentation & Logs
```

## Data Models (MongoDB)
### User
- `id`: ObjectId
- `name`: String
- `shopName`: String
- `email`: String (Unique)
- `password`: String (Hashed)
- `role`: Enum (VENDOR, ADMIN)
- `address`: String

### Product
- `id`: ObjectId
- `name`: String
- `description`: String
- `category`: String
- `wholesalePrice`: Double
- `minOrderQty`: Integer
- `stockLevel`: Integer
- `imageUrl`: String

### Order
- `id`: ObjectId
- `vendorId`: ObjectId (Ref User)
- `items`: Array of {productId, quantity, priceAtOrder}
- `totalAmount`: Double
- `status`: Enum (PENDING, PROCESSING, SHIPPED, DELIVERED)
- `createdAt`: Date

## Implementation Phases
### Phase 1: Core Infrastructure
1.  Initialize Spring Boot project with MongoDB and Security dependencies.
2.  Setup React frontend with Vite and Tailwind CSS.
3.  Implement JWT Authentication (Signup/Login).

### Phase 2: Product Management
1.  API for Product CRUD (Admin controlled).
2.  Frontend Product Listing page with search and category filters.

### Phase 3: Order Lifecycle
1.  Shopping Cart logic (Local storage + State).
2.  Checkout API to create Orders and update inventory.
3.  Order History page for Vendors.

### Phase 4: Refinement
1.  Dashboard for Admins to manage orders.
2.  Real-time order status updates (WebSockets/Polling).
3.  Milestone logging and error documentation.
