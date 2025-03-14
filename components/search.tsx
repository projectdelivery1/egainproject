"use client"

import { useState, useEffect } from "react"
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useRouter } from "next/navigation"
import { useLogStore } from "@/lib/log-store"
import { Badge } from "@/components/ui/badge"

export function Search() {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { logs } = useLogStore()
  const router = useRouter()

  // Extract unique companies, visitors, pages, and IPs from logs
  const [searchResults, setSearchResults] = useState({
    companies: [] as { name: string; domain: string }[],
    visitors: [] as { name: string; company: string; domain: string }[],
    pages: [] as string[],
    ips: [] as { ip: string; domain: string; location: string }[],
  })

  useEffect(() => {
    if (logs.length > 0) {
      // Extract unique domains (companies)
      const uniqueDomains = new Set<string>()
      const domainMap = new Map<string, string>()

      // Extract unique IPs
      const uniqueIPs = new Set<string>()
      const ipDomainMap = new Map<string, string>()

      // Extract unique pages
      const uniquePages = new Set<string>()

      logs.forEach((log) => {
        if (log.domain && log.domain !== "-") {
          uniqueDomains.add(log.domain)

          // Generate company name from domain
          const companyName =
            log.domain
              .replace("www.", "")
              .split(".")[0]
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()) +
            (log.domain.includes(".com") ? " Inc." : log.domain.includes(".org") ? " Organization" : " Corp")

          domainMap.set(log.domain, companyName)
        }

        if (log.ip && log.ip !== "-") {
          uniqueIPs.add(log.ip)
          if (log.domain) {
            ipDomainMap.set(log.ip, log.domain)
          }
        }

        if (log.pageUrl && log.pageUrl !== "-") {
          uniquePages.add(log.pageUrl)
        }
      })

      // Generate mock locations for IPs
      const ipLocations: { ip: string; domain: string; location: string }[] = Array.from(uniqueIPs).map((ip) => {
        const domain = ipDomainMap.get(ip) || "-"

        // Generate a deterministic location based on IP
        const lastOctet = Number.parseInt(ip.split(".").pop() || "0")
        const regions = ["North America", "Europe", "Asia Pacific", "Latin America", "Africa", "Middle East"]
        const cities = [
          ["New York", "San Francisco", "Chicago", "Toronto", "Vancouver"],
          ["London", "Paris", "Berlin", "Madrid", "Rome"],
          ["Tokyo", "Seoul", "Sydney", "Singapore", "Mumbai"],
          ["Mexico City", "São Paulo", "Buenos Aires", "Lima", "Bogotá"],
          ["Cairo", "Lagos", "Johannesburg", "Nairobi", "Casablanca"],
          ["Dubai", "Istanbul", "Tel Aviv", "Riyadh", "Doha"],
        ]

        const regionIndex = lastOctet % regions.length
        const cityIndex = (lastOctet * 3) % cities[regionIndex].length
        const location = `${cities[regionIndex][cityIndex]}, ${regions[regionIndex]}`

        return { ip, domain, location }
      })

      // Generate mock visitors
      const visitors = Array.from(uniqueDomains).map((domain, index) => {
        const companyName = domainMap.get(domain) || domain

        // Generate a random name
        const firstNames = ["John", "Jane", "Robert", "Emily", "Michael", "Sarah", "David", "Lisa"]
        const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Wilson"]
        const name = `${firstNames[index % firstNames.length]} ${lastNames[index % lastNames.length]}`

        return { name, company: companyName, domain }
      })

      setSearchResults({
        companies: Array.from(uniqueDomains).map((domain) => ({
          name: domainMap.get(domain) || domain,
          domain,
        })),
        visitors,
        pages: Array.from(uniquePages),
        ips: ipLocations,
      })
    }
  }, [logs])

  // Filter search results based on query
  const filteredResults = {
    companies: searchResults.companies
      .filter(
        (company) =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.domain.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .slice(0, 5),

    visitors: searchResults.visitors
      .filter(
        (visitor) =>
          visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          visitor.company.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .slice(0, 5),

    pages: searchResults.pages.filter((page) => page.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5),

    ips: searchResults.ips.filter((ip) => ip.ip.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5),
  }

  const handleSelect = (type: string, value: string) => {
    setOpen(false)

    if (type === "ip") {
      // Navigate to IP mapping page with the IP highlighted
      router.push(`/ip-mapping?ip=${encodeURIComponent(value)}`)
    } else if (type === "company" || type === "visitor") {
      // Navigate to visitor detail page
      router.push(`/visitor/${encodeURIComponent(value)}`)
    } else if (type === "page") {
      // Navigate to page analytics (could be implemented in the future)
      router.push(`/pages?path=${encodeURIComponent(value)}`)
    }
  }

  return (
    <>
      <div className="relative w-full max-w-sm">
        <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search visitors, companies, IPs..."
          className="pl-8"
          onClick={() => setOpen(true)}
          readOnly
        />
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search visitors, companies, IPs..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {filteredResults.ips.length > 0 && (
            <CommandGroup heading="IP Addresses">
              {filteredResults.ips.map((ip) => (
                <CommandItem key={ip.ip} onSelect={() => handleSelect("ip", ip.ip)}>
                  <div className="flex flex-col">
                    <span>{ip.ip}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      {ip.location}
                      {ip.domain !== "-" && (
                        <Badge variant="outline" className="text-xs ml-1">
                          {ip.domain}
                        </Badge>
                      )}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredResults.companies.length > 0 && (
            <CommandGroup heading="Companies">
              {filteredResults.companies.map((company) => (
                <CommandItem key={company.domain} onSelect={() => handleSelect("company", company.domain)}>
                  {company.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredResults.visitors.length > 0 && (
            <CommandGroup heading="Visitors">
              {filteredResults.visitors.map((visitor) => (
                <CommandItem
                  key={`${visitor.name}-${visitor.domain}`}
                  onSelect={() => handleSelect("visitor", visitor.domain)}
                >
                  {visitor.name} ({visitor.company})
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredResults.pages.length > 0 && (
            <CommandGroup heading="Pages">
              {filteredResults.pages.map((page) => (
                <CommandItem key={page} onSelect={() => handleSelect("page", page)}>
                  {page}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}

