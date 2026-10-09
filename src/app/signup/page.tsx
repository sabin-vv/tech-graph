"use client"

import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Password from "@/components/ui/Password"
import { SIGNUP } from "@/graphql/auth/mutations"
import { SignupData, signupSchema } from "@/schemas/auth.schema"
import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  })

  const [signupError, setSignupError] = useState<string | null>(null)
  const router = useRouter()

  const [signup, { loading }] = useMutation(SIGNUP)

  const onSubmit = async (formData: SignupData) => {
    setSignupError(null)

    const { confirmPassword: _confirmPassword, ...input } = formData
    try {
      const { data } = await signup({
        variables: {
          input,
        },
      })

      const token = data?.signup.token

      if (!token) {
        setSignupError("Signup Failed")
        return
      }

      router.replace("/login")
    } catch (error) {
      setSignupError(error instanceof Error ? error.message : "Signup Failed")
    }
  }

  return (
    <div className="grid w-full flex-1 items-center gap-10 px-4 py-10 md:grid-cols-2">
      <div>Graph</div>
      <div className="border-border bg-surface m-4 rounded-md border p-4">
        <h2 className="text-lg font-semibold">Create your Workspace</h2>
        <span className="text-text-muted text-sm">
          Start building your personal knowledge graph
        </span>

        {signupError && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {signupError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="my-3 space-y-4">
          <Input
            label="Full Name"
            placeholder="Your name"
            {...register("name")}
            error={errors.name && errors.name.message}
          />
          <Input
            label="Email"
            placeholder="example@email.com"
            type="email"
            {...register("email")}
            error={errors.email && errors.email.message}
          />
          <Password
            label="Password"
            placeholder="Create a password"
            {...register("password")}
            error={errors.password && errors.password.message}
          />
          <Password
            label="Confirm Password"
            placeholder="Confirm your passsword"
            {...register("confirmPassword")}
            error={errors.confirmPassword && errors.confirmPassword.message}
          />

          <Button className="w-full" type="submit" loading={loading}>
            Create Account
            <ArrowRight size={16} />
          </Button>
        </form>

        <span className="flex justify-center p-3 text-sm">OR</span>

        <Button className="w-full gap-2" variant="outline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-github"
            viewBox="0 0 16 16"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
          </svg>
          Continue with Google
        </Button>
      </div>
    </div>
  )
}
export default SignupPage
