"use client";

import Link from "next/link";
import { Background, ReactFlow, type Edge, type Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const hiddenHandleStyle = `
  .react-flow__node .react-flow__handle {
    opacity: 0;
    pointer-events: none;
  }
`;

const nodes: Node[] = [
  {
    id: "nodejs",
    position: { x: 280, y: 150 },
    data: { label: "Node.js" },
    style: {
      background: "#8b7cff",
      color: "#080d12",
      border: "1px solid #9a8dff",
      borderRadius: "999px",
      padding: "10px 18px",
      fontSize: "13px",
      fontWeight: 600,
    },
  },
  {
    id: "javascript",
    position: { x: 70, y: 50 },
    data: { label: "JavaScript" },
    style: {
      background: "#111820",
      color: "#e7ecf2",
      border: "1px solid #202b36",
      borderRadius: "999px",
      padding: "8px 14px",
      fontSize: "12px",
    },
  },
  {
    id: "express",
    position: { x: 500, y: 55 },
    data: { label: "Express" },
    style: {
      background: "#111820",
      color: "#e7ecf2",
      border: "1px solid #202b36",
      borderRadius: "999px",
      padding: "8px 14px",
      fontSize: "12px",
    },
  },
  {
    id: "event-loop",
    position: { x: 80, y: 250 },
    data: { label: "Event Loop" },
    style: {
      background: "#111820",
      color: "#e7ecf2",
      border: "1px solid #202b36",
      borderRadius: "999px",
      padding: "8px 14px",
      fontSize: "12px",
    },
  },
  {
    id: "streams",
    position: { x: 500, y: 260 },
    data: { label: "Streams" },
    style: {
      background: "#111820",
      color: "#e7ecf2",
      border: "1px solid #202b36",
      borderRadius: "999px",
      padding: "8px 14px",
      fontSize: "12px",
    },
  },
  {
    id: "typescript",
    position: { x: 190, y: 350 },
    data: { label: "TypeScript" },
    style: {
      background: "#111820",
      color: "#e7ecf2",
      border: "1px solid #202b36",
      borderRadius: "999px",
      padding: "8px 14px",
      fontSize: "12px",
    },
  },
  {
    id: "docker",
    position: { x: 380, y: 350 },
    data: { label: "Docker" },
    style: {
      background: "#111820",
      color: "#e7ecf2",
      border: "1px solid #202b36",
      borderRadius: "999px",
      padding: "8px 14px",
      fontSize: "12px",
    },
  },
];

const edges: Edge[] = [
  {
    id: "nodejs-javascript",
    source: "nodejs",
    target: "javascript",
    type: "simplebezier",
    animated: false,
    style: {
      stroke: "#344454",
      strokeWidth: 1.5,
    },
  },
  {
    id: "nodejs-express",
    source: "nodejs",
    target: "express",
    type: "simplebezier",
    style: {
      stroke: "#344454",
      strokeWidth: 1.5,
    },
  },
  {
    id: "nodejs-event-loop",
    source: "nodejs",
    target: "event-loop",
    type: "simplebezier",
    style: {
      stroke: "#344454",
      strokeWidth: 1.5,
    },
  },
  {
    id: "nodejs-streams",
    source: "nodejs",
    target: "streams",
    type: "simplebezier",
    style: {
      stroke: "#344454",
      strokeWidth: 1.5,
    },
  },
  {
    id: "nodejs-typescript",
    source: "nodejs",
    target: "typescript",
    type: "simplebezier",
    style: {
      stroke: "#344454",
      strokeWidth: 1.5,
    },
  },
  {
    id: "nodejs-docker",
    source: "nodejs",
    target: "docker",
    type: "simplebezier",
    style: {
      stroke: "#344454",
      strokeWidth: 1.5,
    },
  },
];

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
              Your knowledge connections at a glance
            </p>
          </div>

          <Link
            href="/graph"
            className="text-primary hover:text-primary-hover text-xs font-medium transition-colors"
          >
            Open Graph View →
          </Link>
        </div>

        <div className="bg-background h-105 w-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            fitViewOptions={{
              padding: 0.25,
            }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            zoomOnScroll={false}
            panOnScroll={false}
            panOnDrag={false}
            zoomOnPinch={false}
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={24} size={1} color="#18222c" />
          </ReactFlow>
        </div>
      </section>
    </>
  );
}
