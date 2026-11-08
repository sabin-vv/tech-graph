"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  ChevronDown,
  ChevronRight,
  Home,
  LogOut,
  Menu,
  Search,
} from "lucide-react"
import { useAuth } from "@/components/auth/AuthContext"
import SearchInput from "../ui/SearchInput"

type NavbarProps = {
  onMenuClick?: () => void
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const [profileOpen, setProfileOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { user, loggingOut, logout } = useAuth()
  const segments = pathname.split("/").filter(Boolean)
  const displayName = user?.name.trim() || "Account"
  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  useEffect(() => {
    if (!profileOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !profileMenuRef.current?.contains(event.target)
      ) {
        setProfileOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [profileOpen])

  return (
    <header className="border-border bg-surface/80 relative z-50 my-6 mx-6 flex h-14 items-center rounded-lg border px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 w-full items-center justify-between gap-2 sm:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="text-text-secondary hover:bg-surface-hover rounded-lg p-2 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 items-center gap-1 overflow-hidden text-sm"
          >
            <Link
              href="/"
              className="text-text-muted hover:text-foreground shrink-0 transition-colors"
            >
              <Home size={18} />
            </Link>
            {segments.map((segment, index) => {
              const href = "/" + segments.slice(0, index + 1).join("/")
              const isLast = index === segments.length - 1
              const label = segment
                .replace(/[-_]/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())

              return (
                <span
                  key={href}
                  className="flex min-w-0 items-center gap-1 truncate"
                >
                  <ChevronRight className="text-text-muted h-3.5 w-3.5 shrink-0" />
                  {isLast ? (
                    <span className="text-primary truncate rounded-md px-1.5 py-0.5 font-medium">
                      {label}
                    </span>
                  ) : (
                    <Link
                      href={href}
                      className="text-text-muted hover:text-foreground hover:bg-surface-hover truncate rounded-md px-1.5 py-0.5 transition-colors"
                    >
                      {label}
                    </Link>
                  )}
                </span>
              )
            })}
          </nav>
        </div>

        <div className="mx-2 hidden w-full max-w-md min-w-0 flex-1 items-center lg:flex">
          <SearchInput placeholder="Search knowledge..." />
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/explore"
            aria-label="Search knowledge"
            className="hover:bg-surface-hover rounded-lg p-2 lg:hidden"
          >
            <Search className="text-text-muted h-5 w-5" />
          </Link>

          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((value) => !value)}
              aria-expanded={profileOpen}
              aria-controls={profileOpen ? "navbar-profile-menu" : undefined}
              aria-label="Open profile menu"
              className="hover:bg-surface-hover flex items-center gap-2 rounded-lg p-1.5"
            >
              <div className="bg-primary text-background flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold">
                {initials}
              </div>
              <span className="text-foreground hidden max-w-40 truncate text-sm font-medium sm:inline">
                {displayName}
              </span>
              <ChevronDown
                className={`text-text-muted hidden h-4 w-4 transition-transform sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div
                id="navbar-profile-menu"
                className="border-border bg-surface-elevated absolute top-12 right-0 z-50 w-56 rounded-xl border p-1.5 shadow-lg"
              >
                <div className="border-border border-b px-3 py-2">
                  <p className="text-foreground text-sm font-medium">
                    {displayName}
                  </p>
                  <p className="text-text-muted truncate text-xs">
                    {user?.email}
                  </p>
                </div>
                <nav aria-label="Account">
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="text-text-secondary hover:bg-surface-hover mt-1 block w-full rounded-lg px-3 py-2 text-sm"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="text-text-secondary hover:bg-surface-hover block w-full rounded-lg px-3 py-2 text-sm"
                  >
                    Settings
                  </Link>
                </nav>
                <button
                  type="button"
                  disabled={loggingOut}
                  onClick={() => void logout()}
                  className="text-danger hover:bg-danger/10 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm disabled:opacity-50"
                >
                  <LogOut size={15} aria-hidden="true" />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
export default Navbar
