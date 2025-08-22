"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { useAuth } from "@/app/(auth)/hooks/useAuth"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { resendVerification } from "@/lib/api/auth"
import { CompanyAPI } from "@/lib/api/company"

import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { login, user, loading, error, clearError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  })

  const emailValue = watch("email")

  useEffect(() => {
  if (!user || loading) return
  
  const checkOrganization = async () => {
    try {
      const org = await CompanyAPI.getCurrentCompany()
      router.replace(org?.id ? "/dashboard" : "/onboarding")
    } catch (error) {
      console.error('Failed to get organization:', error)
      router.replace("/onboarding")
    }
  }
  
  checkOrganization()
}, [user, loading, router])

  useEffect(() => {
    if (error) clearError()
  }, [watch("email"), watch("password"), error, clearError])

  const isUnverified = !!error && /not\s+verified|verify\s+your\s+email|email\s+not\s+verified/i.test(error)

  const handleResend = async () => {
    if (!emailValue) return
    setResending(true)
    setResent(false)
    try {
      await resendVerification(emailValue)
      setResent(true)
    } catch (e) {
      // keep global error from useAuth; optionally console for debugging
      console.error("Resend verification failed", e)
    } finally {
      setResending(false)
    }
  }

  const onSubmit = async (data: LoginForm) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await login(data)
    } catch (err) {
      console.error("Login failed:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && !isUnverified && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isUnverified && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your email is not verified yet. Please check your inbox. You can
                  <button
                    type="button"
                    onClick={handleResend}
                    className="ml-1 underline underline-offset-2"
                    disabled={resending || !emailValue}
                  >
                    {resending ? "resending…" : "resend the verification email"}
                  </button>
                  .
                  {resent && (
                    <span className="ml-1 text-green-600">Email sent!</span>
                  )}
                  <button
                    type="button"
                    onClick={() => router.push(`/verify-email?email=${encodeURIComponent(emailValue || "")}`)}
                    className="ml-2 text-primary underline underline-offset-2"
                  >
                    Open verification page
                  </button>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  className={cn(
                    "transition-colors",
                    errors.email && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className={cn(
                      "pr-10 transition-colors",
                      errors.password && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || resending || !isValid}
              className="w-full"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}