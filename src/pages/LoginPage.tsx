import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { UserName } from '../types'
import { Eye, EyeOff, Heart } from 'lucide-react'
import { showToast } from '../components/AppToast'

const USER_EMAILS: Record<UserName, string> = {
  livia: 'livia@app.local',
  camila: 'camila@app.local',
}

export function LoginPage() {
  const { login } = useAuth()
  const [selectedUser, setSelectedUser] = useState<UserName | null>(null)
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return
    setSubmitting(true)
    setError('')
    const errMsg = await login(USER_EMAILS[selectedUser], password)
    if (errMsg) {
      setError('Senha incorreta, tenta de novo!')
      setPassword('')
    } else {
      showToast(`Olá, ${selectedUser === 'livia' ? 'Lívia' : 'Camila'}!`)
    }
    setSubmitting(false)
  }

  return (
    <div className="login-screen">
      <div className="login-avatar" />
      <h1 className="login-title">Lívia <span>&</span> Camila</h1>
      <p className="login-subtitle">nossos encontros</p>

      <form className="login-form" onSubmit={handleLogin}>
        <div className="field-group">
          <label className="field-label">Quem é você?</label>
          <div className="user-select-grid">
            {(['livia', 'camila'] as UserName[]).map(user => (
              <button
                key={user}
                type="button"
                className={`user-select-btn ${selectedUser === user ? 'selected' : ''}`}
                onClick={() => { setSelectedUser(user); setError('') }}
              >
                <div className={`avatar-md avatar-${user}`} />
                <span>{user === 'livia' ? 'Lívia' : 'Camila'}</span>
                {selectedUser === user && <Heart size={16} fill="currentColor" className="user-heart" />}
              </button>
            ))}
          </div>
        </div>

        {selectedUser && (
          <div className="field-group">
            <label className="field-label">Senha</label>
            <div className="input-wrapper">
              <input
                className="field-input"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="Digite sua senha..."
                autoFocus
              />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)}>
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p className="field-error">{error}</p>}
          </div>
        )}

        <button className="btn btn-primary" type="submit" disabled={!selectedUser || !password || submitting}>
          <Heart size={16} fill="currentColor" />
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="login-hint">Só vocês duas têm acesso</p>
      </form>
    </div>
  )
}
