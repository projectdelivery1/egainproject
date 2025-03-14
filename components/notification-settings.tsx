"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Bell, Mail, MessageSquare, Phone, Save, AlertTriangle, Building2, Clock, DollarSign } from "lucide-react"

export function NotificationSettings() {
  const { toast } = useToast()
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [slackEnabled, setSlackEnabled] = useState(true)

  const [highValueNotification, setHighValueNotification] = useState(true)
  const [repeatVisitNotification, setRepeatVisitNotification] = useState(true)
  const [pricingPageNotification, setPricingPageNotification] = useState(true)
  const [competitorVisitNotification, setCompetitorVisitNotification] = useState(false)

  const [emailAddress, setEmailAddress] = useState("s.connor@egain.com")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [slackChannel, setSlackChannel] = useState("#sales-leads")

  const handleSaveSettings = () => {
    toast({
      title: "Bildirim ayarları kaydedildi",
      description: "Bildirim tercihleriniz başarıyla güncellendi.",
    })
  }

  const handleTestNotification = () => {
    toast({
      title: "Test bildirimi gönderildi",
      description: "Yapılandırılmış kanallarınıza bir test bildirimi gönderildi.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bildirim Ayarları</CardTitle>
        <CardDescription>
          Ziyaretçi ve potansiyel müşteri uyarılarını nasıl almak istediğinizi yapılandırın
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="channels" className="space-y-4">
          <TabsList>
            <TabsTrigger value="channels">Bildirim Kanalları</TabsTrigger>
            <TabsTrigger value="triggers">Bildirim Tetikleyicileri</TabsTrigger>
            <TabsTrigger value="schedule">Zamanlama</TabsTrigger>
          </TabsList>

          <TabsContent value="channels" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="email-notifications" className="text-base">
                      E-posta Bildirimleri
                    </Label>
                    <p className="text-sm text-muted-foreground">E-posta yoluyla bildirim alın</p>
                  </div>
                </div>
                <Switch id="email-notifications" checked={emailEnabled} onCheckedChange={setEmailEnabled} />
              </div>

              {emailEnabled && (
                <div className="ml-7 space-y-2">
                  <Label htmlFor="email-address">E-posta Adresi</Label>
                  <Input
                    id="email-address"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
              )}

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="sms-notifications" className="text-base">
                      SMS Bildirimleri
                    </Label>
                    <p className="text-sm text-muted-foreground">Kısa mesaj yoluyla bildirim alın</p>
                  </div>
                </div>
                <Switch id="sms-notifications" checked={smsEnabled} onCheckedChange={setSmsEnabled} />
              </div>

              {smsEnabled && (
                <div className="ml-7 space-y-2">
                  <Label htmlFor="phone-number">Telefon Numarası</Label>
                  <Input
                    id="phone-number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+90 (555) 123 4567"
                  />
                </div>
              )}

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="slack-notifications" className="text-base">
                      Slack Bildirimleri
                    </Label>
                    <p className="text-sm text-muted-foreground">Slack'te bildirim alın</p>
                  </div>
                </div>
                <Switch id="slack-notifications" checked={slackEnabled} onCheckedChange={setSlackEnabled} />
              </div>

              {slackEnabled && (
                <div className="ml-7 space-y-2">
                  <Label htmlFor="slack-channel">Slack Kanalı</Label>
                  <Input
                    id="slack-channel"
                    value={slackChannel}
                    onChange={(e) => setSlackChannel(e.target.value)}
                    placeholder="#kanal-adı"
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="triggers" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="high-value-visitor" className="text-base">
                      Yüksek Değerli Ziyaretçi
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Yüksek değerli bir hesap web sitenizi ziyaret ettiğinde bildirim alın
                    </p>
                  </div>
                </div>
                <Switch
                  id="high-value-visitor"
                  checked={highValueNotification}
                  onCheckedChange={setHighValueNotification}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="repeat-visitor" className="text-base">
                      Tekrarlayan Ziyaretçi
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Birisi bir hafta içinde sitenizi 3'ten fazla kez ziyaret ettiğinde bildirim alın
                    </p>
                  </div>
                </div>
                <Switch
                  id="repeat-visitor"
                  checked={repeatVisitNotification}
                  onCheckedChange={setRepeatVisitNotification}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="pricing-page" className="text-base">
                      Fiyatlandırma Sayfası Ziyareti
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Birisi fiyatlandırma sayfanızı birden çok kez ziyaret ettiğinde bildirim alın
                    </p>
                  </div>
                </div>
                <Switch
                  id="pricing-page"
                  checked={pricingPageNotification}
                  onCheckedChange={setPricingPageNotification}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="competitor-visit" className="text-base">
                      Rakip Ziyareti
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Bir rakipten birisi web sitenizi ziyaret ettiğinde bildirim alın
                    </p>
                  </div>
                </div>
                <Switch
                  id="competitor-visit"
                  checked={competitorVisitNotification}
                  onCheckedChange={setCompetitorVisitNotification}
                />
              </div>

              <div className="pt-4">
                <Label htmlFor="custom-trigger" className="text-base">
                  Özel Bildirim Tetikleyicisi
                </Label>
                <p className="text-sm text-muted-foreground mb-2">Bildirim göndermek için özel bir kural oluşturun</p>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Select defaultValue="page">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Koşul" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="page">Sayfa Ziyareti</SelectItem>
                        <SelectItem value="company">Şirket</SelectItem>
                        <SelectItem value="location">Konum</SelectItem>
                        <SelectItem value="visits">Ziyaret Sayısı</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select defaultValue="contains">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Operatör" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contains">İçerir</SelectItem>
                        <SelectItem value="equals">Eşittir</SelectItem>
                        <SelectItem value="gt">Büyüktür</SelectItem>
                        <SelectItem value="lt">Küçüktür</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input placeholder="Değer" className="flex-1" />

                    <Button variant="outline" size="icon">
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="notification-frequency">Bildirim Sıklığı</Label>
                  <Select defaultValue="realtime">
                    <SelectTrigger id="notification-frequency">
                      <SelectValue placeholder="Sıklık seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Gerçek Zamanlı</SelectItem>
                      <SelectItem value="hourly">Saatlik Özet</SelectItem>
                      <SelectItem value="daily">Günlük Özet</SelectItem>
                      <SelectItem value="weekly">Haftalık Özet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quiet-hours">Sessiz Saatler</Label>
                  <Select defaultValue="none">
                    <SelectTrigger id="quiet-hours">
                      <SelectValue placeholder="Sessiz saatler seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sessiz saat yok</SelectItem>
                      <SelectItem value="night">Gece (22:00 - 07:00)</SelectItem>
                      <SelectItem value="weekend">Hafta Sonları</SelectItem>
                      <SelectItem value="custom">Özel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification-limit">Günlük Bildirim Limiti</Label>
                <Select defaultValue="10">
                  <SelectTrigger id="notification-limit">
                    <SelectValue placeholder="Limit seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 bildirim</SelectItem>
                    <SelectItem value="10">10 bildirim</SelectItem>
                    <SelectItem value="20">20 bildirim</SelectItem>
                    <SelectItem value="50">50 bildirim</SelectItem>
                    <SelectItem value="unlimited">Sınırsız</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Her gün alacağınız bildirim sayısını sınırlayın</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead-score-threshold">Potansiyel Müşteri Skoru Eşiği</Label>
                <Input id="lead-score-threshold" type="number" placeholder="75" defaultValue="75" min="0" max="100" />
                <p className="text-xs text-muted-foreground">
                  Yalnızca bu eşiğin üzerinde bir skora sahip potansiyel müşteriler için bildirim alın
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="important-accounts" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span>Önemli Hesaplar</span>
                </Label>
                <Input id="important-accounts" placeholder="acme.com, example.org, ..." />
                <p className="text-xs text-muted-foreground">
                  Bu önemli hesaplardan herhangi bir ziyaret olduğunda her zaman bildirim alın
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleTestNotification}>
            <Bell className="mr-2 h-4 w-4" />
            Test Bildirimi
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Ayarları Kaydet
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

