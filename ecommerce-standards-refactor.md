# PetCare Hub - E-Commerce Standards & Refactoring Plan

## Goal
Verify and perfect the Search functionality, remove all unused code, fix page alignment, modularize long pages (Checkout and Support) to follow the ISO maintainability guideline (200–250 lines), and remove mock payment UI in favor of the real backend payment gateway.

## Tasks
- [ ] Task 1: Fix Search & URL synchronization in `Frontend/src/app/products/page.tsx` and popular pills in `Frontend/src/components/home/HomeHeroSection.tsx` → Verify: Navigating with search keywords updates catalog products and URL properly
- [ ] Task 2: Remove unused variables and imports identified by ESLint across `HomeHeroSection.tsx`, `ProductCard.tsx`, `CustomerSupportWidget.tsx`, `DashboardHeader.tsx`, `Navbar.tsx`, `Footer.tsx`, `ProductFilterSidebar.tsx`, `ProductMobileFilters.tsx`, and `SmartRecommendations.tsx` → Verify: `npm run lint` passes without unused warnings
- [ ] Task 3: Fix page alignment and responsive container consistency across `HomeHeroSection.tsx`, `about/page.tsx`, `checkout/page.tsx`, and `support/page.tsx` → Verify: Inspect layout containers and paddings across viewport sizes
- [ ] Task 4: Modularize `checkout/page.tsx` (675 lines) into `CheckoutAddressStep.tsx`, `CheckoutPaymentStep.tsx`, and `CheckoutOrderSummary.tsx` under `Frontend/src/components/checkout/` while removing the mock payment UI → Verify: `checkout/page.tsx` is < 250 lines and connects exclusively to the real backend PayPal/Card gateway
- [ ] Task 5: Modularize `support/page.tsx` (499 lines) into `SupportTicketList.tsx`, `SupportTicketChat.tsx`, and `CreateTicketModal.tsx` under `Frontend/src/components/support/` → Verify: `support/page.tsx` is < 250 lines with clean real-backend ticket messaging
- [ ] Task 6: Run full verification build and linting checks → Verify: `npm run build` and `npm run lint` in Frontend

## Done When
- [ ] Search query parameters sync bidirectionally with URL, hero search, and catalog
- [ ] Zero unused variables/imports in modified files
- [ ] Checkout and Support pages are modularized to <= 250 lines each
- [ ] Mock payment gateway UI is eliminated; checkout uses real backend PayPal Sandbox gateway
- [ ] Application compiles and runs with zero regressions
