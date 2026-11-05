"use client"

import { Plus, Maximize, Minus } from "lucide-react"
import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import DashboardLayout from "@/components/layout/DashboardLayout"

import { GET_CONNECTIONS } from "@/graphql/connection/queries"

import Button from "@/components/ui/Button"
import KnowledgeGraph, {
  type KnowledgeGraphRef,
} from "@/components/features/graph/KnowledgeGraph"
import GraphDetailsPanel from "@/components/features/graph/GraphDetailsPanel"
import PageHeader from "@/components/layout/PageHeader"
import { useQuery } from "@apollo/client/react"
import { GET_GRAPH_KNOWLEDGE } from "@/graphql/graph/queries"
import SearchInput from "@/components/ui/SearchInput"

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
  } = useQuery(GET_GRAPH_KNOWLEDGE)

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
      <PageHeader
        title="Knowledge Graph"
        description="Explore relationships between your knowledge."
        actions={
          <Button onClick={() => router.push("/knowledge/new")} size="md">
            <Plus size={15} /> Add knowledge
          </Button>
        }
      />

      <div className="relative flex-1">
        {loading && (
          <div className="border-border bg-surface flex h-full flex-1 items-center justify-center rounded-lg border">
            <p className="text-text-secondary text-sm">
              Loading knowledge graph...
            </p>
          </div>
        )}

        {error && (
          <div className="border-border bg-surface flex h-full flex-1 items-center justify-center rounded-lg border">
            <p className="text-sm text-red-400">
              Failed to load knowledge graph.
            </p>
          </div>
        )}

        {!loading && !error && knowledge.length === 0 && (
          <div className="border-border bg-surface flex h-full flex-1 items-center justify-center rounded-lg border">
            <div className="text-center">
              <h2 className="text-lg font-medium">No knowledge found</h2>

              <p className="text-text-secondary mt-1 text-sm">
                Create knowledge nodes to build your graph.
              </p>
            </div>
          </div>
        )}

        {!loading && !error && knowledge.length > 0 && (
          <div className="flex min-h-full min-w-0 flex-1 gap-4">
            <div className="relative min-h-0 min-w-0 flex-1">
              <div className="absolute top-3 left-3 z-10 flex items-center shadow-sm backdrop-blur">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search knowledge..."
                  className="bg-transparent px-2 py-2 text-sm outline-none focus:outline-none focus-visible:outline-none"
                  style={{ outline: "none" }}
                />
              </div>

              <KnowledgeGraph
                ref={graphRef}
                knowledge={knowledge}
                connections={connections}
                search={search}
                selectedNodeId={selectedKnowledgeId}
                onNodeSelect={setSelectedKnowledgeId}
              />

              <div className="absolute right-3 bottom-3 z-10 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => graphRef.current?.zoomIn()}
                  className="border-border bg-surface text-foreground hover:bg-background flex h-8 w-8 items-center justify-center rounded-md border shadow-sm transition"
                  aria-label="Zoom in"
                >
                  <Plus size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => graphRef.current?.zoomOut()}
                  className="border-border bg-surface text-foreground hover:bg-background flex h-8 w-8 items-center justify-center rounded-md border shadow-sm transition"
                  aria-label="Zoom out"
                >
                  <Minus size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => graphRef.current?.fitView()}
                  className="border-border bg-surface text-foreground hover:bg-background flex h-8 w-8 items-center justify-center rounded-md border shadow-sm transition"
                  aria-label="Fit view"
                >
                  <Maximize size={14} />
                </button>
              </div>
            </div>

            <div id="info" className="flex w-80 shrink-0 flex-col">
              <GraphDetailsPanel
                knowledge={selectedKnowledge}
                connections={connections}
                onClose={() => setSelectedKnowledgeId(null)}
                onViewKnowledge={(id) => router.push(`/knowledge/${id}`)}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default GraphPage
