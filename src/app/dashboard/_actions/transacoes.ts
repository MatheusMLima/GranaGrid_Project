"use server"

import { success, z } from "zod"
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MetodoPagamento, TipoTransacao } from "@/generated/prisma/enums"
import { revalidatePath } from "next/cache"
import cuid from 'cuid'

const CreateTransacaoSchema = z.object({
    transacaoId: z.string(),
    descricao: z.string().min(4, "A descrição precisa ter pelo menos 1 caracteres"),
    valor: z.string(),
    data: z.date(),
    tipoTransacao: z.nativeEnum(TipoTransacao),
    metodoPagamento: z.nativeEnum(MetodoPagamento),
    numeroParcela: z.number(),
    totalParcelas: z.number(),
    categoria: z.string(),
    banco: z.string(),
    idGrupoParcelas: z.string()
})

type CreateTransacaoFormData = z.infer<typeof CreateTransacaoSchema>

function AjustaData(dataCompra: Date, numeroParcela: number) {
    const novaData = new Date(dataCompra);
    const diaEsperado = novaData.getDate();

    novaData.setMonth(novaData.getMonth() + numeroParcela);

    if (novaData.getDate() !== diaEsperado) {
        novaData.setDate(0);
    }

    return novaData;
}

function dividirEmParcelas(valorTotal: string, totalParcelas: number) {
    const base = parseInt(valorTotal) / totalParcelas
    const resto = parseInt(valorTotal) - base * totalParcelas

    const parcelas = Array(totalParcelas).fill(base)

    parcelas[totalParcelas - 1] += resto

    return parcelas
}

export async function CreateTransacao(data: CreateTransacaoFormData) {
    let arrayParcelas = [data.valor]
    const dataCompra = data.data

    const session = await auth();

    if (!session?.user) {
        return {
            success: null,
            error: "Usuário não autenticado",
        }
    }

    const schema = CreateTransacaoSchema.safeParse(data)

    if (!schema.success) {
        return {
            success: null,
            error: schema.error.issues[0].message
        }
    }

    try {
        let transacao = null
        const userId = session.user.id
        const categoria = await prisma.categoria.findUnique({
            where: {
                id: data.categoria
            }
        })

        if (!categoria) {
            return {
                success: null,
                error: "Categoria não encontrada no Bando de Dados"
            }
        }

        const banco = await prisma.banco.findUnique({
            where: {
                id: data.banco
            }
        })

        if (!banco) {
            return {
                success: null,
                error: "Banco não encontrado no Bando de Dados"
            }
        }

        if (data.totalParcelas > 1) {
            arrayParcelas = dividirEmParcelas(data.valor, data.totalParcelas)
        }

        for (let i = 0; i < data.totalParcelas; i++) {
            data.idGrupoParcelas ||= cuid()

            transacao = await prisma.transacao.create({
                data: {
                    descricao: data.descricao,
                    valor: arrayParcelas[i].toString(),
                    data: new Date(data.data),
                    tipoTransacao: data.tipoTransacao,
                    metodoPagamento: data.metodoPagamento,
                    numeroParcela: data.numeroParcela,
                    totalParcelas: data.totalParcelas,
                    grupoParcelamento: data.idGrupoParcelas,
                    valorTotal: data.valor.toString(),
                    categoria: {
                        connect: {
                            id: categoria?.id
                        }
                    },
                    banco: {
                        connect: {
                            id: banco?.id
                        }
                    },
                    user: {
                        connect: {
                            id: userId
                        }
                    }
                },
            })

            data.numeroParcela++
            data.data = AjustaData(dataCompra, data.numeroParcela - 1)

            if (!transacao.grupoParcelamento) {
                return {
                    success: null,
                    error: "Falha ao criar agrupamento de parcelas!"
                }
            }

            data.idGrupoParcelas = transacao.grupoParcelamento
        }

        revalidatePath('/dashboard')

        return {
            success: "Transação criada com sucesso!",
            error: null
        }
    }
    catch (err) {
        return {
            success: null,
            error: "Falha ao criar nova transação"
        }
    }
}

export async function EditTransacao(data: CreateTransacaoFormData) {
    const session = await auth();

    if (!session?.user) {
        return {
            success: null,
            error: "Usuário não autenticado",
        }
    }

    try {
        const userId = session.user.id

        const transacaoExiste = await prisma.transacao.findUnique({
            where: {
                transacaoId: data.transacaoId,
                userId: userId
            },
            select: {
                totalParcelas: true
            }
        })

        if (!transacaoExiste) {
            return { success: null, error: "Transação não encontrada ou permissão negada." }
        }

        if (data.totalParcelas > 1 || transacaoExiste.totalParcelas > 1) {

            // deleto todas as parcelas
            await prisma.transacao.deleteMany({
                where: {
                    userId: userId,
                    grupoParcelamento: data.idGrupoParcelas
                }
            })

            // crio novas parcelas
            await CreateTransacao(data)

            revalidatePath('/dashboard')

            // retorno sucesso
            return {
                success: "Todas as parcelas da transação foram editadas com sucesso!",
                error: null
            }
        }
        else {
            const categoria = await prisma.categoria.findUnique({
                where: {
                    id: data.categoria
                }
            })

            if (!categoria) {
                return {
                    success: null,
                    error: "Categoria não encontrada no Bando de Dados"
                }
            }

            const banco = await prisma.banco.findUnique({
                where: {
                    id: data.banco
                }
            })

            if (!banco) {
                return {
                    success: null,
                    error: "Banco não encontrado no Bando de Dados"
                }
            }

            await prisma.transacao.update({
                where: {
                    transacaoId: data.transacaoId
                },
                data: {
                    descricao: data.descricao,
                    valor: data.valor.toString(),
                    data: new Date(data.data), // Converta string para Date
                    tipoTransacao: data.tipoTransacao,
                    metodoPagamento: data.metodoPagamento,

                    // Atualizando relacionamentos (Categoria e Banco)
                    categoria: {
                        connect: { id: categoria.id }
                    },
                    banco: {
                        connect: { id: banco.id }
                    },

                    // Zera parcelas caso antes fosse parcelado e virou único (opcional)
                    numeroParcela: 1,
                    totalParcelas: 1,
                    valorTotal: data.valor.toString(),
                }
            })

            revalidatePath('/dashboard')

            return {
                success: "Transação editada com sucesso!",
                error: null
            }
        }
    }
    catch (err) {
        return {
            success: null,
            error: "Ocorreu um erro ao editar a transação!"
        }
    }
}

export async function DeleteTransacao(id: string) {
    const session = await auth();

    if (!session?.user) {
        return {
            success: null,
            error: "Usuário não autenticado",
        }
    }

    try {
        const userId = session.user.id

        const transacaoExiste = await prisma.transacao.findUnique({
            where: {
                transacaoId: id,
                userId: userId
            },
            select: {
                grupoParcelamento: true,
                totalParcelas: true
            }
        })

        if (!transacaoExiste) {
            return { success: null, error: "Transação não encontrada ou permissão negada." }
        }

        await prisma.transacao.deleteMany({
            where: {
                userId: userId,
                grupoParcelamento: transacaoExiste.grupoParcelamento
            }
        })

        revalidatePath('/dashboard')

        if (transacaoExiste.totalParcelas > 1) {
            return {
                success: "Transação e todas futuras parcelas excluídas com sucesso!",
                error: null
            }
        }
        else {
            return {
                success: "Transação excluída com sucesso!",
                error: null
            }
        }

    }
    catch (err) {
        return {
            success: null,
            error: "Ocorreu um erro ao tentar excluir a(s) transação(s)!"
        }
    }
}