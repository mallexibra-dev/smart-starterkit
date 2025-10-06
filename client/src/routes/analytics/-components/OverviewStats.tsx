import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsOverview } from 'shared/types';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package } from 'lucide-react';
import { formatRupiah } from '@/lib/currency';

interface OverviewStatsProps {
  data: AnalyticsOverview;
  className?: string;
}

export function OverviewStats({ data, className = '' }: OverviewStatsProps) {
  const stats = [
    {
      title: 'Total Revenue',
      value: data.totalRevenue,
      format: 'currency',
      change: data.growthRate,
      icon: DollarSign,
      color: 'green',
    },
    {
      title: 'Total Products',
      value: data.totalProducts,
      format: 'number',
      change: 8.2,
      icon: Package,
      color: 'blue',
    },
    {
      title: 'Total Transactions',
      value: data.totalTransactions,
      format: 'number',
      change: 12.5,
      icon: ShoppingCart,
      color: 'purple',
    },
    {
      title: 'Average Order Value',
      value: data.averageOrderValue,
      format: 'currency',
      change: -2.3,
      icon: TrendingUp,
      color: 'orange',
    },
  ];

  const formatValue = (value: number, format: string) => {
    if (format === 'currency') {
      return formatRupiah(value);
    }
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      green: {
        bg: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
        border: 'border-green-200 dark:border-green-700',
        title: 'text-green-700 dark:text-green-300',
        value: 'text-green-900 dark:text-green-100',
        change: 'text-green-600 dark:text-green-400',
        icon: 'text-green-600 dark:text-green-400',
      },
      blue: {
        bg: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
        border: 'border-blue-200 dark:border-blue-700',
        title: 'text-blue-700 dark:text-blue-300',
        value: 'text-blue-900 dark:text-blue-100',
        change: 'text-blue-600 dark:text-blue-400',
        icon: 'text-blue-600 dark:text-blue-400',
      },
      purple: {
        bg: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
        border: 'border-purple-200 dark:border-purple-700',
        title: 'text-purple-700 dark:text-purple-300',
        value: 'text-purple-900 dark:text-purple-100',
        change: 'text-purple-600 dark:text-purple-400',
        icon: 'text-purple-600 dark:text-purple-400',
      },
      orange: {
        bg: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20',
        border: 'border-orange-200 dark:border-orange-700',
        title: 'text-orange-700 dark:text-orange-300',
        value: 'text-orange-900 dark:text-orange-100',
        change: 'text-orange-600 dark:text-orange-400',
        icon: 'text-orange-600 dark:text-orange-400',
      },
    };

    return colors[color as keyof typeof colors] || colors.purple;
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => {
        const colors = getColorClasses(stat.color);
        const Icon = stat.icon;
        const isPositive = stat.change >= 0;

        return (
          <Card
            key={index}
            className={`bg-gradient-to-br ${colors.bg} ${colors.border} border shadow-sm hover:shadow-md transition-shadow duration-200`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${colors.title}`}>
                {stat.title}
              </CardTitle>
              <div className={`h-4 w-4 ${colors.icon}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${colors.value}`}>
                {formatValue(stat.value, stat.format)}
              </div>
              <div className={`flex items-center text-xs ${colors.change} mt-1`}>
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                <span>
                  {isPositive ? '+' : ''}{stat.change.toFixed(1)}% dari bulan lalu
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}