"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink } from "lucide-react"
import { useLogStore } from "@/lib/log-store"

interface VisitorData {
  id: string
  name: string
  email: string
  company: string
  pages: number
  lastVisit: string
  avatar: string
  domain: string
}

export function RecentVisitors() {
  const router = useRouter()
  const { logs } = useLogStore()
  const [visitors, setVisitors] = useState<VisitorData[]>([])

  useEffect(() => {
    if (logs.length === 0) {
      // Default data when no logs are available
      setVisitors([
        {
          id: "1",
          name: "John Smith",
          email: "john.smith@acme.com",
          company: "Acme Inc.",
          pages: 12,
          lastVisit: "10 minutes ago",
          avatar: "/avatars/01.png",
          domain: "acme.com",
        },
        {
          id: "2",
          name: "Jane Doe",
          email: "jane.doe@globex.com",
          company: "Globex Corporation",
          pages: 8,
          lastVisit: "25 minutes ago",
          avatar: "/avatars/02.png",
          domain: "globex.com",
        },
        {
          id: "3",
          name: "Robert Johnson",
          email: "r.johnson@initech.com",
          company: "Initech",
          pages: 15,
          lastVisit: "1 hour ago",
          avatar: "/avatars/03.png",
          domain: "initech.com",
        },
        {
          id: "4",
          name: "Emily Chen",
          email: "e.chen@massive.co",
          company: "Massive Dynamic",
          pages: 6,
          lastVisit: "2 hours ago",
          avatar: "/avatars/04.png",
          domain: "massive.co",
        },
        {
          id: "5",
          name: "Michael Brown",
          email: "m.brown@umbrella.org",
          company: "Umbrella Corp",
          pages: 9,
          lastVisit: "3 hours ago",
          avatar: "/avatars/05.png",
          domain: "umbrella.org",
        },
      ])
      return
    }

    // Process logs to generate recent visitors
    const visitorsByDomain: Record<
      string,
      {
        domain: string
        pages: string[]
        timestamps: string[]
        latestTimestamp: Date | null
      }
    > = {}

    // Group logs by domain and collect page visits
    logs.forEach((log) => {
      if (!log.domain || log.domain === "-") return

      if (!visitorsByDomain[log.domain]) {
        visitorsByDomain[log.domain] = {
          domain: log.domain,
          pages: [],
          timestamps: [],
          latestTimestamp: null,
        }
      }

      // Add page if not already added
      if (log.pageUrl && !visitorsByDomain[log.domain].pages.includes(log.pageUrl)) {
        visitorsByDomain[log.domain].pages.push(log.pageUrl)
      }

      // Add timestamp
      visitorsByDomain[log.domain].timestamps.push(log.timestamp)

      // Update latest timestamp
      try {
        const timestamp = new Date(log.timestamp)
        if (!isNaN(timestamp.getTime())) {
          if (
            !visitorsByDomain[log.domain].latestTimestamp ||
            timestamp > visitorsByDomain[log.domain].latestTimestamp
          ) {
            visitorsByDomain[log.domain].latestTimestamp = timestamp
          }
        }
      } catch (error) {
        // Skip invalid timestamps
      }
    })

    // Convert to visitor data format and sort by latest visit
    const visitorData = Object.values(visitorsByDomain)
      .filter((visitor) => visitor.pages.length > 0)
      .sort((a, b) => {
        if (!a.latestTimestamp) return 1
        if (!b.latestTimestamp) return -1
        return b.latestTimestamp.getTime() - a.latestTimestamp.getTime()
      })
      .slice(0, 5) // Take top 5 most recent
      .map((visitor, index) => {
        // Generate visitor name from domain
        const company =
          visitor.domain
            .replace("www.", "")
            .split(".")[0]
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()) +
          (visitor.domain.includes(".com") ? " Inc." : visitor.domain.includes(".org") ? " Organization" : " Corp")

        // Generate a random name
        const firstNames = ["John", "Jane", "Robert", "Emily", "Michael", "Sarah", "David", "Lisa"]
        const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Wilson"]
        const name = `${firstNames[index % firstNames.length]} ${lastNames[index % lastNames.length]}`

        // Format last visit time
        let lastVisit = "Unknown"
        if (visitor.latestTimestamp) {
          const now = new Date()
          const diff = now.getTime() - visitor.latestTimestamp.getTime()
          const minutes = Math.floor(diff / 60000)

          if (minutes < 60) {
            lastVisit = `${minutes} minute${minutes !== 1 ? "s" : ""} ago`
          } else {
            const hours = Math.floor(minutes / 60)
            if (hours < 24) {
              lastVisit = `${hours} hour${hours !== 1 ? "s" : ""} ago`
            } else {
              const days = Math.floor(hours / 24)
              lastVisit = `${days} day${days !== 1 ? "s" : ""} ago`
            }
          }
        }

        return {
          id: `visitor-${index}`,
          name,
          email: `${name.toLowerCase().replace(" ", ".")}@${visitor.domain.replace("www.", "")}`,
          company,
          pages: visitor.pages.length,
          lastVisit,
          avatar: `/placeholder.svg?height=32&width=32&text=${name.charAt(0)}${name.split(" ")[1].charAt(0)}`,
          domain: visitor.domain,
        }
      })

    setVisitors(
      visitorData.length > 0
        ? visitorData
        : [
            {
              id: "no-data",
              name: "No Visitors",
              email: "no.data@example.com",
              company: "No Data Available",
              pages: 0,
              lastVisit: "N/A",
              avatar: "/placeholder.svg?height=32&width=32",
              domain: "example.com",
            },
          ],
    )
  }, [logs])

  const handleViewVisitor = (domain: string) => {
    router.push(`/visitor/${encodeURIComponent(domain)}`)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Visitor</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Pages Viewed</TableHead>
          <TableHead>Last Visit</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visitors.map((visitor) => (
          <TableRow key={visitor.id}>
            <TableCell className="font-medium">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={visitor.avatar} alt={visitor.name} />
                  <AvatarFallback>{visitor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{visitor.name}</div>
                  <div className="text-xs text-muted-foreground">{visitor.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>{visitor.company}</TableCell>
            <TableCell>{visitor.pages}</TableCell>
            <TableCell>{visitor.lastVisit}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" onClick={() => handleViewVisitor(visitor.domain)}>
                <ExternalLink className="h-4 w-4 mr-1" />
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

