"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CompanyEnrichment } from "@/components/company-enrichment"
import { LeadScoring } from "@/components/lead-scoring"
import { VisitorJourney } from "@/components/visitor-journey"
import { TechStack } from "@/components/tech-stack"
import { SimilarCompanies } from "@/components/similar-companies"
import { CrmIntegration } from "@/components/crm-integration"

interface VisitorDetailProps {
  ip: string
  domain: string
  timestamp: string
  userAgent: string
}

export function VisitorDetail({ ip, domain, timestamp, userAgent }: VisitorDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Visitor Intelligence</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Add to CRM
          </Button>
          <Button size="sm">Contact Sales Rep</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CompanyEnrichment domain={domain} ip={ip} />
        <div className="space-y-6">
          <LeadScoring domain={domain} />
          <VisitorJourney domain={domain} ip={ip} />
        </div>
      </div>

      <Tabs defaultValue="tech-stack">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tech-stack">Technology Stack</TabsTrigger>
          <TabsTrigger value="similar-companies">Similar Companies</TabsTrigger>
          <TabsTrigger value="crm">CRM Integration</TabsTrigger>
        </TabsList>
        <TabsContent value="tech-stack">
          <TechStack domain={domain} />
        </TabsContent>
        <TabsContent value="similar-companies">
          <SimilarCompanies domain={domain} />
        </TabsContent>
        <TabsContent value="crm">
          <CrmIntegration domain={domain} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

