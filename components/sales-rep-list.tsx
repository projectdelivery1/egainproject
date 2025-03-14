"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Mail, MoreHorizontal, PlusCircle, Trash, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Example sales representatives data
const initialSalesReps = [
  {
    id: "1",
    name: "Sarah Connor",
    email: "s.connor@egain.com",
    avatar: "/avatars/01.png",
    status: "Active",
    assignedLeads: 28,
    assignedAccounts: 12,
    activeDeals: 5,
    territory: "Western Region",
  },
  {
    id: "2",
    name: "John Smith",
    email: "j.smith@egain.com",
    avatar: "/avatars/02.png",
    status: "Active",
    assignedLeads: 32,
    assignedAccounts: 15,
    activeDeals: 7,
    territory: "Eastern Region",
  },
  {
    id: "3",
    name: "Emily Chen",
    email: "e.chen@egain.com",
    avatar: "/avatars/03.png",
    status: "Active",
    assignedLeads: 24,
    assignedAccounts: 10,
    activeDeals: 3,
    territory: "Central Region",
  },
  {
    id: "4",
    name: "Robert Johnson",
    email: "r.johnson@egain.com",
    avatar: "/avatars/04.png",
    status: "Inactive",
    assignedLeads: 0,
    assignedAccounts: 8,
    activeDeals: 0,
    territory: "Southeast",
  },
  {
    id: "5",
    name: "Olivia Taylor",
    email: "o.taylor@egain.com",
    avatar: "/avatars/05.png",
    status: "Active",
    assignedLeads: 18,
    assignedAccounts: 6,
    activeDeals: 2,
    territory: "Southwest",
  },
]

// Example unassigned leads
const unassignedLeads = [
  {
    id: "lead1",
    name: "Alex Johnson",
    company: "TechCorp Inc.",
    email: "alex.j@techcorp.com",
    leadScore: 92,
    source: "Website",
  },
  {
    id: "lead2",
    name: "Maria Garcia",
    company: "Innovations LLC",
    email: "mgarcia@innovations.co",
    leadScore: 85,
    source: "LinkedIn",
  },
  {
    id: "lead3",
    name: "David Kim",
    company: "Global Solutions",
    email: "dkim@globalsolutions.org",
    leadScore: 78,
    source: "Website",
  },
  {
    id: "lead4",
    name: "Sophia Chen",
    company: "DataTech Systems",
    email: "schen@datatech.io",
    leadScore: 75,
    source: "Webinar",
  },
  {
    id: "lead5",
    name: "James Wilson",
    company: "Apex Networks",
    email: "jwilson@apex.net",
    leadScore: 68,
    source: "Email Campaign",
  },
]

export function SalesRepList() {
  const [salesReps, setSalesReps] = useState(initialSalesReps)
  const [selectedRep, setSelectedRep] = useState<(typeof initialSalesReps)[0] | null>(null)
  const [viewMode, setViewMode] = useState("reps")
  const [newSalesRepOpen, setNewSalesRepOpen] = useState(false)
  const [assignLeadsOpen, setAssignLeadsOpen] = useState(false)
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [selectedRepForLeads, setSelectedRepForLeads] = useState("")
  const { toast } = useToast()

  const handleEditRep = (rep: (typeof initialSalesReps)[0]) => {
    setSelectedRep(rep)
    // In a real application, this would open an editing dialog
    toast({
      title: "Edit Sales Representative",
      description: `Editing ${rep.name}'s information`,
    })
  }

  const handleDeleteRep = (repId: string) => {
    setSalesReps(salesReps.filter((rep) => rep.id !== repId))
    toast({
      title: "Sales Representative Removed",
      description: "Sales representative has been removed from the system.",
    })
  }

  const handleAssignLeads = () => {
    setAssignLeadsOpen(true)
  }

  const confirmAssignLeads = () => {
    if (!selectedRepForLeads || selectedLeads.length === 0) {
      toast({
        title: "Leads cannot be assigned",
        description: "Please select both a sales representative and at least one lead.",
        variant: "destructive",
      })
      return
    }

    // Update the selected representative's lead count
    setSalesReps((prevReps) =>
      prevReps.map((rep) =>
        rep.id === selectedRepForLeads ? { ...rep, assignedLeads: rep.assignedLeads + selectedLeads.length } : rep,
      ),
    )

    toast({
      title: "Leads Assigned",
      description: `${selectedLeads.length} leads assigned to representative ${salesReps.find((rep) => rep.id === selectedRepForLeads)?.name}.`,
    })

    setSelectedLeads([])
    setSelectedRepForLeads("")
    setAssignLeadsOpen(false)
  }

  const handleAddSalesRep = (formData: FormData) => {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const territory = formData.get("territory") as string

    if (!name || !email) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newRep = {
      id: `new-${Date.now()}`,
      name,
      email,
      avatar: "/placeholder.svg?height=32&width=32",
      status: "Aktif",
      assignedLeads: 0,
      assignedAccounts: 0,
      activeDeals: 0,
      territory: territory || "Atanmamış",
    }

    setSalesReps([...salesReps, newRep])
    setNewSalesRepOpen(false)

    toast({
      title: "Sales Representative Added",
      description: `${name} has been added as a sales representative.`,
    })
  }

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads((prev) => (prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Sales Representatives</CardTitle>
            <CardDescription>Manage your sales team and lead assignments</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Dialog open={assignLeadsOpen} onOpenChange={setAssignLeadsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={handleAssignLeads}>
                  Potansiyel Müşteri Ata
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Potansiyel Müşterileri Satış Temsilcisine Ata</DialogTitle>
                  <DialogDescription>Potansiyel müşterileri seçin ve bir satış temsilcisine atayın.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sales-rep">Satış Temsilcisi Seçin</Label>
                    <Select value={selectedRepForLeads} onValueChange={setSelectedRepForLeads}>
                      <SelectTrigger id="sales-rep">
                        <SelectValue placeholder="Bir satış temsilcisi seçin..." />
                      </SelectTrigger>
                      <SelectContent>
                        {salesReps
                          .filter((rep) => rep.status === "Active")
                          .map((rep) => (
                            <SelectItem key={rep.id} value={rep.id}>
                              {rep.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead>İsim</TableHead>
                          <TableHead>Şirket</TableHead>
                          <TableHead>Potansiyel Değeri</TableHead>
                          <TableHead>Kaynak</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {unassignedLeads.map((lead) => (
                          <TableRow key={lead.id}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedLeads.includes(lead.id)}
                                onChange={() => toggleLeadSelection(lead.id)}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                            </TableCell>
                            <TableCell className="font-medium">{lead.name}</TableCell>
                            <TableCell>{lead.company}</TableCell>
                            <TableCell>
                              <Badge variant={lead.leadScore > 80 ? "default" : "outline"}>{lead.leadScore}%</Badge>
                            </TableCell>
                            <TableCell>{lead.source}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setAssignLeadsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={confirmAssignLeads}>Assign Selected Leads</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={newSalesRepOpen} onOpenChange={setNewSalesRepOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Satış Temsilcisi Ekle
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Sales Representative</DialogTitle>
                  <DialogDescription>Add a new sales representative to the system.</DialogDescription>
                </DialogHeader>
                <form action={handleAddSalesRep}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" placeholder="John Doe" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="john.doe@egain.com" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="territory">Region</Label>
                      <Select name="territory">
                        <SelectTrigger id="territory">
                          <SelectValue placeholder="Bir bölge seçin..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Western Region">Western Region</SelectItem>
                          <SelectItem value="Eastern Region">Eastern Region</SelectItem>
                          <SelectItem value="Central Region">Central Region</SelectItem>
                          <SelectItem value="Southwest">Southwest</SelectItem>
                          <SelectItem value="Southeast">Southeast</SelectItem>
                          <SelectItem value="International">International</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Satış Temsilcisi Ekle</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={viewMode} onValueChange={setViewMode} className="space-y-4">
          <TabsList>
            <TabsTrigger value="reps">Sales Representatives</TabsTrigger>
            <TabsTrigger value="assignments">Lead Assignments</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="reps">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Assigned Leads</TableHead>
                    <TableHead>Active Deals</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesReps.map((rep) => (
                    <TableRow key={rep.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={rep.avatar} alt={rep.name} />
                            <AvatarFallback>{rep.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{rep.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{rep.email}</TableCell>
                      <TableCell>
                        <Badge variant={rep.status === "Active" ? "default" : "secondary"}>{rep.status}</Badge>
                      </TableCell>
                      <TableCell>{rep.territory}</TableCell>
                      <TableCell>{rep.assignedLeads}</TableCell>
                      <TableCell>{rep.activeDeals}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">İşlemler</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditRep(rep)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => (window.location.href = `mailto:${rep.email}`)}>
                              <Mail className="mr-2 h-4 w-4" />
                              Contact
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteRep(rep.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="assignments">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {salesReps
                .filter((rep) => rep.status === "Active")
                .map((rep) => (
                  <Card key={rep.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={rep.avatar} alt={rep.name} />
                            <AvatarFallback>{rep.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <CardTitle className="text-base">{rep.name}</CardTitle>
                        </div>
                        <Badge variant="outline">{rep.territory}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Assigned Leads</span>
                          <span className="font-medium">{rep.assignedLeads}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Assigned Accounts</span>
                          <span className="font-medium">{rep.assignedAccounts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Active Deals</span>
                          <span className="font-medium">{rep.activeDeals}</span>
                        </div>
                      </div>
                    </CardContent>
                    <div className="border-t p-3 bg-muted/50">
                      <Button variant="outline" size="sm" className="w-full">
                        <User className="mr-2 h-4 w-4" />
                        View Assignments
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              Sales representative performance metrics will be displayed here
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

