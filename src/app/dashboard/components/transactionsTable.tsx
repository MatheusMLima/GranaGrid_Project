'use client'

import { TipoTransacao, MetodoPagamento } from '@/generated/prisma'
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { TransacaoModal } from './transacaoModal'
import { DeleteTransacao } from '../_actions/transacoes'
import { toast } from 'sonner'

const data = [
    { desc: 'Café', cat: 'Alimentação', bank: 'Inter', date: '29/01/2026', value: -120, type: 'OUT' },
    { desc: 'Livros', cat: 'Educação', bank: 'Itaú', date: '27/01/2026', value: -85.7, type: 'OUT' },
    { desc: 'Dividendos', cat: 'Rendimento', bank: 'Inter', date: '24/01/2026', value: 280, type: 'IN' },
    { desc: 'Gasolina', cat: 'Transporte', bank: 'Nubank', date: '21/01/2026', value: -320, type: 'OUT' },
    { desc: 'Farmácia', cat: 'Saúde', bank: 'Itaú', date: '19/01/2026', value: -120, type: 'OUT' },
]

type ColumnKey = 'desc' | 'cat' | 'bank' | 'date' | 'value' | 'metPagamento' | 'parc' | 'qtdParcela' | 'valorTotal'

const dataColunasEntrada: { nome: string; value: ColumnKey }[] = [
    { nome: 'Descrição', value: 'desc' },
    { nome: 'Categoria', value: 'cat' },
    { nome: 'Banco', value: 'bank' },
    { nome: 'Data', value: 'date' },
    { nome: 'Forma Pagamento', value: 'metPagamento' },
    { nome: 'Valor', value: 'value' },
]

const dataColunasSaida: { nome: string; value: ColumnKey }[] = [
    { nome: 'Descrição', value: 'desc' },
    { nome: 'Categoria', value: 'cat' },
    { nome: 'Banco', value: 'bank' },
    { nome: 'Data', value: 'date' },
    { nome: 'Forma Pagamento', value: 'metPagamento' },
    { nome: 'Parcela', value: 'parc' },
    { nome: 'Valor Parcela', value: 'value' },
    { nome: 'Total Parcelas', value: 'qtdParcela' },
    { nome: 'Valor Total Compra', value: 'valorTotal' },
]

type Filters = {
    category: string
    bank: string
    search: string
}

type Sort = {
    column: 'desc' | 'cat' | 'bank' | 'date' | 'value' | 'metPagamento' | 'parc' | 'qtdParcela' | 'valorTotal'
    direction: 'asc' | 'desc'
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
    type: TipoTransacao
    filters: Filters
    sort: Sort
    onSort: (column: Sort['column']) => void
    transacoes: TransacoesVigente[]
    categoriaData: CategoriaData[]
    bancoData: BancoData[]
}

export function TransactionsTable({ type, filters, sort, onSort, transacoes, categoriaData, bancoData }: Props) {
    const [openTransacao, setTransacaoOpen] = useState(false)
    const [transacaoEdit, setTransacaoEdit] = useState<TransacoesVigente>()
    const formaPagamento = {
        [MetodoPagamento.BOLETO]: "Boleto",
        [MetodoPagamento.PIX]: "Pix",
        [MetodoPagamento.CARTAO_CREDITO]: "Cartão de Crédito",
        [MetodoPagamento.CARTAO_DEBITO]: "Cartão de Débito",
        [MetodoPagamento.CARTAO_VR]: "Cartão VR",
        [MetodoPagamento.DINHEIRO]: "Dinheiro",
    }

    const colunasAtivas = type === TipoTransacao.IN ? dataColunasEntrada : dataColunasSaida

    const dataFiltrado = transacoes.filter((item) => item.tipoTransacao === type)
        .filter((item) => filters.bank === 'all' ? true : item.banco.nome === filters.bank)
        .filter((item) => filters.category === 'all' ? true : item.categoria.nome === filters.category)
        .filter((item) => filters.search === '' ? true : item.descricao.toLocaleLowerCase().includes(filters.search.toLocaleLowerCase()))

    const dataOrdenada = [...dataFiltrado].sort((a, b) => {
        const { column, direction } = sort
        const ordem = direction === 'asc' ? 1 : -1

        switch (column) {
            case 'value':
                return ((parseInt(a.valor) / 100) - (parseInt(b.valor) / 100)) * ordem

            case 'date':
                return (a.data.getTime() - b.data.getTime()) * ordem

            case 'desc':
                return a.descricao.localeCompare(b.descricao) * ordem

            case 'cat':
                return a.categoria.nome.localeCompare(b.categoria.nome) * ordem

            case 'bank':
                return a.banco.nome.localeCompare(b.banco.nome) * ordem

            case 'metPagamento':
                return (a.metodoPagamento ?? '').localeCompare(b.metodoPagamento ?? '') * ordem

            case 'parc':
                return ((a.numeroParcela ?? 0) - (b.numeroParcela ?? 0)) * ordem

            case 'qtdParcela':
                return ((a.totalParcelas ?? 0) - (b.totalParcelas ?? 0)) * ordem

            case 'valorTotal':
                const totalA = (a.totalParcelas ?? 1) * (parseInt(a.valor) / 100)
                const totalB = (b.totalParcelas ?? 1) * (parseInt(b.valor) / 100)
                return (totalA - totalB) * ordem

            default:
                return 0
        }
    })

    async function handleDelete(id: string) {
        const confirmou = window.confirm("Tem certeza que deseja excluir?")
        if (!confirmou) return

        toast.promise(DeleteTransacao(id), {
            loading: 'Excluindo transação...',
            success: (data) => {
                if (data.success) {
                    return data.success
                } else {
                    throw new Error(data.error!)
                }
            },
            error: (err) => {
                return err.message || 'Erro desconhecido ao excluir a(s) transação(s).'
            }
        })
    }

    function onEdit(id: string) {
        setTransacaoEdit(transacoes.find(t => t.transacaoId === id))
        setTransacaoOpen(true)
    }

    return (
        <>
            <div className="overflow-x-auto rounded-xl border border-slate-700">
                <table className="w-full text-sm text-slate-200">

                    <thead className="bg-slate-900 text-slate-400">
                        <tr>
                            {colunasAtivas.map((col) => (
                                <th onClick={() => onSort(col.value)} key={col.nome} className="px-4 py-3 text-left font-medium">
                                    <div className="flex items-center gap-1 cursor-pointer select-none">
                                        {col.nome}
                                        <ArrowUpDown size={14} />
                                    </div>
                                </th>
                            ))}

                            <th className="py-3 text-center font-medium">Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {type === TipoTransacao.OUT &&
                            dataOrdenada
                                .map((item, i) => (
                                    <tr key={i} className="group border-t border-slate-800 hover:bg-slate-900/30 transition">
                                        <td title={item.descricao} className="px-4 py-3 font-medium text-white max-w-50 truncate">{item.descricao}</td>
                                        <td title={item.categoria.nome} className="px-4 py-3 text-slate-300 max-w-28 truncate">{item.categoria.nome}</td>
                                        <td title={item.banco.nome} className="px-4 py-3 text-slate-300 max-w-28 truncate">{item.banco.nome}</td>
                                        <td title={item.data.toLocaleDateString()} className="px-4 py-3 text-slate-300 max-w-28 truncate">{item.data.toLocaleDateString()}</td>
                                        <td title={formaPagamento[item.metodoPagamento ?? MetodoPagamento.PIX]} className="px-4 py-3 text-slate-300 max-w-28 truncate">{formaPagamento[item.metodoPagamento ?? MetodoPagamento.PIX]}</td>
                                        <td title={item.numeroParcela?.toString()} className="px-4 py-3 text-slate-300 max-w-5 truncate">{item.numeroParcela?.toString()}</td>
                                        <td className={`max-w-28 truncate px-4 py-3 font-semibold text-rose-400`}>
                                            {(parseInt(item.valor) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </td>
                                        <td title={item.totalParcelas?.toString()} className="px-4 py-3 text-slate-300 max-w-5 truncate">{item.totalParcelas?.toString()}</td>
                                        <td title={((parseInt(item.valorTotal)) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} className="px-4 py-3 text-rose-400 font-semibold max-w-28 truncate">{((parseInt(item.valorTotal)) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => onEdit(item.transacaoId)}
                                                    className="p-1 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.transacaoId)}
                                                    className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))
                        }

                        {type === TipoTransacao.IN &&
                            dataOrdenada
                                .map((item, i) => (
                                    <tr key={i} className="group border-t border-slate-800 hover:bg-slate-900/30 transition">
                                        <td title={item.descricao} className="px-4 py-3 font-medium text-white max-w-50 truncate">{item.descricao}</td>
                                        <td title={item.categoria.nome} className="px-4 py-3 text-slate-300 max-w-28 truncate">{item.categoria.nome}</td>
                                        <td title={item.banco.nome} className="px-4 py-3 text-slate-300 max-w-28 truncate">{item.banco.nome}</td>
                                        <td title={item.data.toLocaleDateString()} className="px-4 py-3 text-slate-300 max-w-28 truncate">{item.data.toLocaleDateString()}</td>
                                        <td title={formaPagamento[item.metodoPagamento ?? MetodoPagamento.PIX]} className="px-4 py-3 text-slate-300 max-w-15 truncate">{formaPagamento[item.metodoPagamento ?? MetodoPagamento.PIX]}</td>
                                        <td title={(parseInt(item.valor) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} className="px-4 py-3 text-green-400 font-semibold max-w-28 truncate">{(parseInt(item.valor) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => onEdit(item.transacaoId)}
                                                    className="p-1 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.transacaoId)}
                                                    className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                        }
                    </tbody>

                </table>
            </div>
            <TransacaoModal open={openTransacao} onClose={() => setTransacaoOpen(false)} categoria={categoriaData} banco={bancoData} edit={true} transacaoEdit={transacaoEdit} />
        </>
    )
}
