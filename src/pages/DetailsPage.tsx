import { Experience, Review, UserName, getExperienceCriteria } from '../types'
import { Screen } from './Index'
import { ChevronLeft, Trash2, Calendar } from 'lucide-react'
import { showToast } from '../components/AppToast'
import { ExperienceChip } from '../components/ExperienceChip'

interface Props {
  experience: Experience
  reviews: Review[]
  currentUser: UserName
  onNavigate: (s: Screen) => void
  onDeleteReview: (id: string) => void
  onDeleteExperience: (id: string) => void
}

export function DetailsPage({ experience, reviews, currentUser, onNavigate, onDeleteReview, onDeleteExperience }: Props) {
  const expReviews = reviews.filter(r => r.experienceId === experience.id)
  const criteria = getExperienceCriteria(experience)

  const handleDeleteReview = (id: string) => {
    if (!confirm('Excluir sua avaliação?')) return
    onDeleteReview(id)
    showToast('Avaliação excluída')
    onNavigate('feed')
  }

  const handleDeleteExp = () => {
    if (!confirm('Excluir esta experiência e todas as avaliações?')) return
    onDeleteExperience(experience.id)
    showToast('Experiência excluída')
    onNavigate('feed')
  }

  const formatDate = (d: string) => {
    try {
      return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
      })
    } catch { return d }
  }

  const combined = expReviews.length > 0
    ? Math.round(expReviews.reduce((s, r) => s + r.average, 0) / expReviews.length * 10) / 10
    : null

  return (
    <>
      <div className="screen-header">
        <button className="back-btn" onClick={() => onNavigate('feed')}>
          <ChevronLeft size={20} />
        </button>
        <h2 style={{ fontSize: 18 }}>{experience.name}</h2>
        <button className="icon-btn icon-btn-danger" onClick={handleDeleteExp}>
          <Trash2 size={16} />
        </button>
      </div>

      <div className="screen-content">
        <div className="details-hero">
          <ExperienceChip experience={experience} large />
          <h1 className="details-name">{experience.name}</h1>
          <div className="details-meta">
            <span><Calendar size={13} /> {formatDate(experience.date)}</span>
          </div>
          {combined !== null && (
            <div className="details-combined-score">
              <span className="details-score-num">{combined}</span>
              <span className="details-score-star">★</span>
              <span className="details-score-label">média do casal</span>
            </div>
          )}
          {experience.tags.length > 0 && (
            <div className="mini-tags" style={{ justifyContent: 'center', marginTop: 8 }}>
              {experience.tags.map(t => <span key={t} className="mini-tag">{t}</span>)}
            </div>
          )}
        </div>

        {expReviews.length === 0 && (
          <div className="empty-state">
            <p>Nenhuma avaliação ainda.</p>
          </div>
        )}

        {expReviews.map(review => {
          const isOwn = review.userName === currentUser
          return (
            <div key={review.id} className="review-block">
              <div className="review-block-header">
                <div className="review-user-info">
                  <div className={`avatar-sm avatar-${review.userName}`} />
                  <span className="review-user-name">{review.userName === 'livia' ? 'Lívia' : 'Camila'}</span>
                </div>
                <div className="review-block-right">
                  <div className="review-avg">{review.average} ★</div>
                  {isOwn && (
                    <button className="icon-btn icon-btn-danger" onClick={() => handleDeleteReview(review.id)}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="rating-rows">
                {criteria.map(c => (
                  <div key={c.key} className="rating-row">
                    <span className="rating-row-label">{c.label}</span>
                    <div className="mini-stars">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className={`mini-star ${i <= (review.ratings[c.key] || 0) ? 'filled' : ''}`}>★</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {review.comments && (
                <div className="review-comment">"{review.comments}"</div>
              )}
            </div>
          )
        })}

        {expReviews.length < 2 && (
          <div className="waiting-hint">Aguardando a outra avaliar...</div>
        )}
      </div>
    </>
  )
}
