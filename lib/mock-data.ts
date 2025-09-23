import type { User, Job, Application, Notification } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    role: "job_seeker",
    profile: {
      firstName: "John",
      lastName: "Doe",
      phone: "+1-555-0123",
      location: "San Francisco, CA",
      bio: "Experienced software developer with 5+ years in full-stack development.",
      skills: ["React", "Node.js", "TypeScript", "Python", "AWS"],
      experience: "5+ years",
      education: "BS Computer Science - Stanford University",
      linkedinUrl: "https://linkedin.com/in/johndoe",
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    email: "hr@techcorp.com",
    role: "employer",
    profile: {
      companyName: "TechCorp Solutions",
      contactPerson: "Sarah Johnson",
      phone: "+1-555-0456",
      website: "https://techcorp.com",
      location: "San Francisco, CA",
      description: "Leading technology solutions provider specializing in enterprise software.",
      industry: "Technology",
      companySize: "100-500",
    },
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-10T09:00:00Z",
  },
  {
    id: "3",
    email: "admin@jobportal.com",
    role: "admin",
    profile: {
      firstName: "Admin",
      lastName: "User",
      permissions: ["manage_users", "manage_jobs", "view_analytics"],
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Full Stack Developer",
    company: "TechCorp Solutions",
    location: "San Francisco, CA",
    type: "full-time",
    remote: true,
    salary: {
      min: 120000,
      max: 180000,
      currency: "USD",
    },
    description:
      "We are looking for a Senior Full Stack Developer to join our growing team. You will be responsible for developing and maintaining web applications using modern technologies.",
    requirements: [
      "5+ years of experience in full-stack development",
      "Proficiency in React, Node.js, and TypeScript",
      "Experience with cloud platforms (AWS/GCP)",
      "Strong problem-solving skills",
    ],
    benefits: ["Health insurance", "Dental coverage", "Flexible PTO", "Remote work"],
    employerId: "2",
    status: "active",
    applicationsCount: 12,
    createdAt: "2024-01-20T14:00:00Z",
    updatedAt: "2024-01-20T14:00:00Z",
  },
  {
    id: "2",
    title: "Frontend Developer",
    company: "StartupXYZ",
    location: "New York, NY",
    type: "full-time",
    remote: false,
    salary: {
      min: 80000,
      max: 120000,
      currency: "USD",
    },
    description:
      "Join our dynamic startup as a Frontend Developer and help build the next generation of web applications.",
    requirements: [
      "3+ years of React experience",
      "Strong CSS and JavaScript skills",
      "Experience with modern build tools",
      "Portfolio of previous work",
    ],
    benefits: ["Equity package", "Health insurance", "Catered meals"],
    employerId: "2",
    status: "active",
    applicationsCount: 8,
    createdAt: "2024-01-18T11:00:00Z",
    updatedAt: "2024-01-18T11:00:00Z",
  },
  {
    id: "3",
    title: "DevOps Engineer",
    company: "CloudTech Inc",
    location: "Austin, TX",
    type: "full-time",
    remote: true,
    salary: {
      min: 100000,
      max: 150000,
      currency: "USD",
    },
    description: "We need a DevOps Engineer to help scale our infrastructure and improve our deployment processes.",
    requirements: [
      "Experience with Docker and Kubernetes",
      "Knowledge of CI/CD pipelines",
      "AWS or Azure certification preferred",
      "Scripting skills (Python/Bash)",
    ],
    benefits: ["Remote work", "Professional development budget", "Health insurance"],
    employerId: "2",
    status: "active",
    applicationsCount: 15,
    createdAt: "2024-01-16T09:30:00Z",
    updatedAt: "2024-01-16T09:30:00Z",
  },
]

export const mockApplications: Application[] = [
  {
    id: "1",
    jobId: "1",
    jobSeekerId: "1",
    status: "pending",
    coverLetter: "I am very interested in this position and believe my experience aligns well with your requirements.",
    appliedAt: "2024-01-21T10:00:00Z",
    updatedAt: "2024-01-21T10:00:00Z",
  },
]

export const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    type: "application_status",
    title: "Application Update",
    message: "Your application for Senior Full Stack Developer has been reviewed.",
    read: false,
    createdAt: "2024-01-22T09:00:00Z",
  },
  {
    id: "2",
    userId: "1",
    type: "new_job",
    title: "New Job Match",
    message: "A new job matching your skills has been posted: Frontend Developer at StartupXYZ.",
    read: false,
    createdAt: "2024-01-21T15:00:00Z",
  },
]
