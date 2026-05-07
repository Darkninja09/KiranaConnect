# KiranaConnect 🛒
### Hyperlocal B2B Ecommerce Platform for Kirana Resupply

KiranaConnect is a modern B2B platform designed to empower small grocery (Kirana) vendors by providing them access to wholesale prices, hyperlocal delivery, and seamless inventory management.

---

## 🏗️ Architecture & Tech Stack

### Backend (Spring Boot)
- **Framework:** Spring Boot 3.4.2 (Java 17)
- **Database:** MongoDB
- **Security:** Spring Security + JWT Authentication
- **Payments:** Razorpay Integration
- **Key Features:** Automated Inventory Sync, Admin Stats, Secure Checkout.

### Frontend (React)
- **Framework:** React 19 (TypeScript)
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS v4
- **State Management:** Context API (Auth & Cart)
- **Icons:** Lucide-React

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MongoDB (running locally or Atlas)

### 1. Backend Setup
```bash
cd backend
# Create your environment variables or update application.yml
mvn spring-boot:run
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 🔐 Environment Variables
Copy `.env.example` to a new `.env` file and fill in your credentials:
- `JWT_SECRET`: Secret for token generation.
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: From your Razorpay dashboard.
- `GOOGLE_SEARCH_API_KEY` & `GOOGLE_SEARCH_CX_ID`: For product image search.

---

## 🛠️ Project Features
- **Smart Image Search:** Automatically fetches product images from Amazon.in for the admin catalog.
- **Wholesale Cart:** Minimum order quantity (MOQ) enforcement for B2B transactions.
- **Secure Payments:** Integrated Razorpay checkout flow with backend signature verification.
- **Inventory Control:** Automatic stock deduction upon successful payment.
- **Admin Console:** Dashboard for monitoring revenue, order health, and inventory status.

---

## 👨‍💻 Author
**Shivansh (DarkNinja)** - *B.Tech CS Student & Full-Stack Developer*
