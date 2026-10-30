import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../../components/AppShell'
import api from '../../../services/axios'

type Invoice = {
  id: string
  client: string
  total: number
  status: 'Paid' | 'Partial' | 'Pending'
}

const money = (value: number) => new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(value)

const fallbackInvoices: Invoice[] = []

const asArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[]

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    if (Array.isArray(record.data)) return record.data as T[]
    if (Array.isArray(record.sales)) return record.sales as T[]
    if (Array.isArray(record.invoices)) return record.invoices as T[]
  }

  return []
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(fallbackInvoices)

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const { data } = await api.get('/sales')
        const sales = asArray<{ id: number; customer: string; amount: number; status: string }>(data)

        if (sales.length) {
          const mapped: Invoice[] = sales.map((sale) => ({
            id: `INV-${sale.id}`,
            client: sale.customer ?? 'Customer',
            total: Number(sale.amount ?? 0),
            status:
              sale.status === 'Half Payment'
                ? 'Partial'
                : sale.status === 'Not Paid'
                  ? 'Pending'
                  : 'Paid',
          }))
          setInvoices(mapped)
        }
      } catch {
        setInvoices(fallbackInvoices)
      }
    }

    loadInvoices()
  }, [])

  return (
    <AppShell
      activePage="Invoices"
      pageTitle="Invoices"
      pageSubtitle="Issue and review printable customer statements."
      action={<Link to="/dashboard/invoices" className="add-record-btn">Create invoice</Link>}
    >
      <section className="module-grid">
        <div className="panel module-panel">
          <div className="panel-heading">
            <div>
              <h2>Invoices</h2>
              <p>Printable customer statements</p>
            </div>
          </div>

          <div className="invoice-list">
            {invoices.length ? invoices.map((invoice) => (
              <div className="invoice-card" key={invoice.id}>
                <div>
                  <strong>{invoice.id}</strong>
                  <small>{invoice.client}</small>
                </div>
                <div className="invoice-meta">
                  <strong>{money(invoice.total)}</strong>
                  <span className={`status-pill ${invoice.status.toLowerCase() === 'paid' ? 'completed' : invoice.status.toLowerCase() === 'partial' ? 'in-progress' : 'pending'}`}>
                    {invoice.status}
                  </span>
                </div>
                <div className="table-actions">
                  <button type="button" className="table-button view-button">View</button>
                  <button type="button" className="table-button edit-button">Edit</button>
                  <button type="button" className="table-button delete-button">Delete</button>
                </div>
              </div>
            )) : <p>No invoices available.</p>}
          </div>
        </div>

        <div className="panel module-panel">
          <div className="panel-heading">
            <div>
              <h2>Invoice preview</h2>
              <p>Ready for printing</p>
            </div>
          </div>

          <div className="receipt-box invoice-box">
            <div className="receipt-header">
              <strong>INVOICE</strong>
              <small>#INV-{invoices[0]?.id?.replace('INV-', '') ?? '1048'}</small>
            </div>
            <div className="receipt-line">
              <span>Customer</span>
              <strong>{invoices[0]?.client ?? 'No customer'}</strong>
            </div>
            <div className="receipt-line">
              <span>Service</span>
              <strong>No item selected</strong>
            </div>
            <div className="receipt-line total">
              <span>Amount due</span>
              <strong>{money(invoices[0]?.total ?? 1200)}</strong>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  )
}
