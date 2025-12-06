"use client"

import { Pie, PieChart, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"
import { GRADE_SCALE } from "@/types/grade"

interface GradeDistributionData {
  name: string
  value: number
  coefficient: number
}

interface GradeDistributionChartProps {
  data: GradeDistributionData[]
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

const chartConfig = {
  value: {
    label: "Adet",
  },
} satisfies ChartConfig

export function GradeDistributionChart({ data }: GradeDistributionChartProps) {
  // Get color for each grade
  const getColor = (index: number) => {
    return COLORS[index % COLORS.length]
  }

  // Custom label function
  const renderLabel = (entry: GradeDistributionData) => {
    return `${entry.name}: ${entry.value}`
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(index)} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as GradeDistributionData
                const gradeInfo = GRADE_SCALE.find((g) => g.letter === data.name)
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-medium">{data.name}</span>
                        <span className="text-sm font-bold">{data.value} ders</span>
                      </div>
                      {gradeInfo && (
                        <div className="text-xs text-muted-foreground">
                          Katsayı: {gradeInfo.coefficient.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend
            formatter={(value, entry) => {
              if (entry?.payload) {
                const payload = entry.payload as GradeDistributionData
                return `${value} (${payload.value})`
              }
              return value
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

