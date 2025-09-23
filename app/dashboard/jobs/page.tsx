"use client"

import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { dataService } from "@/lib/data-service"
import { Search, MapPin, DollarSign, Clock, Briefcase, Plus, Users, Edit, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Job } from "@/lib/types"
import Link from "next/link"

export default function JobsPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    type: "all",
    remote: undefined as boolean | undefined,
  })

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true)
      try {
        const jobsData = await dataService.getJobs(filters)

        if (user?.role === "employer") {
          // Show only employer's own jobs
          const employerJobs = jobsData.filter((job) => job.employerId === user.id)
          setJobs(employerJobs)
        } else {
          // Show all active jobs for job seekers
          setJobs(jobsData)
        }
      } catch (error) {
        console.error("Error loading jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [filters, user])

  const updateFilter = (key: string, value: string | boolean | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      type: "all",
      remote: undefined,
    })
  }

  const handleJobAction = async (jobId: string, action: string) => {
    try {
      if (action === "close") {
        await dataService.updateJob(jobId, { status: "closed" })
      } else if (action === "activate") {
        await dataService.updateJob(jobId, { status: "active" })
      }
      // Reload jobs
      const jobsData = await dataService.getJobs(filters)
      if (user?.role === "employer") {
        const employerJobs = jobsData.filter((job) => job.employerId === user.id)
        setJobs(employerJobs)
      } else {
        setJobs(jobsData)
      }
    } catch (error) {
      console.error("Error updating job:", error)
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{user?.role === "employer" ? "My Jobs" : "Find Jobs"}</h1>
              <p className="text-muted-foreground">
                {user?.role === "employer"
                  ? "Manage your job postings and track applications"
                  : "Discover opportunities that match your skills"}
              </p>
            </div>
            {user?.role === "employer" && (
              <Button asChild>
                <Link href="/dashboard/jobs/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Link>
              </Button>
            )}
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
              <CardDescription>
                {user?.role === "employer" ? "Find and manage your job postings" : "Find the perfect job for you"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search jobs, companies, keywords..."
                      value={filters.search}
                      onChange={(e) => updateFilter("search", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Input
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => updateFilter("location", e.target.value)}
                />

                <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Select
                    value={filters.remote === undefined ? "all" : filters.remote.toString()}
                    onValueChange={(value) => updateFilter("remote", value === "all" ? undefined : value === "true")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Remote" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Remote</SelectItem>
                      <SelectItem value="false">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-muted-foreground">{jobs.length} jobs found</p>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Job Listings */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : jobs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {user?.role === "employer" ? "No job postings yet" : "No jobs found"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {user?.role === "employer"
                      ? "Create your first job posting to start hiring."
                      : "Try adjusting your search criteria or check back later for new opportunities."}
                  </p>
                  {user?.role === "employer" ? (
                    <Button asChild>
                      <Link href="/dashboard/jobs/new">Post Your First Job</Link>
                    </Button>
                  ) : (
                    <Button onClick={clearFilters}>Clear Filters</Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div>
                          <h3 className="text-xl font-semibold">{job.title}</h3>
                          <p className="text-lg text-muted-foreground">{job.company}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          {job.salary && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />${job.salary.min.toLocaleString()} - $
                              {job.salary.max.toLocaleString()}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(job.createdAt).toLocaleDateString()}
                          </div>
                          {user?.role === "employer" && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {job.applicationsCount} applicants
                            </div>
                          )}
                        </div>

                        <p className="text-muted-foreground line-clamp-2">{job.description}</p>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant={job.status === "active" ? "default" : "secondary"}>{job.status}</Badge>
                          <Badge variant="secondary">{job.type}</Badge>
                          {job.remote && <Badge variant="outline">Remote</Badge>}
                          {user?.role === "job_seeker" && (
                            <Badge variant="outline">{job.applicationsCount} applicants</Badge>
                          )}
                        </div>
                      </div>

                      <div className="ml-6 flex flex-col gap-2">
                        {user?.role === "job_seeker" ? (
                          <>
                            <Button asChild>
                              <Link href={`/dashboard/jobs/${job.id}`}>View Details</Link>
                            </Button>
                            <Button variant="outline" size="sm">
                              Save Job
                            </Button>
                          </>
                        ) : (
                          /* Added employer job management actions */
                          <div className="flex items-center gap-2">
                            <Button size="sm" asChild>
                              <Link href={`/dashboard/jobs/${job.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/jobs/${job.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {job.status === "active" ? (
                                  <DropdownMenuItem onClick={() => handleJobAction(job.id, "close")}>
                                    Close Job
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleJobAction(job.id, "activate")}>
                                    Activate Job
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>Duplicate Job</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Delete Job</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
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
