const ACCOUNT_STATUSES = ['active', 'deactivated'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ACCOUNT_ID_PATTERN = /^[A-Z0-9][A-Z0-9_-]{2,49}$/;
const PHONE_PATTERN = /^[0-9+().\-\s]{7,30}$/;

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

const validationError = (message) => {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
};

const requiredText = (value, label, maximumLength) => {
    if (typeof value !== 'string') throw validationError(`${label} is required`);

    const normalized = value.trim();
    if (!normalized) throw validationError(`${label} is required`);
    if (normalized.length > maximumLength) {
        throw validationError(`${label} must be ${maximumLength} characters or fewer`);
    }
    return normalized;
};

const optionalText = (payload, key, label, maximumLength) => {
    if (!hasOwn(payload, key)) return undefined;
    if (typeof payload[key] !== 'string') throw validationError(`${label} must be text`);

    const normalized = payload[key].trim();
    if (normalized.length > maximumLength) {
        throw validationError(`${label} must be ${maximumLength} characters or fewer`);
    }
    return normalized;
};

const normalizeEmail = (value) => {
    const email = requiredText(value, 'Email', 254).toLowerCase();
    if (!EMAIL_PATTERN.test(email)) throw validationError('Please provide a valid email address');
    return email;
};

const normalizeAccountId = (value) => {
    const accountId = requiredText(value, 'Account ID', 50).toUpperCase();
    if (!ACCOUNT_ID_PATTERN.test(accountId)) {
        throw validationError('Account ID may contain only letters, numbers, hyphens, and underscores');
    }
    return accountId;
};

const normalizePhone = (value) => {
    const phone = requiredText(value, 'Phone number', 30);
    if (!PHONE_PATTERN.test(phone)) throw validationError('Please provide a valid phone number');
    return phone;
};

const accountIdFieldForRole = (role) => role === 'supplier' ? 'supplierId' : 'customerId';

const normalizeAccountPayload = ({ payload, role, isCreate = false }) => {
    if (!['supplier', 'customer'].includes(role)) {
        throw validationError('Only supplier and customer accounts can be managed here');
    }
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        throw validationError('Account data must be an object');
    }

    const data = {};
    const accountIdField = accountIdFieldForRole(role);

    if (isCreate || hasOwn(payload, 'email')) data.email = normalizeEmail(payload.email);
    if (isCreate || hasOwn(payload, 'accountId')) {
        if (payload.accountId !== undefined && payload.accountId !== '') {
            data[accountIdField] = normalizeAccountId(payload.accountId);
        }
    }
    if (isCreate || hasOwn(payload, 'phone')) data.phone = normalizePhone(payload.phone);
    if (hasOwn(payload, 'address')) {
        data.address = optionalText(payload, 'address', 'Address', 500);
    } else if (isCreate) {
        data.address = '';
    }

    if (role === 'supplier') {
        if (isCreate || hasOwn(payload, 'businessName')) {
            data.businessName = requiredText(payload.businessName, 'Business name', 160);
        }
        if (isCreate || hasOwn(payload, 'contactPerson')) {
            data.contactPerson = requiredText(payload.contactPerson, 'Contact person', 120);
        }
        // Existing product and order population uses User.name as the supplier name.
        if (data.businessName) data.name = data.businessName;
    } else if (isCreate || hasOwn(payload, 'name')) {
        data.name = requiredText(payload.name, 'Full name', 120);
    }

    if (isCreate) {
        data.password = requiredText(payload.password, 'Temporary password', 128);
        if (data.password.length < 8) {
            throw validationError('Temporary password must be at least 8 characters long');
        }
    } else if (hasOwn(payload, 'password') && payload.password) {
        data.password = requiredText(payload.password, 'Password', 128);
        if (data.password.length < 8) {
            throw validationError('Password must be at least 8 characters long');
        }
    }

    if (!isCreate && Object.keys(data).length === 0) {
        throw validationError('Provide at least one account field to update');
    }

    return data;
};

const activeStatusQuery = () => ({
    $or: [
        { accountStatus: 'active' },
        { accountStatus: { $exists: false } },
        { accountStatus: null }
    ]
});

const serializeManagedAccount = (user) => {
    const isSupplier = user.role === 'supplier';
    const accountId = isSupplier ? user.supplierId : user.customerId;

    return {
        _id: user._id,
        role: user.role,
        accountId: accountId || null,
        name: user.name,
        businessName: isSupplier ? (user.businessName || user.name) : undefined,
        contactPerson: isSupplier ? (user.contactPerson || user.name) : undefined,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        accountStatus: user.accountStatus === 'deactivated' ? 'deactivated' : 'active',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
};

module.exports = {
    ACCOUNT_STATUSES,
    accountIdFieldForRole,
    activeStatusQuery,
    normalizeAccountPayload,
    serializeManagedAccount,
    validationError
};
