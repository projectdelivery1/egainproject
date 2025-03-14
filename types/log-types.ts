export interface LogEntry {
  ip: string
  domain: string
  timestamp: string
  requestType: string
  pageUrl: string
  referralUrl: string
  userAgent: string
}

export interface LogFilters {
  ip: string
  domain: string
  pageUrl: string
  requestType: string
  dateRange: string
}

