import { useInfiniteQuery } from '@tanstack/react-query';

interface Lead {
  id: number;
  name: string;
  email: string;
  company: string;
  status: string;
  lastContactDate: string | null;
  campaignId: number;
  campaignName: string;
  createdAt: string;
  updatedAt: string;
}

interface LeadsResponse {
  success: boolean;
  data: Lead[];
  nextCursor: number | null;
  hasNextPage: boolean;
  count: number;
}

interface UseLeadsParams {
  q?: string;
  status?: string;
  campaignId?: string;
  limit?: number;
}

const fetchLeads = async ({ pageParam, queryKey }: { pageParam: number | null; queryKey: (string | UseLeadsParams)[] }): Promise<LeadsResponse> => {
  const [, params] = queryKey;
  const { q, status, campaignId, limit } = params as UseLeadsParams;
  
  const searchParams = new URLSearchParams();
  if (q) searchParams.set('q', q);
  if (status) searchParams.set('status', status);
  if (campaignId) searchParams.set('campaignId', campaignId);
  if (limit) searchParams.set('limit', limit.toString());
  if (pageParam) searchParams.set('cursor', pageParam.toString());

  const response = await fetch(`/api/leads?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch leads');
  }
  
  return response.json();
};

export const useLeads = (params: UseLeadsParams = {}) => {
  return useInfiniteQuery({
    queryKey: ['leads', params],
    queryFn: fetchLeads,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.nextCursor : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
