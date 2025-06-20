import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileText, Users, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const lastUpdated = () => new Date("2025-06-20").toLocaleDateString();

const keyPoints = [
  {
    Icon: Shield,
    title: "What Are Cookies?",
    description:
      "Cookies are small data files stored on your device to improve your browsing experience.",
  },
  {
    Icon: Users,
    title: "How We Use Cookies",
    description:
      "We use cookies to remember your preferences, analyze usage, and provide personalized content.",
  },
  {
    Icon: FileText,
    title: "Third-Party Cookies",
    description:
      "Some cookies are set by third parties to enable features like analytics and advertising.",
  },
  {
    Icon: AlertTriangle,
    title: "Managing Cookies",
    description:
      "You can control or disable cookies through your browser settings, but some features may not work properly.",
  },
];

export default function CookiesPage() {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-12 md:py-24 lg:py-32 dark:bg-gradient-to-br dark:from-gray-900 dark:via-indigo-900 dark:to-blue-900">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Cookies
                    <span className="text-blue-600"> Policy</span>
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-300">
                    This Cookies Policy explains how we use cookies and similar
                    technologies on our website.
                  </p>
                  <p className="text-sm text-gray-400">
                    Last updated: {lastUpdated()}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Key Points Section */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
              <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
                {keyPoints.map(({ Icon, title, description }) => (
                  <Card key={title} className="h-70 w-120">
                    <CardContent className="flex flex-col items-center space-y-4 p-6">
                      <Icon className="size-12 text-blue-600" />
                      <h3 className="text-xl font-bold">{title}</h3>
                      <p className="text-center text-gray-500">{description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Detailed Cookies Policy Section */}
          <section className="w-full bg-gray-50 py-12 md:py-24 lg:py-32 dark:bg-gray-900">
            <div className="container mx-auto px-4 md:px-6">
              <div className="mx-auto max-w-4xl space-y-8">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    1. What Are Cookies?
                  </h2>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                    Cookies are small text files stored on your device by your
                    browser. They help websites remember your preferences and
                    enhance your browsing experience.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    2. Types of Cookies We Use
                  </h2>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                    We use several types of cookies:
                  </p>
                  <ul className="ml-4 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-300">
                    <li>
                      <strong>Essential Cookies:</strong> Necessary for basic
                      website functions.
                    </li>
                    <li>
                      <strong>Performance Cookies:</strong> Help us understand
                      how visitors interact with our site.
                    </li>
                    <li>
                      <strong>Functional Cookies:</strong> Remember your
                      preferences and settings.
                    </li>
                    <li>
                      <strong>Advertising Cookies:</strong> Used to deliver
                      relevant ads and track marketing effectiveness.
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    3. Third-Party Cookies
                  </h2>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                    We may allow third-party service providers to place cookies
                    on your device for analytics and advertising purposes. These
                    providers have their own privacy policies.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    4. How to Control Cookies
                  </h2>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                    You can manage or disable cookies through your browser
                    settings. Please note that disabling cookies may affect the
                    functionality of our website.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    5. Changes to This Policy
                  </h2>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                    We may update this Cookies Policy occasionally. We encourage
                    you to review this page regularly for any changes.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    6. Contact Us
                  </h2>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                    If you have any questions about our use of cookies, please
                    contact us at privacy@shly.pt.
                  </p>
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
