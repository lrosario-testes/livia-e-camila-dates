export type UserName = 'livia' | 'camila'

export type ExperienceType = 'comida' | 'filme' | 'compra'
export type ComidaTipo = 'gelateria' | 'cafeteria' | 'restaurante'
export type RestauranteTipo =
  | 'pizzaria' | 'arabe' | 'fastfood' | 'japones' | 'frutos-do-mar' | 'brasileiro' | 'italiano' | 'outro'
export type CompraTipo = 'mercado' | 'jogo'
export type ExperienceStatus = 'pendente' | 'avaliada'

export interface RatingCriterion {
  key: string
  label: string
}

export const criteriosGelateria: RatingCriterion[] = [
  { key: 'sabor', label: 'Sabor' },
  { key: 'textura', label: 'Textura' },
  { key: 'equilibrio', label: 'Equilíbrio' },
  { key: 'casquinha', label: 'Casquinha' },
]

export const criteriosCafeteria: RatingCriterion[] = [
  { key: 'sabor', label: 'Sabor' },
  { key: 'atendimento', label: 'Atendimento' },
  { key: 'ambiente', label: 'Ambiente' },
  { key: 'custoBeneficio', label: 'Custo-Benefício' },
]

export const criteriosRestaurante: RatingCriterion[] = [
  { key: 'sabor', label: 'Sabor' },
  { key: 'atendimento', label: 'Atendimento' },
  { key: 'custoBeneficio', label: 'Custo-Benefício' },
  { key: 'ambiente', label: 'Ambiente' },
]

export const criteriosRestauranteDelivery: RatingCriterion[] = [
  { key: 'sabor', label: 'Sabor' },
  { key: 'custoBeneficio', label: 'Custo-Benefício' },
  { key: 'tempoEntrega', label: 'Tempo de Entrega' },
  { key: 'embalagem', label: 'Embalagem' },
]

export const criteriosCaranguejo: RatingCriterion[] = [
  { key: 'ponto', label: 'Ponto do Caranguejo' },
  { key: 'facilidadeComer', label: 'Facilidade de Comer' },
  { key: 'acompanhamento', label: 'Acompanhamento' },
]

export const criteriosFilme: RatingCriterion[] = [
  { key: 'geral', label: 'Avaliação Geral' },
]

export const criteriosCompra: RatingCriterion[] = [
  { key: 'sabor', label: 'Sabor' },
  { key: 'custoBeneficio', label: 'Custo-Benefício' },
]

export const criteriosJogo: RatingCriterion[] = [
  { key: 'diversao', label: 'Diversão' },
  { key: 'rejogabilidade', label: 'Rejogabilidade' },
  { key: 'complexidade', label: 'Complexidade' },
]

export interface Experience {
  id: string
  type: ExperienceType
  comidaTipo?: ComidaTipo
  restauranteTipo?: RestauranteTipo
  isDelivery?: boolean
  isCaranguejo?: boolean
  compraTipo?: CompraTipo
  produtoNome?: string
  nocinema?: boolean
  name: string
  date: string
  dateUnknown?: boolean
  tags: string[]
  status: ExperienceStatus
  createdAt: string
}

export interface Review {
  id: string
  experienceId: string
  userName: UserName
  ratings: Record<string, number>
  average: number
  comments: string | null
  tags: string[]
  createdAt: string
}

export const USER_PASSWORDS: Record<UserName, string> = {
  livia: 'livia123',
  camila: 'camila123',
}

export function getComidaCriteria(exp: Experience): RatingCriterion[] {
  if (exp.comidaTipo === 'gelateria') return criteriosGelateria
  if (exp.comidaTipo === 'cafeteria') return criteriosCafeteria
  const base = exp.isDelivery ? criteriosRestauranteDelivery : criteriosRestaurante
  if (exp.isCaranguejo) return [...base, ...criteriosCaranguejo]
  return base
}

export function getExperienceCriteria(exp: Experience): RatingCriterion[] {
  if (exp.type === 'filme') return criteriosFilme
  if (exp.type === 'compra') {
    if (exp.compraTipo === 'jogo') return criteriosJogo
    return criteriosCompra
  }
  return getComidaCriteria(exp)
}

export function calcAverage(ratings: Record<string, number>): number {
  const vals = Object.values(ratings).filter(v => v > 0)
  if (vals.length === 0) return 0
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
}

export const typeLabels: Record<ExperienceType, string> = {
  comida: 'Comida',
  filme: 'Filme',
  compra: 'Compra',
}

export const comidaTipoLabels: Record<ComidaTipo, string> = {
  gelateria: 'Gelateria',
  cafeteria: 'Cafeteria',
  restaurante: 'Restaurante',
}

export const restauranteTipoLabels: Record<RestauranteTipo, string> = {
  pizzaria: 'Pizzaria',
  arabe: 'Árabe',
  fastfood: 'Fast Food',
  japones: 'Japonês',
  'frutos-do-mar': 'Frutos do Mar',
  brasileiro: 'Brasileiro',
  italiano: 'Italiano',
  outro: 'Outro',
}

export const compraTipoLabels: Record<CompraTipo, string> = {
  mercado: 'Mercado',
  jogo: 'Jogo',
}
