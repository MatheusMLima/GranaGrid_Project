import React from 'react';
import { BarChart3, PieChart, TrendingUp, ShieldCheck, Info, Zap, TrendingUpIcon } from 'lucide-react';

type FeatureCardProps = {
  icon: React.ReactNode
  color: string 
  title: string 
  desc: string
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-50">

      <header className="w-full bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <TrendingUpIcon size={24} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">GranaGrid</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="/" className="text-sm font-medium text-white hover:text-white transition-colors">Início</a>
              <a href="/sobre" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sobre</a>
              <a href="/como_usar" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Como Usar</a>
            </nav>

            <div className="flex items-center gap-4">
              <a href="/login" className="hidden md:block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-blue-900/20">
                Entrar
              </a>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Controle suas Finanças com <span className="text-blue-500">Inteligência</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Gerencie suas receitas e despesas de forma simples e visual. Tome decisões financeiras mais inteligentes com base nos seus gastos.
          </p>
          <a href='/login' className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1">
            Começar Agora
          </a>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <FeatureCard
              icon={<BarChart3 size={24} className="text-white" />}
              color="bg-blue-500"
              title="Visualização Intuitiva"
              desc="Gráficos e tabelas interativas para você entender suas finanças de forma clara e rápida."
            />
            <FeatureCard
              icon={<PieChart size={24} className="text-white" />}
              color="bg-emerald-500"
              title="Análise por Categoria"
              desc="Veja exatamente para onde seu dinheiro está indo com análises detalhadas por categoria."
            />
            <FeatureCard
              icon={<TrendingUp size={24} className="text-white" />}
              color="bg-purple-500"
              title="Histórico Completo"
              desc="Acesse o histórico de todos os meses e acompanhe a evolução das suas finanças."
            />
            <FeatureCard
              icon={<ShieldCheck size={24} className="text-white" />}
              color="bg-rose-500"
              title="Dados Seguros"
              desc="Login seguro via Google. Seus dados financeiros protegidos com as melhores práticas e suas transações com valores e descrições criptografadas."
            />
            <FeatureCard
              icon={<Zap size={24} className="text-white" />}
              color="bg-cyan-500"
              title="Rápido e Eficiente"
              desc="Interface moderna e performática. Adicione transações em segundos."
            />
            <FeatureCard
              icon={<Info size={24} className="text-white" />}
              color="bg-orange-500"
              title="Tem alguma sugestão?"
              desc="Caso você tenha alguma sugestão de melhorias, como por exemplo: Novos bancos, novas categorias, tabelas, etc. Por favor, não deixe de enviar uma mensagem."
            />

          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-blue-600 rounded-3xl p-8 md:p-16 text-center text-white shadow-2xl shadow-blue-900/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto para organizar suas finanças?
            </h2>
            <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
              Comece agora mesmo de forma gratuita e tenha controle total sobre seu dinheiro.
            </p>
            <a href='/login' className="px-8 py-3.5 bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-lg transition-colors shadow-lg">
              Criar Conta Grátis
            </a>
          </div>
        </section>

      </main>

      <footer className="py-8 text-center text-slate-600 text-sm">
        © {new Date().getFullYear()} GranaGrid. Todos os direitos reservados.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, color, title, desc }: FeatureCardProps ) {
  return (
    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-sm hover:border-slate-600 transition-colors">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-black/20`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  );
}