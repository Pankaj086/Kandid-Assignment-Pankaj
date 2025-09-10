interface Lead {
  id: number;
  name: string;
  email: string;
  company: string;
  status: string;
  lastContactDate?: string | null;
}

interface LeadsTabProps {
  leads: Lead[];
}

export function LeadsTab({ leads }: LeadsTabProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Campaign Leads</h3>
      </div>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Contact</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {lead.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {lead.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {lead.company}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  {lead.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {lead.lastContactDate ? new Date(lead.lastContactDate).toLocaleDateString() : 'Never'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
