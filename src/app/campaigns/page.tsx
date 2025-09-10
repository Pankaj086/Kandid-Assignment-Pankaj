'use client';

import { useState, useEffect } from 'react';
import { useCampaigns, useCampaignStatuses } from '@/hooks/useCampaigns';
import { useRouter } from 'next/navigation';
import { User, Clock, X, UserCheck, MessageSquare, Search } from 'lucide-react';
import { CampaignsTableSkeleton } from '@/components/campaigns/CampaignsTableSkeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusColors = {
  Active: 'bg-green-100 text-green-800',
  Draft: 'bg-gray-100 text-gray-800',
  Paused: 'bg-yellow-100 text-yellow-800',
  Completed: 'bg-blue-100 text-blue-800',
};

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const { data: campaigns, isLoading, error } = useCampaigns(debouncedSearchTerm, statusFilter);
  const { data: availableStatuses, isLoading: statusesLoading } = useCampaignStatuses();
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

  const sortedCampaigns = [...(campaigns || [])].sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a];
    const bValue = b[sortBy as keyof typeof b];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? -1 : 1;
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
    <div className="h-[calc(100vh-112px)] flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-gray-600">Manage your campaigns and track their performance</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <span>+</span> Create Campaign
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter Dropdown */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Campaigns</SelectItem>
              {availableStatuses?.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Content */}
      {isLoading || statusesLoading ? (
        <CampaignsTableSkeleton />
      ) : error ? (
        <div className="p-6 text-red-600">Error loading campaigns</div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <div className="bg-white shadow-sm border border-gray-200 m-6 rounded-lg overflow-hidden">
            {/* Fixed Header */}
            <div className="bg-gray-50 border-b border-gray-200">
              <table className="w-full table-fixed">
                <colgroup>
                  <col className="w-1/4" />
                  <col className="w-1/6" />
                  <col className="w-1/6" />
                  <col className="w-1/4" />
                  <col className="w-1/4" />
                </colgroup>
                <thead>
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
              </table>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-auto max-h-[calc(100vh-200px)] scrollbar-hide">
              <style jsx>{`
                .scrollbar-hide {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <table className="w-full table-fixed">
                <colgroup>
                  <col className="w-1/4" />
                  <col className="w-1/6" />
                  <col className="w-1/6" />
                  <col className="w-1/4" />
                  <col className="w-1/4" />
                </colgroup>
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

              {sortedCampaigns.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <div className="text-gray-500">No campaigns found</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

