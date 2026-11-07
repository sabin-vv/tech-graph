import { BookOpen, Clock, Edit, GitBranch, Plus, Trash2 } from "lucide-react"
import type { GetRecentActivityQuery } from "@/generated/graphql/graphql"

type ActivityItem =
  GetRecentActivityQuery["recentActivity"]["items"][number]

const actionLabels: Record<ActivityItem["action"], string> = {
  created: "Added",
  updated: "Updated",
  deleted: "Deleted",
}

const entityLabels: Record<ActivityItem["entityType"], string> = {
  knowledge: "knowledge",
  connection: "connection",
  resource: "resource",
  profile: "profile",
}

const actionColors: Record<ActivityItem["action"], string> = {
  created: "text-green-400 bg-green-400/10",
  updated: "text-blue bg-blue/10",
  deleted: "text-red bg-red/10",
}

function getActivityIcon(activity: ActivityItem) {
  if (activity.action === "created" && activity.entityType === "connection") {
    return GitBranch
  }
  if (activity.action === "created" && activity.entityType === "resource") {
    return BookOpen
  }

  return {
    created: Plus,
    updated: Edit,
    deleted: Trash2,
  }[activity.action]
}

function formatActivityDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Unknown date"

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

interface ActivityListProps {
  activities: ActivityItem[]
}

const ActivityList = ({ activities }: ActivityListProps) => (
  <ol className="divide-border divide-y">
    {activities.map((activity) => {
      const Icon = getActivityIcon(activity)
      const actionLabel =
        activity.action === "created" && activity.entityType === "connection"
          ? "Created"
          : actionLabels[activity.action]

      return (
        <li
          key={activity.id}
          className="flex items-start gap-3 px-4 py-4 sm:px-5"
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${actionColors[activity.action]}`}
            aria-hidden="true"
          >
            <Icon size={16} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">
              <span className="block font-semibold">
                {actionLabel} {entityLabels[activity.entityType]}
              </span>
              <span className="text-text-secondary mt-0.5 block wrap-break-word">
                {activity.summary}
              </span>
            </p>
            <div className="text-text-muted mt-2 flex items-center gap-2">
              <Clock size={12} aria-hidden="true" />
              <time
                className="text-xs"
                dateTime={activity.createdAt}
                suppressHydrationWarning
              >
                {formatActivityDate(activity.createdAt)}
              </time>
            </div>
          </div>
        </li>
      )
    })}
  </ol>
)

export default ActivityList
