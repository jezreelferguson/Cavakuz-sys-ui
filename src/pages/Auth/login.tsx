
import { useState, type FormEvent } from 'react'
import {
  Eye,
  EyeOff,
  ArrowRight,
  Printer,
  Palette,
  CheckCircle2,
} from 'lucide-react'
import '../../assets/styles/login.css'
import { useNavigate } from 'react-router-dom'
import api, { setAuthToken } from '../../../services/axios'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
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
        email,
        password,
      }

      const response = await api.post('/login', payload)
      const token = response.data?.token ?? response.data?.access_token ?? null
      const user = response.data?.user ?? response.data?.data?.user ?? null

      if (token) {
        setAuthToken(token, remember)
      }

      if (user) {
        sessionStorage.setItem('cavakuz-user', JSON.stringify(user))
        if (remember) {
          localStorage.setItem('cavakuz-user', JSON.stringify(user))
        }
      }

      const persistedRole = 'User'
      sessionStorage.setItem('cavakuz-role', persistedRole)
      if (remember) {
        localStorage.setItem('cavakuz-role', persistedRole)
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
            <span>GENERAL OPERATIONS FOR EVERYDAY WORK.</span>
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
            <h2>Welcome back<span>.</span></h2>
            <p className="form-description">
              Sign in to continue managing sales and customer work.
            </p>

            <form onSubmit={handleSubmit}>
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
                    autoComplete="current-password"
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

              <button type="submit" className="cavakuz-submit" disabled={isSubmitting}>
                <span>{isSubmitting ? 'Please wait...' : 'Sign in to workspace'}</span>
                <ArrowRight size={19} />
              </button>
            </form>

            <div className="security-message">
              <span className="security-dot" />
              Secure access for your workspace.
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
