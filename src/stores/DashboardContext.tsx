import { createContext, useContext, useState, ReactNode } from 'react'
import { Expense, AppCategory } from '@/types'

export const INITIAL_CATEGORIES: AppCategory[] = [
  {
    id: 'cat_receitas',
    name: 'Receitas',
    color: 'hsl(150 84% 40%)',
    icon: 'TrendingUp',
    subcategories: [
      'Salário',
      '13º salário / férias',
      'PLR, Bônus e Outros',
      'Receita com imóveis',
      'Benera',
      'FF Assessoria',
      'Aluguel',
      'Pensão/Aposentadoria',
      'Outros',
    ],
  },
  {
    id: 'cat_investimentos',
    name: 'Investimentos',
    color: 'hsl(220 70% 50%)',
    icon: 'Landmark',
    subcategories: [
      'Reserva de Emergência',
      'Previdência/Aposentadoria',
      'Títulos de Renda Fixa',
      'Renda Variável',
      'Obras Imóvel',
      'Aquisição para o Imóvel',
      'Outros',
    ],
  },
  {
    id: 'cat_moradia',
    name: 'Moradia',
    color: 'hsl(262 83% 58%)',
    icon: 'Home',
    subcategories: [
      'Condomínio',
      'IPTU',
      'Financiamento da casa',
      'Seguro Residencial',
      'Diarista/Mensalista',
      'Lavanderia',
      'Streamings',
      'Luz',
      'Água',
      'Telefone/Celular',
      'Gás',
      'Internet/TV',
      'Manutenção',
      'Nuvem',
      'Jardim',
      'Outros',
    ],
  },
  {
    id: 'cat_transporte',
    name: 'Transporte',
    color: 'hsl(280 65% 60%)',
    icon: 'Car',
    subcategories: [
      'Seguro Automotivo',
      'IPVA',
      'Licenciamento',
      'Transporte Público',
      'Táxi/Uber/99',
      'Estacionamento',
      'Combustível',
      'Financiamento do Carro',
      'Lavagem',
      'Manutenção',
      'Multa',
      'Outros',
    ],
  },
  {
    id: 'cat_saude',
    name: 'Saúde',
    color: 'hsl(350 89% 60%)',
    icon: 'HeartPulse',
    subcategories: [
      'Plano de Saúde',
      'Seguro de Vida',
      'Medicamentos/Farmácia',
      'Tratamentos Diversos',
      'Dentista',
      'Saúde bucal',
      'Outros',
    ],
  },
  {
    id: 'cat_educacao',
    name: 'Educação',
    color: 'hsl(40 90% 50%)',
    icon: 'BookOpen',
    subcategories: [
      'Creche/Escola/Colégio',
      'Faculdade/Universidade',
      'Material Escolar',
      'Cursos Extras',
      'Inglês',
      'Espiritualidade',
      'Negócios',
      'Alimentação',
      'Transporte',
      'Outros',
    ],
  },
  {
    id: 'cat_alimentacao',
    name: 'Alimentação',
    color: 'hsl(25 95% 50%)',
    icon: 'Utensils',
    subcategories: [
      'Supermercado/Feira',
      'Feira',
      'Cafés e Restaurantes',
      'Café',
      'Snacks',
      'Cerveja',
      'Vinho',
      'Nespresso',
      'Padaria',
      'Outros',
    ],
  },
  {
    id: 'cat_pessoal',
    name: 'Pessoal',
    color: 'hsl(310 65% 60%)',
    icon: 'User',
    subcategories: [
      'Roupas e Acessórios',
      'Presentes',
      'Viagens',
      'Shows/Teatro',
      'Cinema',
      'Estética/Cosméticos',
      'Video Game',
      'Churrasco - família',
      'Futebol',
      'Futebol - Mensalidade',
      'Futebol - Churrasco',
      'Futebol - bebidas e churrasco',
      'Academia',
      'Manicure/Pedicure',
      'Cuidados com Cabelo e/ou Barba',
      'Alimentação Trabalho',
      'Seguro de vida',
      'Outros',
    ],
  },
  {
    id: 'cat_ferias',
    name: 'Férias',
    color: 'hsl(180 70% 40%)',
    icon: 'Palmtree',
    subcategories: [
      'Passagem',
      'Bares/Restaurantes',
      'Passeios',
      'Presentes',
      'Transporte',
      'Seguro',
      'Outros',
    ],
  },
  {
    id: 'cat_pets',
    name: 'Pets',
    color: 'hsl(25 60% 40%)',
    icon: 'Dog',
    subcategories: [
      'Plano de Saúde',
      'Petshop',
      'Creche',
      'Alimentação',
      'Brinquedos',
      'Areia',
      'Outros',
    ],
  },
  {
    id: 'cat_negocios',
    name: 'Negócios',
    color: 'hsl(210 50% 40%)',
    icon: 'Briefcase',
    subcategories: [
      'Benera',
      'Posicionamento marca',
      'Despesas',
      'Contabilidade',
      'Imposto',
      'Outros',
    ],
  },
  {
    id: 'cat_financas',
    name: 'Finanças',
    color: 'hsl(120 40% 40%)',
    icon: 'Receipt',
    subcategories: [
      'Contabilidade',
      'Juros',
      'Encargos',
      'Empréstimos',
      'CC',
      'IOF',
      'Mesada Filhos(as)',
      'Tarifa bancária',
      'Filantropia',
      'Outros',
    ],
  },
]

const INITIAL_EXPENSES: Expense[] = [
  {
    id: '100',
    date: '2024-03-01',
    monthNum: 3,
    competency: 'Mar',
    establishment: 'Empresa S.A',
    primaryCategory: 'Receitas',
    secondaryCategory: 'Salário',
    type: 'Receita',
    paymentMethod: 'Itaú',
    value: 12500.0,
    comment: 'Salário Mensal',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  {
    id: '101',
    date: '2024-03-10',
    monthNum: 3,
    competency: 'Mar',
    establishment: 'Imóvel Centro',
    primaryCategory: 'Receitas',
    secondaryCategory: 'Aluguel',
    type: 'Receita',
    paymentMethod: 'Itaú',
    value: 2500.0,
    comment: 'Aluguel recebido',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  {
    id: '1',
    date: '2024-03-02',
    monthNum: 3,
    competency: 'Mar',
    establishment: 'Carrefour',
    primaryCategory: 'Alimentação',
    secondaryCategory: 'Supermercado/Feira',
    type: 'Variável',
    paymentMethod: 'CC Itaú visa infinity',
    value: 850.5,
    comment: 'Compra do mês',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  {
    id: '2',
    date: '2024-03-05',
    monthNum: 3,
    competency: 'Mar',
    establishment: 'Uber',
    primaryCategory: 'Transporte',
    secondaryCategory: 'Táxi/Uber/99',
    type: 'Variável',
    paymentMethod: 'CC Nubank master',
    value: 55.0,
    comment: 'Volta do trabalho',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  {
    id: '3',
    date: '2024-03-10',
    monthNum: 3,
    competency: 'Mar',
    establishment: 'QuintoAndar',
    primaryCategory: 'Moradia',
    secondaryCategory: 'Condomínio',
    type: 'Fixa',
    paymentMethod: 'Itaú',
    value: 950.0,
    comment: 'Condomínio apto',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  {
    id: '4',
    date: '2024-03-12',
    monthNum: 3,
    competency: 'Mar',
    establishment: 'Netflix',
    primaryCategory: 'Moradia',
    secondaryCategory: 'Streamings',
    type: 'Fixa',
    paymentMethod: 'CC Nubank master',
    value: 55.9,
    comment: 'Assinatura',
    classification: 'Pessoal',
    who: 'Família',
  },
  {
    id: '5',
    date: '2024-03-15',
    monthNum: 3,
    competency: 'Mar',
    establishment: 'Drogasil',
    primaryCategory: 'Saúde',
    secondaryCategory: 'Medicamentos/Farmácia',
    type: 'Variável',
    paymentMethod: 'CC Itaú visa infinity',
    value: 125.9,
    comment: 'Remédios',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  {
    id: '6',
    date: '2024-03-18',
    monthNum: 3,
    competency: 'Mar',
    establishment: 'Enel',
    primaryCategory: 'Moradia',
    secondaryCategory: 'Luz',
    type: 'Variável',
    paymentMethod: 'Itaú',
    value: 210.0,
    comment: 'Luz fev',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  {
    id: '7',
    date: '2024-03-20',
    monthNum: 3,
    competency: 'Mar',
    establishment: 'Pecorino',
    primaryCategory: 'Alimentação',
    secondaryCategory: 'Cafés e Restaurantes',
    type: 'Variável',
    paymentMethod: 'CC Itaú visa infinity',
    value: 320.0,
    comment: 'Jantar',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  {
    id: '8',
    date: '2024-03-25',
    monthNum: 3,
    competency: 'Mar',
    establishment: 'Posto Ipiranga',
    primaryCategory: 'Transporte',
    secondaryCategory: 'Combustível',
    type: 'Variável',
    paymentMethod: 'CC Nubank master',
    value: 250.0,
    comment: 'Gasolina',
    classification: 'Pessoal',
    who: 'Fabio',
  },
  {
    id: '9',
    date: '2024-03-28',
    monthNum: 3,
    competency: 'Mar',
    establishment: 'SmartFit',
    primaryCategory: 'Pessoal',
    secondaryCategory: 'Academia',
    type: 'Fixa',
    paymentMethod: 'CC Nubank master',
    value: 120.0,
    comment: 'Mensalidade',
    classification: 'Pessoal',
    who: 'Fabio',
  },
]

interface DashboardContextType {
  categories: AppCategory[]
  expenses: Expense[]
  currentMonth: string
  setCurrentMonth: (m: string) => void
  selectedPrimaryCat: string | null
  setSelectedPrimaryCat: (id: string | null) => void
  selectedSecondaryCats: string[]
  toggleSecondaryCat: (name: string) => void
  addExpense: (e: Omit<Expense, 'id'>) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [categories] = useState<AppCategory[]>(INITIAL_CATEGORIES)
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES)
  const [currentMonth, setCurrentMonth] = useState('2024-03')
  const [selectedPrimaryCat, setSelectedPrimaryCat] = useState<string | null>(null)
  const [selectedSecondaryCats, setSelectedSecondaryCats] = useState<string[]>([])

  const toggleSecondaryCat = (name: string) => {
    setSelectedSecondaryCats((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    )
  }

  const handleSetPrimaryCat = (id: string | null) => {
    setSelectedPrimaryCat(id)
    setSelectedSecondaryCats([])
  }

  const addExpense = (e: Omit<Expense, 'id'>) => {
    const newExpense = { ...e, id: Date.now().toString() }
    setExpenses((prev) => [...prev, newExpense])
  }

  return (
    <DashboardContext.Provider
      value={{
        categories,
        expenses,
        currentMonth,
        setCurrentMonth,
        selectedPrimaryCat,
        setSelectedPrimaryCat: handleSetPrimaryCat,
        selectedSecondaryCats,
        toggleSecondaryCat,
        addExpense,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) throw new Error('useDashboard must be used within DashboardProvider')
  return context
}
