import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BolaoCard } from "@/components/BolaoCard";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const boloes = await prisma.bolao.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: {
      _count: { select: { inscriptions: true } }
    }
  });

  const formattedBoloes = boloes.map(b => ({
    id: b.id.toString(),
    name: b.name,
    owner: "Admin",
    participantsCount: b._count.inscriptions,
    entryFee: b.quotaValue,
    prizePool: b.quotaValue * b._count.inscriptions * ((100 - b.orgFeePercent) / 100),
    status: b.status.toLowerCase() as "open" | "live" | "finished" | "confirmed",
  }));

  return (
    <>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient text-white py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
          
          <div className="max-w-7xl mx-auto text-center relative z-10 animate-fade-in">
            <h1 className="font-display font-bold text-5xl md:text-7xl mb-6 text-brasil-yellow drop-shadow-lg tracking-tight">
              A COPA DO MUNDO É NOSSA!
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-medium text-gray-100">
              Participe do nosso bolão oficial, chame os amigos e mostre quem é o verdadeiro especialista em futebol.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth" className="btn-brasil-yellow text-lg py-4 px-8 shadow-xl">
                Começar Agora
              </Link>
              <Link href="/boloes" className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/40 font-bold py-4 px-8 rounded-xl transition-all duration-300">
                Ver Bolões Oficiais
              </Link>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brasil-yellow rounded-full blur-3xl opacity-20"></div>
          <div className="absolute top-10 -right-10 w-60 h-60 bg-brasil-blue rounded-full blur-3xl opacity-30"></div>
        </section>

        {/* How it Works */}
        <section className="py-20 px-4 bg-surface">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display font-bold text-4xl text-center text-brasil-blue mb-16">
              COMO FUNCIONA
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="glass-card rounded-2xl p-8 text-center relative pt-12 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-brasil-blue text-brasil-yellow font-display font-bold text-3xl flex items-center justify-center border-4 border-surface shadow-lg">
                  1
                </div>
                <h3 className="font-bold text-xl mb-4 text-gray-800">Escolha um Bolão</h3>
                <p className="text-gray-600">
                  Participe dos bolões oficiais disponíveis na plataforma de acordo com a sua preferência.
                </p>
              </div>

              <div className="glass-card rounded-2xl p-8 text-center relative pt-12 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-brasil-green text-white font-display font-bold text-3xl flex items-center justify-center border-4 border-surface shadow-lg">
                  2
                </div>
                <h3 className="font-bold text-xl mb-4 text-gray-800">Faça seus Palpites</h3>
                <p className="text-gray-600">
                  Preencha os placares de todos os jogos e ganhe pontos por acertos exatos ou parciais.
                </p>
              </div>

              <div className="glass-card rounded-2xl p-8 text-center relative pt-12 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-brasil-yellow text-brasil-blue font-display font-bold text-3xl flex items-center justify-center border-4 border-surface shadow-lg">
                  3
                </div>
                <h3 className="font-bold text-xl mb-4 text-gray-800">Ganhe Prêmios</h3>
                <p className="text-gray-600">
                  Acompanhe o ranking atualizado em tempo real. Os melhores colocados levam a premiação acumulada!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Bolões */}
        <section className="py-20 px-4 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="font-display font-bold text-3xl text-brasil-blue">
                  BOLÕES EM DESTAQUE
                </h2>
                <p className="text-gray-600 mt-2">Participe agora mesmo e garanta sua vaga.</p>
              </div>
              <Link href="/boloes" className="hidden sm:block text-brasil-green-dark font-bold hover:underline">
                Ver todos &rarr;
              </Link>
            </div>
            
            {formattedBoloes.length === 0 ? (
               <div className="text-center py-10 text-gray-500">Nenhum bolão aberto no momento.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formattedBoloes.map((bolao) => (
                  <BolaoCard key={bolao.id} bolao={bolao} />
                ))}
              </div>
            )}

            <div className="mt-8 text-center sm:hidden">
              <Link href="/boloes" className="btn-brasil inline-block w-full text-center">
                Ver todos os bolões
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-brasil-blue relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="font-display font-bold text-4xl text-white mb-6">
              PRONTO PARA ENTRAR EM CAMPO?
            </h2>
            <p className="text-xl text-blue-200 mb-10">
              Não deixe para a última hora. Crie sua conta gratuita e comece a palpitar nos jogos oficiais do campeonato.
            </p>
            <Link href="/auth" className="btn-brasil-yellow text-xl py-4 px-10 shadow-2xl animate-pulse-glow">
              Criar Conta Grátis
            </Link>
          </div>
          
          {/* Soccer ball pattern background */}
          <div className="absolute top-1/2 left-10 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none transform -rotate-12">⚽</div>
          <div className="absolute bottom-10 right-10 text-8xl opacity-5 select-none pointer-events-none transform rotate-45">🏆</div>
        </section>
      </main>

      <Footer />
    </>
  );
}
