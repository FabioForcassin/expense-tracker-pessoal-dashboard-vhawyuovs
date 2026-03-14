import { Expense } from '@/types'

export function exportToCSV(data: Expense[], filename: string) {
  const headers = [
    'Data',
    'Mês',
    'Competência',
    'Ignorado',
    'Estabelecimento',
    'Categoria Principal',
    'Subcategoria',
    'Tipo',
    'Forma de Pagto',
    'Valor',
    'Comentário',
    'Classificação',
    'Quem',
  ]

  const csvContent = [
    headers.join(','),
    ...data.map(
      (e) =>
        `"${e.date}","${e.monthNum}","${e.competency}","","${e.establishment}","${e.primaryCategory}","${e.secondaryCategory}","${e.type}","${e.paymentMethod}",${e.value},"${e.comment || ''}","${e.classification}","${e.who}"`,
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
