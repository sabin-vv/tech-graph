"use client"

import GuestOnly from "@/components/auth/GuestOnly"
import { TechGraphStage } from "@/components/graph/TechGraphStage"
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
      <main className="min-h-screen w-full overflow-y-auto">
        <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14 lg:px-10">
          <div className="mx-auto w-full max-w-160">
            <TechGraphStage className="mx-auto" />
            <div className="copy relative z-10 mt-6">
              <h1 className="max-w-[16ch] font-[Space_Grotesk] text-[28px] leading-[1.14] font-bold tracking-[-0.015em] sm:text-[34px]">
                See how your stack{" "}
                <em className="from-teal to-blue bg-linear-to-r bg-clip-text text-transparent not-italic">
                  connects.
                </em>
              </h1>
              <p className="text-ink-dim mt-3 max-w-[52ch] text-sm leading-relaxed">
                TechGraph turns scattered docs, frameworks, and half-remembered
                notes into one living map of everything you know.
              </p>
              <div className="stats mt-6 flex flex-wrap gap-x-8 gap-y-4">
                <div>
                  <b className="block font-[Space_Grotesk] text-[17px]">40K+</b>
                  <span className="text-ink-dim block font-[JetBrains_Mono] text-[9px] tracking-[0.09em]">
                    NODES MAPPED DAILY
                  </span>
                </div>
                <div>
                  <b className="block font-[Space_Grotesk] text-[17px]">180+</b>
                  <span className="text-ink-dim block font-[JetBrains_Mono] text-[9px] tracking-[0.09em]">
                    FRAMEWORKS INDEXED
                  </span>
                </div>
                <div>
                  <b className="block font-[Space_Grotesk] text-[17px]">2.1M</b>
                  <span className="text-ink-dim block font-[JetBrains_Mono] text-[9px] tracking-[0.09em]">
                    DEVS ON TECHGRAPH
                  </span>
                </div>
              </div>
            </div>
          </div>
          <section className="border-border bg-surface/70 mx-auto w-full max-w-100 space-y-6 rounded-2xl border p-6 shadow-2xl shadow-black/20 sm:p-8">
            <div>
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
                <label className="text-text-secondary flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="border-border accent-primary size-4 rounded border"
                  />
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
