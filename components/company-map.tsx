"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, MapPin, RefreshCw, Search } from "lucide-react"
import { useLogStore } from "@/lib/log-store"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Dünya haritası üzerinde ziyaretçi konumlarını gösteren yardımcı bileşen
export function CompanyMap() {
  const router = useRouter()
  const { logs } = useLogStore()
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRegion, setFilterRegion] = useState("all")

  useEffect(() => {
    setIsClient(true)
  }, [])

  const companyLocations = [
    {
      id: 1,
      name: "Acme Inc.",
      domain: "acme.com",
      location: "San Francisco, ABD",
      coordinates: { lat: 37.7749, lng: -122.4194 },
      visitors: 245,
      region: "Kuzey Amerika",
      industry: "Teknoloji",
    },
    {
      id: 2,
      name: "Globex Corporation",
      domain: "globex.com",
      location: "Boston, ABD",
      coordinates: { lat: 42.3601, lng: -71.0589 },
      visitors: 189,
      region: "Kuzey Amerika",
      industry: "Üretim",
    },
    {
      id: 3,
      name: "Initech",
      domain: "initech.com",
      location: "Austin, ABD",
      coordinates: { lat: 30.2672, lng: -97.7431 },
      visitors: 152,
      region: "Kuzey Amerika",
      industry: "Teknoloji",
    },
    {
      id: 4,
      name: "Massive Dynamic",
      domain: "massive.co",
      location: "New York, ABD",
      coordinates: { lat: 40.7128, lng: -74.006 },
      visitors: 134,
      region: "Kuzey Amerika",
      industry: "Sağlık",
    },
    {
      id: 5,
      name: "Umbrella Corp",
      domain: "umbrella.org",
      location: "Chicago, ABD",
      coordinates: { lat: 41.8781, lng: -87.6298 },
      visitors: 98,
      region: "Kuzey Amerika",
      industry: "İlaç",
    },
    {
      id: 6,
      name: "Wayne Enterprises",
      domain: "wayne.com",
      location: "Londra, İngiltere",
      coordinates: { lat: 51.5074, lng: -0.1278 },
      visitors: 86,
      region: "Avrupa",
      industry: "Üretim",
    },
    {
      id: 7,
      name: "Stark Industries",
      domain: "stark.com",
      location: "Tokyo, Japonya",
      coordinates: { lat: 35.6762, lng: 139.6503 },
      visitors: 75,
      region: "Asya Pasifik",
      industry: "Teknoloji",
    },
    {
      id: 8,
      name: "LexCorp",
      domain: "lexcorp.com",
      location: "Berlin, Almanya",
      coordinates: { lat: 52.52, lng: 13.405 },
      visitors: 62,
      region: "Avrupa",
      industry: "Enerji",
    },
    {
      id: 9,
      name: "Soylent Corp",
      domain: "soylent.com",
      location: "Sydney, Avustralya",
      coordinates: { lat: -33.8688, lng: 151.2093 },
      visitors: 58,
      region: "Asya Pasifik",
      industry: "Gıda",
    },
    {
      id: 10,
      name: "Oscorp",
      domain: "oscorp.com",
      location: "Mumbai, Hindistan",
      coordinates: { lat: 19.076, lng: 72.8777 },
      visitors: 45,
      region: "Asya Pasifik",
      industry: "Kimya",
    },
    {
      id: 11,
      name: "Cyberdyne Systems",
      domain: "cyberdyne.com",
      location: "Sao Paulo, Brezilya",
      coordinates: { lat: -23.5505, lng: -46.6333 },
      visitors: 38,
      region: "Latin Amerika",
      industry: "Teknoloji",
    },
    {
      id: 12,
      name: "Weyland-Yutani",
      domain: "weyland.com",
      location: "Johannesburg, Güney Afrika",
      coordinates: { lat: -26.2041, lng: 28.0473 },
      visitors: 32,
      region: "Afrika",
      industry: "Madencilik",
    },
  ]

  // Filtreleme işlevi
  const filteredLocations = companyLocations.filter((company) => {
    // Bölge filtresi
    if (filterRegion !== "all" && company.region !== filterRegion) {
      return false
    }

    // Arama sorgusu
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        company.name.toLowerCase().includes(query) ||
        company.domain.toLowerCase().includes(query) ||
        company.location.toLowerCase().includes(query) ||
        company.industry.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleViewCompany = (domain: string) => {
    router.push(`/visitor/${encodeURIComponent(domain)}`)
  }

  const handleEnrichCompanyData = () => {
    setIsLoading(true)

    toast({
      title: "IP Geolocation Zenginleştirme",
      description: "Tüm ziyaretçi IP'leri için geolocation zenginleştirme başlatılıyor...",
    })

    // API çağrısı simülasyonu
    setTimeout(() => {
      setIsLoading(false)

      toast({
        title: "Zenginleştirme Tamamlandı",
        description: "245 IP adresi konum verileriyle başarıyla zenginleştirildi.",
      })
    }, 2000)
  }

  const handleShowHeatmap = () => {
    toast({
      title: "Isı Haritası Etkinleştirildi",
      description: "Ziyaretçi yoğunluğu ısı haritası görselleştirmesi etkinleştirildi.",
    })
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Coğrafi Dağılım</CardTitle>
            <CardDescription>Web sitenizi ziyaret eden şirketlerin konumları</CardDescription>
          </div>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <Button variant="outline" size="sm" onClick={handleEnrichCompanyData} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  İşleniyor...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  IP Verilerini Zenginleştir
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShowHeatmap}>
              <Globe className="mr-2 h-4 w-4" />
              Isı Haritası Göster
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 border-t border-b bg-muted/30">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Şirket, domain veya konum ara..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterRegion} onValueChange={setFilterRegion}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Bölge seç" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Bölgeler</SelectItem>
                <SelectItem value="Kuzey Amerika">Kuzey Amerika</SelectItem>
                <SelectItem value="Avrupa">Avrupa</SelectItem>
                <SelectItem value="Asya Pasifik">Asya Pasifik</SelectItem>
                <SelectItem value="Latin Amerika">Latin Amerika</SelectItem>
                <SelectItem value="Afrika">Afrika</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isClient ? (
          <div className="relative">
            <div className="bg-muted w-full h-[500px] overflow-hidden rounded-b-md relative">
              <img
                src="/placeholder.svg?height=500&width=1000&text=Dünya+Haritası+Görselleştirmesi"
                alt="Dünya Haritası Görselleştirmesi"
                className="w-full h-full object-cover"
              />

              {/* Harita üzerindeki işaretçiler */}
              {filteredLocations.map((company) => (
                <div
                  key={company.id}
                  className="absolute w-4 h-4 bg-primary rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:ring-4 hover:ring-primary/20 transition-all"
                  style={{
                    left: `${(company.coordinates.lng + 180) * (100 / 360)}%`,
                    top: `${(90 - company.coordinates.lat) * (100 / 180)}%`,
                    width: `${Math.log2(company.visitors) * 5}px`,
                    height: `${Math.log2(company.visitors) * 5}px`,
                  }}
                  onMouseEnter={(e) => {
                    const tooltip = document.getElementById(`tooltip-${company.id}`)
                    if (tooltip) tooltip.style.display = "block"
                  }}
                  onMouseLeave={(e) => {
                    const tooltip = document.getElementById(`tooltip-${company.id}`)
                    if (tooltip) tooltip.style.display = "none"
                  }}
                  onClick={() => handleViewCompany(company.domain)}
                >
                  <div
                    id={`tooltip-${company.id}`}
                    className="hidden absolute top-0 left-full ml-2 z-10 bg-popover text-popover-foreground p-2 rounded-md shadow-md text-sm whitespace-nowrap"
                  >
                    <div className="font-medium">{company.name}</div>
                    <div className="text-xs">{company.location}</div>
                    <div className="text-xs">{company.industry}</div>
                    <div className="text-xs">{company.visitors} ziyaretçi</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-4 right-4 bg-card p-3 rounded-md shadow-md border">
              <div className="text-sm font-medium mb-2">En Çok Ziyaret Edilen Bölgeler</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Kuzey Amerika</span>
                  <Badge variant="outline">45%</Badge>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Avrupa</span>
                  <Badge variant="outline">28%</Badge>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Asya Pasifik</span>
                  <Badge variant="outline">18%</Badge>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Diğer Bölgeler</span>
                  <Badge variant="outline">9%</Badge>
                </div>
              </div>
            </div>

            {filteredLocations.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="text-center p-4">
                  <MapPin className="h-12 w-12 text-muted-foreground mb-2 mx-auto" />
                  <h3 className="text-lg font-semibold">Sonuç bulunamadı</h3>
                  <p className="text-sm text-muted-foreground">
                    Arama kriterlerinize uygun şirket bulunamadı. Lütfen filtrelerinizi değiştirin.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-[500px] flex items-center justify-center">
            <div className="text-center">
              <Globe className="h-16 w-16 text-muted-foreground mb-4 mx-auto" />
              <p className="text-muted-foreground">Harita görselleştirmesi yükleniyor...</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

