"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TechStackProps {
  domain: string
}

export function TechStack({ domain }: TechStackProps) {
  // Mock tech stack data - in a real implementation, this would come from BuiltWith or Wappalyzer API
  const techCategories = [
    {
      name: "Analytics",
      technologies: [
        { name: "Google Analytics", icon: "🔍", confidence: "High" },
        { name: "Hotjar", icon: "🔥", confidence: "Medium" },
      ],
    },
    {
      name: "CRM & Marketing",
      technologies: [
        { name: "Salesforce", icon: "☁️", confidence: "High" },
        { name: "HubSpot", icon: "🧲", confidence: "High" },
        { name: "Marketo", icon: "📊", confidence: "Medium" },
      ],
    },
    {
      name: "Hosting & Infrastructure",
      technologies: [
        { name: "AWS", icon: "☁️", confidence: "High" },
        { name: "Cloudflare", icon: "🛡️", confidence: "High" },
      ],
    },
    {
      name: "Frontend Technologies",
      technologies: [
        { name: "React", icon: "⚛️", confidence: "High" },
        { name: "Next.js", icon: "▲", confidence: "Medium" },
        { name: "Tailwind CSS", icon: "🎨", confidence: "Medium" },
      ],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technology Stack</CardTitle>
        <CardDescription>Technologies used by {domain.replace("www.", "")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {techCategories.map((category) => (
            <div key={category.name} className="space-y-2">
              <h3 className="text-sm font-medium">{category.name}</h3>
              <div className="flex flex-wrap gap-2">
                {category.technologies.map((tech) => (
                  <Badge key={tech.name} variant="outline" className="flex items-center gap-1">
                    <span>{tech.icon}</span>
                    <span>{tech.name}</span>
                    {tech.confidence === "High" && <span className="ml-1 h-2 w-2 rounded-full bg-green-500" />}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Data sourced from BuiltWith and Wappalyzer</p>
        </div>
      </CardContent>
    </Card>
  )
}

