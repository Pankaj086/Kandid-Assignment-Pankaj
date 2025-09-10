import { useQuery } from '@tanstack/react-query';

interface Campaign {
  id: number;
  name: string;
  status: string;
  createdAt: string;
  totalLeads: number;
  successfulLeads: number;
  responseRate: number;
}

interface CampaignDetail extends Campaign {
  leads: Array<{
    id: number;
    name: string;
    email: string;
    company: string;
    status: string;
    lastContactDate: string | null;
  }>;
}

const fetchCampaigns = async (searchTerm?: string, statusFilter?: string): Promise<Campaign[]> => {
  const url = new URL('/api/campaigns', window.location.origin);
  if (searchTerm) {
    url.searchParams.set('search', searchTerm);
  }
  if (statusFilter && statusFilter !== 'All') {
    url.searchParams.set('status', statusFilter);
  }
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch campaigns');
  }
  
  return response.json();
};

const fetchCampaignById = async (campaignId: number): Promise<CampaignDetail> => {
  const response = await fetch(`/api/campaigns/${campaignId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch campaign details');
  }
  
  return response.json();
};

const fetchCampaignStatuses = async (): Promise<string[]> => {
  const response = await fetch('/api/campaigns/statuses');
  
  if (!response.ok) {
    throw new Error('Failed to fetch campaign statuses');
  }
  
  return response.json();
};

export const useCampaigns = (searchTerm?: string, statusFilter?: string) => {
  return useQuery({
    queryKey: ['campaigns', searchTerm, statusFilter],
    queryFn: () => fetchCampaigns(searchTerm, statusFilter),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCampaignDetail = (campaignId: number | null) => {
  return useQuery({
    queryKey: ['campaign-detail', campaignId],
    queryFn: () => fetchCampaignById(campaignId!),
    enabled: !!campaignId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCampaignStatuses = () => {
  return useQuery({
    queryKey: ['campaign-statuses'],
    queryFn: fetchCampaignStatuses,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};
