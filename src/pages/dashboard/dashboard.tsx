
import { useState } from 'react';
import {
  LayoutDashboard, Users, CheckSquare, Package, FileText,
  ChartNoAxesCombined, ReceiptText, Settings, LogOut, Search,
  Bell, Plus, ArrowUpRight, UserRound, CircleDollarSign,
  Menu, X, ChevronDown, Printer, Eye, MoreVertical,
  ClipboardList, Wallet, Boxes
} from 'lucide-react';
import '../../assets/styles/dashboard.css';

const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Customers / Clients', icon: Users },
  { label: 'Tasks', icon: CheckSquare },
  { label: 'Services / Inventory', icon: Package },
  { label: 'Records & Payments', icon: FileText },
  { label: 'Financial Report', icon: ChartNoAxesCombined },
  { label: 'Invoices', icon: ReceiptText },
];

const customers = [
  { initials: 'JS', name: 'John Smith', phone: '024 123 4567', location: 'Accra', company: 'ABC Printing Co.', color: 'blue' },
  { initials: 'MA', name: 'Mary Adams', phone: '020 765 4321', location: 'Tema', company: 'Graphic Solutions', color: 'purple' },
  { initials: 'TS', name: 'Tech Solutions Ltd.', phone: '055 888 7777', location: 'Madina', company: 'Tech Solutions', color: 'orange' },
  { initials: 'AR', name: 'Anna Reyes', phone: '050 555 3333', location: 'East Legon', company: 'Reyes Enterprise', color: 'green' },
];

const tasks = [
  { name: 'Print brochures', progress: 80, status: 'In Progress' },
  { name: 'Logo design', progress: 60, status: 'In Progress' },
  { name: 'Business cards', progress: 100, status: 'Completed' },
  { name: 'T-shirt printing', progress: 40, status: 'Pending' },
];

const records = [
  { customer: 'John Smith', item: 'Business cards (100 pcs)', amount: 1200, status: 'Full Payment' },
  { customer: 'Mary Adams', item: 'Flyers (500 pcs)', amount: 2800, status: 'Half Payment' },
  { customer: 'Tech Solutions Ltd.', item: 'T-shirt printing', amount: 3500, status: 'Full Payment' },
  { customer: 'Anna Reyes', item: 'Stickers (200 pcs)', amount: 1600, status: 'Not Paid' },
];

const money = (amount: number) =>
  new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    maximumFractionDigits: 2,
  }).format(amount);

export default function Dashboard() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.phone} ${customer.company}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const openPage = (page: string) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <div className="cavakuz-app">
      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`cavakuz-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">C</div>
          <div>
            <div className="brand-name">CAVAKUZ</div>
            <div className="brand-tagline">Print · Design · More</div>
          </div>
          <button
            className="mobile-close"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-caption">WORKSPACE</div>
        <nav className="sidebar-nav">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-link-custom ${activePage === label ? 'active' : ''}`}
              onClick={() => openPage(label)}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-caption">PREFERENCES</div>
          <button
            className={`nav-link-custom ${activePage === 'Settings' ? 'active' : ''}`}
            onClick={() => openPage('Settings')}
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>
          <button className="nav-link-custom" onClick={() => openPage('Logout')}>
            <LogOut size={19} />
            <span>Log out</span>
          </button>

          <div className="sidebar-promo">
            <div className="promo-icon"><Printer size={20} /></div>
            <strong>Make great work.</strong>
            <p>Keep your customers, jobs and payments in one place.</p>
          </div>
        </div>
      </aside>

      <main className="cavakuz-main">
        <header className="topbar">
          <button
            className="mobile-menu"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <div className="global-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customers, tasks, services..."
              aria-label="Search customers"
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
                <strong>Admin User</strong>
                <small>Administrator</small>
              </div>
              <ChevronDown size={16} />
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">YOUR BUSINESS AT A GLANCE</div>
              <h1>{activePage === 'Dashboard' ? 'Welcome back, Admin User' : activePage}</h1>
              <p>
                {activePage === 'Dashboard'
                  ? 'Here’s what’s happening with your business today.'
                  : `Manage your ${activePage.toLowerCase()} in Cavakuz.`}
              </p>
            </div>
            <div className="welcome-actions">
              <span className="today-label">THURSDAY, 29 OCTOBER</span>
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
                <p>This is the dashboard prototype. Connect this menu to its dedicated page or route to manage real data.</p>
              </div>
              <button className="btn btn-sm btn-outline-primary" onClick={() => openPage('Dashboard')}>
                Back to dashboard
              </button>
            </div>
          )}

          <section className="stats-grid">
            <StatCard title="Total Customers" value="248" change="+12.8%" icon={<Users />} tone="blue" note="vs. last month" />
            <StatCard title="Active Tasks" value="36" change="+8.2%" icon={<CheckSquare />} tone="green" note="across all jobs" />
            <StatCard title="Services & Items" value="84" change="+4.5%" icon={<Boxes />} tone="orange" note="in your catalogue" />
            <StatCard title="Total Revenue" value={money(28450)} change="+16.4%" icon={<Wallet />} tone="purple" note="this month" />
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
              <div className="bar-chart" aria-label="Illustrative revenue chart">
                {[38, 58, 46, 76, 61, 85, 68].map((height, index) => (
                  <div className="bar-column" key={index}>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ height: `${height}%` }} />
                    </div>
                    <span>{['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'][index]}</span>
                  </div>
                ))}
              </div>
              <div className="chart-footnote">Illustrative chart — replace with actual payment data.</div>
            </div>

            <div className="panel payment-panel">
              <PanelHeading title="Payment status" subtitle="Recent customer records" />
              <div className="payment-donut">
                <div className="donut">
                  <div className="donut-center">
                    <strong>24</strong>
                    <span>Records</span>
                  </div>
                </div>
                <div className="payment-legend">
                  <LegendRow color="green" label="Full payment" value="15" />
                  <LegendRow color="orange" label="Half payment" value="5" />
                  <LegendRow color="red" label="Not paid" value="4" />
                </div>
              </div>
              <p className="chart-footnote">Sample figures for layout preview.</p>
            </div>
          </section>

          <section className="content-grid">
            <div className="panel">
              <PanelHeading
                title="Recent customers"
                subtitle="Your latest customer records"
                action="View all"
                onAction={() => openPage('Customers / Clients')}
              />
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
                      <tr key={customer.name}>
                        <td>
                          <div className="customer-cell">
                            <div className={`customer-avatar ${customer.color}`}>{customer.initials}</div>
                            <div>
                              <strong>{customer.name}</strong>
                              <small>{customer.location}</small>
                            </div>
                          </div>
                        </td>
                        <td className="muted-cell">{customer.phone}</td>
                        <td className="muted-cell">{customer.company}</td>
                        <td>
                          <button
                            className="icon-action"
                            title={`View ${customer.name}`}
                            onClick={() => openPage('Customers / Clients')}
                          >
                            <Eye size={16} />
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
              <PanelHeading
                title="Task progress"
                subtitle="Keep track of ongoing jobs"
                action="View all"
                onAction={() => openPage('Tasks')}
              />
              <div className="task-list">
                {tasks.map((task) => (
                  <div className="task-row" key={task.name}>
                    <div className="task-info">
                      <strong>{task.name}</strong>
                      <span className={`status-pill ${task.status.toLowerCase().replace(' ', '-')}`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="progress-line">
                      <div className="progress">
                        <div
                          className={`progress-bar ${task.status === 'Completed' ? 'complete' : ''}`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <small>{task.progress}%</small>
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-action" onClick={() => openPage('Tasks')}>
                Manage tasks <ArrowUpRight size={15} />
              </button>
            </div>
          </section>

          <section className="bottom-grid">
            <div className="panel">
              <PanelHeading
                title="Recent records"
                subtitle="Latest purchases and payments"
                action="View all"
                onAction={() => openPage('Records & Payments')}
              />
              <div className="records-list">
                {records.map((record) => (
                  <div className="record-row" key={record.customer}>
                    <div className="record-icon"><FileText size={18} /></div>
                    <div className="record-copy">
                      <strong>{record.customer}</strong>
                      <small>{record.item}</small>
                    </div>
                    <div className="record-amount">
                      <strong>{money(record.amount)}</strong>
                      <span className={`status-pill ${record.status.toLowerCase().replace(' ', '-')}`}>
                        {record.status}
                      </span>
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
              <button className="btn btn-outline-primary w-100 report-button" onClick={() => openPage('Financial Report')}>
                View financial report <ArrowUpRight size={16} />
              </button>
            </div>
          </section>

          <footer className="dashboard-footer">
            <span>© 2026 Cavakuz Work Management</span>
            <span>Print · Design · More</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  title, value, change, icon, tone, note
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  tone: string;
  note: string;
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div className="stat-content">
        <span>{title}</span>
        <strong>{value}</strong>
        <div className="stat-change">{change} <small>{note}</small></div>
      </div>
    </div>
  );
}

function PanelHeading({
  title, subtitle, action, onAction
}: {
  title: string;
  subtitle: string;
  action?: string;
  onAction?: () => void;
}) {
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
  );
}

function LegendRow({
  color, label, value
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="legend-row">
      <i className={`legend-dot ${color}`} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
