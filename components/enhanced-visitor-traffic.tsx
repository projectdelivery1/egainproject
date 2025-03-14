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

  // Zaman ölçeğine göre grafik verilerini oluştur
  useEffect(() => {
    if (logs.length === 0) {
      // Demo için örnek veriler
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
        { month: "Eki", visitors: 2245, newCompanies: 85 },
        { month: "Kas", visitors: 2190, newCompanies: 78 },
        { month: "Ara", visitors: 1845, newCompanies: 62 },
        { month: "Oca", visitors: 2354, newCompanies: 92 },
        { month: "Şub", visitors: 2580, newCompanies: 105 },
        { month: "Mar", visitors: 2853, newCompanies: 112 },
      ])

      return
    }

    // Log verilerinden zaman bazlı verileri oluştur
    try {
      // Saatlik veriler
      const hourCounts: Record<string, number> = {}
      // Günlük veriler
      const dateCounts: Record<string, { visitors: number; companies: Set<string> }> = {}
      // Aylık veriler
      const monthCounts: Record<string, { visitors: number; companies: Set<string> }> = {}

      // Zaman dilimi ayarlaması
      const getAdjustedDate = (timestamp: string) => {
        try {
          const date = new Date(timestamp)
          if (isNaN(date.getTime())) {
            // Alternatif format denemesi (01/Feb/2025:00:17:10)
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

          // Zaman dilimi ayarlaması
          if (timeZone === "utc") {
            // UTC'ye dönüştür
            return new Date(date.getTime() + date.getTimezoneOffset() * 60000)
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
        } catch (error) {
          console.error("Date parsing error:", error)
          return null
        }
      }

      logs.forEach((log) => {
        const date = getAdjustedDate(log.timestamp)
        if (!date) return

        // Saatlik veri
        const hour = `${date.getHours().toString().padStart(2, "0")}:00`
        hourCounts[hour] = (hourCounts[hour] || 0) + 1

        // Günlük veri
        const dateStr = `${date.getDate()} ${["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"][date.getMonth()]}`
        if (!dateCounts[dateStr]) {
          dateCounts[dateStr] = { visitors: 0, companies: new Set() }
        }
        dateCounts[dateStr].visitors++
        if (log.domain && log.domain !== "-") {
          dateCounts[dateStr].companies.add(log.domain)
        }

        // Aylık veri
        const monthStr = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"][
          date.getMonth()
        ]
        if (!monthCounts[monthStr]) {
          monthCounts[monthStr] = { visitors: 0, companies: new Set() }
        }
        monthCounts[monthStr].visitors++
        if (log.domain && log.domain !== "-") {
          monthCounts[monthStr].companies.add(log.domain)
        }
      })

      // Verileri grafik formatına dönüştür
      const hourlyDataArray = Object.entries(hourCounts)
        .map(([hour, visitors]) => ({ hour, visitors }))
        .sort((a, b) => {
          const hourA = Number.parseInt(a.hour.split(":")[0])
          const hourB = Number.parseInt(b.hour.split(":")[0])
          return hourA - hourB
        })

      const dailyDataArray = Object.entries(dateCounts)
        .map(([date, data]) => ({
          date,
          visitors: data.visitors,
          newCompanies: data.companies.size,
        }))
        .sort((a, b) => {
          const dateA = a.date.split(" ")[0]
          const dateB = b.date.split(" ")[0]
          return Number.parseInt(dateA) - Number.parseInt(dateB)
        })

      const monthlyDataArray = Object.entries(monthCounts)
        .map(([month, data]) => ({
          month,
          visitors: data.visitors,
          newCompanies: data.companies.size,
        }))
        .sort((a, b) => {
          const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"]
          return months.indexOf(a.month) - months.indexOf(b.month)
        })

      // Veri varsa güncelle, yoksa örnek verileri kullan
      if (hourlyDataArray.length > 0) setHourlyData(hourlyDataArray)
      if (dailyDataArray.length > 0) setDailyData(dailyDataArray)
      if (monthlyDataArray.length > 0) setMonthlyData(monthlyDataArray)
    } catch (error) {
      console.error("Error processing log data for traffic charts:", error)
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
              <SelectValue placeholder="Time zone" />
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
                <Bar
                  yAxisId="left"
                  dataKey="visitors"
                  name="Visitors"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="newCompanies"
                  name="New Companies"
                  fill="hsl(var(--primary)/0.6)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

