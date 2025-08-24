const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb+srv://TravelStay:wKw72f5qDWZhZy35@cluster0.yfygl4o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function main() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // wait up to 30s
    });
    console.log("✅ Connected to Atlas DB");

    await Listing.deleteMany({});
    console.log("🗑️ Cleared old listings");

    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "675fbea8c053d733c1e1a9e9",
    }));
    await Listing.insertMany(initData.data);

    console.log("✅ Data was initialized in Atlas");
    process.exit(0); // exit script
  } catch (err) {
    console.error("❌ Error seeding DB:", err);
    process.exit(1);
  }
}

main();
