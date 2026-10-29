import { useState } from 'react'
import Login from './pages/Auth/login.tsx'
import { Routes, Route } from 'react-router'
import Dashboard from './pages/dashboard/dashboard.tsx'
// import './App.css'


function App() {
  // const [count, setCount] = useState(0)

  return (
    // <h1 className="display-1 text-primary">Welcome Back</h1>
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App
