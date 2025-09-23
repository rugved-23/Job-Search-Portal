export type UserRole = "job_seeker" | "employer" | "admin"

export interface User {
  id: string
  email: string
  role: UserRole
  profile: JobSeekerProfile | EmployerProfile | AdminProfile
  createdAt: string
  updatedAt: string
}

export interface JobSeekerProfile {
  firstName: string
  lastName: string
  phone?: string
  location?: string
  bio?: string
  skills: string[]
  experience: string
  education: string
  resumeUrl?: string
  linkedinUrl?: string
  portfolioUrl?: string
}

export interface EmployerProfile {
  companyName: string
  contactPerson: string
  phone?: string
  website?: string
  location?: string
  description?: string
  industry?: string
  companySize?: string
}

export interface AdminProfile {
  firstName: string
  lastName: string
  permissions: string[]
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  remote: boolean
  salary: string
  description: string
  requirements?: string[]
  benefits?: string[]
  employerId: string
  status: "active" | "closed" | "draft"
  applicationsCount?: number
  skills: string[]
  experience: string
  postedDate: string
  createdAt?: string
  updatedAt?: string
}

export interface Application {
  id: string
  jobId: string
  jobTitle: string
  company: string
  applicantId: string
  applicantName: string
  applicantEmail: string
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired"
  coverLetter?: string
  resumeUrl?: string
  appliedDate: string
  updatedAt?: string
}

export interface Notification {
  id: string
  userId: string
  type: "application_status" | "new_job" | "system"
  title: string
  message: string
  read: boolean
  createdAt: string
}
