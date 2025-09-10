'use client'

import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from "@/components/ui/theme-toggle"

interface BreadcrumbItem {
  label: string
  href?: string
}

const pathLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  leads: 'Leads',
  campaigns: 'Campaigns',
  messages: 'Messages',
  'linkedin-accounts': 'LinkedIn Accounts',
  settings: 'Setting & Billing',
  'activity-logs': 'Activity logs',
  'user-logs': 'User logs'
}

export function Header() {
  const pathname = usePathname()
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }]
    
    segments.forEach((segment, index) => {
      const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
      const href = '/' + segments.slice(0, index + 1).join('/')
      breadcrumbs.push({ label, href })
    })
    
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <header className="h-16 border-b border-border bg-background flex items-center px-6">
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <div key={item.href || item.label} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
              )}
              {index === 0 && (
                <Home className="h-4 w-4 text-muted-foreground mr-2" />
              )}
              <span
                className={cn(
                  index === breadcrumbs.length - 1
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                )}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
