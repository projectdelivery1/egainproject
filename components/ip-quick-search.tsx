"use client"

import { useState } from "react"
import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function IPQuickSearch() {
  const [ipAddress, setIpAddress] = useState("")
  const [ipInfo, setIpInfo] = useState<{
    ip: string
    country: string
    city: string
    region: string
    location: { lat: number; lng: number }
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!ipAddress) {
      toast({
        title: "IP address required",
        description: "Please enter an IP address to search",
        variant: "destructive",
      })
      return
    }

    // Validate IP address format
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
    if (!ipRegex.test(ipAddress)) {
      toast({
        title: "Invalid IP address",
        description: "Please enter a valid IPv4 address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real implementation, this would be an API call to a geolocation service
      // For demo purposes, we'll generate mock data based on the IP

      // Generate deterministic location data based on IP octets
      const octets = ipAddress.split(".").map(Number)

      // Use the octets to determine region
      const regions = ["North America", "Europe", "Asia", "South America", "Africa", "Oceania"]
      const regionIndex = octets[0] % regions.length
      const region = regions[regionIndex]

      // Use the octets to determine country
      const countries = {
        "North America": ["United States", "Canada", "Mexico"],
        Europe: ["United Kingdom", "Germany", "France", "Spain", "Italy"],
        Asia: ["Japan", "China", "India", "South Korea", "Singapore"],
        "South America": ["Brazil", "Argentina", "Colombia", "Chile"],
        Africa: ["South Africa", "Egypt", "Nigeria", "Kenya"],
        Oceania: ["Australia", "New Zealand"],
      }
      const countryIndex = octets[1] % countries[region].length
      const country = countries[region][countryIndex]

      // Use the octets to determine city
      const cities = {
        "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
        Canada: ["Toronto", "Vancouver", "Montreal", "Calgary"],
        Mexico: ["Mexico City", "Guadalajara", "Monterrey"],
        "United Kingdom": ["London", "Manchester", "Birmingham", "Glasgow"],
        Germany: ["Berlin", "Munich", "Hamburg", "Frankfurt"],
        France: ["Paris", "Marseille", "Lyon", "Toulouse"],
        Spain: ["Madrid", "Barcelona", "Valencia", "Seville"],
        Italy: ["Rome", "Milan", "Naples", "Turin"],
        Japan: ["Tokyo", "Osaka", "Kyoto", "Yokohama"],
        China: ["Beijing", "Shanghai", "Guangzhou", "Shenzhen"],
        India: ["Mumbai", "Delhi", "Bangalore", "Hyderabad"],
        "South Korea": ["Seoul", "Busan", "Incheon"],
        Singapore: ["Singapore"],
        Brazil: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
        Argentina: ["Buenos Aires", "Córdoba", "Rosario"],
        Colombia: ["Bogotá", "Medellín", "Cali"],
        Chile: ["Santiago", "Valparaíso", "Concepción"],
        "South Africa": ["Johannesburg", "Cape Town", "Durban"],
        Egypt: ["Cairo", "Alexandria", "Giza"],
        Nigeria: ["Lagos", "Abuja", "Kano"],
        Kenya: ["Nairobi", "Mombasa", "Kisumu"],
        Australia: ["Sydney", "Melbourne", "Brisbane", "Perth"],
        "New Zealand": ["Auckland", "Wellington", "Christchurch"],
      }

      const cityIndex = octets[2] % (cities[country]?.length || 1)
      const city = cities[country]?.[cityIndex] || "Unknown City"

      // Generate coordinates based on the city
      const cityCoordinates: Record<string, { lat: number; lng: number }> = {
        "New York": { lat: 40.7128, lng: -74.006 },
        "Los Angeles": { lat: 34.0522, lng: -118.2437 },
        Chicago: { lat: 41.8781, lng: -87.6298 },
        London: { lat: 51.5074, lng: -0.1278 },
        Paris: { lat: 48.8566, lng: 2.3522 },
        Berlin: { lat: 52.52, lng: 13.405 },
        Tokyo: { lat: 35.6762, lng: 139.6503 },
        Beijing: { lat: 39.9042, lng: 116.4074 },
        Sydney: { lat: -33.8688, lng: 151.2093 },
        "São Paulo": { lat: -23.5505, lng: -46.6333 },
      }

      // Default coordinates if city not found
      const location = cityCoordinates[city] || {
        lat: (octets[0] % 180) - 90 + octets[2] / 255,
        lng: (octets[1] % 360) - 180 + octets[3] / 255,
      }

      // Set the IP info
      setIpInfo({
        ip: ipAddress,
        country,
        city,
        region,
        location,
      })

      // Success toast
      toast({
        title: "IP Location Found",
        description: `${ipAddress} is located in ${city}, ${country}`,
      })
    } catch (error) {
      toast({
        title: "Error finding IP location",
        description: "Could not determine the location for this IP address",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = () => {
    if (ipInfo) {
      router.push(`/ip-mapping?ip=${encodeURIComponent(ipInfo.ip)}`)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter IP address (e.g. 145.223.99.10)"
                className="pl-8"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "Searching..." : "Lookup IP"}
            </Button>
          </div>

          {ipInfo && (
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">{ipInfo.ip}</h3>
                  <p className="text-sm text-muted-foreground">
                    {ipInfo.city}, {ipInfo.country} ({ipInfo.region})
                  </p>
                  <div className="mt-2">
                    <Button size="sm" variant="outline" onClick={handleViewDetails}>
                      View on Map
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

