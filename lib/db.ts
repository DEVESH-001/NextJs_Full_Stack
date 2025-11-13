import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI!;
if (!MONGO_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }; //
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
        bufferCommands:true, // Disable mongoose buffering, means mongoose will not try to automatically reconnect 
        maxPoolSize:10, // Maintain up to 10 socket connections
    };
    mongoose.connect(MONGO_URI,opts)
    .then(() => mongoose.connection);
  }
  //here we are awaiting the promise to connect to the database
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  return cached.conn;
}
