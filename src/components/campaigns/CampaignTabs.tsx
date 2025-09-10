interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface CampaignTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function CampaignTabs({ activeTab, onTabChange }: CampaignTabsProps) {
  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'leads', label: 'Leads', icon: '👥' },
    { id: 'sequence', label: 'Sequence', icon: '📝' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
