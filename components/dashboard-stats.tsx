"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLogStore } from "@/lib/log-store"

export function DashboardStats() {
  const { logs } = useLogStore()
  const [stats, setStats] = useState({
    totalVisitors: 0,
    uniqueCompanies: 0,
    highValueLeads: 0,
    avgSessionDuration: "0m 0s",
    visitorChange: 0,
    companiesChange: 0,
    leadsChange: 0,
    durationChange: 0,
  })

  useEffect(() => {
    if (logs.length > 0) {
      // Calculate stats from actual log data
      const uniqueIPs = new Set<string>()
      const uniqueDomains = new Set<string>()
      const visitsByIP = new Map<string, number>()
      const pagesByIP = new Map<string, Set<string>>()

      logs.forEach((log) => {
        // Count unique visitors (IPs)
        if (log.ip && log.ip !== "-") {
          uniqueIPs.add(log.ip)

          // Count visits per IP
          visitsByIP.set(log.ip, (visitsByIP.get(log.ip) || 0) + 1)

          // Track unique pages per IP
          if (!pagesByIP.has(log.ip)) {
            pagesByIP.set(log.ip, new Set())
          }
          if (log.pageUrl && log.pageUrl !== "-") {
            pagesByIP.get(log.ip)?.add(log.pageUrl)
          }
        }

        // Count unique companies (domains)
        if (log.domain && log.domain !== "-") {
          uniqueDomains.add(log.domain)
        }
      })

      // Calculate high-value leads (IPs with high engagement)
      const highValueLeads = Array.from(uniqueIPs).filter((ip) => {
        const visits = visitsByIP.get(ip) || 0
        const uniquePages = pagesByIP.get(ip)?.size || 0
        const engagementScore = visits * 0.4 + uniquePages * 0.6
        return engagementScore > 5 // Threshold for high-value
      }).length

      // Calculate average session duration (simplified)
      // In a real implementation, this would use actual timestamps
      const totalVisits = Array.from(visitsByIP.values()).reduce((sum, visits) => sum + visits, 0)
      const avgVisitMinutes = Math.floor((totalVisits * 2.5) / uniqueIPs.size) // Assume 2.5 minutes per page view
      const avgVisitSeconds = Math.floor(Math.random() * 60) // Random seconds for demo

      // Set the calculated stats
      setStats({
        totalVisitors: uniqueIPs.size,
        uniqueCompanies: uniqueDomains.size,
        highValueLeads,
        avgSessionDuration: `${avgVisitMinutes}m ${avgVisitSeconds}s`,
        visitorChange: 18.1, // Mock change percentage
        companiesChange: 4.3, // Mock change percentage
        leadsChange: 10.5, // Mock change percentage
        durationChange: 1.2, // Mock change percentage
      })
    } else {
      // Default mock data when no logs are available
      setStats({
        totalVisitors: 2853,
        uniqueCompanies: 342,
        highValueLeads: 127,
        avgSessionDuration: "4m 32s",
        visitorChange: 18.1,
        companiesChange: 4.3,
        leadsChange: 10.5,
        durationChange: 1.2,
      })
    }
  }, [logs])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalVisitors.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {stats.visitorChange >= 0 ? "+" : ""}
            {stats.visitorChange}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unique Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.uniqueCompanies.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {stats.companiesChange >= 0 ? "+" : ""}
            {stats.companiesChange}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">High-Value Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.highValueLeads.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {stats.leadsChange >= 0 ? "+" : ""}
            {stats.leadsChange}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgSessionDuration}</div>
          <p className="text-xs text-muted-foreground">
            {stats.durationChange >= 0 ? "+" : ""}
            {stats.durationChange}% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

