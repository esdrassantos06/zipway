import { getSessionFromHeaders } from "@/utils/getSession";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AccountInfo } from "@/components/settings/AccountInfo";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { AppearenceSettings } from "@/components/settings/AppearenceSettings";
import { DangerZone } from "@/components/settings/DangerZone";

export default async function SettingsPage() {
  const headersList = await headers();
  const session = await getSessionFromHeaders(headersList);

  if (!session) {
    console.error("No session Found, redirecting to login...");
    return redirect("/auth/login");
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-12 md:py-24 lg:py-32 xl:py-48 dark:bg-gradient-to-br dark:from-gray-900 dark:via-indigo-900 dark:to-blue-900">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Account{" "}
                    <span className="text-blue-600 dark:text-indigo-400">
                      Settings
                    </span>
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    Manage your account preferences and security settings.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Settings Content */}
          <section className="w-full py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <div className="mx-auto max-w-4xl space-y-8">
                {/* Account Information */}
                <AccountInfo session={session} />

                {/* Security Settings */}
                <SecuritySettings />

                {/* Appearance Settings */}
                <AppearenceSettings />

                {/* Danger Zone */}
                <DangerZone />
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
