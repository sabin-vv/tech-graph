"use client"

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useApolloClient } from "@apollo/client/react"
import { useRouter } from "next/navigation"
import type { MeQuery } from "@/generated/graphql/graphql"
import { ME } from "@/graphql/auth/queries"
import { removeAuthToken } from "@/lib/auth"

type AuthUser = NonNullable<MeQuery["me"]>

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  loggingOut: boolean
  error: Error | null
  refreshUser: () => Promise<AuthUser | null>
  clearSession: () => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: AuthUser) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function isAuthenticationError(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLowerCase() : ""
  return (
    message.includes("authentication required") ||
    message.includes("unauthorized") ||
    message.includes("invalid token")
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient()
  const router = useRouter()
  const refreshPromise = useRef<Promise<AuthUser | null> | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const refreshUser = useCallback(() => {
    if (refreshPromise.current) return refreshPromise.current

    setLoading(true)
    setError(null)

    const request = client
      .query({ query: ME, fetchPolicy: "network-only" })
      .then(({ data }) => {
        if (!data) throw new Error("Unable to load your account")
        setUser(data.me)
        return data.me
      })
      .catch((cause: unknown) => {
        const requestError =
          cause instanceof Error ? cause : new Error("Unable to verify your session")
        setError(requestError)
        throw requestError
      })
      .finally(() => {
        setLoading(false)
        refreshPromise.current = null
      })

    refreshPromise.current = request
    return request
  }, [client])

  const clearSession = useCallback(async () => {
    removeAuthToken()
    setUser(null)
    setError(null)
    await client.clearStore()
  }, [client])

  const logout = useCallback(async () => {
    setLoggingOut(true)
    try {
      await clearSession()
    } finally {
      router.replace("/login")
      setLoggingOut(false)
    }
  }, [clearSession, router])

  const updateUser = useCallback((nextUser: AuthUser) => {
    setUser(nextUser)
    setError(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loggingOut,
        error,
        refreshUser,
        clearSession,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
