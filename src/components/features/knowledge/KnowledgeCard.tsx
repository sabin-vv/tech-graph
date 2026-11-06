import Link from "next/link"
import {
  ArrowUpRight,
  Code2,
  Database,
  Lightbulb,
  Network,
  Pencil,
  Trash2,
} from "lucide-react"
import type { GetKnowledgeQuery } from "@/generated/graphql/graphql"

type KnowledgeItem = GetKnowledgeQuery["knowledge"][number]

interface KnowledgeCardProps {
  knowledge: KnowledgeItem
  management?: boolean
  onDelete?: (id: string) => void
}

const typeStyles: Record<
  KnowledgeItem["type"],
  { icon: typeof Code2; label: string; accent: string; iconStyle: string }
> = {
  technology: {
    icon: Code2,
    label: "Technology",
    accent: "bg-cyan",
    iconStyle: "bg-cyan/10 text-cyan",
  },
  concept: {
    icon: Lightbulb,
    label: "Concept",
    accent: "bg-primary",
    iconStyle: "bg-primary/10 text-primary",
  },
  algorithm: {
    icon: Network,
    label: "Algorithm",
    accent: "bg-yellow",
    iconStyle: "bg-yellow/10 text-yellow",
  },
  database: {
    icon: Database,
    label: "Database",
    accent: "bg-green",
    iconStyle: "bg-green/10 text-green",
  },
}

const KnowledgeCard = ({
  knowledge,
  management = false,
  onDelete,
}: KnowledgeCardProps) => {
  const {
    icon: TypeIcon,
    label,
    accent,
    iconStyle,
  } = typeStyles[knowledge.type]
  const visibleTags = knowledge.tags.slice(0, 3)
  const remainingTagCount = knowledge.tags.length - visibleTags.length

  return (
    <article className="group border-border bg-surface group-hover:border-border-hover relative flex h-full min-h-60 flex-col overflow-hidden rounded-2xl border transition duration-200 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-black/25">
        <div className={`h-1 w-full ${accent}`} />
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className={`rounded-xl p-2.5 ${iconStyle}`}>
                <TypeIcon size={18} aria-hidden="true" />
              </span>
              <span className="text-text-muted pt-1 text-sm font-medium tracking-wide uppercase">
                {label}
              </span>
            </div>
            {management && (
              <div className="flex items-center gap-1">
                <Link
                  href={`/knowledge/${knowledge.id}/edit`}
                  className="text-text-secondary hover:bg-background-secondary hover:text-foreground rounded-md p-1.5"
                  aria-label={`Edit ${knowledge.title}`}
                >
                  <Pencil size={14} aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete?.(knowledge.id)}
                  className="text-text-secondary rounded-md p-1.5 hover:bg-red-500/10 hover:text-red-400"
                  aria-label={`Delete ${knowledge.title}`}
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          <Link
            href={`/knowledge/${knowledge.id}`}
            className="group/link mt-4 flex-1"
          >
            <h2 className="line-clamp-2 text-xl font-semibold tracking-tight">
              {knowledge.title}
            </h2>
            <p className="text-text-secondary mt-2 line-clamp-3 text-sm leading-6">
              {knowledge.description}
            </p>
          </Link>

          <div className="border-border mt-auto flex items-center justify-between gap-3 border-t pt-4">
            <ul className="flex min-w-0 flex-wrap gap-1.5">
              {visibleTags.map((tag) => (
                <li
                  key={tag}
                  className="bg-background-secondary text-text-secondary max-w-28 truncate rounded-md px-2 py-1 text-xs"
                >
                  {tag}
                </li>
              ))}
              {remainingTagCount > 0 && (
                <li className="text-text-muted px-1 py-1 text-xs">
                  +{remainingTagCount}
                </li>
              )}
            </ul>
            <Link
              href={`/knowledge/${knowledge.id}`}
              className="text-text-muted hover:text-primary shrink-0 transition"
              aria-label={`Open ${knowledge.title}`}
            >
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>
  )
}

export default KnowledgeCard
