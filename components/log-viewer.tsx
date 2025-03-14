"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, ExternalLink, Trash2, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { LogEntry } from "@/types/log-types"
import { useLogStore } from "@/lib/log-store"
import { LogEditDialog } from "@/components/log-edit-dialog"
import { LogDeleteDialog } from "@/components/log-delete-dialog"

export function LogViewer() {
  const router = useRouter()
  const { logs, filteredLogs, deleteLogs } = useLogStore()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedLogs, setSelectedLogs] = useState<string[]>([])
  const [editLog, setEditLog] = useState<LogEntry | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [isAllSelected, setIsAllSelected] = useState(false)
  const { toast } = useToast()

  // Use filteredLogs instead of logs for display
  const totalPages = Math.ceil(filteredLogs.length / pageSize)
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentLogs = filteredLogs.slice(startIndex, endIndex)

  useEffect(() => {
    // Reset to page 1 when filters change
    setPage(1)
    // Reset selections when logs or filtered logs change
    setSelectedLogs([])
    setIsAllSelected(false)
  }, [logs, filteredLogs])

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedLogs([])
    } else {
      setSelectedLogs(currentLogs.map((log, index) => `${log.ip}-${log.timestamp}-${startIndex + index}`))
    }
    setIsAllSelected(!isAllSelected)
  }

  const handleSelectLog = (logId: string) => {
    if (selectedLogs.includes(logId)) {
      setSelectedLogs(selectedLogs.filter((id) => id !== logId))
    } else {
      setSelectedLogs([...selectedLogs, logId])
    }
  }

  const handleEdit = (log: LogEntry) => {
    setEditLog(log)
    setShowEditDialog(true)
  }

  const handleBatchDelete = () => {
    if (selectedLogs.length === 0) {
      toast({
        title: "No logs selected",
        description: "Please select at least one log to delete.",
        variant: "destructive",
      })
      return
    }

    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    // Extract indices from the selected log IDs
    const indices = selectedLogs.map((id) => {
      const parts = id.split("-")
      return Number.parseInt(parts[parts.length - 1])
    })

    deleteLogs(indices)
    setSelectedLogs([])
    setShowDeleteDialog(false)

    toast({
      title: "Logs deleted",
      description: `Successfully deleted ${indices.length} log entries.`,
    })
  }

  const handleViewVisitor = (domain: string) => {
    router.push(`/visitor/${encodeURIComponent(domain)}`)
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-muted p-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-10 w-10 text-muted-foreground"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold">No logs found</h3>
        <p className="mt-2 text-sm text-muted-foreground">Import logs from Excel to get started.</p>
      </div>
    )
  }

  if (filteredLogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-muted p-6">
          <Filter className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No matching logs</h3>
        <p className="mt-2 text-sm text-muted-foreground">No logs match your current filter criteria.</p>
        <Button variant="outline" className="mt-4" onClick={() => useLogStore.getState().resetFilters()}>
          Clear Filters
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {selectedLogs.length > 0 && (
        <div className="flex items-center justify-between bg-muted p-2 rounded-md">
          <span className="text-sm font-medium">
            {selectedLogs.length} {selectedLogs.length === 1 ? "log" : "logs"} selected
          </span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBatchDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} aria-label="Select all logs" />
                </TableHead>
                <TableHead className="w-[120px]">IP</TableHead>
                <TableHead className="w-[150px]">Domain</TableHead>
                <TableHead className="w-[180px]">Date & Time (UTC)</TableHead>
                <TableHead className="w-[100px]">Request Type</TableHead>
                <TableHead className="min-w-[300px]">Page URL</TableHead>
                <TableHead className="min-w-[200px]">Referral URL</TableHead>
                <TableHead className="min-w-[300px]">User Agent</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentLogs.map((log, index) => {
                const logId = `${log.ip}-${log.timestamp}-${startIndex + index}`
                return (
                  <TableRow key={logId}>
                    <TableCell>
                      <Checkbox
                        checked={selectedLogs.includes(logId)}
                        onCheckedChange={() => handleSelectLog(logId)}
                        aria-label={`Select log ${index + 1}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{log.ip}</TableCell>
                    <TableCell>{log.domain}</TableCell>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.requestType}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">{log.pageUrl || "-"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{log.referralUrl || "-"}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{log.userAgent || "-"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(log)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleViewVisitor(log.domain)}>
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
          <span className="font-medium">{Math.min(endIndex, filteredLogs.length)}</span> of{" "}
          <span className="font-medium">{filteredLogs.length}</span> entries
          {filteredLogs.length !== logs.length && <span> (filtered from {logs.length} total entries)</span>}
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (page > 1) setPage(page - 1)
                }}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(pageNum)
                    }}
                    isActive={page === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            {totalPages > 5 && (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(totalPages)
                    }}
                    isActive={page === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (page < totalPages) setPage(page + 1)
                }}
                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Edit Dialog */}
      {editLog && <LogEditDialog log={editLog} open={showEditDialog} onOpenChange={setShowEditDialog} />}

      {/* Delete Confirmation Dialog */}
      <LogDeleteDialog
        count={selectedLogs.length}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

