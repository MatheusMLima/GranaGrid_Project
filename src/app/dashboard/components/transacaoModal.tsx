'use client'

import { X, Plus } from 'lucide-react'
import { DateTime } from 'next-auth/providers/kakao'
import { useState, useEffect } from 'react'
import { CreateTransacao, EditTransacao } from '../_actions/transacoes'
import { id } from 'zod/locales'
import { number } from 'zod'
import { MetodoPagamento, TipoTransacao } from "@/generated/prisma"
import { toast } from 'sonner'


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
    open: boolean
    onClose: () => void
    categoria: CategoriaData[]
    banco: BancoData[]
    edit: boolean
    transacaoEdit: TransacoesVigente | undefined
}

function getMetodoPagamentoLabel(metodo: MetodoPagamento) {
    const mapa: Record<string, string> = {
        [MetodoPagamento.CARTAO_CREDITO]: "Cartão de Crédito",
        [MetodoPagamento.CARTAO_DEBITO]: "Cartão de Débito",
        [MetodoPagamento.CARTAO_VR]: "Cartão VR",
        [MetodoPagamento.PIX]: "Pix",
        [MetodoPagamento.DINHEIRO]: "Dinheiro",
        [MetodoPagamento.BOLETO]: "Boleto",
    }
    return mapa[metodo] || ""
}

export function TransacaoModal({ open, onClose, categoria, banco, edit, transacaoEdit }: Props) {
    const [error, setError] = useState<null | string>(null)
    const [success, setSuccess] = useState<null | string>(null)
    const [camposObrigatorios, setCampos] = useState<null | Array<string>>(null)
    const [visible, setVisible] = useState(false)
    const [valorRaw, setValorRaw] = useState('')
    const [valorFormatado, setValorFormatado] = useState('')
    const [isEntrada, setParcelaBlock] = useState(false)

    useEffect(() => {
        if (open && edit && transacaoEdit) {
            // Formatar Valor
            const raw = transacaoEdit.valorTotal.toString() // Ex: 12000
            setValorRaw(raw)
            const number = parseInt(transacaoEdit.valorTotal) / 100
            setValorFormatado(number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))

            // Configurar Tipo (para liberar/bloquear parcelas e filtrar categorias)
            setParcelaBlock(transacaoEdit.tipoTransacao === TipoTransacao.IN)
        } else if (open && !edit) {
            // Limpar se for nova transação
            setValorRaw('')
            setValorFormatado('')
            setParcelaBlock(false)
        }
    }, [open, edit, transacaoEdit])

    if (!open) return null



    async function submitAction(formData: FormData) {
        const obrigatorios = ["descricao", "valor", "data", "tipoTransacao", "metodoPagamento", "categoria", "banco"] //double check para campos obrigatórios

        const estaVazio = obrigatorios.some(field => !formData.get(field))

        if (estaVazio) {
            const camposVazios = obrigatorios.filter(field => !formData.get(field))
            setError("Por favor, preencha os campos obrigatórios!")
            setCampos(camposVazios)
            setSuccess(null)
            setVisible(true)
            return
        }
        else {
            setCampos(null)
            setError("")
            setVisible(false)
        }

        const descricao = formData.get("descricao") as string
        const valor = Number(valorRaw)

        if (valor <= 0) {
            setError("Por favor, insira apenas valores maior que 0!")
            setSuccess(null)
            setVisible(true)
            return
        }

        const transacaoID = edit && transacaoEdit && transacaoEdit.transacaoId ? transacaoEdit.transacaoId : ""
        const tipoTransacao = (formData.get("tipoTransacao") as string) === "Entrada" ? TipoTransacao.IN : TipoTransacao.OUT
        const metodoPagamento = (GetMetodoPagamento(formData.get("metodoPagamento") as string))
        const categoriaRequest = categoria.find(c => c.nome === (formData.get("categoria") as string))?.id
        const bancoRequest = banco.find(b => b.nome === (formData.get("banco") as string))?.id
        let qtdParcelas = (Number(formData.get("qtdParcelas") as string))
        const grupoParcelamento = edit && transacaoEdit && transacaoEdit.grupoParcelamento ? transacaoEdit.grupoParcelamento : ""
        const dataString = formData.get("data") as string
        const [ano, mes, dia] = dataString.split("-").map(Number)
        const data = new Date(ano, mes - 1, dia)

        if (qtdParcelas === 0) {
            qtdParcelas = 1
        }

        if (!categoriaRequest || !bancoRequest) {
            setError("Categoria ou Banco não encontrado no banco de dados. Contate o administrador!")
            setSuccess(null)
            setVisible(true)
            return
        }

        const dataRequest = {
            transacaoId: transacaoID,
            descricao: descricao,
            valor: valor.toString(),
            data: data,
            tipoTransacao: tipoTransacao,
            metodoPagamento: metodoPagamento,
            numeroParcela: 1,
            totalParcelas: qtdParcelas,
            categoria: categoriaRequest,
            banco: bancoRequest,
            idGrupoParcelas: grupoParcelamento
        }

        if (edit) {
            toast.promise(EditTransacao(dataRequest), {
                loading: 'Editando transação(s)...',
                success: (data) => {
                    if (data.success) {
                        setError(null)
                        setCampos(null)
                        setVisible(false)
                        setValorFormatado("")
                        onClose()
                        return data.success
                    } else {
                        onClose()
                        throw new Error(data.error!)
                    }
                },
                error: (err) => {
                    return err.message || 'Erro desconhecido ao editar a(s) transação(s).'
                }
            })

            setValorFormatado(defaultValor!)
        }
        else {
            toast.promise(CreateTransacao(dataRequest), {
                loading: 'Criando transação(s)...',
                success: (data) => {
                    if (data.success) {
                        setError(null)
                        setCampos(null)
                        setVisible(false)
                        setValorFormatado("")
                        onClose()
                        return data.success
                    } else {
                        onClose()
                        throw new Error(data.error!)
                    }
                },
                error: (err) => {
                    return err.message || 'Erro desconhecido ao criar a(s) transação(s).'
                }
            })
        }
    }

    function GetMetodoPagamento(metodo: string) {
        switch (metodo) {
            case "Cartão de Crédito":
                return MetodoPagamento.CARTAO_CREDITO
            case "Cartão de Débito":
                return MetodoPagamento.CARTAO_DEBITO
            case "Cartão VR":
                return MetodoPagamento.CARTAO_VR
            case "Pix":
                return MetodoPagamento.PIX
            case "Dinheiro":
                return MetodoPagamento.DINHEIRO
            case "Boleto":
                return MetodoPagamento.BOLETO
            default:
                return MetodoPagamento.CARTAO_CREDITO
        }
    }


    function handleValorChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.name !== "valor") {
            return
        }

        const onlyNumbers = e.target.value.replace(/\D/g, '') // tira tudo que não é número

        setValorRaw(onlyNumbers)

        const number = Number(onlyNumbers) / 100
        const formatted = number.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })

        setValorFormatado(formatted)
    }

    function bloqueiaCampoOnChange(e: React.ChangeEvent<HTMLSelectElement>) {
        if (e.target.value === "Entrada") {
            setParcelaBlock(true)
        } else {
            setParcelaBlock(false)
        }
    }

    // Preparar valores padrão para o modo Edição
    const defaultData = edit && transacaoEdit ? new Date(transacaoEdit.data).toISOString().split('T')[0] : undefined
    const defaultTipo = edit && transacaoEdit ? (transacaoEdit.tipoTransacao === TipoTransacao.IN ? "Entrada" : "Saída") : undefined
    const defaultMetodo = edit && transacaoEdit ? getMetodoPagamentoLabel(transacaoEdit.metodoPagamento) : undefined
    const defaultCategoria = edit && transacaoEdit ? transacaoEdit.categoria.nome : undefined
    const defaultBanco = edit && transacaoEdit ? transacaoEdit.banco.nome : undefined
    const defaultParcelas = edit && transacaoEdit ? transacaoEdit.totalParcelas.toString() : undefined
    const defaultDescricao = edit && transacaoEdit ? transacaoEdit.descricao : undefined
    const defaultValor = edit && transacaoEdit ? (parseInt(transacaoEdit.valorTotal) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : undefined

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-slate-800 shadow-xl border border-slate-700">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-600">
                            <Plus className="text-white" size={18} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Nova Transação</h2>
                            <p className="text-sm text-slate-400">Preencha os dados da transação</p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setError(null)
                            setCampos(null)
                            setVisible(false)
                            setValorFormatado("")
                            onClose()
                        }} className="text-slate-400 hover:text-white cursor-pointer">
                        <X />
                    </button>
                </div>

                {/* Form */}
                <form action={submitAction}>
                    <div className="p-6 space-y-4">

                        <Field name="descricao" label="Descrição *" placeholder="Ex: Supermercado" defaultValue={defaultDescricao} camposObrigatorios={camposObrigatorios} valorChange={handleValorChange} valorFormatado={valorFormatado} isEntrada={isEntrada} />
                        <Field name="valor" label="Valor (R$) *" placeholder="R$ 0,00" defaultValue={defaultValor} camposObrigatorios={camposObrigatorios} valorChange={handleValorChange} valorFormatado={valorFormatado} isEntrada={isEntrada} />
                        <Field name="data" label="Data *" type="date" defaultValue={defaultData} camposObrigatorios={camposObrigatorios} valorChange={handleValorChange} valorFormatado={valorFormatado} isEntrada={isEntrada} />

                        <SelectTipoTransacao name="tipoTransacao" label="Tipo de Transação *" options={['Entrada', 'Saída']} defaultValue={defaultTipo} camposObrigatorios={camposObrigatorios} bloqueiaCampoChange={bloqueiaCampoOnChange} />
                        <Select name="metodoPagamento" label="Método de Pagamento *" options={['Cartão de Crédito', 'Cartão de Débito', 'Cartão VR', 'Pix', 'Dinheiro', 'Boleto']} defaultValue={defaultMetodo} camposObrigatorios={camposObrigatorios} />

                        <Field name="qtdParcelas" label="Total de Parcelas" placeholder="Ex: 3" type="number" defaultValue={defaultParcelas} camposObrigatorios={camposObrigatorios} valorChange={handleValorChange} valorFormatado={valorFormatado} isEntrada={isEntrada} />

                        <SelectCategoria name="categoria" label="Categoria *" categoria={categoria} defaultValue={defaultCategoria} camposObrigatorios={camposObrigatorios} isEntrada={isEntrada} />
                        <Select name="banco" label="Banco *" options={banco.map(b => b.nome)} defaultValue={defaultBanco} camposObrigatorios={camposObrigatorios} />

                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-700 px-6 py-4">
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setError(null)
                                    setCampos(null)
                                    setVisible(false)
                                    setValorFormatado("")
                                    onClose()
                                }}
                                className="flex-1 rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600 cursor-pointer"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="flex-1 rounded-lg bg-rose-600 px-4 py-4 text-sm font-semibold text-white hover:bg-rose-500 cursor-pointer"
                            >
                                {edit ? "Editar" : "Adicionar"}
                            </button>
                        </div>

                        {error && visible ?
                            <p className="mt-2 text-center text-xs text-red-500">
                                {error}
                            </p> : visible ? <p className="mt-2 text-center text-xs text-green-500">
                                {success}
                            </p> : ""}
                    </div>
                </form>
            </div>
        </div>
    )
}

type FieldProps = {
    name: string
    label: string
    placeholder?: string
    type?: string
    defaultValue?: string
    valorFormatado?: string
    valorChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    isEntrada?: boolean
    camposObrigatorios: string[] | null
}

function Field({ name, label, placeholder, type = 'text', defaultValue, valorFormatado, valorChange, isEntrada, camposObrigatorios }: FieldProps) {
    const isError = camposObrigatorios?.includes(name)
    return (
        <div>
            <label className={isError ? "mb-1 block text-sm text-red-400" : "mb-1 block text-sm text-slate-400"}>
                {isError ? label + " - Obrigatório" : label}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                name={name}
                {...(name === "valor" ? { value: valorFormatado, onChange: valorChange } : { defaultValue: defaultValue })}
                {...(name === "qtdParcelas" ? { min: "1", disabled: isEntrada } : {})}
                className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 cursor-pointer disabled:opacity-50"
            />
        </div>
    )
}

type SelectProps = {
    name: string
    label: string
    options: string[]
    defaultValue?: string
    camposObrigatorios: string[] | null
}

function Select({ name, label, options, defaultValue, camposObrigatorios }: SelectProps) {
    const isError = camposObrigatorios?.includes(name)
    return (
        <div>
            <label className={isError ? "mb-1 block text-sm text-red-400" : "mb-1 block text-sm text-slate-400"}>
                {isError ? label + " - Obrigatório" : label}
            </label>
            <select
                name={name}
                defaultValue={defaultValue || ""}
                className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white outline-none cursor-pointer"
            >
                <option value="" disabled>Selecione</option>
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    )
}

type SelectTipoTransacaoProps = {
    name: string
    label: string
    options: string[]
    defaultValue?: string
    bloqueiaCampoChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
    camposObrigatorios: string[] | null
}

function SelectTipoTransacao({ name, label, options, defaultValue, bloqueiaCampoChange, camposObrigatorios }: SelectTipoTransacaoProps) {
    const isError = camposObrigatorios?.includes(name)
    return (
        <div>
            <label className={isError ? "mb-1 block text-sm text-red-400" : "mb-1 block text-sm text-slate-400"}>
                {isError ? label + " - Obrigatório" : label}
            </label>
            <select
                name={name}
                defaultValue={defaultValue || ""}
                onChange={bloqueiaCampoChange}
                className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white outline-none cursor-pointer"
            >
                <option value="" disabled>Selecione</option>
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    )
}

type SelectCategoriaProps = {
    name: string
    label: string
    categoria: CategoriaData[]
    defaultValue?: string
    isEntrada: boolean
    camposObrigatorios: string[] | null
}

function SelectCategoria({ name, label, categoria, defaultValue, isEntrada, camposObrigatorios }: SelectCategoriaProps) {
    const isError = camposObrigatorios?.includes(name)
    return (
        <div>
            <label className={isError ? "mb-1 block text-sm text-red-400" : "mb-1 block text-sm text-slate-400"}>
                {isError ? label + " - Obrigatório" : label}
            </label>
            <select
                name={name}
                defaultValue={defaultValue || ""}
                className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white outline-none cursor-pointer"
            >
                <option value="" disabled>Selecione</option>
                {categoria
                    .filter(c => isEntrada ? c.tipo === TipoTransacao.IN : c.tipo === TipoTransacao.OUT)
                    .map(c => (
                        <option key={c.nome} value={c.nome}>{c.nome}</option>
                    ))
                }
            </select>
        </div>
    )
}