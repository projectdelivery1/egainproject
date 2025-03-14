import type { Metadata } from "next"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { ReportList } from "@/components/report-list"
import { ReportCreator } from "@/components/report-creator"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Reports - eGain Analytics",
  description: "View and manage your visitor analytics reports",
}

export default function ReportsPage() {
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
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <ReportCreator>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Report
            </Button>
          </ReportCreator>
        </div>
        <ReportList />
      </div>
    </div>
  )
}

