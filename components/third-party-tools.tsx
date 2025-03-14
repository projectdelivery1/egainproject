"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Check, AlertCircle, DollarSign, Star } from "lucide-react"

export function ThirdPartyTools() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>IP Intelligence Tools</CardTitle>
        <CardDescription>Third-party services to enhance your visitor data with IP-based insights</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="geolocation">
          <TabsList className="mb-4">
            <TabsTrigger value="geolocation">Geolocation</TabsTrigger>
            <TabsTrigger value="company">Company Identification</TabsTrigger>
            <TabsTrigger value="threat">Threat Intelligence</TabsTrigger>
          </TabsList>

          <TabsContent value="geolocation" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">MaxMind GeoIP2</CardTitle>
                    <Badge>Industry Standard</Badge>
                  </div>
                  <CardDescription>Accurate IP geolocation database</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>High accuracy for country, region, and city</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Database and API options available</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Free tier with limited features</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>Paid plans start at $25/month</span>
                    </div>
                    <div className="mt-4">
                      <Button size="sm" variant="outline" className="w-full" asChild>
                        <a
                          href="https://www.maxmind.com/en/geoip2-services-and-databases"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit Website
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">ipstack</CardTitle>
                    <Badge variant="outline">Easy Integration</Badge>
                  </div>
                  <CardDescription>Real-time IP to geolocation API</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Simple REST API with JSON responses</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Includes currency, language, and timezone data</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Free tier with 10,000 requests/month</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>Paid plans start at $9.99/month</span>
                    </div>
                    <div className="mt-4">
                      <Button size="sm" variant="outline" className="w-full" asChild>
                        <a href="https://ipstack.com/" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit Website
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">IP-API</CardTitle>
                  <Badge variant="secondary">Free Option</Badge>
                </div>
                <CardDescription>Geolocation API with no API key required for non-commercial use</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Free for non-commercial use (45 requests/minute)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Provides country, region, city, ZIP, timezone, and ISP information</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                    <span>Commercial use requires paid subscription</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>Pro plans start at $15/month</span>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" variant="outline" className="w-full" asChild>
                      <a href="https://ip-api.com/" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit Website
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">Clearbit</CardTitle>
                    <Badge>Premium</Badge>
                  </div>
                  <CardDescription>Company and person enrichment API</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Identify companies from IP addresses</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Comprehensive company data (size, industry, funding)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Integration with major CRM platforms</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>Enterprise pricing (contact sales)</span>
                    </div>
                    <div className="mt-4">
                      <Button size="sm" variant="outline" className="w-full" asChild>
                        <a href="https://clearbit.com/" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit Website
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">IPinfo</CardTitle>
                    <Badge variant="outline">Company Data</Badge>
                  </div>
                  <CardDescription>IP address to company and geolocation data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Company identification from IP addresses</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Includes company name, domain, and type</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Free tier with 50,000 requests/month</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>Paid plans start at $99/month</span>
                    </div>
                    <div className="mt-4">
                      <Button size="sm" variant="outline" className="w-full" asChild>
                        <a href="https://ipinfo.io/" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit Website
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">KickFire</CardTitle>
                  <Badge variant="secondary">B2B Focus</Badge>
                </div>
                <CardDescription>IP address intelligence for B2B companies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Specializes in B2B company identification</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Provides NAICS/SIC codes, employee count, revenue</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Real-time visitor identification</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>Custom pricing (contact sales)</span>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" variant="outline" className="w-full" asChild>
                      <a href="https://kickfire.com/" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit Website
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="threat" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">AbuseIPDB</CardTitle>
                    <Badge>Security</Badge>
                  </div>
                  <CardDescription>IP address abuse and threat detection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Check if visitor IPs are associated with malicious activity</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Community-driven database of reported IPs</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Free tier with limited checks</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>Paid plans start at $19.99/month</span>
                    </div>
                    <div className="mt-4">
                      <Button size="sm" variant="outline" className="w-full" asChild>
                        <a href="https://www.abuseipdb.com/" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit Website
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">IPQualityScore</CardTitle>
                    <Badge variant="outline">Fraud Prevention</Badge>
                  </div>
                  <CardDescription>Fraud detection and IP reputation data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Detect proxy, VPN, and TOR connections</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Fraud risk scoring for visitor IPs</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Free tier with 5,000 requests</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>Paid plans start at $29.99/month</span>
                    </div>
                    <div className="mt-4">
                      <Button size="sm" variant="outline" className="w-full" asChild>
                        <a href="https://www.ipqualityscore.com/" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit Website
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Recommendation</h3>
                  <p className="text-sm text-muted-foreground">
                    For a complete visitor intelligence solution, we recommend combining services:
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• MaxMind GeoIP2 for accurate geolocation</li>
                    <li>• Clearbit or IPinfo for company identification</li>
                    <li>• AbuseIPDB for basic threat intelligence</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

