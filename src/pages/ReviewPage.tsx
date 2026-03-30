import { useState } from 'react'
import { Experience, Review, UserName, getExperienceCriteria, calcAverage } from '../types'
import { Screen } from './Index'
import { ChevronLeft } from 'lucide-react'
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

export function ReviewPage({ experience, reviews, currentUser, onNavigate, onSave }: Props) {
  const criteria = getExperienceCriteria(experience)
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [comments, setComments] = useState('')
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
      createdAt: new Date().toISOString(),
    }
    onSave(review)
    setSaving(false)
    showToast('Avaliação salva!')
    onNavigate('feed')
  }

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
          <div className="review-exp-date">
            {new Date(experience.date + 'T12:00:00').toLocaleDateString('pt-BR', {
              day: '2-digit', month: 'long', year: 'numeric'
            })}
          </div>
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

        <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ marginTop: 8 }}>
          {saving ? 'Salvando...' : 'Salvar Avaliação'}
        </button>
      </div>
    </>
  )
}
