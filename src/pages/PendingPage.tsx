import { Experience, Review, UserName } from '../types'
import { Screen } from './Index'
import { ChevronLeft, Clock, Trash2 } from 'lucide-react'
import { ExperienceChip } from '../components/ExperienceChip'
import { showToast } from '../components/AppToast'

interface Props {
  experiences: Experience[]
  reviews: Review[]
  currentUser: UserName
  onNavigate: (s: Screen) => void
  onSelectExp: (exp: Experience) => void
  onDeleteExperience: (id: string) => void
}

export function PendingPage({ experiences, reviews, currentUser, onNavigate, onSelectExp, onDeleteExperience }: Props) {
  const pending = experiences.filter(exp => {
    const myReview = reviews.find(r => r.experienceId === exp.id && r.userName === currentUser)
    return !myReview
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const formatDate = (d: string, unknown?: boolean) => {
    if (unknown || !d) return 'Sem data'
    try {
      return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    } catch { return d }
  }

  const handleDelete = (e: React.MouseEvent, exp: Experience) => {
    e.stopPropagation()
    if (!confirm(`Excluir "${exp.name}" e todas as avaliações?`)) return
    onDeleteExperience(exp.id)
    showToast('Experiência excluída')
  }

  return (
    <>
      <div className="screen-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          <ChevronLeft size={20} />
        </button>
        <h2>Para Avaliar</h2>
        <div className="header-spacer" />
      </div>

      <div className="screen-content">
        {pending.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Clock size={32} /></div>
            <p>Tudo avaliado! Nenhuma pendência.</p>
            <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={() => onNavigate('new-experience')}>
              Adicionar experiência
            </button>
          </div>
        ) : (
          <>
            <p className="page-hint">{pending.length} experiência{pending.length !== 1 ? 's' : ''} aguardando sua avaliação</p>
            <div className="card-list">
              {pending.map(exp => {
                const otherReviewed = reviews.some(r => r.experienceId === exp.id && r.userName !== currentUser)
                return (
                  <div key={exp.id} className="pending-card" onClick={() => onSelectExp(exp)}>
                    <div className="pending-card-left">
                      <ExperienceChip experience={exp} />
                      <div className="pending-card-name">{exp.name}</div>
                      <div className="pending-card-date">
                        {formatDate(exp.date, exp.dateUnknown)}
                      </div>
                    </div>
                    <div className="pending-card-right">
                      {otherReviewed && <div className="other-reviewed-dot" title="A outra já avaliou" />}
                      <button
                        className="icon-btn icon-btn-danger"
                        onClick={(e) => handleDelete(e, exp)}
                        style={{ marginRight: 4 }}
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="pending-cta">Avaliar</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </>
  )
}
