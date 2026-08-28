const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'petcare-hub',
    api_key: process.env.CLOUDINARY_API_KEY || 'demo_key',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'demo_secret',
    secure: true
});

const isCloudinaryConfigured = () => {
    return !!(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET &&
        process.env.CLOUDINARY_API_KEY !== 'demo_key'
    );
};

module.exports = {
    cloudinary,
    isCloudinaryConfigured
};
