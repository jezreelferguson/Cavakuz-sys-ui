import { Bell, ChevronDown, Menu, Search, UserRound, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/axios'
import '../assets/styles/dashboard.css'
import UniversalSidebar from './UniversalSidebar'

type AppShellProps = {
  activePage: string
  pageTitle: string
  pageSubtitle: string
  children: React.ReactNode
  action?: React.ReactNode
}

export default function AppShell({ activePage, pageTitle, pageSubtitle, children, action }: AppShellProps) {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const { data } = await api.get('/notifications')
        const items = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : Array.isArray(data?.notifications) ? data.notifications : []
        setNotificationCount(items.filter((item: { read?: boolean }) => !item.read).length)
      } catch {
        setNotificationCount(0)
      }
    }

    loadNotifications()
  }, [])

  const userRole = (sessionStorage.getItem('cavakuz-role') ?? localStorage.getItem('cavakuz-role') ?? 'Admin') as 'Admin' | 'Recorder'

  const openPage = (page: string) => {
    const map: Record<string, string> = {
      Dashboard: '/dashboard',
      Customers: '/dashboard/customers',
      Tasks: '/dashboard/tasks',
      'Services / Inventory': '/dashboard/inventory',
      'Records & Payments': '/dashboard/records',
      'Financial Report': '/dashboard/financial-report',
      Invoices: '/dashboard/invoices',
      Settings: '/dashboard',
    }

    setSidebarOpen(false)
    navigate(map[page] ?? '/dashboard')
  }

  return (
    <div className="cavakuz-app">
      <UniversalSidebar activePage={activePage} onNavigate={openPage} sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="cavakuz-main">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Open menu" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>

          <div className="global-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customers, tasks, services..."
              aria-label="Search dashboard"
            />
            {search && (
              <button onClick={() => setSearch('')} aria-label="Clear search">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="topbar-actions">
            <button className="notification-button" aria-label="Notifications">
              <Bell size={20} />
              {notificationCount > 0 && <span>{notificationCount}</span>}
            </button>
            <button className="profile-button" onClick={() => openPage('Settings')}>
              <div className="profile-avatar"><UserRound size={20} /></div>
              <div className="profile-copy">
                <strong>{userRole === 'Admin' ? 'Admin User' : 'Recorder User'}</strong>
                <small>{userRole}</small>
              </div>
              <ChevronDown size={16} />
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">BUSINESS OPERATIONS</div>
              <h1>{pageTitle}</h1>
              <p>{pageSubtitle}</p>
            </div>

            {action && <div className="welcome-actions">{action}</div>}
          </section>

          {children}

          <footer className="dashboard-footer">
            <span>© 2026 Cavakuz Work Management</span>
            <span>Print • Design • Operations</span>
          </footer>
        </div>
      </main>
    </div>
  )
}
