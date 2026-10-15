const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const User = require('../src/models/User');
const {
    activeStatusQuery,
    normalizeAccountPayload,
    serializeManagedAccount
} = require('../src/services/accountManagementService');

describe('Admin account management validation', () => {
    it('normalizes supplier data and leaves password hashing to the User model', () => {
        const payload = normalizeAccountPayload({
            role: 'supplier',
            isCreate: true,
            payload: {
                accountId: 'sup-001',
                businessName: '  Acme Pet Goods  ',
                contactPerson: '  Morgan Lee ',
                email: 'MORGAN@EXAMPLE.COM ',
                password: 'safe-password',
                phone: '+1 (555) 010-0200',
                address: ' 123 Market Street '
            }
        });

        assert.equal(payload.supplierId, 'SUP-001');
        assert.equal(payload.businessName, 'Acme Pet Goods');
        assert.equal(payload.name, 'Acme Pet Goods');
        assert.equal(payload.email, 'morgan@example.com');

        const account = new User({ ...payload, role: 'supplier' });
        assert.equal(account.validateSync(), undefined);
        assert.equal(account.accountStatus, 'active');
    });

    it('rejects invalid administrative account input before persistence', () => {
        assert.throws(() => normalizeAccountPayload({
            role: 'customer',
            isCreate: true,
            payload: { name: 'Test User', email: 'not-an-email', password: 'password1', phone: '123' }
        }), /valid email address/);

        assert.throws(() => normalizeAccountPayload({
            role: 'supplier',
            isCreate: true,
            payload: { businessName: 'Vendor', contactPerson: 'Morgan', email: 'vendor@example.com', password: 'password1', phone: '12345678', accountId: 'bad id!' }
        }), /Account ID may contain/);
    });

    it('normalizes customer data properly', () => {
        const payload = normalizeAccountPayload({
            role: 'customer',
            isCreate: true,
            payload: {
                accountId: 'cus-101',
                name: '  Jane Doe  ',
                email: 'JANE@EXAMPLE.COM ',
                password: 'secure-password123',
                phone: '+1 555 456 7890',
                address: ' 456 Elm Ave '
            }
        });

        assert.equal(payload.customerId, 'CUS-101');
        assert.equal(payload.name, 'Jane Doe');
        assert.equal(payload.email, 'jane@example.com');
        assert.equal(payload.phone, '+1 555 456 7890');
        assert.equal(payload.address, '456 Elm Ave');
    });

    it('supports optional password updates on account edits', () => {
        const updatePayload = normalizeAccountPayload({
            role: 'customer',
            isCreate: false,
            payload: {
                password: 'new-secure-password'
            }
        });

        assert.equal(updatePayload.password, 'new-secure-password');
    });

    it('rejects short passwords and empty updates', () => {
        assert.throws(() => normalizeAccountPayload({
            role: 'customer',
            isCreate: false,
            payload: { password: 'short' }
        }), /Password must be at least 8 characters long/);

        assert.throws(() => normalizeAccountPayload({
            role: 'customer',
            isCreate: false,
            payload: {}
        }), /Provide at least one account field to update/);
    });

    it('serializes legacy accounts as active without exposing password data', () => {
        const serialized = serializeManagedAccount({
            _id: 'legacy-account-id',
            role: 'customer',
            name: 'Legacy Customer',
            email: 'legacy@example.com',
            password: 'never-return-this',
            createdAt: new Date('2026-01-01'),
            updatedAt: new Date('2026-01-01')
        });

        assert.equal(serialized.accountStatus, 'active');
        assert.equal(serialized.accountId, null);
        assert.equal(serialized.password, undefined);
        assert.equal(activeStatusQuery().$or.length, 3);
    });

    it('exports admin-only account routes and protects routes with admin role', () => {
        const adminAccountRoutes = require('../src/routes/adminAccountRoutes');
        assert.ok(adminAccountRoutes);

        const { authorize } = require('../src/middlewares/authMiddleware');
        const adminAuth = authorize('admin');
        
        let forbidden = false;
        adminAuth({ user: { role: 'customer' } }, {
            status: (code) => {
                if (code === 403) forbidden = true;
                return { json: () => {} };
            }
        }, () => {});
        assert.equal(forbidden, true);

        let supplierForbidden = false;
        adminAuth({ user: { role: 'supplier' } }, {
            status: (code) => {
                if (code === 403) supplierForbidden = true;
                return { json: () => {} };
            }
        }, () => {});
        assert.equal(supplierForbidden, true);

        let adminAllowed = false;
        adminAuth({ user: { role: 'admin' } }, {}, () => {
            adminAllowed = true;
        });
        assert.equal(adminAllowed, true);
    });
});
