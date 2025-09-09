"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Clock, Send, MessageSquare, CheckCircle } from "lucide-react";
import { useLeads } from "@/hooks/useLeads";

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

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("");

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useLeads({
    q: searchQuery,
    status: statusFilter,
    campaignId: campaignFilter,
    limit: 25,
  });

  // Flatten all pages into a single array
  const leads = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? [];
  }, [data]);

  // Scroll detection for infinite loading
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // Trigger fetch when user scrolls to within 200px of bottom
    if (scrollHeight - scrollTop <= clientHeight + 200) {
      if (hasNextPage && !isFetching && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  }, [fetchNextPage, hasNextPage, isFetching, isFetchingNextPage]);

  const getProfileInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Pending': { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-700', 
        icon: <Clock className="w-3 h-3" />
      },
      'Contacted': { 
        bg: 'bg-purple-100', 
        text: 'text-purple-700', 
        icon: <Send className="w-3 h-3" />
      },
      'Responded': { 
        bg: 'bg-gray-100', 
        text: 'text-gray-700', 
        icon: <MessageSquare className="w-3 h-3" />
      },
      'Converted': { 
        bg: 'bg-green-100', 
        text: 'text-green-700', 
        icon: <CheckCircle className="w-3 h-3" />
      },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                { bg: 'bg-gray-100', text: 'text-gray-700', icon: <Clock className="w-3 h-3" /> };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${config.bg} ${config.text}`}>
        <span className="mr-1">{config.icon}</span>
        {status}
      </span>
    );
  };

  const getActivityBars = (status: string) => {
    const activityConfig = {
      'Pending': {
        bars: [
          { color: 'bg-gray-300', height: 'h-6' },
          { color: 'bg-gray-300', height: 'h-6' },
          { color: 'bg-gray-300', height: 'h-6' },
          { color: 'bg-gray-300', height: 'h-6' }
        ]
      },
      'Contacted': {
        bars: [
          { color: 'bg-yellow-600', height: 'h-6' },
          { color: 'bg-yellow-600', height: 'h-6' },
          { color: 'bg-gray-300', height: 'h-6' },
          { color: 'bg-gray-300', height: 'h-6' }
        ]
      },
      'Responded': {
        bars: [
          { color: 'bg-purple-600', height: 'h-6' },
          { color: 'bg-purple-600', height: 'h-6' },
          { color: 'bg-purple-600', height: 'h-6' },
          { color: 'bg-gray-300', height: 'h-6' }
        ]
      },
      'Converted': {
        bars: [
          { color: 'bg-blue-700', height: 'h-6' },
          { color: 'bg-blue-700', height: 'h-6' },
          { color: 'bg-blue-700', height: 'h-6' },
          { color: 'bg-blue-700', height: 'h-6' }
        ]
      }
    };

    const config = activityConfig[status as keyof typeof activityConfig] || activityConfig['Pending'];
    
    return (
      <div className="flex items-end space-x-1">
        {config.bars.map((bar, index) => (
          <div 
            key={index} 
            className={`w-1 ${bar.height} ${bar.color} rounded`}
          ></div>
        ))}
      </div>
    );
  };

  if (status === 'pending') {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          Error loading leads: {error?.message}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-112px)] flex flex-col bg-white">
      {/* Scrollable Table Container */}
      <div className="flex-1 overflow-hidden">
        <div className="bg-white shadow-sm border border-gray-200 m-6 rounded-lg overflow-hidden">
          {/* Fixed Header */}
          <div className="bg-gray-50 border-b border-gray-200">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-2/5" />
                <col className="w-1/4" />
                <col className="w-1/6" />
                <col className="w-1/4" />
              </colgroup>
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign Name
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="pl-14 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
            </table>
          </div>
          
          {/* Scrollable Body */}
          <div 
            className="overflow-auto max-h-[calc(100vh-200px)] scrollbar-hide"
            onScroll={handleScroll}
          >
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
                <col className="w-2/5" />
                <col className="w-1/4" />
                <col className="w-1/6" />
                <col className="w-1/4" />
              </colgroup>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                            {getProfileInitials(lead.name)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {lead.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {lead.company}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 truncate">{lead.campaignName}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getActivityBars(lead.status)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(lead.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Loading indicator for infinite scroll */}
            {isFetchingNextPage && (
              <div className="text-center py-4">
                <div className="text-gray-500">Loading more leads...</div>
              </div>
            )}
            
            {/* No more data indicator */}
            {!hasNextPage && leads.length > 0 && (
              <div className="text-center py-4">
                <div className="text-gray-500">No more leads to load</div>
              </div>
            )}
            
            {leads.length === 0 && !isFetching && (
              <div className="text-center py-12">
                <div className="text-gray-500">No leads found</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
