"use client"

import { AuthMarketingSection } from "@/components/auth/AuthMarketingSection"
import GuestOnly from "@/components/auth/GuestOnly"
import SigninWithGithub from "@/components/auth/SigninWithGithub"
import SigninWithGoogle from "@/components/auth/SigninWithGoogle"
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
    <GuestOnly>
      <main className="techgraph-stage-bg h-dvh w-full overflow-y-auto">
        <div className="mx-auto grid min-h-full w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14 lg:px-10">
          <AuthMarketingSection />
          <div className="border-border m-4 space-y-6 rounded-md border p-4 shadow-black/20">
            <div className="text-center">
              <h2 className="font-[Space_Grotesk] text-2xl font-semibold">
                Create your Workspace
              </h2>
              <span className="text-text-secondary text-sm">
                Start building your personal knowledge graph
              </span>
            </div>

            {signupError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {signupError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

            <div className="flex items-center gap-2">
              <span className="border-border w-full border" />
              <span className="text-text-muted text-sm">OR</span>
              <span className="border-border w-full border" />
            </div>

            <div className="space-y-2">
              <SigninWithGithub className="w-full" />
              <SigninWithGoogle className="w-full" />
            </div>

            <div className="text-center text-sm">
              <span>Already have an account? </span>
              <span
                className="cursor-pointer text-blue-400"
                onClick={() => router.replace("/login")}
              >
                Sign in
              </span>
            </div>
          </div>
        </div>
      </main>
    </GuestOnly>
  )
}
export default SignupPage
