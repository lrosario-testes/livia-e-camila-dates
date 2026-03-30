import { Experience, typeLabels, comidaTipoLabels, compraTipoLabels } from '../types'
import { IceCream, Coffee, Utensils, Film, ShoppingBag, Gamepad2, Truck } from 'lucide-react'

interface Props {
  experience: Experience
  large?: boolean
}

function getIcon(exp: Experience) {
  if (exp.type === 'filme') return <Film size={14} />
  if (exp.type === 'compra') {
    return exp.compraTipo === 'jogo' ? <Gamepad2 size={14} /> : <ShoppingBag size={14} />
  }
  if (exp.comidaTipo === 'gelateria') return <IceCream size={14} />
  if (exp.comidaTipo === 'cafeteria') return <Coffee size={14} />
  return <Utensils size={14} />
}

function getLabel(exp: Experience) {
  if (exp.type === 'filme') return 'Filme'
  if (exp.type === 'compra') return compraTipoLabels[exp.compraTipo!] || 'Compra'
  if (exp.comidaTipo) {
    const base = comidaTipoLabels[exp.comidaTipo]
    if (exp.comidaTipo === 'restaurante' && exp.isDelivery) return `${base} · Delivery`
    return base
  }
  return typeLabels[exp.type]
}

function getColor(exp: Experience): string {
  if (exp.type === 'filme') return 'chip-filme'
  if (exp.type === 'compra') return 'chip-compra'
  if (exp.comidaTipo === 'gelateria') return 'chip-gelateria'
  if (exp.comidaTipo === 'cafeteria') return 'chip-cafeteria'
  return 'chip-restaurante'
}

export function ExperienceChip({ experience, large }: Props) {
  return (
    <div className={`exp-chip ${getColor(experience)} ${large ? 'exp-chip-lg' : ''}`}>
      {getIcon(experience)}
      <span>{getLabel(experience)}</span>
      {experience.isDelivery && experience.type === 'comida' && experience.comidaTipo === 'restaurante' && (
        <Truck size={11} />
      )}
    </div>
  )
}
