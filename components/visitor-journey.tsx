"use client"

import { useState } from "react"
import { Clock, FileText, Home, Info, LayoutDashboard, MousePointer, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface VisitorJourneyProps {
  domain: string
  ip?: string
}

export function VisitorJourney({ domain, ip }: VisitorJourneyProps) {
  const [expanded, setExpanded] = useState(false)

  // Mock visitor journey data - in a real implementation, this would come from API calls
  const journeyData = [
    {
      date: "Mar 10, 2025",
      pages: [
        {
          path: "/",
          title: "Homepage",
          timeSpent: "1:45",
          icon: Home,
        },
        {
          path: "/products/knowledge-hub",
          title: "AI Knowledge Hub",
          timeSpent: "3:20",
          icon: LayoutDashboard,
        },
        {
          path: "/resources/case-studies/enterprise-ai",
          title: "Enterprise AI Case Study",
          timeSpent: "5:10",
          icon: FileText,
          isDownload: true,
        },
      ],
    },
    {
      date: "Mar 12, 2025",
      pages: [
        {
          path: "/products/knowledge-hub",
          title: "AI Knowledge Hub",
          timeSpent: "2:15",
          icon: LayoutDashboard,
        },
        {
          path: "/pricing",
          title: "Pricing Plans",
          timeSpent: "4:30",
          icon: ShoppingCart,
          isHighValue: true,
        },
        {
          path: "/company/about",
          title: "About eGain",
          timeSpent: "1:20",
          icon: Info,
        },
      ],
    },
  ]

  // Display only the most recent visit if not expanded
  const visibleJourneys = expanded ? journeyData : [journeyData[0]]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitor Journey</CardTitle>
        <CardDescription>Track the path visitors take through your website</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TooltipProvider>
          {visibleJourneys.map((journey, journeyIndex) => (
            <div key={journeyIndex} className="space-y-2">
              <div className="flex items-center">
                <Badge variant="outline" className="text-xs">
                  {journey.date}
                </Badge>
              </div>

              <div className="ml-2 space-y-2">
                {journey.pages.map((page, pageIndex) => (
                  <div key={pageIndex} className="relative">
                    {pageIndex < journey.pages.length - 1 && (
                      <div className="absolute left-4 top-8 h-6 w-0.5 bg-border" />
                    )}

                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                        <page.icon className="h-4 w-4" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-sm font-medium leading-none">
                                {page.title}
                                {page.isHighValue && (
                                  <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-red-500" />
                                )}
                                {page.isDownload && (
                                  <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-green-500" />
                                )}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              {page.isHighValue && <p>High-value page</p>}
                              {page.isDownload && <p>Content download</p>}
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{page.path}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {page.timeSpent}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </TooltipProvider>

        {journeyData.length > 1 && (
          <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Show Less" : `Show ${journeyData.length - 1} More Visits`}
          </Button>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <div className="flex items-center gap-2">
            <MousePointer className="h-3 w-3" />
            <span>Total Visits: {journeyData.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>Total Time: 18:20</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

