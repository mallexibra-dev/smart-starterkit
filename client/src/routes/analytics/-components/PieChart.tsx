import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig } from 'shared/types';

interface PieChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  title: string;
  description?: string;
  config?: ChartConfig;
  className?: string;
  showPercentage?: boolean;
}

const STATUS_COLORS = {
  completed: '#10b981', // green-500
  pending: '#f59e0b',   // amber-500
  cancelled: '#ef4444', // red-500
  refunded: '#8b5cf6', // violet-500
};

const STATUS_LABELS = {
  completed: 'Completed',
  pending: 'Pending',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export function PieChart({
  data,
  dataKey,
  nameKey,
  title,
  description,
  config = {},
  className = '',
  showPercentage = true,
}: PieChartProps) {
  const {
    showLegend = true,
    showTooltip = true,
    height = 400,
  } = config;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getFillColor = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#6b7280';
  };

  const getStatusLabel = (status: string) => {
    return STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">
            {getStatusLabel(data[nameKey])}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Count: {formatNumber(data[dataKey])}
          </p>
          {data.percentage && showPercentage && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Percentage: {formatPercentage(data.percentage)}
            </p>
          )}
          {data.amount && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Amount: {formatCurrency(data.amount)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {getStatusLabel(entry.value)}
            </span>
            {entry.payload.percentage && showPercentage && (
              <span className="text-xs text-gray-500 dark:text-gray-500">
                ({formatPercentage(entry.payload.percentage)})
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey={dataKey}
              nameKey={nameKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getFillColor(entry[nameKey])} />
              ))}
            </Pie>
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend content={<CustomLegend />} />}
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}