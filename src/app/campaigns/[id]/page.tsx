'use client';

import { useState, use } from 'react';
import { useCampaignDetail } from '@/hooks/useCampaigns';
import { CampaignHeader } from '@/components/campaigns/CampaignHeader';
import { CampaignTabs } from '@/components/campaigns/CampaignTabs';
import { OverviewTab } from '@/components/campaigns/OverviewTab';
import { LeadsTab } from '@/components/campaigns/LeadsTab';
import { SequenceTab } from '@/components/campaigns/SequenceTab';
import { SettingsTab } from '@/components/campaigns/SettingsTab';

interface CampaignPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function Campaign({ params }: CampaignPageProps) {
  const { id } = use(params);
  const campaignId = parseInt(id);
  const { data: campaign, isLoading, error } = useCampaignDetail(campaignId);
  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) return <div className="p-6">Loading campaign details...</div>;
  if (error) return <div className="p-6 text-red-600">Error loading campaign</div>;
  if (!campaign) return <div className="p-6">Campaign not found</div>;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab campaign={campaign} />;
      case 'leads':
        return <LeadsTab leads={campaign.leads} />;
      case 'sequence':
        return <SequenceTab />;
      case 'settings':
        return <SettingsTab campaign={campaign} />;
      default:
        return <OverviewTab campaign={campaign} />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <CampaignHeader campaign={campaign} />
      <CampaignTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {renderTabContent()}
    </div>
  );
}
