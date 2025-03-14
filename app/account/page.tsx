import type { Metadata } from "next"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { SalesRepManagement } from "@/components/sales-rep-management"
import { NotificationSettings } from "@/components/notification-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Hesap - eGain Analytics",
  description: "Hesap ayarlarınızı ve tercihlerinizi yönetin",
}

export default function AccountPage() {
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
          <h2 className="text-3xl font-bold tracking-tight">Hesap Ayarları</h2>
        </div>
        <Tabs defaultValue="sales-reps" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sales-reps">Satış Temsilcileri</TabsTrigger>
            <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
            <TabsTrigger value="api">API Anahtarları</TabsTrigger>
            <TabsTrigger value="preferences">Tercihler</TabsTrigger>
          </TabsList>

          <TabsContent value="sales-reps" className="space-y-4">
            <SalesRepManagement />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Anahtarları</CardTitle>
                <CardDescription>Diğer sistemlerle entegrasyon için API anahtarlarınızı yönetin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  API anahtarı yönetim işlevselliği burada görüntülenecektir.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tercihler</CardTitle>
                <CardDescription>Panel tercihlerinizi özelleştirin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Kullanıcı tercihleri ayarları burada görüntülenecektir.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

