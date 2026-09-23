"use client"
import Button from "@/components/ui/Button"
import { GET_CONNECTIONS_BY_KNOWLEDGE } from "@/graphql/connection/queries"
import { useMutation, useQuery } from "@apollo/client/react"
import { Pencil, Trash2, Waypoints } from "lucide-react"
import { useState } from "react"
import ConnectionDrawer from "./ConnectionDrawer"
import { DELETE_CONNECTION } from "@/graphql/connection/mutations"

interface KnowledgeConnectionProps {
  knowledgeId: string
}

const KnowledgeConnection = ({ knowledgeId }: KnowledgeConnectionProps) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const { data, loading, error, refetch } = useQuery(
    GET_CONNECTIONS_BY_KNOWLEDGE,
    {
      variables: {
        id: knowledgeId,
      },
    },
  )

  const [deleteConnection, { loading: deleting }] =
    useMutation(DELETE_CONNECTION)

  const formatRelation = (relation: string, isSource: boolean): string => {
    const relationLabel: Record<string, string> = {
      uses: isSource ? "USES" : "USED BY",
      related_to: "RELATED TO",
      part_of: "PART OF",
      depends_on: "DEPENDS ON",
      built_with: "BUILT WITH",
      extends: "EXTENDS",
    }
    return relationLabel[relation]
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure want to delete the connection?",
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteConnection({
        variables: {
          id,
        },
      })
      await refetch()
    } catch (error) {
      console.error("Failed to delete Connection", error)
    }
  }

  const connections = data?.connectionsByKnowledge ?? []
  return (
    <div className="border-border mt-7 mb-1 rounded-lg border">
      <div className="flex justify-between p-4">
        <h1 className="flex items-center gap-2 text-xl">
          <Waypoints size={20} color="#2698ff" />
          Graph Connection
        </h1>
        <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
          Add connection
        </Button>
      </div>

      {loading && (
        <p className="py-4 text-sm text-red-400">Loading Connection...</p>
      )}

      {error && (
        <p className="py-4 text-sm text-red-400">Failed to load connections.</p>
      )}

      {!loading && !error && connections.length === 0 && (
        <p className="py-4 text-sm text-red-400">No connections found</p>
      )}
      {!loading && !error && connections.length > 0 && (
        <ol className="bg-surface px-4">
          {connections.map((connection) => {
            const isSource = connection.id === knowledgeId
            const connectedKnowledge = isSource
              ? connection.source
              : connection.target
            return (
              <li
                key={connection.id}
                className="border-border flex justify-between border-b-2 py-2 last:border-b-0"
              >
                <h1 className="text-lg">{connectedKnowledge.title}</h1>
                <div className="flex gap-2">
                  <span className="text-text-secondary border-border rounded-md border p-2 text-xs uppercase">
                    {formatRelation(connection.relation, isSource)}
                  </span>
                  <Button variant="secondary" size="sm">
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(connection.id)}
                    disabled={deleting}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </li>
            )
          })}
        </ol>
      )}
      <ConnectionDrawer
        knowledgeId={knowledgeId}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        onSuccess={() => refetch()}
      />
    </div>
  )
}
export default KnowledgeConnection
