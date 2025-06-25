// app/admin/page.tsx
export const dynamic = 'force-dynamic'  // ← ensures every request is fresh
import AdminHomeContent from '@/components/admin/AdminHomeContent'

export default function AdminHomePage() {
    return <AdminHomeContent />
}
