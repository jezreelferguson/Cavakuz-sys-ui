import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../../components/AppShell'
import api from '../../../services/axios'

type Customer = { id: number; name: string }
type InventoryItem = { id: number; name: string; price: number; unit: string }
type SaleRecord = {
  id: number
  customer: string
  item: string
  amount: number
  status: string
  paymentMethod: string
  date: string
}

const money = (value: number) => new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(value)

const asArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[]

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    if (Array.isArray(record.data)) return record.data as T[]
    if (Array.isArray(record.sales)) return record.sales as T[]
    if (Array.isArray(record.customers)) return record.customers as T[]
    if (Array.isArray(record.inventory)) return record.inventory as T[]
  }

  return []
}

export default function RecordsPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [records, setRecords] = useState<SaleRecord[]>([])
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | string>('')
  const [selectedItemId, setSelectedItemId] = useState<number | string>('')
  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('Mobile Money')
  const [paymentStatus, setPaymentStatus] = useState('Full Payment')
  const [recordDate, setRecordDate] = useState(new Date().toISOString().slice(0, 16))

  useEffect(() => {
    const loadData = async () => {
      try {
        const [customersResult, inventoryResult, salesResult] = await Promise.all([
          api.get('/customers').catch(() => ({ data: [] })),
          api.get('/inventory').catch(() => ({ data: [] })),
          api.get('/sales').catch(() => ({ data: [] })),
        ])

        const nextCustomers = asArray<Customer>(customersResult.data)
        const nextInventory = asArray<InventoryItem>(inventoryResult.data)
        const nextRecords = asArray<SaleRecord>(salesResult.data)

        setCustomers(nextCustomers)
        setInventory(nextInventory)
        setRecords(nextRecords)

        if (nextCustomers[0]) setSelectedCustomerId(nextCustomers[0].id)
        if (nextInventory[0]) setSelectedItemId(nextInventory[0].id)
      } catch {
        setCustomers([])
        setInventory([])
        setRecords([])
      }
    }

    loadData()
  }, [])

  const selectedInventoryItem = useMemo(
    () => inventory.find((item) => String(item.id) === String(selectedItemId)) ?? inventory[0],
    [inventory, selectedItemId]
  )

  const selectedCustomer = useMemo(
    () => customers.find((customer) => String(customer.id) === String(selectedCustomerId)) ?? customers[0],
    [customers, selectedCustomerId]
  )

  const amountDue = (selectedInventoryItem?.price ?? 0) * quantity
  const collectedNow = paymentStatus === 'Half Payment' ? amountDue / 2 : paymentStatus === 'Not Paid' ? 0 : amountDue

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const payload = {
        customer_id: selectedCustomerId,
        item_id: selectedItemId,
        quantity,
        amount: amountDue,
        payment_method: paymentMethod,
        status: paymentStatus,
        date: recordDate,
      }

      const { data } = await api.post('/sales', payload)
      const createdRecord = {
        id: data?.id ?? Date.now(),
        customer: selectedCustomer?.name ?? 'Customer',
        item: `${selectedInventoryItem?.name ?? 'Item'} (${quantity} ${selectedInventoryItem?.unit ?? 'unit'})`,
        amount: Number(data?.amount ?? amountDue),
        status: data?.status ?? paymentStatus,
        paymentMethod: data?.payment_method ?? paymentMethod,
        date: data?.date ?? recordDate,
      }

      setRecords((current) => [createdRecord, ...current])
    } catch {
      const createdRecord = {
        id: Date.now(),
        customer: selectedCustomer?.name ?? 'Customer',
        item: `${selectedInventoryItem?.name ?? 'Item'} (${quantity} ${selectedInventoryItem?.unit ?? 'unit'})`,
        amount: amountDue,
        status: paymentStatus,
        paymentMethod,
        date: recordDate,
      }

      setRecords((current) => [createdRecord, ...current])
    }
  }

  return (
    <AppShell
      activePage="Records & Payments"
      pageTitle="Records & Payments"
      pageSubtitle="Capture sales records, payment methods, and payment statuses."
      action={<Link to="/dashboard/records/new" className="add-record-btn">Add record</Link>}
    >
      <section className="module-grid record-layout">
        <div className="panel module-panel">
          <div className="panel-heading">
            <div>
              <h2>Add Record</h2>
              <p>Select customer, purchase, and payment details</p>
            </div>
          </div>

          <form className="field-form" onSubmit={handleSubmit}>
            <div className="field-grid">
              <label>
                <span>Select customer</span>
                <select value={selectedCustomerId} onChange={(event) => setSelectedCustomerId(event.target.value)}>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>Inventory / Service purchased</span>
                <select value={selectedItemId} onChange={(event) => setSelectedItemId(event.target.value)}>
                  {inventory.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>Quantity</span>
                <input type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value) || 1)} />
              </label>

              <label>
                <span>Date / Time</span>
                <input type="datetime-local" value={recordDate} onChange={(event) => setRecordDate(event.target.value)} />
              </label>

              <label>
                <span>Payment method</span>
                <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                  <option>Cash</option>
                  <option>Mobile Money</option>
                  <option>Bank Transfer</option>
                </select>
              </label>

              <label>
                <span>Payment status</span>
                <select value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)}>
                  <option>Full Payment</option>
                  <option>Half Payment</option>
                  <option>Not Paid</option>
                </select>
              </label>
            </div>

            <div className="record-summary">
              <div>
                <span>Amount due</span>
                <strong>{money(amountDue)}</strong>
              </div>
              <div>
                <span>Collected now</span>
                <strong>{money(collectedNow)}</strong>
              </div>
            </div>

            <div className="action-row">
              <button type="submit" className="primary-button">Add record</button>
              <button type="button" className="secondary-button">Print receipt</button>
            </div>
          </form>
        </div>

        <div className="panel module-panel receipt-panel">
          <div className="panel-heading">
            <div>
              <h2>Receipt preview</h2>
              <p>Customer payment summary</p>
            </div>
          </div>

          <div className="receipt-box">
            <div className="receipt-header">
              <strong>CAVAKUZ</strong>
              <small>Sales Receipt</small>
            </div>
            <div className="receipt-line">
              <span>Customer</span>
              <strong>{selectedCustomer?.name ?? 'Customer'}</strong>
            </div>
            <div className="receipt-line">
              <span>Item</span>
              <strong>{selectedInventoryItem?.name ?? 'Item'}</strong>
            </div>
            <div className="receipt-line">
              <span>Qty</span>
              <strong>{quantity}</strong>
            </div>
            <div className="receipt-line total">
              <span>Total</span>
              <strong>{money(amountDue)}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="panel module-panel" style={{ marginTop: 18 }}>
        <div className="panel-heading">
          <div>
            <h2>Recent records</h2>
            <p>Latest payment activity</p>
          </div>
        </div>

        <div className="records-list">
          {records.length ? records.map((record) => (
            <div className="record-row" key={record.id}>
              <div className="record-icon">📄</div>
              <div className="record-copy">
                <strong>{record.customer}</strong>
                <small>{record.item}</small>
              </div>
              <div className="record-amount">
                <strong>{money(record.amount)}</strong>
                <span className={`status-pill ${record.status.toLowerCase().replace(' ', '-')}`}>{record.status}</span>
              </div>
            </div>
          )) : <p>No records yet.</p>}
        </div>
      </section>
    </AppShell>
  )
}
