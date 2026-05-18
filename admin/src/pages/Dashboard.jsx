import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AdminLayout from "../common/AdminLayout"
import { getDashboardStats } from "../services/api"

export default function Dashboard({ setIsAuthenticated, adminName }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats().then(r => setStats(r.data.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const cards = stats ? [
  { label: "Total Users",      value: stats.totalUsers,      icon: "ti-user",          color: "#5D87FF", bg: "#ECF2FF" },

  { label: "Total Games",      value: stats.totalGames,      icon: "ti-game",          color: "#13DEB9", bg: "#E6FFFA" },

  { label: "Active Games",     value: stats.activeGames,     icon: "ti-check-box",     color: "#FFAE1F", bg: "#FEF5E5" },

  { label: "Total Slots",      value: stats.totalSlots,      icon: "ti-time",          color: "#FA896B", bg: "#FBF2EF" },

  { label: "Available Slots",  value: stats.availableSlots,  icon: "ti-timer",         color: "#13DEB9", bg: "#E6FFFA" },

  { label: "Total Seats",      value: stats.totalSeats,      icon: "ti-layout",        color: "#5D87FF", bg: "#ECF2FF" },

  { label: "Available Seats",  value: stats.availableSeats,  icon: "ti-view-grid",     color: "#FFAE1F", bg: "#FEF5E5" },

  { label: "Total Bookings",   value: stats.totalBookings,   icon: "ti-ticket",        color: "#FA896B", bg: "#FBF2EF" },

  { label: "Active Bookings",  value: stats.activeBookings,  icon: "ti-check",         color: "#13DEB9", bg: "#E6FFFA" },

  { label: "Cancelled",        value: stats.cancelledBookings, icon: "ti-close",      color: "#FA896B", bg: "#FBF2EF" },

  { label: "Total Revenue",    value: `₹${(stats.totalRevenue || 0).toLocaleString("en-IN")}`, icon: "ti-money", color: "#5D87FF", bg: "#ECF2FF" },

  { label: "Avg. Rating",      value: `${stats.avgRating}/5`, icon: "ti-star",        color: "#FFAE1F", bg: "#FEF5E5" },
] : []

  const badge = (s) => {
    const m = { Booked: "bg-success", Cancelled: "bg-danger", Pending: "bg-warning", Success: "bg-success", Failed: "bg-danger" }
    return <span className={`badge ${m[s] || "bg-secondary"}`}>{s}</span>
  }

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Dashboard 🎮</h4>
          <p className="text-muted mb-0">Welcome back, <strong>{adminName}</strong>! Here's your platform overview.</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/manage-games" className="btn btn-primary btn-sm"><i className="ti-plus me-1" />Add Game</Link>
          <Link to="/manage-bookings" className="btn btn-outline-primary btn-sm"><i className="ti-ticket me-1" />Bookings</Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /><p className="mt-3 text-muted">Loading dashboard...</p></div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="row g-4 mb-4">
            {cards.map((c, i) => (
              <div key={i} className="col-xl-3 col-md-6">
                <div className="card h-100 card-hover">
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between">
                      <div style={{ width: 48, height: 48, borderRadius: 10, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className={`${c.icon}`} style={{ fontSize: 24, color: c.color }} />
                      </div>
                      <h3 className="fw-bold mb-0" style={{ color: c.color, fontSize: "1.6rem" }}>{c.value}</h3>
                    </div>
                    <p className="text-muted mb-0 mt-3 fw-semibold" style={{ fontSize: 13 }}>{c.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Bookings */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-semibold">Recent Bookings</h5>
              <Link to="/manage-bookings" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr><th>#</th><th>Customer</th><th>Game</th><th>Slot</th><th>Seat</th><th>Amount</th><th>Status</th><th>Payment</th></tr>
                  </thead>
                  <tbody>
                    {!stats?.recentBookings?.length ? (
                      <tr><td colSpan="8" className="text-center py-4 text-muted">No bookings yet</td></tr>
                    ) : stats.recentBookings.map((b, i) => (
                      <tr key={b._id}>
                        <td>{i + 1}</td>
                        <td>
                          <p className="mb-0 fw-semibold" style={{ fontSize: 13 }}>{b.user?.name || "—"}</p>
                          <small className="text-muted">{b.user?.email}</small>
                        </td>
                        <td><span style={{ fontSize: 13 }}>{b.game?.name || "—"}</span></td>
                        <td><small className="text-muted">{b.slot?.slot_time_start} – {b.slot?.slot_time_end}</small></td>
                        <td><span className="badge bg-light-primary text-primary">{b.seat?.seat_no || "—"}</span></td>
                        <td><strong style={{ color: "#5D87FF" }}>₹{b.amount}</strong></td>
                        <td>{badge(b.status)}</td>
                        <td>{badge(b.payment_status || "Pending")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Payments */}
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-semibold">Recent Payments</h5>
              <Link to="/manage-payments" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr><th>#</th><th>Customer</th><th>Amount</th><th>Payment ID</th><th>Date</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {!stats?.recentPayments?.length ? (
                      <tr><td colSpan="6" className="text-center py-4 text-muted">No payments yet</td></tr>
                    ) : stats.recentPayments.map((p, i) => (
                      <tr key={p._id}>
                        <td>{i + 1}</td>
                        <td>
                          <p className="mb-0 fw-semibold" style={{ fontSize: 13 }}>{p.user?.name || "—"}</p>
                          <small className="text-muted">{p.user?.email}</small>
                        </td>
                        <td><strong style={{ color: "#5D87FF", fontSize: 15 }}>₹{p.amount}</strong></td>
                        <td><code style={{ fontSize: 11 }}>{p.razorpay_payment_id?.slice(0, 16) || "—"}</code></td>
                        <td><span className="text-muted" style={{ fontSize: 12 }}>{p.date ? new Date(p.date).toLocaleDateString("en-IN") : "—"}</span></td>
                        <td>{badge(p.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
