'use client'

import { useSession } from '@/lib/auth-client'
import { usePathname } from 'next/navigation'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { Spinner } from '@/components/ui/shadcn-io/spinner'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { data: session, isPending } = useSession()
  const pathname = usePathname()

  // routes that don't need the sidebar (auth pages)
  const authRoutes = ['/login', '/register']
  const isAuthPage = authRoutes.some(route => pathname.startsWith(route))

  // Show loading state while checking session
  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spinner className="text-gray-500" size={64} />
      </div>
    )
  }

  // For auth pages, render without sidebar
  if (isAuthPage) {
    return <>{children}</>
  }

  // fir protected pages, render with sidebar only if authenticated
  if (session?.user) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    )
  }

  // if not authenticated and not on auth page, render children (middleware will handle)
  return <>{children}</>
}
