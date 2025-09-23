import type { User, Job, Application, Notification } from "./types"
import { mockUsers, mockJobs, mockApplications, mockNotifications } from "./mock-data"

// Simulate API delays
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

class DataService {
  private users: User[] = [...mockUsers]
  private jobs: Job[] = [...mockJobs]
  private applications: Application[] = [...mockApplications]
  private notifications: Notification[] = [...mockNotifications]

  // User methods
  async getUsers(): Promise<User[]> {
    await delay(300)
    return this.users
  }

  async getUserById(id: string): Promise<User | null> {
    await delay(200)
    return this.users.find((user) => user.id === id) || null
  }

  async getUserByEmail(email: string): Promise<User | null> {
    await delay(200)
    return this.users.find((user) => user.email === email) || null
  }

  async createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    await delay(500)
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.users.push(newUser)
    return newUser
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    await delay(400)
    const userIndex = this.users.findIndex((user) => user.id === id)
    if (userIndex === -1) return null

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return this.users[userIndex]
  }

  // Job methods
  async getJobs(filters?: {
    search?: string
    location?: string
    type?: string
    remote?: boolean
  }): Promise<Job[]> {
    await delay(300)
    let filteredJobs = [...this.jobs]

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower),
      )
    }

    if (filters?.location) {
      filteredJobs = filteredJobs.filter((job) => job.location.toLowerCase().includes(filters.location!.toLowerCase()))
    }

    if (filters?.type) {
      filteredJobs = filteredJobs.filter((job) => job.type === filters.type)
    }

    if (filters?.remote !== undefined) {
      filteredJobs = filteredJobs.filter((job) => job.remote === filters.remote)
    }

    return filteredJobs.filter((job) => job.status === "active")
  }

  async getJobById(id: string): Promise<Job | null> {
    await delay(200)
    return this.jobs.find((job) => job.id === id) || null
  }

  async createJob(jobData: Omit<Job, "id" | "createdAt" | "updatedAt" | "applicationsCount">): Promise<Job> {
    await delay(500)
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      applicationsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.jobs.push(newJob)
    return newJob
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
    await delay(400)
    const jobIndex = this.jobs.findIndex((job) => job.id === id)
    if (jobIndex === -1) return null

    this.jobs[jobIndex] = {
      ...this.jobs[jobIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return this.jobs[jobIndex]
  }

  // Application methods
  async getApplications(filters?: {
    jobId?: string
    jobSeekerId?: string
    employerId?: string
  }): Promise<Application[]> {
    await delay(300)
    let filteredApplications = [...this.applications]

    if (filters?.jobId) {
      filteredApplications = filteredApplications.filter((app) => app.jobId === filters.jobId)
    }

    if (filters?.jobSeekerId) {
      filteredApplications = filteredApplications.filter((app) => app.jobSeekerId === filters.jobSeekerId)
    }

    if (filters?.employerId) {
      const employerJobs = this.jobs.filter((job) => job.employerId === filters.employerId)
      const employerJobIds = employerJobs.map((job) => job.id)
      filteredApplications = filteredApplications.filter((app) => employerJobIds.includes(app.jobId))
    }

    return filteredApplications
  }

  async createApplication(applicationData: Omit<Application, "id" | "appliedAt" | "updatedAt">): Promise<Application> {
    await delay(500)
    const newApplication: Application = {
      ...applicationData,
      id: Date.now().toString(),
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.applications.push(newApplication)

    // Update job applications count
    const jobIndex = this.jobs.findIndex((job) => job.id === applicationData.jobId)
    if (jobIndex !== -1) {
      this.jobs[jobIndex].applicationsCount += 1
    }

    return newApplication
  }

  async updateApplication(id: string, updates: Partial<Application>): Promise<Application | null> {
    await delay(400)
    const appIndex = this.applications.findIndex((app) => app.id === id)
    if (appIndex === -1) return null

    this.applications[appIndex] = {
      ...this.applications[appIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return this.applications[appIndex]
  }

  // Notification methods
  async getNotifications(userId: string): Promise<Notification[]> {
    await delay(200)
    return this.notifications.filter((notification) => notification.userId === userId)
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await delay(200)
    const notificationIndex = this.notifications.findIndex((n) => n.id === id)
    if (notificationIndex !== -1) {
      this.notifications[notificationIndex].read = true
    }
  }
}

export const dataService = new DataService()
