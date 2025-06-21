// ---- Types ----
export interface DayEntry {
    scheduledStart: string
    scheduledEnd: string
    actualStart: string
    actualEnd: string
    /** total minutes to deduct for breaks (e.g. 0, 30, 45, 60) */
    breakMinutes: number
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
  
  /**
   * Returns an array of 0.25 h time-block start-times (in decimal hours)
   * based on floored punches and a custom break length.
   */
 // ---- Types ----
export interface DayEntry {
    scheduledStart: string
    scheduledEnd: string
    actualStart: string
    actualEnd: string
    /** total minutes to deduct for breaks (e.g. 0, 30, 45, 60) */
    breakMinutes: number
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
  
  /** Parse “HH:mm” into fractional hours */
  function parseTime(str: string): number {
    if (!str.includes(":")) return 0
    const [h = "0", m = "0"] = str.split(":")
    const hours = Number.parseInt(h, 10) || 0
    const mins = Number.parseInt(m, 10) || 0
    return hours + mins / 60
  }
  
  /** Parse “HH:mm” into minutes since midnight */
  function parseTimeMinutes(str: string): number {
    if (!str.includes(":")) return 0
    const [h = "0", m = "0"] = str.split(":")
    const hours = Number.parseInt(h, 10) || 0
    const mins = Number.parseInt(m, 10) || 0
    return hours * 60 + mins
  }
  
  /** Floor minutes-since-midnight down to the prior 15-minute mark */
  function floorToQuarter(minutes: number): number {
    return Math.floor(minutes / 15) * 15
  }
  
  /** Simple hours-difference rounding helper (for scheduled shifts) */
  function calculateHours(start: string, end: string): number {
    let diff = parseTime(end) - parseTime(start)
    if (diff < 0) diff += 24
    return Math.max(0, Math.round(diff * 100) / 100)
  }
  
  /**
   * Returns an array of 0.25 h blocks (in decimal hours)
   * based on floored punches and a custom break length.
   */
  function getWorkedTimeBlocks(
    start: string,
    end: string,
    breakMinutes: number
  ): number[] {
    const rawStart = parseTimeMinutes(start)
    let rawEnd = parseTimeMinutes(end)
    if (rawEnd < rawStart) rawEnd += 24 * 60
  
    const flooredStart = floorToQuarter(rawStart)
    const flooredEnd = floorToQuarter(rawEnd)
    const durationMin = flooredEnd - flooredStart - breakMinutes
    if (durationMin <= 0) return []
  
    const totalBlocks = Math.round(durationMin / 15)
    const blocks: number[] = []
    for (let i = 0; i < totalBlocks; i++) {
      const minute = (flooredStart + i * 15) % (24 * 60)
      blocks.push(minute / 60)
    }
    return blocks
  }
  
  // --- Env helper ---
  function getEnvNumber(key: string, fallback: number): number {
    const raw = process.env[key]
    const val = raw !== undefined ? Number(raw) : NaN
    if (!Number.isFinite(val) || val <= 0) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[payUtils] Env var ${key} invalid, using ${fallback}`)
        return fallback
      } else {
        throw new Error(`[payUtils] Env var ${key} invalid!`)
      }
    }
    return val
  }
  
  // --- Rates & premiums ---
  const REGULAR_RATE = getEnvNumber("REGULAR_RATE", 32.5)
  const OVERTIME_RATE = REGULAR_RATE * 1.5
  const HOLIDAY_RATE = REGULAR_RATE * 1.5
  
  const PENSION_BIWEEKLY = getEnvNumber("PENSION_BIWEEKLY", 103.79)
  const UNION_DUES_WEEKLY = getEnvNumber("UNION_DUES_WEEKLY", 98)
  
  const EI_RATE = 0.0166
  const CPP_RATE = 0.0595
  const TAX_RATE_EST = 0.2
  
  const NIGHT_SHIFT_PREMIUM = 1.0
  const WEEKEND_PREMIUM = 2.0
  const WEEKEND_OT_PREMIUM = 3.0
  
  // --- Main calculation ---
  export function calculateWeeklyPay(
    input: WeeklyPayInput
  ): WeeklyPayResult {
    let regularPay = 0,
        overtimePay = 0,
        holidayPay = 0,
        lieuPay = 0,
        bumpPay = 0,
        totalHours = 0,
        lieuDaysAccrued = 0
    let nightShiftHours = 0,
        weekendHours = 0,
        weekendOTHours = 0
  
    const daysOfWeek = [
      "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
    ]
  
    const days: DayPay[] = daysOfWeek.map((label, i) => {
      const d: DayEntry = input.days[i] ?? {
        scheduledStart: "21:00",
        scheduledEnd: "05:30",
        actualStart: "",
        actualEnd: "",
        breakMinutes: 30,
        isHoliday: false,
        isBump: false,
        lieuHoursUsed: 0,
      }
  
      // worked hours (floor‐to‐quarter + break)
      const hoursWorked = d.actualStart && d.actualEnd
        ? (() => {
            const startMin = parseTimeMinutes(d.actualStart)
            let endMin = parseTimeMinutes(d.actualEnd)
            if (endMin < startMin) endMin += 24*60
  
            const flooredIn  = floorToQuarter(startMin)
            const flooredOut = floorToQuarter(endMin)
            const workedMin = Math.max(0, flooredOut - flooredIn - d.breakMinutes)
            return Math.round((workedMin/60)*100)/100
          })()
        : 0
  
      // scheduled shift hours (subtract break)
      let scheduledShift = calculateHours(d.scheduledStart, d.scheduledEnd)
      scheduledShift = Math.max(0, scheduledShift - d.breakMinutes/60)
  
      // premium blocks
      const blocks = getWorkedTimeBlocks(d.actualStart, d.actualEnd, d.breakMinutes)
      let nightBlocks = 0, weekendBlocks = 0, weekendOTBlocks = 0
      const isWeekend = label==="Saturday"||label==="Sunday"
      const otThresh = 8*4
      blocks.forEach((hVal, idx) => {
        if ((hVal>=21&&hVal<24)||(hVal>=0&&hVal<4)) nightBlocks++
        if (isWeekend) {
            if (idx < otThresh) {
              weekendBlocks++;
            } else {
              weekendOTBlocks++;
            }
          }
                })
      nightShiftHours += nightBlocks*0.25
      weekendHours   += weekendBlocks*0.25
      weekendOTHours += weekendOTBlocks*0.25
  
      // pay math
      let paidHours   = hoursWorked
      let dayRegPay   = 0,
          dayOTPay    = 0,
          dayHolPay   = 0,
          dayBump     = 0
      const dayLieu   = Number((d.lieuHoursUsed*REGULAR_RATE).toFixed(2))
      let dayLieuAccr = 0
  
      if (d.isHoliday&&paidHours>0) {
        dayHolPay   = Number((paidHours*HOLIDAY_RATE).toFixed(2))
        dayLieuAccr = 1
      }
      else if (d.isBump&&hoursWorked<scheduledShift) {
        paidHours = scheduledShift
        dayRegPay = Number((hoursWorked*REGULAR_RATE).toFixed(2))
        dayBump   = Number(((scheduledShift-hoursWorked)*REGULAR_RATE).toFixed(2))
      }
      else {
        dayRegPay = Number((Math.min(hoursWorked,8)*REGULAR_RATE).toFixed(2))
        dayOTPay  = Number((Math.max(hoursWorked-8,0)*OVERTIME_RATE).toFixed(2))
      }
  
      regularPay  += dayRegPay
      overtimePay += dayOTPay
      holidayPay  += dayHolPay
      lieuPay     += dayLieu
      bumpPay     += dayBump
      totalHours  += paidHours
      lieuDaysAccrued += dayLieuAccr
  
      return {
        day: label,
        hoursWorked,
        paidHours,
        regularPay: dayRegPay,
        overtimePay: dayOTPay,
        holidayPay: dayHolPay,
        lieuPay: dayLieu,
        bumpPay: dayBump,
        isHoliday: d.isHoliday,
        isBump: d.isBump,
        lieuHoursUsed: d.lieuHoursUsed,
      }
    })
  
    // premiums $
    const nightShiftPay = Number((nightShiftHours*NIGHT_SHIFT_PREMIUM).toFixed(2))
    const weekendPay    = Number((weekendHours*WEEKEND_PREMIUM).toFixed(2))
    const weekendOTPay  = Number((weekendOTHours*WEEKEND_OT_PREMIUM).toFixed(2))
  
    const grossPay = regularPay+overtimePay+holidayPay+lieuPay+bumpPay
                   + nightShiftPay+weekendPay+weekendOTPay
  
    const pensionDeducted      = input.hasPension     ? Number((PENSION_BIWEEKLY/2).toFixed(2)) : 0
    const unionDuesDeducted    = input.hasUnionDues  ? Number(UNION_DUES_WEEKLY.toFixed(2))       : 0
    const federalTax           = Number((TAX_RATE_EST*grossPay).toFixed(2))
    const ei                   = Number((EI_RATE*grossPay).toFixed(2))
    const cpp                  = Number((CPP_RATE*grossPay).toFixed(2))
    const netPay               = Math.max(0, Number((grossPay - pensionDeducted
                                   - unionDuesDeducted - federalTax - ei - cpp).toFixed(2)))
  
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
      }
    }
  }
  