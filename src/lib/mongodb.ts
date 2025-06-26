// lib/mongodb.ts
import { MongoClient, type Db } from "mongodb";

// ─── Environment Validation ─────────────────────────────────────────────────
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

// ─── Determine Target Database Name ─────────────────────────────────────────
// Priority:
// 1. Explicit override via MONGODB_DB
// 2. Database name present in the connection string path (e.g. '/paycalc') // cspell:disable-line
// 3. Fallback to 'paycalc' // cspell:disable-line
const uriDb = (() => {
  try {
    const { pathname } = new URL(uri);
    return pathname && pathname !== "/" ? pathname.slice(1) : undefined;
  } catch {
    return undefined;
  }
})();

const dbName = process.env.MONGODB_DB ?? uriDb ?? "paycalc"; // cspell:disable-line

// ─── Singleton MongoClient Cache ────────────────────────────────────────────
let cachedClient: MongoClient | null = null;
let cachedPromise: Promise<MongoClient> | null = null;

/**
 * Returns a connected `Db` instance for the configured database.
 */
export async function getDb(): Promise<Db> {
  if (cachedClient) {
    return cachedClient.db(dbName);
  }

  if (!cachedPromise) {
    cachedPromise = new MongoClient(uri as string).connect();
  }

  cachedClient = await cachedPromise;
  return cachedClient.db(dbName);
}

/**
 * Expose the underlying MongoClient promise if needed elsewhere.
 */
export const clientPromise: Promise<MongoClient> = (async () => {
  if (cachedClient) return cachedClient;
  if (cachedPromise) return cachedPromise;
  cachedPromise = new MongoClient(uri).connect();
  cachedClient = await cachedPromise;
  return cachedClient;
})();
