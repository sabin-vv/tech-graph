import { Plus } from "lucide-react";

const KnowledgeHeader = () => {
  return (
    <div className="mt-7 flex justify-between">
      <div>
        <h1 className="text-4xl">Explore Knowledge</h1>
        <span className="text-text-secondary">
          Discover, organize, and explore everything you know.
        </span>
      </div>
      <div>
        <button className="border-border bg-primary hover:bg-primary-hover flex items-center justify-center gap-2 rounded-lg border px-4 py-2 font-semibold hover:cursor-pointer">
          <Plus />
          Add Knowledge
        </button>
      </div>
    </div>
  );
};
export default KnowledgeHeader;
