"use client"

import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { dataService } from "@/lib/data-service"
import { Search, Users, MoreHorizontal, Eye, Ban, Shield, Mail, Calendar } from "lucide-react"
import type { User as UserType } from "@/lib/types"

export default function UsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
  })

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      try {
        const usersData = await dataService.getUsers()
        setUsers(usersData)
      } catch (error) {
        console.error("Error loading users:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      role: "all",
    })
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !filters.search ||
      u.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      (u.role === "job_seeker" &&
        (`${(u.profile as any).firstName} ${(u.profile as any).lastName}`
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
          (u.profile as any).skills?.some((skill: string) =>
            skill.toLowerCase().includes(filters.search.toLowerCase()),
          ))) ||
      (u.role === "employer" && (u.profile as any).companyName?.toLowerCase().includes(filters.search.toLowerCase()))

    const matchesRole = filters.role === "all" || u.role === filters.role

    return matchesSearch && matchesRole
  })

  const handleUserAction = async (userId: string, action: string) => {
    try {
      // In a real app, you'd implement user management actions
      console.log(`${action} user ${userId}`)
    } catch (error) {
      console.error("Error performing user action:", error)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default"
      case "employer":
        return "secondary"
      case "job_seeker":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage platform users and their permissions</p>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter Users</CardTitle>
              <CardDescription>Find and manage users across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users by name, email, company..."
                      value={filters.search}
                      onChange={(e) => updateFilter("search", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={filters.role} onValueChange={(value) => updateFilter("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="job_seeker">Job Seekers</SelectItem>
                    <SelectItem value="employer">Employers</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-muted-foreground">{filteredUsers.length} users found</p>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{users.filter((u) => u.role === "job_seeker").length}</div>
                <p className="text-sm text-muted-foreground">Job Seekers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{users.filter((u) => u.role === "employer").length}</div>
                <p className="text-sm text-muted-foreground">Employers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</div>
                <p className="text-sm text-muted-foreground">Admins</p>
              </CardContent>
            </Card>
          </div>

          {/* Users List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No users found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search criteria.</p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </CardContent>
              </Card>
            ) : (
              filteredUsers.map((userItem) => (
                <Card key={userItem.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">
                            {userItem.role === "job_seeker"
                              ? `${(userItem.profile as any).firstName?.[0] || ""}${(userItem.profile as any).lastName?.[0] || ""}`
                              : userItem.role === "employer"
                                ? (userItem.profile as any).companyName?.[0] || "C"
                                : "A"}
                          </span>
                        </div>

                        <div className="space-y-3 flex-1">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {userItem.role === "job_seeker"
                                ? `${(userItem.profile as any).firstName || ""} ${(userItem.profile as any).lastName || ""}`
                                : userItem.role === "employer"
                                  ? (userItem.profile as any).companyName || "Company Name"
                                  : "Admin User"}
                            </h3>
                            <p className="text-muted-foreground">{userItem.email}</p>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {userItem.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Joined {new Date(userItem.createdAt).toLocaleDateString()}
                            </div>
                            {userItem.role === "job_seeker" && (userItem.profile as any).location && (
                              <div className="flex items-center gap-1">
                                <span>📍</span>
                                {(userItem.profile as any).location}
                              </div>
                            )}
                            {userItem.role === "employer" && (userItem.profile as any).industry && (
                              <div className="flex items-center gap-1">
                                <span>🏢</span>
                                {(userItem.profile as any).industry}
                              </div>
                            )}
                          </div>

                          {userItem.role === "job_seeker" && (userItem.profile as any).skills && (
                            <div className="flex flex-wrap gap-1">
                              {(userItem.profile as any).skills.slice(0, 5).map((skill: string) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {(userItem.profile as any).skills.length > 5 && (
                                <Badge variant="outline" className="text-xs">
                                  +{(userItem.profile as any).skills.length - 5} more
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <Badge variant={getRoleBadgeVariant(userItem.role)}>
                              {userItem.role.replace("_", " ")}
                            </Badge>
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Active
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleUserAction(userItem.id, "view")}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUserAction(userItem.id, "message")}>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            {userItem.role !== "admin" && (
                              <>
                                <DropdownMenuItem onClick={() => handleUserAction(userItem.id, "suspend")}>
                                  <Ban className="mr-2 h-4 w-4" />
                                  Suspend User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUserAction(userItem.id, "promote")}>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Change Role
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
