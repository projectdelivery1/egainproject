import type { Metadata } from "next"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { ThirdPartyTools } from "@/components/third-party-tools"

export const metadata: Metadata = {
  title: "IP Intelligence Tools - eGain Analytics",
  description: "Explore third-party tools to enhance your visitor analytics with IP intelligence",
}

export default function ToolsPage() {
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
          <h2 className="text-3xl font-bold tracking-tight">IP Intelligence Tools</h2>
        </div>

        <div className="grid gap-4">
          <ThirdPartyTools />
        </div>
      </div>
    </div>
  )
}

