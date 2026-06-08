const Queue = require("bull");
const { cloudinary } = require("../cloudConfig");
const Listing = require("../models/listing");
const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");
const env = require("../env");

const REDIS_URL = env.REDIS_URL;

// Upstash Redis uses TLS (rediss://). Bull requires explicit ioredis options for TLS.
const isTLS = REDIS_URL.startsWith("rediss://");
const uploadQueue = new Queue("image-upload", {
  redis: {
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
    tls: isTLS ? { rejectUnauthorized: false } : undefined,
    // Pass the full URL via lazyConnect so ioredis parses host/port/auth
    ...(isTLS ? { url: REDIS_URL } : { url: REDIS_URL })
  }
});

uploadQueue.process(async (job) => {
  const { listingId, filePath, folderName } = job.data;
  logger.info(`Processing upload for listing ${listingId}`); // Fix 4: Structured Logging

  try {
    // 1. Upload to Cloudinary from local disk
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName || "TravelStay_Listings"
    });

    // 2. Update Listing in MongoDB
    await Listing.findByIdAndUpdate(listingId, {
      image: {
        url: result.secure_url,
        filename: result.public_id
      },
      imageStatus: "ready"
    });

    logger.info(`Successfully processed and updated listing ${listingId}`);

  } catch (error) {
    logger.error({ err: error }, `Failed to process upload for listing ${listingId}`);
    // Even if it fails, we should perhaps mark it as failed, but we'll throw to let Bull retry
    throw error;
  } finally {
    // 3. Delete the temporary file from disk
    fs.unlink(filePath, (err) => {
      if (err) logger.error({ err }, `Failed to delete temp file ${filePath}`);
    });
  }
});

uploadQueue.on('error', (err) => {
  logger.error({ err }, "Queue error");
});

module.exports = uploadQueue;
