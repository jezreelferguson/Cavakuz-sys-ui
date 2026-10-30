
import { useState, type FormEvent } from 'react'
import {
  Eye,
  EyeOff,
  ArrowRight,
  Printer,
  Palette,
  CheckCircle2,
  UserRound,
  ShieldCheck,
} from 'lucide-react'
import '../../assets/styles/login.css'
import { useNavigate } from 'react-router-dom'
import api, { setAuthToken } from '../../../services/axios'

export default function Login() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [role, setRole] = useState<'Admin' | 'Recorder'>('Admin')
  const [showPassword, setShowPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const payload = {
        name: fullName || email.split('@')[0],
        email,
        password,
        ...(mode === 'signup' ? { password_confirmation: password } : {}),
      }

      const endpoint = mode === 'signup' ? '/register' : '/login'
      const response = await api.post(endpoint, payload)
      const token = response.data?.token ?? response.data?.access_token ?? null
      const user = response.data?.user ?? response.data?.data?.user ?? null

      if (token) {
        setAuthToken(token, remember)
      }

      if (user?.role) {
        const persistedRole = user.role === 'admin' ? 'Admin' : 'Recorder'
        sessionStorage.setItem('cavakuz-role', persistedRole)
        if (remember) {
          localStorage.setItem('cavakuz-role', persistedRole)
        }
      } else if (remember) {
        sessionStorage.setItem('cavakuz-role', role)
        localStorage.setItem('cavakuz-role', role)
      } else {
        sessionStorage.setItem('cavakuz-role', role)
      }

      navigate('/dashboard')
    } catch (error: unknown) {
      const message =
        typeof error === 'object' && error !== null && 'response' in error
          ? (error as { response?: { data?: { message?: string; error?: string } } }).response?.data?.message ??
            (error as { response?: { data?: { error?: string } } }).response?.data?.error ??
            'Unable to sign in right now. Please try again.'
          : 'Unable to sign in right now. Please try again.'

      setErrorMessage(String(message))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="cavakuz-page">
      <div className="login-container">
        <section className="login-brand">
          <a href="/" className="cavakuz-logo">
            <span className="logo-symbol">
              {/* <Layers3 size={23} /> */}
            </span>
            <span>CAVAKUZ EMPIRE</span>
          </a>

          <div className="brand-main">
            <span className="brand-label">
              <span className="label-dot" />
              CUSTOMER & PAYMENT OPERATIONS
            </span>

            <h1>
              Grow your
              <br />
              business with <span>clarity.</span>
            </h1>

            <p className="brand-description">
              Manage clients, purchases, task progress, invoices, and payment records from a single workspace.
            </p>

            <div className="design-art" aria-hidden="true">
              <div className="art-paper paper-back" />

              <div className="art-paper paper-middle">
                <div className="paper-circle" />
                <div className="paper-line" />
                <div className="paper-line small" />
              </div>

              <div className="art-paper paper-front">
                <span className="art-label">CAVAKUZ OPS</span>
                <div className="art-circle blue" />
                <div className="art-circle orange" />
                <div className="art-circle purple" />
                <div className="art-heading">
                  TRACK
                  <br />
                  EVERY SALE.
                </div>
                <div className="art-footer-line" />
              </div>

              <div className="art-badge badge-top">
                <Printer size={17} />
                Receipt ready
              </div>

              <div className="art-badge badge-bottom">
                <Palette size={17} />
                Service driven
              </div>
            </div>

            <div className="brand-benefits">
              <span><CheckCircle2 size={17} /> Client records</span>
              <span><CheckCircle2 size={17} /> Payment tracking</span>
            </div>
          </div>

          <div className="brand-bottom">
            <span>ROLE-BASED OPERATIONS FOR ADMINS AND RECORDERS.</span>
            <div className="color-strip">
              <i /><i /><i /><i />
            </div>
          </div>
        </section>

        <section className="login-form-panel">
          <a href="/" className="mobile-logo cavakuz-logo">
            <span className="logo-symbol">
              {/* <Layers3 size={23} /> */}
            </span>
            <span>CAVAKUZ</span>
          </a>

          <div className="login-form-content">
            <div className="form-logo">
              {/* <Layers3 size={25} /> */}
            </div>

            <span className="form-overline">SECURE ACCESS</span>
            <h2>{mode === 'login' ? 'Welcome back' : 'Create account'}<span>.</span></h2>
            <p className="form-description">
              {mode === 'login'
                ? 'Sign in to continue managing sales and customer work.'
                : 'Set up access for your team and assign the right role.'}
            </p>

            {/* <div className="auth-mode-toggle" aria-label="Authentication mode">
              <button
                type="button"
                className={mode === 'login' ? 'active' : ''}
                onClick={() => setMode('login')}
              >
                Log in
              </button>
              <button
                type="button"
                className={mode === 'signup' ? 'active' : ''}
                onClick={() => setMode('signup')}
              >
                Sign up
              </button>
            </div> */}

            <div className="role-selector" aria-label="User role">
              {(['Admin', 'Recorder'] as const).map((item) => (
                <button
                  type="button"
                  key={item}
                  className={role === item ? 'selected' : ''}
                  onClick={() => setRole(item)}
                >
                  {item === 'Admin' ? <ShieldCheck size={16} /> : <UserRound size={16} />}
                  {item}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <div className="mb-3">
                  <label htmlFor="full-name" className="form-label">
                    Full name
                  </label>
                  <input
                    id="full-name"
                    type="text"
                    className="form-control cavakuz-input"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    required={mode === 'signup'}
                  />
                </div>
              )}

              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control cavakuz-input"
                  placeholder="you@cavakuz.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control cavakuz-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {mode === 'login' && (
                <div className="login-options">
                  <label className="remember-option">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(event) => setRemember(event.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>

                  <a href="/forgot-password">Forgot password?</a>
                </div>
              )}

              <button type="submit" className="cavakuz-submit" disabled={isSubmitting}>
                <span>{isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign in to workspace' : 'Create workspace account'}</span>
                <ArrowRight size={19} />
              </button>
            </form>

            <div className="security-message">
              <span className="security-dot" />
              Secure access for {role} users only.
            </div>
          </div>

          <footer className="login-footer">
            <span>© {new Date().getFullYear()} Cavakuz</span>
            <span>Work smarter. Track better.</span>
          </footer>
        </section>
      </div>
    </main>
  )
}
