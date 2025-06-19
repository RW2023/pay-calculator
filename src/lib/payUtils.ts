// lib/payUtils.ts

export interface PayInput {
    hours: number;
    isHoliday: boolean;
    hasPension: boolean;
    hasUnionDues: boolean;
  }
  
  export interface PayResult {
    regularPay: number;
    overtimePay: number;
    holidayPay: number;
    pensionDeducted: number;
    unionDuesDeducted: number;
    netPay: number;
    lieuDayAccrued: boolean;
  }
  
  //  move rates to config/env for  flexibility.
  const REGULAR_RATE = Number(process.env.REGULAR_RATE) || 25; // Example: $25/hr
  const PENSION_BIWEEKLY = Number(process.env.PENSION_BIWEEKLY) || 60; // $60 every 2 weeks
  const UNION_DUES_BIWEEKLY = Number(process.env.UNION_DUES_BIWEEKLY) || 40; // $40 every 2 weeks
  
  export function calculatePay(input: PayInput): PayResult {
    const { hours, isHoliday, hasPension, hasUnionDues } = input;
  
    const regularHours = Math.min(hours, 8);
    const overtimeHours = Math.max(hours - 8, 0);    
    let regularPay = regularHours * REGULAR_RATE;
    let overtimePay = overtimeHours * REGULAR_RATE * 1.5;
  
    let holidayPay = 0;
    let lieuDayAccrued = false;
  
    if (isHoliday) {
      // Double time-and-a-half on holidays, with a "lieu day"
      holidayPay = hours * REGULAR_RATE * 2.5;
      regularPay = 0;
      overtimePay = 0;
      lieuDayAccrued = true;
    }
  
    // Assume these are weekly calculations for deduction
    const pensionDeducted = hasPension ? PENSION_BIWEEKLY / 2 : 0;
    const unionDuesDeducted = hasUnionDues ? UNION_DUES_BIWEEKLY / 2 : 0;
  
    const grossPay = regularPay + overtimePay + holidayPay;
    const totalDeductions = pensionDeducted + unionDuesDeducted;
    const netPay = grossPay - totalDeductions;
  
    return {
      regularPay,
      overtimePay,
      holidayPay,
      pensionDeducted,
      unionDuesDeducted,
      netPay,
      lieuDayAccrued,
    };
  }
