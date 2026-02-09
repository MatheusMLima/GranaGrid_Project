import React from 'react'
import { ArrowUpRightSquare, Code2, Palette, FileCode2, BarChart3, Heart, Copy } from 'lucide-react'
import { SiGithub, SiLinkedin, SiFigma, SiGooglegemini, SiPrisma, SiSupabase } from "react-icons/si"

type SocialButtonProps = {
  icon: React.ReactNode
  label: string
  href: string
}

type TechItemProps = {
  icon: React.ReactNode
  color: string
  name: string
  desc: string
}

export default function Sobre() {
  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-50">
      
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
              <a href="/sobre" className="text-sm font-medium text-white transition-colors">Sobre</a>
              <a href="/como_usar" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Como Usar</a>
            </nav>

            <div className="flex items-center gap-4">
              <a href="/login" className="hidden md:block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow-md">
                Entrar
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sobre o Projeto
          </h1>
          <p className="text-lg text-slate-400">
            Conheça a história por trás do GranaGrid
          </p>
        </div>

        <div className="space-y-8">

          <section className="bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-white mb-4">A História</h2>
            <div className="text-slate-400 space-y-4 leading-relaxed">
              <p>
                O GranaGrid nasceu da necessidade de ter um controle financeiro pessoal mais visual e intuitivo, e também claro, para pessoas sem costumes de usar planilhas. Ao utilizar uma planilha desponibilizada pela youtuber <a href='https://www.youtube.com/@CanalElaInveste' className='text-blue-300 underline'>ElaInveste</a>, surgiu essa ideia de projeto para que eu pudesse aprender sobre ferramentas como React, Next.JS, TypeScript, etc. que eu já tinha um certo interesse de aprender e ainda poder disponibilizar uma planilha com uma interface moderna e interativa, dessa forma, este projeto foi desenvolvido para tornar o gerenciamento de finanças pessoais de forma mais simples e acessível.
              </p>
              <p>
                Utilizando tecnologias modernas como React, Next.js e Tailwind CSS, o GranaGrid oferece uma experiência fluida e responsiva, permitindo que você acompanhe suas receitas e despesas diretamente de um site mais amigável do que uma planilha. Também foram utilizadas tecnologias como o Figma e Gemini para a criação de telas e o frontend com Tailwind CSS.
              </p>
              <p>
                Por fim, um agradecimento ao youtuber <a href='https://www.youtube.com/@Sujeitoprogramador' className='text-blue-300 underline'>Sujeito Programador</a>, esse foi meu primeiro projeto e também contato com todas essas ferramentas e graças as suas aulas sobre desenvolvimento de um Micro SaaS, eu obtive a coragem de começa-lo e aprender mais sobre Next JS e React.
              </p>
            </div>
          </section>

          <section className="bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-white mb-6">Desenvolvedor</h2>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                ML
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">Matheus Lima</h3>
                <span className="text-blue-400 text-sm font-medium">Back-End Developer</span>
                
                <p className="text-slate-400 mt-3 mb-6 leading-relaxed">
                  Desenvolvedor apaixonado por criar soluções que facilitam o dia a dia das pessoas. Atualmente trabalho com Power Platform, desenvolvendo extensões em C# e JavaScript para Dynamics 365, como Actions, WebResources, Plugins, Custom APIs, Jobs Assíncronos no WebService, entre outros. Estou sempre buscando aprender mais sobre novas ferramentas e procurando novos desafios.  
                </p>

                <div className="flex flex-wrap gap-3">
                  <SocialButton icon={<SiGithub size={18}/>} label="GitHub" href="https://github.com/MatheusMLima" />
                  <SocialButton icon={<SiLinkedin size={18}/>} label="LinkedIn" href="https://www.linkedin.com/in/matheusmlima/" />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-white mb-6">Tecnologias Utilizadas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TechItem 
                icon={<Code2 size={24} />} 
                color="bg-blue-500/10 text-blue-400" 
                name="React / Next.js" 
                desc="Framework UI & SSR"
              />
              <TechItem 
                icon={<FileCode2 size={24} />} 
                color="bg-blue-700/10 text-blue-500" 
                name="TypeScript" 
                desc="Tipagem estática segura"
              />
              <TechItem 
                icon={<Palette size={24} />} 
                color="bg-cyan-500/10 text-cyan-400" 
                name="Tailwind CSS" 
                desc="Estilização utilitária"
              />
              <TechItem 
                icon={<BarChart3 size={24} />} 
                color="bg-purple-500/10 text-purple-400" 
                name="Recharts" 
                desc="Visualização de dados"
              />
              <TechItem 
                icon={<SiPrisma size={24} />} 
                color="bg-blue-500/10 text-white-400" 
                name="Prisma" 
                desc="Armazenamento de Banco de Dados"
              />
              <TechItem 
                icon={<SiSupabase size={24} />} 
                color="bg-blue-500/10 text-green-400" 
                name="Supabase" 
                desc="Armazenamento dos avatares"
              />
              <TechItem 
                icon={<SiGooglegemini size={24} />} 
                color="bg-green-500/10 text-blue-400" 
                name="Gemini" 
                desc="Criação de CSS e dúvidas sobre as tecnologias"
              />
              <TechItem 
                icon={<SiFigma size={24} />} 
                color="bg-red-500/10 text-black-400" 
                name="Figma" 
                desc="Criação do Layout"
              />
            </div>
          </section>

          <section className="bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                <Heart size={24} fill="currentColor" className="opacity-50" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Apoie o Projeto</h2>
                <p className="text-slate-400 text-sm mt-1">
                  O GranaGrid é um projeto open-source e gratuito. Se ele te ajuda a economizar, considere fazer uma doação para ajudar o criador a comer um lanche, qualquer doação é super válida!
                </p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <span className="block text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Chave Pix (Aleatória)</span>
                <code className="text-emerald-400 font-mono text-base md:text-lg">ad2dfe08-f793-40c8-833e-60140370728d</code>
              </div>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors active:scale-95">
                <Copy size={16} />
                Copiar Chave
              </button>
            </div>
          </section>
        </div>
      </main>
      
      <footer className="py-8 text-center text-slate-600 text-sm border-t border-slate-800 mt-12">
        © {new Date().getFullYear()} GranaGrid.
      </footer>
    </div>
  );
}

function SocialButton({ icon, label, href }: SocialButtonProps ) {
  return (
    <a 
      href={href} 
      className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 rounded-lg text-slate-200 text-sm font-medium transition-all"
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

function TechItem({ icon, color, name, desc }: TechItemProps ) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
      <div>
        <h4 className="text-white font-bold text-sm">{name}</h4>
        <p className="text-slate-500 text-xs">{desc}</p>
      </div>
    </div>
  );
}