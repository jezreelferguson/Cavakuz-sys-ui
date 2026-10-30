import {
  BarChart3,
  CheckSquare,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  Printer,
  ReceiptText,
  Settings,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export type SidebarItem = {
  label: string
  path: string
  icon: LucideIcon
}

export const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Customers', path: '/dashboard/customers', icon: Users },
  { label: 'Tasks', path: '/dashboard/tasks', icon: CheckSquare },
  { label: 'Services / Inventory', path: '/dashboard/inventory', icon: Package },
  { label: 'Records & Payments', path: '/dashboard/records', icon: FileText },
  { label: 'Financial Report', path: '/dashboard/financial-report', icon: BarChart3 },
  { label: 'Invoices', path: '/dashboard/invoices', icon: ReceiptText },
]

type UniversalSidebarProps = {
  activePage: string
  onNavigate: (page: string) => void
  sidebarOpen: boolean
  onClose: () => void
}

export default function UniversalSidebar({ activePage, onNavigate, sidebarOpen, onClose }: UniversalSidebarProps) {
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.removeItem('cavakuz-role')
    localStorage.removeItem('cavakuz-role')
    navigate('/login')
  }

  return (
    <>
      {sidebarOpen && (
        <button className="sidebar-backdrop" aria-label="Close menu" onClick={onClose} />
      )}

      <aside className={`cavakuz-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div>
            <div className="brand-name">CAVAKUZ</div>
            <div className="brand-tagline">Sales • Service • Finance</div>
          </div>
          <button className="mobile-close" aria-label="Close menu" onClick={onClose}>
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="sidebar-caption">WORKSPACE</div>
        <nav className="sidebar-nav">
          {sidebarItems.map(({ label, path, icon: Icon }) => (
            <button
              key={label}
              className={`nav-link-custom ${activePage === label ? 'active' : ''}`}
              onClick={() => {
                onNavigate(label)
                navigate(path)
              }}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-caption">PREFERENCES</div>
          <button className={`nav-link-custom ${activePage === 'Settings' ? 'active' : ''}`} onClick={() => {
            onNavigate('Settings')
            navigate('/dashboard')
          }}>
            <Settings size={19} />
            <span>Settings</span>
          </button>
          <button className="nav-link-custom" onClick={handleLogout}>
            <LogOut size={19} />
            <span>Log out</span>
          </button>

          <div className="sidebar-promo">
            <div className="promo-icon"><Printer size={20} /></div>
            <strong>Make great work.</strong>
            <p>Track customers, payments, inventory and performance in one place.</p>
          </div>
        </div>
      </aside>
    </>
  )
}
