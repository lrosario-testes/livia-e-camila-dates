import { useState, useEffect } from 'react'
import {
  Experience, ExperienceType, ComidaTipo, RestauranteTipo, CompraTipo,
  typeLabels, comidaTipoLabels, restauranteTipoLabels, compraTipoLabels
} from '../types'
import { Screen } from './Index'
import { ChevronLeft } from 'lucide-react'
import { showToast } from '../components/AppToast'

interface Props {
  onNavigate: (s: Screen) => void
  onSave: (exp: Experience) => void
  active: boolean
}

const RESTAURANTE_TIPOS: RestauranteTipo[] = ['pizzaria', 'arabe', 'fastfood', 'japones', 'frutos-do-mar', 'brasileiro', 'italiano', 'outro']

export function NewExperiencePage({ onNavigate, onSave, active }: Props) {
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
  const [dateUnknown, setDateUnknown] = useState(false)

  // Reset form when screen becomes active
  useEffect(() => {
    if (active) {
      setType('')
      setComidaTipo('')
      setRestauranteTipo('')
      setIsDelivery(false)
      setIsCaranguejo(false)
      setCompraTipo('')
      setNocinema(false)
      setName('')
      setDate(new Date().toISOString().split('T')[0])
      setDateUnknown(false)
    }
  }, [active])

  const isJogo = type === 'compra' && compraTipo === 'jogo'

  const handleSubmit = () => {
    if (!type) return showToast('Selecione o tipo de experiência')
    if (!name.trim()) return showToast('Informe o nome')
    if (type === 'comida' && !comidaTipo) return showToast('Selecione o tipo de comida')
    if (type === 'compra' && !compraTipo) return showToast('Selecione o tipo de compra')

    const exp: Experience = {
      id: crypto.randomUUID(),
      type: type as ExperienceType,
      name: name.trim(),
      date: isJogo || dateUnknown ? '' : date,
      dateUnknown: isJogo || dateUnknown,
      tags: [],
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
        ...(compraTipo === 'jogo' && { produtoNome: name.trim() }),
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
            {isJogo ? 'Nome do jogo' :
             type === 'compra' && compraTipo === 'mercado' ? 'Nome do produto' :
             type === 'filme' ? 'Nome do filme' :
             'Nome do lugar'}
          </label>
          <input
            className="field-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={
              isJogo ? 'Ex: Catan, Dixit, Uno...' :
              type === 'compra' && compraTipo === 'mercado' ? 'Ex: Café Pilão, Energético Monster...' :
              type === 'filme' ? 'Ex: Duna, Divertida Mente...' :
              'Ex: Gelateria Fantasia, Sushi do Bairro...'
            }
          />
        </div>

        {!isJogo && (
          <div className="field-group">
            <label className="field-label">Data</label>
            {!dateUnknown && (
              <input
                className="field-input"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            )}
            <div className="toggle-row" style={{ marginTop: 8 }}>
              <div>
                <div className="toggle-label">Não lembro a data</div>
              </div>
              <button
                type="button"
                className={`toggle-btn ${dateUnknown ? 'toggle-on' : ''}`}
                onClick={() => setDateUnknown(v => !v)}
              >
                <div className="toggle-thumb" />
              </button>
            </div>
          </div>
        )}

        <button className="btn btn-primary" onClick={handleSubmit} style={{ marginTop: 8 }}>
          Salvar Experiência
        </button>
      </div>
    </>
  )
}
