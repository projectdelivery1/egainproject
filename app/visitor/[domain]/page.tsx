import type { Metadata } from "next"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { VisitorDetail } from "@/components/visitor-detail"

interface VisitorPageProps {
  params: {
    domain: string
  }
}

export function generateMetadata({ params }: VisitorPageProps): Metadata {
  return {
    title: `${decodeURIComponent(params.domain)} - eGain Analytics`,
    description: `Detailed visitor intelligence for ${decodeURIComponent(params.domain)}`,
  }
}

export default function VisitorPage({ params }: VisitorPageProps) {
  const domain = decodeURIComponent(params.domain)

  // In a real implementation, you would fetch visitor data based on the domain
  const visitorData = {
    ip: "192.168.1.1",
    domain: domain,
    timestamp: "Mar 12, 2025 14:30:45",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  }

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
        <VisitorDetail
          ip={visitorData.ip}
          domain={visitorData.domain}
          timestamp={visitorData.timestamp}
          userAgent={visitorData.userAgent}
        />
      </div>
    </div>
  )
}

