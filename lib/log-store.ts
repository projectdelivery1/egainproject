"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { LogEntry, LogFilters } from "@/types/log-types"

interface LogState {
  logs: LogEntry[]
  filteredLogs: LogEntry[]
  filters: LogFilters
  setLogs: (logs: LogEntry[]) => void
  updateLog: (oldLog: LogEntry, newLog: LogEntry) => void
  deleteLogs: (indices: number[]) => void
  filterLogs: (filters: LogFilters) => void
  resetFilters: () => void
  clearDatabase: () => void
}

// Local storage key for persisting logs
const STORAGE_KEY = "egain-visitor-logs"

export const useLogStore = create<LogState>()(
  persist(
    (set, get) => ({
      logs: [],
      filteredLogs: [],
      filters: {
        ip: "",
        domain: "",
        pageUrl: "",
        requestType: "",
        dateRange: "",
      },

      setLogs: (logs) => {
        set({ logs, filteredLogs: logs })
      },

      updateLog: (oldLog, newLog) => {
        const { logs, filters } = get()

        // Find the log to update
        const index = logs.findIndex(
          (log) => log.ip === oldLog.ip && log.timestamp === oldLog.timestamp && log.pageUrl === oldLog.pageUrl,
        )

        if (index !== -1) {
          const updatedLogs = [...logs]
          updatedLogs[index] = newLog

          // Apply current filters to the updated logs
          const updatedFilteredLogs = applyFilters(updatedLogs, filters)

          set({
            logs: updatedLogs,
            filteredLogs: updatedFilteredLogs,
          })
        }
      },

      deleteLogs: (indices) => {
        const { logs, filters } = get()

        // Sort indices in descending order to avoid shifting issues
        const sortedIndices = [...indices].sort((a, b) => b - a)

        // Create a new array without the deleted logs
        const updatedLogs = [...logs]
        for (const index of sortedIndices) {
          if (index >= 0 && index < updatedLogs.length) {
            updatedLogs.splice(index, 1)
          }
        }

        // Apply current filters to the updated logs
        const updatedFilteredLogs = applyFilters(updatedLogs, filters)

        set({
          logs: updatedLogs,
          filteredLogs: updatedFilteredLogs,
        })
      },

      filterLogs: (filters) => {
        const { logs } = get()
        const filteredLogs = applyFilters(logs, filters)
        set({ filteredLogs, filters })
      },

      resetFilters: () => {
        const { logs } = get()
        set({
          filteredLogs: logs,
          filters: {
            ip: "",
            domain: "",
            pageUrl: "",
            requestType: "",
            dateRange: "",
          },
        })
      },

      clearDatabase: () => {
        set({
          logs: [],
          filteredLogs: [],
          filters: {
            ip: "",
            domain: "",
            pageUrl: "",
            requestType: "",
            dateRange: "",
          },
        })
      },
    }),
    {
      name: STORAGE_KEY,
    },
  ),
)

// Helper function to apply filters to logs
function applyFilters(logs: LogEntry[], filters: LogFilters): LogEntry[] {
  return logs.filter((log) => {
    // IP filter
    if (filters.ip && !log.ip.toLowerCase().includes(filters.ip.toLowerCase())) {
      return false
    }

    // Domain filter
    if (filters.domain && !log.domain.toLowerCase().includes(filters.domain.toLowerCase())) {
      return false
    }

    // Page URL filter
    if (filters.pageUrl && !log.pageUrl.toLowerCase().includes(filters.pageUrl.toLowerCase())) {
      return false
    }

    // Request Type filter
    if (filters.requestType && filters.requestType !== "all" && log.requestType !== filters.requestType) {
      return false
    }

    // Date range filter
    if (filters.dateRange) {
      try {
        // Simple date check - can be enhanced for more complex date ranges
        if (!log.timestamp.includes(filters.dateRange)) {
          return false
        }
      } catch (error) {
        // If date parsing fails, ignore this filter
        console.error("Date parsing error:", error)
      }
    }

    return true
  })
}

