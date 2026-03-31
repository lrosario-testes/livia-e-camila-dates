import { useState } from 'react'
import { Experience, Review, ExperienceType, typeLabels } from '../types'
import { Screen } from './Index'
import { ChevronLeft } from 'lucide-react'
import { ExperienceChip } from '../components/ExperienceChip'

interface Props {
  experiences: Experience[]
  reviews: Review[]
  onNavigate: (s: Screen) => void
  onSelectExp: (exp: Experience) => void
}

type Filter = 'all' | ExperienceType

export function FeedPage({ experiences, reviews, onNavigate, onSelectExp }: Props) {
  const [filter, setFilter] = useState<Filter>('all')

  const evaluated = experiences.filter(exp =>
    reviews.some(r => r.experienceId === exp.id)
  )

  const filtered = filter === 'all'
    ? evaluated
    : evaluated.filter(e => e.type === filter)

  const sorted = [...filtered].sort((a, b) => {
    // Items without dates go to the end
    if (a.dateUnknown && !b.dateUnknown) return 1
    if (!a.dateUnknown && b.dateUnknown) return -1
    return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
  })

  const getExpReviews = (expId: string) => reviews.filter(r => r.experienceId === expId)

  const avgOf = (rs: Review[]) => {
    if (rs.length === 0) return null
    const avg = rs.reduce((s, r) => s + r.average, 0) / rs.length
    return Math.round(avg * 10) / 10
  }

  const formatDate = (d: string, unknown?: boolean) => {
    if (unknown || !d) return 'Sem data'
    try {
      return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
      })
    } catch { return d }
  }

  // Collect all tags from reviews for each experience
  const getExpTags = (expId: string) => {
    const expRevs = reviews.filter(r => r.experienceId === expId)
    const allTags = new Set<string>()
    expRevs.forEach(r => (r.tags || []).forEach(t => allTags.add(t)))
    return Array.from(allTags)
  }

  return (
    <>
      <div className="screen-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          <ChevronLeft size={20} />
        </button>
        <h2>Feed</h2>
        <div className="header-spacer" />
      </div>

      <div className="screen-content">
        <div className="filter-chips">
          {(['all', 'comida', 'filme', 'compra'] as Filter[]).map(f => (
            <button
              key={f}
              className={`chip chip-sm ${filter === f ? 'chip-active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Tudo' : typeLabels[f as ExperienceType]}
            </button>
          ))}
        </div>

        {sorted.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><ChevronLeft size={32} /></div>
            <p>Nenhuma experiência avaliada ainda.</p>
            <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={() => onNavigate('pending')}>
              Ver pendentes
            </button>
          </div>
        ) : (
          <div className="feed-list">
            {sorted.map(exp => {
              const expRevs = getExpReviews(exp.id)
              const combined = avgOf(expRevs)
              const bothReviewed = expRevs.length >= 2
              const expTags = getExpTags(exp.id)

              return (
                <div key={exp.id} className="feed-card" onClick={() => onSelectExp(exp)}>
                  <div className="feed-card-top">
                    <ExperienceChip experience={exp} />
                    {combined !== null && (
                      <div className="feed-card-score">
                        <span className="score-num">{combined}</span>
                        <span className="score-star">★</span>
                      </div>
                    )}
                  </div>

                  <div className="feed-card-name">{exp.name}</div>
                  <div className="feed-card-date">{formatDate(exp.date, exp.dateUnknown)}</div>

                  <div className="feed-card-users">
                    {expRevs.map(r => (
                      <div key={r.id} className="feed-user-row">
                        <div className={`avatar-xs avatar-${r.userName}`} />
                        <span className="feed-user-name">{r.userName === 'livia' ? 'Lívia' : 'Camila'}</span>
                        <span className="feed-user-score">{r.average} ★</span>
                      </div>
                    ))}
                    {!bothReviewed && (
                      <div className="feed-pending-hint">Aguardando avaliação...</div>
                    )}
                  </div>

                  {expTags.length > 0 && (
                    <div className="mini-tags" style={{ marginTop: 8 }}>
                      {expTags.map(t => <span key={t} className="mini-tag">{t}</span>)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
