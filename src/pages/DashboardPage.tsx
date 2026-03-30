import { Experience, Review, ExperienceType, typeLabels } from '../types'
import { Screen } from './Index'
import { ChevronLeft, TrendingUp, Award, ThumbsDown, BarChart2 } from 'lucide-react'
import { useState } from 'react'

interface Props {
  experiences: Experience[]
  reviews: Review[]
  onNavigate: (s: Screen) => void
}

export function DashboardPage({ experiences, reviews, onNavigate }: Props) {
  const [tab, setTab] = useState<'geral' | 'ranking'>('geral')

  const getAvg = (expId: string) => {
    const rs = reviews.filter(r => r.experienceId === expId)
    if (rs.length === 0) return null
    return Math.round(rs.reduce((s, r) => s + r.average, 0) / rs.length * 10) / 10
  }

  const evaluated = experiences.filter(e => reviews.some(r => r.experienceId === e.id))

  const withAvg = evaluated
    .map(e => ({ exp: e, avg: getAvg(e.id)! }))
    .filter(x => x.avg !== null)
    .sort((a, b) => b.avg - a.avg)

  const best = withAvg[0] || null
  const worst = [...withAvg].sort((a, b) => a.avg - b.avg)[0] || null

  const totalReviews = reviews.length
  const avgGeral = totalReviews === 0 ? null :
    Math.round(reviews.reduce((s, r) => s + r.average, 0) / totalReviews * 10) / 10

  const byType = (['comida', 'filme', 'compra'] as ExperienceType[]).map(type => {
    const exps = evaluated.filter(e => e.type === type)
    const count = exps.length
    const avg = count === 0 ? null : Math.round(
      exps.map(e => getAvg(e.id)!).filter(v => v != null).reduce((a, b) => a + b, 0) / count * 10
    ) / 10
    return { type, count, avg }
  })

  const liviaAvg = reviews.filter(r => r.userName === 'livia').length > 0
    ? Math.round(reviews.filter(r => r.userName === 'livia').reduce((s, r) => s + r.average, 0) /
      reviews.filter(r => r.userName === 'livia').length * 10) / 10
    : null

  const camilaAvg = reviews.filter(r => r.userName === 'camila').length > 0
    ? Math.round(reviews.filter(r => r.userName === 'camila').reduce((s, r) => s + r.average, 0) /
      reviews.filter(r => r.userName === 'camila').length * 10) / 10
    : null

  return (
    <>
      <div className="screen-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          <ChevronLeft size={20} />
        </button>
        <h2>Dashboard</h2>
        <div className="header-spacer" />
      </div>

      <div className="screen-content">
        <div className="tab-row">
          <button className={`tab-btn ${tab === 'geral' ? 'tab-active' : ''}`} onClick={() => setTab('geral')}>
            <BarChart2 size={15} /> Geral
          </button>
          <button className={`tab-btn ${tab === 'ranking' ? 'tab-active' : ''}`} onClick={() => setTab('ranking')}>
            <Award size={15} /> Ranking
          </button>
        </div>

        {tab === 'geral' && (
          <>
            <div className="stats-grid">
              <div className="stat-block">
                <div className="stat-val">{evaluated.length}</div>
                <div className="stat-lbl">avaliadas</div>
              </div>
              <div className="stat-block">
                <div className="stat-val">{avgGeral ?? '—'}</div>
                <div className="stat-lbl">média geral</div>
              </div>
              <div className="stat-block">
                <div className="stat-val">{experiences.filter(e => e.status === 'pendente').length}</div>
                <div className="stat-lbl">pendentes</div>
              </div>
            </div>

            <div className="section-title">Por categoria</div>
            <div className="type-rows">
              {byType.map(({ type, count, avg }) => (
                <div key={type} className="type-row">
                  <span className="type-row-label">{typeLabels[type]}</span>
                  <div className="type-row-bar-wrap">
                    <div
                      className="type-row-bar"
                      style={{ width: evaluated.length > 0 ? `${(count / evaluated.length) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="type-row-count">{count}</span>
                  <span className="type-row-avg">{avg ?? '—'} ★</span>
                </div>
              ))}
            </div>

            <div className="section-title">Comparativo do casal</div>
            <div className="couple-compare">
              <div className="couple-card">
                <div className="avatar-sm avatar-livia" />
                <div className="couple-name">Lívia</div>
                <div className="couple-avg">{liviaAvg ?? '—'}</div>
              </div>
              <div className="couple-vs">vs</div>
              <div className="couple-card">
                <div className="avatar-sm avatar-camila" />
                <div className="couple-name">Camila</div>
                <div className="couple-avg">{camilaAvg ?? '—'}</div>
              </div>
            </div>

            {best && (
              <div className="section-title"><TrendingUp size={15} /> Melhor avaliada</div>
            )}
            {best && (
              <div className="highlight-card highlight-best">
                <span className="highlight-name">{best.exp.name}</span>
                <span className="highlight-score">{best.avg} ★</span>
              </div>
            )}
            {worst && worst.exp.id !== best?.exp.id && (
              <>
                <div className="section-title"><ThumbsDown size={15} /> Pior avaliada</div>
                <div className="highlight-card highlight-worst">
                  <span className="highlight-name">{worst.exp.name}</span>
                  <span className="highlight-score">{worst.avg} ★</span>
                </div>
              </>
            )}
          </>
        )}

        {tab === 'ranking' && (
          <>
            {withAvg.length === 0 ? (
              <div className="empty-state"><p>Nenhuma experiência avaliada ainda.</p></div>
            ) : (
              <div className="ranking-list">
                {withAvg.map(({ exp, avg }, i) => (
                  <div key={exp.id} className="ranking-row">
                    <span className={`rank-num ${i === 0 ? 'rank-gold' : i === 1 ? 'rank-silver' : i === 2 ? 'rank-bronze' : ''}`}>
                      {i + 1}
                    </span>
                    <div className="ranking-info">
                      <div className="ranking-name">{exp.name}</div>
                      <div className="ranking-type">{typeLabels[exp.type]}</div>
                    </div>
                    <span className="ranking-avg">{avg} ★</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
