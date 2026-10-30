import { Link } from 'react-router-dom'
import AppShell from '../../components/AppShell'

const customer = {
  id: 1025,
  name: 'Akwasi Mensah',
  phone: '+233 20 000 0000',
  email: 'akwasi@example.com',
  company: 'Kumasi Stores Ltd',
  location: 'Accra, Ghana',
  status: 'Active',
  totalSpent: 12480,
  lastOrder: '18 Oct 2026',
}

const money = (value: number) => new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(value)

export default function CustomerShowPage() {
  return (
    <AppShell
      activePage="Customers"
      pageTitle="Customer profile"
      pageSubtitle="Review customer details and recent account activity."
      action={
        <div className="action-row">
          <Link to="/dashboard/customers/1025/edit" className="primary-button">Edit customer</Link>
          <Link to="/dashboard/customers" className="secondary-button">Back to list</Link>
        </div>
      }
    >
      <section className="module-grid">
        <div className="panel module-panel">
          <div className="panel-heading">
            <div>
              <h2>Primary details</h2>
              <p>Client contact and business information</p>
            </div>
            <span className="status-pill in-progress">{customer.status}</span>
          </div>

          <div className="customer-cell" style={{ marginBottom: 22 }}>
            <div className="customer-avatar blue">AM</div>
            <div>
              <strong style={{ fontSize: 18 }}>{customer.name}</strong>
              <small>{customer.company}</small>
            </div>
          </div>

          <div className="field-grid">
            <label>
              <span>Full name</span>
              <input value={customer.name} readOnly />
            </label>
            <label>
              <span>Phone number</span>
              <input value={customer.phone} readOnly />
            </label>
            <label>
              <span>Email address</span>
              <input value={customer.email} readOnly />
            </label>
            <label>
              <span>Company</span>
              <input value={customer.company} readOnly />
            </label>
            <label style={{ gridColumn: '1 / -1' }}>
              <span>Location</span>
              <input value={customer.location} readOnly />
            </label>
          </div>
        </div>

        <div className="panel module-panel">
          <div className="panel-heading">
            <div>
              <h2>Account snapshot</h2>
              <p>Quick insight into engagement</p>
            </div>
          </div>

          <div className="summary-stack">
            <div className="summary-card highlight">
              <span>Total spent</span>
              <strong>{money(customer.totalSpent)}</strong>
            </div>
            <div className="summary-card">
              <span>Last order</span>
              <strong>{customer.lastOrder}</strong>
            </div>
            <div className="summary-card">
              <span>Customer ID</span>
              <strong>#{customer.id}</strong>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  )
}
