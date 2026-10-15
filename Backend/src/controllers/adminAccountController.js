const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Pet = require('../models/Pet');
const Reminder = require('../models/Reminder');
const Review = require('../models/Review');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const Notification = require('../models/Notification');
const SupportTicket = require('../models/SupportTicket');
const {
    ACCOUNT_STATUSES,
    accountIdFieldForRole,
    activeStatusQuery,
    normalizeAccountPayload,
    serializeManagedAccount,
    validationError
} = require('../services/accountManagementService');

const ROLE_PATHS = { suppliers: 'supplier', customers: 'customer' };
const MAX_PAGE_SIZE = 100;

const getRoleFromRequest = (req) => {
    const role = ROLE_PATHS[req.params.accountType];
    if (!role) throw validationError('Unknown account type');
    return role;
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parsePositiveInteger = (value, fallback, maximum) => {
    if (value === undefined) return fallback;
    const parsed = Number.parseInt(value, 10);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > maximum) {
        throw validationError(`Value must be a whole number between 1 and ${maximum}`);
    }
    return parsed;
};

const ensureValidId = (id) => {
    if (!mongoose.isValidObjectId(id)) throw validationError('Invalid account ID');
};

const errorResponse = (res, error, fallbackMessage) => {
    if (error?.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0];
        const readable = field === 'email' ? 'email address' : 'account ID';
        return res.status(409).json({ status: 'fail', message: `An account with this ${readable} already exists` });
    }

    if (error?.name === 'ValidationError' || error?.statusCode) {
        const status = error.statusCode || 400;
        return res.status(status).json({ status: 'fail', message: error.message });
    }

    console.error(fallbackMessage, error);
    return res.status(500).json({ status: 'error', message: fallbackMessage });
};

const ensureUniqueFields = async ({ email, accountId, excludeId }) => {
    const filters = [];
    if (email) filters.push({ email });
    if (accountId) filters.push({ supplierId: accountId }, { customerId: accountId });
    if (!filters.length) return;

    const query = { $or: filters };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await User.findOne(query).select('_id email supplierId customerId').lean();
    if (!existing) return;

    if (email && existing.email === email) {
        throw Object.assign(new Error('An account with this email address already exists'), { statusCode: 409 });
    }
    throw Object.assign(new Error('An account with this account ID already exists'), { statusCode: 409 });
};

const generateAccountId = async (role) => {
    const prefix = role === 'supplier' ? 'SUP' : 'CUS';
    const accountIdField = accountIdFieldForRole(role);

    for (let attempt = 0; attempt < 5; attempt += 1) {
        const random = new mongoose.Types.ObjectId().toString().slice(-8).toUpperCase();
        const accountId = `${prefix}-${random}`;
        if (!await User.exists({ [accountIdField]: accountId })) return accountId;
    }

    throw Object.assign(new Error('Unable to allocate a unique account ID. Please try again.'), { statusCode: 500 });
};

const findAccount = async (id, role) => {
    ensureValidId(id);
    const account = await User.findOne({ _id: id, role });
    if (!account) throw Object.assign(new Error('Account not found'), { statusCode: 404 });
    return account;
};

const getDependencies = async (account, role) => {
    const id = account._id;
    const checks = role === 'supplier'
        ? [
            ['products', Product.exists({ supplier: id })],
            ['orders', Order.exists({ 'items.supplier': id })]
        ]
        : [
            ['orders', Order.exists({ user: id })],
            ['payments', Payment.exists({ user: id })],
            ['pets', Pet.exists({ owner: id })],
            ['reminders', Reminder.exists({ owner: id })],
            ['reviews', Review.exists({ user: id })],
            ['carts', Cart.exists({ user: id })],
            ['wishlists', Wishlist.exists({ user: id })]
        ];

    checks.push(
        ['support tickets', SupportTicket.exists({ user: id })],
        ['notifications', Notification.exists({ user: id })]
    );

    const results = await Promise.all(checks.map(([, query]) => query));
    return checks.filter((_, index) => Boolean(results[index])).map(([name]) => name);
};

// @desc    Get account-status counts for the administrator dashboard
// @route   GET /api/admin/accounts/summary
// @access  Private/Admin
exports.getAccountSummary = async (req, res) => {
    try {
        const [totalSuppliers, activeSuppliers, deactivatedSuppliers, totalCustomers, activeCustomers, deactivatedCustomers] = await Promise.all([
            User.countDocuments({ role: 'supplier' }),
            User.countDocuments({ role: 'supplier', ...activeStatusQuery() }),
            User.countDocuments({ role: 'supplier', accountStatus: 'deactivated' }),
            User.countDocuments({ role: 'customer' }),
            User.countDocuments({ role: 'customer', ...activeStatusQuery() }),
            User.countDocuments({ role: 'customer', accountStatus: 'deactivated' })
        ]);

        return res.status(200).json({
            status: 'success',
            data: { summary: { totalSuppliers, activeSuppliers, deactivatedSuppliers, totalCustomers, activeCustomers, deactivatedCustomers } }
        });
    } catch (error) {
        return errorResponse(res, error, 'Failed to load account summary');
    }
};

// @desc    List supplier or customer accounts
// @route   GET /api/admin/accounts/:accountType
// @access  Private/Admin
exports.listAccounts = async (req, res) => {
    try {
        const role = getRoleFromRequest(req);
        const page = parsePositiveInteger(req.query.page, 1, 1000000);
        const limit = parsePositiveInteger(req.query.limit, 20, MAX_PAGE_SIZE);
        const status = req.query.status || 'all';
        const rawSearch = typeof req.query.search === 'string' ? req.query.search.trim() : '';

        if (!['all', ...ACCOUNT_STATUSES].includes(status)) {
            throw validationError('Status must be active, deactivated, or all');
        }
        if (rawSearch.length > 100) throw validationError('Search must be 100 characters or fewer');

        const clauses = [{ role }];
        if (status === 'active') clauses.push(activeStatusQuery());
        if (status === 'deactivated') clauses.push({ accountStatus: 'deactivated' });
        if (rawSearch) {
            const search = new RegExp(escapeRegex(rawSearch), 'i');
            const accountIdField = accountIdFieldForRole(role);
            const fields = [{ name: search }, { email: search }, { [accountIdField]: search }];
            if (role === 'supplier') fields.push({ businessName: search }, { contactPerson: search });
            clauses.push({ $or: fields });
        }

        const filter = clauses.length === 1 ? clauses[0] : { $and: clauses };
        const [accounts, total] = await Promise.all([
            User.find(filter).select('-password').sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            User.countDocuments(filter)
        ]);

        return res.status(200).json({
            status: 'success',
            data: {
                accounts: accounts.map(serializeManagedAccount),
                pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) }
            }
        });
    } catch (error) {
        return errorResponse(res, error, 'Failed to load accounts');
    }
};

// @desc    Get one supplier or customer account
// @route   GET /api/admin/accounts/:accountType/:id
// @access  Private/Admin
exports.getAccount = async (req, res) => {
    try {
        const account = await findAccount(req.params.id, getRoleFromRequest(req));
        return res.status(200).json({ status: 'success', data: { account: serializeManagedAccount(account) } });
    } catch (error) {
        return errorResponse(res, error, 'Failed to load account');
    }
};

// @desc    Create a supplier or customer account
// @route   POST /api/admin/accounts/:accountType
// @access  Private/Admin
exports.createAccount = async (req, res) => {
    try {
        const role = getRoleFromRequest(req);
        const accountIdField = accountIdFieldForRole(role);
        const data = normalizeAccountPayload({ payload: req.body, role, isCreate: true });
        const accountId = data[accountIdField] || await generateAccountId(role);
        await ensureUniqueFields({ email: data.email, accountId });

        const account = await User.create({ ...data, [accountIdField]: accountId, role, accountStatus: 'active' });
        return res.status(201).json({
            status: 'success',
            message: `${role === 'supplier' ? 'Supplier' : 'Customer'} account created successfully`,
            data: { account: serializeManagedAccount(account) }
        });
    } catch (error) {
        return errorResponse(res, error, 'Failed to create account');
    }
};

// @desc    Update a supplier or customer account
// @route   PUT /api/admin/accounts/:accountType/:id
// @access  Private/Admin
exports.updateAccount = async (req, res) => {
    try {
        const role = getRoleFromRequest(req);
        const account = await findAccount(req.params.id, role);
        const data = normalizeAccountPayload({ payload: req.body, role });
        const accountId = data[accountIdFieldForRole(role)];
        await ensureUniqueFields({ email: data.email, accountId, excludeId: account._id });

        Object.assign(account, data);
        const updatedAccount = await account.save();
        return res.status(200).json({
            status: 'success', message: 'Account updated successfully', data: { account: serializeManagedAccount(updatedAccount) }
        });
    } catch (error) {
        return errorResponse(res, error, 'Failed to update account');
    }
};

// @desc    Activate or deactivate a supplier or customer account
// @route   PATCH /api/admin/accounts/:accountType/:id/status
// @access  Private/Admin
exports.updateAccountStatus = async (req, res) => {
    try {
        const role = getRoleFromRequest(req);
        const status = req.body?.status;
        if (!ACCOUNT_STATUSES.includes(status)) throw validationError('Status must be active or deactivated');
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ status: 'fail', message: 'You cannot change the status of your own administrator account' });
        }

        const account = await findAccount(req.params.id, role);
        if (account.accountStatus !== status) {
            account.accountStatus = status;
            await account.save();
        }
        return res.status(200).json({
            status: 'success',
            message: `Account ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
            data: { account: serializeManagedAccount(account) }
        });
    } catch (error) {
        return errorResponse(res, error, 'Failed to update account status');
    }
};

// @desc    Permanently delete a supplier or customer account and clean up associated records
// @route   DELETE /api/admin/accounts/:accountType/:id
// @access  Private/Admin
exports.deleteAccount = async (req, res) => {
    try {
        const role = getRoleFromRequest(req);
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ status: 'fail', message: 'You cannot delete your own administrator account' });
        }

        const account = await findAccount(req.params.id, role);
        const id = account._id;

        if (role === 'supplier') {
            const products = await Product.find({ supplier: id }).select('_id');
            const productIds = products.map((p) => p._id);

            if (productIds.length > 0) {
                await Review.deleteMany({ product: { $in: productIds } });
                await Cart.updateMany({}, { $pull: { items: { product: { $in: productIds } } } });
                await Wishlist.updateMany({}, { $pull: { products: { $in: productIds } } });
                await Product.deleteMany({ supplier: id });
            }
            await Notification.deleteMany({ user: id });
            await SupportTicket.deleteMany({ user: id });
        } else if (role === 'customer') {
            await Pet.deleteMany({ owner: id });
            await Reminder.deleteMany({ owner: id });
            await Review.deleteMany({ user: id });
            await Cart.deleteMany({ user: id });
            await Wishlist.deleteMany({ user: id });
            await Notification.deleteMany({ user: id });
            await SupportTicket.deleteMany({ user: id });
            await Payment.deleteMany({ user: id });
            await Order.deleteMany({ user: id });
        }

        await account.deleteOne();
        return res.status(200).json({
            status: 'success',
            message: `${role === 'supplier' ? 'Supplier' : 'Customer'} account deleted successfully`
        });
    } catch (error) {
        return errorResponse(res, error, 'Failed to delete account');
    }
};
