import { useState } from 'react'
import {
  Experience, ExperienceType, ComidaTipo, RestauranteTipo, CompraTipo,
  typeLabels, comidaTipoLabels, restauranteTipoLabels, compraTipoLabels
} from '../types'
import { Screen } from './Index'
import { ChevronLeft, X } from 'lucide-react'
import { showToast } from '../components/AppToast'

interface Props {
  onNavigate: (s: Screen) => void
  onSave: (exp: Experience) => void
}

const RESTAURANTE_TIPOS: RestauranteTipo[] = ['pizzaria', 'arabe', 'fastfood', 'japones', 'frutos-do-mar', 'brasileiro', 'italiano', 'outro']
const SUGGESTED_TAGS = ['date', 'caro', 'favorito', 'horrível', 'não comprar', 'vale voltar', 'delivery', 'especial']

export function NewExperiencePage({ onNavigate, onSave }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [type, setType] = useState<ExperienceType | ''>('')
  const [comidaTipo, setComidaTipo] = useState<ComidaTipo | ''>('')
  const [restauranteTipo, setRestauranteTipo] = useState<RestauranteTipo | ''>('')
  const [isDelivery, setIsDelivery] = useState(false)
  const [isCaranguejo, setIsCaranguejo] = useState(false)
  const [compraTipo, setCompraTipo] = useState<CompraTipo | ''>('')
  const [nocinema, setNocinema] = useState(false)
  const [name, setName] = useState('')
  const [date, setDate] = useState(today)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const addTag = (t: string) => {
    const clean = t.trim().toLowerCase()
    if (clean && !tags.includes(clean)) setTags(prev => [...prev, clean])
    setTagInput('')
  }

  const removeTag = (t: string) => setTags(prev => prev.filter(x => x !== t))

  const handleSubmit = () => {
    if (!type) return showToast('Selecione o tipo de experiência')
    if (!name.trim()) return showToast('Informe o nome')
    if (type === 'comida' && !comidaTipo) return showToast('Selecione o tipo de comida')
    if (type === 'compra' && !compraTipo) return showToast('Selecione o tipo de compra')

    const exp: Experience = {
      id: crypto.randomUUID(),
      type: type as ExperienceType,
      name: name.trim(),
      date,
      tags,
      status: 'pendente',
      createdAt: new Date().toISOString(),
      ...(type === 'comida' && {
        comidaTipo: comidaTipo as ComidaTipo,
        ...(comidaTipo === 'restaurante' && {
          restauranteTipo: restauranteTipo as RestauranteTipo || undefined,
          isDelivery,
          isCaranguejo: isCaranguejo && restauranteTipo === 'frutos-do-mar',
        }),
      }),
      ...(type === 'compra' && {
        compraTipo: compraTipo as CompraTipo,
        ...(compraTipo === 'mercado' && { produtoNome: name.trim() }),
      }),
      ...(type === 'filme' && { nocinema }),
    }

    onSave(exp)
    showToast('Experiência registrada!')
    onNavigate('pending')
  }

  return (
    <>
      <div className="screen-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          <ChevronLeft size={20} />
        </button>
        <h2>Nova Experiência</h2>
        <div className="header-spacer" />
      </div>

      <div className="screen-content">
        <div className="field-group">
          <label className="field-label">O que foi?</label>
          <div className="chip-row">
            {(['comida', 'filme', 'compra'] as ExperienceType[]).map(t => (
              <button
                key={t}
                type="button"
                className={`chip ${type === t ? 'chip-active' : ''}`}
                onClick={() => { setType(t); setComidaTipo(''); setCompraTipo('') }}
              >
                {typeLabels[t]}
              </button>
            ))}
          </div>
        </div>

        {type === 'comida' && (
          <div className="field-group">
            <label className="field-label">Tipo</label>
            <div className="chip-row">
              {(['gelateria', 'cafeteria', 'restaurante'] as ComidaTipo[]).map(t => (
                <button
                  key={t}
                  type="button"
                  className={`chip ${comidaTipo === t ? 'chip-active' : ''}`}
                  onClick={() => setComidaTipo(t)}
                >
                  {comidaTipoLabels[t]}
                </button>
              ))}
            </div>
          </div>
        )}

        {type === 'comida' && comidaTipo === 'restaurante' && (
          <>
            <div className="field-group">
              <label className="field-label">Culinária <span className="field-optional">(opcional)</span></label>
              <div className="chip-row chip-row-wrap">
                {RESTAURANTE_TIPOS.map(t => (
                  <button
                    key={t}
                    type="button"
                    className={`chip ${restauranteTipo === t ? 'chip-active' : ''}`}
                    onClick={() => setRestauranteTipo(t)}
                  >
                    {restauranteTipoLabels[t]}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-group">
              <div className="toggle-row">
                <div>
                  <div className="toggle-label">Delivery</div>
                  <div className="toggle-desc">Pedido por app ou telefone</div>
                </div>
                <button
                  type="button"
                  className={`toggle-btn ${isDelivery ? 'toggle-on' : ''}`}
                  onClick={() => setIsDelivery(v => !v)}
                >
                  <div className="toggle-thumb" />
                </button>
              </div>
            </div>

            {restauranteTipo === 'frutos-do-mar' && (
              <div className="field-group">
                <div className="toggle-row">
                  <div>
                    <div className="toggle-label">Tinha caranguejo?</div>
                    <div className="toggle-desc">Ativa critérios extras</div>
                  </div>
                  <button
                    type="button"
                    className={`toggle-btn ${isCaranguejo ? 'toggle-on' : ''}`}
                    onClick={() => setIsCaranguejo(v => !v)}
                  >
                    <div className="toggle-thumb" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {type === 'compra' && (
          <div className="field-group">
            <label className="field-label">Tipo</label>
            <div className="chip-row">
              {(['mercado', 'jogo'] as CompraTipo[]).map(t => (
                <button
                  key={t}
                  type="button"
                  className={`chip ${compraTipo === t ? 'chip-active' : ''}`}
                  onClick={() => setCompraTipo(t)}
                >
                  {compraTipoLabels[t]}
                </button>
              ))}
            </div>
          </div>
        )}

        {type === 'filme' && (
          <div className="field-group">
            <div className="toggle-row">
              <div>
                <div className="toggle-label">No cinema</div>
                <div className="toggle-desc">Assistiram na sala de cinema</div>
              </div>
              <button
                type="button"
                className={`toggle-btn ${nocinema ? 'toggle-on' : ''}`}
                onClick={() => setNocinema(v => !v)}
              >
                <div className="toggle-thumb" />
              </button>
            </div>
          </div>
        )}

        <div className="field-group">
          <label className="field-label">
            {type === 'compra' && compraTipo === 'mercado' ? 'Nome do produto' :
             type === 'filme' ? 'Nome do filme' :
             'Nome do lugar'}
          </label>
          <input
            className="field-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={
              type === 'compra' && compraTipo === 'mercado' ? 'Ex: Café Pilão, Energético Monster...' :
              type === 'filme' ? 'Ex: Duna, Divertida Mente...' :
              'Ex: Gelateria Fantasia, Sushi do Bairro...'
            }
          />
        </div>

        <div className="field-group">
          <label className="field-label">Data</label>
          <input
            className="field-input"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label className="field-label">Tags <span className="field-optional">(opcional)</span></label>
          <div className="chip-row chip-row-wrap" style={{ marginBottom: 8 }}>
            {SUGGESTED_TAGS.map(t => (
              <button
                key={t}
                type="button"
                className={`chip chip-sm ${tags.includes(t) ? 'chip-active' : ''}`}
                onClick={() => tags.includes(t) ? removeTag(t) : addTag(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="tag-input-row">
            <input
              className="field-input"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              placeholder="Adicionar tag..."
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput) } }}
            />
            <button type="button" className="btn btn-outline btn-sm" onClick={() => addTag(tagInput)}>
              +
            </button>
          </div>
          {tags.length > 0 && (
            <div className="tags-display">
              {tags.map(t => (
                <span key={t} className="tag-badge">
                  {t}
                  <button onClick={() => removeTag(t)}><X size={10} /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button className="btn btn-primary" onClick={handleSubmit} style={{ marginTop: 8 }}>
          Salvar Experiência
        </button>
      </div>
    </>
  )
}
