import KnowledgeCard from "./KnowledgeCard"
import type { GetKnowledgeQuery } from "@/generated/graphql/graphql"

type KnowledgeItem = GetKnowledgeQuery["knowledge"][number]

interface KnowledgeCardGridProps {
  knowledge: KnowledgeItem[]
  management?: boolean
  onDelete?: (id: string) => void
}

const KnowledgeCardGrid = ({
  knowledge,
  management = false,
  onDelete,
}: KnowledgeCardGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {knowledge.map((item) => (
        <KnowledgeCard
          key={item.id}
          knowledge={item}
          management={management}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
export default KnowledgeCardGrid
