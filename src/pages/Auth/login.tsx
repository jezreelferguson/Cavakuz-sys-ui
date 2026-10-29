
import { useState } from 'react'
import {
  Layers3,
  Eye,
  EyeOff,
  ArrowRight,
  Printer,
  Palette,
  CheckCircle2,
} from 'lucide-react'
import '../../assets/styles/login.css'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()

    // Connect your Laravel login API here.
    navigate('/dashboard')
    console.log({ email, password, remember })
  }

  return (
    <main className="cavakuz-page">
      <div className="login-container">
        <section className="login-brand">
          <a href="/" className="cavakuz-logo">
            <span className="logo-symbol">
              {/* <Layers3 size={25} /> */}
            </span>
            <span>CAVAKUZ EMPIRE</span>
          </a>

          <div className="brand-main">
            <span className="brand-label">
              <span className="label-dot" />
              YOUR CREATIVE WORKSPACE
            </span>

            <h1>
              Bring your
              <br />
              ideas to <span>print.</span>
            </h1>

            <p className="brand-description">
              Manage clients, creative jobs, printing orders,
              and payments — all in one place.
            </p>

            <div className="design-art" aria-hidden="true">
              <div className="art-paper paper-back" />

              <div className="art-paper paper-middle">
                <div className="paper-circle" />
                <div className="paper-line" />
                <div className="paper-line small" />
              </div>

              <div className="art-paper paper-front">
                <span className="art-label">CAVAKUZ STUDIO</span>
                <div className="art-circle blue" />
                <div className="art-circle orange" />
                <div className="art-circle purple" />
                <div className="art-heading">
                  MAKE IT
                  <br />
                  MATTER.
                </div>
                <div className="art-footer-line" />
              </div>

              <div className="art-badge badge-top">
                <Printer size={17} />
                Print ready
              </div>

              <div className="art-badge badge-bottom">
                <Palette size={17} />
                Creative studio
              </div>
            </div>

            <div className="brand-benefits">
              <span><CheckCircle2 size={17} /> Job tracking</span>
              <span><CheckCircle2 size={17} /> Print management</span>
            </div>
          </div>

          <div className="brand-bottom">
            <span>DESIGNED FOR CREATIVITY. BUILT FOR BUSINESS.</span>
            <div className="color-strip">
              <i /><i /><i /><i />
            </div>
          </div>
        </section>

        <section className="login-form-panel">
          <a href="/" className="mobile-logo cavakuz-logo">
            <span className="logo-symbol">
              <Layers3 size={23} />
            </span>
            <span>CAVAKUZ</span>
          </a>

          <div className="login-form-content">
            <div className="form-logo">
              <Layers3 size={25} />
            </div>

            <span className="form-overline">YOUR WORKSPACE AWAITS</span>
            <h2>Welcome back<span>.</span></h2>
            <p className="form-description">
              Sign in to your workspace to continue.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  className="form-control cavakuz-input"
                  placeholder="you@cavakuz.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
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
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword
                      ? <EyeOff size={19} />
                      : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <div className="login-options">
                <label className="remember-option">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>

                <a href="/forgot-password">Forgot password?</a>
              </div>

              <button type="submit" className="cavakuz-submit">
                <span>Sign in to workspace</span>
                <ArrowRight size={19} />
              </button>
            </form>

            <div className="security-message">
              <span className="security-dot" />
              Secure access managed by your administrator.
            </div>
          </div>

          <footer className="login-footer">
            <span>© {new Date().getFullYear()} Cavakuz</span>
            <span>Work smarter. Create better.</span>
          </footer>
        </section>
      </div>
    </main>
  )
}
