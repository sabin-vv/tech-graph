"use client"

import { useCallback, useEffect, useRef } from "react"

interface TechNode {
  id: string
  label: string
  top: string
  left: string
  dotColor: string
  isCore?: boolean
}

const NODES: TechNode[] = [
  {
    id: "core",
    label: "TechGraph",
    top: "50%",
    left: "50%",
    dotColor: "",
    isCore: true,
  },
  { id: "n1", label: "React", top: "10%", left: "8%", dotColor: "#61dafb" },
  { id: "n2", label: "Node.js", top: "6%", left: "50%", dotColor: "#68a063" },
  {
    id: "n3",
    label: "TypeScript",
    top: "22%",
    left: "78%",
    dotColor: "#f7df1e",
  },
  { id: "n4", label: "Docker", top: "48%", left: "5%", dotColor: "#2496ed" },
  { id: "n6", label: "GraphQL", top: "36%", left: "72%", dotColor: "#e535ab" },
  { id: "n7", label: "Postgres", top: "70%", left: "12%", dotColor: "#336791" },
  { id: "n8", label: "Redis", top: "78%", left: "58%", dotColor: "#dc382d" },
  { id: "n9", label: "K8s", top: "62%", left: "85%", dotColor: "#326ce5" },
  { id: "n10", label: "Python", top: "90%", left: "38%", dotColor: "#8b7bf6" },
]

const CORE_ID = "core"
const PERIPHERAL_IDS = NODES.filter((n) => !n.isCore).map((n) => n.id)

export function TechGraphStage({
  width = 640,
  height = 420,
  className = "",
}: {
  width?: number
  height?: number
  className?: string
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const drawEdges = useCallback(() => {
    if (!stageRef.current || !svgRef.current) return

    const stage = stageRef.current
    const svg = svgRef.current

    const coreEl = stage.querySelector(
      `[data-node-id="${CORE_ID}"]`,
    ) as HTMLElement
    if (!coreEl) return

    const getPos = (el: HTMLElement) => {
      const s = stage.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      return {
        x: ((r.left + r.width / 2 - s.left) / s.width) * width,
        y: ((r.top + r.height / 2 - s.top) / s.height) * height,
      }
    }

    const corePos = getPos(coreEl)

    ;[...svg.querySelectorAll("path")].forEach((p) => p.remove())

    PERIPHERAL_IDS.forEach((id, i) => {
      const el = stage.querySelector(`[data-node-id="${id}"]`) as HTMLElement
      if (!el) return

      const p = getPos(el)
      const mx = (corePos.x + p.x) / 2 + (i % 2 === 0 ? 24 : -24)
      const my = (corePos.y + p.y) / 2 + (i % 3 === 0 ? -18 : 18)
      const d = `M ${corePos.x} ${corePos.y} Q ${mx} ${my} ${p.x} ${p.y}`

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      )
      path.setAttribute("d", d)
      path.setAttribute("class", "techgraph-stage-edge")
      svg.appendChild(path)
    })
  }, [width, height])

  useEffect(() => {
    drawEdges()
    window.addEventListener("resize", drawEdges)
    return () => window.removeEventListener("resize", drawEdges)
  }, [drawEdges])

  return (
    <div
      ref={stageRef}
      id="stage"
      className={`relative w-full overflow-hidden techgraph-stage-bg rounded-[18px] border border-(--violet)/35 ${className}`}
      style={{ maxWidth: width, aspectRatio: `${width} / ${height}` }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b7bf6" />
            <stop offset="100%" stopColor="#2fe0c4" />
          </linearGradient>
        </defs>
      </svg>

      {NODES.map((node) => (
        <div
          key={node.id}
          data-node-id={node.id}
          className={`techgraph-stage-node ${node.isCore ? "core" : ""}`}
          style={
            {
              top: node.isCore
                ? node.top
                : `clamp(18px, ${node.top}, calc(100% - 18px))`,
              left: node.isCore
                ? node.left
                : `clamp(52px, calc(${node.left} + 4%), calc(100% - 52px))`,
            } as React.CSSProperties
          }
        >
          {node.dotColor && (
            <span className="dot" style={{ background: node.dotColor }} />
          )}
          {node.label}
        </div>
      ))}
    </div>
  )
}
