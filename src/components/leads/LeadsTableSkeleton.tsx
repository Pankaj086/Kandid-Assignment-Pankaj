import { Skeleton } from "@/components/ui/skeleton";

export default function LeadsTableSkeleton() {
  return (
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

        {/* Skeleton Body */}
        <div className="overflow-auto max-h-[calc(100vh-200px)]">
          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-2/5" />
              <col className="w-1/4" />
              <col className="w-1/6" />
              <col className="w-1/4" />
            </colgroup>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(6)].map((_, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="ml-4 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-28" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-end space-x-1">
                      <Skeleton className="w-1 h-6 rounded" />
                      <Skeleton className="w-1 h-6 rounded" />
                      <Skeleton className="w-1 h-6 rounded" />
                      <Skeleton className="w-1 h-6 rounded" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
