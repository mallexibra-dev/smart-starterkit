import { api } from "@/lib/axios";
import { AnalyticsData, DateRangeFilter } from "shared/types";

export const analyticsService = {
  async getAnalyticsData(dateRange: DateRangeFilter): Promise<AnalyticsData> {
    const params = new URLSearchParams();

    if (dateRange.startDate) {
      params.append('startDate', dateRange.startDate);
    }

    if (dateRange.endDate) {
      params.append('endDate', dateRange.endDate);
    }

    if (dateRange.preset) {
      params.append('preset', dateRange.preset);
    }

    const queryString = params.toString();
    const url = queryString ? `/analytics?${queryString}` : "/analytics";

    const { data } = await api.get<{
      success: boolean;
      message: string;
      data: AnalyticsData
    }>(url);

    return data.data;
  },

  async getOverviewStats(dateRange?: DateRangeFilter) {
    const params = new URLSearchParams();

    if (dateRange) {
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);
      if (dateRange.preset) params.append('preset', dateRange.preset);
    }

    const queryString = params.toString();
    const url = queryString ? `/analytics/overview?${queryString}` : "/analytics/overview";

    const { data } = await api.get(url);
    return data.data;
  },

  async getSalesData(dateRange?: DateRangeFilter) {
    const params = new URLSearchParams();

    if (dateRange) {
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);
      if (dateRange.preset) params.append('preset', dateRange.preset);
    }

    const queryString = params.toString();
    const url = queryString ? `/analytics/sales?${queryString}` : "/analytics/sales";

    const { data } = await api.get(url);
    return data.data;
  },

  async getTopProducts(dateRange?: DateRangeFilter, limit: number = 10) {
    const params = new URLSearchParams();

    if (dateRange) {
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);
      if (dateRange.preset) params.append('preset', dateRange.preset);
    }

    params.append('limit', limit.toString());

    const queryString = params.toString();
    const url = queryString ? `/analytics/top-products?${queryString}` : "/analytics/top-products";

    const { data } = await api.get(url);
    return data.data;
  },

  async getTransactionStatus(dateRange?: DateRangeFilter) {
    const params = new URLSearchParams();

    if (dateRange) {
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);
      if (dateRange.preset) params.append('preset', dateRange.preset);
    }

    const queryString = params.toString();
    const url = queryString ? `/analytics/transaction-status?${queryString}` : "/analytics/transaction-status";

    const { data } = await api.get(url);
    return data.data;
  },

  async getRecentTransactions(dateRange?: DateRangeFilter, limit: number = 20) {
    const params = new URLSearchParams();

    if (dateRange) {
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);
      if (dateRange.preset) params.append('preset', dateRange.preset);
    }

    params.append('limit', limit.toString());

    const queryString = params.toString();
    const url = queryString ? `/analytics/recent-transactions?${queryString}` : "/analytics/recent-transactions";

    const { data } = await api.get(url);
    return data.data;
  }
};