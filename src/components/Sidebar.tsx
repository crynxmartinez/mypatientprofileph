'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Heart,
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  userName?: string | null
}

const menuItems = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard 
  },
  { 
    name: 'Patients', 
    href: '/dashboard/patients', 
    icon: Users 
  },
  { 
    name: 'Settings', 
    href: '/dashboard/settings', 
    icon: Settings 
  },
]

export default function Sidebar({ userName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <aside 
      className={cn(
        "bg-gradient-to-b from-purple-700 to-indigo-800 text-white flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-purple-600">
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            {!collapsed && (
              <div className="ml-3">
                <h1 className="font-bold text-lg leading-tight">MyPatientPH</h1>
                <p className="text-xs text-purple-200">Database</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-purple-600 rounded-full p-1 hover:bg-purple-500 transition"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 rounded-lg transition-all",
                isActive 
                  ? "bg-white/20 text-white font-semibold" 
                  : "text-purple-200 hover:bg-white/10 hover:text-white",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-purple-600">
        {!collapsed && userName && (
          <div className="mb-3 px-4">
            <p className="text-sm text-purple-200">Logged in as</p>
            <p className="font-semibold truncate">{userName}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center w-full px-4 py-3 rounded-lg text-purple-200 hover:bg-white/10 hover:text-white transition",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
