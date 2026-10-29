"use client"

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

const HORIZONTAL_GAP = 245
const VERTICAL_GAP = 90

const hiddenHandleStyle = `
  .react-flow__node .react-flow__handle {
    opacity: 0;
    pointer-events: none;
  }
`

function createNode(id: string, label: string, primary = false): Node {
  return {
    id,
    position: { x: 0, y: 0 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
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

const nodeDefinitions = [
  { id: "nodejs", label: "Node.js", primary: true },
  { id: "javascript", label: "JavaScript" },
  { id: "express", label: "Express" },
  { id: "event-loop", label: "Event Loop" },
  { id: "exec", label: "Exec" },
  { id: "threadpool", label: "Thread Pool" },
  { id: "v8", label: "V8" },
  { id: "router", label: "Router" },
  { id: "middleware", label: "Middleware" },
  { id: "timers", label: "Timers" },
  { id: "poll", label: "Poll" },
  { id: "check", label: "Check" },
  { id: "child-process", label: "Child Process" },
  { id: "filesystem", label: "File System" },
  { id: "crypto", label: "Crypto" },
] as const

type NodeId = (typeof nodeDefinitions)[number]["id"]

type ConnectionDefinition = {
  id: string
  source: NodeId
  target: NodeId
}

const allNodes: Node[] = nodeDefinitions.map((node) =>
  createNode(node.id, node.label, "primary" in node ? node.primary : false),
)

const connectionDefinitions: ConnectionDefinition[] = [
  { id: "nodejs-javascript", source: "nodejs", target: "javascript" },
  { id: "nodejs-express", source: "nodejs", target: "express" },
  { id: "nodejs-event-loop", source: "nodejs", target: "event-loop" },
  { id: "nodejs-exec", source: "nodejs", target: "exec" },
  { id: "nodejs-threadpool", source: "nodejs", target: "threadpool" },

  { id: "javascript-v8", source: "javascript", target: "v8" },
  { id: "express-router", source: "express", target: "router" },
  { id: "express-middleware", source: "express", target: "middleware" },

  { id: "event-loop-timers", source: "event-loop", target: "timers" },
  { id: "event-loop-poll", source: "event-loop", target: "poll" },
  { id: "event-loop-check", source: "event-loop", target: "check" },

  { id: "exec-child-process", source: "exec", target: "child-process" },
  { id: "threadpool-filesystem", source: "threadpool", target: "filesystem" },
  { id: "threadpool-crypto", source: "threadpool", target: "crypto" },
]

const allEdges: Edge[] = connectionDefinitions.map(
  ({ id, source, target }) => ({
    id,
    source,
    target,
    type: "default",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "var(--primary)",
    },
    style: {
      stroke: "var(--primary)",
      strokeWidth: 1.5,
    },
  }),
)

const nodeById = new Map(allNodes.map((node) => [node.id, node]))

function buildFullGraph(selectedId: string | null) {
  const visibleIds = new Set<string>()
  const positions = new Map<string, { x: number; y: number }>()
  let nextY = 0

  function layoutNode(
    id: string,
    depth: number,
    ancestors: Set<string>,
  ): number {
    if (!nodeById.has(id) || ancestors.has(id)) {
      return nextY
    }

    if (visibleIds.has(id)) {
      return positions.get(id)?.y ?? nextY
    }

    visibleIds.add(id)

    const nextAncestors = new Set(ancestors)
    nextAncestors.add(id)

    const childIds = allEdges
      .filter((edge) => edge.source === id)
      .map((edge) => edge.target)
      .filter((targetId) => !nextAncestors.has(targetId))

    const childYs: number[] = []

    for (const childId of childIds) {
      if (!visibleIds.has(childId)) {
        childYs.push(layoutNode(childId, depth + 1, nextAncestors))
      }
    }

    const y =
      childYs.length > 0
        ? (childYs[0] + childYs[childYs.length - 1]) / 2
        : nextY

    if (childYs.length === 0) {
      nextY += VERTICAL_GAP
    }

    positions.set(id, {
      x: depth * HORIZONTAL_GAP,
      y,
    })

    return y
  }

  layoutNode("nodejs", 0, new Set())

  for (const node of allNodes) {
    if (!visibleIds.has(node.id)) {
      layoutNode(node.id, 0, new Set())
    }
  }

  const connectedIds = new Set<string>()

  if (selectedId) {
    connectedIds.add(selectedId)

    allEdges
      .filter(
        (edge) => edge.source === selectedId || edge.target === selectedId,
      )
      .forEach((edge) => {
        connectedIds.add(edge.source)
        connectedIds.add(edge.target)
      })

    const ancestorVisited = new Set<string>([selectedId])
    const ancestorStack = [selectedId]
    while (ancestorStack.length > 0) {
      const currentId = ancestorStack.pop()!
      const incomingEdges = allEdges.filter(
        (edge) =>
          edge.target === currentId && !ancestorVisited.has(edge.source),
      )
      for (const edge of incomingEdges) {
        ancestorVisited.add(edge.source)
        connectedIds.add(edge.source)
        ancestorStack.push(edge.source)
      }
    }
  }

  const nodes = allNodes.map((node) => ({
    ...node,
    position: positions.get(node.id) ?? { x: 0, y: 0 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: {
      ...node.style,
      boxShadow:
        node.id === selectedId ? "0 0 0 2px var(--primary)" : undefined,
      opacity: selectedId && !connectedIds.has(node.id) ? 0.55 : 1,
    },
  }))

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

function GraphPreviewCanvas() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { fitView, zoomIn, zoomOut } = useReactFlow()

  const { nodes, edges } = useMemo(
    () => buildFullGraph(selectedId),
    [selectedId],
  )

  function handleNodeClick(_event: React.MouseEvent, node: Node) {
    setSelectedId((current) => (current === node.id ? null : node.id))
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fitView({
        padding: 0.2,
        duration: 250,
      })
    }, 30)

    return () => window.clearTimeout(timeout)
  }, [nodes, fitView])

  return (
    <div className="bg-background relative h-105 w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={true}
        panOnScroll={false}
        panOnDrag={false}
        zoomOnPinch={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={24} size={1} color="var(--surface)" />
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
          onClick={() =>
            void fitView({
              padding: 0.2,
              duration: 250,
            })
          }
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
  return (
    <>
      <style>{hiddenHandleStyle}</style>

      <section className="border-border bg-surface mt-7 overflow-hidden rounded-xl border">
        <div className="border-border flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="text-foreground text-sm font-semibold">
              Knowledge Graph
            </h2>

            <p className="text-text-secondary mt-1 text-xs">
              Click a node to expand its connections
            </p>
          </div>

          <Link
            href="/graph"
            className="text-primary hover:text-primary-hover text-xs font-medium transition-colors"
          >
            Open Graph View →
          </Link>
        </div>

        <ReactFlowProvider>
          <GraphPreviewCanvas />
        </ReactFlowProvider>
      </section>
    </>
  )
}
