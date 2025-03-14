"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface CrmIntegrationProps {
  domain: string
}

export function CrmIntegration({ domain }: CrmIntegrationProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleAddToSalesforce = () => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Added to Salesforce",
        description: `${domain.replace("www.", "")} has been added to Salesforce as a lead.`,
      })
    }, 1500)
  }

  const handleAddToHubspot = () => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Added to HubSpot",
        description: `${domain.replace("www.", "")} has been added to HubSpot as a lead.`,
      })
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>CRM Integration</CardTitle>
        <CardDescription>Add this company to your CRM system</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="salesforce">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="salesforce">Salesforce</TabsTrigger>
            <TabsTrigger value="hubspot">HubSpot</TabsTrigger>
          </TabsList>

          <TabsContent value="salesforce" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="sf-lead-type">Lead Type</Label>
              <Select defaultValue="new">
                <SelectTrigger id="sf-lead-type">
                  <SelectValue placeholder="Select lead type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New Lead</SelectItem>
                  <SelectItem value="existing">Existing Account</SelectItem>
                  <SelectItem value="opportunity">New Opportunity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sf-owner">Lead Owner</Label>
              <Select defaultValue="sarah">
                <SelectTrigger id="sf-owner">
                  <SelectValue placeholder="Select lead owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah">Sarah Connor</SelectItem>
                  <SelectItem value="john">John Smith</SelectItem>
                  <SelectItem value="emily">Emily Chen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sf-notes">Notes</Label>
              <Input id="sf-notes" placeholder="Add notes about this lead" />
            </div>

            <Button className="w-full" onClick={handleAddToSalesforce} disabled={loading}>
              {loading ? "Adding to Salesforce..." : "Add to Salesforce"}
            </Button>
          </TabsContent>

          <TabsContent value="hubspot" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="hs-pipeline">Pipeline</Label>
              <Select defaultValue="sales">
                <SelectTrigger id="hs-pipeline">
                  <SelectValue placeholder="Select pipeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Pipeline</SelectItem>
                  <SelectItem value="marketing">Marketing Pipeline</SelectItem>
                  <SelectItem value="partner">Partner Pipeline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hs-stage">Deal Stage</Label>
              <Select defaultValue="qualification">
                <SelectTrigger id="hs-stage">
                  <SelectValue placeholder="Select deal stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qualification">Qualification</SelectItem>
                  <SelectItem value="meeting">Meeting Scheduled</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hs-notes">Notes</Label>
              <Input id="hs-notes" placeholder="Add notes about this lead" />
            </div>

            <Button className="w-full" onClick={handleAddToHubspot} disabled={loading}>
              {loading ? "Adding to HubSpot..." : "Add to HubSpot"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

