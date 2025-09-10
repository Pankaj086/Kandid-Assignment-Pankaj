interface CampaignHeaderProps {
  campaign: {
    status: string;
  };
}

export function CampaignHeader({ campaign }: CampaignHeaderProps) {
  const statusColor = campaign.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';

  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Campaign Details</h1>
        <p className="text-gray-600">Manage and track your campaign performance</p>
      </div>
      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusColor}`}>
        {campaign.status}
      </span>
    </div>
  );
}
