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

export function VisitorTrafficOverview() {
  const [timeScale, setTimeScale] = useState("daily")
  const [timeZone, setTimeZone] = useState("local")
  const [dailyData, setDailyData] = useState<any[]>([])
  const [hourlyData, setHourlyData] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const { logs } = useLogStore()

  // Generate chart data based on time scale
  useEffect(() => {
    if (logs.length === 0) {
      // Example data for demo purposes
      setDailyData([
        { date: "Mar 8", visitors: 124, newCompanies: 4 },
        { date: "Mar 9", visitors: 115, newCompanies: 2 },
        { date: "Mar 10", visitors: 186, newCompanies: 6 },
        { date: "Mar 11", visitors: 195, newCompanies: 7 },
        { date: "Mar 12", visitors: 220, newCompanies: 8 },
        { date: "Mar 13", visitors: 173, newCompanies: 5 },
        { date: "Mar 14", visitors: 88, newCompanies: 3 },
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
  }, [logs, timeZone])

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Visitor Traffic Overview</CardTitle>
          <CardDescription>Track visitor activity over time</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeZone} onValueChange={setTimeZone}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Time Zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="local">Local Time</SelectItem>
              <SelectItem value="utc">UTC</SelectItem>
              <SelectItem value="est">EST (UTC-5)</SelectItem>
              <SelectItem value="pst">PST (UTC-8)</SelectItem>
              <SelectItem value="cet">CET (UTC+1)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" onValueChange={setTimeScale}>
          <TabsList className="mb-4">
            <TabsTrigger value="hourly">Hourly</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value="hourly" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="visitors" name="Visitors" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="daily" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="Visitors"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary)/0.2)"
                />
                <Area
                  type="monotone"
                  dataKey="newCompanies"
                  name="New Companies"
                  stroke="hsl(var(--primary)/0.6)"
                  fill="hsl(var(--primary)/0.1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="monthly" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="visitors" name="Visitors" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="newCompanies" name="New Companies" fill="hsl(var(--primary)/0.6)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
