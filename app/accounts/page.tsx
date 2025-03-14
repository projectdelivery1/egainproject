import type { Metadata } from "next"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { AccountsOverview } from "@/components/accounts-overview"
import { SalesRepManagement } from "@/components/sales-rep-management"
import { LeadAssignment } from "@/components/lead-assignment"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Accounts - eGain Analytics",
  description: "Manage sales representatives and account assignments",
}

export default function AccountsPage() {
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
          <h2 className="text-3xl font-bold tracking-tight">Account Management</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales-reps">Sales Representatives</TabsTrigger>
            <TabsTrigger value="lead-assignment">Lead Assignment</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <AccountsOverview />
          </TabsContent>
          <TabsContent value="sales-reps" className="space-y-4">
            <SalesRepManagement />
          </TabsContent>
          <TabsContent value="lead-assignment" className="space-y-4">
            <LeadAssignment />
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <div className="text-center p-12 text-muted-foreground">
              Account settings and preferences will be displayed here.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

