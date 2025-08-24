const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

console.log('✅ Cloudinary configured successfully');

// Create Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "TravelStay_Listings",
        allowed_formats: ["png", "jpg", "jpeg", "gif", "webp"],
        public_id: (req, file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            return file.fieldname + '-' + uniqueSuffix;
        },
        // ⚡️ Do not apply heavy transformations on upload, apply them on delivery URL
    }
});

console.log('✅ Cloudinary storage configured successfully');

module.exports = { cloudinary, storage };
