import type { Metadata } from "next"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { LogViewer } from "@/components/log-viewer"
import { LogImportExport } from "@/components/log-import-export"
import { LogFilters } from "@/components/log-filters"

export const metadata: Metadata = {
  title: "Visitor Logs - eGain Analytics",
  description: "View and analyze raw visitor logs for the eGain website",
}

export default function LogsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Visitor Logs</h2>
          <LogImportExport />
        </div>

        <LogFilters />
        <LogViewer />
      </div>
    </div>
  )
}

