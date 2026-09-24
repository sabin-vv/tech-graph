"use client"

import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { useQuery } from "@apollo/client/react"

import DashboardLayout from "@/components/layout/DashboardLayout"

import { GET_CONNECTIONS } from "@/graphql/connection/queries"
import { GET_KNOWLEDGE } from "@/graphql/knowledge/queries"

import GraphToolbar from "../features/graph/components/GraphToolbar"
import KnowledgeGraph, {
  type KnowledgeGraphRef,
} from "../features/graph/components/KnowledgeGraph"
import GraphDetailsPanel from "../features/graph/components/GraphDetailsPanel"

const GraphPage = () => {
  const router = useRouter()

  const graphRef = useRef<KnowledgeGraphRef>(null)

  const [search, setSearch] = useState("")
  const [selectedKnowledgeId, setSelectedKnowledgeId] = useState<string | null>(
    null,
  )

  const {
    data: knowledgeData,
    loading: knowledgeLoading,
    error: knowledgeError,
  } = useQuery(GET_KNOWLEDGE)

  const {
    data: connectionData,
    loading: connectionLoading,
    error: connectionError,
  } = useQuery(GET_CONNECTIONS)

  const knowledge = useMemo(
    () => knowledgeData?.knowledge ?? [],
    [knowledgeData],
  )

  const connections = useMemo(
    () => connectionData?.connections ?? [],
    [connectionData],
  )

  const selectedKnowledge = useMemo(() => {
    return knowledge.find((item) => item.id === selectedKnowledgeId) ?? null
  }, [knowledge, selectedKnowledgeId])

  const loading = knowledgeLoading || connectionLoading

  const error = knowledgeError || connectionError

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-120px)] min-h-150 flex-col">
        <GraphToolbar
          search={search}
          onSearchChange={setSearch}
          onFitView={() => graphRef.current?.fitView()}
          onReset={() => graphRef.current?.reset()}
        />

        <div className="relative min-h-0 flex-1">
          {loading && (
            <div className="border-border bg-surface flex h-full items-center justify-center rounded-lg border">
              <p className="text-text-secondary text-sm">
                Loading knowledge graph...
              </p>
            </div>
          )}

          {error && (
            <div className="border-border bg-surface flex h-full items-center justify-center rounded-lg border">
              <p className="text-sm text-red-400">
                Failed to load knowledge graph.
              </p>
            </div>
          )}

          {!loading && !error && knowledge.length === 0 && (
            <div className="border-border bg-surface flex h-full items-center justify-center rounded-lg border">
              <div className="text-center">
                <h2 className="text-lg font-medium">No knowledge found</h2>

                <p className="text-text-secondary mt-1 text-sm">
                  Create knowledge nodes to build your graph.
                </p>
              </div>
            </div>
          )}

          {!loading && !error && knowledge.length > 0 && (
            <>
              <KnowledgeGraph
                ref={graphRef}
                knowledge={knowledge}
                connections={connections}
                search={search}
                onNodeSelect={setSelectedKnowledgeId}
              />

              <GraphDetailsPanel
                knowledge={selectedKnowledge}
                connections={connections}
                onClose={() => setSelectedKnowledgeId(null)}
                onViewKnowledge={(id) => router.push(`/knowledge/${id}`)}
              />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default GraphPage
