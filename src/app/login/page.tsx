"use client"

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
    <div className="grid w-full grid-cols-2 items-center">
      <div>Brand Advertisement</div>
      <div className="border-border space-y-4 border p-5">
        <div>
          <h2 className="text-lg">Welcome back</h2>
          <span className="text-text-secondary text-sm">
            Continue building your knowledge graph
          </span>
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
            {...register("email")}
            error={errors.email && errors.email.message}
          />
          <Password
            label="Password"
            placeholder="Enter your password"
            {...register("password")}
            error={errors.password && errors.password.message}
          />
          <div className="flex items-center justify-between">
            <span className="text-text-secondary flex items-center gap-1 text-sm">
              <label className="relative">
                <input
                  type="checkbox"
                  className="border-border rounded-full border align-middle"
                />
                <span className="absolute rounded-full bg-transparent"></span>
              </label>
              Remember me
            </span>
            <span className="text-sm text-blue-400">Forgot password?</span>
          </div>
          <Button type="submit" className="w-full" loading={loading}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  )
}
export default LoginPage
