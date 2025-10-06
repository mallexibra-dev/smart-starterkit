import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Container } from '@/components/layout/Container';
import { analyticsService } from '@/services/analytics.service';
import { OverviewStats } from './-components/OverviewStats';
import { LineChart } from './-components/LineChart';
import { BarChart } from './-components/BarChart';
import { PieChart } from './-components/PieChart';
import { RecentTransactionsTable } from './-components/RecentTransactionsTable';
import { DateRangeFilter } from './-components/DateRangeFilter';
import { LoadingWrapper } from '@/components/blocks/LoadingWrapper';
import { AnalyticsData, DateRangeFilter as DateRangeFilterType } from 'shared/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const Route = createFileRoute('/analytics/')({
  component: Analytics,
});

function Analytics() {
  const [dateRange, setDateRange] = useState<DateRangeFilterType>({
    preset: 'last30days',
    startDate: '',
    endDate: '',
  });

  const { data: analyticsData, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: () => analyticsService.getAnalyticsData(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleDateRangeChange = (newDateRange: DateRangeFilterType) => {
    setDateRange(newDateRange);
  };

  const handleProductClick = (productData: any) => {
    console.log('Product clicked:', productData);
    // Navigate to product details or show product modal
  };

  if (error) {
    return (
      <Container>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor your business performance</p>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to fetch analytics data'}. Please try again later.
            </AlertDescription>
          </Alert>

          <div className="flex justify-center">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </Container>
    );
  }

  if (!analyticsData) {
    return (
      <Container>
        <LoadingWrapper isLoading={true} text="Loading analytics data..." />
      </Container>
    );
  }

  // Prepare data for charts
  const salesChartData = analyticsData.salesData.map(item => ({
    ...item,
    formattedRevenue: item.revenue / 1000000, // Convert to millions for better display
  }));

  const topProductsData = analyticsData.topProducts.map(product => ({
    name: product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name,
    sales: product.sales,
    revenue: product.revenue,
    growth: product.growth,
    category: product.category,
  }));

  const transactionStatusData = analyticsData.transactionStatus.map(status => ({
    status: status.status,
    count: status.count,
    percentage: status.percentage,
    amount: status.amount,
  }));

  return (
    <Container>
      <LoadingWrapper isLoading={isLoading} text="Loading analytics data...">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor your business performance</p>
            </div>
          </div>

          {/* Date Range Filter */}
          <DateRangeFilter onDateRangeChange={handleDateRangeChange} />

          {/* Overview Stats */}
          <OverviewStats data={analyticsData.overview} />

          {/* Charts Grid - Top Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Sales Revenue Chart */}
            <LineChart
              data={salesChartData}
              lines={[
                {
                  dataKey: 'formattedRevenue',
                  stroke: '#9333ea',
                  name: 'Revenue (Million IDR)',
                  strokeWidth: 2,
                  dot: false,
                },
              ]}
              title="Sales Revenue Trend"
              description="Daily revenue over the selected period"
              config={{ height: 350 }}
            />

            {/* Top Products Chart */}
            <BarChart
              data={topProductsData}
              bars={[
                {
                  dataKey: 'sales',
                  fill: '#9333ea',
                  name: 'Units Sold',
                },
              ]}
              title="Top Selling Products"
              description="Products with highest sales volume"
              config={{ height: 350 }}
              onBarClick={handleProductClick}
            />
          </div>

          {/* Charts Grid - Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transaction Status Pie Chart */}
            <PieChart
              data={transactionStatusData}
              dataKey="count"
              nameKey="status"
              title="Transaction Status"
              description="Distribution of transaction statuses"
              config={{ height: 300 }}
              showPercentage={true}
            />

            {/* Recent Transactions Table */}
            <div className="lg:col-span-2">
              <RecentTransactionsTable data={analyticsData.recentTransactions} />
            </div>
          </div>

          {/* Additional Revenue by Product Chart */}
          <BarChart
            data={topProductsData}
            bars={[
              {
                dataKey: 'revenue',
                fill: '#a855f7',
                name: 'Revenue (IDR)',
              },
            ]}
            title="Revenue by Product"
            description="Products generating highest revenue"
            config={{ height: 350 }}
            onBarClick={handleProductClick}
          />
        </div>
      </LoadingWrapper>
    </Container>
  );
}

export default Analytics;