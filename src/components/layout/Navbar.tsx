'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Bell, ChevronDown, ChevronRight, Home, Menu, Search } from 'lucide-react'

type NavbarProps = {
    onMenuClick?: () => void
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
    const [profileOpen, setProfileOpen] = useState(false)
    const pathname = usePathname()
    const segments = pathname.split('/').filter(Boolean)

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center border border-border bg-surface/80 px-4 m-1 rounded-lg backdrop-blur sm:px-6">
            <div className="flex w-full items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        aria-label="Open navigation"
                        className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover lg:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm truncate">
                        <Link href="/" className="text-text-muted hover:text-foreground transition-colors shrink-0">
                            <Home size={18} />
                        </Link>
                        {segments.map((segment, index) => {
                            const href = '/' + segments.slice(0, index + 1).join('/')
                            const isLast = index === segments.length - 1
                            const label = segment.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

                            return (
                                <span key={href} className="flex items-center gap-1 truncate">
                                    <ChevronRight className="h-3.5 w-3.5 text-text-muted shrink-0" />
                                    {isLast ? (
                                        <span className="text-foreground font-medium truncate">{label}</span>
                                    ) : (
                                        <Link
                                            href={href}
                                            className="text-text-muted hover:text-foreground transition-colors truncate"
                                        >
                                            {label}
                                        </Link>
                                    )}
                                </span>
                            )
                        })}
                    </nav>
                </div>

                {/* Center: Search */}
                <div className="relative w-full max-w-md mx-auto hidden sm:block">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                    <input
                        type="search"
                        placeholder="Search knowledge..."
                        className="h-9 w-full rounded-lg border border-border bg-background-secondary pl-9 pr-4 text-sm text-foreground outline-none placeholder:text-text-muted focus:border-primary focus:bg-surface-elevated"
                    />
                </div>

                {/* Right */}
                <div className="flex items-center gap-2">
                    {/* Mobile search */}
                    <button
                        type="button"
                        aria-label="Search"
                        className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover sm:hidden"
                    >
                        <Search className="h-5 w-5" />
                    </button>

                    {/* Notifications */}
                    <button
                        type="button"
                        aria-label="Notifications"
                        className="relative rounded-lg p-2 text-text-secondary hover:bg-surface-hover"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-background" />
                    </button>

                    {/* Profile */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setProfileOpen((value) => !value)}
                            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-surface-hover"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-background">
                                SV
                            </div>
                            <ChevronDown
                                className={`hidden h-4 w-4 text-text-muted transition-transform sm:block ${
                                    profileOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 top-12 w-48 rounded-xl border border-border bg-surface-elevated p-1.5 shadow-lg">
                                <div className="border-b border-border px-3 py-2">
                                    <p className="text-sm font-medium text-foreground">Sabin VV</p>
                                    <p className="truncate text-xs text-text-muted">sabin@example.com</p>
                                </div>
                                <button
                                    type="button"
                                    className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-text-secondary hover:bg-surface-hover"
                                >
                                    Profile
                                </button>
                                <button
                                    type="button"
                                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-text-secondary hover:bg-surface-hover"
                                >
                                    Settings
                                </button>
                                <button
                                    type="button"
                                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-danger hover:bg-danger/10"
                                >
                                    Logout
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
