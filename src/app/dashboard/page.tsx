'use client'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/login')
    }
  }, [session, isPending, router])

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  if (!session?.user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {session.user.name || session.user.email}!
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-card-foreground">Total Leads</h3>
          <p className="text-3xl font-bold text-primary mt-2">1,234</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-card-foreground">Active Campaigns</h3>
          <p className="text-3xl font-bold text-primary mt-2">12</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-card-foreground">Messages Sent</h3>
          <p className="text-3xl font-bold text-primary mt-2">5,678</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-card-foreground">Response Rate</h3>
          <p className="text-3xl font-bold text-primary mt-2">23%</p>
        </div>
      </div>
    </div>
  )
}
