"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SimilarCompaniesProps {
  domain: string
}

export function SimilarCompanies({ domain }: SimilarCompaniesProps) {
  // Mock similar companies data - in a real implementation, this would come from an API
  const similarCompanies = [
    {
      name: "TechCorp Inc.",
      domain: "techcorp.com",
      logo: "/placeholder.svg?height=40&width=40",
      industry: "Software & Technology",
      size: "1000-5000",
      match: 92,
      isCustomer: false,
    },
    {
      name: "DataSystems Ltd",
      domain: "datasystems.io",
      logo: "/placeholder.svg?height=40&width=40",
      industry: "Software & Technology",
      size: "500-1000",
      match: 87,
      isCustomer: true,
    },
    {
      name: "CloudWorks",
      domain: "cloudworks.net",
      logo: "/placeholder.svg?height=40&width=40",
      industry: "Cloud Services",
      size: "1000-5000",
      match: 85,
      isCustomer: false,
    },
    {
      name: "AI Solutions",
      domain: "aisolutions.com",
      logo: "/placeholder.svg?height=40&width=40",
      industry: "Artificial Intelligence",
      size: "100-500",
      match: 82,
      isCustomer: true,
    },
    {
      name: "Enterprise Tech",
      domain: "enterprisetech.com",
      logo: "/placeholder.svg?height=40&width=40",
      industry: "Enterprise Software",
      size: "5000+",
      match: 78,
      isCustomer: false,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Similar Companies</CardTitle>
        <CardDescription>
          Companies similar to {domain.replace("www.", "")} that might be interested in eGain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {similarCompanies.map((company) => (
            <div key={company.domain} className="flex items-center justify-between p-2 border rounded-md">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={company.logo} alt={company.name} />
                  <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{company.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{company.industry}</span>
                    <span>•</span>
                    <span>{company.size} employees</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {company.isCustomer ? (
                  <Badge variant="secondary">Customer</Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50">
                    {company.match}% Match
                  </Badge>
                )}
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Data sourced from ZoomInfo and Apollo.io</p>
        </div>
      </CardContent>
    </Card>
  )
}

