import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Auth/login.tsx'
import Dashboard from './pages/dashboard/dashboard.tsx'
import CustomersPage from './pages/customers/CustomersPage.tsx'
import CustomerCreatePage from './pages/customers/create.tsx'
import CustomerEditPage from './pages/customers/edit.tsx'
import CustomerShowPage from './pages/customers/show.tsx'
import TasksPage from './pages/tasks/TasksPage.tsx'
import InventoryPage from './pages/inventory/InventoryPage.tsx'
import RecordsPage from './pages/records/RecordsPage.tsx'
import RecordCreatePage from './pages/records/create.tsx'
import RecordEditPage from './pages/records/edit.tsx'
import RecordShowPage from './pages/records/show.tsx'
import FinancialReportPage from './pages/reports/FinancialReportPage.tsx'
import InvoicesPage from './pages/invoices/InvoicesPage.tsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/customers" element={<CustomersPage />} />
      <Route path="/dashboard/customers/new" element={<CustomerCreatePage />} />
      <Route path="/dashboard/customers/:id" element={<CustomerShowPage />} />
      <Route path="/dashboard/customers/:id/edit" element={<CustomerEditPage />} />
      <Route path="/dashboard/tasks" element={<TasksPage />} />
      <Route path="/dashboard/inventory" element={<InventoryPage />} />
      <Route path="/dashboard/records" element={<RecordsPage />} />
      <Route path="/dashboard/records/new" element={<RecordCreatePage />} />
      <Route path="/dashboard/records/:id" element={<RecordShowPage />} />
      <Route path="/dashboard/records/:id/edit" element={<RecordEditPage />} />
      <Route path="/dashboard/financial-report" element={<FinancialReportPage />} />
      <Route path="/dashboard/invoices" element={<InvoicesPage />} />
    </Routes>
  )
}

export default App
