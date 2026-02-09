import React, { ReactNode } from 'react';
import { LogIn, PlusCircle, BarChart3, Lightbulb, ArrowRight, ArrowUpRightSquare } from 'lucide-react';

type PropsFeatureCard = {
    number: string
    icon: ReactNode
    title: string
    description: string
    iconBg: string
    textColor: string
}

export default async function ComoUsar() {
    return (
        <div>
            <header className="w-full bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <a href="/" className="flex items-center gap-2">
                                <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                                    <ArrowUpRightSquare size={24} strokeWidth={2.5} />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-white">GranaGrid</span>
                            </a>
                        </div>

                        <nav className="hidden md:flex items-center gap-8">
                            <a href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Início</a>
                            <a href="/sobre" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sobre</a>
                            <a href="/como_usar" className="text-sm font-medium text-white hover:text-white transition-colors">Como Usar</a>
                        </nav>

                        <div className="flex items-center gap-4">
                            <a href="/login" className="hidden md:block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow-md">
                                Entrar
                            </a>
                        </div>
                    </div>
                </div>
            </header>


            <section className="w-full bg-slate-900 py-20 px-6">
                <div className="max-w-6xl mx-auto">

                    <div className="text-center mb-16 space-y-4">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold tracking-wide uppercase border border-blue-500/20">
                            Tutorial
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white">
                            Como Funciona?
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Em apenas 4 passos simples, você estará no controle total de suas finanças pessoais.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <StepCard
                            number="01"
                            title="Faça Login com Google"
                            description="Entre rapidamente usando sua conta Google. Seguro, simples e sem necessidade de criar senhas extras."
                            icon={<LogIn size={24} className="text-emerald-400" />}
                            iconBg="bg-emerald-500/10"
                            textColor="from-emerald-100 to-emerald-600"
                        />

                        <StepCard
                            number="02"
                            title="Registre Seus Gastos"
                            description="Adicione seus gastos diários com descrição, valor, data, categoria, tipo de transação (Entrada/Saída), Método de Pagamento, quantidade de parcelas e banco utilizado. Leva apenas alguns segundos."
                            icon={<PlusCircle size={24} className="text-blue-400" />}
                            iconBg="bg-blue-500/10"
                            textColor="from-blue-100 to-blue-600"
                        />

                        <StepCard
                            number="03"
                            title="Visualize Relatórios"
                            description="Após adicionar a primeira transação, já verá os gráficos atualizarem informando onde foi feito os maiores gastos, a distribuição de cada gasto e gastos por banco, como também um histórico do ano."
                            icon={<BarChart3 size={24} className="text-purple-400" />}
                            iconBg="bg-purple-500/10"
                            textColor="from-purple-100 to-purple-600"
                        />

                        <StepCard
                            number="04"
                            title="Tome Decisões Melhores"
                            description="Use os insights para identificar padrões, cortar gastos desnecessários e economizar mais."
                            icon={<Lightbulb size={24} className="text-amber-400" />}
                            iconBg="bg-amber-500/10"
                            textColor="from-amber-500 to-amber-600"
                        />

                    </div>

                    <div className="mt-16 text-center">
                        <p className="text-slate-400 mb-4">
                            Pronto para começar?
                            <a href="/login" className="ml-2 text-blue-400 font-bold hover:text-blue-300 transition-colors inline-flex items-center gap-1">
                                Faça login agora <ArrowRight size={16} />
                            </a>
                        </p>
                    </div>

                </div>
            </section>

        </div>
    );
}

function StepCard({ number, title, description, icon, iconBg, textColor }: PropsFeatureCard ) {
    return (
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600 transition-all relative overflow-hidden group">

            <span className={`absolute top-2 left-4 text-8xl font-black text-slate-700/20 select-none transition-colors group-hover:bg-linear-to-br ${textColor} group-hover:bg-clip-text group-hover:text-transparent`}>
                {number}
            </span>

            <div className="relative z-10 flex flex-col h-full mt-4">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-10"></div>

                    <div className={`p-3 rounded-xl ${iconBg} border border-white/5`}>
                        {icon}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 ml-2">{title}</h3>
                <p className="text-slate-400 leading-relaxed ml-2">
                    {description}
                </p>
            </div>
        </div>
    );
}