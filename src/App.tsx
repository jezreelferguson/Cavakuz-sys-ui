import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Auth/login.tsx'
import Notfound from './pages/notfound.tsx'
import Dashboard from './pages/dashboard/dashboard.tsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Notfound />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
    </Routes>
  )
}

export default App
