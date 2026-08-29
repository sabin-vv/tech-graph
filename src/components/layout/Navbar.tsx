"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Home,
  Menu,
  Search,
} from "lucide-react";

type NavbarProps = {
  onMenuClick?: () => void;
};

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="border-border bg-surface/80 sticky top-0 z-30 m-1 flex h-16 items-center rounded-lg border px-4 backdrop-blur sm:px-6">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
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
            className="flex items-center gap-1 truncate text-sm"
          >
            <Link
              href="/"
              className="text-text-muted hover:text-foreground shrink-0 transition-colors"
            >
              <Home size={18} />
            </Link>
            {segments.map((segment, index) => {
              const href = "/" + segments.slice(0, index + 1).join("/");
              const isLast = index === segments.length - 1;
              const label = segment
                .replace(/[-_]/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());

              return (
                <span key={href} className="flex items-center gap-1 truncate">
                  <ChevronRight className="text-text-muted h-3.5 w-3.5 shrink-0" />
                  {isLast ? (
                    <span className="text-foreground truncate font-medium">
                      {label}
                    </span>
                  ) : (
                    <Link
                      href={href}
                      className="text-text-muted hover:text-foreground truncate transition-colors"
                    >
                      {label}
                    </Link>
                  )}
                </span>
              );
            })}
          </nav>
        </div>

        {/* Center: Search */}
        <div className="relative mx-auto hidden w-full max-w-md sm:block">
          <Search className="text-text-muted pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="search"
            placeholder="Search knowledge..."
            className="border-border bg-background-secondary text-foreground placeholder:text-text-muted focus:border-primary focus:bg-surface-elevated h-9 w-full rounded-lg border pr-4 pl-9 text-sm outline-none"
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Mobile search */}
          <button
            type="button"
            aria-label="Search"
            className="text-text-secondary hover:bg-surface-hover rounded-lg p-2 sm:hidden"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            className="text-text-secondary hover:bg-surface-hover relative rounded-lg p-2"
          >
            <Bell className="h-5 w-5" />
            <span className="bg-danger ring-background absolute top-1.5 right-1.5 h-2 w-2 rounded-full ring-2" />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((value) => !value)}
              className="hover:bg-surface-hover flex items-center gap-2 rounded-lg p-1.5"
            >
              <div className="bg-primary text-background flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold">
                SV
              </div>
              <ChevronDown
                className={`text-text-muted hidden h-4 w-4 transition-transform sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="border-border bg-surface-elevated absolute top-12 right-0 w-48 rounded-xl border p-1.5 shadow-lg">
                <div className="border-border border-b px-3 py-2">
                  <p className="text-foreground text-sm font-medium">
                    Sabin VV
                  </p>
                  <p className="text-text-muted truncate text-xs">
                    sabin@example.com
                  </p>
                </div>
                <button
                  type="button"
                  className="text-text-secondary hover:bg-surface-hover mt-1 w-full rounded-lg px-3 py-2 text-left text-sm"
                >
                  Profile
                </button>
                <button
                  type="button"
                  className="text-text-secondary hover:bg-surface-hover w-full rounded-lg px-3 py-2 text-left text-sm"
                >
                  Settings
                </button>
                <button
                  type="button"
                  className="text-danger hover:bg-danger/10 w-full rounded-lg px-3 py-2 text-left text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
