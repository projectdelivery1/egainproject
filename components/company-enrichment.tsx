"use client"

import { useState } from "react"
import { Building2, Globe, Users, Briefcase, Database, ExternalLink, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface CompanyEnrichmentProps {
  domain: string
  ip?: string
}

export function CompanyEnrichment({ domain, ip }: CompanyEnrichmentProps) {
  const [loading, setLoading] = useState(false)
  const [enriched, setEnriched] = useState(false)
  const { toast } = useToast()

  // Örnek şirket verileri - gerçek uygulamada bu veriler API çağrılarından gelecektir
  const companyData = {
    name:
      domain === "www.acme.com"
        ? "Acme Corporation"
        : domain.replace("www.", "").split(".")[0].charAt(0).toUpperCase() +
          domain.replace("www.", "").split(".")[0].slice(1),
    logo: "/placeholder.svg?height=80&width=80",
    description: "A leading enterprise software company specializing in customer engagement solutions.",
    industry: "Software & Technology",
    size: "1000-5000 employees",
    location: "San Francisco, CA",
    founded: "1995",
    revenue: "$100M-$500M",
    website: `https://${domain}`,
    technologies: ["Salesforce", "HubSpot", "AWS", "React", "Node.js", "PostgreSQL"],
    socialProfiles: {
      linkedin: `https://linkedin.com/company/${domain.replace("www.", "").split(".")[0]}`,
      twitter: `https://twitter.com/${domain.replace("www.", "").split(".")[0]}`,
    },
    contacts: [
      { name: "John Smith", title: "CTO", email: `john.smith@${domain.replace("www.", "")}` },
      {
        name: "Sarah Johnson",
        title: "VP of Customer Success",
        email: `sarah.johnson@${domain.replace("www.", "")}`,
      },
    ],
    funding: "$75M Series C (2022)",
    competitors: ["Zendesk", "Freshworks", "ServiceNow"],
  }

  const handleEnrich = () => {
    setLoading(true)

    // API çağrısı gecikmesi simülasyonu
    setTimeout(() => {
      setLoading(false)
      setEnriched(true)

      toast({
        title: "Company Data Enriched",
        description: `Successfully retrieved company data for ${domain}.`,
      })
    }, 1500)
  }

  if (!enriched && !loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Enrich visitor data with company information</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Enhance your visitor insights</h3>
          <p className="text-sm text-center text-muted-foreground mb-4">
            Enrich this domain to get detailed company information, technologies used, and potential contacts.
          </p>
          <Button onClick={handleEnrich}>Enrich {domain}</Button>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Fetching data from multiple sources...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex flex-wrap gap-2 mt-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-28" />
          </div>
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{companyData.name}</CardTitle>
            <CardDescription>{domain}</CardDescription>
          </div>
          <img
            src={companyData.logo || "/placeholder.svg"}
            alt={`${companyData.name} logo`}
            className="h-12 w-12 rounded-md border"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tech">Technology</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            <p className="text-sm">{companyData.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{companyData.industry}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{companyData.size}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{companyData.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{companyData.revenue}</span>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2">Competitors</h4>
              <div className="flex flex-wrap gap-2">
                {companyData.competitors.map((competitor) => (
                  <Badge key={competitor} variant="outline">
                    {competitor}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tech" className="pt-4">
            <h4 className="text-sm font-medium mb-3">Technologies Used</h4>
            <div className="flex flex-wrap gap-2">
              {companyData.technologies.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Data sourced from BuiltWith and Wappalyzer</p>
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="pt-4">
            <h4 className="text-sm font-medium mb-3">Key Contacts</h4>
            <div className="space-y-3">
              {companyData.contacts.map((contact) => (
                <div key={contact.email} className="flex justify-between items-center p-2 border rounded-md">
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.title}</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Data sourced from Hunter.io and LinkedIn</p>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="pt-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Finansman Durumu</h4>
                <p className="text-sm">{companyData.funding}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Satın Alma Sinyalleri</h4>
                <ul className="text-sm space-y-1">
                  <li>• Son zamanlarda fiyatlandırma sayfalarını birden çok kez ziyaret etti</li>
                  <li>• AI bilgi yönetimi hakkında teknik doküman indirdi</li>
                  <li>• Rakiple olan mevcut sözleşme 3 ay içinde sona eriyor</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Sosyal Profiller</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={companyData.socialProfiles.linkedin} target="_blank" rel="noopener noreferrer">
                      LinkedIn <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={companyData.socialProfiles.twitter} target="_blank" rel="noopener noreferrer">
                      Twitter <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <p>Data enriched from Clearbit, ZoomInfo and open sources</p>
      </CardFooter>
    </Card>
  )
}

