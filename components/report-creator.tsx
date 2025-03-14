"use client"

import { useState, type ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ChevronRight, Clock, Download, FileBarChart, PieChart, BarChart, Users, Building2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ReportCreatorProps {
  children: ReactNode
}

export function ReportCreator({ children }: ReportCreatorProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    schedule: "one-time",
    format: "web",
    recipients: "",
  })
  const { toast } = useToast()

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    // Form validation
    if (!formData.title) {
      toast({
        title: "Error",
        description: "Report title is required",
        variant: "destructive",
      })
      return
    }

    // In a real application, this would be saved to a database or API
    // For now, we'll add a simple localStorage save
    try {
      // Get existing reports
      let savedReports = []
      const existingReports = localStorage.getItem("egain-reports")
      if (existingReports) {
        savedReports = JSON.parse(existingReports)
      }

      // Add new report
      const newReport = {
        id: `report-${Date.now()}`,
        title: formData.title,
        description: formData.description || `Report for ${formData.title}`,
        type: formData.type,
        createdAt: new Date().toISOString(),
        schedule: formData.schedule,
        format: formData.format,
        lastRun: new Date().toISOString(),
        createdBy: {
          name: "Sarah Connor",
          email: "s.connor@egain.com",
          avatar: "/avatars/01.png",
        },
      }

      savedReports.push(newReport)

      // Save reports
      localStorage.setItem("egain-reports", JSON.stringify(savedReports))

      toast({
        title: "Report created",
        description: "Your report has been successfully created and can be viewed on the Reports page.",
      })
    } catch (error) {
      console.error("Error saving report:", error)
      toast({
        title: "Failed to save report",
        description: "An error occurred, please try again.",
        variant: "destructive",
      })
    }

    // Reset form and close dialog
    setFormData({
      title: "",
      description: "",
      type: "",
      schedule: "one-time",
      format: "web",
      recipients: "",
    })
    setStep(1)
    setOpen(false)
  }

  const reportTemplates = [
    {
      id: "visitor-overview",
      title: "Visitor Overview",
      description: "Comprehensive analysis of all visitor activities",
      icon: <FileBarChart className="h-10 w-10 text-primary" />,
    },
    {
      id: "company-analysis",
      title: "Company Analysis",
      description: "Detailed analysis of visiting companies",
      icon: <Building2 className="h-10 w-10 text-blue-500" />,
    },
    {
      id: "lead-analysis",
      title: "Lead Analysis",
      description: "Analysis of leads and their quality",
      icon: <Users className="h-10 w-10 text-green-500" />,
    },
    {
      id: "page-performance",
      title: "Page Performance",
      description: "Performance analysis of your website pages",
      icon: <BarChart className="h-10 w-10 text-orange-500" />,
    },
    {
      id: "traffic-sources",
      title: "Traffic Sources",
      description: "Analysis of where your visitors are coming from",
      icon: <PieChart className="h-10 w-10 text-purple-500" />,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create New Report</DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Select a report template or create a custom report"
              : "Configure your report settings and delivery options"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              {reportTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    formData.type === template.id ? "border-primary ring-1 ring-primary" : ""
                  }`}
                  onClick={() => {
                    handleChange("type", template.id)
                    handleChange("title", template.title)
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-muted rounded-md">{template.icon}</div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <CardDescription className="mt-1">{template.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setStep(2)} disabled={!formData.type}>
                Continue
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Report Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter a title for your report"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="What does this report show?"
                  rows={2}
                />
              </div>

              <Tabs defaultValue="schedule">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="delivery">Delivery</TabsTrigger>
                </TabsList>

                <TabsContent value="schedule" className="space-y-4">
                  <div className="grid gap-2 pt-2">
                    <Label htmlFor="schedule">Report Frequency</Label>
                    <Select value={formData.schedule} onValueChange={(value) => handleChange("schedule", value)}>
                      <SelectTrigger id="schedule">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one-time">One-time (Run Now)</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.schedule !== "one-time" && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        First report will run immediately after creation
                      </span>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="delivery" className="space-y-4">
                  <div className="grid gap-2 pt-2">
                    <Label htmlFor="format">Report Format</Label>
                    <Select value={formData.format} onValueChange={(value) => handleChange("format", value)}>
                      <SelectTrigger id="format">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web">Web Dashboard</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="email">Email Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.format !== "web" && (
                    <div className="grid gap-2">
                      <Label htmlFor="recipients">Email Recipients</Label>
                      <Input
                        id="recipients"
                        value={formData.recipients}
                        onChange={(e) => handleChange("recipients", e.target.value)}
                        placeholder="email@example.com, another@example.com"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch id="auto-download" />
                    <Label htmlFor="auto-download" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span>Automatically download reports when generated</span>
                    </Label>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <DialogFooter>
              <div className="flex justify-between w-full">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={handleSubmit}>Create Report</Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

