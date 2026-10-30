import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../../components/AppShell'

const initialForm = {
  name: '',
  phone: '',
  email: '',
  company: '',
  location: '',
}

export default function CustomerCreatePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)

  const handleChange = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate('/dashboard/customers/1025')
  }

  return (
    <AppShell
      activePage="Customers"
      pageTitle="Create customer"
      pageSubtitle="Add a new client profile and keep their contact details in one place."
      action={
        <Link to="/dashboard/customers" className="secondary-button">
          Back to customers
        </Link>
      }
    >
      <section className="panel module-panel">
        <div className="panel-heading">
          <div>
            <h2>Customer information</h2>
            <p>Capture the essential details for a new client.</p>
          </div>
        </div>

        <form className="field-form" onSubmit={handleSubmit}>
          <div className="field-grid">
            <label>
              <span>Full name</span>
              <input
                value={form.name}
                onChange={(event) => handleChange('name', event.target.value)}
                placeholder="Akwasi Mensah"
                required
              />
            </label>

            <label>
              <span>Phone number</span>
              <input
                value={form.phone}
                onChange={(event) => handleChange('phone', event.target.value)}
                placeholder="+233 20 000 0000"
                required
              />
            </label>

            <label>
              <span>Email address</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => handleChange('email', event.target.value)}
                placeholder="customer@email.com"
              />
            </label>

            <label>
              <span>Company</span>
              <input
                value={form.company}
                onChange={(event) => handleChange('company', event.target.value)}
                placeholder="Kumasi Stores Ltd"
              />
            </label>

            <label style={{ gridColumn: '1 / -1' }}>
              <span>Location</span>
              <input
                value={form.location}
                onChange={(event) => handleChange('location', event.target.value)}
                placeholder="Accra, Ghana"
              />
            </label>
          </div>

          <div className="action-row">
            <button type="submit" className="primary-button">Create customer</button>
            <button type="button" className="secondary-button" onClick={() => navigate('/dashboard/customers')}>
              Cancel
            </button>
          </div>
        </form>
      </section>
    </AppShell>
  )
}
