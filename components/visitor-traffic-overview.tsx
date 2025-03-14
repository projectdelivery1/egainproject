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

    // Gerçek uygulamada, burada zaman damgasına göre log verilerini işleyeceğiz
    // Şimdilik yukarıdaki örnek verileri kullanacağız
  }, [logs, timeZone])

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Ziyaretçi Trafiği Genel Bakış</CardTitle>
          <CardDescription>Zaman içindeki ziyaretçi aktivitesini takip edin</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeZone} onValueChange={setTimeZone}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Saat dilimi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="local">Yerel Saat</SelectItem>
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
            <TabsTrigger value="hourly">Saatlik</TabsTrigger>
            <TabsTrigger value="daily">Günlük</TabsTrigger>
            <TabsTrigger value="monthly">Aylık</TabsTrigger>
          </TabsList>

          <TabsContent value="hourly" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="visitors" name="Ziyaretçiler" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
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
                  name="Ziyaretçiler"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary)/0.2)"
                />
                <Area
                  type="monotone"
                  dataKey="newCompanies"
                  name="Yeni Şirketler"
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
                <Bar yAxisId="left" dataKey="visitors" name="Ziyaretçiler" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="newCompanies" name="Yeni Şirketler" fill="hsl(var(--primary)/0.6)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>\

