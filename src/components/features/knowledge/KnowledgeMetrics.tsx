import { useQuery } from "@apollo/client/react"
import { GET_CONNECTIONS_BY_KNOWLEDGE } from "@/graphql/connection/queries"
import { GET_RESOURCE_BY_KNOWLEDGE } from "@/graphql/resource/queries"

interface KnowledgeMetricsProps {
  knowledgeId: string
  tags: string[]
  updatedAt: string
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value))

const KnowledgeMetrics = ({
  knowledgeId,
  tags,
  updatedAt,
}: KnowledgeMetricsProps) => {
  const { data: connectionData, loading: connectionsLoading } = useQuery(
    GET_CONNECTIONS_BY_KNOWLEDGE,
    { variables: { id: knowledgeId } },
  )
  const { data: resourceData, loading: resourcesLoading } = useQuery(
    GET_RESOURCE_BY_KNOWLEDGE,
    { variables: { id: knowledgeId } },
  )
  const connectionCount = connectionData?.connectionsByKnowledge.length
  const resourceCount = resourceData?.resourcesByKnowledge.length

  return (
    <div className="border-border rounded-lg border p-4">
      <h2 className="text-text-secondary border-border w-full border-b-2 py-2">
        KNOWLEDGE METRICS
      </h2>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-text-muted text-sm">Connections</h3>
          <span className="text-xl font-bold" aria-live="polite">
            {connectionsLoading ? "—" : (connectionCount ?? 0)}
          </span>
        </div>
        <div>
          <h3 className="text-text-muted text-sm">Resources</h3>
          <span className="text-xl font-bold" aria-live="polite">
            {resourcesLoading ? "—" : (resourceCount ?? 0)}
          </span>
        </div>
        <div>
          <h3 className="text-text-muted text-sm">Tags</h3>
          <span className="text-xl font-bold">{tags.length}</span>
        </div>
        <div>
          <h3 className="text-text-muted text-sm">Last updated</h3>
          <span className="text-sm font-bold">{formatDate(updatedAt)}</span>
        </div>
      </div>
    </div>
  )
}
export default KnowledgeMetrics
