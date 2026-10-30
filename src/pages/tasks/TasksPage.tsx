import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../../components/AppShell'
import api from '../../../services/axios'

type Task = {
  id?: number | string
  name: string
  progress: number
  status: 'In Progress' | 'Completed' | 'Pending'
}

const fallbackTasks: Task[] = []

const asArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[]

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    if (Array.isArray(record.data)) return record.data as T[]
    if (Array.isArray(record.tasks)) return record.tasks as T[]
    if (Array.isArray(record.items)) return record.items as T[]
  }

  return []
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(fallbackTasks)

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const { data } = await api.get('/tasks')
        const nextTasks = asArray<Task>(data)
        if (nextTasks.length) setTasks(nextTasks)
      } catch {
        setTasks(fallbackTasks)
      }
    }

    loadTasks()
  }, [])

  return (
    <AppShell
      activePage="Tasks"
      pageTitle="Tasks"
      pageSubtitle="Track service work, progress, and delivery status."
      action={<Link to="/dashboard/tasks" className="add-record-btn">Add task</Link>}
    >
      <section className="module-grid">
        <div className="panel module-panel">
          <div className="panel-heading">
            <div>
              <h2>Task board</h2>
              <p>Service work with progress tracking</p>
            </div>
          </div>

          <div className="task-stack">
            {tasks.length ? tasks.map((task, index) => (
              <div className="task-card" key={`${task.name}-${index}`}>
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
                <div className="table-actions">
                  <button type="button" className="table-button view-button">View</button>
                  <button type="button" className="table-button edit-button">Edit</button>
                  <button type="button" className="table-button delete-button">Delete</button>
                </div>
              </div>
            )) : <p>No tasks available yet.</p>}
          </div>
        </div>

        <div className="panel module-panel">
          <div className="panel-heading">
            <div>
              <h2>Task summary</h2>
              <p>Performance snapshot</p>
            </div>
          </div>

          <div className="summary-stack">
            <div className="summary-card">
              <span>Open tasks</span>
              <strong>{tasks.filter((task) => task.status !== 'Completed').length}</strong>
            </div>
            <div className="summary-card">
              <span>Completed</span>
              <strong>{tasks.filter((task) => task.status === 'Completed').length}</strong>
            </div>
            <div className="summary-card">
              <span>Avg. progress</span>
              <strong>{Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / Math.max(tasks.length, 1))}%</strong>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  )
}
