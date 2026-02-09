'use client'

import { Calendar, Download, House, History } from "lucide-react";
import { MenuUsuario } from './menuUsuario'
import { useState } from "react";
import HistoricoModal from "./historicoModal";
import { TipoTransacao, MetodoPagamento } from "@/generated/prisma";
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'
import ExcelJS from 'exceljs'

type UserData = {
  id: string
  nome: string
  email: string
  username?: string
  image?: string
}

type transacoesUsuario = {
  valor: string;
  data: Date;
  tipoTransacao: TipoTransacao;
}

type transacoesVigente = {
  categoria: {
    nome: string
  }
  banco: {
    nome: string
  }
  valor: string
  data: Date
  descricao: string
  tipoTransacao: TipoTransacao
  metodoPagamento: MetodoPagamento
  numeroParcela: number
  totalParcelas: number
  valorTotal: string
}

type Props = {
  userData: UserData
  mesVigente: string
  anoVigente: string
  transacaoUser: transacoesUsuario[]
  signOut: () => void
  transacaoVigente: transacoesVigente[]
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

export function PageHeader({ userData, mesVigente, anoVigente, transacaoUser, signOut, transacaoVigente }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [isHistoricoOpen, setHistoricoOpen] = useState(false);

  const handleOpenModal = () => setHistoricoOpen(true)

  const handleCloseModal = () => setHistoricoOpen(false)

  function handleHomePage() {

    if (pathname === '/dashboard') {
      router.push("/")
    } else {
      router.push("/dashboard")
    }

  }

  async function handleExportarXLSX() {
    const workbook = new ExcelJS.Workbook()

    const worksheet = workbook.addWorksheet('Extrato Financeiro')

    const linhas = transacaoVigente.map(t => [
      t.tipoTransacao === 'IN' ? 'Entrada' : 'Saída',
      t.descricao,
      t.categoria.nome,
      t.banco.nome,
      new Date(t.data.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })),
      getMetodoPagamentoLabel(t.metodoPagamento),
      t.numeroParcela,
      (parseInt(t.valor) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      t.totalParcelas,
      (parseInt(t.valorTotal) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    ])

    worksheet.addTable({
      name: 'GastoMensal',
      ref: 'A1',
      headerRow: true,
      style: {
        theme: 'TableStyleMedium9',
        showColumnStripes: true
      },
      columns: [
        { name: 'Tipo de Transação', filterButton: true },
        { name: 'Descrição', filterButton: true },
        { name: 'Categoria', filterButton: true },
        { name: 'Banco', filterButton: true },
        { name: 'Data', filterButton: true },
        { name: 'Forma de Pagamento', filterButton: true },
        { name: 'Parcela', filterButton: true },
        { name: 'Valor da Parcela', filterButton: true },
        { name: 'Total de Parcelas', filterButton: true },
        { name: 'Valor Total da Compra', filterButton: true },
      ],
      rows: linhas
    })

    worksheet.getColumn(1).width = 25
    worksheet.getColumn(2).width = 30
    worksheet.getColumn(3).width = 25
    worksheet.getColumn(4).width = 15
    worksheet.getColumn(5).width = 20
    worksheet.getColumn(6).width = 25
    worksheet.getColumn(7).width = 15
    worksheet.getColumn(8).width = 25
    worksheet.getColumn(9).width = 25
    worksheet.getColumn(10).width = 25

    for (var i = 1; i <= 10; i++) {
      worksheet.getRow(1).getCell(i).font = { bold: true, size: 13, color: { argb: 'FF000000' } }
    }

    for (var i = 2; i <= transacaoVigente.length + 1; i++) {
      worksheet.getRow(i).getCell(1).font = { color: { argb: worksheet.getRow(i).getCell(1).value === 'IN' ? 'FF006400' : 'FFFF0000' }, bold: true }
      worksheet.getRow(i).getCell(8).font = { color: { argb: worksheet.getRow(i).getCell(1).value === 'IN' ? 'FF006400' : 'FFFF0000' }, bold: true }
      worksheet.getRow(i).getCell(10).font = { color: { argb: worksheet.getRow(i).getCell(1).value === 'IN' ? 'FF006400' : 'FFFF0000' }, bold: true }
      worksheet.getRow(i).getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }
      worksheet.getRow(i).getCell(9).alignment = { vertical: 'middle', horizontal: 'center' }
    }

    worksheet.autoFilter = 'A1:J1';

    const sheetResumo = workbook.addWorksheet('Resumo Gerencial')
    const totalDespesas = transacaoVigente.filter(t => t.tipoTransacao === TipoTransacao.OUT).reduce((acc, t) => acc + parseInt(t.valor), 0) / 100
    const totalEntradas = transacaoVigente.filter(t => t.tipoTransacao === TipoTransacao.IN).reduce((acc, t) => acc + parseInt(t.valor), 0) / 100
    const saldoMes = totalEntradas - totalDespesas

    sheetResumo.getCell('B2').value = 'Resumo do Período'
    sheetResumo.getCell('B2').font = { size: 16, bold: true }

    sheetResumo.getCell('B4').value = 'Total Entradas'
    sheetResumo.getCell('C4').value = 'Total Saídas'
    sheetResumo.getCell('D4').value = 'Saldo Final'

    const headerRow = sheetResumo.getRow(4)
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF475569' }
      }
      cell.alignment = { horizontal: 'center' }
    })

    sheetResumo.getCell('B5').value = totalEntradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    sheetResumo.getCell('C5').value = totalDespesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    sheetResumo.getCell('D5').value = saldoMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    sheetResumo.getCell('D5').font = {
      bold: true,
      color: { argb: saldoMes >= 0 ? 'FF006400' : 'FFFF0000' }
    }

    sheetResumo.getColumn(2).width = 20
    sheetResumo.getColumn(3).width = 20
    sheetResumo.getColumn(4).width = 20

    workbook.views = [
      {
        x: 0, y: 0, width: 10000, height: 20000,
        firstSheet: 0, activeTab: 0, visibility: 'visible'
      }
    ]

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = window.URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `Relatorio_${userData.username !== "" ? userData.username : userData.nome}_${mesVigente}/${anoVigente}.xlsx`
    anchor.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl mx-auto mt-10 bg-slate-700 p-6 shadow-sm md:flex-row md:items-center md:justify-between">

      {/* Título */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Planilha Financeira - {userData.username === '' ? userData.nome : userData.username}
        </h1>
        <div className="mt-1 flex items-center gap-2 text-sm text-gray-400">
          <Calendar size={16} />
          <span>{`${mesVigente} ${anoVigente}`}</span>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-3 h-12">
        <button onClick={handleOpenModal} className="cursor-pointer flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
          <History size={16} />
          Histórico
        </button>

        <button onClick={handleHomePage} className="flex items-center gap-2 rounded-xl border bg-purple-700 border-gray-600 px-4 py-2 text-sm font-medium text-gray hover:bg-purple-800 transition cursor-pointer">
          <House size={16} />
          Página Inicial
        </button>

        <button onClick={handleExportarXLSX} className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition cursor-pointer">
          <Download size={16} />
          Exportar
        </button>

        <MenuUsuario userData={userData} signOut={signOut} />
        <HistoricoModal isOpen={isHistoricoOpen} onClose={handleCloseModal} transacaoUser={transacaoUser} />
      </div>
    </div>
  );
}
