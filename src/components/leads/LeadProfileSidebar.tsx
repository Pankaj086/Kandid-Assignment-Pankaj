"use client";

import { useEffect } from 'react';
import { X, CheckCircle, Settings, Mail, Building, Calendar, Send, MessageSquare, Clock } from 'lucide-react';
import { useLeadSidebarStore } from '@/stores/leadSidebarStore';
import { useLeadProfile } from '@/hooks/useLeadProfile';
import { Skeleton } from '@/components/ui/skeleton';

export default function LeadProfileSidebar() {
  const { isOpen, selectedLeadId, closeSidebar } = useLeadSidebarStore();
  const { data: leadProfile, isLoading, error } = useLeadProfile(selectedLeadId);

  // Handle ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeSidebar]);

  const getProfileInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'N/A';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Pending': { 
        bg: 'bg-purple-50', 
        text: 'text-purple-700', 
        border: 'border-purple-200',
        label: 'Pending Approval'
      },
      'Contacted': { 
        bg: 'bg-blue-50', 
        text: 'text-blue-700', 
        border: 'border-blue-200',
        label: 'Contacted'
      },
      'Responded': { 
        bg: 'bg-green-50', 
        text: 'text-green-700', 
        border: 'border-green-200',
        label: 'Responded'
      },
      'Converted': { 
        bg: 'bg-green-50', 
        text: 'text-green-700', 
        border: 'border-green-200',
        label: 'Converted'
      },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', label: status };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}>
        {config.label}
      </span>
    );
  };

  const getStatusProgression = (status: string) => {
    const stages = ['Pending', 'Contacted', 'Responded', 'Converted'];
    const currentIndex = stages.indexOf(status);
    
    return (
      <div className="flex items-center justify-between mb-4">
        {stages.map((stage, index) => (
          <div key={stage} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              index <= currentIndex 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {index + 1}
            </div>
            {index < stages.length - 1 && (
              <div className={`w-8 h-0.5 mx-1 ${
                index < currentIndex ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const getInteractionIcon = (type: string) => {
    const iconMap = {
      'Invitation Request': <Send className="w-4 h-4" />,
      'Connection Status': <Settings className="w-4 h-4" />,
      'Connection Acceptance Message': <CheckCircle className="w-4 h-4" />,
      'Follow-up 1': <MessageSquare className="w-4 h-4" />,
      'Email Sent': <Mail className="w-4 h-4" />,
      'Reply': <MessageSquare className="w-4 h-4" />,
      'Call': <Settings className="w-4 h-4" />,
    };
    
    return iconMap[type as keyof typeof iconMap] || <Clock className="w-4 h-4" />;
  };

  const getInteractionColor = (type: string) => {
    const colorMap = {
      'Invitation Request': 'text-blue-600',
      'Connection Status': 'text-gray-600', 
      'Connection Acceptance Message': 'text-blue-600',
      'Follow-up 1': 'text-blue-600',
      'Email Sent': 'text-blue-600',
      'Reply': 'text-green-600',
      'Call': 'text-purple-600',
    };
    
    return colorMap[type as keyof typeof colorMap] || 'text-gray-600';
  };

  const renderInteractionTimeline = () => {
    if (!leadProfile?.interactions || leadProfile.interactions.length === 0) {
      return (
        <div className="text-center py-6 text-gray-500">
          No interactions recorded yet
        </div>
      );
    }

    return (
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {leadProfile.interactions.map((interaction) => (
          <div key={interaction.id} className="relative flex items-start mb-6 last:mb-0">
            {/* Timeline dot */}
            <div className={`relative z-10 w-8 h-8 rounded-full bg-white border-2 border-blue-400 flex items-center justify-center ${getInteractionColor(interaction.type)}`}>
              {getInteractionIcon(interaction.type)}
            </div>
            
            {/* Content */}
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-blue-700">{interaction.type}</h5>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  {interaction.type.includes('Reply') || interaction.type.includes('Message') ? 'View Reply' : 'See More'}
                </button>
              </div>
              {interaction.notes && (
                <p className="text-sm text-gray-600 mt-1">
                  {interaction.notes.length > 50 ? `${interaction.notes.substring(0, 50)}...` : interaction.notes}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {new Date(interaction.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-600 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      />
      
      {/* Sidebar with smooth animation - matching main sidebar pattern */}
      <div className={`fixed right-0 top-0 h-full bg-white shadow-2xl z-50 border-l transition-all duration-300 overflow-hidden flex flex-col ${
        isOpen ? 'w-[400px]' : 'w-0'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Lead Profile</h2>
          <button
            onClick={closeSidebar}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-6" style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {isLoading ? (
            <div className="p-6 space-y-6">
              {/* Profile Header Skeleton */}
              <div className="text-center">
                <Skeleton className="h-16 w-16 rounded-full mx-auto mb-3" />
                <Skeleton className="h-6 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto mb-4" />
                <Skeleton className="h-8 w-28 mx-auto" />
              </div>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">
              Error loading lead profile
            </div>
          ) : leadProfile ? (
            <div className="space-y-0">
              {/* Profile Header */}
              <div className="text-center p-6 pb-4">
                <div className="relative inline-block mb-3">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-medium mx-auto">
                    {getProfileInitials(leadProfile.name)}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {leadProfile.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3">Regional Head</p>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-900">{leadProfile.company}</span>
                </div>
                
                <div className="flex justify-center">
                  {getStatusBadge(leadProfile.status)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-4">
                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Contact
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    Update Status
                  </button>
                </div>
              </div>

              {/* Contact Details */}
              <div className="border-t border-gray-100">
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-900">{leadProfile.email}</p>
                        <p className="text-xs text-gray-500">Email</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-900">{leadProfile.company}</p>
                        <p className="text-xs text-gray-500">Company</p>
                      </div>
                    </div>
                    {leadProfile.lastContactDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-900">
                            {new Date(leadProfile.lastContactDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">Last Contact</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Campaign Information */}
              <div className="border-t border-gray-100">
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Campaign Information</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">{leadProfile.campaignName}</span>
                    </div>
                    <p className="text-xs text-gray-600">Associated campaign for this lead</p>
                  </div>
                </div>
              </div>

              {/* Lead Status Progression */}
              <div className="border-t border-gray-100">
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Lead Progression</h4>
                  {getStatusProgression(leadProfile.status)}
                  <div className="text-xs text-gray-500 text-center">
                    Current Status: {leadProfile.status}
                  </div>
                </div>
              </div>

              {/* Interaction Timeline */}
              <div className="border-t border-gray-100">
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Interaction History</h4>
                  {renderInteractionTimeline()}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
