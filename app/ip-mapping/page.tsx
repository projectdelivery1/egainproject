import type { Metadata } from "next"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { IPGeolocation } from "@/components/ip-geolocation"
import { VisitorSegmentation } from "@/components/visitor-segmentation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "IP Haritalama - eGain Analytics",
  description: "IP adreslerini coğrafi konumlara ve şirket bilgilerine dönüştürün",
}

export default function IPMappingPage({ searchParams }: { searchParams: { ip?: string } }) {
  // Get the IP from search params if available
  const highlightedIp = searchParams.ip || ""

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
          <h2 className="text-3xl font-bold tracking-tight">IP & Ziyaretçi Analitiği</h2>
        </div>

        <Tabs defaultValue="geolocation" className="space-y-4">
          <TabsList>
            <TabsTrigger value="geolocation">IP Haritalama</TabsTrigger>
            <TabsTrigger value="segmentation">Ziyaretçi Segmentasyonu</TabsTrigger>
          </TabsList>

          <TabsContent value="geolocation" className="space-y-4">
            <IPGeolocation highlightedIp={highlightedIp} />
          </TabsContent>

          <TabsContent value="segmentation" className="space-y-4">
            <VisitorSegmentation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

