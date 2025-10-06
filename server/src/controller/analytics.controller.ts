import type { Context } from 'hono'
import { AnalyticsService } from '../service/analytics.service'

export class AnalyticsController {
  private analyticsService: AnalyticsService

  constructor() {
    this.analyticsService = new AnalyticsService()
  }

  async getAnalyticsData(c: Context) {
    try {
      const queryParams = c.req.query()
      const filter: any = {}

      if (queryParams.startDate) filter.startDate = queryParams.startDate
      if (queryParams.endDate) filter.endDate = queryParams.endDate
      if (queryParams.preset) filter.preset = queryParams.preset

      const analyticsData = await this.analyticsService.getAnalyticsData(filter)

      return c.json({
        success: true,
        message: 'Analytics data retrieved successfully',
        data: analyticsData,
      }, 200)
    } catch (error) {
      console.error('Error getting analytics data:', error)

      return c.json({
        success: false,
        message: 'Failed to retrieve analytics data',
      }, 500)
    }
  }

  async getOverviewStats(c: Context) {
    try {
      const queryParams = c.req.query()
      const filter: any = {}

      if (queryParams.startDate) filter.startDate = queryParams.startDate
      if (queryParams.endDate) filter.endDate = queryParams.endDate
      if (queryParams.preset) filter.preset = queryParams.preset

      const { startDate, endDate } = this.analyticsService['getDateRangeFromFilter'](filter)
      const overview = await this.analyticsService['getOverviewStats'](startDate, endDate)

      return c.json({
        success: true,
        message: 'Overview stats retrieved successfully',
        data: overview,
      }, 200)
    } catch (error) {
      console.error('Error getting overview stats:', error)

      return c.json({
        success: false,
        message: 'Failed to retrieve overview stats',
      }, 500)
    }
  }

  async getSalesData(c: Context) {
    try {
      const queryParams = c.req.query()
      const filter: any = {}

      if (queryParams.startDate) filter.startDate = queryParams.startDate
      if (queryParams.endDate) filter.endDate = queryParams.endDate
      if (queryParams.preset) filter.preset = queryParams.preset

      const { startDate, endDate } = this.analyticsService['getDateRangeFromFilter'](filter)
      const salesData = await this.analyticsService['getSalesData'](startDate, endDate)

      return c.json({
        success: true,
        message: 'Sales data retrieved successfully',
        data: salesData,
      }, 200)
    } catch (error) {
      console.error('Error getting sales data:', error)

      return c.json({
        success: false,
        message: 'Failed to retrieve sales data',
      }, 500)
    }
  }

  async getTopProducts(c: Context) {
    try {
      const queryParams = c.req.query()
      const filter: any = {}
      const limit = parseInt(queryParams.limit || '10')

      if (queryParams.startDate) filter.startDate = queryParams.startDate
      if (queryParams.endDate) filter.endDate = queryParams.endDate
      if (queryParams.preset) filter.preset = queryParams.preset

      const { startDate, endDate } = this.analyticsService['getDateRangeFromFilter'](filter)
      const topProducts = await this.analyticsService['getTopProducts'](startDate, endDate, limit)

      return c.json({
        success: true,
        message: 'Top products retrieved successfully',
        data: topProducts,
      }, 200)
    } catch (error) {
      console.error('Error getting top products:', error)

      return c.json({
        success: false,
        message: 'Failed to retrieve top products',
      }, 500)
    }
  }

  async getTransactionStatus(c: Context) {
    try {
      const queryParams = c.req.query()
      const filter: any = {}

      if (queryParams.startDate) filter.startDate = queryParams.startDate
      if (queryParams.endDate) filter.endDate = queryParams.endDate
      if (queryParams.preset) filter.preset = queryParams.preset

      const { startDate, endDate } = this.analyticsService['getDateRangeFromFilter'](filter)
      const transactionStatus = await this.analyticsService['getTransactionStatus'](startDate, endDate)

      return c.json({
        success: true,
        message: 'Transaction status retrieved successfully',
        data: transactionStatus,
      }, 200)
    } catch (error) {
      console.error('Error getting transaction status:', error)

      return c.json({
        success: false,
        message: 'Failed to retrieve transaction status',
      }, 500)
    }
  }

  async getRecentTransactions(c: Context) {
    try {
      const queryParams = c.req.query()
      const filter: any = {}
      const limit = parseInt(queryParams.limit || '20')

      if (queryParams.startDate) filter.startDate = queryParams.startDate
      if (queryParams.endDate) filter.endDate = queryParams.endDate
      if (queryParams.preset) filter.preset = queryParams.preset

      const { startDate, endDate } = this.analyticsService['getDateRangeFromFilter'](filter)
      const recentTransactions = await this.analyticsService['getRecentTransactions'](startDate, endDate, limit)

      return c.json({
        success: true,
        message: 'Recent transactions retrieved successfully',
        data: recentTransactions,
      }, 200)
    } catch (error) {
      console.error('Error getting recent transactions:', error)

      return c.json({
        success: false,
        message: 'Failed to retrieve recent transactions',
      }, 500)
    }
  }
}