// app/actions/calculatePay.ts
"use server";

import { calculateWeeklyPay } from "@/lib/payUtils";
import type { WeeklyPayInput, WeeklyPayResult } from "@/lib/payUtils";

// The server action must be async!
export async function calculatePayAction(input: WeeklyPayInput): Promise<WeeklyPayResult> {
    // All env vars and secrets are available here
    return calculateWeeklyPay(input);
}
