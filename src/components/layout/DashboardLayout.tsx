"use client"

import { type ReactNode, useEffect, useState } from "react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import { isAuthenticationError, useAuth } from "@/components/auth/AuthContext"
import { Loader } from "lucide-react"

interface DashBoardProps {
  children: ReactNode
}

const DashboardLayout = ({ children }: DashBoardProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, loading, error, refreshUser, logout } = useAuth()

  useEffect(() => {
    let active = true
    void refreshUser()
      .then((authenticatedUser) => {
        if (active && !authenticatedUser) void logout()
      })
      .catch((requestError: unknown) => {
        if (active && isAuthenticationError(requestError)) void logout()
      })

    return () => {
      active = false
    }
  }, [refreshUser, logout])

  if (error && !isAuthenticationError(error)) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4">
        <p className="text-text-secondary">
          Unable to verify your session. Check your connection and try again.
        </p>

        <button
          type="button"
          onClick={() => void refreshUser().catch(() => {})}
          className="text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    )
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-text-secondary flex items-center gap-1">
          Verifying your identity...
          <Loader />
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-dvh w-full">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 cursor-default bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed top-22 bottom-6 left-0 z-40 w-[min(14.5rem,calc(100vw-1.5rem))] transition-transform duration-200 lg:static lg:z-auto lg:w-auto lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>
      <div className="flex w-full flex-col overflow-hidden">
        <div className="shrink-0">
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        </div>
        <main className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 pb-6">
          {children}
        </main>
      </div>
    </div>
  )
}
export default DashboardLayout
