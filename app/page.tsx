import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { RecentVisitors } from "@/components/recent-visitors"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { ImportExportButtons } from "@/components/import-export-buttons"
import { TopPages } from "@/components/top-pages"
import { TopCompanies } from "@/components/top-companies"
import { EnhancedVisitorTraffic } from "@/components/enhanced-visitor-traffic"
import { Notification } from "@/components/notification"
import { IPGeolocation } from "@/components/ip-geolocation"
import { VisitorSegmentation } from "@/components/visitor-segmentation"
import { DashboardStats } from "@/components/dashboard-stats"
import { IPQuickSearch } from "@/components/ip-quick-search"
import { VisitorList } from "@/components/visitor-list"
import { CompanyList } from "@/components/company-list"
import { PageAnalytics } from "@/components/page-analytics"

export const metadata: Metadata = {
  title: "eGain Visitor Analytics Dashboard",
  description: "A dashboard for eGain sales representatives to analyze website visitors",
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <Notification />
            <Search />
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Visitor Analytics Dashboard</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <ImportExportButtons />
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="ip-mapping">IP Mapping</TabsTrigger>
            <TabsTrigger value="segmentation">Segmentation</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <DashboardStats />

            {/* IP Quick Search */}
            <IPQuickSearch />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <EnhancedVisitorTraffic />
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Top Companies</CardTitle>
                  <CardDescription>Companies with the most visits this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <TopCompanies />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Visitors</CardTitle>
                  <CardDescription>Latest website visitors and their activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentVisitors />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Top Pages</CardTitle>
                  <CardDescription>Most visited pages this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <TopPages />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="visitors" className="space-y-4">
            <VisitorList />
          </TabsContent>
          <TabsContent value="companies" className="space-y-4">
            <CompanyList />
          </TabsContent>
          <TabsContent value="pages" className="space-y-4">
            <PageAnalytics />
          </TabsContent>
          <TabsContent value="ip-mapping" className="space-y-4">
            <IPGeolocation />
          </TabsContent>
          <TabsContent value="segmentation" className="space-y-4">
            <VisitorSegmentation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

