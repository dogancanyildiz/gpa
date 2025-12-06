"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import { roundUp, roundUpToInteger } from "@/lib/utils"

interface CoursePerformanceData {
  name: string
  gpa: number
  score: number
  credits: number
}

interface CoursePerformanceChartProps {
  data: CoursePerformanceData[]
}

const chartConfig = {
  gpa: {
    label: "GPA",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function CoursePerformanceChart({ data }: CoursePerformanceChartProps) {
  // Limit to top 10 courses for better visualization
  const displayData = data.slice(0, 10).map((item) => ({
    ...item,
    name: item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name,
  }))

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={[0, 4]}
            tick={{ fontSize: 12 }}
            label={{ value: "GPA", angle: -90, position: "insideLeft" }}
          />
          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as CoursePerformanceData
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-medium">{data.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <div>GPA: <strong>{roundUp(data.gpa)}</strong></div>
                        <div>Not: <strong>{roundUpToInteger(data.score)}</strong></div>
                        <div>AKTS: <strong>{data.credits}</strong></div>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="gpa" fill="var(--color-gpa)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

