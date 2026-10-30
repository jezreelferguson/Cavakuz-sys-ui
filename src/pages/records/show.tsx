import { Link } from 'react-router-dom'
import AppShell from '../../components/AppShell'

const record = {
  id: 'REC-1042',
  customer: 'Akwasi Mensah',
  item: 'Maintenance Service',
  quantity: 1,
  amount: 4800,
  paymentMethod: 'Mobile Money',
  status: 'Full Payment',
  date: '30 Oct 2026, 2:30 PM',
}

const money = (value: number) => new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(value)

export default function RecordShowPage() {
  return (
    <AppShell
      activePage="Records & Payments"
      pageTitle="Record overview"
      pageSubtitle="Review the full transaction details and payment summary."
      action={
        <div className="action-row">
          <Link to="/dashboard/records/1042/edit" className="primary-button">Edit record</Link>
          <Link to="/dashboard/records" className="secondary-button">Back to list</Link>
        </div>
      }
    >
      <section className="module-grid record-layout">
        <div className="panel module-panel">
          <div className="panel-heading">
            <div>
              <h2>Record details</h2>
              <p>Payment and operation summary</p>
            </div>
            <span className="status-pill completed">{record.status}</span>
          </div>

          <div className="receipt-box">
            <div className="receipt-header">
              <strong>CAVAKUZ</strong>
              <small>{record.id}</small>
            </div>

            <div className="receipt-line">
              <span>Customer</span>
              <strong>{record.customer}</strong>
            </div>
            <div className="receipt-line">
              <span>Item</span>
              <strong>{record.item}</strong>
            </div>
            <div className="receipt-line">
              <span>Quantity</span>
              <strong>{record.quantity}</strong>
            </div>
            <div className="receipt-line">
              <span>Method</span>
              <strong>{record.paymentMethod}</strong>
            </div>
            <div className="receipt-line">
              <span>Date</span>
              <strong>{record.date}</strong>
            </div>
            <div className="receipt-line total">
              <span>Total</span>
              <strong>{money(record.amount)}</strong>
            </div>
          </div>
        </div>

        <div className="panel module-panel">
          <div className="panel-heading">
            <div>
              <h2>Payment summary</h2>
              <p>Current status and totals</p>
            </div>
          </div>

          <div className="summary-stack">
            <div className="summary-card highlight">
              <span>Amount</span>
              <strong>{money(record.amount)}</strong>
            </div>
            <div className="summary-card">
              <span>Payment method</span>
              <strong>{record.paymentMethod}</strong>
            </div>
            <div className="summary-card">
              <span>Status</span>
              <strong>{record.status}</strong>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  )
}
