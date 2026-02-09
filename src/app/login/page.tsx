import { signIn } from '@/lib/auth'
import { ArrowLeft, TrendingUpIcon, Lock, Check } from 'lucide-react'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function EntrarPage() {
  const session = await auth()

  if (session?.user) {
    redirect("/dashboard")
  }

  async function handleRegister() {
    "use server"

    await signIn("google", { redirectTo: "/dashboard" })
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-slate-50 relative">

      <div className="absolute top-6 left-6 md:top-8 md:left-8">
        <a href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Voltar</span>
        </a>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <TrendingUpIcon size={28} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">GranaGrid</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Bem-vindo!
          </h1>
          <p className="text-slate-400">
            Entre para gerenciar suas finanças
          </p>
        </div>

        <div className="w-full max-w-md bg-slate-800 rounded-2xl border border-slate-700 p-6 md:p-8 shadow-xl">

          <button onClick={handleRegister} className="cursor-pointer w-full flex items-center justify-center gap-3 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3.5 px-4 rounded-xl transition-all border border-slate-600 hover:border-slate-500 group">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Continuar com Google</span>
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-800 px-2 text-slate-500 font-medium">
                Login exclusivo via Google
              </span>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-900/50 rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3 text-blue-400 font-semibold text-sm">
              <Lock size={16} />
              <span>Por que Google?</span>
            </div>
            <ul className="space-y-2.5">
              <FeatureItem text="Login seguro e rápido" />
              <FeatureItem text="Não é necessário criar senha" />
              <FeatureItem text="Autenticação OAuth2 confiável" />
              <FeatureItem text="Seus dados protegidos pelo Google" />
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-xs md:text-sm text-slate-300">
      <Check size={16} className="text-blue-500 mt-0.5 shrink-0" />
      <span>{text}</span>
    </li>
  );
}