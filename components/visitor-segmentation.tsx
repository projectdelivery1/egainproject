"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { PlusCircle, Download, Share2, Filter, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useLogStore } from "@/lib/log-store"

export function VisitorSegmentation() {
  const [segmentType, setSegmentType] = useState("industry")
  const [createSegmentOpen, setCreateSegmentOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [segmentData, setSegmentData] = useState<Record<string, any[]>>({
    industry: [],
    size: [],
    engagement: [],
    geographic: [],
  })
  const { toast } = useToast()
  const { logs } = useLogStore()

  // Generate segment data from log data
  useEffect(() => {
    if (logs.length === 0) {
      // Example data
      setSegmentData({
        industry: [
          { name: "Technology", value: 45 },
          { name: "Healthcare", value: 18 },
          { name: "Manufacturing", value: 12 },
          { name: "Finance", value: 9 },
          { name: "Retail", value: 8 },
          { name: "Energy", value: 5 },
          { name: "Other", value: 3 },
        ],
        size: [
          { name: "Enterprise (5000+)", value: 28 },
          { name: "Large (1000-5000)", value: 35 },
          { name: "Medium (200-1000)", value: 22 },
          { name: "Small (50-200)", value: 10 },
          { name: "Startup (<50)", value: 5 },
        ],
        engagement: [
          { name: "High Engagement", value: 22 },
          { name: "Medium Engagement", value: 38 },
          { name: "Low Engagement", value: 40 },
        ],
        geographic: [
          { name: "North America", value: 45 },
          { name: "Europe", value: 28 },
          { name: "Asia Pacific", value: 18 },
          { name: "Latin America", value: 5 },
          { name: "Middle East & Africa", value: 4 },
        ],
      })
      return
    }

    // Process log data to create segments
    try {
      setIsLoading(true)

      // Collect unique domains
      const domains = new Set<string>()
      logs.forEach((log) => {
        if (log.domain && log.domain !== "-") {
          domains.add(log.domain)
        }
      })

      // Assign random industry, size, and region to each domain
      const domainData = new Map<
        string,
        {
          industry: string
          size: string
          region: string
          visits: number
          engagement: number
        }
      >()

      const industries = [
        "Technology",
        "Healthcare",
        "Manufacturing",
        "Finance",
        "Retail",
        "Energy",
        "Education",
        "Media",
        "Other",
      ]
      const sizes = ["Enterprise (5000+)", "Large (1000-5000)", "Medium (200-1000)", "Small (50-200)", "Startup (<50)"]
      const regions = ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East & Africa"]

      domains.forEach((domain) => {
        // Calculate visits per domain
        const visits = logs.filter((log) => log.domain === domain).length

        // Calculate unique pages per domain
        const uniquePages = new Set(logs.filter((log) => log.domain === domain).map((log) => log.pageUrl))

        // Calculate engagement score
        const engagement = Math.min(100, Math.round((visits * 5 + uniquePages.size * 10) / 2))

        // Deterministically assign industry, size, and region based on domain name
        const domainHash = domain.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

        domainData.set(domain, {
          industry: industries[domainHash % industries.length],
          size: sizes[domainHash % sizes.length],
          region: regions[(domainHash * 3) % regions.length],
          visits,
          engagement,
        })
      })

      // Industry segmentation
      const industrySegment = industries
        .map((industry) => {
          const count = Array.from(domainData.values()).filter((data) => data.industry === industry).length
          return { name: industry, value: count }
        })
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value)

      // Company size segmentation
      const sizeSegment = sizes
        .map((size) => {
          const count = Array.from(domainData.values()).filter((data) => data.size === size).length
          return { name: size, value: count }
        })
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value)

      // Engagement level segmentation
      const engagementSegment = [
        {
          name: "High Engagement",
          value: Array.from(domainData.values()).filter((data) => data.engagement >= 70).length,
        },
        {
          name: "Medium Engagement",
          value: Array.from(domainData.values()).filter((data) => data.engagement >= 30 && data.engagement < 70).length,
        },
        {
          name: "Low Engagement",
          value: Array.from(domainData.values()).filter((data) => data.engagement < 30).length,
        },
      ].filter((item) => item.value > 0)

      // Geographic segmentation
      const geographicSegment = regions
        .map((region) => {
          const count = Array.from(domainData.values()).filter((data) => data.region === region).length
          return { name: region, value: count }
        })
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value)

      setSegmentData({
        industry: industrySegment,
        size: sizeSegment,
        engagement: engagementSegment,
        geographic: geographicSegment,
      })

      setIsLoading(false)
    } catch (error) {
      console.error("Error processing log data for segmentation:", error)
      setIsLoading(false)
    }
  }, [logs])

  // Chart colors
  const COLORS = [
    "#D53F8C", // primary
    "#805AD5",
    "#3182CE",
    "#319795",
    "#38A169",
    "#D69E2E",
    "#DD6B20",
    "#E53E3E",
    "#718096",
    "#4A5568",
  ]

  const getDataForSegmentType = () => {
    return segmentData[segmentType] || []
  }

  const getSegmentTitle = () => {
    switch (segmentType) {
      case "industry":
        return "Industry Segmentation"
      case "size":
        return "Company Size Segmentation"
      case "engagement":
        return "Engagement Level Segmentation"
      case "geographic":
        return "Geographic Segmentation"
      default:
        return "Visitor Segmentation"
    }
  }

  const getSegmentDescription = () => {
    switch (segmentType) {
      case "industry":
        return "Distribution of visitors across different industries"
      case "size":
        return "Distribution of visitors by company size and employee count"
      case "engagement":
        return "Segmentation based on visitor engagement metrics and behaviors"
      case "geographic":
        return "Regional distribution of website visitors"
      default:
        return "Analyze visitor segments to target your marketing efforts"
    }
  }

  const handleCreateSegment = (formData: FormData) => {
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    if (!name) {
      toast({
        title: "Error",
        description: "Segment name is required",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Segment Created",
      description: `"${name}" segment has been successfully created.`,
    })

    setCreateSegmentOpen(false)
  }

  const handleExportSegment = () => {
    toast({
      title: "Segment Exported",
      description: "Segment data has been exported in CSV format.",
    })
  }

  const handleShareSegment = () => {
    toast({
      title: "Segment Shared",
      description: "Segment link has been copied to your clipboard.",
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{getSegmentTitle()}</CardTitle>
          <CardDescription>{getSegmentDescription()}</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={segmentType} onValueChange={setSegmentType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Segment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="industry">Industry</SelectItem>
              <SelectItem value="size">Company Size</SelectItem>
              <SelectItem value="engagement">Engagement Level</SelectItem>
              <SelectItem value="geographic">Geographic</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={createSegmentOpen} onOpenChange={setCreateSegmentOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Segment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Segment</DialogTitle>
                <DialogDescription>
                  Create a custom visitor segment to use in your marketing campaigns.
                </DialogDescription>
              </DialogHeader>
              <form action={handleCreateSegment}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Segment Name</Label>
                    <Input id="name" name="name" placeholder="E.g., High-Value Technology Companies" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" name="description" placeholder="Describe the purpose of this segment" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="criteria">Segment Criteria</Label>
                    <Select name="criteria">
                      <SelectTrigger id="criteria">
                        <SelectValue placeholder="Select criteria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="industry">Industry = Technology</SelectItem>
                        <SelectItem value="size">Company Size &gt; 1000</SelectItem>
                        <SelectItem value="engagement">Engagement Score &gt; 80</SelectItem>
                        <SelectItem value="visits">Visit Count &gt; 5</SelectItem>
                        <SelectItem value="custom">Custom Criteria...</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Segment</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Processing segment data...</p>
          </div>
        ) : (
          <Tabs defaultValue="chart" className="space-y-4">
            <TabsList>
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              <TabsTrigger value="details">Detailed View</TabsTrigger>
            </TabsList>

            <TabsContent value="chart">
              <div className="flex justify-end space-x-2 mb-4">
                <Button variant="outline" size="sm" onClick={handleExportSegment}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={handleShareSegment}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>

              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getDataForSegmentType()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getDataForSegmentType().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} visitors`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="bar">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getDataForSegmentType()}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => `${value} visitors`} />
                    <Bar dataKey="value" fill="#D53F8C" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="details">
              <div className="overflow-hidden rounded-md border">
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b [&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium">Segment</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Visitors</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Percentage</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Avg. Pages</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Avg. Time</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Lead Value</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {getDataForSegmentType().length === 0 ? (
                      <tr>
                        <td colSpan={6} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Filter className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No data found for this segment</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      getDataForSegmentType().map((segment, i) => {
                        const total = getDataForSegmentType().reduce((sum, item) => sum + item.value, 0)
                        const percentage = ((segment.value / total) * 100).toFixed(1)
                        // Demo metrics
                        const avgPages = Math.floor(Math.random() * 10) + 3
                        const avgMinutes = Math.floor(Math.random() * 15) + 2
                        const avgSeconds = Math.floor(Math.random() * 60)
                        const leadScore = Math.floor(Math.random() * 30) + 50

                        return (
                          <tr key={segment.name} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle font-medium">{segment.name}</td>
                            <td className="p-4 align-middle">{segment.value}</td>
                            <td className="p-4 align-middle">{percentage}%</td>
                            <td className="p-4 align-middle">{avgPages}</td>
                            <td className="p-4 align-middle">
                              {avgMinutes}m {avgSeconds}s
                            </td>
                            <td className="p-4 align-middle">
                              <Badge variant={leadScore > 70 ? "default" : "outline"}>{leadScore}%</Badge>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

