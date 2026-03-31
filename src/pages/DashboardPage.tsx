import { Experience, Review, ExperienceType, typeLabels, comidaTipoLabels, ComidaTipo } from '../types'
import { Screen } from './Index'
import { ChevronLeft, Award, Star, Utensils, Film, ShoppingBag } from 'lucide-react'
import { useState } from 'react'

interface Props {
  experiences: Experience[]
  reviews: Review[]
  onNavigate: (s: Screen) => void
}

export function DashboardPage({ experiences, reviews, onNavigate }: Props) {
  const [tab, setTab] = useState<'resumo' | 'ranking' | 'categorias'>('resumo')

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

  const totalAvaliadas = evaluated.length
  const totalPendentes = experiences.length - totalAvaliadas
  const avgGeral = withAvg.length === 0 ? null :
    Math.round(withAvg.reduce((s, x) => s + x.avg, 0) / withAvg.length * 10) / 10

  // Per-category stats
  const categoryStats = (['comida', 'filme', 'compra'] as ExperienceType[]).map(type => {
    const exps = withAvg.filter(x => x.exp.type === type)
    const count = exps.length
    const avg = count === 0 ? null : Math.round(exps.reduce((s, x) => s + x.avg, 0) / count * 10) / 10
    const best = exps.length > 0 ? exps[0] : null
    const worst = exps.length > 1 ? exps[exps.length - 1] : null
    return { type, count, avg, best, worst }
  })

  // Comida subcategory stats
  const comidaSubStats = (['gelateria', 'cafeteria', 'restaurante'] as ComidaTipo[]).map(sub => {
    const exps = withAvg.filter(x => x.exp.type === 'comida' && x.exp.comidaTipo === sub)
    const count = exps.length
    const avg = count === 0 ? null : Math.round(exps.reduce((s, x) => s + x.avg, 0) / count * 10) / 10
    return { sub, count, avg }
  })

  // Most used tags across reviews
  const tagCounts: Record<string, number> = {}
  reviews.forEach(r => (r.tags || []).forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1 }))
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)

  const typeIcon = (type: ExperienceType) => {
    if (type === 'comida') return <Utensils size={14} />
    if (type === 'filme') return <Film size={14} />
    return <ShoppingBag size={14} />
  }

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
          <button className={`tab-btn ${tab === 'resumo' ? 'tab-active' : ''}`} onClick={() => setTab('resumo')}>
            <Star size={15} /> Resumo
          </button>
          <button className={`tab-btn ${tab === 'categorias' ? 'tab-active' : ''}`} onClick={() => setTab('categorias')}>
            <Utensils size={15} /> Categorias
          </button>
          <button className={`tab-btn ${tab === 'ranking' ? 'tab-active' : ''}`} onClick={() => setTab('ranking')}>
            <Award size={15} /> Ranking
          </button>
        </div>

        {tab === 'resumo' && (
          <>
            <div className="stats-grid">
              <div className="stat-block">
                <div className="stat-val">{totalAvaliadas}</div>
                <div className="stat-lbl">avaliadas</div>
              </div>
              <div className="stat-block">
                <div className="stat-val">{avgGeral ?? '—'}</div>
                <div className="stat-lbl">média geral</div>
              </div>
              <div className="stat-block">
                <div className="stat-val">{totalPendentes}</div>
                <div className="stat-lbl">pendentes</div>
              </div>
            </div>

            <div className="section-title">Por tipo</div>
            <div className="type-rows">
              {categoryStats.map(({ type, count, avg }) => (
                <div key={type} className="type-row">
                  <span className="type-row-icon">{typeIcon(type)}</span>
                  <span className="type-row-label">{typeLabels[type]}</span>
                  <span className="type-row-count">{count}</span>
                  <span className="type-row-avg">{avg ?? '—'} ★</span>
                </div>
              ))}
            </div>

            {topTags.length > 0 && (
              <>
                <div className="section-title">Tags mais usadas</div>
                <div className="mini-tags" style={{ justifyContent: 'flex-start', gap: 8 }}>
                  {topTags.map(([tag, count]) => (
                    <span key={tag} className="mini-tag">{tag} ({count})</span>
                  ))}
                </div>
              </>
            )}

            {withAvg.length > 0 && (
              <>
                <div className="section-title">Destaques</div>
                <div className="highlight-card highlight-best">
                  <span className="highlight-label">Melhor</span>
                  <span className="highlight-name">{withAvg[0].exp.name}</span>
                  <span className="highlight-score">{withAvg[0].avg} ★</span>
                </div>
                {withAvg.length > 1 && (
                  <div className="highlight-card highlight-worst" style={{ marginTop: 8 }}>
                    <span className="highlight-label">Pior</span>
                    <span className="highlight-name">{withAvg[withAvg.length - 1].exp.name}</span>
                    <span className="highlight-score">{withAvg[withAvg.length - 1].avg} ★</span>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {tab === 'categorias' && (
          <>
            {categoryStats.map(({ type, count, avg, best, worst }) => (
              <div key={type} className="category-section">
                <div className="category-header">
                  <span className="category-icon">{typeIcon(type)}</span>
                  <span className="category-title">{typeLabels[type]}</span>
                  <span className="category-count">{count} avaliadas</span>
                </div>
                {count === 0 ? (
                  <p className="category-empty">Nenhuma avaliação ainda</p>
                ) : (
                  <>
                    <div className="category-avg">Média: <strong>{avg} ★</strong></div>
                    {best && <div className="category-highlight">Melhor: {best.exp.name} ({best.avg} ★)</div>}
                    {worst && worst.exp.id !== best?.exp.id && (
                      <div className="category-highlight">Pior: {worst.exp.name} ({worst.avg} ★)</div>
                    )}
                  </>
                )}

                {type === 'comida' && (
                  <div className="subcategory-list">
                    {comidaSubStats.filter(s => s.count > 0).map(({ sub, count: c, avg: a }) => (
                      <div key={sub} className="subcategory-row">
                        <span>{comidaTipoLabels[sub]}</span>
                        <span>{c}x · {a} ★</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
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
