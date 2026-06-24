import mongoose from "mongoose";
process.loadEnvFile(".env");

const uri = process.env.MONGODB_URI;
console.log("URI:", uri);

async function test() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
    process.exit(0);
  } catch (err) {
    console.error("Connection error:", err);
    process.exit(1);
  }
}

test();
