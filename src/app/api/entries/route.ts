// app/api/entries/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getDb } from '@/lib/mongodb'
import type { DayEntry } from '@/lib/payUtils'
import {
  calculateWeeklyPay,
  type WeeklyPayInput,
} from '@/lib/payUtils'
import { startOfISOWeek, endOfISOWeek } from 'date-fns'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

type EntryPayload = {
  days: DayEntry[]
  hasPension: boolean
  hasUnionDues: boolean
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as { role?: string } | undefined
    if (!session || user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = (await request.json()) as Partial<EntryPayload>
    if (
      !payload.days ||
      !Array.isArray(payload.days) ||
      typeof payload.hasPension !== 'boolean' ||
      typeof payload.hasUnionDues !== 'boolean'
    ) {
      throw new Error('Invalid request body')
    }

    const db = await getDb()
    const result = await db.collection('shiftEntries').insertOne({
      days: payload.days,
      hasPension: payload.hasPension,
      hasUnionDues: payload.hasUnionDues,
      createdAt: new Date(),
    })

    return NextResponse.json({ insertedId: result.insertedId })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('POST /api/entries error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as { role?: string } | undefined
    if (!session || user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDb()

    // ─── SUMMARY BRANCH ───────────────────────────────────────────────────────
    if (request.nextUrl.searchParams.get('summary') === 'true') {
      // 1️⃣ Week boundaries
      const weekStart = startOfISOWeek(new Date())
      const weekEnd   = endOfISOWeek(new Date())

      // 2️⃣ Count how many weekly docs exist this week
      const totalEntries = await db
        .collection('shiftEntries')
        .countDocuments({ createdAt: { $gte: weekStart, $lte: weekEnd } })

      // 3️⃣ Fetch the one (or first) doc to calculate pay
      const weekDoc = await db
        .collection('shiftEntries')
        .findOne({ createdAt: { $gte: weekStart, $lte: weekEnd } })

      // 4️⃣ Normalize & filter raw days into true DayEntry[]
      type RawDay = Omit<DayEntry, 'actualStart' | 'actualEnd'> & {
        actualStart?: string
        actualEnd?:   string
      }
      const rawDays = (weekDoc?.days ?? []) as RawDay[]
      const validDays: DayEntry[] = rawDays.filter(
        (d): d is DayEntry =>
          typeof d.actualStart === 'string' &&
          d.actualStart.length > 0 &&
          typeof d.actualEnd   === 'string' &&
          d.actualEnd.length > 0
      )

      // 5️⃣ Run your pay calculator
      const weeklyInput: WeeklyPayInput = {
        days:         validDays,
        hasPension:   weekDoc?.hasPension   ?? true,
        hasUnionDues: weekDoc?.hasUnionDues ?? true,
      }
      const { totals } = calculateWeeklyPay(weeklyInput)

      // 6️⃣ Return exactly the six numbers your client needs
      return NextResponse.json({
        totalEntries,               // ← now counts docs, not days
        totalHours:   totals.totalHours,
        grossPay:     totals.grossPay,
        pension:      totals.pensionDeducted,
        unionDues:    totals.unionDuesDeducted,
        overtimePay:  totals.overtimePay,
      })
    }

    // ─── FALLBACK: raw list of entries ────────────────────────────────────────
    const limitParam = request.nextUrl.searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : 20
    if (isNaN(limit) || limit < 1) {
      throw new Error('`limit` must be a positive integer')
    }

    const entries = await db
      .collection('shiftEntries')
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    const formatted = entries.map((e) => ({
      ...e,
      _id: e._id.toString(),
    }))

    return NextResponse.json(formatted)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('GET /api/entries error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
