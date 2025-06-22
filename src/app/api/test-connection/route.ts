import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const result = await db.command({ ping: 1 });
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error("Ping error ➜", err);
    return NextResponse.json(
      { ok: false, message: (err as Error).message, stack: (err as Error).stack },
      { status: 500 },
    );
  }
}
