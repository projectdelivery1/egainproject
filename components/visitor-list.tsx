"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExternalLink, User } from "lucide-react"
import { useLogStore } from "@/lib/log-store"

interface VisitorData {
  id: string
  name: string
  email: string
  company: string
  domain: string
  ip: string
  pages: number
  lastVisit: string
  timeOnSite: string
  leadScore: number
}

export function VisitorList() {
  const router = useRouter()
  const { logs } = useLogStore()
  const [visitors, setVisitors] = useState<VisitorData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [companyFilter, setCompanyFilter] = useState("all")

  useEffect(() => {
    if (logs.length === 0) {
      // Mock data when no logs are available
      const mockVisitors: VisitorData[] = [
        {
          id: "1",
          name: "John Smith",
          email: "john.smith@acme.com",
          company: "Acme Inc.",
          domain: "acme.com",
          ip: "192.168.1.1",
          pages: 12,
          lastVisit: "10 minutes ago",
          timeOnSite: "15:32",
          leadScore: 92,
        },
        {
          id: "2",
          name: "Jane Doe",
          email: "jane.doe@globex.com",
          company: "Globex Corporation",
          domain: "globex.com",
          ip: "192.168.2.1",
          pages: 8,
          lastVisit: "25 minutes ago",
          timeOnSite: "8:45",
          leadScore: 85,
        },
        {
          id: "3",
          name: "Robert Johnson",
          email: "r.johnson@initech.com",
          company: "Initech",
          domain: "initech.com",
          ip: "192.168.3.1",
          pages: 15,
          lastVisit: "1 hour ago",
          timeOnSite: "22:18",
          leadScore: 78,
        },
        {
          id: "4",
          name: "Emily Chen",
          email: "e.chen@massive.co",
          company: "Massive Dynamic",
          domain: "massive.co",
          ip: "192.168.4.1",
          pages: 6,
          lastVisit: "2 hours ago",
          timeOnSite: "5:05",
          leadScore: 72,
        },
        {
          id: "5",
          name: "Michael Brown",
          email: "m.brown@umbrella.org",
          company: "Umbrella Corp",
          domain: "umbrella.org",
          ip: "192.168.5.1",
          pages: 9,
          lastVisit: "3 hours ago",
          timeOnSite: "11:40",
          leadScore: 63,
        },
        {
          id: "6",
          name: "Laura Wilson",
          email: "l.wilson@wayne.com",
          company: "Wayne Enterprises",
          domain: "wayne.com",
          ip: "192.168.6.1",
          pages: 7,
          lastVisit: "5 hours ago",
          timeOnSite: "9:15",
          leadScore: 58,
        },
        {
          id: "7",
          name: "David Lee",
          email: "d.lee@stark.com",
          company: "Stark Industries",
          domain: "stark.com",
          ip: "192.168.7.1",
          pages: 4,
          lastVisit: "1 day ago",
          timeOnSite: "3:50",
          leadScore: 52,
        },
        {
          id: "8",
          name: "Sarah Miller",
          email: "s.miller@lexcorp.com",
          company: "LexCorp",
          domain: "lexcorp.com",
          ip: "192.168.8.1",
          pages: 3,
          lastVisit: "2 days ago",
          timeOnSite: "2:20",
          leadScore: 45,
        },
      ]

      setVisitors(mockVisitors)
      return
    }

    // Process logs to generate visitor data
    // This would be more sophisticated in a real implementation
    const visitorMap = new Map<string, VisitorData>()

    logs.forEach((log) => {
      if (!log.ip || !log.domain || log.domain === "-") return

      const visitorId = `${log.ip}-${log.domain}`

      if (!visitorMap.has(visitorId)) {
        // Generate a name from IP + domain
        const firstName = ["John", "Jane", "Robert", "Emily", "Michael", "Laura", "David", "Sarah"][
          Math.floor(Math.random() * 8)
        ]
        const lastName = ["Smith", "Doe", "Johnson", "Chen", "Brown", "Wilson", "Lee", "Miller"][
          Math.floor(Math.random() * 8)
        ]
        const name = `${firstName} ${lastName}`

        // Generate company name from domain
        const domain = log.domain.toLowerCase().replace("www.", "")
        const company =
          domain
            .split(".")[0]
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()) +
          (domain.includes(".com") ? " Inc." : domain.includes(".org") ? " Organization" : " Corp")

        // Generate email from name and domain
        const email = `${firstName.toLowerCase().charAt(0)}.${lastName.toLowerCase()}@${domain}`

        visitorMap.set(visitorId, {
          id: visitorId,
          name,
          email,
          company,
          domain,
          ip: log.ip,
          pages: 0,
          lastVisit: log.timestamp,
          timeOnSite: "0:00",
          leadScore: Math.floor(Math.random() * 100),
        })
      }

      const visitorData = visitorMap.get(visitorId)!

      // Count unique pages
      const uniquePages = new Set<string>()
      logs
        .filter((l) => l.ip === log.ip && l.domain === log.domain)
        .forEach((l) => {
          if (l.pageUrl) uniquePages.add(l.pageUrl)
        })

      visitorData.pages = uniquePages.size

      // Update last visit timestamp if newer
      if (new Date(log.timestamp) > new Date(visitorData.lastVisit)) {
        visitorData.lastVisit = log.timestamp
      }

      // Calculate time on site (simplified)
      // In a real implementation, this would be more accurate
      const timeOnSite =
        Math.floor(Math.random() * 30) +
        ":" +
        Math.floor(Math.random() * 60)
          .toString()
          .padStart(2, "0")
      visitorData.timeOnSite = timeOnSite
    })

    // Convert to array and sort
    let visitorsArray = Array.from(visitorMap.values())

    // Format lastVisit as relative time
    visitorsArray = visitorsArray.map((visitor) => {
      const lastVisitDate = new Date(visitor.lastVisit)
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
        ...visitor,
        lastVisit: lastVisitFormatted,
      }
    })

    // Sort by lead score (highest first)
    visitorsArray.sort((a, b) => b.leadScore - a.leadScore)

    setVisitors(visitorsArray)
  }, [logs])

  // Get unique companies for filters
  const companies = ["all", ...new Set(visitors.map((v) => v.company))]

  // Filter visitors based on search term and company filter
  const filteredVisitors = visitors.filter((visitor) => {
    if (companyFilter !== "all" && visitor.company !== companyFilter) return false

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        visitor.name.toLowerCase().includes(searchLower) ||
        visitor.email.toLowerCase().includes(searchLower) ||
        visitor.company.toLowerCase().includes(searchLower) ||
        visitor.ip.includes(searchTerm)
      )
    }

    return true
  })

  const handleViewVisitor = (domain: string) => {
    router.push(`/visitor/${encodeURIComponent(domain)}`)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Visitor List</CardTitle>
            <CardDescription>
              {filteredVisitors.length} {filteredVisitors.length === 1 ? "visitor" : "visitors"} found
            </CardDescription>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap gap-2">
            <Input
              placeholder="Search visitors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-auto"
            />
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies
                  .filter((c) => c !== "all")
                  .map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visitor</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Pages Viewed</TableHead>
                <TableHead>Time on Site</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Lead Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisitors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    <div className="flex flex-col items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No visitors found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredVisitors.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`/placeholder.svg?height=32&width=32&text=${visitor.name.charAt(0)}${visitor.name.split(" ")[1].charAt(0)}`}
                            alt={visitor.name}
                          />
                          <AvatarFallback>
                            {visitor.name.charAt(0)}
                            {visitor.name.split(" ")[1].charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{visitor.name}</div>
                          <div className="text-xs text-muted-foreground">{visitor.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{visitor.company}</TableCell>
                    <TableCell>{visitor.ip}</TableCell>
                    <TableCell>{visitor.pages}</TableCell>
                    <TableCell>{visitor.timeOnSite}</TableCell>
                    <TableCell>{visitor.lastVisit}</TableCell>
                    <TableCell>
                      <Badge
                        variant={visitor.leadScore > 80 ? "default" : visitor.leadScore > 60 ? "secondary" : "outline"}
                      >
                        {visitor.leadScore}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewVisitor(visitor.domain)}>
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
      </CardContent>
    </Card>
  )
}

