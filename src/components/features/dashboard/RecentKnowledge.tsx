const RecentKnowledge = () => {
  return (
    <div className="border-border mt-4 rounded-lg border">
      <div className="border-border bg-surface px-5 py-4">
        <h2 className="font-medium">Recently Added Knowledge</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="border-border w-full">
          <thead>
            <tr className="border-border border-opacity-40 border-b">
              <th className="text-text-secondary px-3 py-2 text-xs font-medium tracking-wider uppercase">
                KNOWLEDGE
              </th>
              <th className="text-text-secondary px-3 py-2 text-xs font-medium tracking-wider uppercase">
                TYPE
              </th>
              <th className="text-text-secondary px-3 py-2 text-xs font-medium tracking-wider uppercase">
                TAGS
              </th>
              <th className="text-text-secondary px-3 py-2 text-xs font-medium tracking-wider uppercase">
                CONNECTIONS
              </th>
              <th className="text-text-secondary px-3 py-2 text-xs font-medium tracking-wider uppercase">
                UPDATED
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-border border-opacity-10 hover:bg-surface/50 border-b text-center">
              <td className="px-3 py-2">Event Loop Phases</td>
              <td className="px-3 py-2">Core Concept</td>
              <td className="px-3 py-2">Node.js</td>
              <td className="px-3 py-2">4</td>
              <td className="px-3 py-2">Today, 10:42 AM</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default RecentKnowledge;
