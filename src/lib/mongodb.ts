// lib/mongodb.ts
import { MongoClient, type Db } from "mongodb";

// ─── Validate env ──────────────────────────────────────────────────────────
if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

const uri = process.env.MONGODB_URI;

// ─── Determine target database name ───────────────────────────────────────
// 1) MONGODB_DB env var (explicit override)
// 2) The db name embedded in the URI path (…mongodb.net/<db>)
// 3) Fallback to 'paycalc'
const uriDb = (() => {
  try {
    const { pathname } = new URL(uri);
    return pathname && pathname !== "/" ? pathname.slice(1) : undefined;
  } catch {
    return undefined;
  }
})();

const dbName = process.env.MONGODB_DB ?? uriDb ?? "paycalc";

// ─── Singleton MongoClient cache (dev & prod) ─────────────────────────────
let cachedClient: MongoClient | null = null;
let cachedPromise: Promise<MongoClient> | null = null;

/**
 * Get a connected `Db` instance for the configured database.
 */
export async function getDb(): Promise<Db> {
  if (cachedClient) return cachedClient.db(dbName);

  if (!cachedPromise) {
    cachedPromise = new MongoClient(uri).connect();
  }

  cachedClient = await cachedPromise;
  return cachedClient.db(dbName);
}

/**
 * Expose the underlying MongoClient promise if another module needs it.
 */
export const clientPromise: Promise<MongoClient> = (async () => {
  if (cachedClient) return cachedClient;
  if (cachedPromise) return cachedPromise;
  cachedPromise = new MongoClient(uri).connect();
  cachedClient = await cachedPromise;
  return cachedClient;
})();
