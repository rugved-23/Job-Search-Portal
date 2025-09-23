"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/ui/file-upload"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import type { Job, Application } from "@/lib/types"

interface ApplicationFormProps {
  job: Job
  onSubmit: (application: Omit<Application, "id">) => void
  onCancel: () => void
}

export function ApplicationForm({ job, onSubmit, onCancel }: ApplicationFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [coverLetter, setCoverLetter] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)
    try {
      // In a real app, you would upload the resume file to storage
      let resumeUrl = ""
      if (resumeFile) {
        resumeUrl = `/uploads/resumes/${user.id}/${resumeFile.name}`
      } else if (user.role === "job_seeker" && user.profile.resumeUrl) {
        resumeUrl = user.profile.resumeUrl
      }

      const application: Omit<Application, "id"> = {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        applicantId: user.id,
        applicantName: user.name,
        applicantEmail: user.email,
        status: "pending",
        appliedDate: new Date().toISOString(),
        coverLetter,
        resumeUrl,
      }

      onSubmit(application)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const userProfile = user?.role === "job_seeker" ? user.profile : null

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Apply for {job.title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          at {job.company} • {job.location}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell the employer why you're interested in this position and how your skills align with their needs..."
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">{coverLetter.length}/1000 characters</p>
          </div>

          <div className="space-y-2">
            <Label>Resume</Label>
            <FileUpload
              onFileSelect={setResumeFile}
              onFileRemove={() => setResumeFile(null)}
              currentFile={resumeFile ? resumeFile.name : userProfile?.resumeUrl}
              accept=".pdf,.doc,.docx"
              maxSize={5}
            />
            {!resumeFile && !userProfile?.resumeUrl && (
              <p className="text-xs text-muted-foreground">Upload a resume or add one to your profile</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || (!coverLetter.trim() && !resumeFile && !userProfile?.resumeUrl)}
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
