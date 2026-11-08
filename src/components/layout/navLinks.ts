import {
  Activity,
  BookOpen,
  Compass,
  LayoutDashboard,
  Network,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface NavigationItem {
  label: string
  href: string
  icon: LucideIcon
}

export const mainNavigation: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Knowledge",
    href: "/knowledge",
    icon: BookOpen,
  },
  {
    label: "Explore",
    href: "/explore",
    icon: Compass,
  },
  {
    label: "Graph view",
    href: "/graph",
    icon: Network,
  },
  {
    label: "Activity",
    href: "/activity",
    icon: Activity,
  },
]
