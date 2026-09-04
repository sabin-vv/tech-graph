const KnowledgeForm = () => {
  return (
    <form className="space-y-4">
      <div className="border-border bg-surface rounded-lg border p-4">
        <div>
          <h1 className="border-border border-b-2 py-4 text-2xl">Basic Information</h1>
        </div>
        <span className="text-text-secondary mt-7">Knowledge Name</span>
        <input
          className="border-border bg-background-secondary mt-1 rounded-md border px-2 py-3"
          type="text"
          placeholder="e.g., React, Event Sourcing, Kubernetes"
        />
        <div className="mt-4 flex gap-3">
          <span>Type</span>
          <span>Category</span>
        </div>
      </div>
      <div className="border-border bg-surface rounded-lg border p-4">
        <h1 className="border-border border-b-2 py-4 text-2xl">Description</h1>
        <textarea
          className="border-border bg-background-secondary mt-4 rounded-md border px-4 py-2"
          placeholder="Briefly describe this knowledge node..."
        ></textarea>
      </div>
      <div className="border-border bg-surface rounded-lg border p-4">
        <h1 className="border-border border-b-2 py-4 text-2xl">Connections</h1>
        <span className="text-text-secondary mt-7">Related Knowledge</span>
        <div className="mt-4 space-y-2">
          <div className="flex gap-2">
            <select className="border-border bg-background-secondary rounded-md border px-2 py-3">
              <option value="uses">uses</option>
              <option value="related_to">related_to</option>
            </select>
            <input
              className="border-border bg-background-secondary flex-1 rounded-md border px-2 py-3"
              type="text"
              placeholder="e.g., JavaScript"
            />
          </div>
          <div className="flex gap-2">
            <select className="border-border bg-background-secondary rounded-md border px-2 py-3">
              <option value="uses">uses</option>
              <option value="related_to">related_to</option>
            </select>
            <input
              className="border-border bg-background-secondary flex-1 rounded-md border px-2 py-3"
              type="text"
              placeholder="e.g., Node.js"
            />
          </div>
        </div>
      </div>
      <div className="border-border bg-surface rounded-lg border p-4">
        <h1 className="border-border border-b-2 py-4 text-2xl">Tags</h1>
        <input
          className="border-border mt-7 rounded-md border px-2 py-3"
          type="text"
          placeholder="Add tag..."
        />
      </div>
      <div className="mt-7 flex flex-row-reverse gap-3">
        <button className="border-border bg-primary hover:bg-primary-hover flex items-center justify-center rounded-lg border px-4 py-2 font-semibold hover:cursor-pointer">
          Create Knowledge
        </button>
        <button className="border-border hover:bg-surface-hover rounded-lg border px-4 py-2 hover:cursor-pointer">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default KnowledgeForm;