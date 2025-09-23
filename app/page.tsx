"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Find Your Dream Job or Hire Top Talent
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Connect job seekers with employers through our comprehensive job portal platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => router.push("/auth/register")}>
              Get Started
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push("/auth/login")}>
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose JobPortal?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>For Job Seekers</CardTitle>
                <CardDescription>Find opportunities that match your skills</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Advanced job search and filtering</li>
                  <li>• Profile and resume management</li>
                  <li>• Application tracking</li>
                  <li>• Personalized job recommendations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>For Employers</CardTitle>
                <CardDescription>Discover and hire the best candidates</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Post and manage job listings</li>
                  <li>• Review applications efficiently</li>
                  <li>• Company profile management</li>
                  <li>• Candidate communication tools</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced Features</CardTitle>
                <CardDescription>Powerful tools for better matching</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Real-time notifications</li>
                  <li>• Analytics and insights</li>
                  <li>• Mobile-responsive design</li>
                  <li>• Secure and reliable platform</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Try Our Demo</h2>
          <p className="text-muted-foreground mb-8">Experience the platform with our demo accounts</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <Badge variant="secondary">Job Seeker</Badge>
                <CardTitle className="text-lg">john.doe@example.com</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Experience the job seeker dashboard and application process
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Badge variant="secondary">Employer</Badge>
                <CardTitle className="text-lg">hr@techcorp.com</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Manage job postings and review applications</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Badge variant="secondary">Admin</Badge>
                <CardTitle className="text-lg">admin@jobportal.com</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Access admin panel and platform management tools</p>
              </CardContent>
            </Card>
          </div>
          <p className="text-sm text-muted-foreground mt-4">Use any password to login with demo accounts</p>
        </div>
      </section>
    </div>
  )
}
