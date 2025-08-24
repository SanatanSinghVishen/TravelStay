const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Check if required environment variables are set
if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
    console.warn('Warning: Cloudinary environment variables are not set. Image uploads may not work.');
}

const storage = new CloudinaryStorage({ //where the files will be stored
    cloudinary: cloudinary,
    params: {
      folder: 'wanderLust_DEV',
      allowedFormats: ["png", "jpg", "jpeg"],
      transformation: [{ width: 500, height: 500, crop: 'limit' }]
    },
});
   

module.exports = {
    cloudinary,
    storage,
}