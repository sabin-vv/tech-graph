import SectionHeader from "@/components/layout/SectionHeader"
import Button from "@/components/ui/Button"
import { Clock, GitBranch, Plus, Edit, BookOpen, MoveRight } from "lucide-react"
import Link from "next/link"

const activities = [
  {
    id: 1,
    type: "knowledge",
    action: "Added new knowledge",
    target: "Node.js Event Loop",
    time: "5 minutes ago",
    icon: Plus,
    color: "text-green-600 bg-green-100",
  },
  {
    id: 2,
    type: "connection",
    action: "Created a connection",
    target: "Node.js → uses → libuv",
    time: "30 minutes ago",
    icon: GitBranch,
    color: "text-blue-600 bg-blue-100",
  },
  {
    id: 3,
    type: "resource",
    action: "Added a resource",
    target: "Node.js Official Documentation",
    time: "2 hours ago",
    icon: BookOpen,
    color: "text-purple-600 bg-purple-100",
  },
  {
    id: 4,
    type: "update",
    action: "Updated knowledge",
    target: "React Hooks",
    time: "Yesterday",
    icon: Edit,
    color: "text-orange-600 bg-orange-100",
  },
  {
    id: 5,
    type: " knowledge",
    action: "Added new knowledge",
    target: "PostgreSQL Indexing",
    time: "2 days ago",
    icon: Plus,
    color: "text-green-600 bg-green-100",
  },
]

const RecentActivity = () => {
  return (
    <section className="border-border overflow-hidden rounded-lg border">
      <SectionHeader
        title="Recent Activity"
        description="View your recent actions"
        action={
          <Button variant="outline" className="gap-2">
            <Link href="/activity">
              View All
              <MoveRight />
            </Link>
          </Button>
        }
      />

      <div className="divide-border divide-y">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div
              key={activity.id}
              className="hover:bg-surface-hover flex items-start gap-3 px-4 py-3 transition-colors"
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${activity.color}`}
              >
                <Icon size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-text text-sm font-medium">
                  <span className="block font-semibold">{activity.action}</span>
                  <span className="text-text-secondary block truncate">
                    {activity.target}
                  </span>
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Clock size={11} className="text-text-tertiary" />
                  <span className="text-text-tertiary text-xs">
                    {activity.time}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
export default RecentActivity
