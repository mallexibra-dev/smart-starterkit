"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const chartData = [
  { date: "2024-01-01", desktop: 222, mobile: 150 },
  { date: "2024-01-02", desktop: 97, mobile: 180 },
  { date: "2024-01-03", desktop: 167, mobile: 120 },
  { date: "2024-01-04", desktop: 242, mobile: 260 },
  { date: "2024-01-05", desktop: 373, mobile: 290 },
  { date: "2024-01-06", desktop: 301, mobile: 340 },
  { date: "2024-01-07", desktop: 245, mobile: 280 },
  { date: "2024-01-08", desktop: 409, mobile: 320 },
  { date: "2024-01-09", desktop: 303, mobile: 310 },
  { date: "2024-01-10", desktop: 425, mobile: 380 },
  { date: "2024-01-11", desktop: 329, mobile: 360 },
  { date: "2024-01-12", desktop: 467, mobile: 420 },
  { date: "2024-01-13", desktop: 512, mobile: 460 },
  { date: "2024-01-14", desktop: 634, mobile: 540 },
  { date: "2024-01-15", desktop: 557, mobile: 520 },
  { date: "2024-01-16", desktop: 715, mobile: 640 },
  { date: "2024-01-17", desktop: 789, mobile: 720 },
  { date: "2024-01-18", desktop: 834, mobile: 780 },
  { date: "2024-01-19", desktop: 901, mobile: 840 },
  { date: "2024-01-20", desktop: 928, mobile: 890 },
  { date: "2024-01-21", desktop: 1024, mobile: 960 },
  { date: "2024-01-22", desktop: 1156, mobile: 1080 },
  { date: "2024-01-23", desktop: 1245, mobile: 1180 },
  { date: "2024-01-24", desktop: 1324, mobile: 1280 },
  { date: "2024-01-25", desktop: 1456, mobile: 1380 },
  { date: "2024-01-26", desktop: 1567, mobile: 1480 },
  { date: "2024-01-27", desktop: 1678, mobile: 1580 },
  { date: "2024-01-28", desktop: 1789, mobile: 1680 },
  { date: "2024-01-29", desktop: 1890, mobile: 1780 },
  { date: "2024-01-30", desktop: 2001, mobile: 1880 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
}

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const endDate = new Date("2024-01-30")
    const startDate = new Date(endDate)

    switch (timeRange) {
      case "7d":
        startDate.setDate(endDate.getDate() - 7)
        break
      case "30d":
        startDate.setDate(endDate.getDate() - 30)
        break
      case "90d":
        startDate.setDate(endDate.getDate() - 90)
        break
      default:
        return true
    }

    return date >= startDate && date <= endDate
  })

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last {timeRange === "7d" ? "7 days" : timeRange === "30d" ? "30 days" : "3 months"}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={5}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="monotone"
              fill="var(--color-mobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="monotone"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}