import { useEffect, useState } from 'react'
import { updateProfile } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const navigate = useNavigate()
  const { user, login, register, logout, firebaseReady, firebaseConfigError } = useAuth()

  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const isRegister = mode === 'register'

  // Navega al explorador solo cuando Firebase confirma la sesion
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function switchMode(next) {
    setMode(next)
    setError('')
    setSuccess('')
    setForm({ name: '', email: '', password: '' })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!form.email.trim().toLowerCase().endsWith('@uao.edu.co')) {
      setError('Solo se permiten correos institucionales @uao.edu.co')
      return
    }

    if (isRegister && !form.name.trim()) {
      setError('Ingresa tu nombre completo')
      return
    }

    setLoading(true)

    try {
      if (isRegister) {
        const credential = await register(form.email.trim(), form.password)
        await updateProfile(credential.user, { displayName: form.name.trim() })
        await logout()
        setSuccess('Cuenta creada. Ya puedes iniciar sesion.')
        switchMode('login')
      } else {
        // El useEffect de arriba detecta el cambio de user y navega
        await login(form.email.trim(), form.password)
      }
    } catch (err) {
      setError(err?.message || 'No fue posible autenticar. Verifica tus datos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>{isRegister ? 'Crear cuenta' : 'Ingresar'}</h1>
        <p>
          {isRegister
            ? 'Completa el formulario para registrarte.'
            : 'Accede con tu correo institucional UAO.'}
        </p>

        {success ? <p className="form-success">{success}</p> : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister ? (
            <>
              <label htmlFor="name">Nombre completo</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
              />
            </>
          ) : null}

          <label htmlFor="email">Correo institucional</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="usuario@uao.edu.co"
            required
          />

          <label htmlFor="password">Contrasena</label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={6}
            value={form.password}
            onChange={handleChange}
            placeholder="Minimo 6 caracteres"
            required
          />

          {error ? <p className="form-error">{error}</p> : null}

          <div className="actions actions--auth">
            <button type="submit" disabled={loading}>
              {loading ? 'Procesando...' : isRegister ? 'Registrarse' : 'Iniciar sesion'}
            </button>
          </div>
        </form>

        <p className="auth-switch">
          {isRegister ? (
            <>
              Ya tienes cuenta?{' '}
              <button type="button" className="link-btn" onClick={() => switchMode('login')}>
                Inicia sesion
              </button>
            </>
          ) : (
            <>
              No tienes cuenta?{' '}
              <button type="button" className="link-btn" onClick={() => switchMode('register')}>
                Crear cuenta
              </button>
            </>
          )}
        </p>
      </section>
    </main>
  )
}
