import { Clock, Send, MessageSquare, CheckCircle } from "lucide-react";

interface LeadStatusBadgeProps {
  status: string;
}

interface LeadActivityBarsProps {
  status: string;
}

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const statusConfig = {
    Pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      icon: <Clock className="w-3 h-3" />,
    },
    Contacted: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      icon: <Send className="w-3 h-3" />,
    },
    Responded: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      icon: <MessageSquare className="w-3 h-3" />,
    },
    Converted: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: <CheckCircle className="w-3 h-3" />,
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] ||
    {
      bg: "bg-gray-100",
      text: "text-gray-700",
      icon: <Clock className="w-3 h-3" />,
    };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${config.bg} ${config.text}`}
    >
      <span className="mr-1">{config.icon}</span>
      {status}
    </span>
  );
}

export function LeadActivityBars({ status }: LeadActivityBarsProps) {
  const activityConfig = {
    Pending: {
      bars: [
        { color: "bg-gray-300", height: "h-6" },
        { color: "bg-gray-300", height: "h-6" },
        { color: "bg-gray-300", height: "h-6" },
        { color: "bg-gray-300", height: "h-6" },
      ],
    },
    Contacted: {
      bars: [
        { color: "bg-yellow-600", height: "h-6" },
        { color: "bg-yellow-600", height: "h-6" },
        { color: "bg-gray-300", height: "h-6" },
        { color: "bg-gray-300", height: "h-6" },
      ],
    },
    Responded: {
      bars: [
        { color: "bg-purple-600", height: "h-6" },
        { color: "bg-purple-600", height: "h-6" },
        { color: "bg-purple-600", height: "h-6" },
        { color: "bg-gray-300", height: "h-6" },
      ],
    },
    Converted: {
      bars: [
        { color: "bg-blue-700", height: "h-6" },
        { color: "bg-blue-700", height: "h-6" },
        { color: "bg-blue-700", height: "h-6" },
        { color: "bg-blue-700", height: "h-6" },
      ],
    },
  };

  const config =
    activityConfig[status as keyof typeof activityConfig] ||
    activityConfig["Pending"];

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
}
