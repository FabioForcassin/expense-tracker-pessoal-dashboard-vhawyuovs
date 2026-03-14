import { Expense } from '@/types'
import { formatCurrency } from './format'

export function exportToCSV(data: Expense[], filename: string) {
  const headers = [
    'Data',
    'Competência',
    'Estabelecimento',
    'Categoria',
    'Subcategoria',
    'Tipo',
    'Forma de Pagto',
    'Valor',
    'Classificação',
  ]
  const csvContent = [
    headers.join(','),
    ...data.map(
      (e) =>
        `"${e.date}","${e.competency}","${e.establishment}","${e.primaryCategory}","${e.secondaryCategory}","${e.type}","${e.paymentMethod}",${e.value},"${e.classification}"`,
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
