"use client"

import { ME } from "@/graphql/auth/queries"
import { getAuthToken, removeAuthToken } from "@/lib/auth"
import { useApolloClient } from "@apollo/client/react"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"
import Button from "../ui/Button"

interface GuestOnlyProps {
  children: ReactNode
}

const GuestOnly = ({ children }: GuestOnlyProps) => {
  const client = useApolloClient()
  const router = useRouter()

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
        const { data } = await client.query({
          query: ME,
          fetchPolicy: "network-only",
        })
        if (data?.me) {
          if (active) {
            setStatus("redirecting")
            router.replace("/dashboard")
          }
          return
        }
        removeAuthToken()
        await client.clearStore()
        if (active) {
          setStatus("guest")
        }
      } catch (error) {
        if (!active) return

        const message =
          error instanceof Error ? error.message.toLowerCase() : ""

        const authenticationError =
          message.includes("authentication required") ||
          message.includes("unauthorized") ||
          message.includes("invalid token")

        if (authenticationError) {
          removeAuthToken()
          await client.clearStore()

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
  }, [client, router, retryCount])

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
