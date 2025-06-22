// lib/mongodb.ts
import { MongoClient, type MongoClientOptions, type Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

const uri: string = process.env.MONGODB_URI;
const options: MongoClientOptions = {}; // you can add retryWrites, w, etc., here if needed

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // Allows us to cache the client across module reloads in development
  // so that we don’t open countless connections
  // (this merges onto the NodeJS.Global interface)
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === "development") {
  if (!globalThis._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalThis._mongoClientPromise = client.connect();
  }
  clientPromise = globalThis._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Returns a connected `Db` instance
 */
export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  // You can also call client.db("yourDbName") if you
  // want to override the default database in the URI
  return client.db();
}
