interface StatsCardProps {
  title: string;
  value: number;
  icon: string;
}

export function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}
