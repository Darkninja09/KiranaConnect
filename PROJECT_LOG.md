# KiranaConnect: Project Development Log

## 🗓️ Completion Date: May 5, 2026
**Status:** MVP (Minimum Viable Product) Complete

---

## 🚀 Key Achievements
1.  **Phase 1: Security Foundation**
    *   Implemented JWT-based authentication using Spring Security 6.
    *   Built a custom Auth provider with role-based access control (Admin vs. Vendor).
    *   Created a persistent React frontend with AuthContext.

2.  **Phase 2: Product Infrastructure**
    *   Developed a MongoDB-backed product catalog.
    *   Seeded 50+ premium products from top brands (HUL, Nestle, ITC, etc.).
    *   Built a modern UI with search and category filtering using Tailwind CSS v4.

3.  **Phase 3: Order & Payment Lifecycle**
    *   Implemented a global Shopping Cart with LocalStorage persistence.
    *   Integrated **Razorpay Payment Gateway** for secure wholesale transactions.
    *   Developed Order Verification logic on the backend using digital signatures.
    *   Created an Order History dashboard for tracking resupplies.

---

## 🛠️ Challenges & Debugging (Lessons Learned)
| Error/Bug | Cause | Solution |
| :--- | :--- | :--- |
| `Illegal base64 character: '_'` | Old JJWT API assumed secret key was Base64 encoded. | Refactored `JwtUtils` to use modern `Keys.hmacShaKeyFor` with raw bytes. |
| `db already exists with different case` | MongoDB is case-sensitive regarding DB names on some systems. | Unified DB name to lowercase `kiranaconnect` across the app. |
| `401 Unauthorized` on Public Paths | Spring Security 6 blocks internal `/error` forwards by default. | Explicitly permitted the `/error` path in `WebSecurityConfig`. |
| Broken Images | External URLs were unreliable or restricted. | Implemented `Placehold.co` with product-specific text for 100% reliability. |

---

## 🔮 Future Roadmap (Phase 4)
- [x] **Inventory Sync:** Automatically deduct `stockLevel` after a `PAID` status.
- [ ] **Admin Dashboard:** UI for admins to add/edit products and manage orders.
- [ ] **Invoice Generation:** Generate PDF receipts for shop owners.
- [ ] **Environment Security:** Move Razorpay keys to `.env` files.
