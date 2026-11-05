"use client"

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react"

import {
  Background,
  BackgroundVariant,
  MarkerType,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type NodeMouseHandler,
  type ReactFlowInstance,
} from "@xyflow/react"

import "@xyflow/react/dist/style.css"

import type {
  GetConnectionsQuery,
  GetKnowledgeQuery,
} from "@/generated/graphql/graphql"

type KnowledgeNode = Node<{
  label: string
  type: GetKnowledgeQuery["knowledge"][number]["type"]
}>

const HORIZONTAL_GAP = 300
const VERTICAL_GAP = 110

const hiddenHandleStyle = `
  .knowledge-graph-canvas .react-flow__handle {
    opacity: 0;
    pointer-events: none;
  }
`

function buildLayeredLayout(
  knowledge: GetKnowledgeQuery["knowledge"],
  connections: GetConnectionsQuery["connections"],
) {
  const incoming = new Map<string, number>()
  const outgoing = new Map<string, string[]>()

  for (const item of knowledge) {
    incoming.set(item.id, 0)
    outgoing.set(item.id, [])
  }

  for (const connection of connections) {
    if (
      !incoming.has(connection.source.id) ||
      !incoming.has(connection.target.id)
    ) {
      continue
    }

    incoming.set(
      connection.target.id,
      (incoming.get(connection.target.id) ?? 0) + 1,
    )
    outgoing.get(connection.source.id)?.push(connection.target.id)
  }

  const roots = knowledge
    .filter((item) => incoming.get(item.id) === 0)
    .map((item) => item.id)

  const queue =
    roots.length > 0 ? [...roots] : knowledge.slice(0, 1).map((item) => item.id)
  const depth = new Map<string, number>(queue.map((id) => [id, 0]))

  while (queue.length > 0) {
    const current = queue.shift()!
    const currentDepth = depth.get(current) ?? 0

    for (const child of outgoing.get(current) ?? []) {
      if (!depth.has(child)) {
        depth.set(child, currentDepth + 1)
        queue.push(child)
      }
    }
  }

  for (const item of knowledge) {
    if (!depth.has(item.id)) {
      depth.set(item.id, 0)
    }
  }

  const layers = new Map<number, string[]>()
  for (const item of knowledge) {
    const layer = depth.get(item.id) ?? 0
    layers.set(layer, [...(layers.get(layer) ?? []), item.id])
  }

  const positions = new Map<string, { x: number; y: number }>()
  const maxLayerSize = Math.max(
    ...Array.from(layers.values()).map((ids) => ids.length),
    1,
  )

  for (const [layer, ids] of layers) {
    const offset = (maxLayerSize - ids.length) / 2
    ids.forEach((id, index) => {
      positions.set(id, {
        x: layer * HORIZONTAL_GAP,
        y: (index + offset) * VERTICAL_GAP,
      })
    })
  }

  return { positions, rootId: roots[0] ?? knowledge[0]?.id ?? null }
}

interface KnowledgeGraphProps {
  knowledge: GetKnowledgeQuery["knowledge"]
  connections: GetConnectionsQuery["connections"]
  search: string
  selectedNodeId: string | null
  onNodeSelect: (knowledgeId: string) => void
}

export interface KnowledgeGraphRef {
  fitView: () => void
  reset: () => void
  zoomIn: () => void
  zoomOut: () => void
}

const KnowledgeGraph = forwardRef<KnowledgeGraphRef, KnowledgeGraphProps>(
  ({ knowledge, connections, search, selectedNodeId, onNodeSelect }, ref) => {
    const reactFlowRef = useRef<ReactFlowInstance<KnowledgeNode, Edge> | null>(
      null,
    )

    const initialNodes = useMemo<KnowledgeNode[]>(() => {
      const normalizedSearch = search.trim().toLowerCase()
      const { positions, rootId } = buildLayeredLayout(knowledge, connections)

      return knowledge.map((item) => ({
        id: item.id,
        position: positions.get(item.id) ?? { x: 0, y: 0 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: {
          label: item.title,
          type: item.type,
        },
        style: {
          background: "var(--surface)",
          color: "var(--foreground)",
          border: "1px solid var(--border-hover)",
          borderRadius: "999px",
          padding: "8px 14px",
          fontSize: "12px",
          cursor: "pointer",
          borderColor:
            item.id === selectedNodeId
              ? "var(--primary)"
              : "var(--border-hover)",
          boxShadow:
            item.id === selectedNodeId
              ? "0 0 0 2px var(--primary), 0 0 18px var(--primary)"
              : normalizedSearch.length > 0 &&
                  item.title.toLowerCase().includes(normalizedSearch)
                ? "0 0 0 2px var(--primary)"
                : undefined,
          ...(item.id === rootId
            ? {
                background: "var(--primary)",
                color: "var(--background)",
                border: "1px solid var(--primary-hover)",
                padding: "10px 18px",
                fontSize: "13px",
                fontWeight: 600,
              }
            : {}),
        },
      }))
    }, [connections, knowledge, search, selectedNodeId])

    const initialEdges = useMemo<Edge[]>(
      () =>
        connections.map((connection) => ({
          id: connection.id,
          source: connection.source.id,
          target: connection.target.id,
          label: connection.relation.replaceAll("_", " "),
          labelStyle: {
            fill: "var(--text-secondary)",
            fontSize: 11,
            fontWeight: 500,
            textTransform: "capitalize",
          },
          labelBgStyle: {
            fill: "var(--surface)",
            fillOpacity: 0.9,
          },
          labelBgPadding: [4, 2] as [number, number],
          labelBgBorderRadius: 4,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "var(--primary)",
          },
          style: {
            stroke: "var(--border-hover)",
            strokeWidth: 1.5,
          },
        })),
      [connections],
    )

    const [nodes, setNodes, onNodesChange] =
      useNodesState<KnowledgeNode>(initialNodes)

    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

    useEffect(() => {
      setNodes(initialNodes)
    }, [initialNodes, setNodes])

    useEffect(() => {
      setEdges(initialEdges)
    }, [initialEdges, setEdges])

    useImperativeHandle(
      ref,
      () => ({
        fitView: () => {
          reactFlowRef.current?.fitView({
            padding: 0.2,
            duration: 400,
          })
        },

        reset: () => {
          reactFlowRef.current?.setViewport({
            x: 0,
            y: 0,
            zoom: 1,
          })
        },

        zoomIn: () => {
          reactFlowRef.current?.zoomIn({ duration: 200 })
        },

        zoomOut: () => {
          reactFlowRef.current?.zoomOut({ duration: 200 })
        },
      }),
      [],
    )

    const handleNodeClick: NodeMouseHandler<KnowledgeNode> = (_, node) => {
      onNodeSelect(node.id)
    }

    return (
      <div className="knowledge-graph-canvas border-border bg-surface h-full overflow-hidden rounded-lg border">
        <style>{hiddenHandleStyle}</style>
        <ReactFlow<KnowledgeNode, Edge>
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onInit={(instance) => {
            reactFlowRef.current = instance
          }}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll
          panOnScroll={false}
          panOnDrag={false}
          minZoom={0.2}
          maxZoom={2}
          proOptions={{
            hideAttribution: true,
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={18}
            size={1}
            color="var(--border)"
          />
        </ReactFlow>
      </div>
    )
  },
)

KnowledgeGraph.displayName = "KnowledgeGraph"

export default KnowledgeGraph
