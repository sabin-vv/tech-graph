"use client"

import { getAuthToken } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"
import Button from "../ui/Button"
import { isAuthenticationError, useAuth } from "./AuthContext"

interface GuestOnlyProps {
  children: ReactNode
}

const GuestOnly = ({ children }: GuestOnlyProps) => {
  const router = useRouter()
  const { refreshUser, clearSession } = useAuth()

  const [retryCount, setRetryCount] = useState(0)
  const [status, setStatus] = useState<
    "checking" | "guest" | "redirecting" | "error"
  >("checking")

  useEffect(() => {
    let active = true

    const checkAuthentication = async () => {
      const token = getAuthToken()

      if (!token) {
        await Promise.resolve()
        if (active) {
          setStatus("guest")
        }
        return
      }
      try {
        const user = await refreshUser()
        if (user) {
          if (active) {
            setStatus("redirecting")
            router.replace("/dashboard")
          }
          return
        }
        await clearSession()
        if (active) {
          setStatus("guest")
        }
      } catch (error) {
        if (!active) return

        if (isAuthenticationError(error)) {
          await clearSession()
          if (active) {
            setStatus("guest")
          }
          return
        }
        setStatus("error")
      }
    }
    void checkAuthentication()
    return () => {
      active = false
    }
  }, [clearSession, refreshUser, router, retryCount])

  if (status === "error") {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-text-secondary text-sm">
          Unable to verify your session. Check your connection and try again.
        </p>
        <Button onClick={() => setRetryCount((count) => count + 1)}>
          Try again
        </Button>
      </div>
    )
  }

  if (status !== "guest") {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-text-secondary text-sm">
          {status === "redirecting"
            ? "Redirecting to dashboard..."
            : "Checking identity..."}
        </p>
      </div>
    )
  }

  return <>{children}</>
}
export default GuestOnly
