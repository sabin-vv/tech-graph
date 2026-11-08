"use client"
import { LogOut, Plus, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth/AuthContext"

import Button from "../ui/Button"
import { mainNavigation } from "./navLinks"

const Sidebar = () => {
  const pathname = usePathname()
  const { loggingOut, logout } = useAuth()

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  const navLinkClass = (href: string) => {
    return `flex items-center gap-2 rounded-md px-2 py-1.5 text-base transition-colors ${
      isActive(href)
        ? "bg-primary-muted text-primary "
        : "text-text-secondary hover:bg-surface-hover hover:text-foreground"
    }`
  }

  return (
    <div className="bg-surface border-border my-6 ml-6 flex h-[calc(100dvh-3rem)] min-h-0 w-[min(13rem,calc(100vw-3rem))] flex-col justify-between overflow-y-auto rounded-lg border p-2">
      <div className="space-y-2">
        <Image
          src="/image/brandLogo.png"
          alt="Logo"
          width={160}
          height={56}
          className="h-auto w-full max-w-40"
        />

        <Link href="/knowledge/new" className="my-4 flex justify-center">
          <Button>
            <Plus size={16} />
            Add Knowledge
          </Button>
        </Link>

        <h4 className="text-text-muted text-xs tracking-wide">MAIN</h4>
        {mainNavigation.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={navLinkClass(href)}
            aria-current={isActive(href) ? "page" : undefined}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </div>
      <div className="border-border mt-2 border-t">
        <Link
          href="/settings"
          className={navLinkClass("/settings")}
          aria-current={pathname.startsWith("/settings") ? "page" : undefined}
        >
          <Settings size={16} /> Settings
        </Link>
        <Button
          variant="ghost"
          loading={loggingOut}
          onClick={() => void logout()}
          className="text-danger hover:bg-surface-hover w-full justify-start gap-2 rounded-md px-2 py-1.5 text-base hover:cursor-pointer"
        >
          <LogOut size={16} /> Logout
        </Button>
      </div>
    </div>
  )
}
export default Sidebar
