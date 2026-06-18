import mongoose from "mongoose";

declare global {
  var mongooseConnection:
    | {
        connection: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cached = global.mongooseConnection ?? {
  connection: null,
  promise: null,
};

global.mongooseConnection = cached;

export function hasDatabaseConfig() {
  return Boolean(process.env.MONGODB_URI);
}

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Thiếu biến môi trường MONGODB_URI.");
  }

  if (cached.connection) {
    return cached.connection;
  }

  cached.promise ??= mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB_NAME || "construction_company",
    bufferCommands: false,
  });

  cached.connection = await cached.promise;
  return cached.connection;
}
