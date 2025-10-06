import { db } from '../../utils/db'
import { AnalyticsData, DateRangeFilter } from '../../../shared/src/types'

export interface AnalyticsDateRange {
  startDate?: string
  endDate?: string
  preset?: string
}

export class AnalyticsService {
  private getDateRangeFromFilter(filter: AnalyticsDateRange): { startDate: string; endDate: string } {
    const now = new Date()
    let startDate: Date
    let endDate: Date = now

    if (filter.preset) {
      switch (filter.preset) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'yesterday':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'last7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'last30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case 'last90days':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          break
        case 'thisMonth':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case 'lastMonth':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
          endDate = new Date(now.getFullYear(), now.getMonth(), 0)
          break
        case 'thisYear':
          startDate = new Date(now.getFullYear(), 0, 1)
          break
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      }
    } else if (filter.startDate && filter.endDate) {
      startDate = new Date(filter.startDate)
      endDate = new Date(filter.endDate)
    } else {
      // Default to last 30 days
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }
  }

  async getAnalyticsData(filter: AnalyticsDateRange): Promise<AnalyticsData> {
    const { startDate, endDate } = this.getDateRangeFromFilter(filter)

    const [overview, salesData, topProducts, transactionStatus, recentTransactions] = await Promise.all([
      this.getOverviewStats(startDate, endDate),
      this.getSalesData(startDate, endDate),
      this.getTopProducts(startDate, endDate),
      this.getTransactionStatus(startDate, endDate),
      this.getRecentTransactions(startDate, endDate)
    ])

    return {
      overview,
      salesData,
      topProducts,
      transactionStatus,
      recentTransactions
    }
  }

  private async getOverviewStats(startDate: string, endDate: string) {
    try {
      // Get total revenue from transactions
      const [revenueResult] = await db.execute(
        `SELECT
          COALESCE(SUM(amount), 0) as totalRevenue,
          COUNT(*) as totalTransactions
        FROM transactions
        WHERE status = 'completed'
        AND DATE(created_at) BETWEEN ? AND ?`,
        [startDate, endDate]
      )

      // Get total products
      const [productsResult] = await db.execute(
        'SELECT COUNT(*) as totalProducts FROM products WHERE deleted_at IS NULL'
      )

      // Get unique customers
      const [customersResult] = await db.execute(
        `SELECT COUNT(DISTINCT customer_name) as totalCustomers
        FROM transactions
        WHERE status = 'completed'
        AND DATE(created_at) BETWEEN ? AND ?`,
        [startDate, endDate]
      )

      const revenue = revenueResult as any[]
      const products = productsResult as any[]
      const customers = customersResult as any[]

      const totalRevenue = revenue[0]?.totalRevenue || 0
      const totalTransactions = revenue[0]?.totalTransactions || 0
      const totalProducts = products[0]?.totalProducts || 0
      const totalCustomers = customers[0]?.totalCustomers || 0

      const averageOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0
      const conversionRate = 85.5 // Mock data - would calculate from actual conversion metrics
      const growthRate = 12.3 // Mock data - would compare with previous period

      return {
        totalRevenue,
        totalProducts,
        totalTransactions,
        averageOrderValue,
        conversionRate,
        growthRate
      }
    } catch (error) {
      console.error('Error getting overview stats:', error)
      return {
        totalRevenue: 0,
        totalProducts: 0,
        totalTransactions: 0,
        averageOrderValue: 0,
        conversionRate: 0,
        growthRate: 0
      }
    }
  }

  private async getSalesData(startDate: string, endDate: string) {
    try {
      const [rows] = await db.execute(
        `SELECT
          DATE(created_at) as date,
          COALESCE(SUM(amount), 0) as revenue,
          COUNT(*) as orders,
          COUNT(DISTINCT customer_name) as customers
        FROM transactions
        WHERE status = 'completed'
        AND DATE(created_at) BETWEEN ? AND ?
        GROUP BY DATE(created_at)
        ORDER BY date ASC`,
        [startDate, endDate]
      )

      return rows as any[]
    } catch (error) {
      console.error('Error getting sales data:', error)
      return []
    }
  }

  private async getTopProducts(startDate: string, endDate: string, limit: number = 10) {
    try {
      const [rows] = await db.execute(
        `SELECT
          p.id,
          p.name,
          p.category,
          COALESCE(SUM(t.quantity), 0) as sales,
          COALESCE(SUM(t.amount), 0) as revenue,
          CASE
            WHEN LAG(SUM(t.amount), 1) OVER (ORDER BY SUM(t.amount) DESC) IS NULL THEN 0
            ELSE ROUND((SUM(t.amount) - LAG(SUM(t.amount), 1) OVER (ORDER BY SUM(t.amount) DESC)) /
                     LAG(SUM(t.amount), 1) OVER (ORDER BY SUM(t.amount) DESC) * 100, 2)
          END as growth
        FROM products p
        LEFT JOIN transactions t ON p.name = t.product_name
        AND t.status = 'completed'
        AND DATE(t.created_at) BETWEEN ? AND ?
        WHERE p.deleted_at IS NULL
        GROUP BY p.id, p.name, p.category
        ORDER BY revenue DESC
        LIMIT ?`,
        [startDate, endDate, limit]
      )

      return rows as any[]
    } catch (error) {
      console.error('Error getting top products:', error)
      return []
    }
  }

  private async getTransactionStatus(startDate: string, endDate: string) {
    try {
      const [rows] = await db.execute(
        `SELECT
          status,
          COUNT(*) as count,
          ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM transactions WHERE DATE(created_at) BETWEEN ? AND ?), 2) as percentage,
          COALESCE(SUM(amount), 0) as amount
        FROM transactions
        WHERE DATE(created_at) BETWEEN ? AND ?
        GROUP BY status
        ORDER BY count DESC`,
        [startDate, endDate, startDate, endDate]
      )

      return rows as any[]
    } catch (error) {
      console.error('Error getting transaction status:', error)
      return []
    }
  }

  private async getRecentTransactions(startDate: string, endDate: string, limit: number = 20) {
    try {
      const [rows] = await db.execute(
        `SELECT
          id,
          customer_name,
          product_name,
          amount,
          status,
          created_at as date,
          payment_method
        FROM transactions
        WHERE DATE(created_at) BETWEEN ? AND ?
        ORDER BY created_at DESC
        LIMIT ?`,
        [startDate, endDate, limit]
      )

      return rows as any[]
    } catch (error) {
      console.error('Error getting recent transactions:', error)
      return []
    }
  }
}