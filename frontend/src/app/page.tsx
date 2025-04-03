import { ShortenUrlForm } from "@/components/shorten-url-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Zipway - URL Shortener</CardTitle>
          <CardDescription>Enter a long URL to get a shortened link</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="shorten">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="shorten">Shorten URL</TabsTrigger>
              <TabsTrigger value="info">How It Works</TabsTrigger>
            </TabsList>
            <TabsContent value="shorten" className="pt-4">
              <ShortenUrlForm />
            </TabsContent>
            <TabsContent value="info" className="pt-4">
              <div className="space-y-4 text-sm">
                <p>This URL shortener creates a compact link that redirects to your original URL.</p>
                <p>
                  Simply paste your long URL in the form, click &quot;Shorten&quot;, and you&apos;ll get a short link
                  you can share anywhere.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}
