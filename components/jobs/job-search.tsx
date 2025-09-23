"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Building, DollarSign, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { Job } from "@/lib/types"
import { dataService } from "@/lib/data-service"
import Link from "next/link"

export function JobSearch() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [salaryFilter, setSalaryFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [experienceFilter, setExperienceFilter] = useState("")
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadJobs = async () => {
      const allJobs = await dataService.getJobs()
      setJobs(allJobs)
      setFilteredJobs(allJobs)
      setLoading(false)
    }
    loadJobs()
  }, [])

  useEffect(() => {
    let filtered = jobs

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (locationFilter) {
      filtered = filtered.filter((job) => job.location.toLowerCase().includes(locationFilter.toLowerCase()))
    }

    if (salaryFilter) {
      const [min, max] = salaryFilter.split("-").map((s) => Number.parseInt(s.replace("k", "000")))
      filtered = filtered.filter((job) => {
        const jobSalary = Number.parseInt(job.salary.replace(/[^0-9]/g, ""))
        return jobSalary >= min && (max ? jobSalary <= max : true)
      })
    }

    if (typeFilter) {
      filtered = filtered.filter((job) => job.type === typeFilter)
    }

    if (experienceFilter) {
      filtered = filtered.filter((job) => job.experience === experienceFilter)
    }

    if (remoteOnly) {
      filtered = filtered.filter((job) => job.remote)
    }

    setFilteredJobs(filtered)
  }, [jobs, searchTerm, locationFilter, salaryFilter, typeFilter, experienceFilter, remoteOnly])

  const formatSalary = (salary: string) => {
    return salary.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/4 mb-4"></div>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Jobs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Job title, company, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={salaryFilter} onValueChange={setSalaryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Salary Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Salary</SelectItem>
                <SelectItem value="0-50k">$0 - $50k</SelectItem>
                <SelectItem value="50k-80k">$50k - $80k</SelectItem>
                <SelectItem value="80k-120k">$80k - $120k</SelectItem>
                <SelectItem value="120k-200k">$120k - $200k</SelectItem>
                <SelectItem value="200k">$200k+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Type</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Level</SelectItem>
                <SelectItem value="Entry">Entry Level</SelectItem>
                <SelectItem value="Mid">Mid Level</SelectItem>
                <SelectItem value="Senior">Senior Level</SelectItem>
                <SelectItem value="Lead">Lead/Principal</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Checkbox id="remote" checked={remoteOnly} onCheckedChange={setRemoteOnly} />
              <Label htmlFor="remote">Remote Only</Label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{filteredJobs.length} jobs found</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("")
                setLocationFilter("")
                setSalaryFilter("")
                setTypeFilter("")
                setExperienceFilter("")
                setRemoteOnly(false)
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Job Results */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-balance">
                      <Link href={`/dashboard/jobs/${job.id}`} className="hover:text-primary transition-colors">
                        {job.title}
                      </Link>
                    </h3>
                    {job.remote && <Badge variant="secondary">Remote</Badge>}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {job.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {formatSalary(job.salary)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {getTimeAgo(job.postedDate)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{job.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{job.type}</Badge>
                    <Badge variant="outline">{job.experience}</Badge>
                    {job.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                    {job.skills.length > 3 && <Badge variant="secondary">+{job.skills.length - 3} more</Badge>}
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Link href={`/dashboard/jobs/${job.id}`}>
                    <Button size="sm">View Details</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredJobs.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
