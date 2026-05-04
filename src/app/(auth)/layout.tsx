export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-azure-mist dark:bg-dusk-blue transition-colors">
      {children}
    </div>
  )
}
