// lib/payUtils.ts

// Robust utility to handle overnight shifts (e.g. 9pm–5:30am next day)
export function calculateHours(start: string, end: string): number {
    if (!start || !end || !start.includes(':') || !end.includes(':')) return 0;
  
    const [startHRaw, startMRaw] = start?.split?.(':') ?? [];
    const [endHRaw, endMRaw] = end?.split?.(':') ?? [];
  
    const safeNum = (n: unknown) => {
      const x = Number(n);
      return Number.isFinite(x) ? x : 0;
    };
  
    const startH = safeNum(startHRaw);
    const startM = safeNum(startMRaw);
    const endH = safeNum(endHRaw);
    const endM = safeNum(endMRaw);
  
    const startTotal = startH + startM / 60;
    const endTotal = endH + endM / 60;
    let diff = endTotal - startTotal;
    if (diff < 0) diff += 24;
    return Math.max(0, Math.round(diff * 100) / 100);
  }
  
  // ---- Types for each day's input ----
  export interface DayEntry {
    startTime: string;  // "21:00"
    endTime: string;    // "05:30"
    isHoliday: boolean;
  }
  
  // Week input
  export interface WeeklyPayInput {
    days: DayEntry[];
    hasPension: boolean;
    hasUnionDues: boolean;
  }
  
  // Result type for each day
  export interface DayPay {
    day: string;
    hours: number;
    regularPay: number;
    overtimePay: number;
    holidayPay: number;
    isHoliday: boolean;
  }
  
  // Aggregated week result
  export interface WeeklyPayResult {
    days: DayPay[];
    totals: {
      regularPay: number;
      overtimePay: number;
      holidayPay: number;
      pensionDeducted: number;
      unionDuesDeducted: number;
      netPay: number;
      totalHours: number;
      lieuDays: number;
    };
  }
  
  // Robust env var parsing (fallback if unset or not a number)
  function safeEnvNum(name: string, fallback: number): number {
    const val = Number(process.env[name]);
    return Number.isFinite(val) && !Number.isNaN(val) ? val : fallback;
  }
  
  const REGULAR_RATE = safeEnvNum('REGULAR_RATE', 25);
  const PENSION_BIWEEKLY = safeEnvNum('PENSION_BIWEEKLY', 60);
  const UNION_DUES_BIWEEKLY = safeEnvNum('UNION_DUES_BIWEEKLY', 40);
  
  export function calculateWeeklyPay(input: WeeklyPayInput): WeeklyPayResult {
    let regularPay = 0;
    let overtimePay = 0;
    let holidayPay = 0;
    let totalHours = 0;
    let lieuDays = 0;
  
    // Always use 7 days (pad with blanks if short)
    const daysOfWeek = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  
    const days: DayPay[] = daysOfWeek.map((label, i) => {
      const d = input.days[i] ?? { startTime: '', endTime: '', isHoliday: false };
      const hours = calculateHours(d.startTime, d.endTime);
      totalHours += hours;
      let dayRegular = 0, dayOvertime = 0, dayHoliday = 0;
      const isHoliday = d.isHoliday;
      if (isHoliday && hours > 0) {
        // All hours at double-time-and-a-half
        dayHoliday = hours * REGULAR_RATE * 2.5;
        lieuDays += 1;
      } else {
        // First 8 hours regular, rest overtime
        dayRegular = Math.min(hours, 8) * REGULAR_RATE;
        dayOvertime = Math.max(hours - 8, 0) * REGULAR_RATE * 1.5;
      }
      regularPay += dayRegular;
      overtimePay += dayOvertime;
      holidayPay += dayHoliday;
      return {
        day: label,
        hours,
        regularPay: dayRegular,
        overtimePay: dayOvertime,
        holidayPay: dayHoliday,
        isHoliday,
      };
    });
  
    const pensionDeducted = input.hasPension ? PENSION_BIWEEKLY / 2 : 0;
    const unionDuesDeducted = input.hasUnionDues ? UNION_DUES_BIWEEKLY / 2 : 0;
    const netPay = regularPay + overtimePay + holidayPay - pensionDeducted - unionDuesDeducted;
  
    return {
      days,
      totals: {
        regularPay,
        overtimePay,
        holidayPay,
        pensionDeducted,
        unionDuesDeducted,
        netPay,
        totalHours,
        lieuDays,
      },
    };
  }
  