import { Expense } from '@/types'

const BOM = '\uFEFF'

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
    headers.join(';'),
    ...data.map((e) => {
      const escapeStr = (str: any) => `"${String(str || '').replace(/"/g, '""')}"`
      return [
        escapeStr(e.date),
        escapeStr(e.monthNum),
        escapeStr(e.competency),
        escapeStr(''),
        escapeStr(e.establishment),
        escapeStr(e.primaryCategory),
        escapeStr(e.secondaryCategory),
        escapeStr(e.type),
        escapeStr(e.paymentMethod),
        escapeStr(e.value.toFixed(2).replace('.', ',')),
        escapeStr(e.comment),
        escapeStr(e.classification),
        escapeStr(e.who),
        escapeStr(e.installments || 1),
      ].join(';')
    }),
  ].join('\n')

  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
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
    '"150,00"',
    '"Compra do mês"',
    '"Pessoal"',
    '"João"',
    '"1"',
  ]

  const csvContent = headers.join(';') + '\n' + sampleData.join(';')

  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
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
