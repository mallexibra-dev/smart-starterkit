export interface AnalyticsOverview {
  totalRevenue: number;
  totalProducts: number;
  totalTransactions: number;
  averageOrderValue: number;
  conversionRate: number;
  growthRate: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface TopProduct {
  id: number;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  growth: number;
}

export interface TransactionStatus {
  status: 'completed' | 'pending' | 'cancelled' | 'refunded';
  count: number;
  percentage: number;
  amount: number;
}

export interface RecentTransaction {
  id: number;
  customerName: string;
  productName: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled' | 'refunded';
  date: string;
  paymentMethod: string;
}

export interface DateRangeFilter {
  startDate: string;
  endDate: string;
  preset?: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'last90days' | 'thisMonth' | 'lastMonth' | 'thisYear';
}

export interface AnalyticsData {
  overview: AnalyticsOverview;
  salesData: SalesData[];
  topProducts: TopProduct[];
  transactionStatus: TransactionStatus[];
  recentTransactions: RecentTransaction[];
}

export interface ChartConfig {
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  height?: number;
  colors?: string[];
}