import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2, BarChart3, Shield, Zap, Users, Globe } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Shorten your links with
                    <span className="text-blue-600"> Zipway</span>
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                    Turn long URLs into short, elegant links. Track clicks,
                    analyze performance, and manage all your links in one place.
                  </p>
                  <div className="mt-6 space-x-4">
                    <Button size="lg" asChild>
                      <Link href="/auth/register">Create Free Account </Link>
                    </Button>
                    <Button variant="outline" asChild size="lg">
                      <Link href="/auth/login">Login</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Why choose Zipway?
                  </h2>
                  <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    We offer the best tools to manage and optimize your links
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                <Card>
                  <CardContent className="flex flex-col items-center space-y-4 p-6">
                    <BarChart3 className="size-12 text-blue-600" />
                    <h3 className="text-xl font-bold">Detailed Analytics</h3>
                    <p className="text-center text-gray-500">
                      Track your clicks, total links made, pause or delete your
                      links.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center space-y-4 p-6">
                    <Shield className="size-12 text-blue-600" />
                    <h3 className="text-xl font-bold">Safe and Reliable</h3>
                    <p className="text-center text-gray-500">
                      Your links are protected with encryption.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center space-y-4 p-6">
                    <Zap className="size-12 text-blue-600" />
                    <h3 className="text-xl font-bold">Super Fast</h3>
                    <p className="text-center text-gray-500">
                      Instant redirects with our high-performance global
                      infrastructure.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="w-full bg-gray-50 py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
                <div className="flex flex-col items-center space-y-4">
                  <Users className="size-12 text-blue-600" />
                  <div className="space-y-2 text-center">
                    <h3 className="text-3xl font-bold">2+ (LOL)</h3>
                    <p className="text-gray-500">Active users</p>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <Link2 className="size-12 text-blue-600" />
                  <div className="space-y-2 text-center">
                    <h3 className="text-3xl font-bold">20+</h3>
                    <p className="text-gray-500">Shortened links</p>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <Globe className="size-12 text-blue-600" />
                  <div className="space-y-2 text-center">
                    <h3 className="text-3xl font-bold">99.9%</h3>
                    <p className="text-gray-500">Uptime guaranteed</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
