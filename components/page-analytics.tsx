"use client"

import { useState, useEffect } from "react"
import { useLogStore } from "@/lib/log-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, ExternalLink, Clock, Users, BarChart4 } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts"

interface PageData {
  path: string
  title: string
  views: number
  uniqueVisitors: number
  avgTimeOnPage: string
  bounceRate: number
  conversionRate: number
  lastVisited: string
}

export function PageAnalytics() {
  const { logs } = useLogStore()
  const [pages, setPages] = useState<PageData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("views")
  const [viewType, setViewType] = useState("table")
  const [timeData, setTimeData] = useState<any[]>([])

  useEffect(() => {
    if (logs.length === 0) {
      // Default data when no logs are available
      const mockPages: PageData[] = [
        {
          path: "/products/knowledge-hub",
          title: "AI Knowledge Hub",
          views: 1245,
          uniqueVisitors: 876,
          avgTimeOnPage: "2:45",
          bounceRate: 32,
          conversionRate: 5.2,
          lastVisited: "10 minutes ago",
        },
        {
          path: "/solutions/customer-service",
          title: "Customer Service Solutions",
          views: 986,
          uniqueVisitors: 654,
          avgTimeOnPage: "3:12",
          bounceRate: 28,
          conversionRate: 4.8,
          lastVisited: "25 minutes ago",
        },
        {
          path: "/pricing",
          title: "Pricing Plans",
          views: 879,
          uniqueVisitors: 712,
          avgTimeOnPage: "4:05",
          bounceRate: 18,
          conversionRate: 7.5,
          lastVisited: "1 hour ago",
        },
        {
          path: "/resources/case-studies",
          title: "Case Studies",
          views: 654,
          uniqueVisitors: 521,
          avgTimeOnPage: "5:30",
          bounceRate: 15,
          conversionRate: 8.2,
          lastVisited: "2 hours ago",
        },
        {
          path: "/contact",
          title: "Contact Us",
          views: 521,
          uniqueVisitors: 432,
          avgTimeOnPage: "1:45",
          bounceRate: 45,
          conversionRate: 3.1,
          lastVisited: "3 hours ago",
        },
        {
          path: "/blog/ai-trends-2025",
          title: "AI Trends for 2025",
          views: 487,
          uniqueVisitors: 398,
          avgTimeOnPage: "6:20",
          bounceRate: 12,
          conversionRate: 4.5,
          lastVisited: "5 hours ago",
        },
        {
          path: "/about-us",
          title: "About Our Company",
          views: 356,
          uniqueVisitors: 289,
          avgTimeOnPage: "1:30",
          bounceRate: 52,
          conversionRate: 1.8,
          lastVisited: "1 day ago",
        },
        {
          path: "/careers",
          title: "Career Opportunities",
          views: 298,
          uniqueVisitors: 245,
          avgTimeOnPage: "2:15",
          bounceRate: 38,
          conversionRate: 2.5,
          lastVisited: "2 days ago",
        },
      ]

      setPages(mockPages)

      // Mock time data for charts
      const mockTimeData = [
        { name: "Mon", views: 420, visitors: 320 },
        { name: "Tue", views: 580, visitors: 450 },
        { name: "Wed", views: 620, visitors: 480 },
        { name: "Thu", views: 750, visitors: 600 },
        { name: "Fri", views: 820, visitors: 700 },
        { name: "Sat", views: 450, visitors: 380 },
        { name: "Sun", views: 380, visitors: 300 },
      ]
      setTimeData(mockTimeData)
      return
    }

    // Process logs to find page data
    const pageViews: Record<string, number> = {}
    const pageVisitors: Record<string, Set<string>> = {}
    const pageLastVisit: Record<string, Date> = {}

    // Count page views and unique visitors
    logs.forEach((log) => {
      if (log.pageUrl && log.pageUrl !== "-") {
        // Count views
        pageViews[log.pageUrl] = (pageViews[log.pageUrl] || 0) + 1

        // Track unique visitors
        if (!pageVisitors[log.pageUrl]) {
          pageVisitors[log.pageUrl] = new Set()
        }
        if (log.ip) {
          pageVisitors[log.pageUrl].add(log.ip)
        }

        // Track last visit
        const logDate = new Date(log.timestamp)
        if (!isNaN(logDate.getTime())) {
          if (!pageLastVisit[log.pageUrl] || logDate > pageLastVisit[log.pageUrl]) {
            pageLastVisit[log.pageUrl] = logDate
          }
        }
      }
    })

    // Convert to array and format data
    const pagesData: PageData[] = Object.entries(pageViews).map(([path, views]) => {
      // Generate a title from the path
      let title = path === "/" ? "Homepage" : path.split("/").pop() || path
      title = title.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

      // Format last visit as relative time
      const lastVisitDate = pageLastVisit[path] || new Date()
      const now = new Date()
      const diffMs = now.getTime() - lastVisitDate.getTime()
      const diffMins = Math.floor(diffMs / 60000)

      let lastVisitFormatted
      if (diffMins < 60) {
        lastVisitFormatted = `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`
      } else {
        const diffHours = Math.floor(diffMins / 60)
        if (diffHours < 24) {
          lastVisitFormatted = `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
        } else {
          const diffDays = Math.floor(diffHours / 24)
          if (diffDays < 7) {
            lastVisitFormatted = `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
          } else {
            const diffWeeks = Math.floor(diffDays / 7)
            lastVisitFormatted = `${diffWeeks} week${diffWeeks !== 1 ? "s" : ""} ago`
          }
        }
      }

      // Generate random metrics for demo purposes
      // In a real implementation, these would be calculated from actual data
      const uniqueVisitors = pageVisitors[path]?.size || 0
      const avgTimeOnPage = `${Math.floor(Math.random() * 5 + 1)}:${Math.floor(Math.random() * 60)
        .toString()
        .padStart(2, "0")}`
      const bounceRate = Math.floor(Math.random() * 50 + 10)
      const conversionRate = Number.parseFloat((Math.random() * 10).toFixed(1))

      return {
        path,
        title,
        views,
        uniqueVisitors,
        avgTimeOnPage,
        bounceRate,
        conversionRate,
        lastVisited: lastVisitFormatted,
      }
    })

    // Sort by views (highest first)
    pagesData.sort((a, b) => b.views - a.views)

    setPages(pagesData.length > 0 ? pagesData : [])

    // Generate time data for charts
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const timeSeriesData = days.map((day) => {
      return {
        name: day,
        views: Math.floor(Math.random() * 500 + 300),
        visitors: Math.floor(Math.random() * 400 + 200),
      }
    })
    setTimeData(timeSeriesData)
  }, [logs])

  // Filter pages based on search term
  const filteredPages = pages.filter((page) => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return page.title.toLowerCase().includes(searchLower) || page.path.toLowerCase().includes(searchLower)
    }
    return true
  })

  // Sort pages based on selected sort option
  const sortedPages = [...filteredPages].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title)
      case "views":
        return b.views - a.views
      case "uniqueVisitors":
        return b.uniqueVisitors - a.uniqueVisitors
      case "bounceRate":
        return a.bounceRate - b.bounceRate
      case "conversionRate":
        return b.conversionRate - a.conversionRate
      case "lastVisited":
      default:
        // This is approximate since we've converted to relative time
        return a.lastVisited.includes("minute")
          ? -1
          : b.lastVisited.includes("minute")
            ? 1
            : a.lastVisited.includes("hour")
              ? -1
              : b.lastVisited.includes("hour")
                ? 1
                : a.lastVisited.includes("day")
                  ? -1
                  : b.lastVisited.includes("day")
                    ? 1
                    : 0
    }
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Page Analytics</CardTitle>
            <CardDescription>
              {filteredPages.length} {filteredPages.length === 1 ? "page" : "pages"} found
            </CardDescription>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap gap-2">
            <Input
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-auto"
            />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="views">Most Views</SelectItem>
                <SelectItem value="uniqueVisitors">Most Visitors</SelectItem>
                <SelectItem value="bounceRate">Lowest Bounce Rate</SelectItem>
                <SelectItem value="conversionRate">Highest Conversion</SelectItem>
                <SelectItem value="lastVisited">Recently Visited</SelectItem>
                <SelectItem value="title">Page Title</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={viewType} onValueChange={setViewType}>
          <TabsList className="mb-4">
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="chart">Chart View</TabsTrigger>
          </TabsList>

          <TabsContent value="table">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Unique Visitors</TableHead>
                    <TableHead>Avg. Time on Page</TableHead>
                    <TableHead>Bounce Rate</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                    <TableHead>Last Visited</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-24">
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No pages found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedPages.map((page) => (
                      <TableRow key={page.path}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{page.title}</div>
                            <div className="text-xs text-muted-foreground">{page.path}</div>
                          </div>
                        </TableCell>
                        <TableCell>{page.views.toLocaleString()}</TableCell>
                        <TableCell>{page.uniqueVisitors.toLocaleString()}</TableCell>
                        <TableCell>{page.avgTimeOnPage}</TableCell>
                        <TableCell>
                          <Badge
                            variant={page.bounceRate < 20 ? "default" : page.bounceRate < 40 ? "secondary" : "outline"}
                          >
                            {page.bounceRate}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              page.conversionRate > 5 ? "default" : page.conversionRate > 3 ? "secondary" : "outline"
                            }
                          >
                            {page.conversionRate}%
                          </Badge>
                        </TableCell>
                        <TableCell>{page.lastVisited}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="chart">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Page Views Over Time</CardTitle>
                  <CardDescription>Daily page views and unique visitors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={timeData}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
                        <Line type="monotone" dataKey="visitors" stroke="#82ca9d" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Pages by Views</CardTitle>
                    <CardDescription>Most viewed pages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={sortedPages.slice(0, 5).map((page) => ({
                            name: page.title.length > 20 ? page.title.substring(0, 20) + "..." : page.title,
                            views: page.views,
                          }))}
                        >
                          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip />
                          <Bar dataKey="views" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Pages by Engagement</CardTitle>
                    <CardDescription>Pages with highest conversion rates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[...sortedPages]
                            .sort((a, b) => b.conversionRate - a.conversionRate)
                            .slice(0, 5)
                            .map((page) => ({
                              name: page.title.length > 20 ? page.title.substring(0, 20) + "..." : page.title,
                              rate: page.conversionRate,
                            }))}
                        >
                          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip />
                          <Bar dataKey="rate" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-secondary" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {sortedPages.slice(0, 3).map((page) => (
                  <Card key={page.path}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{page.title}</CardTitle>
                      <CardDescription className="truncate">{page.path}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{page.views.toLocaleString()} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{page.uniqueVisitors.toLocaleString()} visitors</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Avg. {page.avgTimeOnPage}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart4 className="h-4 w-4 text-muted-foreground" />
                          <span>{page.conversionRate}% conversion</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm">
                          <span>Bounce Rate</span>
                          <span className="font-medium">{page.bounceRate}%</span>
                        </div>
                        <Progress value={100 - page.bounceRate} className="h-2 mt-1" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

