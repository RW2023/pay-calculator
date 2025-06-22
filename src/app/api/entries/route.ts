// app/api/entries/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";

// POST /api/entries  → create a new week’s shifts
export async function POST(request: NextRequest) {
  const { days, hasPension, hasUnionDues } = await request.json();

  const db = await getDb();
  const result = await db.collection("shiftEntries").insertOne({
    days,
    hasPension,
    hasUnionDues,
    createdAt: new Date(),
  });

  return NextResponse.json({ insertedId: result.insertedId });
}

// GET /api/entries?limit=10 → list recent entries
export async function GET(request: NextRequest) {
  const db = await getDb();
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? 20);

  const entries = await db
    .collection("shiftEntries")
    .find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return NextResponse.json(entries);
}
