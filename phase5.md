# Phase 5: E-Commerce Core & Payments

## 1. Overview
Phase 5 introduces the full E-Commerce shopping flow. Starting from the cart experience down to checking out securely via a payment gateway (or Mock payments for early testing), this phase connects the user directly with the purchasing experience.

## 2. Requirements & Tasks

### 2.1 Cart & Wishlist Operations
- **Wishlist API**: Allow users to save their favorite products to a wishlist without checking out.
- **Cart API & State Management**: Develop Cart functionalities (Add, Update Quantity, Remove) using backend sessions/DB or secure frontend states. Combine order items securely.
- **UI State**: Setup real-time cart counts and a comprehensive Cart View page showing summaries, taxes, and potential shipping fees.

### 2.2 Product Reviews & Ratings
- **Feedback Mechanism**: Create endpoints allowing Customers with completed orders to leave verified reviews and star ratings on products. Display these ratings on the Product Details pages.

### 2.3 Checkout & Payment Integration
- **Checkout Process**: Create a responsive Next.js checkout funnel collecting standard shipping addresses and billing information securely.
- **Payment Processing**: Integrate Stripe (or a Mock Payment gateway for staging configurations) on the backend to evaluate transactions and yield verifiable payment tokens.
- **Orders API**: Once a payment clears, process an 'Order' document linking Products, Quantities, Customers, and Suppliers to their corresponding Orders.

## 3. Deliverables
- Fully operational Cart and Wishlist experiences.
- System allowing users to leave text reviews and ratings on products.
- Secure, tokenized payment processing via Stripe SDK or a Mock processor.
- A functional Orders management backend updating inventory counts.
