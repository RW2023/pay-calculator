// lib/payUtils.ts

// Utility to handle overnight shifts (e.g. 9pm–5:30am next day)
export function calculateHours(start: string, end: string): number {
    if (!start || !end) return 0;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const startTotal = startH + startM / 60;
    const endTotal = endH + endM / 60;
    let diff = endTotal - startTotal;
    if (diff < 0) diff += 24;
    return Math.round(diff * 100) / 100;
  }
  
  // Types for each day's input
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
  
  // Result type for each day (optional: display in results)
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
  
  // Rates via env (with safe fallback)
  const REGULAR_RATE = Number(process.env.REGULAR_RATE) || 25;
  const PENSION_BIWEEKLY = Number(process.env.PENSION_BIWEEKLY) || 60;
  const UNION_DUES_BIWEEKLY = Number(process.env.UNION_DUES_BIWEEKLY) || 40;
  
  export function calculateWeeklyPay(input: WeeklyPayInput): WeeklyPayResult {
    let regularPay = 0;
    let overtimePay = 0;
    let holidayPay = 0;
    let totalHours = 0;
    let lieuDays = 0;
  
    const daysOfWeek = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  
    const days: DayPay[] = input.days.map((d, i) => {
      const hours = calculateHours(d.startTime, d.endTime);
      totalHours += hours;
      let dayRegular = 0, dayOvertime = 0, dayHoliday = 0;
      let isHoliday = d.isHoliday;
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
        day: daysOfWeek[i],
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
  