const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    await initDB();

    // Close the mongoose connection after initializing data
    await mongoose.disconnect();
    console.log("Disconnected from DB");
  } catch (err) {
    console.error(err);
  }
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    const modifiedData = initData.data.map((obj) => ({ ...obj, owner: "65d04ff5abb8250fa9f90a74" }));
    await Listing.insertMany(modifiedData);
    console.log("Data was initialized");
  } catch (error) {
    console.error("Error initializing data:", error);
  }
};

// Call the main function to connect, initialize data, and disconnect
main();
