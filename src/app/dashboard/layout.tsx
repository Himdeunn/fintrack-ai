import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardClientLayout } from '@/components/dashboard/DashboardClientLayout'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <DashboardClientLayout>
      {children}
    </DashboardClientLayout>
  )
}