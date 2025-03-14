"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { useLogStore } from "@/lib/log-store"

interface PageData {
  path: string
  title: string
  views: number
  percentage: number
}

export function TopPages() {
  const { logs } = useLogStore()
  const [pages, setPages] = useState<PageData[]>([])

  useEffect(() => {
    if (logs.length === 0) {
      // Default data when no logs are available
      setPages([
        {
          path: "/products/knowledge-hub",
          title: "AI Knowledge Hub",
          views: 1245,
          percentage: 100,
        },
        {
          path: "/solutions/customer-service",
          title: "Customer Service Solutions",
          views: 986,
          percentage: 79,
        },
        {
          path: "/pricing",
          title: "Pricing Plans",
          views: 879,
          percentage: 71,
        },
        {
          path: "/resources/case-studies",
          title: "Case Studies",
          views: 654,
          percentage: 53,
        },
        {
          path: "/contact",
          title: "Contact Us",
          views: 521,
          percentage: 42,
        },
      ])
      return
    }

    // Process logs to find top pages
    const pageViews: Record<string, number> = {}

    // Count page views
    logs.forEach((log) => {
      if (log.pageUrl && log.pageUrl !== "-") {
        pageViews[log.pageUrl] = (pageViews[log.pageUrl] || 0) + 1
      }
    })

    // Convert to array and sort by views
    const sortedPages = Object.entries(pageViews)
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5) // Take top 5

    // Calculate percentages
    const maxViews = sortedPages.length > 0 ? sortedPages[0].views : 0

    // Map to page data format
    const pageData: PageData[] = sortedPages.map(({ path, views }) => {
      // Generate a title from the path
      let title = path === "/" ? "Homepage" : path.split("/").pop() || path
      title = title.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

      return {
        path,
        title,
        views,
        percentage: Math.round((views / maxViews) * 100),
      }
    })

    setPages(
      pageData.length > 0
        ? pageData
        : [
            {
              path: "No data available",
              title: "No Pages Found",
              views: 0,
              percentage: 0,
            },
          ],
    )
  }, [logs])

  return (
    <div className="space-y-8">
      {pages.map((page) => (
        <div className="flex items-center" key={page.path}>
          <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <FileText className="h-5 w-5" />
          </div>
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium leading-none">{page.title}</p>
            <p className="text-xs text-muted-foreground">{page.path}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <div className="h-2 bg-primary" style={{ width: `${page.percentage}%` }} />
              <span className="ml-2">{page.views} views</span>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            Details
          </Button>
        </div>
      ))}
    </div>
  )
}

