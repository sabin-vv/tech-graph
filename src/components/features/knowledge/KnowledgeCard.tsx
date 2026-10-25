import { Workflow } from "lucide-react";

const KnowledgeCard = () => {
  return (
    <div className="border-border bg-background-secondary rounded-lg border p-4">
      <div className="flex justify-between">
        <span className="border-border text- rounded-md border bg-indigo-400/10 px-3 py-1 text-sm text-indigo-400">
          TECH
        </span>
        <div className="flex items-center gap-2">
          <Workflow size={14} />
          <span>12</span>
        </div>
      </div>
      <div className="mt-2">
        <h1 className="text-lg font-semibold">Node</h1>
        <span className="text-text-secondary text-justify text-sm">
          Asynchronous event-driven JavaScript runtime designed to build backend
        </span>
        <div className="mt-2 flex gap-2">
          <span className="border-border rounded-md border px-2 py-1">
            Backend
          </span>
          <span className="border-border rounded-md border px-2 py-1">
            Javascript
          </span>
        </div>
      </div>
    </div>
  );
};
export default KnowledgeCard;
