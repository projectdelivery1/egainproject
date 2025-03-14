import type { LogEntry } from "@/types/log-types"

// Function to parse Excel/CSV data
export async function parseExcelData(file: File): Promise<LogEntry[]> {
  // For binary Excel files (.xlsx, .xls)
  if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
    return parseExcelBinary(file)
  }

  // For text-based files (CSV, TSV, etc.)
  return parseTextFile(file)
}

// Parse binary Excel files using the xlsx library
async function parseExcelBinary(file: File): Promise<LogEntry[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        if (!e.target || !e.target.result) {
          throw new Error("Failed to read file")
        }

        // Dynamically import the xlsx library
        const XLSX = await import("xlsx")

        // Parse the Excel file
        const data = new Uint8Array(e.target.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })

        // Process all worksheets in the workbook
        const allLogs: LogEntry[] = []

        for (const sheetName of workbook.SheetNames) {
          console.log(`Processing sheet: ${sheetName}`)
          const worksheet = workbook.Sheets[sheetName]

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

          if (jsonData.length < 2) {
            console.warn(`Sheet ${sheetName} has insufficient data, skipping...`)
            continue
          }

          // Get headers from the first row
          const headers = jsonData[0] as string[]
          console.log(`Sheet ${sheetName} headers:`, headers)

          // Find column indices
          const findColumnIndex = (possibleNames: string[]) => {
            return headers.findIndex(
              (header) =>
                header && possibleNames.some((name) => header.toString().toLowerCase().includes(name.toLowerCase())),
            )
          }

          const columnIndices = {
            ip: findColumnIndex(["ip", "ipaddress", "ip address"]),
            domain: findColumnIndex(["domain", "hostname", "host"]),
            timestamp: findColumnIndex(["date", "time", "utc", "timestamp"]),
            requestType: findColumnIndex(["request", "method", "type", "requesttype"]),
            pageUrl: findColumnIndex(["page", "url", "pageurl", "path"]),
            referralUrl: findColumnIndex(["referral", "referrer", "ref"]),
            userAgent: findColumnIndex(["user", "agent", "browser", "useragent"]),
          }

          console.log(`Sheet ${sheetName} column indices:`, columnIndices)

          // Check if we have at least IP and domain columns
          const hasMinimumColumns = columnIndices.ip !== -1 && columnIndices.domain !== -1

          if (!hasMinimumColumns) {
            console.warn(`Sheet ${sheetName} is missing required columns (IP and domain), skipping...`)
            continue
          }

          // Process data rows
          const sheetLogs: LogEntry[] = []

          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[]

            if (!row || row.length === 0) continue

            const log: LogEntry = {
              ip: row[columnIndices.ip]?.toString() || "Unknown",
              domain: row[columnIndices.domain]?.toString() || "Unknown",
              timestamp: row[columnIndices.timestamp]?.toString() || new Date().toISOString(),
              requestType: row[columnIndices.requestType]?.toString() || "GET",
              pageUrl: row[columnIndices.pageUrl]?.toString() || "/",
              referralUrl: row[columnIndices.referralUrl]?.toString() || "-",
              userAgent: row[columnIndices.userAgent]?.toString() || "Unknown",
            }

            // Only add if we have valid data
            if (log.ip !== "Unknown" && log.domain !== "Unknown") {
              sheetLogs.push(log)
            }
          }

          console.log(`Successfully parsed ${sheetLogs.length} logs from sheet ${sheetName}`)
          allLogs.push(...sheetLogs)
        }

        if (allLogs.length === 0) {
          throw new Error("No valid log entries found in any sheet of the Excel file")
        }

        console.log("Total logs parsed from all sheets:", allLogs.length)
        console.log("First log entry:", allLogs[0])
        resolve(allLogs)
      } catch (error) {
        console.error("Excel parse error:", error)
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error("Error reading Excel file"))
    }

    // Read as array buffer for binary files
    reader.readAsArrayBuffer(file)
  })
}

// Parse text-based files (CSV, TSV)
async function parseTextFile(file: File): Promise<LogEntry[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        if (!event.target || !event.target.result) {
          throw new Error("Failed to read file")
        }

        const data = event.target.result as string
        console.log("Raw text file data (first 200 chars):", data.substring(0, 200))

        // Detect delimiter (tab, comma, or semicolon)
        let delimiter = "\t" // Default to tab
        const firstLine = data.split("\n")[0]

        if (firstLine.includes(",") && !firstLine.includes("\t")) {
          delimiter = ","
        } else if (firstLine.includes(";") && !firstLine.includes("\t")) {
          delimiter = ";"
        }

        console.log("Detected delimiter:", delimiter === "\t" ? "tab" : delimiter)

        // Split into lines and remove any empty lines
        const lines = data.split("\n").filter((line) => line.trim())
        console.log("Number of lines:", lines.length)
        console.log("First line:", lines[0])

        // Get headers and normalize them
        const headers = lines[0].split(delimiter).map((header) => header.trim())
        console.log("Detected headers:", headers)

        // Find column indices using flexible matching
        const findColumnIndex = (possibleNames: string[]) => {
          return headers.findIndex((header) =>
            possibleNames.some((name) => header.toLowerCase().includes(name.toLowerCase())),
          )
        }

        const columnIndices = {
          ip: findColumnIndex(["ip", "ipaddress", "ip address"]),
          domain: findColumnIndex(["domain", "hostname", "host"]),
          timestamp: findColumnIndex(["date", "time", "utc", "timestamp"]),
          requestType: findColumnIndex(["request", "method", "type", "requesttype"]),
          pageUrl: findColumnIndex(["page", "url", "pageurl", "path"]),
          referralUrl: findColumnIndex(["referral", "referrer", "ref"]),
          userAgent: findColumnIndex(["user", "agent", "browser", "useragent"]),
        }

        console.log("Text file column indices:", columnIndices)

        // Check if we have at least IP and domain columns
        const hasMinimumColumns = columnIndices.ip !== -1 && columnIndices.domain !== -1

        if (!hasMinimumColumns) {
          throw new Error("Missing required columns: IP and domain")
        }

        const logs: LogEntry[] = []

        // Process each line (skip header)
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i]
          if (!line.trim()) continue

          // Handle quoted values properly
          const values: string[] = []
          let currentValue = ""
          let insideQuotes = false

          for (let j = 0; j < line.length; j++) {
            const char = line[j]

            if (char === '"') {
              insideQuotes = !insideQuotes
            } else if (char === delimiter && !insideQuotes) {
              values.push(currentValue.trim())
              currentValue = ""
            } else {
              currentValue += char
            }
          }
          values.push(currentValue.trim())

          // If we didn't parse enough columns, try simple split
          if (values.length < headers.length) {
            const simpleSplit = line.split(delimiter)
            if (simpleSplit.length > values.length) {
              values.length = 0 // Clear the array
              simpleSplit.forEach((val) => values.push(val.trim()))
            }
          }

          // Create log entry
          const log: LogEntry = {
            ip: values[columnIndices.ip] || "Unknown",
            domain: values[columnIndices.domain] || "Unknown",
            timestamp: values[columnIndices.timestamp] || new Date().toISOString(),
            requestType: values[columnIndices.requestType] || "GET",
            pageUrl: values[columnIndices.pageUrl] || "/",
            referralUrl: values[columnIndices.referralUrl] || "-",
            userAgent: values[columnIndices.userAgent] || "Unknown",
          }

          // Clean up values and remove quotes
          Object.keys(log).forEach((key) => {
            const value = log[key as keyof LogEntry]
            if (typeof value === "string") {
              log[key as keyof LogEntry] = value.replace(/^"|"$/g, "").trim() as any
            }
          })

          // Only add if we have valid data
          if (log.ip !== "Unknown" && log.domain !== "Unknown") {
            logs.push(log)
          }
        }

        if (logs.length === 0) {
          throw new Error("No valid log entries found in the file")
        }

        console.log("Successfully parsed text logs:", logs.length)
        console.log("First log entry:", logs[0])
        resolve(logs)
      } catch (error) {
        console.error("Text parse error:", error)
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error("Error reading text file"))
    }

    // Read as text file
    reader.readAsText(file)
  })
}

// Function to export logs to Excel/CSV
export async function exportToExcel(logs: LogEntry[]): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      // Dynamically import the xlsx library
      const XLSX = await import("xlsx")

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(logs)

      // Create workbook
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Visitor Logs")

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

      // Create Blob and download
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "egain_visitor_logs.xlsx")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setTimeout(resolve, 500)
    } catch (error) {
      console.error("Export error:", error)
      reject(error)
    }
  })
}

