# KiranaConnect: Technical Project Report

## 1. Executive Summary
**KiranaConnect** is a hyperlocal B2B e-commerce platform designed to bridge the gap between small-scale grocery (Kirana) vendors and wholesale distributors. The platform allows shop owners to browse a digital catalog of branded products, manage a shopping cart, and place bulk orders with real-time payment verification via Razorpay. Additionally, a robust administrative console provides tools for catalog management and business analytics.

---

## 2. Technical Stack
The project utilizes a modern, decoupled architecture ensuring scalability and performance.

### **Frontend**
- **Library:** React 18+ (with Vite for rapid development and optimized builds).
- **Styling:** Tailwind CSS v4 (leveraging the `@tailwindcss/vite` plugin for a "Just-in-Time" engine).
- **Icons:** Lucide React for consistent, high-quality iconography.
- **State Management:** React Context API (Auth and Cart state) with LocalStorage persistence.
- **Routing:** React Router v6 for clean, declarative navigation.

### **Backend**
- **Framework:** Java Spring Boot 3.4.2.
- **Security:** Spring Security 6 with JSON Web Token (JWT) using the JJWT 0.11.5 library.
- **Database:** MongoDB (Cloud/Local) for flexible, document-oriented storage.
- **Payment Processing:** Razorpay Java SDK 1.4.3.
- **Integration:** RestTemplate for external API communication (Google Image Search).

---

## 3. Core Features & Functionality

### **A. Advanced Security & Role-Based Access**
- **JWT Authentication:** Secure stateless session management.
- **Role Hierarchy:**
    - **VENDORS:** Can browse products, manage carts, place orders, and view history.
    - **ADMINS:** Access to a full management console, product CRUD, and platform statistics.
- **Secure Secret Key:** Utilizes a 256-bit secure secret key to prevent signature spoofing.

### **B. Dynamic Product Catalog**
- **Rich Data:** Over 50 premium products pre-seeded across categories like Grocery, Snacks, Beverages, and Personal Care.
- **Search & Filter:** Real-time frontend filtering by product name and category.
- **Stable Imagery:** Integrated `placehold.co` system ensures 100% uptime for product visuals during the prototype phase.

### **C. Shopping Cart & Razorpay Integration**
- **Persistent Cart:** Items are retained in the browser's LocalStorage, ensuring no data loss on page refreshes.
- **Payment Flow:** 
    1. Order creation on the backend.
    2. Secure checkout on the frontend using Razorpay's Modal.
    3. Backend **Digital Signature Verification** to ensure payment integrity before marking orders as `PAID`.

### **D. Administrative Console (Admin Dashboard)**
- **Platform Analytics:** Real-time cards showing Total Revenue, Order Volume, User Growth, and Inventory Health.
- **Order Lifecycle Management:** Admins can transition orders through `PAID`, `PROCESSING`, `SHIPPED`, and `DELIVERED` statuses.
- **AI-Assisted Catalog Management:** 
    - Full CRUD for products.
    - **Google Image Integration:** A custom image search slider that pulls the top 10 relevant images specifically from **Amazon.in** for accurate product branding.

---

## 4. Architectural Design (Data Models)

### **User Entity**
- `shopName`: Identifies the physical business.
- `role`: Encapsulates permissions.
- `address`: Crucial for hyperlocal delivery logistics.

### **Product Entity**
- `wholesalePrice`: Specialized B2B pricing.
- `stockLevel`: Tracked in real-time.
- `minOrderQty`: Prevents micro-orders not suitable for wholesale.

### **Order Entity**
- `status`: Lifecycle tracker (`PENDING`, `PAID`, `CANCELLED`, etc.).
- `razorpayOrderId`: Links the local transaction to the payment gateway.
- `totalAmount`: Calculated at checkout to freeze pricing.

---

## 5. Challenges Overcome & Innovation

| Challenge | Impact | Technical Solution |
| :--- | :--- | :--- |
| **JWT Signature Mismatch** | Prevented secure logins. | Transitioned from legacy Base64 decoding to raw byte HMAC-SHA keys via `Keys.hmacShaKeyFor`. |
| **CORS/Security Blocks** | Blocked internal error page forwards. | Explicitly permitted the `/error` path in Spring Security to allow standard 400/500 responses. |
| **Image Inconsistency** | Broken or low-quality product photos. | Developed a dual-mode system: Reliable `placehold.co` for seed data and a restricted Google Search API (Site: Amazon.in) for new entries. |
| **DB Initialization** | System crashes due to case-sensitivity. | Standardized all database references to a lowercase `kiranaconnect` across Spring and Mongo. |

---

## 6. Future Roadmap
1. **Automated Inventory Sync:** Logic to deduct `stockLevel` immediately upon payment confirmation.
2. **Hyperlocal Geofencing:** Restricting order visibility based on vendor proximity.
3. **Automated Invoicing:** PDF generation for shop owners' tax records.
4. **Offline Mode:** Local caching for orders in areas with weak internet.

---

## 7. Conclusion
KiranaConnect represents a sophisticated, end-to-end B2B solution. By combining robust Java-based security with a modern React UI and professional payment integration, the platform is well-positioned to modernize the traditional hyperlocal grocery supply chain.
