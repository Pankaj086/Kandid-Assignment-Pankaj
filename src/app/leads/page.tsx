"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { useLeads } from "@/hooks/useLeads";
import { useLeadSidebarStore } from "@/stores/leadSidebarStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LeadProfileSidebar from "@/components/leads/LeadProfileSidebar";
import LeadsTableSkeleton from "@/components/leads/LeadsTableSkeleton";
import { LeadStatusBadge, LeadActivityBars } from "@/components/leads/LeadStatusBadge";

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [campaignFilter, setCampaignFilter] = useState("");

  const { openSidebar } = useLeadSidebarStore();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useLeads({
    q: debouncedSearchQuery,
    status: statusFilter === "all" ? "" : statusFilter,
    campaignId: campaignFilter,
    limit: 25,
  });

  // Flatten all pages into a single array
  const leads = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  // Scroll detection for infinite loading
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

      // Trigger fetch when user scrolls to within 200px of bottom
      if (scrollHeight - scrollTop <= clientHeight + 200) {
        if (hasNextPage && !isFetching && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, hasNextPage, isFetching, isFetchingNextPage]
  );

  const getProfileInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleLeadClick = (leadId: number) => {
    openSidebar(leadId);
  };

  if (status === "pending") {
    return <LeadsTableSkeleton />;
  }

  if (status === "error") {
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
      {/* Search Bar and Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or campaign..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter Dropdown */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Leads</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="Responded">Responded</SelectItem>
              <SelectItem value="Converted">Converted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleLeadClick(lead.id)}
                  >
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
                      <div className="text-sm text-gray-900 truncate">
                        {lead.campaignName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <LeadActivityBars status={lead.status} />
                    </td>
                    <td className="px-6 py-4">
                      <LeadStatusBadge status={lead.status} />
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

      {/* Lead Profile Sidebar */}
      <LeadProfileSidebar />
    </div>
  );
}
