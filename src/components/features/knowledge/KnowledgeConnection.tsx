"use client"

import Button from "@/components/ui/Button"
import { GET_CONNECTIONS_BY_KNOWLEDGE } from "@/graphql/connection/queries"
import { useMutation, useQuery } from "@apollo/client/react"
import { Pencil, Trash2, Waypoints } from "lucide-react"
import { useState } from "react"
import ConnectionDrawer from "./ConnectionDrawer"
import { DELETE_CONNECTION } from "@/graphql/connection/mutations"
import { GET_KNOWLEDGE_FOR_CONNECTION } from "@/graphql/knowledge/queries"
import type { Relation } from "@/generated/graphql/graphql"

interface KnowledgeConnectionProps {
  knowledgeId: string
}

interface EditingConnection {
  id: string
  relation: Relation
  sourceTitle: string
  targetTitle: string
}

const KnowledgeConnection = ({ knowledgeId }: KnowledgeConnectionProps) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const [editingConnection, setEditingConnection] =
    useState<EditingConnection | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deletingConnectionId, setDeletingConnectionId] = useState<string | null>(
    null,
  )
  const { data, loading, error, refetch } = useQuery(
    GET_CONNECTIONS_BY_KNOWLEDGE,
    {
      variables: {
        id: knowledgeId,
      },
    },
  )
  const { data: knowledgeData } = useQuery(GET_KNOWLEDGE_FOR_CONNECTION)
  const source =
    knowledgeData?.knowledge.find((k) => k.id === knowledgeId)?.title ??
    "Source"

  const [deleteConnection, { loading: deleting }] =
    useMutation(DELETE_CONNECTION)

  const formatRelation = (relation: Relation, isSource: boolean): string => {
    const relationLabels: Record<Relation, [string, string]> = {
      uses: ["USES", "USED BY"],
      related_to: ["RELATED TO", "RELATED TO"],
      part_of: ["PART OF", "CONTAINS"],
      depends_on: ["DEPENDS ON", "REQUIRED BY"],
      built_with: ["BUILT WITH", "USED TO BUILD"],
      extends: ["EXTENDS", "EXTENDED BY"],
    }
    return relationLabels[relation][isSource ? 0 : 1]
  }

  const handleAddConnection = () => {
    setEditingConnection(null)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setEditingConnection(null)
  }

  const handleEditConnection = (connection: EditingConnection) => {
    setEditingConnection(connection)
    setDrawerOpen(true)
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure want to delete the connection?",
    )

    if (!confirmed) {
      return
    }

    setDeleteError(null)
    setDeletingConnectionId(id)

    try {
      await deleteConnection({
        variables: {
          id,
        },
      })
      await refetch()
    } catch (error) {
      console.error("Failed to delete Connection", error)
      setDeleteError("Unable to delete the connection. Please try again.")
    } finally {
      setDeletingConnectionId(null)
    }
  }

  const connections = data?.connectionsByKnowledge ?? []
  return (
    <div className="border-border rounded-lg border">
      <div className="flex justify-between p-4">
        <h2 className="flex items-center gap-2 text-xl">
          <Waypoints size={20} color="#2698ff" />
          Graph Connection
        </h2>
        <Button variant="secondary" onClick={handleAddConnection}>
          Add connection
        </Button>
      </div>

      {deleteError && (
        <p className="px-4 pb-3 text-sm text-red-400" role="alert">
          {deleteError}
        </p>
      )}

      {loading && (
        <p className="text-text-secondary bg-surface px-4 py-4 text-sm" role="status">
          Loading connections...
        </p>
      )}

      {error && (
        <div
          className="bg-surface flex flex-wrap items-center gap-3 px-4 py-4"
          role="alert"
        >
          <p className="text-red-400">
            Unable to load connections. Please try again.
          </p>
          <Button variant="outline" onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      )}

      {!loading && !error && connections.length === 0 && (
        <p className="text-text-secondary bg-surface px-4 py-4 text-sm">
          No connections yet. Add a connection to link this knowledge to another
          item.
        </p>
      )}
      {!loading && !error && connections.length > 0 && (
        <ol className="bg-surface px-4">
          {connections.map((connection) => {
            const isSource = connection.source.id === knowledgeId
            const connectedKnowledge = isSource
              ? connection.target
              : connection.source
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
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      handleEditConnection({
                        id: connection.id,
                        relation: connection.relation,
                        sourceTitle: connection.source.title,
                        targetTitle: connection.target.title,
                      })
                    }
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(connection.id)}
                    disabled={deleting}
                    loading={deletingConnectionId === connection.id}
                    aria-label={`Delete connection to ${connectedKnowledge.title}`}
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
        key={`${drawerOpen}-${editingConnection?.id ?? "new"}`}
        source={source}
        knowledgeId={knowledgeId}
        onClose={handleCloseDrawer}
        open={drawerOpen}
        onSuccess={() => refetch()}
        editingConnection={editingConnection}
      />
    </div>
  )
}
export default KnowledgeConnection
