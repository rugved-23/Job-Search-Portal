"use client"

import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { dataService } from "@/lib/data-service"
import { Calendar, MapPin, Building, Eye, User, Mail, Phone } from "lucide-react"
import type { Application, Job, User as UserType } from "@/lib/types"

export default function ApplicationsPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<(Application & { job?: Job; candidate?: UserType })[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const loadApplications = async () => {
      if (!user) return

      setLoading(true)
      try {
        let applicationsData: Application[] = []

        if (user.role === "job_seeker") {
          applicationsData = await dataService.getApplications({ jobSeekerId: user.id })
        } else if (user.role === "employer") {
          applicationsData = await dataService.getApplications({ employerId: user.id })
        }

        // Fetch job details and candidate info for each application
        const applicationsWithDetails = await Promise.all(
          applicationsData.map(async (app) => {
            const job = await dataService.getJobById(app.jobId)
            let candidate = undefined
            if (user.role === "employer") {
              candidate = await dataService.getUserById(app.jobSeekerId)
            }
            return { ...app, job: job || undefined, candidate }
          }),
        )

        setApplications(applicationsWithDetails)
      } catch (error) {
        console.error("Error loading applications:", error)
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [user])

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      await dataService.updateApplication(applicationId, { status: newStatus as any })
      // Reload applications
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus as any } : app)),
      )
    } catch (error) {
      console.error("Error updating application status:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hired":
        return "default"
      case "shortlisted":
        return "secondary"
      case "rejected":
        return "destructive"
      case "reviewed":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const filteredApplications =
    statusFilter === "all" ? applications : applications.filter((app) => app.status === statusFilter)

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{user?.role === "job_seeker" ? "My Applications" : "Applications"}</h1>
              <p className="text-muted-foreground">
                {user?.role === "job_seeker"
                  ? "Track the status of your job applications"
                  : "Review and manage candidate applications"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Application Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{applications.length}</div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {applications.filter((app) => app.status === "pending").length}
                </div>
                <p className="text-sm text-muted-foreground">Pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {applications.filter((app) => app.status === "shortlisted").length}
                </div>
                <p className="text-sm text-muted-foreground">Shortlisted</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{applications.filter((app) => app.status === "hired").length}</div>
                <p className="text-sm text-muted-foreground">Hired</p>
              </CardContent>
            </Card>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {filteredApplications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {user?.role === "job_seeker" ? "No applications yet" : "No applications received"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {user?.role === "job_seeker"
                      ? "Start applying to jobs to see your applications here."
                      : "Applications will appear here when candidates apply to your jobs."}
                  </p>
                  <Button>{user?.role === "job_seeker" ? "Browse Jobs" : "Post a Job"}</Button>
                </CardContent>
              </Card>
            ) : (
              filteredApplications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div>
                          <h3 className="text-xl font-semibold">{application.job?.title || "Job Title"}</h3>
                          <p className="text-lg text-muted-foreground">
                            {user?.role === "job_seeker"
                              ? application.job?.company || "Company Name"
                              : application.candidate
                                ? `${(application.candidate.profile as any).firstName} ${(application.candidate.profile as any).lastName}`
                                : "Candidate Name"}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {application.job?.location || "Location"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Applied {new Date(application.appliedAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            Last updated {new Date(application.updatedAt).toLocaleDateString()}
                          </div>
                        </div>

                        {user?.role === "employer" && application.candidate && (
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {(application.candidate.profile as any).experience || "Experience not specified"}
                              </div>
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {application.candidate.email}
                              </div>
                              {(application.candidate.profile as any).phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-4 w-4" />
                                  {(application.candidate.profile as any).phone}
                                </div>
                              )}
                            </div>
                            {(application.candidate.profile as any).skills && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {(application.candidate.profile as any).skills.slice(0, 5).map((skill: string) => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {application.coverLetter && (
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm font-medium mb-1">Cover Letter:</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">{application.coverLetter}</p>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(application.status)}>
                            {getStatusText(application.status)}
                          </Badge>
                          {application.job?.type && <Badge variant="outline">{application.job.type}</Badge>}
                          {application.job?.remote && <Badge variant="outline">Remote</Badge>}
                        </div>
                      </div>

                      <div className="ml-6 flex flex-col gap-2">
                        {user?.role === "job_seeker" ? (
                          <>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            {application.status === "pending" && (
                              <Button variant="ghost" size="sm">
                                Withdraw
                              </Button>
                            )}
                          </>
                        ) : (
                          /* Added employer application management */
                          <>
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                            {application.status === "pending" && (
                              <div className="flex flex-col gap-1">
                                <Button size="sm" onClick={() => handleStatusUpdate(application.id, "shortlisted")}>
                                  Shortlist
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStatusUpdate(application.id, "rejected")}
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                            {application.status === "shortlisted" && (
                              <Button size="sm" onClick={() => handleStatusUpdate(application.id, "hired")}>
                                Hire
                              </Button>
                            )}
                          </>
                        )}
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
