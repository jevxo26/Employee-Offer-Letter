import mongoose, { Mongoose } from "mongoose";

// ─── Cached connection (survives Next.js hot reloads) ─────────────────────────
type MongooseCache = { conn: Mongoose | null; promise: Promise<Mongoose> | null };

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache =
  global.mongooseCache ?? (global.mongooseCache = { conn: null, promise: null });

export default async function dbConnect(): Promise<Mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured.");

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      dbName: "jevxo-doc-engine",
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
