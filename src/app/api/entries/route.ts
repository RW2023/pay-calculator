// app/api/entries/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getDb } from '@/lib/mongodb'
import type { DayEntry } from '@/lib/payUtils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

type EntryPayload = {
  days: DayEntry[];
  hasPension: boolean;
  hasUnionDues: boolean;
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // 1. Parse & validate body
    const payload = (await request.json()) as Partial<EntryPayload>;
    if (
      !payload.days ||
      !Array.isArray(payload.days) ||
      typeof payload.hasPension !== "boolean" ||
      typeof payload.hasUnionDues !== "boolean"
    ) {
      throw new Error("Invalid request body");
    }

    // 2. Persist to MongoDB
    const db = await getDb();
    const result = await db.collection("shiftEntries").insertOne({
      days: payload.days,
      hasPension: payload.hasPension,
      hasUnionDues: payload.hasUnionDues,
      createdAt: new Date(),
    });

    return NextResponse.json({ insertedId: result.insertedId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("POST /api/entries error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // 1. Read & sanitize query
    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 20;
    if (isNaN(limit) || limit < 1) {
      throw new Error("`limit` must be a positive integer");
    }

    // 2. Fetch from MongoDB
    const db = await getDb();
    const entries = await db
      .collection("shiftEntries")
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    const formatted = entries.map((e) => ({
      ...e,
      _id: e._id.toString(),
    }));

    return NextResponse.json(formatted);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("GET /api/entries error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
