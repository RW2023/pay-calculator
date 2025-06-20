// lib/payUtils.ts

// ---- Types ----
export interface DayEntry {
    scheduledStart: string;
    scheduledEnd: string;
    actualStart: string;
    actualEnd: string;
    lunchTaken: boolean;
    isHoliday: boolean;
    isBump: boolean;
    lieuHoursUsed: number;
}

export interface WeeklyPayInput {
    days: DayEntry[];
    hasPension: boolean;
    hasUnionDues: boolean;
}

export interface DayPay {
    day: string;
    hoursWorked: number;
    paidHours: number;
    regularPay: number;
    overtimePay: number;
    holidayPay: number;
    lieuPay: number;
    bumpPay: number;
    isHoliday: boolean;
    isBump: boolean;
    lieuHoursUsed: number;
}

export interface WeeklyPayResult {
    days: DayPay[];
    totals: {
        regularPay: number;
        overtimePay: number;
        holidayPay: number;
        lieuPay: number;
        bumpPay: number;
        pensionDeducted: number;
        unionDuesDeducted: number;
        federalTax: number;
        ei: number;
        cpp: number;
        netPay: number;
        totalHours: number;
        lieuDaysAccrued: number;
        grossPay: number;
    };
}

// --- Calculation helpers ---
// Safely parse time like "21:00" to float, never NaN/undefined.
function parseTime(str: string): number {
    if (!str || typeof str !== "string" || !str.includes(":")) return 0;
    const [h, m] = str.split(":");
    const hours = Number.parseInt(h ?? "0", 10);
    const mins = Number.parseInt(m ?? "0", 10);
    return (Number.isFinite(hours) ? hours : 0) + (Number.isFinite(mins) ? mins : 0) / 60;
}

// Calculate duration between times, handling overnight shifts.
export function calculateHours(start: string, end: string): number {
    const startTotal = parseTime(start);
    const endTotal = parseTime(end);
    let diff = endTotal - startTotal;
    if (diff < 0) diff += 24;
    return Math.max(0, Math.round(diff * 100) / 100);
}

// --- Constants for rates (2024, Ontario Canada, or user provided) ---
const REGULAR_RATE = 32.50; // Your base hourly rate
const OVERTIME_RATE = REGULAR_RATE * 1.5;
const HOLIDAY_RATE = REGULAR_RATE * 1.5;

const PENSION_BIWEEKLY = 103.79;
const UNION_DUES_BIWEEKLY = 98;

const EI_RATE = 0.0166;
const CPP_RATE = 0.0595;
const TAX_RATE_EST = 0.20; // Estimate for most weekly payslips (federal+provincial, varies in reality!)

// --- Main calculation ---
export function calculateWeeklyPay(input: WeeklyPayInput): WeeklyPayResult {
    let regularPay = 0;
    let overtimePay = 0;
    let holidayPay = 0;
    let lieuPay = 0;
    let bumpPay = 0;
    let totalHours = 0;
    let lieuDaysAccrued = 0;

    const daysOfWeek = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

    const days: DayPay[] = daysOfWeek.map((label, i) => {
        const d: DayEntry = input.days[i] ?? {
            scheduledStart: '21:00',
            scheduledEnd: '05:30',
            actualStart: '',
            actualEnd: '',
            lunchTaken: true,
            isHoliday: false,
            isBump: false,
            lieuHoursUsed: 0,
        };

        let hoursWorked = (d.actualStart && d.actualEnd)
            ? calculateHours(d.actualStart, d.actualEnd)
            : 0;
        if (d.lunchTaken) hoursWorked = Math.max(0, hoursWorked - 0.5);

        const scheduledShift = calculateHours(d.scheduledStart, d.scheduledEnd);

        // BUMP: pay up to scheduled if finished early
        let bumpHours = 0;
        let paidHours = hoursWorked;
        if (d.isBump && hoursWorked < scheduledShift) {
            bumpHours = scheduledShift - hoursWorked;
            paidHours = scheduledShift;
        }

        // Lieu payout
        const dayLieuPay = Number((d.lieuHoursUsed * REGULAR_RATE).toFixed(2));

        // Holiday (all paid hours at holiday rate, accrue 1 lieu day)
        let dayHolidayPay = 0, dayRegularPay = 0, dayOvertimePay = 0, dayBumpPay = 0;
        let dayLieuDaysAccrued = 0;
        if (d.isHoliday && paidHours > 0) {
            dayHolidayPay = Number((paidHours * HOLIDAY_RATE).toFixed(2));
            dayLieuDaysAccrued = 1;
        } else {
            // Regular & overtime split
            dayRegularPay = Number((Math.min(paidHours, 8) * REGULAR_RATE).toFixed(2));
            dayOvertimePay = Number((Math.max(paidHours - 8, 0) * OVERTIME_RATE).toFixed(2));
            if (bumpHours > 0) dayBumpPay = Number((bumpHours * REGULAR_RATE).toFixed(2));
        }

        regularPay += dayRegularPay;
        overtimePay += dayOvertimePay;
        holidayPay += dayHolidayPay;
        lieuPay += dayLieuPay;
        bumpPay += dayBumpPay;
        totalHours += paidHours;
        lieuDaysAccrued += dayLieuDaysAccrued;

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
        };
    });

    const pensionDeducted = input.hasPension ? Number((PENSION_BIWEEKLY / 2).toFixed(2)) : 0;
    const unionDuesDeducted = input.hasUnionDues ? Number((UNION_DUES_BIWEEKLY / 2).toFixed(2)) : 0;

    const grossPay = regularPay + overtimePay + holidayPay + lieuPay + bumpPay;

    const federalTax = Number((TAX_RATE_EST * grossPay).toFixed(2));
    const ei = Number((EI_RATE * grossPay).toFixed(2));
    const cpp = Number((CPP_RATE * grossPay).toFixed(2));

    const netPay = Number((grossPay - pensionDeducted - unionDuesDeducted - federalTax - ei - cpp).toFixed(2));

    return {
        days,
        totals: {
            regularPay,
            overtimePay,
            holidayPay,
            lieuPay,
            bumpPay,
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
    };
}
