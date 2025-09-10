export function SequenceTab() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Sequence Settings</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Connection Request</h4>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg"
            rows={4}
            placeholder="Hi [First Name], I'd love to connect with you on LinkedIn..."
            defaultValue="Hi [First Name], I'd love to connect with you on LinkedIn and learn more about your work at [Company]."
          />
        </div>
        <div>
          <h4 className="font-medium mb-2">Follow-up Message</h4>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg"
            rows={4}
            placeholder="Thanks for connecting! I noticed..."
            defaultValue="Thanks for connecting! I noticed you work in [Industry] and thought you might be interested in..."
          />
        </div>
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Delay (hours)</label>
            <input type="number" className="px-3 py-2 border border-gray-300 rounded-lg" defaultValue="24" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max connections per day</label>
            <input type="number" className="px-3 py-2 border border-gray-300 rounded-lg" defaultValue="10" />
          </div>
        </div>
      </div>
    </div>
  );
}
