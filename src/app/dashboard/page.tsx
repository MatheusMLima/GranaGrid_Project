import { PageHeader } from './components/pageHeader'
import { StatsCards } from './components/statsCards'
import { Graficos } from './components/graficos'
import { TransactionsTabs } from './components/transactionsTabs'
import { GastosPorBanco } from './components/gastosPorBanco'
import { TopGastos } from './components/maioresGastos'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { signOut } from '@/lib/auth'


export default async function Dashboard() {
    async function handleSignOut() {
        "use server"

        await signOut({ redirectTo: "/" })
    }

    const session = await auth()

    if (!session?.user) {
        redirect("/")
    }

    const userData = {
        id: session.user.id,
        nome: session.user.name || "",
        username: session.user?.username || "",
        email: session.user.email || "",
        image: session.user?.image || ""
    }

    const bancos = await prisma.banco.findMany({
        select: {
            id: true,
            nome: true
        }
    })

    const categoria = await prisma.categoria.findMany({
        select: {
            id: true,
            nome: true,
            tipo: true
        }
    })

    const dataNow = new Date()
    const dataInicioMes = new Date(dataNow.getFullYear(), dataNow.getMonth(), 1)
    const dataFimMes = new Date(dataNow.getFullYear(), dataNow.getMonth() + 1, 0)
    const dataInicioMesPassado = new Date(dataNow.getFullYear(), dataNow.getMonth() - 1, 1)
    const dataFimMesPassado = new Date(dataNow.getFullYear(), dataNow.getMonth(), 0)

    const transacoesVigente = await prisma.transacao.findMany({
        where: {
            userId: userData.id,
            data: {
                gte: dataInicioMes,
                lte: dataFimMes
            }
        },
        select: {
            transacaoId: true,
            valor: true,
            data: true,
            descricao: true,
            tipoTransacao: true,
            metodoPagamento: true,
            numeroParcela: true,
            totalParcelas: true,
            grupoParcelamento: true,
            valorTotal: true,
            categoria: {
                select: {
                    nome: true,
                    icone: true
                }
            },
            banco: {
                select: {
                    nome: true,
                    cor: true
                }
            }
        }
    })

    const transacoesMesAnterior = await prisma.transacao.findMany({
        where: {
            userId: userData.id,
            data: {
                gte: dataInicioMesPassado,
                lte: dataFimMesPassado
            }
        },
        select: {
            valor: true,
            tipoTransacao: true,
        }
    })

    const transacoesUsuario = await prisma.transacao.findMany({
        where: {
            userId: userData.id
        },
        select: {
            valor: true,
            tipoTransacao: true,
            data: true
        }
    })
    
    return (
        <div className="mx-auto max-w-4/5 px-6 space-y-6">
            <PageHeader userData={userData} mesVigente={dataNow.toLocaleString('pt-BR', { month: 'long' }).replace(/^./, letra => letra.toUpperCase())} anoVigente={dataNow.getFullYear().toString()} transacaoUser={transacoesUsuario} signOut={handleSignOut} transacaoVigente={transacoesVigente} />
            <StatsCards transacoes={transacoesVigente} transacoesMesAnterior={transacoesMesAnterior} />
            <Graficos transacoes={transacoesVigente} transacoesUser={transacoesUsuario} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                <div className="space-y-6">
                    <TopGastos transacoes={transacoesVigente} />
                </div>

                <div className="space-y-6">
                    <GastosPorBanco transacoes={transacoesVigente} />
                </div>
            </div>
            <TransactionsTabs userData={userData} categoriaData={categoria} bancoData={bancos} transacoes={transacoesVigente} />
        </div>
    );
}