import { TipoTransacao } from '@/generated/prisma/enums'

type Props = {
  transacoes: Transacao[]
}

type Transacao = {
  banco: {
    nome: string
    cor: string
  }
  valor: string
  tipoTransacao: TipoTransacao
}

export function GastosPorBanco({ transacoes }: Props) {
  const saidasPorBanco = Object.values(
    transacoes
      .filter(t => t.tipoTransacao === TipoTransacao.OUT)
      .reduce((acc, t) => {
        const nome = t.banco.nome

        if (!acc[nome]) {
          acc[nome] = {
            banco: t.banco,
            valor: 0
          }
        }

        acc[nome].valor += parseInt(t.valor)
        return acc
      }, {} as Record<string, { banco: { nome: string; cor: string }; valor: number }>)
  ).sort((a, b) => b.valor - a.valor)

  const totalGastos = saidasPorBanco.reduce((acc, item) => acc + item.valor, 0)

  return (
    <div className="rounded-2xl bg-slate-800 p-6 shadow-lg">
      <h3 className="mb-4 text-lg font-semibold text-white">Gastos por Banco</h3>


      <div className="space-y-4 overflow-y-auto pr-2 max-h-71.25 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full">
        {saidasPorBanco.map((item) => {
          const percent = (item.valor / totalGastos) * 100

          return (
            <div key={item.banco.nome}>
              <div className="mb-1 flex h-8 items-center justify-between text-sm text-white">
                <span className="font-medium">{item.banco.nome}</span>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    {percent.toFixed(2)}%
                  </span>
                  <span>
                    {(item.valor / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>

              <div className="h-2 w-full rounded-full bg-slate-700">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${percent}%`, backgroundColor: `${item.banco.cor}`}}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}