interface Campaign {
  name: string;
  status: string;
}

interface SettingsTabProps {
  campaign: Campaign;
}

export function SettingsTab({ campaign }: SettingsTabProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Campaign Settings</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Campaign Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            defaultValue={campaign.name}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Campaign Status</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue={campaign.status}>
            <option value="Draft">Draft</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="flex gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Save Changes
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
            Delete Campaign
          </button>
        </div>
      </div>
    </div>
  );
}
