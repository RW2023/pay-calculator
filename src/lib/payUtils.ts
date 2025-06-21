// ---- Types ----
export interface DayEntry {
    scheduledStart: string
    scheduledEnd: string
    actualStart: string
    actualEnd: string
    lunchTaken: boolean
    isHoliday: boolean
    isBump: boolean
    lieuHoursUsed: number
  }
  
  export interface WeeklyPayInput {
    days: DayEntry[]
    hasPension: boolean
    hasUnionDues: boolean
  }
  
  export interface DayPay {
    day: string
    hoursWorked: number
    paidHours: number
    regularPay: number
    overtimePay: number
    holidayPay: number
    lieuPay: number
    bumpPay: number
    isHoliday: boolean
    isBump: boolean
    lieuHoursUsed: number
  }
  
  export interface WeeklyPayResult {
    days: DayPay[]
    totals: {
      regularPay: number
      overtimePay: number
      holidayPay: number
      lieuPay: number
      bumpPay: number
      nightShiftPay: number
      weekendPay: number
      weekendOTPay: number
      pensionDeducted: number
      unionDuesDeducted: number
      federalTax: number
      ei: number
      cpp: number
      netPay: number
      totalHours: number
      lieuDaysAccrued: number
      grossPay: number
    }
  }
  
  // --- Calculation helpers ---
  
  /** Parse “HH:mm” into fractional hours (for scheduled-shift math). */
  function parseTime(str: string): number {
    if (!str.includes(":")) return 0
    const [h = "0", m = "0"] = str.split(":")
    const hours = Number.parseInt(h, 10)
    const mins = Number.parseInt(m, 10)
    return hours + mins / 60
  }
  
  /** Parse “HH:mm” into minutes since midnight. */
  function parseTimeMinutes(str: string): number {
    if (!str.includes(":")) return 0
    const [h = "0", m = "0"] = str.split(":")
    const hours = Number.parseInt(h, 10)
    const mins = Number.parseInt(m, 10)
    return hours * 60 + mins
  }
  
  /** Round minutes‐since‐midnight down to the prior 15-minute mark. */
  function floorToQuarter(minutes: number): number {
    return Math.floor(minutes / 15) * 15
  }
  
  /** Simple hours-difference rounding helper (still used for scheduled shifts). */
  function calculateHours(start: string, end: string): number {
    let diff = parseTime(end) - parseTime(start)
    if (diff < 0) diff += 24
    return Math.max(0, Math.round(diff * 100) / 100)
  }
  
  /**
   * Returns an array of 0.25 h time-block start-times (in decimal hours)
   * based on floored punches and lunch deduction.
   */
  function getWorkedTimeBlocks(
    start: string,
    end: string,
    lunchTaken: boolean
  ): number[] {
    const rawStart = parseTimeMinutes(start)
    let rawEnd = parseTimeMinutes(end)
    if (rawEnd < rawStart) rawEnd += 24 * 60
  
    const flooredStart = floorToQuarter(rawStart)
    const flooredEnd = floorToQuarter(rawEnd)
    const durationMin = flooredEnd - flooredStart - (lunchTaken ? 30 : 0)
    if (durationMin <= 0) return []
  
    const totalBlocks = Math.round(durationMin / 15)
    const blocks: number[] = []
    for (let i = 0; i < totalBlocks; i++) {
      const minute = (flooredStart + i * 15) % (24 * 60)
      blocks.push(minute / 60)
    }
    return blocks
  }
  
  // --- Helper for getting numbers from env safely ---
  function getEnvNumber(key: string, fallback: number): number {
    const raw = process.env[key]
    const val = raw !== undefined ? Number(raw) : NaN
    if (!Number.isFinite(val) || val <= 0) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[payUtils] Env var ${key} missing or invalid, using fallback: ${fallback}`
        )
        return fallback
      } else {
        throw new Error(`[payUtils] Env var ${key} missing or invalid!`)
      }
    }
    return val
  }
  
  // --- Constants for rates (all from env!) ---
  const REGULAR_RATE = getEnvNumber("REGULAR_RATE", 32.5)
  const OVERTIME_RATE = REGULAR_RATE * 1.5
  const HOLIDAY_RATE = REGULAR_RATE * 1.5
  
  const PENSION_BIWEEKLY = getEnvNumber("PENSION_BIWEEKLY", 103.79)
  const UNION_DUES_WEEKLY = getEnvNumber("UNION_DUES_WEEKLY", 98)
  
  const EI_RATE = 0.0166
  const CPP_RATE = 0.0595
  const TAX_RATE_EST = 0.2
  
  // --- Premium constants ---
  const NIGHT_SHIFT_PREMIUM = 1.0
  const WEEKEND_PREMIUM = 2.0
  const WEEKEND_OT_PREMIUM = 3.0
  
  // --- Main calculation ---
  export function calculateWeeklyPay(
    input: WeeklyPayInput
  ): WeeklyPayResult {
    let regularPay = 0
    let overtimePay = 0
    let holidayPay = 0
    let lieuPay = 0
    let bumpPay = 0
    let totalHours = 0
    let lieuDaysAccrued = 0
  
    let nightShiftHours = 0
    let weekendHours = 0
    let weekendOTHours = 0
  
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]
  
    const days: DayPay[] = daysOfWeek.map((label, i) => {
      const d: DayEntry = input.days[i] ?? {
        scheduledStart: "21:00",
        scheduledEnd: "05:30",
        actualStart: "",
        actualEnd: "",
        lunchTaken: true,
        isHoliday: false,
        isBump: false,
        lieuHoursUsed: 0,
      }
  
      // ---- apply floor-to-15 min and lunch deduction ----
      const hoursWorked =
        d.actualStart && d.actualEnd
          ? (() => {
              const startMin = parseTimeMinutes(d.actualStart)
              let endMin = parseTimeMinutes(d.actualEnd)
              if (endMin < startMin) endMin += 24 * 60
  
              const flooredIn = floorToQuarter(startMin)
              const flooredOut = floorToQuarter(endMin)
              const rawWorkedMin =
                flooredOut - flooredIn - (d.lunchTaken ? 30 : 0)
              const workedMin = rawWorkedMin > 0 ? rawWorkedMin : 0
  
              return Math.round((workedMin / 60) * 100) / 100
            })()
          : 0
  
      // scheduled shift (exact times)
      let scheduledShift = calculateHours(
        d.scheduledStart,
        d.scheduledEnd
      )
      if (d.lunchTaken) scheduledShift = Math.max(0, scheduledShift - 0.5)
  
      // Premium block analysis
      const blocks = getWorkedTimeBlocks(
        d.actualStart,
        d.actualEnd,
        d.lunchTaken
      )
      let nightBlocks = 0,
        weekendBlocks = 0,
        weekendOTBlocks = 0
      const isWeekend = label === "Saturday" || label === "Sunday"
      const otThresholdBlocks = 8 * 4
      blocks.forEach((hourVal, idx) => {
        if ((hourVal >= 21 && hourVal < 24) || (hourVal >= 0 && hourVal < 4)) {
          nightBlocks++
        }
        if (isWeekend) {
          if (idx < otThresholdBlocks) weekendBlocks++
          else weekendOTBlocks++
        }
      })
      nightShiftHours += nightBlocks * 0.25
      weekendHours += weekendBlocks * 0.25
      weekendOTHours += weekendOTBlocks * 0.25
  
      // Payout logic
      let paidHours = hoursWorked
      let dayRegularPay = 0,
        dayOvertimePay = 0,
        dayHolidayPay = 0,
        dayBumpPay = 0
      const dayLieuPay = Number(
        (d.lieuHoursUsed * REGULAR_RATE).toFixed(2)
      )
      let dayLieuDaysAccrued = 0
  
      if (d.isHoliday && paidHours > 0) {
        dayHolidayPay = Number((paidHours * HOLIDAY_RATE).toFixed(2))
        dayLieuDaysAccrued = 1
      } else if (d.isBump && hoursWorked < scheduledShift) {
        paidHours = scheduledShift
        dayRegularPay = Number(
          (hoursWorked * REGULAR_RATE).toFixed(2)
        )
        dayBumpPay = Number(
          ((scheduledShift - hoursWorked) * REGULAR_RATE).toFixed(2)
        )
      } else {
        dayRegularPay = Number(
          (Math.min(hoursWorked, 8) * REGULAR_RATE).toFixed(2)
        )
        dayOvertimePay = Number(
          (Math.max(hoursWorked - 8, 0) * OVERTIME_RATE).toFixed(2)
        )
      }
  
      regularPay += dayRegularPay
      overtimePay += dayOvertimePay
      holidayPay += dayHolidayPay
      lieuPay += dayLieuPay
      bumpPay += dayBumpPay
      totalHours += paidHours
      lieuDaysAccrued += dayLieuDaysAccrued
  
      return {
        day: label,
        hoursWorked,
        paidHours,
        regularPay: dayRegularPay,
        overtimePay: dayOvertimePay,
        holidayPay: dayHolidayPay,
        lieuPay: dayLieuPay,
        bumpPay: dayBumpPay,
        isHoliday: d.isHoliday,
        isBump: d.isBump,
        lieuHoursUsed: d.lieuHoursUsed,
      }
    })
  
    // Premium dollars
    const nightShiftPay = Number(
      (nightShiftHours * NIGHT_SHIFT_PREMIUM).toFixed(2)
    )
    const weekendPay = Number(
      (weekendHours * WEEKEND_PREMIUM).toFixed(2)
    )
    const weekendOTPay = Number(
      (weekendOTHours * WEEKEND_OT_PREMIUM).toFixed(2)
    )
  
    const grossPay =
      regularPay +
      overtimePay +
      holidayPay +
      lieuPay +
      bumpPay +
      nightShiftPay +
      weekendPay +
      weekendOTPay
  
    const pensionDeducted = input.hasPension
      ? Number((PENSION_BIWEEKLY / 2).toFixed(2))
      : 0
    const unionDuesDeducted = input.hasUnionDues
      ? Number(UNION_DUES_WEEKLY.toFixed(2))
      : 0
    const federalTax = Number((TAX_RATE_EST * grossPay).toFixed(2))
    const ei = Number((EI_RATE * grossPay).toFixed(2))
    const cpp = Number((CPP_RATE * grossPay).toFixed(2))
    const netPay = Math.max(
      0,
      Number(
        (
          grossPay -
          pensionDeducted -
          unionDuesDeducted -
          federalTax -
          ei -
          cpp
        ).toFixed(2)
      )
    )
  
    return {
      days,
      totals: {
        regularPay,
        overtimePay,
        holidayPay,
        lieuPay,
        bumpPay,
        nightShiftPay,
        weekendPay,
        weekendOTPay,
        pensionDeducted,
        unionDuesDeducted,
        federalTax,
        ei,
        cpp,
        netPay,
        totalHours,
        lieuDaysAccrued,
        grossPay,
      },
    }
  }
  