"use client"

import * as React from "react"
import {
  Activity,
  CreditCard,
  DollarSign,
  Package,
  Users,
  TrendingDown,
  TrendingUp,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface SectionCardsProps {
  className?: string
}

export function SectionCards({ className }: SectionCardsProps) {
  return (
    <div className={`grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 ${className}`}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+2350</div>
          <p className="text-xs text-muted-foreground">
            +180.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sales</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+12,234</div>
          <p className="text-xs text-muted-foreground">
            +19% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Now</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+573</div>
          <p className="text-xs text-muted-foreground">
            +201 since last hour
          </p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">72%</span>
            </div>
            <Progress value={72} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Conversion</span>
              <span className="text-sm text-muted-foreground">45%</span>
            </div>
            <Progress value={45} />
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your most recent transactions and updates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                New sale completed
              </p>
              <p className="text-sm text-muted-foreground">
                +$1,234.00 from John Doe
              </p>
            </div>
            <div className="text-sm text-muted-foreground">2 min ago</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                Subscription cancelled
              </p>
              <p className="text-sm text-muted-foreground">
                -$49.00 monthly revenue lost
              </p>
            </div>
            <div className="text-sm text-muted-foreground">1 hour ago</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                New product added
              </p>
              <p className="text-sm text-muted-foreground">
                Premium package now available
              </p>
            </div>
            <div className="text-sm text-muted-foreground">3 hours ago</div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Showing 3 of 12 activities
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}