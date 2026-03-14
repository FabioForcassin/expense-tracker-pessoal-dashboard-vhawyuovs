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
    'Parcelas',
  ]

  const csvContent = [
    headers.join(','),
    ...data.map(
      (e) =>
        `"${e.date}","${e.monthNum}","${e.competency}","","${e.establishment}","${e.primaryCategory}","${e.secondaryCategory}","${e.type}","${e.paymentMethod}",${e.value},"${e.comment || ''}","${e.classification || ''}","${e.who || ''}","${e.installments || 1}"`,
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

export function downloadImportTemplate() {
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
    'Parcelas',
  ]

  const sampleData = [
    '"01/01/2026"',
    '"1"',
    '"Jan"',
    '""',
    '"Exemplo Estabelecimento"',
    '"Alimentação"',
    '"Supermercado/Feira"',
    '"Variável"',
    '"Itaú"',
    '"150.00"',
    '"Compra de mês"',
    '"Pessoal"',
    '"João"',
    '"1"',
  ]

  const csvContent = headers.join(',') + '\n' + sampleData.join(',')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'template_importacao.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
