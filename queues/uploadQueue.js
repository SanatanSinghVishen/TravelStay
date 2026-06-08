const Queue = require("bull");
const IORedis = require("ioredis");
const { cloudinary } = require("../cloudConfig");
const Listing = require("../models/listing");
const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");
const env = require("../env");

const REDIS_URL = env.REDIS_URL;
const isTLS = REDIS_URL.startsWith("rediss://");

// Use ioredis createClient factory — the only reliable way to pass TLS
// config (required for Upstash) through Bull's internal ioredis instance.
const makeRedisClient = () =>
  new IORedis(REDIS_URL, {
    tls: isTLS ? { rejectUnauthorized: false } : undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

const uploadQueue = new Queue("image-upload", {
  createClient: (type) => {
    // Bull needs three separate client instances
    return makeRedisClient();
  },
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
