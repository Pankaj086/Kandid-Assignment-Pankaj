'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSession, signOut } from '@/lib/auth-client'
import { useSidebarStore } from '@/stores/sidebar-store'
import {
  ChevronLeft,
  LayoutDashboard,
  Users,
  Megaphone,
  MessageSquare,
  Linkedin,
  Settings,
  Activity,
  FileText,
  LogOut,
  Menu
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Leads',
    href: '/leads',
    icon: Users
  },
  {
    title: 'Campaign',
    href: '/campaign',
    icon: Megaphone
  },
  {
    title: 'Messages',
    href: '/messages',
    icon: MessageSquare,
  },
  {
    title: 'LinkedIn Accounts',
    href: '/linkedin-accounts',
    icon: Linkedin
  }
]

const settingsItems: NavItem[] = [
  {
    title: 'Setting & Billing',
    href: '/settings',
    icon: Settings
  }
]

const adminItems: NavItem[] = [
  {
    title: 'Activity logs',
    href: '/activity-logs',
    icon: Activity
  },
  {
    title: 'User logs',
    href: '/user-logs',
    icon: FileText
  }
]

export function Sidebar() {
  const { isCollapsed, toggleCollapsed } = useSidebarStore()
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  }

  return (
    <div className={cn(
      "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
        <div className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">LB</span>
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-sidebar-foreground">LinkBird</span>
          )}
        </div>
        <button
          onClick={toggleCollapsed}
          className="p-1.5 hover:bg-sidebar-accent rounded-md text-sidebar-foreground"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* User Profile */}
      <div className="px-4 py-2 border-b border-sidebar-border">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium text-sm">
              {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sidebar-foreground text-sm truncate">
                {session?.user?.name || 'User'}
              </p>
              <p className="text-xs text-sidebar-foreground/60">Personal</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* Overview Section */}
        <div className="px-4 py-2">
          {!isCollapsed && (
            <h3 className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-3">
              Overview
            </h3>
          )}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.title}</span>
                    </>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Settings Section */}
        <div className="px-4 py-2">
          {!isCollapsed && (
            <h3 className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-3">
              Settings
            </h3>
          )}
          <nav className="space-y-1">
            {settingsItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Admin Panel Section */}
        <div className="px-4 py-2">
          {!isCollapsed && (
            <h3 className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-3">
              Admin Panel
            </h3>
          )}
          <nav className="space-y-1">
            {adminItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Bottom User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-xs">
              {session?.user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sidebar-foreground text-sm truncate">
                {session?.user?.name || session?.user?.email || 'User'}
              </p>
              <p className="text-xs text-sidebar-foreground/60">
                {session?.user?.email || 'user@example.com'}
              </p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full mt-3 px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </div>
  )
}
