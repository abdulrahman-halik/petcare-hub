# Phase 3: Product Catalog & Inventory System

## 1. Overview
With users securely accessing the platform, Phase 3 aims at populating the marketplace. This includes full management of products, categories, and utilizing third-party storage for robust media handling.

## 2. Requirements & Tasks

### 2.1 Media & Image Storage
- **Cloudinary Integration**: Set up a Cloudinary account and integrate it with the Node.js backend to handle image uploads for products and pet profiles.

### 2.2 Product & Category Management
- **Category APIs**: Develop CRUD endpoints for Product Categories (e.g., Food, Accessories, Medicine). Ensure only Admins/authorized personnel can manage top-level categories.
- **Product APIs**: Develop endpoints for adding, updating, viewing, and deleting product listings. Bind products to specific Suppliers.
- **Supplier Interface**: Create a UI panel where suppliers can easily add new stock, upload pictures (routed via Cloudinary), update pricing, and monitor active listings.
- **Admin Oversight**: Develop an Admin-level UI to moderate all products, removing non-compliant items.

### 2.3 Storefront Browsing
- **Product Listing Page**: Build a Next.js customer-facing page to list available products.
- **Search & Filtering**: Implement quick search and category-based filtering so Pet Owners can easily locate required products.
- **Product Details Page**: A comprehensive view of a single product showing images, supplier details, price, description, and reviews (placeholder).

## 3. Deliverables
- Functioning image upload capabilities via Cloudinary.
- Backend and Frontend implementations for CRUD on Products and Categories.
- A functional product catalog page featuring search, filtering, and detailed product views.
