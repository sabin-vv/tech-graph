import { ChevronDown } from "lucide-react";

const Knowledgefilters = () => {
  return (
    <div className="mt-7 flex gap-2">
      <span className="border-border flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
        Type <ChevronDown size={16} />
      </span>
      <span className="border-border flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
        Tag <ChevronDown size={16} />
      </span>
      <span className="border-border flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
        Tachnology <ChevronDown size={16} />
      </span>
    </div>
  );
};
export default Knowledgefilters;
