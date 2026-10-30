import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../../components/AppShell'
import api from '../../../services/axios'

type Customer = {
  id: number
  name: string
  phone: string
  location: string
  company: string
}

const fallbackCustomers: Customer[] = []

const asArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[]

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    if (Array.isArray(record.data)) return record.data as T[]
    if (Array.isArray(record.customers)) return record.customers as T[]
    if (Array.isArray(record.items)) return record.items as T[]
  }

  return []
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(fallbackCustomers)
  const [form, setForm] = useState({ name: '', phone: '', location: '', company: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const { data } = await api.get('/customers')
        const nextCustomers = asArray<Customer>(data)
        if (nextCustomers.length) setCustomers(nextCustomers)
      } catch {
        setCustomers(fallbackCustomers)
      }
    }

    loadCustomers()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const { data } = await api.post('/customers', {
        name: form.name,
        phone: form.phone,
        location: form.location,
        company: form.company,
      })

      const nextCustomer = data?.customer ?? data ?? {
        id: Date.now(),
        name: form.name,
        phone: form.phone,
        location: form.location || 'N/A',
        company: form.company || 'Independent Client',
      }

      setCustomers((current) => [nextCustomer, ...current])
      setForm({ name: '', phone: '', location: '', company: '' })
    } catch {
      const fallbackCustomer: Customer = {
        id: Date.now(),
        name: form.name,
        phone: form.phone,
        location: form.location || 'N/A',
        company: form.company || 'Independent Client',
      }
      setCustomers((current) => [fallbackCustomer, ...current])
      setForm({ name: '', phone: '', location: '', company: '' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell
      activePage="Customers"
      pageTitle="Customers"
      pageSubtitle="Manage your client records and contact details in one place."
      action={<Link to="/dashboard/customers/new" className="add-record-btn">Add customer</Link>}
    >
      <section className="module-grid">
        {/* <div className="panel module-panel">
          <div className="panel-heading">
            <div>
              <h2>Customer / Client Module</h2>
              <p>Collect the required customer data</p>
            </div>
          </div>

          
        </div> */}

        <div className="panel module-panel ">
          <div className="panel-heading">
            <div>
              <h2>Customer list</h2>
              <p>Your client database</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>Company</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length ? customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-avatar blue">{customer.name.slice(0, 2).toUpperCase()}</div>
                        <strong>{customer.name}</strong>
                      </div>
                    </td>
                    <td>{customer.phone}</td>
                    <td>{customer.location}</td>
                    <td>{customer.company}</td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/dashboard/customers/${customer.id}`} className="table-button view-button">View</Link>
                        <Link to={`/dashboard/customers/${customer.id}/edit`} className="table-button edit-button">Edit</Link>
                        <button type="button" className="table-button delete-button">Delete</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5}>No customers available yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AppShell>
  )
}
