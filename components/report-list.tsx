"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, EyeIcon, FileBarChart, FileText, PieChart, Share2, Trash } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

// Sample report data - in a real application, this would come from a database or API
const sampleReports = [
  {
    id: "1",
    title: "Monthly Visitor Summary - March 2025",
    description: "Comprehensive analysis of all visitor activities for March 2025",
    type: "visitor-overview",
    icon: <FileBarChart className="h-8 w-8 text-primary" />,
    createdAt: "2025-03-14T10:30:00Z",
    createdBy: {
      name: "Sarah Connor",
      email: "s.connor@egain.com",
      avatar: "/avatars/01.png",
    },
    schedule: "Monthly",
    lastRun: "2025-03-14T10:30:00Z",
  },
  {
    id: "2",
    title: "High-Value Leads - 2025 Q1",
    description: "Analysis of high-value leads identified in Q1 2025",
    type: "lead-analysis",
    icon: <PieChart className="h-8 w-8 text-green-500" />,
    createdAt: "2025-03-10T14:15:00Z",
    createdBy: {
      name: "John Smith",
      email: "j.smith@egain.com",
      avatar: "/avatars/02.png",
    },
    schedule: "Quarterly",
    lastRun: "2025-03-10T14:15:00Z",
  },
  {
    id: "3",
    title: "Competitor Website Activity",
    description: "Analysis of visitors from competitor domains and their browsing patterns",
    type: "competitor-analysis",
    icon: <FileText className="h-8 w-8 text-blue-500" />,
    createdAt: "2025-03-08T09:45:00Z",
    createdBy: {
      name: "Emily Chen",
      email: "e.chen@egain.com",
      avatar: "/avatars/03.png",
    },
    schedule: "Weekly",
    lastRun: "2025-03-13T09:45:00Z",
  },
]

export function ReportList() {
  const [reports, setReports] = useState<any[]>([])

  // Load reports in useState hook
  useEffect(() => {
    // Get saved reports from localStorage
    try {
      const savedReports = localStorage.getItem("egain-reports")
      if (savedReports) {
        const parsedReports = JSON.parse(savedReports)
        setReports([...parsedReports, ...sampleReports])
      } else {
        setReports(sampleReports)
      }
    } catch (error) {
      console.error("Error loading reports:", error)
    }
  }, [])

  const handleDeleteReport = (id: string) => {
    // Delete report from both state and localStorage
    try {
      const updatedReports = reports.filter((report) => report.id !== id)
      setReports(updatedReports)

      // Filter out sample reports
      const sampleIds = sampleReports.map((report) => report.id)
      const updatedSavedReports = updatedReports.filter((report) => !sampleIds.includes(report.id))

      // Update localStorage
      localStorage.setItem("egain-reports", JSON.stringify(updatedSavedReports))

      toast({
        title: "Report Deleted",
        description: "Report was successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting report:", error)
      toast({
        title: "Failed to delete report",
        description: "An error occurred, please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <FileBarChart className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No reports found</h3>
          <p className="text-sm text-center text-muted-foreground mb-4 max-w-md">
            Create your first report to start analyzing visitor data in a structured format.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList>
        <TabsTrigger value="all">All Reports</TabsTrigger>
        <TabsTrigger value="my">My Reports</TabsTrigger>
        <TabsTrigger value="shared">Shared With Me</TabsTrigger>
        <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="p-2 bg-muted rounded-md">{report.icon}</div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <CardTitle>{report.title}</CardTitle>
                  <Badge variant="outline">{report.schedule}</Badge>
                </div>
                <CardDescription className="mt-1.5">{report.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={report.createdBy.avatar} alt={report.createdBy.name} />
                    <AvatarFallback>{report.createdBy.name[0]}</AvatarFallback>
                  </Avatar>
                  Created by: {report.createdBy.name}, {formatDate(report.createdAt)}
                </div>
                <div>Last run: {formatDate(report.lastRun)}</div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 flex justify-end space-x-2">
              <Button variant="outline" size="sm">
                <EyeIcon className="mr-2 h-4 w-4" />
                View
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will permanently delete the report "{report.title}". This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteReport(report.id)}
                      className="bg-destructive text-destructive-foreground"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </TabsContent>
      <TabsContent value="my" className="space-y-4">
        {reports
          .filter((report) => report.createdBy.email === "s.connor@egain.com")
          .map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <CardTitle>{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardFooter className="bg-muted/50">
                <div className="flex justify-between w-full">
                  <div>Created: {formatDate(report.createdAt)}</div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
      </TabsContent>
      <TabsContent value="shared" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Shared Reports</CardTitle>
            <CardDescription>Reports shared with you by other team members</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No reports have been shared with you yet.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="scheduled" className="space-y-4">
        {reports
          .filter((report) => report.schedule !== "One-time")
          .map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <CardTitle>{report.title}</CardTitle>
                <CardDescription>
                  Schedule: {report.schedule} | Last run: {formatDate(report.lastRun)}
                </CardDescription>
              </CardHeader>
              <CardFooter className="bg-muted/50">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    View Schedule
                  </Button>
                  <Button variant="outline" size="sm">
                    Run Now
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
      </TabsContent>
    </Tabs>
  )
}

