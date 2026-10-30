import { useEffect, useState } from 'react'
import AppShell from '../../components/AppShell'
import api from '../../../services/axios'

const money = (value: number) => new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(value)

const fallbackReport: Array<{ name: string; value: number }> = []

export default function FinancialReportPage() {
  const [report, setReport] = useState(fallbackReport)
  const [totals, setTotals] = useState({ income: 0, outstanding: 0, expenses: 0 })

  useEffect(() => {
    const loadReport = async () => {
      try {
        const { data } = await api.get('/reports/financial')
        const payload = data?.data ?? data ?? {}

        const income = Number(payload.total_income ?? payload.income ?? totals.income)
        const outstanding = Number(payload.outstanding ?? payload.pending ?? totals.outstanding)
        const expenses = Number(payload.expenses ?? payload.total_expenses ?? totals.expenses)

        setTotals({ income, outstanding, expenses })
        setReport([
          { name: 'Services', value: Number(payload.services ?? 14850) },
          { name: 'Inventory', value: Number(payload.inventory ?? 9800) },
          { name: 'Pending payment', value: outstanding },
          { name: 'Net profit', value: Number(payload.net_profit ?? income - expenses) },
        ])
      } catch {
        setTotals({ income: 0, outstanding: 0, expenses: 0 })
        setReport([])
      }
    }

    loadReport()
  }, [])

  return (
    <AppShell
      activePage="Financial Report"
      pageTitle="Financial Report"
      pageSubtitle="Review revenue, payments due, and monthly business performance."
      action={<button className="add-record-btn">Export report</button>}
    >
      <section className="module-grid">
        <div className="panel module-panel">
          <div className="panel-heading">
            <div>
              <h2>Financial overview</h2>
              <p>Summary across the month</p>
            </div>
          </div>

          <div className="summary-stack">
            <div className="summary-card highlight">
              <span>Total income</span>
              <strong>{money(totals.income)}</strong>
            </div>
            <div className="summary-card">
              <span>Outstanding</span>
              <strong>{money(totals.outstanding)}</strong>
            </div>
            <div className="summary-card">
              <span>Expenses</span>
              <strong>{money(totals.expenses)}</strong>
            </div>
          </div>
        </div>

        <div className="panel module-panel">
          <div className="panel-heading">
            <div>
              <h2>Monthly report</h2>
              <p>Performance by category</p>
            </div>
          </div>

          <div className="report-list">
            {report.length ? report.map((item) => (
              <div className="report-row" key={item.name}>
                <span>{item.name}</span>
                <strong>{money(item.value)}</strong>
              </div>
            )) : <p>No financial data available yet.</p>}
          </div>
        </div>
      </section>
    </AppShell>
  )
}
