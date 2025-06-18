import { ShortenUrlForm } from "@/components/ShortenUrlForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2, BarChart3, Shield, Zap, Users, Globe } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";

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
                    Encurte seus links com
                    <span className="text-blue-600"> Zipway</span>
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                    Transforme URLs longas em links curtos e elegantes.
                    Acompanhe cliques, analise performance e gerencie todos seus
                    links em um só lugar.
                  </p>
                </div>
                <div className="flex w-full flex-col items-center justify-center space-y-2">
                  <div className="flex w-full items-center justify-center gap-2">
                    <ShortenUrlForm />
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
                    Por que escolher o Zipway?
                  </h2>
                  <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Oferecemos as melhores ferramentas para gerenciar e otimizar
                    seus links
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                <Card>
                  <CardContent className="flex flex-col items-center space-y-4 p-6">
                    <BarChart3 className="h-12 w-12 text-blue-600" />
                    <h3 className="text-xl font-bold">Analytics Detalhados</h3>
                    <p className="text-center text-gray-500">
                      Acompanhe cliques, origens de tráfego, dispositivos e
                      muito mais com nossos relatórios completos.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center space-y-4 p-6">
                    <Shield className="h-12 w-12 text-blue-600" />
                    <h3 className="text-xl font-bold">Seguro e Confiável</h3>
                    <p className="text-center text-gray-500">
                      Seus links são protegidos com criptografia avançada e
                      monitoramento 24/7 contra ameaças.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center space-y-4 p-6">
                    <Zap className="h-12 w-12 text-blue-600" />
                    <h3 className="text-xl font-bold">Super Rápido</h3>
                    <p className="text-center text-gray-500">
                      Redirecionamentos instantâneos com nossa infraestrutura
                      global de alta performance.
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
                  <Users className="h-12 w-12 text-blue-600" />
                  <div className="space-y-2 text-center">
                    <h3 className="text-3xl font-bold">10M+</h3>
                    <p className="text-gray-500">Usuários ativos</p>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <Link2 className="h-12 w-12 text-blue-600" />
                  <div className="space-y-2 text-center">
                    <h3 className="text-3xl font-bold">500M+</h3>
                    <p className="text-gray-500">Links encurtados</p>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <Globe className="h-12 w-12 text-blue-600" />
                  <div className="space-y-2 text-center">
                    <h3 className="text-3xl font-bold">99.9%</h3>
                    <p className="text-gray-500">Uptime garantido</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Pronto para começar?
                  </h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Junte-se a milhões de usuários que confiam no Zipway para
                    gerenciar seus links.
                  </p>
                </div>
                <div className="space-x-4">
                  <Link href="/register">
                    <Button size="lg">Criar Conta Grátis</Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg">
                      Já tenho conta
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Zipway. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:ml-auto sm:gap-6">
            <Link
              href="#"
              className="text-xs underline-offset-4 hover:underline"
            >
              Termos de Uso
            </Link>
            <Link
              href="#"
              className="text-xs underline-offset-4 hover:underline"
            >
              Privacidade
            </Link>
            <Link
              href="#"
              className="text-xs underline-offset-4 hover:underline"
            >
              Suporte
            </Link>
          </nav>
        </footer>
      </div>
    </>
  );
}
