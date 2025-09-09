import { useQuery } from '@tanstack/react-query';

interface Interaction {
  id: number;
  type: string;
  timestamp: string;
  notes: string | null;
}

interface LeadProfile {
  id: number;
  name: string;
  email: string;
  company: string;
  status: string;
  lastContactDate: string | null;
  campaignName: string;
  interactions: Interaction[];
}

const fetchLeadProfile = async (leadId: number): Promise<LeadProfile> => {
  const response = await fetch(`/api/leads/${leadId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch lead profile');
  }
  
  return response.json();
};

export const useLeadProfile = (leadId: number | null) => {
  return useQuery({
    queryKey: ['lead-profile', leadId],
    queryFn: () => fetchLeadProfile(leadId!),
    enabled: !!leadId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
