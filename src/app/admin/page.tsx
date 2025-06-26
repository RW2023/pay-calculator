// app/admin/page.tsx
export const dynamic = 'force-dynamic'  // ← ensures every request is fresh
import AdminHomeContent from '@/components/Admin/AdminHomeContent'

export default function AdminHomePage() {
    return <AdminHomeContent />
}
