
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  ArrowUpRight,
  Bell,
  Boxes,
  CheckSquare,
  ChevronDown,
  ClipboardList,
  FileText,
  Menu,
  Plus,
  Search,
  TrendingUp,
  UserRound,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import '../../assets/styles/dashboard.css'
import UniversalSidebar from '../../components/UniversalSidebar'
import api from '../../../services/axios'

type PaymentStatus = 'Full Payment' | 'Half Payment' | 'Not Paid'
type Role = 'Admin' | 'Recorder'

type Customer = {
  id: number
  name: string
  phone: string
  location: string
  company: string
  color: string
}

type Task = {
  name: string
  progress: number
  status: 'In Progress' | 'Completed' | 'Pending'
}

type InventoryItem = {
  id: number
  name: string
  category: string
  unit: string
  price: number
  stock: number
}

type PaymentRecord = {
  id: number
  customer: string
  item: string
  amount: number
  status: PaymentStatus
  paymentMethod: string
  date: string
}

const currencyFormatter = new Intl.NumberFormat('en-GH', {
  style: 'currency',
  currency: 'GHS',
  maximumFractionDigits: 2,
})

const money = (amount: number) => currencyFormatter.format(amount)

const baseCustomers: Customer[] = []
const defaultInventory: InventoryItem[] = []
const defaultTasks: Task[] = []
const defaultRecords: PaymentRecord[] = []

export default function Dashboard() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [customers, setCustomers] = useState<Customer[]>(baseCustomers)
  const [tasks, setTasks] = useState<Task[]>(defaultTasks)
  const [inventory, setInventory] = useState<InventoryItem[]>(defaultInventory)
  const [records, setRecords] = useState<PaymentRecord[]>(defaultRecords)
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [selectedItem, setSelectedItem] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('Mobile Money')
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Full Payment')
  const [recordDate, setRecordDate] = useState(new Date().toISOString().slice(0, 16))
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', location: '', company: '' })

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [customersResult, inventoryResult, tasksResult, salesResult] = await Promise.all([
          api.get('/customers').catch(() => ({ data: baseCustomers })),
          api.get('/inventory').catch(() => ({ data: defaultInventory })),
          api.get('/tasks').catch(() => ({ data: defaultTasks })),
          api.get('/sales').catch(() => ({ data: defaultRecords })),
        ])

        const nextCustomers = Array.isArray(customersResult.data)
          ? customersResult.data
          : Array.isArray(customersResult.data?.data)
            ? customersResult.data.data
            : baseCustomers

        const nextInventory = Array.isArray(inventoryResult.data)
          ? inventoryResult.data
          : Array.isArray(inventoryResult.data?.data)
            ? inventoryResult.data.data
            : defaultInventory

        const nextTasks = Array.isArray(tasksResult.data)
          ? tasksResult.data
          : Array.isArray(tasksResult.data?.data)
            ? tasksResult.data.data
            : defaultTasks

        const nextRecords = Array.isArray(salesResult.data)
          ? salesResult.data
          : Array.isArray(salesResult.data?.data)
            ? salesResult.data.data
            : defaultRecords

        setCustomers(nextCustomers)
        setTasks(nextTasks)
        setInventory(nextInventory)
        setRecords(nextRecords)
      } catch {
        setCustomers(baseCustomers)
        setTasks(defaultTasks)
        setInventory(defaultInventory)
        setRecords(defaultRecords)
      }
    }

    loadDashboardData()
  }, [])

  const userRole = (sessionStorage.getItem('cavakuz-role') ?? localStorage.getItem('cavakuz-role') ?? 'Admin') as Role

  const filteredCustomers = useMemo(
    () =>
      customers.filter((customer) =>
        `${customer.name} ${customer.phone} ${customer.company}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [customers, search]
  )

  const selectedInventoryItem = inventory.find((item) => item.name === selectedItem) ?? inventory[0] ?? null
  const autoTotal = (selectedInventoryItem?.price ?? 0) * quantity
  const paymentDue = paymentStatus === 'Half Payment' ? autoTotal / 2 : paymentStatus === 'Not Paid' ? 0 : autoTotal

  const totalCustomers = customers.length
  const activeTasks = tasks.filter((task) => task.status !== 'Completed').length
  const totalInventory = inventory.length
  const totalRevenue = records.reduce((sum, record) => sum + record.amount, 0)

  const openPage = (page: string) => {
    setActivePage(page)
    setSidebarOpen(false)
  }

  const handleCustomerSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (!customerForm.name || !customerForm.phone) {
      return
    }

    const newCustomer: Customer = {
      id: Date.now(),
      name: customerForm.name,
      phone: customerForm.phone,
      location: customerForm.location || 'N/A',
      company: customerForm.company || 'Independent Client',
      color: ['blue', 'purple', 'orange', 'green'][customers.length % 4],
    }

    setCustomers((current) => [newCustomer, ...current])
    setSelectedCustomer(newCustomer.name)
    setCustomerForm({ name: '', phone: '', location: '', company: '' })
    setActivePage('Customers / Clients')
  }

  const handleRecordSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (!selectedCustomer || !selectedInventoryItem) {
      return
    }

    const createdRecord: PaymentRecord = {
      id: Date.now(),
      customer: selectedCustomer,
      item: `${selectedInventoryItem.name} (${quantity} ${selectedInventoryItem.unit})`,
      amount: autoTotal,
      status: paymentStatus,
      paymentMethod,
      date: recordDate,
    }

    setRecords((current) => [createdRecord, ...current])
    setSelectedItem(selectedInventoryItem.name)
    setQuantity(1)
    setPaymentStatus('Full Payment')
    setPaymentMethod('Mobile Money')
    setRecordDate(new Date().toISOString().slice(0, 16))
    setActivePage('Records & Payments')
  }

  const handlePrintReceipt = () => {
    window.print()
  }

  const renderPage = () => {
    if (activePage === 'Customers / Clients') {
      return (
        <section className="module-grid two-column">
          <div className="panel module-panel">
            <PanelHeading title="Customer / Client Module" subtitle="Collect the required customer data" />
            <form className="field-form" onSubmit={handleCustomerSubmit}>
              <div className="field-grid">
                <label>
                  <span>Name</span>
                  <input
                    value={customerForm.name}
                    onChange={(event) => setCustomerForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Customer name"
                    required
                  />
                </label>
                <label>
                  <span>Phone Number</span>
                  <input
                    value={customerForm.phone}
                    onChange={(event) => setCustomerForm((current) => ({ ...current, phone: event.target.value }))}
                    placeholder="Phone number"
                    required
                  />
                </label>
                <label>
                  <span>Location</span>
                  <input
                    value={customerForm.location}
                    onChange={(event) => setCustomerForm((current) => ({ ...current, location: event.target.value }))}
                    placeholder="Location"
                  />
                </label>
                <label>
                  <span>Company / Work</span>
                  <input
                    value={customerForm.company}
                    onChange={(event) => setCustomerForm((current) => ({ ...current, company: event.target.value }))}
                    placeholder="Company or work"
                  />
                </label>
              </div>
              <button className="primary-button" type="submit">Add customer</button>
            </form>
          </div>

          <div className="panel module-panel">
            <PanelHeading title="Customer list" subtitle="Your client database" />
            <div className="table-responsive compact-table">
              <table className="table dashboard-table align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Location</th>
                    <th>Company / Work</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <div className="customer-cell">
                          <div className={`customer-avatar ${customer.color}`}>{customer.name.slice(0, 2).toUpperCase()}</div>
                          <strong>{customer.name}</strong>
                        </div>
                      </td>
                      <td>{customer.phone}</td>
                      <td>{customer.location}</td>
                      <td>{customer.company}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )
    }

    if (activePage === 'Tasks') {
      return (
        <section className="module-grid two-column">
          <div className="panel module-panel">
            <PanelHeading title="Task board" subtitle="Service work with progress tracking" />
            <div className="task-stack">
              {tasks.map((task) => (
                <div className="task-card" key={task.name}>
                  <div className="task-card-header">
                    <strong>{task.name}</strong>
                    <span className={`status-pill ${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span>
                  </div>
                  <div className="progress-line">
                    <div className="progress">
                      <div className="progress-bar" style={{ width: `${task.progress}%` }} />
                    </div>
                    <small>{task.progress}%</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel module-panel">
            <PanelHeading title="Task summary" subtitle="Performance snapshot" />
            <div className="summary-stack">
              <div className="summary-card">
                <span>Open tasks</span>
                <strong>{activeTasks}</strong>
              </div>
              <div className="summary-card">
                <span>Completed</span>
                <strong>{tasks.filter((task) => task.status === 'Completed').length}</strong>
              </div>
              <div className="summary-card">
                <span>Avg. progress</span>
                <strong>{Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length)}%</strong>
              </div>
            </div>
          </div>
        </section>
      )
    }

    if (activePage === 'Services / Inventory') {
      return (
        <section className="module-grid two-column">
          <div className="panel module-panel">
            <PanelHeading title="Inventory catalogue" subtitle="Track services and stock" />
            <div className="inventory-list">
              {inventory.map((item) => (
                <div className="inventory-item" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.category}</small>
                  </div>
                  <div>
                    <strong>{money(item.price)}</strong>
                    <small>{item.stock} in stock</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel module-panel">
            <PanelHeading title="Auto price calculator" subtitle="Quantity × unit price" />
            <div className="price-calculator">
              <label>
                <span>Inventory / service</span>
                <select value={selectedItem} onChange={(event) => setSelectedItem(event.target.value)}>
                  {inventory.map((item) => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>Quantity</span>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(event) => setQuantity(Number(event.target.value) || 1)}
                />
              </label>

              <div className="calculator-card">
                <span>Unit Price</span>
                <strong>{money(selectedInventoryItem?.price ?? 0)}</strong>
              </div>
              <div className="calculator-card primary">
                <span>Auto calculated total</span>
                <strong>{money(autoTotal)}</strong>
              </div>
            </div>
          </div>
        </section>
      )
    }

    if (activePage === 'Records & Payments') {
      return (
        <section className="module-grid record-layout">
          <div className="panel module-panel">
            <PanelHeading title="Add Record" subtitle="Select customer, purchase, and payment details" />
            <form className="field-form" onSubmit={handleRecordSubmit}>
              <div className="field-grid">
                <label>
                  <span>Select customer</span>
                  <select value={selectedCustomer} onChange={(event) => setSelectedCustomer(event.target.value)}>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.name}>{customer.name}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Inventory / Service purchased</span>
                  <select value={selectedItem} onChange={(event) => setSelectedItem(event.target.value)}>
                    {inventory.map((item) => (
                      <option key={item.id} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Quantity</span>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(event) => setQuantity(Number(event.target.value) || 1)}
                  />
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
                    <option>Debit Card</option>
                  </select>
                </label>

                <label>
                  <span>Payment status</span>
                  <select value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value as PaymentStatus)}>
                    <option>Full Payment</option>
                    <option>Half Payment</option>
                    <option>Not Paid</option>
                  </select>
                </label>
              </div>

              <div className="record-summary">
                <div>
                  <span>Amount due</span>
                  <strong>{money(autoTotal)}</strong>
                </div>
                <div>
                  <span>Collected now</span>
                  <strong>{money(paymentDue)}</strong>
                </div>
              </div>

              <div className="action-row">
                <button type="submit" className="primary-button">Add record</button>
                <button type="button" className="secondary-button" onClick={handlePrintReceipt}>Print receipt</button>
              </div>
            </form>
          </div>

          <div className="panel module-panel receipt-panel">
            <PanelHeading title="Receipt preview" subtitle="Customer payment summary" />
            <div className="receipt-box">
              <div className="receipt-header">
                <strong>CAVAKUZ</strong>
                <small>Sales Receipt</small>
              </div>
              <div className="receipt-line">
                <span>Customer</span>
                <strong>{selectedCustomer}</strong>
              </div>
              <div className="receipt-line">
                <span>Item</span>
                <strong>{selectedInventoryItem?.name ?? 'No item selected'}</strong>
              </div>
              <div className="receipt-line">
                <span>Qty</span>
                <strong>{quantity}</strong>
              </div>
              <div className="receipt-line">
                <span>Payment</span>
                <strong>{paymentMethod}</strong>
              </div>
              <div className="receipt-line total">
                <span>Total</span>
                <strong>{money(autoTotal)}</strong>
              </div>
              <div className="receipt-line status-line">
                <span>Status</span>
                <strong>{paymentStatus}</strong>
              </div>
            </div>
          </div>
        </section>
      )
    }

    if (activePage === 'Financial Report') {
      const financialSummary = [
        { name: 'Services', value: records.reduce((sum, record) => sum + record.amount, 0) },
        { name: 'Inventory', value: inventory.reduce((sum, item) => sum + item.price * item.stock, 0) },
        { name: 'Pending payment', value: records.filter((record) => record.status !== 'Full Payment').reduce((sum, record) => sum + record.amount, 0) },
        { name: 'Net profit', value: Math.max(records.reduce((sum, record) => sum + record.amount, 0) - inventory.reduce((sum, item) => sum + item.price * item.stock, 0), 0) },
      ]

      return (
        <section className="module-grid two-column">
          <div className="panel module-panel">
            <PanelHeading title="Financial overview" subtitle="Summary across the month" />
            <div className="summary-stack">
              <div className="summary-card highlight">
                <span>Total income</span>
                <strong>{money(financialSummary[0].value)}</strong>
              </div>
              <div className="summary-card">
                <span>Outstanding</span>
                <strong>{money(financialSummary[2].value)}</strong>
              </div>
              <div className="summary-card">
                <span>Expenses</span>
                <strong>{money(inventory.reduce((sum, item) => sum + item.price * item.stock, 0))}</strong>
              </div>
            </div>
          </div>

          <div className="panel module-panel">
            <PanelHeading title="Monthly report" subtitle="Performance by category" />
            <div className="report-list">
              {financialSummary.map((item) => (
                <div className="report-row" key={item.name}>
                  <span>{item.name}</span>
                  <strong>{money(item.value)}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    }

    if (activePage === 'Invoices') {
      const invoiceList = records.map((record, index) => ({
        id: `INV-${record.id ?? index + 1}`,
        client: record.customer || 'Customer',
        total: Number(record.amount || 0),
        status: record.status === 'Half Payment' ? 'Partial' : record.status === 'Not Paid' ? 'Pending' : 'Paid',
      }))

      return (
        <section className="module-grid two-column">
          <div className="panel module-panel">
            <PanelHeading title="Invoices" subtitle="Printable customer statements" />
            <div className="invoice-list">
              {invoiceList.length ? invoiceList.map((invoice) => (
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
                </div>
              )) : <p>No invoices available.</p>}
            </div>
          </div>

          <div className="panel module-panel">
            <PanelHeading title="Invoice preview" subtitle="Ready for printing" />
            <div className="receipt-box invoice-box">
              <div className="receipt-header">
                <strong>INVOICE</strong>
                <small>{invoiceList[0] ? `#${invoiceList[0].id}` : '#INV-0000'}</small>
              </div>
              <div className="receipt-line">
                <span>Customer</span>
                <strong>{invoiceList[0]?.client ?? 'No customer'}</strong>
              </div>
              <div className="receipt-line">
                <span>Service</span>
                <strong>{selectedInventoryItem?.name ?? 'No item selected'}</strong>
              </div>
              <div className="receipt-line total">
                <span>Amount due</span>
                <strong>{money(invoiceList[0]?.total ?? 0)}</strong>
              </div>
            </div>
          </div>
        </section>
      )
    }

    return (
      <section className="module-grid two-column">
        <div className="panel module-panel">
          <PanelHeading title="Overview" subtitle="Business snapshot" />
          <div className="summary-stack">
            <div className="summary-card">
              <span>Total clients</span>
              <strong>{totalCustomers}</strong>
            </div>
            <div className="summary-card">
              <span>Inventory items</span>
              <strong>{totalInventory}</strong>
            </div>
            <div className="summary-card">
              <span>Total sales</span>
              <strong>{money(totalRevenue)}</strong>
            </div>
          </div>
        </div>

        <div className="panel module-panel">
          <PanelHeading title="Quick actions" subtitle="Keep teams moving" />
          <div className="quick-actions">
            <button className="action-chip" onClick={() => openPage('Customers / Clients')}><Users size={15} /> Customers</button>
            <button className="action-chip" onClick={() => openPage('Records & Payments')}><FileText size={15} /> Records</button>
            <button className="action-chip" onClick={() => openPage('Financial Report')}><TrendingUp size={15} /> Reports</button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="cavakuz-app">
      {sidebarOpen && (
        <button className="sidebar-backdrop" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />
      )}

      <UniversalSidebar
        activePage={activePage}
        onNavigate={openPage}
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="cavakuz-main">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Open menu" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>

          <div className="global-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customers, tasks, services..."
              aria-label="Search dashboard"
            />
            {search && (
              <button onClick={() => setSearch('')} aria-label="Clear search">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="topbar-actions">
            <button className="notification-button" aria-label="Notifications">
              <Bell size={20} />
              <span />
            </button>
            <button className="profile-button" onClick={() => openPage('Settings')}>
              <div className="profile-avatar"><UserRound size={20} /></div>
              <div className="profile-copy">
                <strong>{userRole === 'Admin' ? 'Admin User' : 'Recorder User'}</strong>
                <small>{userRole}</small>
              </div>
              <ChevronDown size={16} />
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">BUSINESS OPERATIONS</div>
              <h1>{activePage === 'Dashboard' ? `Welcome back, ${userRole === 'Admin' ? 'Admin User' : 'Recorder User'}` : activePage}</h1>
              <p>
                {activePage === 'Dashboard'
                  ? 'Stay on top of customers, stock, tasks, and payments in real time.'
                  : `Manage your ${activePage.toLowerCase()} workspace for the ${userRole.toLowerCase()} role.`}
              </p>
            </div>
            <div className="welcome-actions">
              <span className="today-label">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long' })}</span>
              <button className="btn btn-primary add-record-btn" onClick={() => openPage('Records & Payments')}>
                <Plus size={17} /> Add Record
              </button>
            </div>
          </section>

          {activePage !== 'Dashboard' && (
            <div className="page-notice">
              <ClipboardList size={20} />
              <div>
                <strong>{activePage}</strong>
                <p>This screen is ready for the next API layer. The business data model is in place and ready to connect.</p>
              </div>
              <button className="btn btn-sm btn-outline-primary" onClick={() => openPage('Dashboard')}>
                Back to dashboard
              </button>
            </div>
          )}

          {activePage === 'Dashboard' && (
            <>
              <section className="stats-grid">
                <StatCard title="Total Customers" value={String(totalCustomers)} change="+12.8%" icon={<Users />} tone="blue" note="vs. last month" />
                <StatCard title="Active Tasks" value={String(activeTasks)} change="+8.2%" icon={<CheckSquare />} tone="green" note="across all jobs" />
                <StatCard title="Services & Items" value={String(totalInventory)} change="+4.5%" icon={<Boxes />} tone="orange" note="in your catalogue" />
                <StatCard title="Total Revenue" value={money(totalRevenue)} change="+16.4%" icon={<Wallet />} tone="purple" note="this month" />
              </section>

              <section className="overview-grid">
                <div className="panel sales-panel">
                  <PanelHeading title="Revenue overview" subtitle="Your sales performance over the last 7 days" />
                  <div className="chart-summary">
                    <div>
                      <strong>{money(12480)}</strong>
                      <span><ArrowUpRight size={15} /> 12.6% <small>this week</small></span>
                    </div>
                    <span className="chart-legend"><i /> Revenue</span>
                  </div>
                  <div className="bar-chart" aria-label="Revenue chart preview">
                    {[38, 58, 46, 76, 61, 85, 68].map((height, index) => (
                      <div className="bar-column" key={index}>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ height: `${height}%` }} />
                        </div>
                        <span>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="chart-footnote">Illustrative chart — replace with live payment data from your API.</div>
                </div>

                <div className="panel payment-panel">
                  <PanelHeading title="Payment status" subtitle="Recent customer records" />
                  <div className="payment-donut">
                    <div className="donut">
                      <div className="donut-center">
                        <strong>{records.length}</strong>
                        <span>Records</span>
                      </div>
                    </div>
                    <div className="payment-legend">
                      <LegendRow color="green" label="Full payment" value={String(records.filter((record) => record.status === 'Full Payment').length)} />
                      <LegendRow color="orange" label="Half payment" value={String(records.filter((record) => record.status === 'Half Payment').length)} />
                      <LegendRow color="red" label="Not paid" value={String(records.filter((record) => record.status === 'Not Paid').length)} />
                    </div>
                  </div>
                  <p className="chart-footnote">Sample figures for layout preview.</p>
                </div>
              </section>

              <section className="content-grid">
                <div className="panel">
                  <PanelHeading title="Recent customers" subtitle="Your latest customer records" action="View all" onAction={() => openPage('Customers / Clients')} />
                  <div className="table-responsive">
                    <table className="table dashboard-table align-middle">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Phone</th>
                          <th>Company / Work</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomers.map((customer) => (
                          <tr key={customer.id}>
                            <td>
                              <div className="customer-cell">
                                <div className={`customer-avatar ${customer.color}`}>{customer.name.slice(0, 2).toUpperCase()}</div>
                                <div>
                                  <strong>{customer.name}</strong>
                                  <small>{customer.location}</small>
                                </div>
                              </div>
                            </td>
                            <td className="muted-cell">{customer.phone}</td>
                            <td className="muted-cell">{customer.company}</td>
                            <td>
                              <button className="icon-action" title={`View ${customer.name}`} onClick={() => openPage('Customers / Clients')}>
                                <ArrowUpRight size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredCustomers.length === 0 && (
                          <tr><td colSpan={4} className="empty-state">No customers match your search.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="panel">
                  <PanelHeading title="Task progress" subtitle="Keep track of ongoing jobs" action="View all" onAction={() => openPage('Tasks')} />
                  <div className="task-list">
                    {tasks.map((task) => (
                      <div className="task-row" key={task.name}>
                        <div className="task-info">
                          <strong>{task.name}</strong>
                          <span className={`status-pill ${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span>
                        </div>
                        <div className="progress-line">
                          <div className="progress">
                            <div className={`progress-bar ${task.status === 'Completed' ? 'complete' : ''}`} style={{ width: `${task.progress}%` }} />
                          </div>
                          <small>{task.progress}%</small>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="text-action" onClick={() => openPage('Tasks')}>Manage tasks <ArrowUpRight size={15} /></button>
                </div>
              </section>

              <section className="bottom-grid">
                <div className="panel">
                  <PanelHeading title="Recent records" subtitle="Latest purchases and payments" action="View all" onAction={() => openPage('Records & Payments')} />
                  <div className="records-list">
                    {records.map((record) => (
                      <div className="record-row" key={record.id}>
                        <div className="record-icon"><FileText size={18} /></div>
                        <div className="record-copy">
                          <strong>{record.customer}</strong>
                          <small>{record.item}</small>
                        </div>
                        <div className="record-amount">
                          <strong>{money(record.amount)}</strong>
                          <span className={`status-pill ${record.status.toLowerCase().replace(' ', '-')}`}>{record.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel financial-panel">
                  <PanelHeading title="Financial summary" subtitle="This month" />
                  <div className="finance-metric">
                    <span>Total income</span>
                    <strong>{money(28450)}</strong>
                  </div>
                  <div className="finance-metric">
                    <span>Outstanding payments</span>
                    <strong className="outstanding-value">{money(4350)}</strong>
                  </div>
                  <div className="finance-metric">
                    <span>Estimated expenses</span>
                    <strong>{money(12300)}</strong>
                  </div>
                  <div className="profit-card">
                    <span>Estimated net profit</span>
                    <strong>{money(16150)}</strong>
                    <small>Income minus expenses</small>
                  </div>
                  <button className="btn btn-outline-primary w-100 report-button" onClick={() => openPage('Financial Report')}>View financial report <ArrowUpRight size={16} /></button>
                </div>
              </section>
            </>
          )}

          {activePage !== 'Dashboard' && renderPage()}

          <footer className="dashboard-footer">
            <span>© 2026 Cavakuz Work Management</span>
            <span>Print • Design • Operations</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

function StatCard({ title, value, change, icon, tone, note }: { title: string; value: string; change: string; icon: React.ReactNode; tone: string; note: string }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div className="stat-content">
        <span>{title}</span>
        <strong>{value}</strong>
        <div className="stat-change">{change} <small>{note}</small></div>
      </div>
    </div>
  )
}

function PanelHeading({ title, subtitle, action, onAction }: { title: string; subtitle: string; action?: string; onAction?: () => void }) {
  return (
    <div className="panel-heading">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {action && (
        <button className="panel-action" onClick={onAction}>
          {action} <ArrowUpRight size={14} />
        </button>
      )}
    </div>
  )
}

function LegendRow({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="legend-row">
      <i className={`legend-dot ${color}`} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
