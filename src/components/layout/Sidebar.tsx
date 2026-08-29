'use client'
import Image from 'next/image'
import { BookOpenText, Brain, Compass, LayoutDashboard, LogOut, Network, Plus, Settings, Tags } from 'lucide-react'
import Link from 'next/link'

const Sidebar = () => {
    return (
        <div className="m-1 bg-surface border border-border flex flex-col justify-between p-2 rounded-lg">
            <div className="space-y-2">
                <Image src="/image/brandLogo.png" alt="Logo" width={200} height={70} />
                <button className="flex justify-center items-center gap-1 bg-primary text-amber-50 px-2 py-1 rounded-sm font-semibold transition-colors hover:bg-primary-hover">
                    <Plus size={16} />
                    Add Connection
                </button>
                <h4 className="text-xs text-text-muted tracking-wide">MAIN</h4>
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-base text-text-secondary px-2 py-1 rounded-md hover:text-foreground hover:bg-surface-hover transition-colors"
                >
                    <LayoutDashboard size={16} />
                    Dashboard
                </Link>
                <Link
                    href="/explore"
                    className="flex items-center gap-2 text-base text-text-secondary px-2 py-1 rounded-md hover:text-foreground hover:bg-surface-hover transition-colors"
                >
                    <Compass size={16} /> Explore
                </Link>
                <Link
                    href="/graph"
                    className="flex items-center gap-2 text-base text-text-secondary px-2 py-1 rounded-md hover:text-foreground hover:bg-surface-hover transition-colors"
                >
                    <Network size={16} /> Graph view
                </Link>
                <h4 className="text-xs text-text-muted tracking-wide">KNOWLEDGE</h4>
                <Link
                    href="/concepts"
                    className="flex items-center gap-2 text-base text-text-secondary px-2 py-1 rounded-md hover:text-foreground hover:bg-surface-hover transition-colors"
                >
                    <Brain size={16} /> Concepts
                </Link>
                <Link
                    href="/resources"
                    className="flex items-center gap-2 text-base text-text-secondary px-2 py-1 rounded-md hover:text-foreground hover:bg-surface-hover transition-colors"
                >
                    <BookOpenText size={16} /> Resources
                </Link>
                <Link
                    href="/tags"
                    className="flex items-center gap-2 text-base text-text-secondary px-2 py-1 rounded-md hover:text-foreground hover:bg-surface-hover transition-colors"
                >
                    <Tags size={16} /> Tags
                </Link>
            </div>
            <div>
                <Link
                    href="/settings"
                    className="flex items-center gap-2 text-base text-text-secondary px-2 py-1 rounded-md hover:text-foreground hover:bg-surface-hover transition-colors"
                >
                    <Settings size={16} /> Settings
                </Link>
                <Link
                    href="/logout"
                    className="flex items-center gap-2 text-base text-text-secondary px-2 py-1 rounded-md hover:text-foreground hover:bg-surface-hover transition-colors"
                >
                    <LogOut size={16} /> Logout
                </Link>
            </div>
        </div>
    )
}
export default Sidebar
