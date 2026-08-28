const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

const setTokenCookie = (res, token) => {
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ status: 'fail', message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'customer',
        });

        if (user) {
            const token = generateToken(user._id);
            setTokenCookie(res, token);

            res.status(201).json({
                status: 'success',
                data: {
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    }
                }
            });
        } else {
            res.status(400).json({ status: 'fail', message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);
            setTokenCookie(res, token);

            res.status(200).json({
                status: 'success',
                data: {
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    }
                }
            });
        } else {
            res.status(401).json({ status: 'fail', message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};
