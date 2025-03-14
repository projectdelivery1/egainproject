"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Check, Filter, Search, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function LeadAssignment() {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [selectedRep, setSelectedRep] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterScore, setFilterScore] = useState("all")
  const { toast } = useToast()

  // Sample data for sales representatives
  const salesReps = [
    {
      id: "1",
      name: "Sarah Connor",
      email: "s.connor@egain.com",
      avatar: "/avatars/01.png",
      assignedLeads: 28,
      capacity: 40,
      performance: 92,
    },
    {
      id: "2",
      name: "John Smith",
      email: "j.smith@egain.com",
      avatar: "/avatars/02.png",
      assignedLeads: 32,
      capacity: 45,
      performance: 87,
    },
    {
      id: "3",
      name: "Emily Chen",
      email: "e.chen@egain.com",
      avatar: "/avatars/03.png",
      assignedLeads: 24,
      capacity: 35,
      performance: 95,
    },
    {
      id: "4",
      name: "Robert Johnson",
      email: "r.johnson@egain.com",
      avatar: "/avatars/04.png",
      assignedLeads: 18,
      capacity: 30,
      performance: 78,
    },
  ]

  // Sample data for unassigned leads
  const unassignedLeads = [
    {
      id: "lead1",
      name: "Alex Johnson",
      company: "TechCorp Inc.",
      email: "alex.j@techcorp.com",
      leadScore: 92,
      source: "Website",
      lastActivity: "2 hours ago",
      ip: "145.223.99.10",
      location: "New York, USA",
    },
    {
      id: "lead2",
      name: "Maria Garcia",
      company: "Innovations LLC",
      email: "mgarcia@innovations.co",
      leadScore: 85,
      source: "LinkedIn",
      lastActivity: "1 day ago",
      ip: "192.168.1.45",
      location: "San Francisco, USA",
    },
    {
      id: "lead3",
      name: "David Kim",
      company: "Global Solutions",
      email: "dkim@globalsolutions.org",
      leadScore: 78,
      source: "Website",
      lastActivity: "3 days ago",
      ip: "203.45.67.89",
      location: "London, UK",
    },
    {
      id: "lead4",
      name: "Sophia Chen",
      company: "DataTech Systems",
      email: "schen@datatech.io",
      leadScore: 75,
      source: "Webinar",
      lastActivity: "5 days ago",
      ip: "157.240.22.35",
      location: "Singapore",
    },
    {
      id: "lead5",
      name: "James Wilson",
      company: "Apex Networks",
      email: "jwilson@apex.net",
      leadScore: 68,
      source: "Email Campaign",
      lastActivity: "1 week ago",
      ip: "104.132.45.78",
      location: "Toronto, Canada",
    },
  ]

  // Filter leads based on search query and score filter
  const filteredLeads = unassignedLeads.filter((lead) => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesName = lead.name.toLowerCase().includes(query)
      const matchesCompany = lead.company.toLowerCase().includes(query)
      const matchesEmail = lead.email.toLowerCase().includes(query)
      const matchesIP = lead.ip.includes(query)

      if (!(matchesName || matchesCompany || matchesEmail || matchesIP)) {
        return false
      }
    }

    // Filter by lead score
    if (filterScore === "high") {
      return lead.leadScore >= 80
    } else if (filterScore === "medium") {
      return lead.leadScore >= 60 && lead.leadScore < 80
    } else if (filterScore === "low") {
      return lead.leadScore < 60
    }

    return true
  })

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads((prev) => (prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]))
  }

  const selectAllLeads = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([])
    } else {
      setSelectedLeads(filteredLeads.map((lead) => lead.id))
    }
  }

  const handleAssignLeads = () => {
    if (!selectedRep) {
      toast({
        title: "No sales representative selected",
        description: "Please select a sales representative to assign leads to.",
        variant: "destructive",
      })
      return
    }

    if (selectedLeads.length === 0) {
      toast({
        title: "No leads selected",
        description: "Please select at least one lead to assign.",
        variant: "destructive",
      })
      return
    }

    const rep = salesReps.find((rep) => rep.id === selectedRep)

    toast({
      title: "Leads Assigned Successfully",
      description: `${selectedLeads.length} leads assigned to ${rep?.name}.`,
    })

    // Reset selections
    setSelectedLeads([])
    setSelectedRep("")
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Lead Assignment</CardTitle>
          <CardDescription>Assign unassigned leads to sales representatives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="sales-rep">Select Sales Representative</Label>
                <Select value={selectedRep} onValueChange={setSelectedRep}>
                  <SelectTrigger id="sales-rep" className="mt-1">
                    <SelectValue placeholder="Select a sales representative" />
                  </SelectTrigger>
                  <SelectContent>
                    {salesReps.map((rep) => (
                      <SelectItem key={rep.id} value={rep.id}>
                        {rep.name} ({rep.assignedLeads}/{rep.capacity} leads)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Label>Selected Leads</Label>
                <div className="flex items-center mt-1 h-10">
                  <Badge variant="outline" className="mr-2">
                    {selectedLeads.length} leads selected
                  </Badge>
                  {selectedLeads.length > 0 && (
                    <Button size="sm" onClick={handleAssignLeads}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Assign Leads
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {selectedRep && (
              <div className="bg-muted p-4 rounded-md">
                <div className="flex items-center space-x-4">
                  {(() => {
                    const rep = salesReps.find((r) => r.id === selectedRep)
                    if (!rep) return null

                    return (
                      <>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={rep.avatar} alt={rep.name} />
                          <AvatarFallback>{rep.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium">{rep.name}</h3>
                          <p className="text-sm text-muted-foreground">{rep.email}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            Lead Capacity: {rep.assignedLeads}/{rep.capacity}
                          </div>
                          <Progress value={(rep.assignedLeads / rep.capacity) * 100} className="h-2 w-32 mt-1" />
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unassigned Leads</CardTitle>
          <CardDescription>Leads that have not been assigned to any sales representative</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, company, email or IP..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterScore} onValueChange={setFilterScore}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scores</SelectItem>
                <SelectItem value="high">High (80+)</SelectItem>
                <SelectItem value="medium">Medium (60-79)</SelectItem>
                <SelectItem value="low">Low (Below 60)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                        onChange={selectAllLeads}
                      />
                    </div>
                  </TableHead>
                  <TableHead>Lead</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Last Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Filter className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No leads match your filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => toggleLeadSelection(lead.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-xs text-muted-foreground flex flex-col">
                            <span>{lead.company}</span>
                            <span>{lead.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={lead.leadScore >= 80 ? "default" : lead.leadScore >= 60 ? "secondary" : "outline"}
                        >
                          {lead.leadScore}%
                        </Badge>
                      </TableCell>
                      <TableCell>{lead.source}</TableCell>
                      <TableCell>{lead.ip}</TableCell>
                      <TableCell>{lead.location}</TableCell>
                      <TableCell>{lead.lastActivity}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredLeads.length} of {unassignedLeads.length} leads
          </div>
          {selectedLeads.length > 0 && (
            <Button onClick={handleAssignLeads}>
              <Check className="mr-2 h-4 w-4" />
              Assign {selectedLeads.length} Selected Leads
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

