import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileText, Users, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const lastUpdated = () => new Date("2025-06-19").toLocaleDateString();

const keyPoints = [
  {
    Icon: Shield,
    title: "Service Usage",
    description:
      "Use our service responsibly and in accordance with applicable laws.",
  },
  {
    Icon: Users,
    title: "User Accounts",
    description:
      "You're responsible for maintaining the security of your account.",
  },
  {
    Icon: FileText,
    title: "Content Policy",
    description:
      "Prohibited content includes spam, malware, and illegal material.",
  },
  {
    Icon: AlertTriangle,
    title: "Limitations",
    description:
      'Service provided "as is" with reasonable availability expectations.',
  },
];

export default function TermsPage() {
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
                    Terms of
                    <span className="text-blue-600"> Service</span>
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-300">
                    Please read these terms carefully before using Zipway&apos;s
                    services.
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

          {/* Detailed Terms Section */}
          <section className="w-full bg-gray-50 py-12 md:py-24 lg:py-32 dark:bg-gray-900">
            <div className="container mx-auto px-4 md:px-6">
              <div className="mx-auto max-w-4xl space-y-8">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    1. Acceptance of Terms
                  </h2>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                    By accessing and using Zipway, you accept and agree to be
                    bound by the terms and provision of this agreement. If you
                    do not agree to abide by the above, please do not use this
                    service.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    2. Use License
                  </h2>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                    Permission is granted to temporarily use Zipway for
                    personal, non-commercial transitory viewing only. This is
                    the grant of a license, not a transfer of title, and under
                    this license you may not:
                  </p>
                  <ul className="ml-4 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-300">
                    <li>modify or copy the materials</li>
                    <li>
                      use the materials for any commercial purpose or for any
                      public display
                    </li>
                    <li>
                      attempt to reverse engineer any software contained on the
                      website
                    </li>
                    <li>
                      remove any copyright or other proprietary notations from
                      the materials
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    3. Prohibited Uses
                  </h2>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                    You may not use our service to shorten URLs that lead to:
                  </p>
                  <ul className="ml-4 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-300">
                    <li>Illegal content or activities</li>
                    <li>Spam, malware, or phishing sites</li>
                    <li>Adult content without proper age verification</li>
                    <li>Copyrighted material without permission</li>
                    <li>
                      Content that violates others&apos; privacy or rights
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    4. Service Availability
                  </h2>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                    We strive to maintain high availability but cannot guarantee
                    uninterrupted service. We reserve the right to modify or
                    discontinue the service at any time without notice.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    5. Privacy
                  </h2>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                    Your privacy is important to us. Please review our Privacy
                    Policy, which also governs your use of the service, to
                    understand our practices.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    6. Limitation of Liability
                  </h2>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                    In no event shall Zipway or its suppliers be liable for any
                    damages (including, without limitation, damages for loss of
                    data or profit, or due to business interruption) arising out
                    of the use or inability to use the service, even if Zipway
                    or an authorized representative has been notified orally or
                    in writing of the possibility of such damage.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    7. Contact Information
                  </h2>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                    If you have any questions about these Terms of Service,
                    please contact us at legal@shly.pt.
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
