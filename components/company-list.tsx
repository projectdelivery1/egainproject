"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, ExternalLink, Users, BarChart4, MapPin } from "lucide-react"
import { useLogStore } from "@/lib/log-store"

interface CompanyData {
  id: string
  name: string
  domain: string
  logo: string
  fallback: string
  industry: string
  size: string
  location: string
  visitors: number
  visits: number
  pages: number
  lastVisit: string
  engagementScore: number
  leadScore: number
}

export function CompanyList() {
  const router = useRouter()
  const { logs } = useLogStore()
  const [companies, setCompanies] = useState<CompanyData[]>([])
  const [viewType, setViewType] = useState("table")
  const [filterIndustry, setFilterIndustry] = useState("all")
  const [filterSize, setFilterSize] = useState("all")
  const [sortBy, setSortBy] = useState("lastVisit")

  useEffect(() => {
    // Generate company data from logs
    if (logs.length === 0) {
      // Mock data when no logs are available
      const mockCompanies: CompanyData[] = [
        {
          id: "1",
          name: "Acme Inc.",
          domain: "acme.com",
          logo: "/logos/acme.png",
          fallback: "AI",
          industry: "Technology",
          size: "1000-5000",
          location: "San Francisco, CA",
          visitors: 245,
          visits: 1245,
          pages: 58,
          lastVisit: "10 minutes ago",
          engagementScore: 87,
          leadScore: 92,
        },
        {
          id: "2",
          name: "Globex Corporation",
          domain: "globex.com",
          logo: "/logos/globex.png",
          fallback: "GC",
          industry: "Manufacturing",
          size: "5000+",
          location: "Boston, MA",
          visitors: 189,
          visits: 986,
          pages: 42,
          lastVisit: "2 hours ago",
          engagementScore: 76,
          leadScore: 85,
        },
        {
          id: "3",
          name: "Initech",
          domain: "initech.com",
          logo: "/logos/initech.png",
          fallback: "IN",
          industry: "Technology",
          size: "500-1000",
          location: "Austin, TX",
          visitors: 152,
          visits: 754,
          pages: 35,
          lastVisit: "4 hours ago",
          engagementScore: 82,
          leadScore: 78,
        },
        {
          id: "4",
          name: "Massive Dynamic",
          domain: "massive.co",
          logo: "/logos/massive.png",
          fallback: "MD",
          industry: "Healthcare",
          size: "1000-5000",
          location: "New York, NY",
          visitors: 134,
          visits: 543,
          pages: 27,
          lastVisit: "1 day ago",
          engagementScore: 65,
          leadScore: 72,
        },
        {
          id: "5",
          name: "Umbrella Corp",
          domain: "umbrella.org",
          logo: "/logos/umbrella.png",
          fallback: "UC",
          industry: "Pharmaceuticals",
          size: "5000+",
          location: "Chicago, IL",
          visitors: 98,
          visits: 412,
          pages: 18,
          lastVisit: "2 days ago",
          engagementScore: 58,
          leadScore: 63,
        },
        {
          id: "6",
          name: "Wayne Enterprises",
          domain: "wayne.com",
          logo: "/logos/wayne.png",
          fallback: "WE",
          industry: "Manufacturing",
          size: "5000+",
          location: "Gotham City",
          visitors: 86,
          visits: 356,
          pages: 16,
          lastVisit: "3 days ago",
          engagementScore: 52,
          leadScore: 58,
        },
        {
          id: "7",
          name: "Stark Industries",
          domain: "stark.com",
          logo: "/logos/stark.png",
          fallback: "SI",
          industry: "Technology",
          size: "1000-5000",
          location: "Malibu, CA",
          visitors: 75,
          visits: 298,
          pages: 14,
          lastVisit: "5 days ago",
          engagementScore: 48,
          leadScore: 52,
        },
        {
          id: "8",
          name: "LexCorp",
          domain: "lexcorp.com",
          logo: "/logos/lexcorp.png",
          fallback: "LC",
          industry: "Energy",
          size: "1000-5000",
          location: "Metropolis",
          visitors: 62,
          visits: 254,
          pages: 12,
          lastVisit: "1 week ago",
          engagementScore: 42,
          leadScore: 45,
        },
      ]

      setCompanies(mockCompanies)
      return
    }

    // Process logs to generate company data
    const companyMap = new Map<string, CompanyData>()

    logs.forEach((log) => {
      if (!log.domain || log.domain === "-") return

      const domain = log.domain.toLowerCase().replace("www.", "")

      if (!companyMap.has(domain)) {
        // Generate a company name from the domain
        const name =
          domain
            .split(".")[0]
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()) +
          (domain.includes(".com") ? " Inc." : domain.includes(".org") ? " Organization" : " Corp")

        // Generate fallback from name
        const fallback = name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()

        // Random industry selection
        const industries = [
          "Technology",
          "Healthcare",
          "Manufacturing",
          "Finance",
          "Retail",
          "Energy",
          "Pharmaceuticals",
        ]
        const industry = industries[Math.floor(Math.random() * industries.length)]

        // Random company size
        const sizes = ["1-50", "50-200", "200-500", "500-1000", "1000-5000", "5000+"]
        const size = sizes[Math.floor(Math.random() * sizes.length)]

        // Random location
        const locations = [
          "San Francisco, CA",
          "New York, NY",
          "Boston, MA",
          "Austin, TX",
          "Chicago, IL",
          "Seattle, WA",
        ]
        const location = locations[Math.floor(Math.random() * locations.length)]

        companyMap.set(domain, {
          id: domain,
          name,
          domain,
          logo: `/placeholder.svg?height=40&width=40&text=${fallback}`,
          fallback,
          industry,
          size,
          location,
          visitors: 0,
          visits: 0,
          pages: 0,
          lastVisit: log.timestamp,
          engagementScore: Math.floor(Math.random() * 100),
          leadScore: Math.floor(Math.random() * 100),
        })
      }

      const companyData = companyMap.get(domain)!
      companyData.visits += 1

      // Count unique pages
      const uniquePages = new Set<string>()
      logs
        .filter((l) => l.domain === log.domain)
        .forEach((l) => {
          if (l.pageUrl) uniquePages.add(l.pageUrl)
        })

      companyData.pages = uniquePages.size

      // Count unique visitors (IP addresses)
      const uniqueVisitors = new Set<string>()
      logs
        .filter((l) => l.domain === log.domain)
        .forEach((l) => {
          if (l.ip) uniqueVisitors.add(l.ip)
        })

      companyData.visitors = uniqueVisitors.size

      // Update last visit timestamp if newer
      if (new Date(log.timestamp) > new Date(companyData.lastVisit)) {
        companyData.lastVisit = log.timestamp
      }
    })

    // Convert to array and sort
    let companiesArray = Array.from(companyMap.values())

    // Format lastVisit as relative time
    companiesArray = companiesArray.map((company) => {
      const lastVisitDate = new Date(company.lastVisit)
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

      return {
        ...company,
        lastVisit: lastVisitFormatted,
      }
    })

    setCompanies(companiesArray)
  }, [logs])

  // Filter companies based on selected filters
  const filteredCompanies = companies.filter((company) => {
    if (filterIndustry !== "all" && company.industry !== filterIndustry) return false
    if (filterSize !== "all" && company.size !== filterSize) return false
    return true
  })

  // Sort companies based on selected sort option
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "visitors":
        return b.visitors - a.visitors
      case "engagementScore":
        return b.engagementScore - a.engagementScore
      case "leadScore":
        return b.leadScore - a.leadScore
      case "lastVisit":
      default:
        // This is approximate since we've converted to relative time
        // In a real implementation, we would sort by the actual timestamp
        return a.lastVisit.includes("minute")
          ? -1
          : b.lastVisit.includes("minute")
            ? 1
            : a.lastVisit.includes("hour")
              ? -1
              : b.lastVisit.includes("hour")
                ? 1
                : a.lastVisit.includes("day")
                  ? -1
                  : b.lastVisit.includes("day")
                    ? 1
                    : 0
    }
  })

  const handleViewCompany = (domain: string) => {
    router.push(`/visitor/${encodeURIComponent(domain)}`)
  }

  // Get unique industries and sizes for filters
  const industries = ["all", ...new Set(companies.map((c) => c.industry))]
  const sizes = ["all", ...new Set(companies.map((c) => c.size))]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Company List</CardTitle>
              <CardDescription>
                {filteredCompanies.length} {filteredCompanies.length === 1 ? "company" : "companies"} found
              </CardDescription>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              <div className="w-full sm:w-auto">
                <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {industries
                      .filter((i) => i !== "all")
                      .map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-auto">
                <Select value={filterSize} onValueChange={setFilterSize}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Company Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    {sizes
                      .filter((s) => s !== "all")
                      .map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lastVisit">Latest Activity</SelectItem>
                    <SelectItem value="visitors">Most Visitors</SelectItem>
                    <SelectItem value="engagementScore">Engagement Score</SelectItem>
                    <SelectItem value="leadScore">Lead Score</SelectItem>
                    <SelectItem value="name">Company Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={viewType} onValueChange={setViewType}>
            <TabsList className="mb-4">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="card">Card View</TabsTrigger>
            </TabsList>

            <TabsContent value="table">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Visitors</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedCompanies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={company.logo} alt={company.name} />
                              <AvatarFallback>{company.fallback}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{company.name}</div>
                              <div className="text-xs text-muted-foreground">{company.domain}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{company.industry}</TableCell>
                        <TableCell>{company.size}</TableCell>
                        <TableCell>{company.location}</TableCell>
                        <TableCell>{company.visitors}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={company.engagementScore} className="h-2 w-16" />
                            <span className="text-xs">{company.engagementScore}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{company.lastVisit}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewCompany(company.domain)}>
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="card">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedCompanies.map((company) => (
                  <Card key={company.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={company.logo} alt={company.name} />
                            <AvatarFallback>{company.fallback}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{company.name}</CardTitle>
                            <CardDescription>{company.domain}</CardDescription>
                          </div>
                        </div>
                        <Badge variant={company.leadScore > 80 ? "default" : "outline"}>{company.leadScore}%</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>{company.industry}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{company.size}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{company.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart4 className="h-4 w-4 text-muted-foreground" />
                          <span>{company.visitors} visitors</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm">
                          <span>Engagement</span>
                          <span className="font-medium">{company.engagementScore}%</span>
                        </div>
                        <Progress value={company.engagementScore} className="h-2 mt-1" />
                      </div>
                    </CardContent>
                    <div className="border-t p-3 bg-muted/50">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Last active: {company.lastVisit}</span>
                        <Button size="sm" onClick={() => handleViewCompany(company.domain)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

