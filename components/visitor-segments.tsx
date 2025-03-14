"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { PlusCircle, Download, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export function VisitorSegments() {
  const [segmentType, setSegmentType] = useState("industry")
  const [createSegmentOpen, setCreateSegmentOpen] = useState(false)
  const { toast } = useToast()

  // Sektör segment verileri
  const industryData = [
    { name: "Teknoloji", value: 45 },
    { name: "Sağlık", value: 18 },
    { name: "Üretim", value: 12 },
    { name: "Finans", value: 9 },
    { name: "Perakende", value: 8 },
    { name: "Enerji", value: 5 },
    { name: "Diğer", value: 3 },
  ]

  // Şirket büyüklüğü segment verileri
  const sizeData = [
    { name: "Kurumsal (5000+)", value: 28 },
    { name: "Büyük (1000-5000)", value: 35 },
    { name: "Orta (200-1000)", value: 22 },
    { name: "Küçük (50-200)", value: 10 },
    { name: "Startup (<50)", value: 5 },
  ]

  // Etkileşim düzeyi segment verileri
  const engagementData = [
    { name: "Yüksek Etkileşim", value: 22 },
    { name: "Orta Etkileşim", value: 38 },
    { name: "Düşük Etkileşim", value: 40 },
  ]

  // Coğrafi segment verileri
  const geographicData = [
    { name: "Kuzey Amerika", value: 45 },
    { name: "Avrupa", value: 28 },
    { name: "Asya Pasifik", value: 18 },
    { name: "Latin Amerika", value: 5 },
    { name: "Orta Doğu & Afrika", value: 4 },
  ]

  // Grafikler için renk şemaları
  const COLORS = [
    "#D53F8C", // primary
    "#805AD5",
    "#3182CE",
    "#319795",
    "#38A169",
    "#D69E2E",
    "#DD6B20",
    "#E53E3E",
  ]

  const getDataForSegmentType = () => {
    switch (segmentType) {
      case "industry":
        return industryData
      case "size":
        return sizeData
      case "engagement":
        return engagementData
      case "geographic":
        return geographicData
      default:
        return industryData
    }
  }

  const getSegmentTitle = () => {
    switch (segmentType) {
      case "industry":
        return "Sektör Segmentasyonu"
      case "size":
        return "Şirket Büyüklüğü Segmentasyonu"
      case "engagement":
        return "Etkileşim Düzeyi Segmentasyonu"
      case "geographic":
        return "Coğrafi Segmentasyon"
      default:
        return "Ziyaretçi Segmentasyonu"
    }
  }

  const getSegmentDescription = () => {
    switch (segmentType) {
      case "industry":
        return "Ziyaretçilerin farklı sektörlere göre dağılımı"
      case "size":
        return "Ziyaretçilerin şirket büyüklüğü ve çalışan sayısına göre dağılımı"
      case "engagement":
        return "Ziyaretçi etkileşim metrikleri ve davranışlarına göre segmentasyon"
      case "geographic":
        return "Web sitesi ziyaretçilerinin bölgesel dağılımı"
      default:
        return "Pazarlama çalışmalarınızı hedeflemek için ziyaretçi segmentlerini analiz edin"
    }
  }

  const handleCreateSegment = (formData: FormData) => {
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    if (!name) {
      toast({
        title: "Hata",
        description: "Segment adı gereklidir",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Segment Oluşturuldu",
      description: `"${name}" segmenti başarıyla oluşturuldu.`,
    })

    setCreateSegmentOpen(false)
  }

  const handleExportSegment = () => {
    toast({
      title: "Segment Dışa Aktarıldı",
      description: "Segment verileri CSV formatında dışa aktarıldı.",
    })
  }

  const handleShareSegment = () => {
    toast({
      title: "Segment Paylaşıldı",
      description: "Segment bağlantısı panonuza kopyalandı.",
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{getSegmentTitle()}</CardTitle>
          <CardDescription>{getSegmentDescription()}</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={segmentType} onValueChange={setSegmentType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Segment Türü" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="industry">Sektör</SelectItem>
              <SelectItem value="size">Şirket Büyüklüğü</SelectItem>
              <SelectItem value="engagement">Etkileşim Düzeyi</SelectItem>
              <SelectItem value="geographic">Coğrafi</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={createSegmentOpen} onOpenChange={setCreateSegmentOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Segment Oluştur
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Yeni Segment Oluştur</DialogTitle>
                <DialogDescription>
                  Özel bir ziyaretçi segmenti oluşturun ve pazarlama kampanyalarınızda kullanın.
                </DialogDescription>
              </DialogHeader>
              <form action={handleCreateSegment}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Segment Adı</Label>
                    <Input id="name" name="name" placeholder="Örn: Yüksek Değerli Teknoloji Şirketleri" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Açıklama</Label>
                    <Input id="description" name="description" placeholder="Bu segmentin amacını açıklayın" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="criteria">Segment Kriterleri</Label>
                    <Select name="criteria">
                      <SelectTrigger id="criteria">
                        <SelectValue placeholder="Kriter seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="industry">Sektör = Teknoloji</SelectItem>
                        <SelectItem value="size">Şirket Büyüklüğü &gt; 1000</SelectItem>
                        <SelectItem value="engagement">Etkileşim Skoru &gt; 80</SelectItem>
                        <SelectItem value="visits">Ziyaret Sayısı &gt; 5</SelectItem>
                        <SelectItem value="custom">Özel Kriter...</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Segment Oluştur</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart" className="space-y-4">
          <TabsList>
            <TabsTrigger value="chart">Grafik Görünümü</TabsTrigger>
            <TabsTrigger value="details">Detaylı Görünüm</TabsTrigger>
          </TabsList>

          <TabsContent value="chart">
            <div className="flex justify-end space-x-2 mb-4">
              <Button variant="outline" size="sm" onClick={handleExportSegment}>
                <Download className="mr-2 h-4 w-4" />
                Dışa Aktar
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareSegment}>
                <Share2 className="mr-2 h-4 w-4" />
                Paylaş
              </Button>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getDataForSegmentType()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getDataForSegmentType().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} ziyaretçi`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="details">
            <div className="overflow-hidden rounded-md border">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b [&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">Segment</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Ziyaretçiler</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Yüzde</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Ort. Sayfa</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Ort. Süre</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Potansiyel Değeri</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {getDataForSegmentType().map((segment, i) => {
                    const total = getDataForSegmentType().reduce((sum, item) => sum + item.value, 0)
                    const percentage = ((segment.value / total) * 100).toFixed(1)
                    // Demo amaçlı rastgele metrikler
                    const avgPages = Math.floor(Math.random() * 10) + 3
                    const avgMinutes = Math.floor(Math.random() * 15) + 2
                    const avgSeconds = Math.floor(Math.random() * 60)
                    const leadScore = Math.floor(Math.random() * 30) + 50

                    return (
                      <tr key={segment.name} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle font-medium">{segment.name}</td>
                        <td className="p-4 align-middle">{segment.value}</td>
                        <td className="p-4 align-middle">{percentage}%</td>
                        <td className="p-4 align-middle">{avgPages}</td>
                        <td className="p-4 align-middle">
                          {avgMinutes}d {avgSeconds}s
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant={leadScore > 70 ? "default" : "outline"}>{leadScore}%</Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

