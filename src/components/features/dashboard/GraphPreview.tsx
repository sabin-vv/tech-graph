"use client"

import { useQuery } from "@apollo/client/react"
import Link from "next/link"
import {
  Background,
  MarkerType,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useEffect, useMemo, useState } from "react"

import SectionHeader from "@/components/layout/SectionHeader"
import type {
  GetConnectionsQuery,
  GetKnowledgeQuery,
} from "@/generated/graphql/graphql"
import { MoveRight } from "lucide-react"

import { GET_CONNECTIONS } from "@/graphql/connection/queries"
import { GET_KNOWLEDGE } from "@/graphql/knowledge/queries"

const hiddenHandleStyle = `
  .react-flow__node .react-flow__handle {
    opacity: 0;
    pointer-events: none;
  }
`

type PreviewNode = Omit<Node, "position" | "sourcePosition" | "targetPosition">
type KnowledgeItem = GetKnowledgeQuery["knowledge"][number]
type ConnectionItem = GetConnectionsQuery["connections"][number]

function createNode(id: string, label: string, primary = false): PreviewNode {
  return {
    id,
    data: { label },
    style: primary
      ? {
          background: "var(--primary)",
          color: "var(--background)",
          border: "1px solid var(--primary-hover)",
          borderRadius: "999px",
          padding: "10px 18px",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
        }
      : {
          background: "var(--surface)",
          color: "var(--foreground)",
          border: "1px solid var(--border-hover)",
          borderRadius: "999px",
          padding: "8px 14px",
          fontSize: "12px",
          cursor: "pointer",
        },
  }
}

function buildPreviewGraph(
  knowledge: KnowledgeItem[],
  connections: ConnectionItem[],
  selectedId: string | null,
) {
  const nodeIds = new Set(knowledge.map((item) => item.id))
  const incoming = new Map<string, string[]>()
  const outgoing = new Map<string, string[]>()

  for (const item of knowledge) {
    incoming.set(item.id, [])
    outgoing.set(item.id, [])
  }

  const allEdges: Edge[] = connections
    .filter(
      (connection) =>
        nodeIds.has(connection.source.id) && nodeIds.has(connection.target.id),
    )
    .map((connection) => {
      outgoing.get(connection.source.id)?.push(connection.target.id)
      incoming.get(connection.target.id)?.push(connection.source.id)

      return {
        id: connection.id,
        source: connection.source.id,
        target: connection.target.id,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "var(--primary)",
        },
        style: {
          stroke: "var(--primary)",
          strokeWidth: 1.5,
        },
      }
    })

  const roots = knowledge
    .filter((item) => incoming.get(item.id)?.length === 0)
    .map((item) => item.id)
  const rootId = roots[0] ?? knowledge[0]?.id ?? null
  const positions = new Map<string, { x: number; y: number }>()
  const visited = new Set<string>()
  let nextY = 0

  function layoutNode(
    id: string,
    depth: number,
    ancestors: Set<string>,
  ): number {
    if (!nodeIds.has(id) || ancestors.has(id)) {
      return nextY
    }

    if (visited.has(id)) {
      return positions.get(id)?.y ?? nextY
    }

    visited.add(id)
    const nextAncestors = new Set(ancestors)
    nextAncestors.add(id)
    const childYs: number[] = []

    for (const childId of outgoing.get(id) ?? []) {
      if (!visited.has(childId)) {
        childYs.push(layoutNode(childId, depth + 1, nextAncestors))
      }
    }

    const y =
      childYs.length > 0
        ? (childYs[0] + childYs[childYs.length - 1]) / 2
        : nextY

    if (childYs.length === 0) {
      nextY += 90
    }

    positions.set(id, { x: depth * 400, y })
    return y
  }

  for (const root of roots.length > 0
    ? roots
    : knowledge.slice(0, 1).map((item) => item.id)) {
    layoutNode(root, 0, new Set())
  }

  for (const item of knowledge) {
    if (!visited.has(item.id)) {
      layoutNode(item.id, 0, new Set())
    }
  }

  const connectedIds = new Set<string>()
  if (selectedId && nodeIds.has(selectedId)) {
    connectedIds.add(selectedId)
    for (const id of outgoing.get(selectedId) ?? []) connectedIds.add(id)
    for (const id of incoming.get(selectedId) ?? []) connectedIds.add(id)

    const ancestorStack = [...(incoming.get(selectedId) ?? [])]
    const ancestorVisited = new Set(ancestorStack)
    while (ancestorStack.length > 0) {
      const currentId = ancestorStack.pop()!
      connectedIds.add(currentId)
      for (const parentId of incoming.get(currentId) ?? []) {
        if (!ancestorVisited.has(parentId)) {
          ancestorVisited.add(parentId)
          ancestorStack.push(parentId)
        }
      }
    }
  }

  const nodes = knowledge.map((item) => {
    const node = createNode(item.id, item.title, item.id === rootId)
    return {
      ...node,
      position: positions.get(item.id) ?? { x: 0, y: 0 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: {
        ...node.style,
        boxShadow:
          item.id === selectedId ? "0 0 0 2px var(--primary)" : undefined,
        opacity: selectedId && !connectedIds.has(item.id) ? 0.55 : 1,
      },
    }
  })

  const edges = allEdges.map((edge) => {
    const isConnected =
      selectedId !== null &&
      connectedIds.has(edge.source) &&
      connectedIds.has(edge.target)

    return {
      ...edge,
      style: {
        ...edge.style,
        stroke: isConnected
          ? "var(--primary)"
          : selectedId
            ? "var(--surface)"
            : "var(--border-hover)",
        strokeWidth: isConnected ? 2.5 : 1.5,
        opacity: selectedId && !isConnected ? 0.4 : 1,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: isConnected ? "var(--primary)" : "var(--border-hover)",
      },
    }
  })

  return { nodes, edges }
}

function GraphPreviewCanvas({
  knowledge,
  connections,
}: {
  knowledge: KnowledgeItem[]
  connections: ConnectionItem[]
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { fitView, zoomIn, zoomOut } = useReactFlow()
  const { nodes, edges } = useMemo(
    () => buildPreviewGraph(knowledge, connections, selectedId),
    [connections, knowledge, selectedId],
  )

  function handleNodeClick(_event: React.MouseEvent, node: Node) {
    setSelectedId((current) => (current === node.id ? null : node.id))
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fitView({ padding: 0.2, duration: 250 })
    }, 30)

    return () => window.clearTimeout(timeout)
  }, [fitView, nodes])

  return (
    <div className="bg-background relative h-105 w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll
        panOnScroll={false}
        panOnDrag={false}
        zoomOnPinch={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background />
      </ReactFlow>

      <div className="absolute right-3 bottom-3 z-10 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => void zoomIn({ duration: 200 })}
          aria-label="Zoom in"
          title="Zoom in"
          className="border-border bg-surface text-foreground hover:bg-background flex h-8 w-8 items-center justify-center rounded-md border shadow-sm transition"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => void zoomOut({ duration: 200 })}
          aria-label="Zoom out"
          title="Zoom out"
          className="border-border bg-surface text-foreground hover:bg-background flex h-8 w-8 items-center justify-center rounded-md border shadow-sm transition"
        >
          −
        </button>
        <button
          type="button"
          onClick={() => void fitView({ padding: 0.2, duration: 250 })}
          aria-label="Fit graph to preview"
          title="Fit graph"
          className="border-border bg-surface text-foreground hover:bg-background flex h-8 items-center justify-center rounded-md border px-2 text-xs shadow-sm transition"
        >
          Fit
        </button>
      </div>
    </div>
  )
}

export default function GraphPreview() {
  const {
    data: knowledgeData,
    loading: knowledgeLoading,
    error: knowledgeError,
  } = useQuery(GET_KNOWLEDGE, { fetchPolicy: "cache-and-network" })
  const {
    data: connectionData,
    loading: connectionLoading,
    error: connectionError,
  } = useQuery(GET_CONNECTIONS, { fetchPolicy: "cache-and-network" })

  const knowledge = knowledgeData?.knowledge ?? []
  const connections = connectionData?.connections ?? []
  const loading = knowledgeLoading || connectionLoading
  const error = knowledgeError || connectionError

  return (
    <section className="border-border bg-surface h-full overflow-hidden rounded-xl border">
      <style>{hiddenHandleStyle}</style>
      <SectionHeader
        title="Knowledge Graph"
        description="Click a node to view its connections"
        action={
          <Link
            href="/graph"
            className="border-border text-primary hover:bg-surface-hover inline-flex h-10 items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors"
          >
            Open Graph View <MoveRight size={16} />
          </Link>
        }
      />

      {loading && (
        <div className="bg-background flex h-105 items-center justify-center">
          <p className="text-text-secondary text-sm">
            Loading graph preview...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-background flex h-105 items-center justify-center">
          <p className="text-danger text-sm">Failed to load graph preview.</p>
        </div>
      )}

      {!loading && !error && knowledge.length === 0 && (
        <div className="bg-background flex h-105 items-center justify-center">
          <p className="text-text-secondary text-sm">
            Add knowledge to build your graph.
          </p>
        </div>
      )}

      {!loading && !error && knowledge.length > 0 && (
        <ReactFlowProvider>
          <GraphPreviewCanvas knowledge={knowledge} connections={connections} />
        </ReactFlowProvider>
      )}
    </section>
  )
}
