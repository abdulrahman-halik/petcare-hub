const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    // Check for cookie token or Authorization header Bearer token
    if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ status: 'fail', message: 'User belonging to token no longer exists' });
            }

            next();
        } catch (error) {
            console.error('Auth protect error:', error.message);
            res.status(401).json({ status: 'fail', message: 'Not authorized, invalid token' });
        }
    } else {
        res.status(401).json({ status: 'fail', message: 'Not authorized, no token provided' });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'fail',
                message: `User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this route`
            });
        }
        next();
    };
};
