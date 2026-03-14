import { Expense } from '@/types'

function decodeText(buffer: ArrayBuffer): string {
  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(buffer)
    if (text.includes('MÃªs') || text.includes('CompetÃªncia')) {
      try {
        return decodeURIComponent(escape(text))
      } catch {
        return text
      }
    }
    return text
  } catch {
    return new TextDecoder('windows-1252').decode(buffer)
  }
}

function parseCSV(text: string, separator: string): string[][] {
  const result: string[][] = []
  let row: string[] = []
  let cur = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === separator && !inQuotes) {
      row.push(cur.trim())
      cur = ''
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && text[i + 1] === '\n') {
        i++
      }
      row.push(cur.trim())
      if (row.some((c) => c)) result.push(row)
      row = []
      cur = ''
    } else {
      cur += char
    }
  }
  if (cur || row.length > 0) {
    row.push(cur.trim())
    if (row.some((c) => c)) result.push(row)
  }
  return result
}

function determineMapping(headers: string[]) {
  const norm = headers.map((h) =>
    h
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .replace(/[^a-z0-9]/g, ''),
  )

  const findIndex = (keywords: string[]) => {
    return norm.findIndex((h) => keywords.some((k) => h === k || h.includes(k)))
  }

  const map = {
    date: findIndex(['data']),
    monthNum: findIndex(['mes']),
    competency: findIndex(['competencia']),
    establishment: findIndex(['estabelecimento', 'local']),
    primaryCategory: findIndex(['categoriaprincipal', 'categoria', 'despesa']),
    secondaryCategory: findIndex(['subcategoria']),
    type: findIndex(['tipo', 'fixa', 'variavel']),
    paymentMethod: findIndex(['formadepagto', 'formapgto', 'conta']),
    value: findIndex(['valor']),
    comment: findIndex(['comentario', 'obs']),
    classification: findIndex(['classificacao']),
    who: findIndex(['quem', 'responsavel']),
    installments: findIndex(['parcelas', 'parcela']),
  }

  if (map.secondaryCategory === -1) {
    const classIndexes: number[] = []
    norm.forEach((h, i) => {
      if (h.includes('classificacao') || h.includes('subcategoria') || h.includes('categoria')) {
        classIndexes.push(i)
      }
    })
    const uniqueIndexes = [...new Set(classIndexes)].filter((idx) => idx !== map.primaryCategory)

    if (uniqueIndexes.length > 0) {
      map.secondaryCategory = uniqueIndexes[0]
    }
  }

  return map
}

function parseDate(raw: string, defaultYear: string): string {
  if (!raw) return `${defaultYear}-01-01`
  const clean = raw.replace(/^"|"$/g, '').trim().split(' ')[0]

  const brMatch = clean.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/)
  if (brMatch) {
    let year = brMatch[3]
    if (year.length === 2) year = `20${year}`
    return `${year}-${brMatch[2].padStart(2, '0')}-${brMatch[1].padStart(2, '0')}`
  }

  const isoMatch = clean.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/)
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2].padStart(2, '0')}-${isoMatch[3].padStart(2, '0')}`
  }

  if (!isNaN(Number(clean)) && clean.length > 3) {
    const excelDate = Number(clean)
    if (excelDate > 10000) {
      const date = new Date((excelDate - 25569) * 86400 * 1000)
      return date.toISOString().split('T')[0]
    }
  }

  return `${defaultYear}-01-01`
}

function parseValue(raw: string): number {
  if (!raw) return 0
  let clean = raw.replace(/^"|"$/g, '').trim()
  clean = clean.replace(/R\$\s?/gi, '').replace(/\s/g, '')

  const isNegative = clean.startsWith('-')
  if (isNegative) clean = clean.substring(1)

  if (clean.includes(',') && clean.includes('.')) {
    if (clean.lastIndexOf(',') > clean.lastIndexOf('.')) {
      clean = clean.replace(/\./g, '').replace(',', '.')
    } else {
      clean = clean.replace(/,/g, '')
    }
  } else if (clean.includes(',')) {
    clean = clean.replace(',', '.')
  }

  const val = parseFloat(clean) || 0
  return isNegative ? -val : val
}

export async function parseImportFile(
  file: File,
  year: string,
): Promise<{ parsed: Expense[]; errs: string[] }> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer
      const text = decodeText(buffer)

      const firstLine = text.split(/\r?\n/)[0] || ''
      const commas = (firstLine.match(/,/g) || []).length
      const semicolons = (firstLine.match(/;/g) || []).length
      const sep = semicolons > commas ? ';' : ','

      const lines = parseCSV(text, sep)

      let headerIdx = 0
      for (let i = 0; i < Math.min(lines.length, 10); i++) {
        const row = lines[i].map((c) => c.toLowerCase())
        if (
          row.some((c) => c.includes('data')) &&
          row.some((c) => c.includes('valor') || c.includes('competencia'))
        ) {
          headerIdx = i
          break
        }
      }

      if (lines.length <= headerIdx) {
        resolve({ parsed: [], errs: ['Cabeçalho não encontrado no arquivo.'] })
        return
      }

      const headers = lines[headerIdx]
      const mapping = determineMapping(headers)

      const parsed: Expense[] = []
      const errs: string[] = []

      for (let i = headerIdx + 1; i < lines.length; i++) {
        const cols = lines[i]
        if (!cols || cols.length === 0 || cols.every((c) => !c.trim())) continue

        try {
          const dt = mapping.date !== -1 ? cols[mapping.date] : ''
          if (!dt && cols.filter(Boolean).length < 3) continue

          const date = parseDate(dt, year)
          const valRaw = mapping.value !== -1 ? cols[mapping.value] || '0' : '0'
          const val = parseValue(valRaw)

          parsed.push({
            id: `imp_${file.name}_${Date.now()}_${i}`,
            date,
            monthNum:
              mapping.monthNum !== -1
                ? parseInt(cols[mapping.monthNum]) || parseInt(date.split('-')[1], 10) || 1
                : parseInt(date.split('-')[1], 10) || 1,
            competency: mapping.competency !== -1 ? cols[mapping.competency] : '',
            establishment: mapping.establishment !== -1 ? cols[mapping.establishment] : '',
            primaryCategory: mapping.primaryCategory !== -1 ? cols[mapping.primaryCategory] : '',
            secondaryCategory:
              mapping.secondaryCategory !== -1 ? cols[mapping.secondaryCategory] : '',
            type: mapping.type !== -1 ? cols[mapping.type] : '',
            paymentMethod: mapping.paymentMethod !== -1 ? cols[mapping.paymentMethod] : '',
            value: val,
            comment: mapping.comment !== -1 ? cols[mapping.comment] : '',
            classification: mapping.classification !== -1 ? cols[mapping.classification] : '',
            who: mapping.who !== -1 ? cols[mapping.who] : '',
            installments:
              mapping.installments !== -1 ? parseInt(cols[mapping.installments]) || 1 : 1,
          })
        } catch (error: any) {
          errs.push(`Linha ${i + 1}: Erro ao processar dados - ${error.message}`)
        }
      }
      resolve({ parsed, errs })
    }
    reader.onerror = () => resolve({ parsed: [], errs: ['Erro ao ler o arquivo.'] })
    reader.readAsArrayBuffer(file)
  })
}
