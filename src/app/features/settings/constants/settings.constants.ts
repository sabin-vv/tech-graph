import { BellRing, Palette, Shield, SlidersHorizontal } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface SettingsNavItem {
  icon: LucideIcon
  title: string
}

export const settingsNavItems: SettingsNavItem[] = [
  { icon: SlidersHorizontal, title: "General" },
  { icon: Palette, title: "Appearance" },
  { icon: BellRing, title: "Notifications" },
  { icon: Shield, title: "Privacy & Data" },
]
