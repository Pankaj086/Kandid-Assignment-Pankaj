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
          <p className="text-sm text-muted-foreground mt-2">Start importing your leads to see statistics here</p>
          <button className="mt-3 text-primary hover:underline text-sm">Import Leads →</button>
        </div>
        
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-card-foreground">Active Campaigns</h3>
          <p className="text-sm text-muted-foreground mt-2">Create your first campaign to begin outreach</p>
          <button className="mt-3 text-primary hover:underline text-sm">Create Campaign →</button>
        </div>
        
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-card-foreground">Messages Sent</h3>
          <p className="text-sm text-muted-foreground mt-2">Track your outreach activity here</p>
          <button className="mt-3 text-primary hover:underline text-sm">View Messages →</button>
        </div>
        
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-card-foreground">Response Rate</h3>
          <p className="text-sm text-muted-foreground mt-2">Monitor engagement metrics here</p>
          <button className="mt-3 text-primary hover:underline text-sm">View Analytics →</button>
        </div>
      </div>
      
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">Getting Started</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-sm">1</div>
            <span className="text-muted-foreground">Import your lead database</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-sm">2</div>
            <span className="text-muted-foreground">Create your first outreach campaign</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-sm">3</div>
            <span className="text-muted-foreground">Start sending personalized messages</span>
          </div>
        </div>
      </div>
    </div>
  )
}
