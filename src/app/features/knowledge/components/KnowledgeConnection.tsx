import { Waypoints } from "lucide-react"

const KnowledgeConnection = () => {
  return (
    <div className="border-border mt-7 mb-1 rounded-lg border">
      <div className="flex justify-between p-4">
        <h1 className="flex items-center gap-2 text-xl">
          <Waypoints size={20} color="#2698ff" />
          Graph Connection
        </h1>
        <span>Add connection</span>
      </div>
      <ol className="bg-surface px-4">
        <li className="border-border flex justify-between border-b-2 py-2">
          <h1 className="text-lg">Javascript</h1>
          <span className="text-text-secondary border-border rounded-md border p-2 text-xs uppercase">
            PreRequisite
          </span>
        </li>
        <li className="border-border flex justify-between border-b-2 py-2">
          <h1 className="text-lg">Express</h1>
          <span className="text-text-secondary border-border rounded-md border p-2 text-xs uppercase">
            Used BY
          </span>
        </li>
        <li className="border-border flex justify-between border-b-2 py-2">
          <h3 className="text-lg">Event Loop</h3>
          <span className="text-text-secondary border-border rounded-md border p-2 text-xs uppercase">
            Part Of
          </span>
        </li>
        <li className="border-border flex justify-between py-2">
          <h3 className="text-lg">Libuv</h3>
          <span className="text-text-secondary border-border rounded-md border p-2 text-xs uppercase">
            USES
          </span>
        </li>
      </ol>
    </div>
  )
}
export default KnowledgeConnection
