"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, UserPlus, Target, Award } from "lucide-react"

export function AccountsOverview() {
  const [viewMode, setViewMode] = useState("performance")

  // Sample data for sales representatives
  const salesReps = [
    {
      id: "1",
      name: "Sarah Connor",
      email: "s.connor@egain.com",
      avatar: "/avatars/01.png",
      assignedLeads: 28,
      convertedLeads: 12,
      conversionRate: 42.8,
      revenue: 125000,
    },
    {
      id: "2",
      name: "John Smith",
      email: "j.smith@egain.com",
      avatar: "/avatars/02.png",
      assignedLeads: 32,
      convertedLeads: 15,
      conversionRate: 46.9,
      revenue: 180000,
    },
    {
      id: "3",
      name: "Emily Chen",
      email: "e.chen@egain.com",
      avatar: "/avatars/03.png",
      assignedLeads: 24,
      convertedLeads: 10,
      conversionRate: 41.7,
      revenue: 95000,
    },
    {
      id: "4",
      name: "Robert Johnson",
      email: "r.johnson@egain.com",
      avatar: "/avatars/04.png",
      assignedLeads: 18,
      convertedLeads: 6,
      conversionRate: 33.3,
      revenue: 72000,
    },
  ]

  // Performance chart data
  const performanceData = salesReps.map((rep) => ({
    name: rep.name.split(" ")[0],
    leads: rep.assignedLeads,
    conversions: rep.convertedLeads,
    revenue: rep.revenue / 1000, // Convert to thousands for better display
  }))

  // Lead distribution data
  const leadDistributionData = salesReps.map((rep) => ({
    name: rep.name,
    value: rep.assignedLeads,
  }))

  // Conversion rate data
  const conversionRateData = salesReps.map((rep) => ({
    name: rep.name.split(" ")[0],
    rate: rep.conversionRate,
  }))

  // Colors for pie chart
  const COLORS = ["#D53F8C", "#805AD5", "#3182CE", "#38A169", "#DD6B20"]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales Reps</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesReps.length}</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Leads</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesReps.reduce((sum, rep) => sum + rep.assignedLeads, 0)}</div>
            <p className="text-xs text-muted-foreground">+12 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                (salesReps.reduce((sum, rep) => sum + rep.convertedLeads, 0) /
                  salesReps.reduce((sum, rep) => sum + rep.assignedLeads, 0)) *
                100
              ).toFixed(1)}
              %
            </div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${salesReps.reduce((sum, rep) => sum + rep.revenue, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">+$45,000 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Team Performance</CardTitle>
          <CardDescription>Overview of sales representatives' performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={viewMode} onValueChange={setViewMode}>
            <TabsList className="mb-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="leads">Lead Distribution</TabsTrigger>
              <TabsTrigger value="conversion">Conversion Rates</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="leads" name="Assigned Leads" fill="#805AD5" />
                  <Bar yAxisId="left" dataKey="conversions" name="Converted Leads" fill="#38A169" />
                  <Bar yAxisId="right" dataKey="revenue" name="Revenue ($K)" fill="#D53F8C" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="leads" className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {leadDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} leads`} />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="conversion" className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionRateData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Bar dataKey="rate" name="Conversion Rate (%)" fill="#D53F8C" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Sales Representatives</CardTitle>
          <CardDescription>Sales representatives ranked by conversion rate and revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {salesReps
              .sort((a, b) => b.revenue - a.revenue)
              .map((rep) => (
                <div key={rep.id} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={rep.avatar} alt={rep.name} />
                    <AvatarFallback>{rep.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">{rep.name}</p>
                      <Badge variant={rep.conversionRate > 45 ? "default" : "outline"}>
                        {rep.conversionRate}% Conversion
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Progress value={rep.conversionRate} className="h-2 flex-1" />
                      <span className="ml-2 w-12 text-right">${rep.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-2">
                    Details
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

