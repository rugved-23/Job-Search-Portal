"use client"

import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { dataService } from "@/lib/data-service"
import { TrendingUp, Users, Briefcase, Eye } from "lucide-react"

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    userGrowth: 0,
    jobGrowth: 0,
    applicationGrowth: 0,
    topLocations: [] as { location: string; count: number }[],
    topSkills: [] as { skill: string; count: number }[],
    recentActivity: [] as any[],
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true)
      try {
        const [users, jobs, applications] = await Promise.all([
          dataService.getUsers(),
          dataService.getJobs(),
          dataService.getApplications(),
        ])

        // Calculate basic stats
        const totalUsers = users.length
        const totalJobs = jobs.length
        const totalApplications = applications.length
        const activeJobs = jobs.filter((job) => job.status === "active").length

        // Calculate growth (mock data for demo)
        const userGrowth = 12.5
        const jobGrowth = 8.3
        const applicationGrowth = 15.7

        // Top locations
        const locationCounts: { [key: string]: number } = {}
        users.forEach((u) => {
          if (u.role === "job_seeker" && (u.profile as any).location) {
            const location = (u.profile as any).location
            locationCounts[location] = (locationCounts[location] || 0) + 1
          }
        })
        const topLocations = Object.entries(locationCounts)
          .map(([location, count]) => ({ location, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)

        // Top skills
        const skillCounts: { [key: string]: number } = {}
        users.forEach((u) => {
          if (u.role === "job_seeker" && (u.profile as any).skills) {
            ;(u.profile as any).skills.forEach((skill: string) => {
              skillCounts[skill] = (skillCounts[skill] || 0) + 1
            })
          }
        })
        const topSkills = Object.entries(skillCounts)
          .map(([skill, count]) => ({ skill, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)

        // Recent activity (mock data)
        const recentActivity = [
          { type: "user_registered", description: "New job seeker registered", time: "2 hours ago" },
          { type: "job_posted", description: "New job posted: Senior Developer", time: "4 hours ago" },
          {
            type: "application_submitted",
            description: "Application submitted for Frontend Role",
            time: "6 hours ago",
          },
          { type: "user_registered", description: "New employer registered", time: "8 hours ago" },
          { type: "job_filled", description: "Position filled: Marketing Manager", time: "1 day ago" },
        ]

        setAnalytics({
          totalUsers,
          totalJobs,
          totalApplications,
          activeJobs,
          userGrowth,
          jobGrowth,
          applicationGrowth,
          topLocations,
          topSkills,
          recentActivity,
        })
      } catch (error) {
        console.error("Error loading analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [timeRange])

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Platform insights and performance metrics</p>
            </div>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{analytics.userGrowth}%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.activeJobs}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{analytics.jobGrowth}%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalApplications}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{analytics.applicationGrowth}%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">73%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+2.1%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Locations */}
            <Card>
              <CardHeader>
                <CardTitle>Top Locations</CardTitle>
                <CardDescription>Most popular job seeker locations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.topLocations.map((location, index) => (
                  <div key={location.location} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{location.location}</p>
                        <p className="text-sm text-muted-foreground">{location.count} job seekers</p>
                      </div>
                    </div>
                    <Badge variant="outline">{location.count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Top Skills</CardTitle>
                <CardDescription>Most in-demand skills on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analytics.topSkills.map((skill) => (
                    <Badge key={skill.skill} variant="secondary" className="flex items-center gap-1">
                      {skill.skill}
                      <span className="text-xs">({skill.count})</span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Platform Activity</CardTitle>
              <CardDescription>Latest actions and events on the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === "user_registered"
                          ? "bg-blue-100"
                          : activity.type === "job_posted"
                            ? "bg-green-100"
                            : activity.type === "application_submitted"
                              ? "bg-yellow-100"
                              : "bg-purple-100"
                      }`}
                    >
                      {activity.type === "user_registered" && <Users className="h-5 w-5 text-blue-600" />}
                      {activity.type === "job_posted" && <Briefcase className="h-5 w-5 text-green-600" />}
                      {activity.type === "application_submitted" && <Eye className="h-5 w-5 text-yellow-600" />}
                      {activity.type === "job_filled" && <TrendingUp className="h-5 w-5 text-purple-600" />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{activity.type.replace("_", " ")}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Platform Health */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Response Time</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    120ms
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database Health</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Server Uptime</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    99.9%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Daily Active Users</span>
                  <Badge variant="outline">1,247</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg. Session Duration</span>
                  <Badge variant="outline">12m 34s</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bounce Rate</span>
                  <Badge variant="outline">23%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending Reviews</span>
                  <Badge variant="outline">3</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Flagged Content</span>
                  <Badge variant="outline">1</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto-Approved</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    98%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
