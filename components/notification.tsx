"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLogStore } from "@/lib/log-store"

interface Notification {
  id: string
  title: string
  description: string
  timestamp: string
  read: boolean
  type: "high-value" | "repeat-visit" | "product-page" | "info"
}

export function Notification() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { logs } = useLogStore()

  // Generate notifications based on visitor logs
  useEffect(() => {
    // Example notifications for demo
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "High-value account visit",
        description: "Acme Inc. is currently viewing your pricing page.",
        timestamp: "5 minutes ago",
        read: false,
        type: "high-value",
      },
      {
        id: "2",
        title: "Repeat visitor",
        description: "John Smith from Globex Corp has visited 5 times this week.",
        timestamp: "2 hours ago",
        read: false,
        type: "repeat-visit",
      },
      {
        id: "3",
        title: "Product page activity",
        description: "A visitor from Initech viewed the Knowledge Hub page 8 times.",
        timestamp: "Yesterday",
        read: true,
        type: "product-page",
      },
      {
        id: "4",
        title: "New report ready",
        description: "Your weekly visitor summary is ready to view.",
        timestamp: "2 days ago",
        read: true,
        type: "info",
      },
    ]

    // In a real application, we would generate notifications based on logs
    // For example, detecting repeat visitors or high-value account visits
    if (logs.length > 0) {
      // Track repeat visitors
      const ipVisits = new Map<string, number>()
      const ipDomainMap = new Map<string, string>()
      const domainPageVisits = new Map<string, Map<string, number>>()

      // Analyze log data
      logs.forEach((log) => {
        if (log.ip && log.ip !== "-") {
          ipVisits.set(log.ip, (ipVisits.get(log.ip) || 0) + 1)

          if (log.domain && log.domain !== "-") {
            ipDomainMap.set(log.ip, log.domain)

            // Track page visits
            if (!domainPageVisits.has(log.domain)) {
              domainPageVisits.set(log.domain, new Map())
            }

            if (log.pageUrl && log.pageUrl !== "-") {
              const pageVisits = domainPageVisits.get(log.domain)
              if (pageVisits) {
                pageVisits.set(log.pageUrl, (pageVisits.get(log.pageUrl) || 0) + 1)
              }
            }
          }
        }
      })

      // Create custom notifications
      const customNotifications: Notification[] = []

      // 1. Notifications for frequent visitors
      Array.from(ipVisits.entries())
        .filter(([_, visits]) => visits >= 5)
        .slice(0, 2) // Maximum 2 notifications
        .forEach(([ip, visits], index) => {
          const domain = ipDomainMap.get(ip) || "Unknown"
          const companyName =
            domain
              .replace("www.", "")
              .split(".")[0]
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()) +
            (domain.includes(".com") ? " Inc." : domain.includes(".org") ? " Organization" : " Corp")

          customNotifications.push({
            id: `repeat-${index}`,
            title: "Repeat visitor detected",
            description: `${companyName} (${ip}) has made ${visits} visits to the site.`,
            timestamp: "Just now",
            read: false,
            type: "repeat-visit",
          })
        })

      // 2. Notifications for domains that visit the same page frequently
      let hotPageNotifications = 0
      domainPageVisits.forEach((pageVisits, domain) => {
        if (hotPageNotifications >= 2) return

        Array.from(pageVisits.entries())
          .filter(([_, visits]) => visits >= 3) // Pages visited 3+ times
          .slice(0, 1) // Maximum 1 notification per domain
          .forEach(([page, visits]) => {
            const companyName =
              domain
                .replace("www.", "")
                .split(".")[0]
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase()) +
              (domain.includes(".com") ? " Inc." : domain.includes(".org") ? " Organization" : " Corp")

            const pageName = page.split("/").pop() || page

            customNotifications.push({
              id: `hotpage-${hotPageNotifications}`,
              title: "High interest page",
              description: `${companyName} is frequently visiting your page: ${pageName} (${visits} times)`,
              timestamp: "Just now",
              read: false,
              type: "product-page",
            })

            hotPageNotifications++
          })
      })

      // Add new notifications to the existing list
      if (customNotifications.length > 0) {
        // Keep old notifications but limit to maximum 8
        const combinedNotifications = [...customNotifications, ...mockNotifications].slice(0, 8)
        setNotifications(combinedNotifications)
        setUnreadCount(combinedNotifications.filter((n) => !n.read).length)
      } else {
        // Use default notifications if no custom ones
        setNotifications(mockNotifications)
        setUnreadCount(mockNotifications.filter((n) => !n.read).length)
      }
    } else {
      // Use default notifications if no logs
      setNotifications(mockNotifications)
      setUnreadCount(mockNotifications.filter((n) => !n.read).length)
    }
  }, [logs])

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "high-value":
        return <div className="h-2 w-2 rounded-full bg-destructive" />
      case "repeat-visit":
        return <div className="h-2 w-2 rounded-full bg-yellow-500" />
      case "product-page":
        return <div className="h-2 w-2 rounded-full bg-green-500" />
      default:
        return <div className="h-2 w-2 rounded-full bg-primary" />
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0">
        <div className="flex items-center justify-between p-4">
          <h4 className="text-sm font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="grid gap-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex gap-3 p-4 hover:bg-muted/50 ${notification.read ? "" : "bg-muted/30"}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex h-5 w-5 items-center justify-center pt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="grid gap-1">
                    <div className="font-semibold">{notification.title}</div>
                    <div className="text-sm text-muted-foreground">{notification.description}</div>
                    <div className="text-xs text-muted-foreground">{notification.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <Separator />
        <div className="p-4 text-center text-sm">
          <a href="/account/notifications" className="text-primary hover:underline">
            View all notifications
          </a>
        </div>
      </PopoverContent>
    </Popover>
  )
}

