"use client"

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react"

import type { KnowledgeType } from "@/generated/graphql/graphql"

export type GraphNodeData = {
  label: string
  type: KnowledgeType
  highlighted?: boolean
}

export type KnowledgeNode = Node<GraphNodeData, "knowledge">

const GraphNode = ({ data }: NodeProps<KnowledgeNode>) => {
  return (
    <div
      className={`relative min-w-44 rounded-lg border px-4 py-3 shadow-sm transition-all ${
        data.highlighted
          ? "border-primary ring-primary/30 shadow-lg ring-2"
          : "border-border"
      }`}
      style={{
        background: "var(--color-surface)",
        color: "var(--color-foreground)",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="bg-primary! h-2.5! w-2.5!"
      />

      <div className="text-sm font-medium">{data.label}</div>

      <div className="text-text-secondary mt-1 text-[10px] tracking-wider uppercase">
        {data.type}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="bg-primary! h-2.5! w-2.5!"
      />
    </div>
  )
}

export default GraphNode
