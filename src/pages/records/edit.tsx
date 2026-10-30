import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../../components/AppShell'

const record = {
  customer: 'Akwasi Mensah',
  item: 'Maintenance Service',
  quantity: '1',
  amount: '4800',
  paymentMethod: 'Mobile Money',
  status: 'Full Payment',
  date: '2026-10-30T14:30',
}

export default function RecordEditPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(record)

  const handleChange = (field: keyof typeof record, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate('/dashboard/records/1042')
  }

  return (
    <AppShell
      activePage="Records & Payments"
      pageTitle="Edit payment record"
      pageSubtitle="Update the transaction details before saving changes."
      action={
        <Link to="/dashboard/records/1042" className="secondary-button">
          View record
        </Link>
      }
    >
      <section className="panel module-panel">
        <div className="panel-heading">
          <div>
            <h2>Update entry</h2>
            <p>Modify the current sales record details.</p>
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

          <div className="action-row">
            <button type="submit" className="primary-button">Save changes</button>
            <button type="button" className="secondary-button" onClick={() => navigate('/dashboard/records/1042')}>
              Cancel
            </button>
          </div>
        </form>
      </section>
    </AppShell>
  )
}
