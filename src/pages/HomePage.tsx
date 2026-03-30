import { useAuth } from '../hooks/useAuth'
import { Screen } from './Index'
import { Plus, BookOpen, Clock, BarChart2, LogOut } from 'lucide-react'

interface HomePageProps {
  onNavigate: (s: Screen) => void
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { currentUser, logout } = useAuth()
  const userName = currentUser === 'livia' ? 'Lívia' : 'Camila'

  return (
    <div className="home-screen">
      <div className="home-hero">
        <div className="home-avatar" />
        <h1 className="home-title">Lívia <span>&</span> Camila</h1>
        <p className="home-subtitle">nossos encontros</p>
        <div className="user-pill">
          <div className={`avatar-sm avatar-${currentUser}`} />
          <span>Olá, {userName}!</span>
          <button className="logout-btn" onClick={logout}>
            <LogOut size={14} />
          </button>
        </div>
      </div>

      <nav className="home-nav">
        <button className="nav-card nav-card-primary" onClick={() => onNavigate('new-experience')}>
          <div className="nav-card-icon"><Plus size={22} /></div>
          <div>
            <div className="nav-card-title">Nova Experiência</div>
            <div className="nav-card-desc">Registre um lugar, filme ou compra</div>
          </div>
        </button>

        <button className="nav-card" onClick={() => onNavigate('pending')}>
          <div className="nav-card-icon nav-icon-orange"><Clock size={22} /></div>
          <div>
            <div className="nav-card-title">Para Avaliar</div>
            <div className="nav-card-desc">Experiências aguardando sua nota</div>
          </div>
        </button>

        <button className="nav-card" onClick={() => onNavigate('feed')}>
          <div className="nav-card-icon nav-icon-purple"><BookOpen size={22} /></div>
          <div>
            <div className="nav-card-title">Feed</div>
            <div className="nav-card-desc">Todas as experiências avaliadas</div>
          </div>
        </button>

        <button className="nav-card" onClick={() => onNavigate('dashboard')}>
          <div className="nav-card-icon nav-icon-green"><BarChart2 size={22} /></div>
          <div>
            <div className="nav-card-title">Dashboard</div>
            <div className="nav-card-desc">Rankings e estatísticas</div>
          </div>
        </button>
      </nav>
    </div>
  )
}
