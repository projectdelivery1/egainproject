"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, MapPin, RefreshCw, Search, Building2, AlertCircle } from "lucide-react"
import { useLogStore } from "@/lib/log-store"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface IPGeolocationProps {
  highlightedIp?: string
}

// IP address and geographic mapping component
export function IPGeolocation({ highlightedIp = "" }: IPGeolocationProps) {
  const router = useRouter()
  const { logs } = useLogStore()
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(highlightedIp)
  const [filterRegion, setFilterRegion] = useState("all")
  const [viewMode, setViewMode] = useState("map")
  const [enrichedData, setEnrichedData] = useState<any[]>([])
  const [isEnriched, setIsEnriched] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 37.0902, lng: -95.7129 }) // Default to US center
  const [mapZoom, setMapZoom] = useState(3)
  const [highlightedIpData, setHighlightedIpData] = useState<any | null>(null)

  useEffect(() => {
    setIsClient(true)

    // If there's a highlighted IP, set it as the search query
    if (highlightedIp) {
      setSearchQuery(highlightedIp)
    }
  }, [highlightedIp])

  // Extract IP addresses from log data
  useEffect(() => {
    if (logs.length > 0 && !isEnriched) {
      // Collect IP addresses and domains
      const uniqueIPs = new Set<string>()
      const ipDomainMap = new Map<string, string>()
      const ipPageViewsMap = new Map<string, Set<string>>()
      const ipTimestampsMap = new Map<string, string[]>()

      logs.forEach((log) => {
        if (log.ip && log.ip !== "-") {
          uniqueIPs.add(log.ip)

          if (log.domain && log.domain !== "-") {
            ipDomainMap.set(log.ip, log.domain)
          }

          // Track unique page views per IP
          if (!ipPageViewsMap.has(log.ip)) {
            ipPageViewsMap.set(log.ip, new Set())
          }
          if (log.pageUrl && log.pageUrl !== "-") {
            ipPageViewsMap.get(log.ip)?.add(log.pageUrl)
          }

          // Track timestamps for each IP
          if (!ipTimestampsMap.has(log.ip)) {
            ipTimestampsMap.set(log.ip, [])
          }
          ipTimestampsMap.get(log.ip)?.push(log.timestamp)
        }
      })

      // Convert unique IPs to array
      const ipList = Array.from(uniqueIPs)

      // Create sample data (in a real implementation, this would come from API calls)
      const mockEnrichedData = ipList.map((ip, index) => {
        const domain = ipDomainMap.get(ip) || "unknown.com"
        const pageViews = ipPageViewsMap.get(ip)?.size || 0
        const timestamps = ipTimestampsMap.get(ip) || []

        // Sort timestamps and get the most recent
        let lastVisit = "Unknown"
        if (timestamps.length > 0) {
          try {
            const sortedTimestamps = [...timestamps].sort((a, b) => {
              return new Date(b).getTime() - new Date(a).getTime()
            })
            lastVisit = sortedTimestamps[0]
          } catch (error) {
            console.error("Error sorting timestamps:", error)
          }
        }

        // Generate random location based on last octet of IP
        const lastOctet = Number.parseInt(ip.split(".").pop() || "0")
        const latOffset = (lastOctet % 180) - 90
        const lngOffset = (lastOctet % 360) - 180

        // Generate random company info
        const companyName =
          domain
            .replace("www.", "")
            .split(".")[0]
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()) +
          (domain.includes(".com") ? " Inc." : domain.includes(".org") ? " Organization" : " Corp")

        // Assign random industry
        const industries = [
          "Technology",
          "Healthcare",
          "Finance",
          "Education",
          "Manufacturing",
          "Retail",
          "Media",
          "Energy",
        ]
        const industry = industries[Math.floor(Math.random() * industries.length)]

        // Assign random company size
        const sizes = ["1-50", "51-200", "201-500", "1001-5000", "5000+"]
        const size = sizes[Math.floor(Math.random() * sizes.length)]

        // Assign random region
        const regions = ["North America", "Europe", "Asia Pacific", "Latin America", "Africa", "Middle East"]
        const regionIndex = Math.abs(latOffset + lngOffset) % regions.length
        const region = regions[regionIndex]

        // Assign random city
        const cities = {
          "North America": ["New York", "San Francisco", "Chicago", "Toronto", "Vancouver"],
          Europe: ["London", "Paris", "Berlin", "Madrid", "Rome"],
          "Asia Pacific": ["Tokyo", "Seoul", "Sydney", "Singapore", "Mumbai"],
          "Latin America": ["Mexico City", "São Paulo", "Buenos Aires", "Lima", "Bogotá"],
          Africa: ["Cairo", "Lagos", "Johannesburg", "Nairobi", "Casablanca"],
          "Middle East": ["Dubai", "Istanbul", "Tel Aviv", "Riyadh", "Doha"],
        }
        const cityIndex = Math.abs(lastOctet) % cities[region].length
        const city = cities[region][cityIndex]

        // Calculate visit count
        const visitCount = logs.filter((log) => log.ip === ip).length

        // Calculate engagement score (based on visit count and unique pages viewed)
        const uniquePages = ipPageViewsMap.get(ip)?.size || 0
        const engagementScore = Math.min(100, Math.round((visitCount * 5 + uniquePages * 10) / 2))

        // Generate realistic coordinates for the city
        let cityCoordinates = { lat: 0, lng: 0 }

        // Simplified mapping of major cities to coordinates
        const cityCoordinatesMap: Record<string, { lat: number; lng: number }> = {
          "New York": { lat: 40.7128, lng: -74.006 },
          "San Francisco": { lat: 37.7749, lng: -122.4194 },
          Chicago: { lat: 41.8781, lng: -87.6298 },
          Toronto: { lat: 43.6532, lng: -79.3832 },
          Vancouver: { lat: 49.2827, lng: -123.1207 },
          London: { lat: 51.5074, lng: -0.1278 },
          Paris: { lat: 48.8566, lng: 2.3522 },
          Berlin: { lat: 52.52, lng: 13.405 },
          Madrid: { lat: 40.4168, lng: -3.7038 },
          Rome: { lat: 41.9028, lng: 12.4964 },
          Tokyo: { lat: 35.6762, lng: 139.6503 },
          Seoul: { lat: 37.5665, lng: 126.978 },
          Sydney: { lat: -33.8688, lng: 151.2093 },
          Singapore: { lat: 1.3521, lng: 103.8198 },
          Mumbai: { lat: 19.076, lng: 72.8777 },
          "Mexico City": { lat: 19.4326, lng: -99.1332 },
          "São Paulo": { lat: -23.5505, lng: -46.6333 },
          "Buenos Aires": { lat: -34.6037, lng: -58.3816 },
          Lima: { lat: -12.0464, lng: -77.0428 },
          Bogotá: { lat: 4.711, lng: -74.0721 },
          Cairo: { lat: 30.0444, lng: 31.2357 },
          Lagos: { lat: 6.5244, lng: 3.3792 },
          Johannesburg: { lat: -26.2041, lng: 28.0473 },
          Nairobi: { lat: -1.2921, lng: 36.8219 },
          Casablanca: { lat: 33.5731, lng: -7.5898 },
          Dubai: { lat: 25.2048, lng: 55.2708 },
          Istanbul: { lat: 41.0082, lng: 28.9784 },
          "Tel Aviv": { lat: 32.0853, lng: 34.7818 },
          Riyadh: { lat: 24.7136, lng: 46.6753 },
          Doha: { lat: 25.2854, lng: 51.531 },
        }

        if (cityCoordinatesMap[city]) {
          cityCoordinates = cityCoordinatesMap[city]
        } else {
          // Fallback to random coordinates if city not found
          cityCoordinates = {
            lat: Math.random() * 180 - 90,
            lng: Math.random() * 360 - 180,
          }
        }

        return {
          id: index + 1,
          ip,
          domain,
          companyName,
          industry,
          size,
          region,
          city,
          location: `${city}, ${region}`,
          coordinates: cityCoordinates,
          visitCount,
          uniquePages: pageViews,
          engagementScore,
          lastVisit,
        }
      })

      setEnrichedData(mockEnrichedData)

      // If there's a highlighted IP, find its data
      if (highlightedIp) {
        const ipData = mockEnrichedData.find((item) => item.ip === highlightedIp)
        if (ipData) {
          setHighlightedIpData(ipData)
          // Center map on this IP's location
          setMapCenter(ipData.coordinates)
          setMapZoom(5) // Closer zoom for highlighted IP
        }
      }
    }
  }, [logs, isEnriched, highlightedIp])

  // Filter function
  const filteredData = useMemo(() => {
    return enrichedData.filter((item) => {
      // Region filter
      if (filterRegion !== "all" && item.region !== filterRegion) {
        return false
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          item.ip.toLowerCase().includes(query) ||
          item.domain.toLowerCase().includes(query) ||
          item.companyName.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          item.industry.toLowerCase().includes(query)
        )
      }

      return true
    })
  }, [enrichedData, filterRegion, searchQuery])

  // Update map center and zoom when filtered data changes
  useEffect(() => {
    if (filteredData.length > 0) {
      // If we have a highlighted IP with data, prioritize that
      if (highlightedIpData) {
        setMapCenter(highlightedIpData.coordinates)
        setMapZoom(5)
        return
      }

      const lats = filteredData.map((item) => item.coordinates.lat)
      const lngs = filteredData.map((item) => item.coordinates.lng)

      const avgLat = lats.reduce((sum, lat) => sum + lat, 0) / lats.length
      const avgLng = lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length

      setMapCenter({ lat: avgLat, lng: avgLng })
      setMapZoom(filteredData.length > 10 ? 2 : filteredData.length > 5 ? 3 : 4)
    }
  }, [filteredData, highlightedIpData])

  const handleViewCompany = (domain: string) => {
    router.push(`/visitor/${encodeURIComponent(domain)}`)
  }

  const handleEnrichData = () => {
    setIsLoading(true)

    toast({
      title: "IP Geolocation Enrichment",
      description: "Starting geolocation enrichment for all visitor IPs...",
    })

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsEnriched(true)

      toast({
        title: "Enrichment Complete",
        description: `Successfully enriched ${enrichedData.length} IP addresses with location and company data.`,
      })
    }, 2000)
  }

  // Calculate visitor distribution by region
  const regionDistribution = useMemo(() => {
    const distribution = filteredData.reduce(
      (acc, item) => {
        acc[item.region] = (acc[item.region] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const totalVisitors = Object.values(distribution).reduce((sum, count) => sum + count, 0)

    return Object.entries(distribution)
      .map(([region, count]) => ({
        region,
        count,
        percentage: Math.round((count / totalVisitors) * 100),
      }))
      .sort((a, b) => b.count - a.count)
  }, [filteredData])

  // Generate a map with the current center and zoom
  const mapUrl = useMemo(() => {
    return `https://maps.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&z=${mapZoom}&output=embed`
  }, [mapCenter.lat, mapCenter.lng, mapZoom])

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>IP Address & Geographic Mapping</CardTitle>
            <CardDescription>
              Transform visitor IP addresses into geographic locations and company information
            </CardDescription>
          </div>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <Button variant="outline" size="sm" onClick={handleEnrichData} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  Enrich IP Data
                </>
              )}
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
                placeholder="Search IP, domain or company..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterRegion} onValueChange={setFilterRegion}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="North America">North America</SelectItem>
                <SelectItem value="Europe">Europe</SelectItem>
                <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
                <SelectItem value="Latin America">Latin America</SelectItem>
                <SelectItem value="Africa">Africa</SelectItem>
                <SelectItem value="Middle East">Middle East</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Display highlighted IP information if available */}
        {highlightedIpData && (
          <div className="p-4 border-b">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>IP Information: {highlightedIpData.ip}</AlertTitle>
              <AlertDescription>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm">{highlightedIpData.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Company</p>
                    <p className="text-sm">{highlightedIpData.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Industry</p>
                    <p className="text-sm">{highlightedIpData.industry}</p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <Tabs value={viewMode} onValueChange={setViewMode} className="p-4">
          <TabsList>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-4">
            {isClient ? (
              <div className="relative">
                <div className="bg-muted w-full h-[500px] overflow-hidden rounded-md relative">
                  {/* Google Maps iframe */}
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  ></iframe>
                </div>

                <div className="absolute bottom-4 right-4 bg-card p-3 rounded-md shadow-md border">
                  <div className="text-sm font-medium mb-2">Regional Distribution</div>
                  <div className="space-y-1">
                    {regionDistribution.slice(0, 5).map(({ region, percentage }) => (
                      <div key={region} className="flex justify-between text-xs">
                        <span>{region}</span>
                        <Badge variant="outline">{percentage}%</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {filteredData.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <div className="text-center p-4">
                      <MapPin className="h-12 w-12 text-muted-foreground mb-2 mx-auto" />
                      <h3 className="text-lg font-semibold">No results found</h3>
                      <p className="text-sm text-muted-foreground">
                        No IP addresses match your search criteria. Please try different filters.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <Globe className="h-16 w-16 text-muted-foreground mb-4 mx-auto" />
                  <p className="text-muted-foreground">Loading map visualization...</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="table" className="mt-4">
            <div className="rounded-md border overflow-hidden">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b [&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">IP Address</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Company</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Location</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Industry</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Size</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Visits</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Engagement</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Building2 className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No data found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => (
                      <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle font-medium">{item.ip}</td>
                        <td className="p-4 align-middle">
                          <div>
                            <div className="font-medium">{item.companyName}</div>
                            <div className="text-xs text-muted-foreground">{item.domain}</div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">{item.location}</td>
                        <td className="p-4 align-middle">{item.industry}</td>
                        <td className="p-4 align-middle">{item.size}</td>
                        <td className="p-4 align-middle">{item.visitCount}</td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <Progress value={item.engagementScore} className="h-2 w-16" />
                            <span className="text-xs">{item.engagementScore}%</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <Button variant="ghost" size="sm" onClick={() => handleViewCompany(item.domain)}>
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

