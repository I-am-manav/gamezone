import React, { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { removeToken } from "../auth/authService"
import { toast } from "react-toastify"


export default function Header({ isAuthenticated, setIsAuthenticated, userData }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const menuItemStyle = {
    display: "block",
    padding: "12px 16px",
    color: "#fff",
    textDecoration: "none",
    fontSize: 14,
    transition: "all .2s"
  };

  const logoutStyle = {
    width: "100%",
    textAlign: "left",
    padding: "12px 16px",
    background: "none",
    border: "none",
    color: "#ff4d4d",
    cursor: "pointer",
    fontSize: 14
  };
  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    const handleClickOutside = () => setProfileOpen(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    removeToken()
    setIsAuthenticated(false)
    toast.success("Logged out!")
    navigate("/")
  }

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/games", label: "Games" },
    { to: "/feedbacks", label: "Feedbacks" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ]

  return (
    <>
      <header
        id="header-sticky"
        className={`header-1${scrolled ? " sticky" : ""}`}
        style={{ position: "sticky", top: 0, zIndex: 999, background: "#0B0E13", borderBottom: "1px solid rgba(255,255,255,.06)", transition: "all .3s" }}
      >
        <div className="container" style={{ maxWidth: "1400px", padding: "20px" }}>
          <div className="mega-menu-wrapper">
            <div className="header-main" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0" }}>
              {/* Logo */}
              <div className="logo">
                <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "linear-gradient(135deg,#CBFE1C,#5A7501)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎮</div>
                  <span style={{ color: "#fff", fontWeight: 800, fontSize: 20, letterSpacing: 1 }}>Game<span style={{ color: "#CBFE1C" }}>Zone</span></span>
                </Link>
              </div>

              {/* Desktop Nav */}
              <nav style={{ display: "flex", alignItems: "center", gap: 4 }} className="d-none d-xl-flex">
                {navLinks.map((l) => (
                  <Link key={l.to} to={l.to}
                    style={{ color: pathname === l.to ? "#CBFE1C" : "rgba(255,255,255,.75)", padding: "8px 16px", borderRadius: 6, fontWeight: 600, fontSize: 14, textDecoration: "none", transition: "all .2s", background: pathname === l.to ? "rgba(203,254,28,.08)" : "none" }}
                    onMouseEnter={(e) => { if (pathname !== l.to) e.target.style.color = "#CBFE1C" }}
                    onMouseLeave={(e) => { if (pathname !== l.to) e.target.style.color = "rgba(255,255,255,.75)" }}
                  >{l.label}</Link>
                ))}
              </nav>

              {/* Auth Buttons */}
              <div className="header-right d-none d-xl-flex align-items-center gap-3">
                {isAuthenticated ? (
                  <>
                    <div style={{ position: "relative" }}>
                      {/* Profile Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // prevent auto close
                          setProfileOpen(!profileOpen);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "6px 14px",
                          borderRadius: 8,
                          background: "rgba(203,254,28,.12)",
                          border: "1px solid rgba(203,254,28,.3)",
                          color: "#CBFE1C",
                          cursor: "pointer",
                          fontWeight: 600
                        }}
                      >
                        {/* Avatar */}
                        <div style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg,#CBFE1C,#5A7501)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#0B0E13",
                          fontSize: 12,
                          fontWeight: 800
                        }}>
                          {userData?.name?.charAt(0)?.toUpperCase() || "A"}
                        </div>

                        {userData?.name?.split(" ")[0] || "Account"} ▾
                      </button>

                      {/* Dropdown */}
                      {profileOpen && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: "absolute",
                            top: "120%",
                            right: 0,
                            width: 200,
                            background: "#1C1D20",
                            border: "1px solid rgba(255,255,255,.1)",
                            borderRadius: 12,
                            overflow: "hidden",
                            boxShadow: "0 10px 30px rgba(0,0,0,.5)",
                            animation: "fadeIn .2s ease"
                          }}
                        >

                          {/* User Info */}
                          <div style={{ padding: 14, borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                            <p style={{ color: "#fff", margin: 0, fontWeight: 700 }}>
                              {userData?.name || "Gamer"}
                            </p>
                            <p style={{ color: "#CBFE1C", margin: 0, fontSize: 12 }}>
                              Logged In
                            </p>
                          </div>

                          {/* Links */}
                          <Link to="/profile" style={menuItemStyle}>👤 My Profile</Link>
                          <Link to="/my-bookings" style={menuItemStyle}>🎮 My Bookings</Link>

                          {/* Divider */}
                          <div style={{ height: 1, background: "rgba(255,255,255,.08)" }} />

                          {/* Logout */}
                          <button onClick={handleLogout} style={logoutStyle}>
                            🚪 Logout
                          </button>

                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Link to="/login" style={{ color: "rgba(255,255,255,.7)", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>Login</Link>
                    <Link to="/register" className="theme-btn" style={{ padding: "0px 20px", fontSize: 13 }}>Register</Link>
                  </>
                )}
              </div>

              {/* Mobile toggle */}
              <button className="d-xl-none" onClick={() => setMobileOpen(!mobileOpen)}
                style={{ background: "rgba(203,254,28,.1)", border: "1px solid rgba(203,254,28,.3)", borderRadius: 6, padding: "8px 12px", color: "#CBFE1C", cursor: "pointer" }}>
                <i className="fas fa-bars" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "#0B0E13", zIndex: 9999, padding: 24, overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#CBFE1C,#5A7501)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎮</div>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Game<span style={{ color: "#CBFE1C" }}>Zone</span></span>
            </Link>
            <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: 24, cursor: "pointer" }}>✕</button>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to}
                style={{ color: pathname === l.to ? "#CBFE1C" : "rgba(255,255,255,.75)", padding: "14px 16px", borderRadius: 8, fontWeight: 600, fontSize: 16, textDecoration: "none", background: pathname === l.to ? "rgba(203,254,28,.08)" : "none", borderLeft: pathname === l.to ? "3px solid #CBFE1C" : "3px solid transparent" }}>
                {l.label}
              </Link>
            ))}
            <hr style={{ borderColor: "rgba(255,255,255,.1)", margin: "12px 0" }} />
            {isAuthenticated ? (
              <>
                <Link to="/my-bookings" style={{ color: "rgba(255,255,255,.75)", padding: "14px 16px", borderRadius: 8, fontWeight: 600, fontSize: 16, textDecoration: "none" }}>My Bookings</Link>
                <Link to="/profile" style={{ color: "rgba(255,255,255,.75)", padding: "14px 16px", borderRadius: 8, fontWeight: 600, fontSize: 16, textDecoration: "none" }}>Profile</Link>
                <button onClick={handleLogout} style={{ background: "rgba(203,254,28,.1)", border: "1px solid rgba(203,254,28,.3)", borderRadius: 8, padding: "14px 16px", color: "#CBFE1C", fontWeight: 600, fontSize: 16, cursor: "pointer", textAlign: "left", marginTop: 8 }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: "rgba(255,255,255,.75)", padding: "14px 16px", borderRadius: 8, fontWeight: 600, fontSize: 16, textDecoration: "none" }}>Login</Link>
                <Link to="/register" className="theme-btn" style={{ display: "block", textAlign: "center", marginTop: 8, padding: "14px 20px", fontSize: 15 }}>Register</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  )
}
