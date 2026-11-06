import { Pencil } from "lucide-react"

interface KnowledgeTitleProps {
  title: string
  tags: string[]
}

const KnowledgeTitle = ({ title, tags }: KnowledgeTitleProps) => {
  return (
    <div className="flex justify-between">
      <div>
        <h1 className="text-4xl font-semibold">{title}</h1>
        {tags.length > 0 && (
          <div className="mt-2 flex gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="border-border rounded-md border px-3 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center justify-center">
        <button className="border-border bg-surface hover:bg-surface-elevated flex items-center gap-2 rounded-lg border px-4 py-2 hover:cursor-pointer">
          <Pencil size={16} /> Edit
        </button>
      </div>
    </div>
  )
}
export default KnowledgeTitle
