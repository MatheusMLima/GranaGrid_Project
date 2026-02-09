import { Home, ShoppingCart, Car, UtensilsCrossed, Plane, HeartPlus, Cpu, DollarSign, CarTaxiFront, Gamepad2, Airplay, LucideIcon } from 'lucide-react'
import { TipoTransacao, Icones } from '@/generated/prisma/enums'

type Props = {
  transacoes: Transacao[]
}

type Transacao = {
  categoria: {
    nome: string;
    icone: Icones | null;
  };
  valor: string;
  tipoTransacao: TipoTransacao;
}

function stringToColor(str: string) {
  let hash = 0

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = "#"
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += value.toString(16).padStart(2, "0")
  }

  return color
}

export function TopGastos({ transacoes }: Props) {
  
  const iconMap: Record<Icones, LucideIcon> = {
    [Icones.HOUSE]: Home,
    [Icones.CAR]: Car,
    [Icones.FOOD]: UtensilsCrossed,
    [Icones.SHOPPING]: ShoppingCart,
    [Icones.HEALTH]: HeartPlus,
    [Icones.DOLLAR]: DollarSign,
    [Icones.CAR_TAXI]: CarTaxiFront,
    [Icones.HARDWARE]: Cpu,
    [Icones.HOBBIE]: Gamepad2,
    [Icones.TRAVEL]: Plane,
    [Icones.TV]: Airplay,
  }

  const despesas = transacoes.filter(t => t.tipoTransacao === TipoTransacao.OUT)
  const valorTotalSaidas = despesas.reduce((soma, t) => soma + parseInt(t.valor), 0) / 100

  const dadosGastos = Object.values(
    despesas.reduce((acc, t) => {
      const nome = t.categoria.nome
      const icone = t.categoria.icone ?? Icones.SHOPPING

      if (!acc[nome]) {
        acc[nome] = {
          name: nome,
          value: 0,
          color: stringToColor(nome),
          icon: iconMap[icone],
        }
      }

      acc[nome].value += parseInt(t.valor) / 100
      return acc
    }, {} as Record<string, { name: string; value: number; color: string; icon: LucideIcon }>)
  )

  const dadosOrdenados = dadosGastos.sort((a, b) => b.value - a.value).slice(0, 5)

  return (
    <div className="rounded-2xl bg-slate-800 p-6 shadow-lg">
      <h3 className="mb-4 text-lg font-semibold text-white">Maiores Gastos</h3>

      <div className="space-y-4">
        {dadosOrdenados.map(item => {
          const Icon = item.icon
          const percent = (item.value / valorTotalSaidas) * 100

          return (
            <div key={item.name}>
              <div className="mb-1 flex items-center justify-between text-sm text-white">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${item.color}` }}>
                    <Icon size={16} className="text-white" />
                  </span>
                  {item.name}
                </div>
                <span>{item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>

              <div className="h-2 w-full rounded-full bg-slate-700">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${percent}%`, backgroundColor: `${item.color}` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
