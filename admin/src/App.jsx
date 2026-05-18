import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import checkSession from "./auth/authService"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import ManageGames from "./pages/ManageGames"
import ManageSlots from "./pages/ManageSlots"
import ManageSeats from "./pages/ManageSeats"
import ManageBookings from "./pages/ManageBookings"
import ManageUsers from "./pages/ManageUsers"
import ManagePayments from "./pages/ManagePayments"
import ManageFeedbacks from "./pages/ManageFeedbacks"
import AdminProfile from "./pages/AdminProfile"

const Spinner = () => (
  <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div className="spinner-border text-primary" />
  </div>
)

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminName, setAdminName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession().then(({ isAuth, session }) => {
      setIsAuthenticated(isAuth)
      if (session?.name) setAdminName(session.name)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  const props = { setIsAuthenticated, adminName }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} setAdminName={setAdminName} /> : <Navigate to="/" />} />
        <Route path="/" element={isAuthenticated ? <Dashboard {...props} /> : <Navigate to="/login" />} />
        <Route path="/manage-games" element={isAuthenticated ? <ManageGames {...props} /> : <Navigate to="/login" />} />
        <Route path="/manage-slots" element={isAuthenticated ? <ManageSlots {...props} /> : <Navigate to="/login" />} />
        <Route path="/manage-seats" element={isAuthenticated ? <ManageSeats {...props} /> : <Navigate to="/login" />} />
        <Route path="/manage-bookings" element={isAuthenticated ? <ManageBookings {...props} /> : <Navigate to="/login" />} />
        <Route path="/manage-users" element={isAuthenticated ? <ManageUsers {...props} /> : <Navigate to="/login" />} />
        <Route path="/manage-payments" element={isAuthenticated ? <ManagePayments {...props} /> : <Navigate to="/login" />} />
        <Route path="/manage-feedbacks" element={isAuthenticated ? <ManageFeedbacks {...props} /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <AdminProfile {...props} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  )
}
