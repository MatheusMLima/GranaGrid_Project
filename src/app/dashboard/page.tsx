import { PageHeader } from './components/pageHeader'
import { StatsCards } from './components/statsCards'
import { Graficos } from './components/graficos'
import { TransactionsTabs } from './components/transactionsTabs'
import { GastosPorBanco } from './components/gastosPorBanco'
import { TopGastos } from './components/maioresGastos'
import { TipoTransacao, MetodoPagamento, Icones } from '@/generated/prisma'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { signOut } from '@/lib/auth'
import { fromZonedTime, toZonedTime } from "date-fns-tz"


type TransacoesVigente = {
    categoria: {
        nome: string
        icone: Icones | null
    }
    banco: {
        nome: string,
        cor: string
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



export function serializeTransactions(rows: TransacoesVigente[], timeZone: string) 
{
  return rows.map(r => ({
    ...r,
    data: toZonedTime(r.data, timeZone)
  }))
}

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

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const dataNow = new Date()

    const dataInicioLocal = new Date(dataNow.getFullYear(), dataNow.getMonth(), 1, 0, 0, 0)
    const dataFimLocal   = new Date(dataNow.getFullYear(), dataNow.getMonth() + 1, 1, 0, 0, 0)
    const dataInicioMesUTC = fromZonedTime(dataInicioLocal, timeZone)
    const dataFimMesUTC = fromZonedTime(dataFimLocal, timeZone) 

    const dataInicioMesPassadoLocal = new Date(dataNow.getFullYear(), dataNow.getMonth() - 1, 1, 0, 0, 0)
    const dataFimMesPassadoLocal   = new Date(dataNow.getFullYear(), dataNow.getMonth(), 1, 0, 0, 0)
    const dataInicioMesPassadoUTC = fromZonedTime(dataInicioMesPassadoLocal, timeZone)
    const dataFimMesPassadoUTC = fromZonedTime(dataFimMesPassadoLocal, timeZone)

    const transacoesVigente = await prisma.transacao.findMany({
        where: {
            userId: userData.id,
            data: {
                gte: dataInicioMesUTC,
                lte: dataFimMesUTC
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

    const transacoesVigenteSerializadas = serializeTransactions(transacoesVigente, timeZone)

    const transacoesMesAnterior = await prisma.transacao.findMany({
        where: {
            userId: userData.id,
            data: {
                gte: dataInicioMesPassadoUTC,
                lte: dataFimMesPassadoUTC
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
            <StatsCards transacoes={transacoesVigenteSerializadas} transacoesMesAnterior={transacoesMesAnterior} />
            <Graficos transacoes={transacoesVigenteSerializadas} transacoesUser={transacoesUsuario} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                <div className="space-y-6">
                    <TopGastos transacoes={transacoesVigenteSerializadas} />
                </div>

                <div className="space-y-6">
                    <GastosPorBanco transacoes={transacoesVigenteSerializadas} />
                </div>
            </div>
            <TransactionsTabs userData={userData} categoriaData={categoria} bancoData={bancos} transacoes={transacoesVigenteSerializadas} />
        </div>
    );
}