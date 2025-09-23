import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">JobPortal</h1>
          <p className="text-muted-foreground mt-2">Find your dream job or hire top talent</p>
        </div>
        <LoginForm />
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            {"Don't have an account? "}
            <a href="/auth/register" className="text-primary hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
