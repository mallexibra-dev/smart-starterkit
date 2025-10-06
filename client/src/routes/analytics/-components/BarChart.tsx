import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig } from 'shared/types';

interface BarChartProps {
  data: any[];
  bars: Array<{
    dataKey: string;
    fill: string;
    name: string;
  }>;
  title: string;
  description?: string;
  config?: ChartConfig;
  className?: string;
  onBarClick?: (data: any) => void;
}

const PURPLE_COLORS = [
  '#9333ea', // purple-600
  '#a855f7', // purple-500
  '#c084fc', // purple-400
  '#d8b4fe', // purple-300
  '#e9d5ff', // purple-200
];

export function BarChart({
  data,
  bars,
  title,
  description,
  config = {},
  className = '',
  onBarClick,
}: BarChartProps) {
  const {
    showGrid = true,
    showLegend = true,
    showTooltip = true,
    showXAxis = true,
    showYAxis = true,
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
    return `${value > 0 ? '+' : ''}${value}%`;
  };

  const handleBarClick = (data: any) => {
    if (onBarClick) {
      onBarClick(data);
    }
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
          <RechartsBarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onClick={handleBarClick}
          >
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
            )}
            {showXAxis && (
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
            )}
            {showYAxis && (
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={formatNumber}
              />
            )}
            {showTooltip && (
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name.toLowerCase().includes('revenue') || name.toLowerCase().includes('amount')) {
                    return [formatCurrency(value), name];
                  }
                  if (name.toLowerCase().includes('growth')) {
                    return [formatPercentage(value), name];
                  }
                  return [formatNumber(value), name];
                }}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#fff',
                }}
                itemStyle={{ color: '#fff' }}
              />
            )}
            {showLegend && (
              <Legend
                verticalAlign="top"
                height={36}
                iconType="rect"
                iconSize={8}
              />
            )}
            {bars.map((bar) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                fill={bar.fill}
                name={bar.name}
                radius={[4, 4, 0, 0]}
                cursor={onBarClick ? 'pointer' : 'default'}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PURPLE_COLORS[index % PURPLE_COLORS.length]}
                  />
                ))}
              </Bar>
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}