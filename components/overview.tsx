"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useLogStore } from "@/lib/log-store"

export function Overview() {
  const { logs } = useLogStore()
  const [chartData, setChartData] = useState<{ name: string; total: number }[]>([])

  useEffect(() => {
    if (logs.length === 0) {
      // Default data when no logs are available
      setChartData([
        { name: "Jan", total: 1420 },
        { name: "Feb", total: 1620 },
        { name: "Mar", total: 1780 },
        { name: "Apr", total: 2090 },
        { name: "May", total: 2390 },
        { name: "Jun", total: 2590 },
        { name: "Jul", total: 2853 },
      ])
      return
    }

    // Process logs to generate chart data
    const visitsByMonth: Record<string, number> = {}
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Initialize all months with 0
    months.forEach((month) => {
      visitsByMonth[month] = 0
    })

    // Count visits by month
    logs.forEach((log) => {
      try {
        // Try to parse the timestamp
        let date: Date

        // Handle different date formats
        if (log.timestamp.includes("/")) {
          // Format like "01/Feb/2025:00:17:10"
          const parts = log.timestamp.split("/")
          const day = parts[0]
          const month = months.findIndex((m) => parts[1].startsWith(m)) + 1
          const yearTime = parts[2].split(":")
          const year = yearTime[0]
          date = new Date(`${year}-${month}-${day}`)
        } else if (log.timestamp.includes("-")) {
          // ISO format
          date = new Date(log.timestamp)
        } else {
          // Try to parse as is
          date = new Date(log.timestamp)
        }

        if (!isNaN(date.getTime())) {
          const month = months[date.getMonth()]
          visitsByMonth[month] = (visitsByMonth[month] || 0) + 1
        }
      } catch (error) {
        // Skip entries with invalid dates
        console.error("Invalid date format:", log.timestamp)
      }
    })

    // Convert to chart data format
    const data = Object.entries(visitsByMonth)
      .filter(([_, count]) => count > 0) // Only include months with visits
      .map(([month, count]) => ({
        name: month,
        total: count,
      }))
      .sort((a, b) => months.indexOf(a.name) - months.indexOf(b.name))

    setChartData(data.length > 0 ? data : [{ name: "No Data", total: 0 }])
  }, [logs])

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

