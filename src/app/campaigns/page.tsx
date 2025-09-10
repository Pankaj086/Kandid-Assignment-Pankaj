'use client';

import { useState, useEffect } from 'react';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useRouter } from 'next/navigation';
import { User, Clock, X, UserCheck, MessageSquare } from 'lucide-react';
import { CampaignsTableSkeleton } from '@/components/campaigns/CampaignsTableSkeleton';

const statusColors = {
  Active: 'bg-green-100 text-green-800',
  Draft: 'bg-gray-100 text-gray-800',
  Paused: 'bg-yellow-100 text-yellow-800',
  Completed: 'bg-blue-100 text-blue-800',
};

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const { data: campaigns, isLoading, error } = useCampaigns(debouncedSearchTerm);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const router = useRouter();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (isLoading) {
    return <CampaignsTableSkeleton />;
  }

  if (error) return <div className="p-6 text-red-600">Error loading campaigns</div>;

  const filteredCampaigns = campaigns?.filter(campaign => 
    statusFilter === 'All' || campaign.status === statusFilter
  ) || [];

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a];
    const bValue = b[sortBy as keyof typeof b];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600">Manage your campaigns and track their performance</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <span>+</span> Create Campaign
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex gap-2">
          {['All Campaigns', 'Active', 'Inactive'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter === 'All Campaigns' ? 'All' : filter)}
              className={`px-4 py-2 rounded-lg ${
                statusFilter === (filter === 'All Campaigns' ? 'All' : filter)
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                Campaign Name
                {sortBy === 'name' && (
                  <span className="ml-2">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('totalLeads')}
              >
                Total Leads
                {sortBy === 'totalLeads' && (
                  <span className="ml-2">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Request Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Connection Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCampaigns.map((campaign) => (
              <tr 
                key={campaign.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/campaigns/${campaign.id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    statusColors[campaign.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900 mr-2">👥 {campaign.totalLeads}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">0</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-600 font-medium">{campaign.totalLeads}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <X className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600 font-medium">0</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <UserCheck className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-purple-600 font-medium">0</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-600 font-medium">0</span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

