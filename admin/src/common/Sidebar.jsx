import React from "react"
import { Link, useLocation } from "react-router-dom"

const menuGroups = [
  { 
    cap: "MAIN", 
    items: [
      { to: "/", icon: "ti-dashboard", label: "Dashboard" }
    ] 
  },

  { 
    cap: "GAME MANAGEMENT", 
    items: [
      { to: "/manage-games", icon: "ti-game",        label: "Manage Games" },
      { to: "/manage-slots", icon: "ti-time",        label: "Manage Slots" },
      { to: "/manage-seats", icon: "ti-layout-grid2",label: "Manage Seats" },
    ]
  },

  { 
    cap: "RESERVATIONS", 
    items: [
      { to: "/manage-bookings", icon: "ti-ticket",       label: "Bookings" },
      { to: "/manage-payments", icon: "ti-wallet",       label: "Payments" },
    ]
  },

  { 
    cap: "USERS & FEEDBACK", 
    items: [
      { to: "/manage-users",     icon: "ti-user",     label: "Users" },
      { to: "/manage-feedbacks", icon: "ti-comment",  label: "Feedbacks" },
    ]
  },

  { 
    cap: "ACCOUNT", 
    items: [
      { to: "/profile", icon: "ti-id-badge", label: "Admin Profile" },
    ]
  },
]

export default function Sidebar() {
  const { pathname } = useLocation()
  return (
    <aside className="left-sidebar">
      <div>
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <Link to="/" className="text-nowrap logo-img d-flex align-items-center gap-2">
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#CBFE1C,#5A7501)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🎮</div>
            <span style={{ fontWeight: 800, fontSize: 16, color: "#2A3547" }}>Game<span style={{ color: "#5D87FF" }}>Zone</span></span>
          </Link>
          <div className="close-btn d-xl-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
            <i className="ti-x fs-8"></i>
          </div>
        </div>
        <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
          <ul id="sidebarnav">
            {menuGroups.map(group => (
              <React.Fragment key={group.cap}>
                <li className="nav-small-cap">
                  <i className="ti-dots nav-small-cap-icon fs-4"></i>
                  <span className="hide-menu">{group.cap}</span>
                </li>
                {group.items.map(item => (
                  <li key={item.to} className={`sidebar-item${pathname === item.to ? " selected" : ""}`}>
                    <Link to={item.to} className={`sidebar-link${pathname === item.to ? " active" : ""}`} aria-expanded="false">
                      <span><i className={`${item.icon}`}></i></span>
                      <span className="hide-menu">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
