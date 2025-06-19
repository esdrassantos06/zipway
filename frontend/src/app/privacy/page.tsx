import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Database, Lock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const lastUpdated = () => new Date("2025-06-19").toLocaleDateString();

export default function PrivacyPage() {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Privacy
                    <span className="text-blue-600"> Policy</span>
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                    We respect your privacy and are committed to protecting your
                    personal data.
                  </p>
                  <p className="text-sm text-gray-400">
                    Last updated: {lastUpdated()}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Key Privacy Points Section */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
              <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
                <Card>
                  <CardContent className="flex flex-col items-center space-y-4 p-6">
                    <Database className="size-12 text-blue-600" />
                    <h3 className="text-xl font-bold">Data Collection</h3>
                    <p className="text-center text-gray-500">
                      We collect minimal data necessary to provide our URL
                      shortening service.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center space-y-4 p-6">
                    <Lock className="size-12 text-blue-600" />
                    <h3 className="text-xl font-bold">Data Security</h3>
                    <p className="text-center text-gray-500">
                      Your data is encrypted and stored securely with
                      industry-standard protection.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center space-y-4 p-6">
                    <Eye className="size-12 text-blue-600" />
                    <h3 className="text-xl font-bold">No Selling</h3>
                    <p className="text-center text-gray-500">
                      We never sell your personal information to third parties.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center space-y-4 p-6">
                    <Shield className="size-12 text-blue-600" />
                    <h3 className="text-xl font-bold">Your Rights</h3>
                    <p className="text-center text-gray-500">
                      You have the right to access, update, or delete your
                      personal data.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Detailed Privacy Section */}
          <section className="w-full bg-gray-50 py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
              <div className="mx-auto max-w-4xl space-y-8">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    1. Information We Collect
                  </h2>
                  <p className="leading-relaxed text-gray-600">
                    We collect information you provide directly to us, such as
                    when you create an account, shorten a URL, or contact us for
                    support.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Personal Information:
                  </h3>
                  <ul className="ml-4 list-inside list-disc space-y-2 text-gray-600">
                    <li>Email address</li>
                    <li>Username</li>
                    <li>URLs you shorten</li>
                    <li>Click analytics data</li>
                  </ul>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Automatically Collected Information:
                  </h3>
                  <ul className="ml-4 list-inside list-disc space-y-2 text-gray-600">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Device information</li>
                    <li>Usage patterns and preferences</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    2. How We Use Your Information
                  </h2>
                  <p className="leading-relaxed text-gray-600">
                    We use the information we collect to:
                  </p>
                  <ul className="ml-4 list-inside list-disc space-y-2 text-gray-600">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>Send technical notices and support messages</li>
                    <li>Respond to your comments and questions</li>
                    <li>Monitor and analyze trends and usage</li>
                    <li>Detect and prevent fraudulent activities</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    3. Information Sharing
                  </h2>
                  <p className="leading-relaxed text-gray-600">
                    We do not sell, trade, or otherwise transfer your personal
                    information to third parties. We may share your information
                    only in the following circumstances:
                  </p>
                  <ul className="ml-4 list-inside list-disc space-y-2 text-gray-600">
                    <li>With your consent</li>
                    <li>To comply with legal obligations</li>
                    <li>To protect our rights and safety</li>
                    <li>In connection with a business transfer</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    4. Data Security
                  </h2>
                  <p className="leading-relaxed text-gray-600">
                    We implement appropriate technical and organizational
                    measures to protect your personal information against
                    unauthorized access, alteration, disclosure, or destruction.
                    However, no method of transmission over the internet is 100%
                    secure.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    5. Data Retention
                  </h2>
                  <p className="leading-relaxed text-gray-600">
                    We retain your personal information for as long as necessary
                    to provide our services and fulfill the purposes outlined in
                    this privacy policy, unless a longer retention period is
                    required by law.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    6. Your Rights
                  </h2>
                  <p className="leading-relaxed text-gray-600">
                    You have the right to:
                  </p>
                  <ul className="ml-4 list-inside list-disc space-y-2 text-gray-600">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Delete your personal information</li>
                    <li>Object to processing of your information</li>
                    <li>Data portability</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    7. Cookies
                  </h2>
                  <p className="leading-relaxed text-gray-600">
                    We use cookies and similar technologies to enhance your
                    experience, analyze usage, and assist in our marketing
                    efforts. You can control cookies through your browser
                    settings.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    8. Changes to This Policy
                  </h2>
                  <p className="leading-relaxed text-gray-600">
                    We may update this privacy policy from time to time. We will
                    notify you of any changes by posting the new policy on this
                    page and updating the &quot;Last updated&quot; date.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    9. Contact Us
                  </h2>
                  <p className="leading-relaxed text-gray-600">
                    If you have any questions about this Privacy Policy, please
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
