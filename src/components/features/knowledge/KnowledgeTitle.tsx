import { Pencil } from "lucide-react"

const KnowledgeTitle = () => {
  return (
    <div className="mt-7 flex justify-between">
      <div>
        <h1 className="text-4xl font-semibold">Node.Js</h1>
        <div className="mt-2 flex gap-2">
          <span className="border-border rounded-md border px-3 py-0.5">
            Bakend
          </span>
          <span className="border-border rounded-md border px-3 py-0.5">
            Javascript
          </span>
        </div>
      </div>
      <div>
        <button className="border-border bg-surface hover:bg-surface-elevated flex items-center gap-2 rounded-lg border px-4 py-2 hover:cursor-pointer">
          <Pencil size={16} /> Edit
        </button>
      </div>
    </div>
  )
}
export default KnowledgeTitle
