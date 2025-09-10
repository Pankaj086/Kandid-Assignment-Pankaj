import { StatsCard } from './StatsCard';

interface Campaign {
  leads: Array<{ status: string }>;
  createdAt: string;
  status: string;
}

interface OverviewTabProps {
  campaign: Campaign;
}

export function OverviewTab({ campaign }: OverviewTabProps) {
  // Calculate metrics based on lead statuses
  const totalLeads = campaign.leads.length;
  const requestSent = campaign.leads.filter(lead => ['Contacted', 'Responded', 'Converted'].includes(lead.status)).length;
  const requestAccepted = campaign.leads.filter(lead => ['Responded', 'Converted'].includes(lead.status)).length;
  const requestReplied = campaign.leads.filter(lead => lead.status === 'Converted').length;
  
  // Calculate percentages
  const leadsContactedPercentage = totalLeads > 0 ? (requestSent / totalLeads) * 100 : 0;
  const acceptanceRate = requestSent > 0 ? (requestAccepted / requestSent) * 100 : 0;
  const replyRate = requestSent > 0 ? (requestReplied / requestSent) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="Total Leads" value={totalLeads} icon="👥" />
        <StatsCard title="Request Sent" value={requestSent} icon="📧" />
        <StatsCard title="Request Accepted" value={requestAccepted} icon="💬" />
        <StatsCard title="Request Replied" value={requestReplied} icon="🎯" />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Progress */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Campaign Progress</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Leads Contacted</span>
                <span className="text-sm font-medium text-gray-900">{leadsContactedPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${leadsContactedPercentage}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Acceptance Rate</span>
                <span className="text-sm font-medium text-gray-900">{acceptanceRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${acceptanceRate}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Reply Rate</span>
                <span className="text-sm font-medium text-gray-900">{replyRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${replyRate}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Campaign Details</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                <span className="text-lg">📅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Start Date:</p>
                <p className="font-medium text-gray-900">{new Date(campaign.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status:</p>
                <p className="font-medium text-gray-900">{campaign.status}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                <span className="text-lg">🎯</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Conversion Rate:</p>
                <p className="font-medium text-gray-900">{replyRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
