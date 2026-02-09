import { TrendingUp, TrendingDown, DollarSign, Wallet } from "lucide-react";
import { StatCard } from "./statCard";
import { TipoTransacao, MetodoPagamento } from "@/generated/prisma";

type Props = {
    transacoes: Transacao[],
    transacoesMesAnterior: TransacoesMesAnterior[]
}

type Transacao = {
    categoria: {
      nome: string;
    };
    banco: {
      nome: string;
    };
    descricao: string;
    valor: string;
    data: Date;
    tipoTransacao: TipoTransacao;
    metodoPagamento: MetodoPagamento;
    numeroParcela: number;
    totalParcelas: number;
    transacaoId: string;
    grupoParcelamento: string | null;
}

type TransacoesMesAnterior = {
    valor: string;
    tipoTransacao: TipoTransacao;
}

export function StatsCards({ transacoes, transacoesMesAnterior }: Props) {

    const entradaCentavos = transacoes.filter(t => t.tipoTransacao === TipoTransacao.IN).reduce((soma, t) => soma + parseInt(t.valor), 0)
    const saidaCentavos = transacoes.filter(t => t.tipoTransacao === TipoTransacao.OUT).reduce((soma, t) => soma + parseInt(t.valor), 0)
    const saldoCentavos = entradaCentavos - saidaCentavos

    const totalEntradas = entradaCentavos / 100;
    const totalSaidas = saidaCentavos / 100;
    const saldoMes = saldoCentavos / 100;
    const taxaEconomia = totalEntradas !== 0 ? (((totalEntradas - totalSaidas) / totalEntradas) * 100).toFixed(1) : 0

    const entradaCentavosMesPassado = transacoesMesAnterior.filter(t => t.tipoTransacao === TipoTransacao.IN).reduce((soma, t) => soma + parseInt(t.valor), 0)
    const saidaCentavosMesPassado = transacoesMesAnterior.filter(t => t.tipoTransacao === TipoTransacao.OUT).reduce((soma, t) => soma + parseInt(t.valor), 0)

    const totalEntradasMesPassado = entradaCentavosMesPassado / 100;
    const totalSaidasMesPassado = saidaCentavosMesPassado / 100;

    const relacaoEntradaMesPassado = totalEntradasMesPassado !== 0 ? Number((((totalEntradas - totalEntradasMesPassado) / totalEntradasMesPassado) * 100).toFixed(1)) : 0
    const relacaoSaidaMesPassado = totalSaidasMesPassado !== 0 ? Number((((totalSaidas - totalSaidasMesPassado) / totalSaidasMesPassado) * 100).toFixed(1)) : 0

    const formatCurrencyWithSign = (value: number) => {
      const sinal = value > 0 ? '+' : value < 0 ? '-' : ''
      const valorFormatado = Math.abs(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })

      return `${sinal} ${valorFormatado}`
    }

    const formatPercentWithSign = (value: number) => {
      const sinal = value > 0 ? '+' : value < 0 ? '-' : ''
      const valorFormatado = Math.abs(value)

      return `${sinal} ${valorFormatado}%`
    }

    return (
      <div className=" mx-auto grid gap-4 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">

        <StatCard
          title="Total de Entradas"
          value={totalEntradas.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
          badge={formatPercentWithSign(relacaoEntradaMesPassado)}
          icon={<TrendingUp size={24} />}
          gradient="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          title="Total de Saídas"
          value={totalSaidas.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
          badge={formatPercentWithSign(relacaoSaidaMesPassado)}
          icon={<TrendingDown size={24} />}
          gradient="bg-gradient-to-br from-rose-500 to-pink-600"
        />

        <StatCard
          title="Saldo do Mês"
          value={formatCurrencyWithSign(saldoMes)}
          icon={<DollarSign size={24} />}
          gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
        />

        <StatCard
          title="Taxa de Economia"
          value={`${taxaEconomia}%`}
          icon={<Wallet size={24} />}
          gradient="bg-gradient-to-br from-purple-500 to-fuchsia-600"
        />

      </div>
    );
}
