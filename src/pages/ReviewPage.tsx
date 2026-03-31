import { useState } from 'react'
import { Experience, Review, UserName, getExperienceCriteria, calcAverage } from '../types'
import { Screen } from './Index'
import { ChevronLeft, X } from 'lucide-react'
import { StarRating } from '../components/StarRating'
import { showToast } from '../components/AppToast'
import { ExperienceChip } from '../components/ExperienceChip'

interface Props {
  experience: Experience
  reviews: Review[]
  currentUser: UserName
  onNavigate: (s: Screen) => void
  onSave: (r: Review) => void
}

const SUGGESTED_TAGS = ['date', 'caro', 'favorito', 'horrível', 'não comprar', 'vale voltar', 'delivery', 'especial']

export function ReviewPage({ experience, reviews, currentUser, onNavigate, onSave }: Props) {
  const criteria = getExperienceCriteria(experience)
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [comments, setComments] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)

  const alreadyReviewed = reviews.some(
    r => r.experienceId === experience.id && r.userName === currentUser
  )

  if (alreadyReviewed) {
    return (
      <>
        <div className="screen-header">
          <button className="back-btn" onClick={() => onNavigate('pending')}>
            <ChevronLeft size={20} />
          </button>
          <h2>Avaliar</h2>
          <div className="header-spacer" />
        </div>
        <div className="screen-content">
          <div className="empty-state">
            <p>Você já avaliou esta experiência!</p>
            <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={() => onNavigate('pending')}>
              Voltar
            </button>
          </div>
        </div>
      </>
    )
  }

  const addTag = (t: string) => {
    const clean = t.trim().toLowerCase()
    if (clean && !tags.includes(clean)) setTags(prev => [...prev, clean])
    setTagInput('')
  }

  const removeTag = (t: string) => setTags(prev => prev.filter(x => x !== t))

  const handleSave = async () => {
    const missing = criteria.filter(c => !ratings[c.key] || ratings[c.key] === 0)
    if (missing.length > 0) return showToast('Avalie todos os critérios!')

    setSaving(true)
    const review: Review = {
      id: crypto.randomUUID(),
      experienceId: experience.id,
      userName: currentUser,
      ratings,
      average: calcAverage(ratings),
      comments: comments.trim() || null,
      tags,
      createdAt: new Date().toISOString(),
    }
    onSave(review)
    setSaving(false)
    showToast('Avaliação salva!')
    onNavigate('feed')
  }

  const formatDate = (d: string, unknown?: boolean) => {
    if (unknown || !d) return null
    try {
      return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
      })
    } catch { return null }
  }

  const dateStr = formatDate(experience.date, experience.dateUnknown)

  return (
    <>
      <div className="screen-header">
        <button className="back-btn" onClick={() => onNavigate('pending')}>
          <ChevronLeft size={20} />
        </button>
        <h2>Avaliar</h2>
        <div className="header-spacer" />
      </div>

      <div className="screen-content">
        <div className="review-exp-header">
          <ExperienceChip experience={experience} />
          <div className="review-exp-name">{experience.name}</div>
          {dateStr && <div className="review-exp-date">{dateStr}</div>}
        </div>

        <div className="criteria-list">
          {criteria.map(c => (
            <div key={c.key} className="criteria-row">
              <span className="criteria-label">{c.label}</span>
              <StarRating
                value={ratings[c.key] || 0}
                onChange={val => setRatings(prev => ({ ...prev, [c.key]: val }))}
              />
            </div>
          ))}
        </div>

        <div className="field-group" style={{ marginTop: 8 }}>
          <label className="field-label">Comentário <span className="field-optional">(opcional)</span></label>
          <textarea
            className="field-input field-textarea"
            value={comments}
            onChange={e => setComments(e.target.value)}
            placeholder="O que achou? Vale a pena voltar?"
            rows={3}
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

        <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ marginTop: 8 }}>
          {saving ? 'Salvando...' : 'Salvar Avaliação'}
        </button>
      </div>
    </>
  )
}
