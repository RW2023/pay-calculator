// lib/mongodb.ts
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

const uri = process.env.MONGODB_URI;
const options = {
  // recommended for serverless environments
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // allow global caching across hot reloads in development
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDb() {
  const client = await clientPromise;
  return client.db(); // defaults to the database in your URI
}
