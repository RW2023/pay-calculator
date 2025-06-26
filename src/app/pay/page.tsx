// src/app/pay/page.tsx
import type { Metadata } from 'next';
import PayCalculatorClient from '@/components/Calculator/PayCalculatorClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Pay Calculator',
};

export default function PayCalculatorPage() {
    // This is now a pure server component that simply renders the client-side calculator.
    return <PayCalculatorClient />;
}
