"use client"

import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { dataService } from "@/lib/data-service"
import { Plus, X } from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"
import { useToast } from "@/hooks/use-toast"
import type { JobSeekerProfile, EmployerProfile } from "@/lib/types"

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<JobSeekerProfile | EmployerProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    if (user) {
      setProfile(user.profile)
    }
  }, [user])

  const handleSave = async () => {
    if (!user || !profile) return

    setLoading(true)
    try {
      await dataService.updateUser(user.id, {
        ...user,
        profile,
      })
      // In a real app, you'd update the auth context here
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && profile && user?.role === "job_seeker") {
      const jobSeekerProfile = profile as JobSeekerProfile
      setProfile({
        ...jobSeekerProfile,
        skills: [...jobSeekerProfile.skills, newSkill.trim()],
      })
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    if (profile && user?.role === "job_seeker") {
      const jobSeekerProfile = profile as JobSeekerProfile
      setProfile({
        ...jobSeekerProfile,
        skills: jobSeekerProfile.skills.filter((skill) => skill !== skillToRemove),
      })
    }
  }

  const updateProfile = (field: string, value: string) => {
    if (profile) {
      setProfile({
        ...profile,
        [field]: value,
      })
    }
  }

  const handleResumeUpload = async (file: File) => {
    try {
      // In a real app, you would upload to a file storage service
      // For now, we'll simulate with a URL
      const resumeUrl = `/uploads/resumes/${user?.id}/${file.name}`

      if (profile && user?.role === "job_seeker") {
        const updatedProfile = {
          ...(profile as JobSeekerProfile),
          resumeUrl,
        }
        setProfile(updatedProfile)

        toast({
          title: "Resume uploaded",
          description: "Your resume has been uploaded successfully!",
        })
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleResumeRemove = () => {
    if (profile && user?.role === "job_seeker") {
      const updatedProfile = {
        ...(profile as JobSeekerProfile),
        resumeUrl: undefined,
      }
      setProfile(updatedProfile)

      toast({
        title: "Resume removed",
        description: "Your resume has been removed.",
      })
    }
  }

  if (!user) {
    return null
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{user.role === "job_seeker" ? "Profile" : "Company Profile"}</h1>
            <p className="text-muted-foreground">
              {user.role === "job_seeker"
                ? "Manage your professional profile and preferences"
                : "Manage your company information and hiring preferences"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              {user.role === "job_seeker" ? (
                /* Job Seeker Profile */
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your basic information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={(profile as JobSeekerProfile)?.firstName || ""}
                            onChange={(e) => updateProfile("firstName", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={(profile as JobSeekerProfile)?.lastName || ""}
                            onChange={(e) => updateProfile("lastName", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={(profile as JobSeekerProfile)?.phone || ""}
                            onChange={(e) => updateProfile("phone", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={(profile as JobSeekerProfile)?.location || ""}
                            onChange={(e) => updateProfile("location", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={(profile as JobSeekerProfile)?.bio || ""}
                          onChange={(e) => updateProfile("bio", e.target.value)}
                          rows={4}
                          placeholder="Tell employers about yourself..."
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Professional Information</CardTitle>
                      <CardDescription>Share your experience and education</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience Level</Label>
                        <Input
                          id="experience"
                          value={(profile as JobSeekerProfile)?.experience || ""}
                          onChange={(e) => updateProfile("experience", e.target.value)}
                          placeholder="e.g., 5+ years, Entry level, Senior"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="education">Education</Label>
                        <Textarea
                          id="education"
                          value={(profile as JobSeekerProfile)?.education || ""}
                          onChange={(e) => updateProfile("education", e.target.value)}
                          rows={3}
                          placeholder="Your educational background..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                          <Input
                            id="linkedinUrl"
                            value={(profile as JobSeekerProfile)?.linkedinUrl || ""}
                            onChange={(e) => updateProfile("linkedinUrl", e.target.value)}
                            placeholder="https://linkedin.com/in/yourprofile"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                          <Input
                            id="portfolioUrl"
                            value={(profile as JobSeekerProfile)?.portfolioUrl || ""}
                            onChange={(e) => updateProfile("portfolioUrl", e.target.value)}
                            placeholder="https://yourportfolio.com"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Skills</CardTitle>
                      <CardDescription>Add your technical and professional skills</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add a skill..."
                          onKeyPress={(e) => e.key === "Enter" && addSkill()}
                        />
                        <Button onClick={addSkill} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(profile as JobSeekerProfile)?.skills?.map((skill) => (
                          <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                            {skill}
                            <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-destructive">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                /* Added Employer Profile */
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Company Information</CardTitle>
                      <CardDescription>Update your company details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company Name</Label>
                          <Input
                            id="companyName"
                            value={(profile as EmployerProfile)?.companyName || ""}
                            onChange={(e) => updateProfile("companyName", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactPerson">Contact Person</Label>
                          <Input
                            id="contactPerson"
                            value={(profile as EmployerProfile)?.contactPerson || ""}
                            onChange={(e) => updateProfile("contactPerson", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={(profile as EmployerProfile)?.phone || ""}
                            onChange={(e) => updateProfile("phone", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={(profile as EmployerProfile)?.website || ""}
                            onChange={(e) => updateProfile("website", e.target.value)}
                            placeholder="https://yourcompany.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={(profile as EmployerProfile)?.location || ""}
                            onChange={(e) => updateProfile("location", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="industry">Industry</Label>
                          <Input
                            id="industry"
                            value={(profile as EmployerProfile)?.industry || ""}
                            onChange={(e) => updateProfile("industry", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companySize">Company Size</Label>
                        <Input
                          id="companySize"
                          value={(profile as EmployerProfile)?.companySize || ""}
                          onChange={(e) => updateProfile("companySize", e.target.value)}
                          placeholder="e.g., 1-10, 11-50, 51-200, 200+"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Company Description</Label>
                        <Textarea
                          id="description"
                          value={(profile as EmployerProfile)?.description || ""}
                          onChange={(e) => updateProfile("description", e.target.value)}
                          rows={4}
                          placeholder="Describe your company, culture, and what makes it special..."
                        />
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Profile Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{user.role === "job_seeker" ? "Profile Summary" : "Company Summary"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {user.role === "job_seeker"
                          ? `${(profile as JobSeekerProfile)?.firstName?.[0] || ""}${(profile as JobSeekerProfile)?.lastName?.[0] || ""}`
                          : (profile as EmployerProfile)?.companyName?.[0] || "C"}
                      </span>
                    </div>
                    <h3 className="font-semibold">
                      {user.role === "job_seeker"
                        ? `${(profile as JobSeekerProfile)?.firstName || ""} ${(profile as JobSeekerProfile)?.lastName || ""}`
                        : (profile as EmployerProfile)?.companyName || "Company Name"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {user.role === "job_seeker"
                        ? (profile as JobSeekerProfile)?.location
                        : (profile as EmployerProfile)?.industry}
                    </p>
                  </div>

                  {user.role === "job_seeker" ? (
                    <>
                      <div className="space-y-2">
                        <h4 className="font-medium">Experience</h4>
                        <p className="text-sm text-muted-foreground">
                          {(profile as JobSeekerProfile)?.experience || "Not specified"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Skills ({(profile as JobSeekerProfile)?.skills?.length || 0})</h4>
                        <div className="flex flex-wrap gap-1">
                          {(profile as JobSeekerProfile)?.skills?.slice(0, 5).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {((profile as JobSeekerProfile)?.skills?.length || 0) > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{((profile as JobSeekerProfile)?.skills?.length || 0) - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <h4 className="font-medium">Industry</h4>
                        <p className="text-sm text-muted-foreground">
                          {(profile as EmployerProfile)?.industry || "Not specified"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Company Size</h4>
                        <p className="text-sm text-muted-foreground">
                          {(profile as EmployerProfile)?.companySize || "Not specified"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Location</h4>
                        <p className="text-sm text-muted-foreground">
                          {(profile as EmployerProfile)?.location || "Not specified"}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {user.role === "job_seeker" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Resume</CardTitle>
                    <CardDescription>Upload your resume for employers to view</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileUpload
                      onFileSelect={handleResumeUpload}
                      onFileRemove={handleResumeRemove}
                      currentFile={(profile as JobSeekerProfile)?.resumeUrl}
                      accept=".pdf,.doc,.docx"
                      maxSize={5}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
