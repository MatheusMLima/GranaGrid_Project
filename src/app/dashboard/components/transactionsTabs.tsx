'use client'

import { useState } from 'react'
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { TransactionsFilters } from './transactionsFilter'
import { TransactionsTable } from './transactionsTable'
import { TipoTransacao, MetodoPagamento } from '@/generated/prisma'

type UserData = {
    id: string
    nome: string
    email: string
    username?: string
    image?: string
}

type CategoriaData = {
    id: string
    nome: string
    tipo: string
}

type BancoData = {
    id: string
    nome: string
}

type TransacoesVigente = {
    categoria: {
        nome: string
    }
    banco: {
        nome: string
    }
    transacaoId: string
    valor: string
    data: Date
    descricao: string
    tipoTransacao: TipoTransacao
    metodoPagamento: MetodoPagamento
    numeroParcela: number
    totalParcelas: number
    valorTotal: string
    grupoParcelamento: string | null
}

type Props = {
    userData: UserData
    categoriaData: CategoriaData[]
    bancoData: BancoData[]
    transacoes: TransacoesVigente[]
}

export function TransactionsTabs({ userData, categoriaData, bancoData, transacoes }: Props) {
    const [active, setActive] = useState<TipoTransacao>(TipoTransacao.OUT)
    const [filters, setFilters] = useState({
        category: 'all',
        bank: 'all',
        search: '',
    })

    const [sort, setSort] = useState<{
        column: 'desc' | 'cat' | 'bank' | 'date' | 'value' | 'metPagamento' | 'parc' | 'qtdParcela' | 'valorTotal'
        direction: 'asc' | 'desc'
    }>({
        column: 'date',
        direction: 'desc',
    })

    function handleSort(column: typeof sort.column) {
        setSort((prev) => {
            if (prev.column === column) {
                return {
                    column,
                    direction: prev.direction === 'asc' ? 'desc' : 'asc',
                }
            }

            return {
                column,
                direction: 'asc',
            }
        })
    }

    return (
        <div className="rounded-2xl mb-10 bg-slate-800 shadow-lg overflow-visible">

            <div className="flex border-b border-slate-700">
                <button onClick={() => setActive('OUT')} className={`cursor-pointer flex-1 flex rounded-tl-2xl items-center justify-center gap-2 py-4 text-sm font-semibold transition ${active === 'OUT' ? 'bg-rose-900/40 text-rose-400 border-b-2 border-rose-500' : 'text-slate-400 hover:text-white'}`}>
                    <ArrowDownCircle size={18} />
                    Saídas
                </button>

                <button onClick={() => setActive('IN')} className={`cursor-pointer flex-1 flex rounded-tr-2xl items-center justify-center gap-2 py-4 text-sm font-semibold transition ${active === 'IN' ? 'bg-emerald-900/40 text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-white'}`}>
                    <ArrowUpCircle size={18} />
                    Entradas
                </button>
            </div>

            <div className="p-6 space-y-4 pb-6">
                <TransactionsFilters type={active} filters={filters} onChange={setFilters} onClear={() => setFilters({ category: 'all', bank: 'all', search: '' })} userData={userData} categoriaData={categoriaData} bancoData={bancoData} />
                <TransactionsTable type={active} filters={filters} sort={sort} onSort={handleSort} transacoes={transacoes} categoriaData={categoriaData} bancoData={bancoData} />
            </div>

        </div>
    )
}
