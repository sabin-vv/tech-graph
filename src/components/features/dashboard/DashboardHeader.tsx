import { Network, Plus } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="mt-7 flex items-center justify-between">
      <div>
        <h1 className="text-4xl">Good Morning, Sabin</h1>
        <span className="text-text-secondary">
          Ready to expand your knowledge network today?
        </span>
      </div>
      <div className="flex h-fit gap-3">
        <button className="border-border flex items-center justify-center gap-2 rounded-lg border px-4 py-2 hover:cursor-pointer">
          <Network size={18} />
          Explore Graph
        </button>
        <button className="border-border bg-primary hover:bg-primary-hover flex items-center justify-center gap-2 rounded-lg border px-4 py-2 font-semibold hover:cursor-pointer">
          <Plus />
          Add Knowledge
        </button>
      </div>
    </div>
  );
};
export default DashboardHeader;
