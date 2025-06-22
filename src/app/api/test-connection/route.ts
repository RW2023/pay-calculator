// app/api/test-connection/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import type { Document } from "mongodb";

export async function GET(): Promise<NextResponse> {
  try {
    const db = await getDb();
    // "ping" is a no-op admin command—if it succeeds, the connection is healthy
    const result: Document = await db.command({ ping: 1 });
    return NextResponse.json({ ok: true, result });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
