import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import checkSession from "./auth/authService"
import Header from "./common/Header"
import Footer from "./common/Footer"
import Home from "./pages/Home"
import Games from "./pages/Games"
import GameDetail from "./pages/GameDetail"
import MyBookings from "./pages/MyBookings"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import Feedbacks from "./pages/Feedbacks"
import About from "./pages/About"
import Contact from "./pages/Contact"

const Spinner = () => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0B0E13" }}>
    <div style={{ width: 40, height: 40, border: "3px solid rgba(203,254,28,.2)", borderTopColor: "#CBFE1C", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
)

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession().then(({ isAuth, session }) => {
      setIsAuthenticated(isAuth); setUserData(session)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <BrowserRouter>
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} userData={userData} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/game/:id" element={<GameDetail isAuthenticated={isAuthenticated} />} />
        <Route path="/feedbacks" element={<Feedbacks />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} setUserData={setUserData} /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/my-bookings" element={isAuthenticated ? <MyBookings /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile userData={userData} setUserData={setUserData} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} userData={userData} />
    </BrowserRouter>
  )
}
