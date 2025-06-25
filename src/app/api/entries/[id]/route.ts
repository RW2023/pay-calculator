// app/api/entries/[id]/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const db = await getDb();
    const entry = await db
      .collection("shiftEntries")
      .findOne({ _id: new ObjectId(id) });

    if (!entry) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(entry);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("GET /api/entries/[id] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const db = await getDb()
    await db.collection('shiftEntries').deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('DELETE /api/entries/[id] error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
