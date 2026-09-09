"use client"
import Image from "next/image"
import {
  BookOpenText,
  Brain,
  Compass,
  LayoutDashboard,
  LogOut,
  Network,
  Plus,
  Settings,
  Tags,
} from "lucide-react"
import Link from "next/link"
import Button from "../ui/Button"

const Sidebar = () => {
  return (
    <div className="bg-surface border-border my-6 ml-6 flex h-full w-64 flex-col justify-between rounded-lg border p-2">
      <div className="space-y-2">
        <Image src="/image/brandLogo.png" alt="Logo" width={200} height={70} />
        <Button>
          <Plus size={16} />
          Add Connection
        </Button>

        <h4 className="text-text-muted text-xs tracking-wide">MAIN</h4>
        <Link
          href="/dashboard"
          className="text-text-secondary hover:text-foreground hover:bg-surface-hover flex items-center gap-2 rounded-md px-2 py-1 text-base transition-colors"
        >
          <LayoutDashboard size={16} />
          Dashboard
        </Link>
        <Link
          href="/explore"
          className="text-text-secondary hover:text-foreground hover:bg-surface-hover flex items-center gap-2 rounded-md px-2 py-1 text-base transition-colors"
        >
          <Compass size={16} /> Explore
        </Link>
        <Link
          href="/graph"
          className="text-text-secondary hover:text-foreground hover:bg-surface-hover flex items-center gap-2 rounded-md px-2 py-1 text-base transition-colors"
        >
          <Network size={16} /> Graph view
        </Link>
        <h4 className="text-text-muted text-xs tracking-wide">KNOWLEDGE</h4>
        <Link
          href="/concepts"
          className="text-text-secondary hover:text-foreground hover:bg-surface-hover flex items-center gap-2 rounded-md px-2 py-1 text-base transition-colors"
        >
          <Brain size={16} /> Concepts
        </Link>
        <Link
          href="/resources"
          className="text-text-secondary hover:text-foreground hover:bg-surface-hover flex items-center gap-2 rounded-md px-2 py-1 text-base transition-colors"
        >
          <BookOpenText size={16} /> Resources
        </Link>
        <Link
          href="/tags"
          className="text-text-secondary hover:text-foreground hover:bg-surface-hover flex items-center gap-2 rounded-md px-2 py-1 text-base transition-colors"
        >
          <Tags size={16} /> Tags
        </Link>
      </div>
      <div>
        <Link
          href="/settings"
          className="text-text-secondary hover:text-foreground hover:bg-surface-hover flex items-center gap-2 rounded-md px-2 py-1 text-base transition-colors"
        >
          <Settings size={16} /> Settings
        </Link>
        <Link
          href="/logout"
          className="text-text-secondary hover:text-foreground hover:bg-surface-hover flex items-center gap-2 rounded-md px-2 py-1 text-base transition-colors"
        >
          <LogOut size={16} /> Logout
        </Link>
      </div>
    </div>
  )
}
export default Sidebar
