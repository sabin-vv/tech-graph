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
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type NodeMouseHandler,
  type ReactFlowInstance,
} from "@xyflow/react"

import "@xyflow/react/dist/style.css"

import type {
  GetConnectionsQuery,
  GetKnowledgeQuery,
} from "@/generated/graphql/graphql"

import GraphNode, { type KnowledgeNode } from "./GraphNode"

interface KnowledgeGraphProps {
  knowledge: GetKnowledgeQuery["knowledge"]
  connections: GetConnectionsQuery["connections"]
  search: string
  onNodeSelect: (knowledgeId: string) => void
}

export interface KnowledgeGraphRef {
  fitView: () => void
  reset: () => void
}

const nodeTypes = {
  knowledge: GraphNode,
}

const KnowledgeGraph = forwardRef<KnowledgeGraphRef, KnowledgeGraphProps>(
  ({ knowledge, connections, search, onNodeSelect }, ref) => {
    const reactFlowRef = useRef<ReactFlowInstance<KnowledgeNode, Edge> | null>(
      null,
    )

    const initialNodes = useMemo<KnowledgeNode[]>(() => {
      const columns = Math.max(Math.ceil(Math.sqrt(knowledge.length)), 1)

      const normalizedSearch = search.trim().toLowerCase()

      return knowledge.map((item, index) => ({
        id: item.id,
        type: "knowledge",
        position: {
          x: (index % columns) * 260,
          y: Math.floor(index / columns) * 150,
        },
        data: {
          label: item.title,
          type: item.type,
          highlighted:
            normalizedSearch.length > 0 &&
            item.title.toLowerCase().includes(normalizedSearch),
        },
      }))
    }, [knowledge, search])

    const initialEdges = useMemo<Edge[]>(
      () =>
        connections.map((connection) => ({
          id: connection.id,
          source: connection.source.id,
          target: connection.target.id,
          label: connection.relation.replaceAll("_", " "),
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: {
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
      }),
      [],
    )

    const handleNodeClick: NodeMouseHandler<KnowledgeNode> = (_, node) => {
      onNodeSelect(node.id)
    }

    return (
      <div className="border-border bg-surface h-full overflow-hidden rounded-lg border">
        <ReactFlow<KnowledgeNode, Edge>
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onInit={(instance) => {
            reactFlowRef.current = instance
          }}
          fitView
          minZoom={0.2}
          maxZoom={2}
          proOptions={{
            hideAttribution: true,
          }}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    )
  },
)

KnowledgeGraph.displayName = "KnowledgeGraph"

export default KnowledgeGraph
