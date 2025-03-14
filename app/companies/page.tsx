import type { Metadata } from "next"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { ImportExportButtons } from "@/components/import-export-buttons"
import { CompanyList } from "@/components/company-list"
import { CompanyMap } from "@/components/company-map"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Companies - eGain Analytics",
  description: "Analyze companies visiting your website",
}

export default function CompaniesPage() {
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
          <h2 className="text-3xl font-bold tracking-tight">Company Intelligence</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <ImportExportButtons />
          </div>
        </div>
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Company List</TabsTrigger>
            <TabsTrigger value="map">Geographic Map</TabsTrigger>
            <TabsTrigger value="segments">Industry Segments</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="space-y-4">
            <CompanyList />
          </TabsContent>
          <TabsContent value="map" className="space-y-4">
            <CompanyMap />
          </TabsContent>
          <TabsContent value="segments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Industry Segmentation</CardTitle>
                <CardDescription>Companies categorized by industry, size, and engagement level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Content for industry segmentation will be displayed here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

