"use client"

import GuestOnly from "@/components/auth/GuestOnly"
import { AuthMarketingSection } from "@/components/auth/AuthMarketingSection"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Password from "@/components/ui/Password"
import { LOGIN } from "@/graphql/auth/mutations"
import { setAuthToken } from "@/lib/auth"
import { LoginData, loginSchema } from "@/schemas/auth.schema"
import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"

import { useState } from "react"
import { useForm } from "react-hook-form"

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  const [loginError, setLoginError] = useState<string | null>(null)

  const router = useRouter()

  const [login, { loading }] = useMutation(LOGIN)

  const onSubmit = async (formData: LoginData) => {
    setLoginError(null)
    try {
      const { data } = await login({
        variables: {
          email: formData.email,
          password: formData.password,
        },
      })

      const token = data?.login.token
      if (!token) {
        setLoginError("Login failed")
        return
      }

      setAuthToken(token)

      router.replace("/dashboard")
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "Invalid credentials",
      )
    }
  }

  return (
    <GuestOnly>
      <main className="techgraph-stage-bg min-h-screen w-full overflow-y-auto">
        <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14 lg:px-10">
            <AuthMarketingSection />
            <section className="border-border mx-auto w-full max-w-100 space-y-6 rounded-2xl border p-6 shadow-2xl shadow-black/20 sm:p-8">
            <div className="text-center">
              <h2 className="font-[Space_Grotesk] text-2xl font-semibold">
                Welcome back
              </h2>
              <p className="text-text-secondary mt-2 text-sm">
                Continue building your knowledge graph
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {loginError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                  {loginError}
                </div>
              )}
              <Input
                label="Email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email")}
                error={errors.email && errors.email.message}
              />
              <Password
                label="Password"
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register("password")}
                error={errors.password && errors.password.message}
              />
              <div className="flex items-center justify-between gap-3">
                <label className="text-text-secondary flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="border-border accent-primary peer sr-only size-4 cursor-pointer rounded border"
                  />
                  <span
                    className={`border-border peer-checked:bg-primary checked:border-primary focus-visible:ring-primary/50 relative size-4 rounded border-2 transition-colors focus-visible:ring-2 focus-visible:outline-none`}
                  >
                    <svg
                      className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100"
                      viewBox="0 0 16 16"
                    >
                      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                    </svg>
                  </span>
                  Remember me
                </label>
                <span className="text-sm text-blue-400">Forgot password?</span>
              </div>
              <Button type="submit" className="w-full" loading={loading}>
                Sign In
              </Button>
            </form>
          </section>
        </div>
      </main>
    </GuestOnly>
  )
}
export default LoginPage
