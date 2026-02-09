'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { TipoTransacao } from '@/generated/prisma/enums'
import { useState, useMemo } from 'react'
import { ArrowDownCircle, BarChart3 } from 'lucide-react' 
import { FaMoneyBill1Wave } from "react-icons/fa6"

type Props = {
  transacoes: Transacao[]
  transacoesUser: TransacaoUser[]
}

type Transacao = {
  categoria: {
    nome: string
  };
  valor: string
  tipoTransacao: TipoTransacao
}

type TransacaoUser = {
  valor: string
  tipoTransacao: TipoTransacao
  data: Date
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

export function Graficos({ transacoes, transacoesUser }: Props) {
  const [active, setActive] = useState<'OUT' | 'IN'>('OUT')

  // grafico de pizza
  const saidas = transacoes.filter(t => t.tipoTransacao === TipoTransacao.OUT)
  const valorTotalSaidas = saidas.reduce((soma, t) => soma + parseInt(t.valor), 0) / 100

  const dadosPizza = Object.values(
    saidas.reduce((acc, t) => {
      const nome = t.categoria.nome
      if (!acc[nome]) {
        acc[nome] = {
          name: nome,
          value: 0,
          color: stringToColor(nome),
        }
      }
      acc[nome].value += parseInt(t.valor) / 100
      return acc
    }, {} as Record<string, { name: string; value: number; color: string }>)
  )

  // grafico de barras
  const dadosBarras = useMemo(() => {
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    
    const dadosPorMes = meses.map(mes => ({
      name: mes,
      entradas: 0,
      saidas: 0
    }));

    transacoesUser.forEach(t => {
      const dataTransacao = new Date(t.data);
      const mesIndex = dataTransacao.getMonth(); 
      const valorFormatado = parseInt(t.valor) / 100;

      if (t.tipoTransacao === TipoTransacao.IN) {
        dadosPorMes[mesIndex].entradas += valorFormatado;
      } else if (t.tipoTransacao === TipoTransacao.OUT) {
        dadosPorMes[mesIndex].saidas += valorFormatado;
      }
    });

    return dadosPorMes;
  }, [transacoesUser]);

  return (
    <div className="rounded-2xl bg-slate-800 shadow-lg overflow-hidden flex flex-col">
      {/* Abas */}
      <div className="flex border-b border-slate-700">
        <button 
          onClick={() => setActive('OUT')} 
          className={`cursor-pointer flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition ${active === 'OUT' ? 'bg-rose-900/40 text-rose-400 border-b-2 border-rose-500' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
        >
          <FaMoneyBill1Wave size={18} />
          Distribuição de Gastos
        </button>

        <button 
          onClick={() => setActive('IN')} 
          className={`cursor-pointer flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition ${active === 'IN' ? 'bg-emerald-900/40 text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
        >
          <BarChart3 size={18} />
          Todos Meses
        </button>
      </div>

      <div className="p-6">
        {active === "OUT" && (
          <>
            {/* Header Pizza */}
            <div className="mb-6 flex items-start justify-between">
              <h3 className="text-lg font-semibold text-white">Por Categoria</h3>
              <div className="text-right">
                <p className="text-xs text-slate-400">Total Saídas</p>
                <p className="font-bold text-white">R$ {valorTotalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            {/* Gráfico Pizza */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosPizza}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    innerRadius={50}
                    paddingAngle={2}
                    label={({ percent }) => percent !== undefined ? `${(percent * 100).toFixed(0)}%` : ''}
                  >
                    {dadosPizza.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value?: number) => `R$ ${value?.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legenda Pizza */}
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-200 md:grid-cols-4">
              {dadosPizza.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {active === "IN" && (
          <>
             {/* Header Barras */}
             <div className="mb-6 flex items-start justify-between">
              <h3 className="text-lg font-semibold text-white">Entradas vs Saídas</h3>
            </div>

            {/* Gráfico de Barras */}
            <div className="h-80 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosBarras} margin={{ top: 20, right: 0, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `R$${value}`}
                  />
                  <Tooltip 
                    cursor={{ fill: '#334155', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                    formatter={(value?: number) => `R$ ${value?.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  
                  {/* Barra de Saídas */}
                  <Bar 
                    name="Saídas" 
                    dataKey="saidas" 
                    fill="#f43f5e" 
                    radius={[4, 4, 0, 0]} 
                    barSize={12}
                  />
                  
                  {/* Barra de Entradas */}
                  <Bar 
                    name="Entradas" 
                    dataKey="entradas" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]} 
                    barSize={12}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  )
}