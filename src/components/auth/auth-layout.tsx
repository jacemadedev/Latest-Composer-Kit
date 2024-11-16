import { AuthForm } from "./auth-form"

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Composer Kit</h1>
          <p className="text-muted-foreground">Next.js Boilerplate</p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}