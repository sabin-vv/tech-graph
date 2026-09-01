"use Client";

import { ListSortDescending } from "lucide-react";

const KnowledgeSearch = () => {
  return (
    <div className="mt-7 flex gap-5">
      <input
        className="border-border w-4/5 rounded-md border px-4 py-2"
        type="text"
        placeholder="Search technologies, concepts, libraries..."
      />
      <div className="border-border flex items-center gap-2 rounded-lg border px-4 py-2">
        <ListSortDescending size={18} />
        <span className="block text-sm">Recently updated</span>
      </div>
    </div>
  );
};
export default KnowledgeSearch;
