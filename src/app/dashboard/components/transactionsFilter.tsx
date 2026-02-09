'use client'

import { Search, Plus, X, ArrowDown } from 'lucide-react'
import { useState } from 'react'
import { TransacaoModal } from './transacaoModal'
import { useRef, useEffect } from 'react'
import { TipoTransacao, MetodoPagamento } from '@/generated/prisma/enums'

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

type Filters = {
    category: string
    bank: string
    search: string
}

type Props = {
    type: 'IN' | 'OUT'
    filters: Filters
    onChange: (f: Filters) => void
    onClear: () => void
    userData: UserData
    categoriaData: CategoriaData[]
    bancoData: BancoData[]
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

export function TransactionsFilters({ type, filters, onChange, onClear, userData, categoriaData, bancoData }: Props) {
    const [openTransacao, setTransacaoOpen] = useState(false)
    const [openCategoria, setOpenCategoria] = useState(false)
    const [searchCategoria, setSearchCategoria] = useState("")
    const [searchBanco, setSearchBanco] = useState("")
    const [openBanco, setOpenBanco] = useState(false)

    const transacaoVazia: TransacoesVigente = {
        categoria: { nome: '' }, 
        banco: { nome: '' },     
        transacaoId: '',
        valor: "0",
        data: new Date(),        
        descricao: '',
        tipoTransacao: TipoTransacao.OUT,       
        metodoPagamento: MetodoPagamento.PIX,  
        numeroParcela: 0,
        totalParcelas: 0,
        valorTotal: "0",
        grupoParcelamento: ""
    }
    const categoriaRef = useRef<HTMLDivElement>(null)
    const bancoRef = useRef<HTMLDivElement>(null)

    const hasFilters = filters.search || filters.category !== 'all' || filters.bank !== 'all'

    const categoriasFiltradas = categoriaData
        .filter(item => item.tipo === type)
        .filter(item =>
            item.nome.toLowerCase().includes(searchCategoria.toLowerCase())
        )

    const bancosFiltrados = bancoData
        .filter(item =>
            item.nome.toLowerCase().includes(searchBanco.toLowerCase())
        )

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node

            if (openCategoria && categoriaRef.current && !categoriaRef.current.contains(target)) {
                setOpenCategoria(false)
            }

            if (openBanco && bancoRef.current && !bancoRef.current.contains(target)) {
                setOpenBanco(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [openCategoria, openBanco])



    return (
        <div className="flex flex-wrap items-center gap-3">

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input value={filters.search} onChange={(e) => onChange({ ...filters, search: e.target.value })} className="h-10 w-56 rounded-xl bg-slate-700 pl-9 pr-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div ref={categoriaRef} className="relative w-56">
                <button
                    onClick={() => setOpenCategoria(!openCategoria)}
                    className="h-10 w-full rounded-xl bg-slate-700 px-4 text-left text-sm text-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                    {filters.category === 'all' ? 'Todas Categorias' : filters.category}
                </button>

                {openCategoria && (
                    <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-xl bg-slate-800 border border-slate-600 shadow-lg">

                        <div className="p-2 border-b border-slate-600">
                            <input
                                value={searchCategoria}
                                onChange={(e) => setSearchCategoria(e.target.value)}
                                placeholder="Buscar categoria..."
                                className="w-full rounded-md bg-slate-900 px-2 py-1 text-sm text-white outline-none"
                            />
                        </div>

                        <div className="max-h-60 overflow-y-auto p-1 space-y-1">
                            <div
                                onClick={() => {
                                    onChange({ ...filters, category: 'all' })
                                    setOpenCategoria(false)
                                }}
                                className="cursor-pointer px-3 py-2 text-sm hover:bg-slate-700"
                            >
                                Todas Categorias
                            </div>

                            {categoriasFiltradas.map(cat => (
                                <div
                                    key={cat.id}
                                    onClick={() => {
                                        onChange({ ...filters, category: cat.nome })
                                        setOpenCategoria(false)
                                    }}
                                    className="cursor-pointer px-3 py-2 text-sm hover:bg-slate-700"
                                >
                                    {cat.nome}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div ref={bancoRef} className="relative w-56">
                <button
                    onClick={() => setOpenBanco(!openBanco)}
                    className="h-10 w-full rounded-xl bg-slate-700 px-4 text-left text-sm text-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                    {filters.bank === 'all' ? 'Todas Bancos' : filters.bank}
                </button>

                {openBanco && (
                    <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-xl bg-slate-800 border border-slate-600 shadow-lg">

                        <div className="p-2 border-b border-slate-600">
                            <input
                                value={searchBanco}
                                onChange={(e) => setSearchBanco(e.target.value)}
                                placeholder="Buscar banco..."
                                className="w-full rounded-md bg-slate-900 px-2 py-1 text-sm text-white outline-none"
                            />
                        </div>

                        <div className="max-h-60 overflow-y-auto">
                            <div
                                onClick={() => {
                                    onChange({ ...filters, bank: 'all' })
                                    setOpenBanco(false)
                                }}
                                className="cursor-pointer px-3 py-2 text-sm hover:bg-slate-700"
                            >
                                Todos Bancos
                            </div>

                            {bancosFiltrados.map(bac => (
                                <div
                                    key={bac.id}
                                    onClick={() => {
                                        onChange({ ...filters, bank: bac.nome })
                                        setOpenBanco(false)
                                    }}
                                    className="cursor-pointer px-3 py-2 text-sm hover:bg-slate-700"
                                >
                                    {bac.nome}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {hasFilters && (
                <button onClick={onClear} className="flex h-10 items-center gap-2 rounded-xl bg-slate-600 px-3 text-sm text-white hover:bg-slate-500 transition cursor-pointer">
                    <X size={14} />
                    Limpar
                </button>
            )}

            <button onClick={() => setTransacaoOpen(true)} className="ml-auto flex h-10 items-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700 transition cursor-pointer">
                <Plus size={16} />
                Adicionar
            </button>

            <TransacaoModal open={openTransacao} onClose={() => setTransacaoOpen(false)} categoria={categoriaData} banco={bancoData} edit={false} transacaoEdit={transacaoVazia} />
        </div>
    )
}
