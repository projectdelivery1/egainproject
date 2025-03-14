"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLogStore } from "@/lib/log-store"

export function EnhancedVisitorTraffic() {
  const [timeScale, setTimeScale] = useState("daily")
  const [timeZone, setTimeZone] = useState("local")
  const [dailyData, setDailyData] = useState<any[]>([])
  const [hourlyData, setHourlyData] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const { logs } = useLogStore()

  // Create chart data according to time scale
  useEffect(() => {
    if (logs.length === 0) {
      // Sample data for demo
      setDailyData([
        { date: "8 Mar", visitors: 124, newCompanies: 4 },
        { date: "9 Mar", visitors: 115, newCompanies: 2 },
        { date: "10 Mar", visitors: 186, newCompanies: 6 },
        { date: "11 Mar", visitors: 195, newCompanies: 7 },
        { date: "12 Mar", visitors: 220, newCompanies: 8 },
        { date: "13 Mar", visitors: 173, newCompanies: 5 },
        { date: "14 Mar", visitors: 88, newCompanies: 3 },
      ])

      setHourlyData([
        { hour: "00:00", visitors: 24 },
        { hour: "02:00", visitors: 18 },
        { hour: "04:00", visitors: 12 },
        { hour: "06:00", visitors: 15 },
        { hour: "08:00", visitors: 45 },
        { hour: "10:00", visitors: 83 },
        { hour: "12:00", visitors: 97 },
        { hour: "14:00", visitors: 102 },
        { hour: "16:00", visitors: 78 },
        { hour: "18:00", visitors: 56 },
        { hour: "20:00", visitors: 45 },
        { hour: "22:00", visitors: 35 },
      ])

      setMonthlyData([
        { month: "Oct", visitors: 2245, newCompanies: 85 },
        { month: "Nov", visitors: 2190, newCompanies: 78 },
        { month: "Dec", visitors: 1845, newCompanies: 62 },
        { month: "Jan", visitors: 2354, newCompanies: 92 },
        { month: "Feb", visitors: 2580, newCompanies: 105 },
        { month: "Mar", visitors: 2853, newCompanies: 112 },
      ])

      return
    }

    // Create time-based data from log data
    try {
      // Hourly data
      const hourCounts: Record<string, number> = {}
      // Daily data
      const dateCounts: Record<string, { visitors: number; companies: Set<string> }> = {}
      // Monthly data
      const monthCounts: Record<string, { visitors: number; companies: Set<string> }> = {}

      // Time zone adjustment
      const getAdjustedDate = (timestamp: string) => {
        try {
          const date = new Date(timestamp)
          if (isNaN(date.getTime())) {
            // Alternative format attempt (01/Feb/2025:00:17:10)
            if (timestamp.includes("/")) {
              const parts = timestamp.split("/")
              const day = parts[0]
              const month =
                ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(parts[1]) +
                1
              const yearTime = parts[2].split(":")
              const year = yearTime[0]
              const hours = yearTime[1]
              const minutes = yearTime[2]
              const seconds = yearTime[3]
              return new Date(
                `${year}-${month.toString().padStart(2, "0")}-${day.padStart(2, "0")}T${hours}:${minutes}:${seconds}`,
              )
            }
            return null
          }

          // Time zone adjustment
          if (timeZone === "utc") {
            // Convert to UTC
            return new Date(
              date.getUTCFullYear(),
              date.getUTCMonth(),
              date.getUTCDate(),
              date.getUTCHours(),
              date.getUTCMinutes(),
              date.getUTCSeconds(),
            )
          } else if (timeZone === "est") {
            // EST (UTC-5)
            return new Date(date.getTime() + (date.getTimezoneOffset() + 300) * 60000)
          } else if (timeZone === "pst") {
            // PST (UTC-8)
            return new Date(date.getTime() + (date.getTimezoneOffset() + 480) * 60000)
          } else if (timeZone === "cet") {
            // CET (UTC+1)
            return new Date(date.getTime() + (date.getTimezoneOffset() - 60) * 60000)
          }

          return date
        } catch (e) {
          console.error("Date parsing error:", e)
          return null
        }
      }

      // Process each log
      logs.forEach((log) => {
        const date = getAdjustedDate(log.timestamp)
        if (!date) return

        // Update hourly data
        const hourKey = `${date.getHours().toString().padStart(2, "0")}:00`
        hourCounts[hourKey] = (hourCounts[hourKey] || 0) + 1

        // Update daily data
        const dateKey = date.toLocaleDateString()
        if (!dateCounts[dateKey]) {
          dateCounts[dateKey] = { visitors: 0, companies: new Set() }
        }
        dateCounts[dateKey].visitors++
        if (log.company) {
          dateCounts[dateKey].companies.add(log.company)
        }

        // Update monthly data
        const monthKey = date.toLocaleDateString(undefined, { month: "short" })
        if (!monthCounts[monthKey]) {
          monthCounts[monthKey] = { visitors: 0, companies: new Set() }
        }
        monthCounts[monthKey].visitors++
        if (log.company) {
          monthCounts[monthKey].companies.add(log.company)
        }
      })

      // Convert to chart data format
      const hourlyChartData = Object.entries(hourCounts)
        .map(([hour, count]) => ({ hour, visitors: count }))
        .sort((a, b) => {
          return parseInt(a.hour) - parseInt(b.hour)
        })

      const dailyChartData = Object.entries(dateCounts)
        .map(([date, data]) => ({
          date: new Date(date).toLocaleDateString(undefined, { day: "2-digit", month: "short" }),
          visitors: data.visitors,
          newCompanies: data.companies.size,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-7) // Last 7 days

      const monthlyChartData = Object.entries(monthCounts)
        .map(([month, data]) => ({
          month,
          visitors: data.visitors,
          newCompanies: data.companies.size,
        }))
        .sort((a, b) => {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          return months.indexOf(a.month) - months.indexOf(b.month)
        })
        .slice(-6) // Last 6 months

      setHourlyData(hourlyChartData)
      setDailyData(dailyChartData)
      setMonthlyData(monthlyChartData)
    } catch (error) {
      console.error("Error processing visitor traffic data:", error)
    }
  }, [logs, timeZone])

  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Visitor Traffic</CardTitle>
            <CardDescription>Visitor traffic analysis over time</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Select value={timeScale} onValueChange={setTimeScale}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Scale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeZone} onValueChange={setTimeZone}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Local Time</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="est">EST (UTC-5)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="visitors" className="space-y-4">
          <TabsList>
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
          </TabsList>
          <TabsContent value="visitors" className="space-y-4">
            <div className="h-[300px]">
              {timeScale === "hourly" && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [`${value} visitors`, "Visitors"]}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Bar dataKey="visitors" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              {timeScale === "daily" && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `${value} ${name === "visitors" ? "visitors" : "new companies"}`,
                        name === "visitors" ? "Visitors" : "New Companies",
                      ]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="visitors" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
              {timeScale === "monthly" && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `${value} ${name === "visitors" ? "visitors" : "new companies"}`,
                        name === "visitors" ? "Visitors" : "New Companies",
                      ]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="visitors" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </TabsContent>
          <TabsContent value="companies" className="space-y-4">
            <div className="h-[300px]">
              {timeScale === "daily" && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [`${value} companies`, "New Companies"]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Bar dataKey="newCompanies" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              {timeScale === "monthly" && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [`${value} companies`, "New Companies"]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Bar dataKey="newCompanies" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              {timeScale === "hourly" && (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Company data is not available in hourly view
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

