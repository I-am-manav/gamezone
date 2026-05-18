import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { removeToken } from "../auth/authService"

export default function Navbar({ setIsAuthenticated, adminName }) {
  const navigate = useNavigate()
  const handleLogout = () => { removeToken(); setIsAuthenticated(false); toast.success("Logged out!"); navigate("/login") }
  return (
    <header className="app-header">
      <nav className="navbar navbar-expand-lg navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item d-block d-xl-none">
            <a className="nav-link sidebartoggler nav-icon-hover" href="#t" onClick={e => { e.preventDefault(); document.getElementById("main-wrapper").classList.toggle("show-sidebar") }}>
              <i className="ti-menu-2"></i>
            </a>
          </li>
        </ul>
        <div className="navbar-collapse justify-content-end px-0" id="navbarNav">
          <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end gap-2">
            <li className="nav-item dropdown">
              <a className="nav-link nav-icon-hover" href="#p" id="drop2" data-bs-toggle="dropdown" aria-expanded="false">
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#CBFE1C,#5A7501)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0B0E13", fontWeight: 800, fontSize: 16 }}>
                  {adminName ? adminName.charAt(0).toUpperCase() : "A"}
                </div>
              </a>
              <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop2">
                <div className="message-body">
                  <div style={{ padding: "12px 16px" }}>
                    <p className="mb-0 fw-semibold" style={{ fontSize: 14 }}>{adminName || "Admin"}</p>
                    <small className="text-muted">Administrator</small>
                  </div>
                  <Link to="/profile" className="d-flex align-items-center gap-2 dropdown-item">
                    <i className="ti-user fs-6"></i><p className="mb-0 fs-3">My Profile</p>
                  </Link>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item text-danger cursor-pointer" onClick={handleLogout} style={{ cursor: "pointer" }}>
                    <i className="ti-power fs-6 me-2"></i>Logout
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
