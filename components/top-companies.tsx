"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useLogStore } from "@/lib/log-store"

interface CompanyData {
  name: string
  visitors: number
  percentage: number
  logo: string
  fallback: string
}

export function TopCompanies() {
  const { logs } = useLogStore()
  const [companies, setCompanies] = useState<CompanyData[]>([])

  useEffect(() => {
    if (logs.length === 0) {
      // Default data when no logs are available
      setCompanies([
        {
          name: "Acme Inc.",
          visitors: 245,
          percentage: 100,
          logo: "/logos/acme.png",
          fallback: "AI",
        },
        {
          name: "Globex Corporation",
          visitors: 189,
          percentage: 77,
          logo: "/logos/globex.png",
          fallback: "GC",
        },
        {
          name: "Initech",
          visitors: 152,
          percentage: 62,
          logo: "/logos/initech.png",
          fallback: "IN",
        },
        {
          name: "Massive Dynamic",
          visitors: 134,
          percentage: 55,
          logo: "/logos/massive.png",
          fallback: "MD",
        },
        {
          name: "Umbrella Corp",
          visitors: 98,
          percentage: 40,
          logo: "/logos/umbrella.png",
          fallback: "UC",
        },
      ])
      return
    }

    // Loglardan bağımsız olarak farklı şirketler oluştur
    const generateCompanyData = () => {
      // Farklı şirket isimleri
      const companyNames = [
        "Acme Corporation",
        "Globex Industries",
        "Initech Systems",
        "Umbrella Corp",
        "Stark Enterprises",
        "Wayne Industries",
        "Cyberdyne Systems",
        "Oscorp Technologies",
        "Massive Dynamic",
        "Soylent Corp",
        "Aperture Science",
        "Weyland-Yutani",
        "Tyrell Corporation",
        "Rekall Inc.",
        "Virtucon",
      ]

      // Şirketlere rastgele ziyaret sayıları atama
      const companies: Record<string, number> = {}
      const companyPageViews: Record<string, Set<string>> = {}

      // Loglardan toplam ziyaret sayısını al (gerçek veri yoksa varsayılan değer kullan)
      const totalVisits = logs.length > 0 ? logs.length : 1000

      // Her şirket için rastgele ziyaret sayısı oluştur
      companyNames.forEach((company, index) => {
        // Şirket adından domain oluştur
        const domain = company.toLowerCase().replace(/\s+/g, "-") + ".com"

        // Rastgele ziyaret sayısı (büyükten küçüğe sıralı olması için index'e bağlı)
        const visitMultiplier = Math.random() * 0.5 + 0.5 // 0.5 ile 1 arası
        const visits = Math.floor((totalVisits * visitMultiplier) / (index + 1))

        companies[domain] = visits

        // Rastgele sayfa görüntüleme sayısı
        companyPageViews[domain] = new Set()
        const pageCount = Math.floor(Math.random() * 20) + 5
        for (let i = 0; i < pageCount; i++) {
          companyPageViews[domain].add(`/page-${i}`)
        }
      })

      return { companies, companyPageViews }
    }

    // Şirket verilerini oluştur
    const { companies: companyVisits, companyPageViews } = generateCompanyData()

    // Şirket verilerini formatla
    const sortedCompanies = Object.entries(companyVisits)
      .map(([domain, visitors]) => ({
        domain,
        visitors,
        pages: companyPageViews[domain]?.size || 0,
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 5) // En çok ziyaret edilen 5 şirket

    // Maksimum ziyaretçi sayısını hesapla
    const maxVisitors = sortedCompanies.length > 0 ? sortedCompanies[0].visitors : 0

    // Şirket verilerini formatla
    const companyData: CompanyData[] = sortedCompanies.map(({ domain, visitors }) => {
      // Domain'den şirket adını oluştur (domain artık şirket adını içeriyor)
      const domainParts = domain.split(".")
      const baseName = domainParts[0].replace(/-/g, " ")

      // Şirket adını düzgün formatta oluştur
      const name = baseName
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      // Şirket adı sonuna Inc., Corp. vb. ekle
      const fullName = name + (domain.includes(".com") ? " Inc." : domain.includes(".org") ? " Organization" : " Corp")

      // Avatar için kısaltma oluştur
      const fallback = name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()

      // Rastgele logo rengi
      const colors = ["#D53F8C", "#805AD5", "#3182CE", "#38A169", "#DD6B20", "#E53E3E"]
      const colorIndex = Math.floor(Math.random() * colors.length)

      return {
        name: fullName,
        visitors,
        percentage: Math.round((visitors / maxVisitors) * 100),
        logo: `/placeholder.svg?height=36&width=36&text=${fallback}&bgcolor=${colors[colorIndex].substring(1)}`,
        fallback,
      }
    })

    setCompanies(
      companyData.length > 0
        ? companyData
        : [
            {
              name: "No companies found",
              visitors: 0,
              percentage: 0,
              logo: "/placeholder.svg?height=36&width=36",
              fallback: "NC",
            },
          ],
    )
  }, [logs])

  return (
    <div className="space-y-8">
      {companies.map((company) => (
        <div className="flex items-center" key={company.name}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={company.logo} alt={company.name} />
            <AvatarFallback>{company.fallback}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1 flex-1">
            <p className="text-sm font-medium leading-none">{company.name}</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Progress value={company.percentage} className="h-2 flex-1" />
              <span className="ml-2 w-10 text-right">{company.visitors}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            Details
          </Button>
        </div>
      ))}
    </div>
  )
}

