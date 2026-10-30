import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../../components/AppShell'

const initialForm = {
  customer: 'Akwasi Mensah',
  item: 'Maintenance Service',
  quantity: '1',
  amount: '4800',
  paymentMethod: 'Mobile Money',
  status: 'Full Payment',
  date: '2026-10-30T14:30',
}

export default function RecordCreatePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)

  const handleChange = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate('/dashboard/records/1042')
  }

  return (
    <AppShell
      activePage="Records & Payments"
      pageTitle="Create payment record"
      pageSubtitle="Log a new transaction, payment method, and sales activity."
      action={
        <Link to="/dashboard/records" className="secondary-button">
          Back to records
        </Link>
      }
    >
      <section className="panel module-panel">
        <div className="panel-heading">
          <div>
            <h2>New sales entry</h2>
            <p>Record customer, product, and payment details.</p>
          </div>
        </div>

        <form className="field-form" onSubmit={handleSubmit}>
          <div className="field-grid">
            <label>
              <span>Customer name</span>
              <input value={form.customer} onChange={(event) => handleChange('customer', event.target.value)} required />
            </label>

            <label>
              <span>Item / service</span>
              <input value={form.item} onChange={(event) => handleChange('item', event.target.value)} required />
            </label>

            <label>
              <span>Quantity</span>
              <input type="number" min={1} value={form.quantity} onChange={(event) => handleChange('quantity', event.target.value)} required />
            </label>

            <label>
              <span>Amount (GHS)</span>
              <input type="number" min={0} value={form.amount} onChange={(event) => handleChange('amount', event.target.value)} required />
            </label>

            <label>
              <span>Payment method</span>
              <select value={form.paymentMethod} onChange={(event) => handleChange('paymentMethod', event.target.value)}>
                <option>Cash</option>
                <option>Mobile Money</option>
                <option>Bank Transfer</option>
              </select>
            </label>

            <label>
              <span>Payment status</span>
              <select value={form.status} onChange={(event) => handleChange('status', event.target.value)}>
                <option>Full Payment</option>
                <option>Half Payment</option>
                <option>Not Paid</option>
              </select>
            </label>

            <label style={{ gridColumn: '1 / -1' }}>
              <span>Date / time</span>
              <input type="datetime-local" value={form.date} onChange={(event) => handleChange('date', event.target.value)} />
            </label>
          </div>

          <div className="record-summary">
            <div>
              <span>Amount due</span>
              <strong>GHS {Number(form.amount || 0).toLocaleString()}</strong>
            </div>
            <div>
              <span>Collected now</span>
              <strong>{form.status === 'Not Paid' ? 'GHS 0' : `GHS ${Number(form.amount || 0).toLocaleString()}`}</strong>
            </div>
          </div>

          <div className="action-row">
            <button type="submit" className="primary-button">Create record</button>
            <button type="button" className="secondary-button" onClick={() => navigate('/dashboard/records')}>
              Cancel
            </button>
          </div>
        </form>
      </section>
    </AppShell>
  )
}
