"use client"

import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Briefcase,
  Users,
  TrendingUp,
  Clock,
  MapPin,
  DollarSign,
  User,
  Plus,
  Eye,
  Shield,
  AlertTriangle,
} from "lucide-react"
import { useEffect, useState } from "react"
import { dataService } from "@/lib/data-service"
import type { Job, Application, User as UserType } from "@/lib/types"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    totalUsers: 0,
    totalJobSeekers: 0,
    totalEmployers: 0,
    recentJobs: [] as Job[],
    recentApplications: [] as Application[],
    recentUsers: [] as UserType[],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return

      try {
        if (user.role === "job_seeker") {
          const [jobs, applications] = await Promise.all([
            dataService.getJobs(),
            dataService.getApplications({ jobSeekerId: user.id }),
          ])

          setStats({
            totalJobs: jobs.length,
            totalApplications: applications.length,
            activeJobs: jobs.filter((job) => job.status === "active").length,
            totalUsers: 0,
            totalJobSeekers: 0,
            totalEmployers: 0,
            recentJobs: jobs.slice(0, 3),
            recentApplications: applications.slice(0, 3),
            recentUsers: [],
          })
        } else if (user.role === "employer") {
          const [jobs, applications] = await Promise.all([
            dataService.getJobs(),
            dataService.getApplications({ employerId: user.id }),
          ])

          const employerJobs = jobs.filter((job) => job.employerId === user.id)

          setStats({
            totalJobs: employerJobs.length,
            totalApplications: applications.length,
            activeJobs: employerJobs.filter((job) => job.status === "active").length,
            totalUsers: 0,
            totalJobSeekers: 0,
            totalEmployers: 0,
            recentJobs: employerJobs.slice(0, 3),
            recentApplications: applications.slice(0, 3),
            recentUsers: [],
          })
        } else if (user.role === "admin") {
          const [jobs, applications, users] = await Promise.all([
            dataService.getJobs(),
            dataService.getApplications(),
            dataService.getUsers(),
          ])

          setStats({
            totalJobs: jobs.length,
            totalApplications: applications.length,
            activeJobs: jobs.filter((job) => job.status === "active").length,
            totalUsers: users.length,
            totalJobSeekers: users.filter((u) => u.role === "job_seeker").length,
            totalEmployers: users.filter((u) => u.role === "employer").length,
            recentJobs: jobs.slice(0, 3),
            recentApplications: applications.slice(0, 3),
            recentUsers: users.slice(0, 5),
          })
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user])

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back
              {user?.role === "job_seeker"
                ? `, ${(user.profile as any).firstName}`
                : user?.role === "employer"
                  ? `, ${(user.profile as any).contactPerson}`
                  : user?.role === "admin"
                    ? ", Admin"
                    : ""}
              !
            </h1>
            <p className="text-muted-foreground mt-2">
              {user?.role === "job_seeker"
                ? "Here's what's happening with your job search"
                : user?.role === "employer"
                  ? "Manage your job postings and review applications"
                  : user?.role === "admin"
                    ? "Platform overview and management tools"
                    : "Platform overview and management tools"}
            </p>
          </div>

          {/* Stats Cards */}
          {user?.role === "job_seeker" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalJobs}</div>
                  <p className="text-xs text-muted-foreground">Active job postings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">My Applications</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalApplications}</div>
                  <p className="text-xs text-muted-foreground">Applications submitted</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">67%</div>
                  <p className="text-xs text-muted-foreground">Average response</p>
                </CardContent>
              </Card>
            </div>
          )}

          {user?.role === "employer" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeJobs}</div>
                  <p className="text-xs text-muted-foreground">Currently hiring</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalApplications}</div>
                  <p className="text-xs text-muted-foreground">Applications received</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Job Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Time to Hire</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground">Days</p>
                </CardContent>
              </Card>
            </div>
          )}

          {user?.role === "admin" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">Registered users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Job Seekers</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalJobSeekers}</div>
                  <p className="text-xs text-muted-foreground">Active job seekers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Employers</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalEmployers}</div>
                  <p className="text-xs text-muted-foreground">Active employers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeJobs}</div>
                  <p className="text-xs text-muted-foreground">Live job postings</p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Jobs */}
            {user?.role === "job_seeker" && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Job Postings</CardTitle>
                  <CardDescription>Latest opportunities that match your profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.recentJobs.map((job) => (
                    <div key={job.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="space-y-2">
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </div>
                          {job.salary && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />${job.salary.min.toLocaleString()} - $
                              {job.salary.max.toLocaleString()}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="secondary">{job.type}</Badge>
                          {job.remote && <Badge variant="outline">Remote</Badge>}
                        </div>
                      </div>
                      <Button size="sm" asChild>
                        <Link href={`/dashboard/jobs/${job.id}`}>View</Link>
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/dashboard/jobs">View All Jobs</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {user?.role === "employer" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>My Job Postings</CardTitle>
                    <CardDescription>Manage your active job listings</CardDescription>
                  </div>
                  <Button size="sm" asChild>
                    <Link href="/dashboard/jobs/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Post Job
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.recentJobs.length > 0 ? (
                    <>
                      {stats.recentJobs.map((job) => (
                        <div key={job.id} className="flex items-start justify-between p-4 border rounded-lg">
                          <div className="space-y-2">
                            <h3 className="font-semibold">{job.title}</h3>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {job.applicationsCount} applicants
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant={job.status === "active" ? "default" : "secondary"}>{job.status}</Badge>
                              <Badge variant="outline">{job.type}</Badge>
                              {job.remote && <Badge variant="outline">Remote</Badge>}
                            </div>
                          </div>
                          <Button size="sm" asChild>
                            <Link href={`/dashboard/jobs/${job.id}`}>Manage</Link>
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full bg-transparent" asChild>
                        <Link href="/dashboard/jobs">View All Jobs</Link>
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No job postings yet</p>
                      <Button asChild>
                        <Link href="/dashboard/jobs/new">Post Your First Job</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {user?.role === "admin" && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest user registrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.recentUsers.map((recentUser) => (
                    <div key={recentUser.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {recentUser.role === "job_seeker"
                              ? `${(recentUser.profile as any).firstName?.[0] || ""}${(recentUser.profile as any).lastName?.[0] || ""}`
                              : recentUser.role === "employer"
                                ? (recentUser.profile as any).companyName?.[0] || "C"
                                : "A"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {recentUser.role === "job_seeker"
                              ? `${(recentUser.profile as any).firstName || ""} ${(recentUser.profile as any).lastName || ""}`
                              : recentUser.role === "employer"
                                ? (recentUser.profile as any).companyName || "Company"
                                : "Admin User"}
                          </p>
                          <p className="text-sm text-muted-foreground">{recentUser.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{recentUser.role.replace("_", " ")}</Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/dashboard/users">View All Users</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Recent Applications */}
            {user?.role === "job_seeker" && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Track your application status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.recentApplications.length > 0 ? (
                    <>
                      {stats.recentApplications.map((application) => {
                        const job = stats.recentJobs.find((j) => j.id === application.jobId)
                        return (
                          <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-1">
                              <h3 className="font-semibold">{job?.title || "Job Title"}</h3>
                              <p className="text-sm text-muted-foreground">{job?.company || "Company"}</p>
                              <p className="text-xs text-muted-foreground">
                                Applied {new Date(application.appliedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              variant={
                                application.status === "hired"
                                  ? "default"
                                  : application.status === "shortlisted"
                                    ? "secondary"
                                    : application.status === "rejected"
                                      ? "destructive"
                                      : "outline"
                              }
                            >
                              {application.status}
                            </Badge>
                          </div>
                        )
                      })}
                      <Button variant="outline" className="w-full bg-transparent" asChild>
                        <Link href="/dashboard/applications">View All Applications</Link>
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No applications yet</p>
                      <Button asChild>
                        <Link href="/dashboard/jobs">Start Applying</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {user?.role === "employer" && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Review candidate applications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.recentApplications.length > 0 ? (
                    <>
                      {stats.recentApplications.map((application) => {
                        const job = stats.recentJobs.find((j) => j.id === application.jobId)
                        return (
                          <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-1">
                              <h3 className="font-semibold">{job?.title || "Job Title"}</h3>
                              <p className="text-sm text-muted-foreground">New application</p>
                              <p className="text-xs text-muted-foreground">
                                Applied {new Date(application.appliedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{application.status}</Badge>
                              <Button size="sm">Review</Button>
                            </div>
                          </div>
                        )
                      })}
                      <Button variant="outline" className="w-full bg-transparent" asChild>
                        <Link href="/dashboard/applications">View All Applications</Link>
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No applications yet</p>
                      <Button asChild>
                        <Link href="/dashboard/jobs/new">Post a Job</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {user?.role === "admin" && (
              <Card>
                <CardHeader>
                  <CardTitle>Platform Activity</CardTitle>
                  <CardDescription>Recent platform activity and alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">New job posted</p>
                        <p className="text-sm text-muted-foreground">Senior Developer at TechCorp</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">New user registered</p>
                        <p className="text-sm text-muted-foreground">Job seeker from San Francisco</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">Reported content</p>
                        <p className="text-sm text-muted-foreground">Job posting flagged for review</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">6 hours ago</p>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/dashboard/analytics">View Analytics</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick Actions */}
          {user?.role === "job_seeker" && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Get started with your job search</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
                    <Link href="/dashboard/profile">
                      <User className="h-6 w-6 mb-2" />
                      Update Profile
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
                    <Link href="/dashboard/jobs">
                      <Briefcase className="h-6 w-6 mb-2" />
                      Browse Jobs
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {user?.role === "employer" && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your hiring process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
                    <Link href="/dashboard/jobs/new">
                      <Plus className="h-6 w-6 mb-2" />
                      Post New Job
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
                    <Link href="/dashboard/applications">
                      <Users className="h-6 w-6 mb-2" />
                      Review Applications
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
                    <Link href="/dashboard/profile">
                      <User className="h-6 w-6 mb-2" />
                      Company Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {user?.role === "admin" && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
                <CardDescription>Platform management and oversight</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
                    <Link href="/dashboard/users">
                      <Users className="h-6 w-6 mb-2" />
                      Manage Users
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
                    <Link href="/dashboard/jobs">
                      <Briefcase className="h-6 w-6 mb-2" />
                      Review Jobs
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
                    <Link href="/dashboard/analytics">
                      <TrendingUp className="h-6 w-6 mb-2" />
                      View Analytics
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Shield className="h-6 w-6 mb-2" />
                    Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
