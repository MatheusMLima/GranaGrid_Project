import { X, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { TipoTransacao } from '@/generated/prisma'
import { useMemo } from 'react'

type transacoesUsuario = {
    valor: string;
    data: Date;
    tipoTransacao: TipoTransacao;
}

type Props = {
    isOpen: boolean
    onClose: () => void
    transacaoUser: transacoesUsuario[]
}

const nomeMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function HistoricoModal({ isOpen, onClose, transacaoUser = [] }: Props) {    

    const dadosProcessados = useMemo(() => {
        const agrupamento = new Map<string, {
            entradas: number
            saidas: number
            saldo: number
            ano: number
            mesIndex: number
        }
        >()

        transacaoUser.forEach((t) => {
            const dataObj = new Date(t.data)
            const ano = dataObj.getFullYear()
            const mesIndex = dataObj.getMonth() // 0 a 11
            
            const chave = `${nomeMeses[mesIndex]}-${ano}`;

            if (!agrupamento.has(chave)) {
                agrupamento.set(chave, { entradas: 0, saidas: 0, saldo: 0, ano: ano, mesIndex: mesIndex })
            }

            const atual = agrupamento.get(chave)!

            if (t.tipoTransacao === TipoTransacao.IN) {
                atual.entradas += Number(t.valor)
            } else {
                atual.saidas += Number(t.valor)
            }

            atual.saldo = atual.entradas - atual.saidas
        })

        const listaOrdenada = Array.from(agrupamento.values()).sort((a, b) => {
            if (b.ano !== a.ano) return a.ano - b.ano
            return a.mesIndex - b.mesIndex
        })

        return listaOrdenada;
    }, [transacaoUser]);

    
    const formatCurrencyWithSign = (value: number) => {
      const sinal = value > 0 ? '+' : value < 0 ? '-' : ''
      const valorFormatado = Math.abs(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })

      return `${sinal} ${valorFormatado}`
    }
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

            <div className="w-full max-w-4xl bg-[#1e293b] rounded-2xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col max-h-[85vh]">

                <div className="p-6 border-b border-slate-700 flex justify-between items-start bg-[#1e293b]">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 bg-blue-600 rounded-md">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-white">Histórico de Meses</h2>
                        </div>
                        <p className="text-slate-400 text-sm">Selecione um mês para visualizar</p>
                    </div>

                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar bg-[#1e293b]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dadosProcessados.map((item, index) => (
                            <Link key={index} href={`${process.env.NEXT_PUBLIC_HOST_URL}/dashboard/${nomeMeses[item.mesIndex]}-${item.ano.toString()}`} className="bg-[#263345] rounded-xl p-5 border border-slate-700 hover:border-blue-500 hover:bg-[#2c3b52] hover:scale-[1.02] 
                                transition-all duration-200 cursor-pointer block group">

                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-white font-bold text-lg">{nomeMeses[item.mesIndex]} {item.ano}</h3>
                                        <p className={(item.saldo / 100) > 0 ? "text-emerald-400 text-sm font-medium mt-1" : "text-red-400 text-sm font-medium mt-1"}>
                                            Saldo: {formatCurrencyWithSign(item.saldo / 100)}
                                        </p>
                                    </div>
                                    <div className="bg-emerald-500/10 p-2 rounded-lg">
                                        <TrendingUp size={18} className="text-emerald-500" />
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm border-t border-slate-700/50 pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Entradas:</span>
                                        <span className="text-emerald-400 font-medium">{formatCurrencyWithSign(item.entradas / 100)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Saídas:</span>
                                        <span className="text-rose-500 font-medium">{formatCurrencyWithSign(item.saidas / 100)}</span>
                                    </div>
                                </div>

                            </Link>
                        ))}

                        {dadosProcessados.length === 0 && (
                            <div className="col-span-1 md:col-span-2 text-center text-slate-500 py-10">
                                Nenhuma transação encontrada.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}