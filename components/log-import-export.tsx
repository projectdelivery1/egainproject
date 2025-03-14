"use client"

import type React from "react"

import { useState } from "react"
import { Download, Upload, Database, AlertTriangle, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useLogStore } from "@/lib/log-store"
import { parseExcelData, exportToExcel } from "@/lib/excel-parser"
import { Progress } from "@/components/ui/progress"

export function LogImportExport() {
  const [importOpen, setImportOpen] = useState(false)
  const [clearDbOpen, setClearDbOpen] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importStats, setImportStats] = useState<{
    totalSheets: number
    processedSheets: number
    totalRows: number
    validRows: number
  } | null>(null)
  const { logs, setLogs, clearDatabase } = useLogStore()
  const { toast } = useToast()

  const handleExport = () => {
    if (logs.length === 0) {
      toast({
        title: "No logs to export",
        description: "Import logs first before exporting.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Exporting logs",
      description: `Exporting ${logs.length} log entries to Excel...`,
    })

    // Export logs to Excel
    exportToExcel(logs)
      .then(() => {
        toast({
          title: "Export complete",
          description: "Logs have been exported to Excel successfully.",
        })
      })
      .catch((error) => {
        toast({
          title: "Export failed",
          description: error instanceof Error ? error.message : "Failed to export logs.",
          variant: "destructive",
        })
      })
  }

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const fileInput = form.elements.namedItem("file") as HTMLInputElement

    if (!fileInput.files || fileInput.files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please select a file to import.",
        variant: "destructive",
      })
      return
    }

    const file = fileInput.files[0]

    // Accept more file types
    const validExtensions = [".xlsx", ".xls", ".csv", ".tsv", ".txt"]
    const hasValidExtension = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))

    if (!hasValidExtension) {
      toast({
        title: "Invalid file format",
        description: "Please select a valid file (Excel, CSV, TSV, or text file).",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Importing logs",
      description: "Processing your file...",
    })

    setIsImporting(true)
    setImportProgress(10) // Start progress
    setImportStats(null)

    try {
      // First, dynamically import the xlsx library if needed
      if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        setImportProgress(20)
        await import("xlsx")
        setImportProgress(30)
      }

      // Set up progress updates
      const updateProgress = (progress: number, stats?: any) => {
        setImportProgress(30 + progress * 0.6) // Scale to 30-90%
        if (stats) {
          setImportStats(stats)
        }
      }

      // Parse the file with progress updates
      const importedLogs = await parseExcelData(file)
      setImportProgress(95)

      if (importedLogs.length === 0) {
        toast({
          title: "Import failed",
          description: "No valid log entries found in the file.",
          variant: "destructive",
        })
        return
      }

      setLogs(importedLogs)
      setImportOpen(false)
      setImportProgress(100)

      toast({
        title: "Import successful",
        description: `Imported ${importedLogs.length} log entries from ${importStats?.processedSheets || 1} sheet(s).`,
      })
    } catch (error) {
      console.error("Import error:", error)
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import logs.",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => {
        setIsImporting(false)
        setImportProgress(0)
      }, 1000)
    }
  }

  const handleClearDatabase = () => {
    clearDatabase()
    setClearDbOpen(false)
    toast({
      title: "Database cleared",
      description: "All log entries have been removed from the database.",
    })
  }

  return (
    <div className="flex space-x-2">
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogTrigger asChild>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Import Logs
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Import Log Data</DialogTitle>
            <DialogDescription>
              Upload a file containing visitor log data. All sheets will be processed.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleImport}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="file">Excel or CSV File</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept=".xlsx, .xls, .csv, .tsv, .txt, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv, text/tab-separated-values, text/plain"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Expected columns:</p>
                <p>IP, Domain, Date & Time (UTC), Request Type, Page URL, Referral URL, User Agent</p>
                <p className="mt-2 flex items-center">
                  <FileSpreadsheet className="h-4 w-4 mr-1" />
                  <span>All worksheets in Excel files will be processed</span>
                </p>
              </div>

              {isImporting && (
                <div className="space-y-2">
                  <Progress value={importProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {importProgress < 100 ? "Processing..." : "Complete!"}
                  </p>

                  {importStats && (
                    <div className="text-xs text-muted-foreground space-y-1 mt-2">
                      <p>
                        Processed {importStats.processedSheets} of {importStats.totalSheets} sheets
                      </p>
                      <p>
                        Found {importStats.validRows} valid rows from {importStats.totalRows} total rows
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isImporting}>
                {isImporting ? "Importing..." : "Import Data"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Button variant="outline" onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" />
        Export Logs
      </Button>

      <AlertDialog open={clearDbOpen} onOpenChange={setClearDbOpen}>
        <Button variant="outline" className="text-destructive" onClick={() => setClearDbOpen(true)}>
          <Database className="mr-2 h-4 w-4" />
          Clear Database
        </Button>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all log entries from the local database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearDatabase} className="bg-destructive text-destructive-foreground">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Clear Database
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

