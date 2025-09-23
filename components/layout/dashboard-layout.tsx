"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, User, Settings, LogOut, Briefcase, Users, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getNavItems = () => {
    if (!user) return []

    const baseItems = [{ href: "/dashboard", label: "Dashboard", icon: BarChart3 }]

    if (user.role === "job_seeker") {
      return [
        ...baseItems,
        { href: "/dashboard/jobs", label: "Find Jobs", icon: Search },
        { href: "/dashboard/applications", label: "My Applications", icon: Briefcase },
        { href: "/dashboard/profile", label: "Profile", icon: User },
      ]
    }

    if (user.role === "employer") {
      return [
        ...baseItems,
        { href: "/dashboard/jobs", label: "My Jobs", icon: Briefcase },
        { href: "/dashboard/applications", label: "Applications", icon: Users },
        { href: "/dashboard/profile", label: "Company Profile", icon: User },
      ]
    }

    if (user.role === "admin") {
      return [
        ...baseItems,
        { href: "/dashboard/users", label: "Users", icon: Users },
        { href: "/dashboard/jobs", label: "All Jobs", icon: Briefcase },
        { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
      ]
    }

    return baseItems
  }

  const navItems = getNavItems()

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <h1 className="text-xl font-bold">JobPortal</h1>
          </Link>

          <nav className="flex items-center space-x-6 ml-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user.role === "job_seeker"
                        ? `${(user.profile as any).firstName?.[0] || ""}${(user.profile as any).lastName?.[0] || ""}`
                        : user.role === "employer"
                          ? (user.profile as any).companyName?.[0] || "C"
                          : "A"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.email}</p>
                    <Badge variant="secondary" className="w-fit">
                      {user.role.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
