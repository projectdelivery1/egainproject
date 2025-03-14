"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { LogEntry } from "@/types/log-types"
import { useLogStore } from "@/lib/log-store"

interface LogEditDialogProps {
  log: LogEntry
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogEditDialog({ log, open, onOpenChange }: LogEditDialogProps) {
  const [editedLog, setEditedLog] = useState<LogEntry>({ ...log })
  const { updateLog } = useLogStore()
  const { toast } = useToast()

  const handleChange = (field: keyof LogEntry, value: string) => {
    setEditedLog({
      ...editedLog,
      [field]: value,
    })
  }

  const handleSave = () => {
    updateLog(log, editedLog)
    onOpenChange(false)

    toast({
      title: "Log updated",
      description: "The log entry has been successfully updated.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Log Entry</DialogTitle>
          <DialogDescription>Make changes to the log entry. Click save when you're done.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="ip">IP Address</Label>
              <Input id="ip" value={editedLog.ip} onChange={(e) => handleChange("ip", e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="domain">Domain</Label>
              <Input id="domain" value={editedLog.domain} onChange={(e) => handleChange("domain", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="timestamp">Date & Time (UTC)</Label>
              <Input
                id="timestamp"
                value={editedLog.timestamp}
                onChange={(e) => handleChange("timestamp", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="requestType">Request Type</Label>
              <Input
                id="requestType"
                value={editedLog.requestType}
                onChange={(e) => handleChange("requestType", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pageUrl">Page URL</Label>
            <Input id="pageUrl" value={editedLog.pageUrl} onChange={(e) => handleChange("pageUrl", e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="referralUrl">Referral URL</Label>
            <Input
              id="referralUrl"
              value={editedLog.referralUrl}
              onChange={(e) => handleChange("referralUrl", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="userAgent">User Agent</Label>
            <Input
              id="userAgent"
              value={editedLog.userAgent}
              onChange={(e) => handleChange("userAgent", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

