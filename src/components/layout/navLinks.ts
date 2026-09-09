import { BookOpen, Brain, Compass, LayoutDashboard, Network, Tags } from "lucide-react"
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
    label: "Explore",
    href: "/explore",
    icon: Compass,
  },
  {
    label: "Graph view",
    href: "/graph",
    icon: Network,
  },
]

export const knowledgeNavigation: NavigationItem[] = [
  {
    label: "Concepts",
    href: "/concepts",
    icon: Brain,
  },
  {
    label: "Resources",
    href: "/resources",
    icon: BookOpen,
  },
  {
    label: "Tags",
    href: "/tags",
    icon: Tags,
  },
]
