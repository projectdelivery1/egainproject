"use client"

import { useState, useEffect } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLogStore } from "@/lib/log-store"
import { useToast } from "@/hooks/use-toast"

export function LogFilters() {
  const [expanded, setExpanded] = useState(false)
  const { filterLogs, resetFilters, filters, logs } = useLogStore()
  const { toast } = useToast()

  const [localFilters, setLocalFilters] = useState({
    ip: filters.ip || "",
    domain: filters.domain || "",
    pageUrl: filters.pageUrl || "",
    requestType: filters.requestType || "",
    dateRange: filters.dateRange || "",
  })

  // Update local filters when store filters change
  useEffect(() => {
    setLocalFilters({
      ip: filters.ip || "",
      domain: filters.domain || "",
      pageUrl: filters.pageUrl || "",
      requestType: filters.requestType || "",
      dateRange: filters.dateRange || "",
    })
  }, [filters])

  const handleFilterChange = (field: string, value: string) => {
    setLocalFilters({
      ...localFilters,
      [field]: value,
    })
  }

  const applyFilters = () => {
    if (logs.length === 0) {
      toast({
        title: "No logs to filter",
        description: "Import logs first before applying filters.",
        variant: "destructive",
      })
      return
    }

    filterLogs(localFilters)

    toast({
      title: "Filters applied",
      description: "The log view has been updated with your filters.",
    })
  }

  const clearFilters = () => {
    setLocalFilters({
      ip: "",
      domain: "",
      pageUrl: "",
      requestType: "",
      dateRange: "",
    })
    resetFilters()

    toast({
      title: "Filters cleared",
      description: "All filters have been reset.",
    })
  }

  // Check if any filters are applied
  const hasActiveFilters = filters.ip || filters.domain || filters.pageUrl || filters.requestType || filters.dateRange

  if (!expanded) {
    return (
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={() => setExpanded(true)}>
          <Filter className="mr-2 h-4 w-4" />
          Show Filters
        </Button>

        {hasActiveFilters && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Filters applied</span>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4" />
              <span className="sr-only">Clear filters</span>
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Filter Logs</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <CardDescription>Narrow down log entries by specific criteria</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="grid gap-2">
            <Label htmlFor="ip">IP Address</Label>
            <Input
              id="ip"
              placeholder="e.g. 192.168.1.1"
              value={localFilters.ip}
              onChange={(e) => handleFilterChange("ip", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="domain">Domain</Label>
            <Input
              id="domain"
              placeholder="e.g. www.egain.com"
              value={localFilters.domain}
              onChange={(e) => handleFilterChange("domain", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pageUrl">Page URL</Label>
            <Input
              id="pageUrl"
              placeholder="e.g. /company/investors/"
              value={localFilters.pageUrl}
              onChange={(e) => handleFilterChange("pageUrl", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="requestType">Request Type</Label>
            <Select
              value={localFilters.requestType}
              onValueChange={(value) => handleFilterChange("requestType", value)}
            >
              <SelectTrigger id="requestType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dateRange">Date (contains)</Label>
            <Input
              id="dateRange"
              placeholder="e.g. Feb/2025"
              value={localFilters.dateRange}
              onChange={(e) => handleFilterChange("dateRange", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={clearFilters}>
          Reset Filters
        </Button>
        <Button onClick={applyFilters}>Apply Filters</Button>
      </CardFooter>
    </Card>
  )
}

