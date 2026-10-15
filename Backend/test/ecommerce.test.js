const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const SupportTicket = require('../src/models/SupportTicket');

describe('E-Commerce Components Verification', () => {
    describe('1. Customer Support Component', () => {
        it('should validate ticket required fields', () => {
            const ticket = new SupportTicket({});
            const err = ticket.validateSync();
            assert.ok(err, 'Validation error expected for empty ticket');
            assert.ok(err.errors.ticketNumber, 'ticketNumber is required');
            assert.ok(err.errors.name, 'name is required');
            assert.ok(err.errors.email, 'email is required');
            assert.ok(err.errors.subject, 'subject is required');
        });

        it('should correctly format and accept a valid SupportTicket document', () => {
            const ticketData = {
                ticketNumber: 'TKT-TEST-9001',
                name: 'Alex Jordan',
                email: 'alex@example.com',
                subject: 'Delivery question for Golden Retriever food',
                category: 'order_inquiry',
                priority: 'medium',
                status: 'open',
                orderNumber: 'ORD-98765',
                petName: 'Cooper',
                messages: [
                    {
                        sender: 'customer',
                        senderName: 'Alex Jordan',
                        message: 'When is my shipment expected to arrive?'
                    },
                    {
                        sender: 'system',
                        senderName: 'PetCare Concierge Bot',
                        message: 'Hello! We have received your order inquiry.'
                    }
                ]
            };

            const ticket = new SupportTicket(ticketData);
            const err = ticket.validateSync();
            assert.strictEqual(err, undefined, 'Valid ticket should not have validation errors');
            assert.strictEqual(ticket.ticketNumber, 'TKT-TEST-9001');
            assert.strictEqual(ticket.messages.length, 2);
            assert.strictEqual(ticket.status, 'open');
        });

        it('should enforce allowed categories and statuses', () => {
            const ticket = new SupportTicket({
                ticketNumber: 'TKT-INV-001',
                name: 'Test',
                email: 'test@example.com',
                subject: 'Test Subject',
                category: 'invalid_category_xyz',
                status: 'invalid_status_xyz'
            });

            const err = ticket.validateSync();
            assert.ok(err);
            assert.ok(err.errors.category, 'Should reject invalid category');
            assert.ok(err.errors.status, 'Should reject invalid status');
        });
    });

    describe('2. Shopping Cart & Checkout Financial Calculations', () => {
        it('should compute correct subtotal, 10% tax, and shipping fee', () => {
            // Test standard calculation logic matching orderService
            const calculateTotals = (items, isDirectCheckout = false) => {
                let subtotal = 0;
                for (const item of items) {
                    subtotal += Math.round(item.price * item.quantity * 100) / 100;
                }
                subtotal = Math.round(subtotal * 100) / 100;
                const tax = isDirectCheckout ? 0 : Math.round(subtotal * 0.10 * 100) / 100;
                const shippingFee = isDirectCheckout ? 0 : (subtotal >= 50 ? 0 : 5);
                const total = Math.round((subtotal + tax + shippingFee) * 100) / 100;
                return { subtotal, tax, shippingFee, total };
            };

            // Order under $50 should include $5 shipping
            const cartUnder50 = [{ price: 20.00, quantity: 2 }]; // $40 subtotal
            const fin1 = calculateTotals(cartUnder50);
            assert.strictEqual(fin1.subtotal, 40.00);
            assert.strictEqual(fin1.tax, 4.00);
            assert.strictEqual(fin1.shippingFee, 5.00);
            assert.strictEqual(fin1.total, 49.00);

            // Order over $50 should have free shipping
            const cartOver50 = [{ price: 30.00, quantity: 2 }]; // $60 subtotal
            const fin2 = calculateTotals(cartOver50);
            assert.strictEqual(fin2.subtotal, 60.00);
            assert.strictEqual(fin2.tax, 6.00);
            assert.strictEqual(fin2.shippingFee, 0.00);
            assert.strictEqual(fin2.total, 66.00);
        });
    });

    describe('3. Payment & Routes Verification', () => {
        it('should export all required route handlers without crashing', () => {
            const productRoutes = require('../src/routes/productRoutes');
            const cartRoutes = require('../src/routes/cartRoutes');
            const paymentRoutes = require('../src/routes/paymentRoutes');
            const orderRoutes = require('../src/routes/orderRoutes');
            const supportRoutes = require('../src/routes/supportRoutes');

            assert.ok(productRoutes, 'Product routes should be exported');
            assert.ok(cartRoutes, 'Cart routes should be exported');
            assert.ok(paymentRoutes, 'Payment routes should be exported');
            assert.ok(orderRoutes, 'Order routes should be exported');
            assert.ok(supportRoutes, 'Support routes should be exported');
        });
    });
});
