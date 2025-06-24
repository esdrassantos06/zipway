import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSessionFromHeaders } from "@/utils/getSession";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link2, BarChart3, ExternalLink, Edit } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getInitials, getShortUrl } from "@/utils/AppUtils";
import { getUserLinks } from "@/utils/getUserLinks";

export default async function ProfilePage() {
  const headersList = await headers();
  const session = await getSessionFromHeaders(headersList);

  if (!session) {
    console.error("No session found, redirecting to login...");
    return redirect("/auth/login");
  }

  const userLinks = await getUserLinks(session.user.id);
  const recentLinks = userLinks.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-12 md:py-24 dark:bg-gradient-to-br dark:from-gray-900 dark:via-indigo-900 dark:to-blue-900">
          <div className="container mx-auto flex flex-col items-center space-y-4 px-4 text-center md:px-6">
            <Avatar className="size-24 ring-2 ring-indigo-400 dark:ring-indigo-300">
              <AvatarImage src={session.user.image || ""} alt="Profile" />
              <AvatarFallback className="text-2xl text-gray-700 dark:text-gray-300">
                {getInitials(session.user.name || "User")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-5">
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl dark:text-white">
                {session.user.name || "Your Profile"}
              </h1>
              <Button asChild>
                <Link
                  href="/settings"
                  className="inline-flex items-center text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <Edit className="mr-2 size-4" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Profile Content */}
        <section className="w-full py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-6xl space-y-8">
              {/* Stats */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardContent className="flex flex-col items-center space-y-2 p-6">
                    <Link2 className="size-8 text-blue-600" />
                    <div className="text-2xl font-bold">{userLinks.length}</div>
                    <p className="text-sm text-gray-500">Links Created</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center space-y-2 p-6">
                    <BarChart3 className="size-8 text-blue-600" />
                    <div className="text-2xl font-bold">
                      {userLinks.reduce((acc, link) => acc + link.clicks, 0)}
                    </div>
                    <p className="text-sm text-gray-500">Total Clicks</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Links */}
              <div className="grid gap-8 lg:grid-cols-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Link2 className="size-5 text-blue-600" />
                      Recent Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentLinks.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        You haven’t created any links yet.
                      </p>
                    ) : (
                      recentLinks.map((link) => (
                        <div
                          key={link.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="space-y-1">
                            <div className="font-medium">{getShortUrl(link.shortId)}</div>
                            <div className="text-sm text-gray-500">
                              {link.targetUrl}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <span>{link.clicks} clicks</span>
                              <span>•</span>
                              <span>
                                {new Date(link.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={getShortUrl(link.shortId)} target="_blank">
                              <ExternalLink className="size-4" />
                            </a>
                          </Button>
                        </div>
                      ))
                    )}
                    {recentLinks.length === 0 ? undefined : (
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/dashboard">View All Links</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
