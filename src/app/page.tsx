import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BolaoCard, Bolao } from "@/components/BolaoCard";

// Mock data para a landing page
const mockBoloes: Bolao[] = [
  {
    id: "1",
    name: "Bolão da Firma",
    owner: "João Silva",
    participantsCount: 42,
    entryFee: 50,
    prizePool: 2100,
    status: "open",
  },
  {
    id: "2",
    name: "Família Buscapé",
    owner: "Maria Oliveira",
    participantsCount: 15,
    entryFee: 20,
    prizePool: 300,
    status: "open",
  },
  {
    id: "3",
    name: "Amigos do Futebol",
    owner: "Carlos Santos",
    participantsCount: 120,
    entryFee: 100,
    prizePool: 12000,
    status: "confirmed",
  },
];

export default function Home() {
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
              Crie seu bolão, chame os amigos e mostre quem é o verdadeiro especialista em futebol.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth" className="btn-brasil-yellow text-lg py-4 px-8 shadow-xl">
                Começar Agora
              </Link>
              <Link href="/boloes" className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/40 font-bold py-4 px-8 rounded-xl transition-all duration-300">
                Ver Bolões Abertos
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
                  Participe de bolões públicos ou crie um grupo privado só para seus amigos e colegas de trabalho.
                </p>
              </div>

              <div className="glass-card rounded-2xl p-8 text-center relative pt-12 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-brasil-green text-white font-display font-bold text-3xl flex items-center justify-center border-4 border-surface shadow-lg">
                  2
                </div>
                <h3 className="font-bold text-xl mb-4 text-gray-800">Faça seus Palpites</h3>
                <p className="text-gray-600">
                  Preencha os placares de todos os jogos da fase de grupos e ganhe pontos por acertos exatos ou parciais.
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockBoloes.map((bolao) => (
                <BolaoCard key={bolao.id} bolao={bolao} />
              ))}
            </div>

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
              Não deixe para a última hora. Crie sua conta gratuita e comece a palpitar nos jogos do Brasil e do mundo.
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
