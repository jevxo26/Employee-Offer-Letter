import mongoose, { Mongoose } from "mongoose";

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache =
  global.mongooseCache ?? (global.mongooseCache = { conn: null, promise: null });

async function dbConnect() {
  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "jevxo-doc-engine",
      // Raised from 5 s → 30 s to handle Atlas cold-start / serverless wake-up
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(mongodbUri, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset so the next request retries the connection
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
