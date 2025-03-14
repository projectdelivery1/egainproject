"use client"

import { useState } from "react"
import { CircleCheck, CircleDashed, Clock, FileText, MousePointer, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface LeadScoringProps {
  domain: string
  pageViews?: number
  timeOnSite?: number
  downloadedContent?: boolean
  visitedPricing?: boolean
}

export function LeadScoring({
  domain,
  pageViews = 12,
  timeOnSite = 15,
  downloadedContent = true,
  visitedPricing = true,
}: LeadScoringProps) {
  const [expanded, setExpanded] = useState(false)

  // Calculate lead score based on behavior
  const calculateScore = () => {
    let score = 0

    // Page views: 1-5 (10pts), 6-10 (20pts), 11+ (30pts)
    if (pageViews >= 1 && pageViews <= 5) score += 10
    else if (pageViews >= 6 && pageViews <= 10) score += 20
    else if (pageViews > 10) score += 30

    // Time on site: 1-5min (10pts), 6-15min (20pts), 16+ (30pts)
    if (timeOnSite >= 1 && timeOnSite <= 5) score += 10
    else if (timeOnSite >= 6 && timeOnSite <= 15) score += 20
    else if (timeOnSite > 15) score += 30

    // Downloaded content: +20pts
    if (downloadedContent) score += 20

    // Visited pricing page: +20pts
    if (visitedPricing) score += 20

    return score
  }

  const score = calculateScore()
  const maxScore = 100
  const percentage = (score / maxScore) * 100

  // Determine lead quality based on score
  const getLeadQuality = () => {
    if (score >= 80) return { label: "Hot Lead", color: "text-red-500" }
    if (score >= 50) return { label: "Warm Lead", color: "text-amber-500" }
    return { label: "Cold Lead", color: "text-blue-500" }
  }

  const leadQuality = getLeadQuality()

  // Get recommendations based on lead score
  const getRecommendations = () => {
    if (score >= 80) {
      return ["Schedule a demo immediately", "Prepare a custom proposal", "Connect with decision makers on LinkedIn"]
    }
    if (score >= 50) {
      return ["Send personalized follow-up email", "Share relevant case studies", "Invite to upcoming webinar"]
    }
    return ["Add to nurture campaign", "Monitor for increased activity", "Share educational content"]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Lead Score</span>
          <span className={`text-lg font-bold ${leadQuality.color}`}>
            {score}/{maxScore}
          </span>
        </CardTitle>
        <CardDescription>AI-powered lead scoring based on visitor behavior</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Quality</span>
            <span className={`font-medium ${leadQuality.color}`}>{leadQuality.label}</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Scoring Factors</h4>

          <TooltipProvider>
            <div className="grid grid-cols-2 gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 text-sm">
                    <MousePointer className="h-4 w-4 text-muted-foreground" />
                    <span>Page Views:</span>
                    <span className="font-medium">{pageViews}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    1-5 views: 10pts
                    <br />
                    6-10 views: 20pts
                    <br />
                    11+ views: 30pts
                  </p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Time on Site:</span>
                    <span className="font-medium">{timeOnSite} min</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    1-5 min: 10pts
                    <br />
                    6-15 min: 20pts
                    <br />
                    16+ min: 30pts
                  </p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Downloaded Content:</span>
                    {downloadedContent ? (
                      <CircleCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <CircleDashed className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Downloaded content: +20pts</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    <span>Visited Pricing:</span>
                    {visitedPricing ? (
                      <CircleCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <CircleDashed className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Visited pricing page: +20pts</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>

        {expanded && (
          <div className="pt-2 space-y-3">
            <h4 className="text-sm font-medium">Recommended Actions</h4>
            <ul className="space-y-1">
              {getRecommendations().map((recommendation, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <CircleCheck className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show Less" : "Show Recommendations"}
        </Button>
      </CardContent>
    </Card>
  )
}

