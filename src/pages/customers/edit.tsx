import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../../components/AppShell'

const customer = {
  name: 'Akwasi Mensah',
  phone: '+233 20 000 0000',
  email: 'akwasi@example.com',
  company: 'Kumasi Stores Ltd',
  location: 'Accra, Ghana',
}

export default function CustomerEditPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(customer)

  const handleChange = (field: keyof typeof customer, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate('/dashboard/customers/1025')
  }

  return (
    <AppShell
      activePage="Customers"
      pageTitle="Edit customer"
      pageSubtitle="Update the client profile and keep contact details current."
      action={
        <Link to="/dashboard/customers/1025" className="secondary-button">
          View profile
        </Link>
      }
    >
      <section className="panel module-panel">
        <div className="panel-heading">
          <div>
            <h2>Update client details</h2>
            <p>Make changes to the selected customer record.</p>
          </div>
        </div>

        <form className="field-form" onSubmit={handleSubmit}>
          <div className="field-grid">
            <label>
              <span>Full name</span>
              <input value={form.name} onChange={(event) => handleChange('name', event.target.value)} required />
            </label>

            <label>
              <span>Phone number</span>
              <input value={form.phone} onChange={(event) => handleChange('phone', event.target.value)} required />
            </label>

            <label>
              <span>Email address</span>
              <input type="email" value={form.email} onChange={(event) => handleChange('email', event.target.value)} />
            </label>

            <label>
              <span>Company</span>
              <input value={form.company} onChange={(event) => handleChange('company', event.target.value)} />
            </label>

            <label style={{ gridColumn: '1 / -1' }}>
              <span>Location</span>
              <input value={form.location} onChange={(event) => handleChange('location', event.target.value)} />
            </label>
          </div>

          <div className="action-row">
            <button type="submit" className="primary-button">Save changes</button>
            <button type="button" className="secondary-button" onClick={() => navigate('/dashboard/customers/1025')}>
              Cancel
            </button>
          </div>
        </form>
      </section>
    </AppShell>
  )
}
