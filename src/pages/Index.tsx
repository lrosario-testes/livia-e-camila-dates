import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useStorage } from '../hooks/useStorage'
import { Experience } from '../types'
import { LoginPage } from './LoginPage'
import { HomePage } from './HomePage'
import { FeedPage } from './FeedPage'
import { NewExperiencePage } from './NewExperiencePage'
import { ReviewPage } from './ReviewPage'
import { PendingPage } from './PendingPage'
import { DetailsPage } from './DetailsPage'
import { DashboardPage } from './DashboardPage'
import { AppToast } from '../components/AppToast'

export type Screen =
  | 'home'
  | 'feed'
  | 'new-experience'
  | 'review'
  | 'pending'
  | 'details'
  | 'dashboard'

function Index() {
  const { currentUser } = useAuth()
  const storage = useStorage()
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null)

  if (!currentUser) {
    return (
      <div className="app-shell">
        <LoginPage />
        <AppToast />
      </div>
    )
  }

  if (storage.loading) {
    return (
      <div className="app-shell">
        <div className="empty-state" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  const go = (s: Screen, exp?: Experience) => {
    if (exp) setSelectedExp(exp)
    setScreen(s)
  }

  const allScreens: Screen[] = ['home', 'feed', 'new-experience', 'review', 'pending', 'details', 'dashboard']

  return (
    <div className="app-shell">
      {allScreens.map(s => (
        <div key={s} className={`screen ${screen === s ? 'active' : ''}`}>
          {s === 'home' && (
            <HomePage onNavigate={go} />
          )}
          {s === 'feed' && (
            <FeedPage
              experiences={storage.experiences}
              reviews={storage.reviews}
              onNavigate={go}
              onSelectExp={(exp) => go('details', exp)}
            />
          )}
          {s === 'new-experience' && (
            <NewExperiencePage
              onNavigate={go}
              onSave={storage.saveExperience}
              active={screen === 'new-experience'}
            />
          )}
          {s === 'review' && selectedExp && (
            <ReviewPage
              experience={selectedExp}
              reviews={storage.reviews}
              currentUser={currentUser}
              onNavigate={go}
              onSave={storage.saveReview}
            />
          )}
          {s === 'pending' && (
            <PendingPage
              experiences={storage.experiences}
              reviews={storage.reviews}
              currentUser={currentUser}
              onNavigate={go}
              onSelectExp={(exp) => go('review', exp)}
            />
          )}
          {s === 'details' && selectedExp && (
            <DetailsPage
              experience={selectedExp}
              reviews={storage.reviews}
              currentUser={currentUser}
              onNavigate={go}
              onDeleteReview={storage.deleteReview}
              onDeleteExperience={storage.deleteExperience}
            />
          )}
          {s === 'dashboard' && (
            <DashboardPage
              experiences={storage.experiences}
              reviews={storage.reviews}
              onNavigate={go}
            />
          )}
        </div>
      ))}
      <AppToast />
    </div>
  )
}

export default Index
