import React from "react"
import { Link } from "react-router-dom"

export default function Footer({ isAuthenticated, setIsAuthenticated, userData }) {
  return (
    <footer style={{ background: "#0B0E13", borderTop: "1px solid rgba(255,255,255,.06)", padding: "60px 0 30px" }}>
      <div className="container">
        <div className="row g-4 mb-5">
          <div className="col-lg-4">
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: "linear-gradient(135deg,#CBFE1C,#5A7501)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎮</div>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>Game<span style={{ color: "#CBFE1C" }}>Zone</span></span>
            </Link>
            <p style={{ color: "#ABABAB", fontSize: 14, lineHeight: 1.8 }}>
              Book your gaming seat online. Choose your game, pick your time slot, reserve your seat — all in minutes.
            </p>
          </div>
          <div className="col-lg-2 col-md-4">
            <h6 style={{ color: "#CBFE1C", fontWeight: 700, marginBottom: 16, textTransform: "uppercase", fontSize: 13, letterSpacing: 1 }}>Quick Links</h6>
            {[{ to: "/", l: "Home" }, { to: "/games", l: "Games" }, { to: "/feedbacks", l: "Feedbacks" }, { to: "/about", l: "About" }].map(x => (
              <div key={x.to} style={{ marginBottom: 8 }}>
                <Link to={x.to} style={{ color: "#ABABAB", fontSize: 14, textDecoration: "none" }}
                  onMouseEnter={(e) => e.target.style.color = "#CBFE1C"} onMouseLeave={(e) => e.target.style.color = "#ABABAB"}>
                  → {x.l}
                </Link>
              </div>
            ))}
          </div>

          {isAuthenticated ? <>
            <div className="col-lg-2 col-md-4">
              <h6 style={{ color: "#CBFE1C", fontWeight: 700, marginBottom: 16, textTransform: "uppercase", fontSize: 13, letterSpacing: 1 }}>Account</h6>
              {[{ to: "/login", l: "Login" }, { to: "/register", l: "Register" }, { to: "/my-bookings", l: "My Bookings" }, { to: "/profile", l: "Profile" }].map(x => (
                <div key={x.to} style={{ marginBottom: 8 }}>
                  <Link to={x.to} style={{ color: "#ABABAB", fontSize: 14, textDecoration: "none" }}
                    onMouseEnter={(e) => e.target.style.color = "#CBFE1C"} onMouseLeave={(e) => e.target.style.color = "#ABABAB"}>
                    → {x.l}
                  </Link>
                </div>
              ))}
            </div>

          </> : <></>}
          <div className="col-lg-4 col-md-4">
            <h6 style={{ color: "#CBFE1C", fontWeight: 700, marginBottom: 16, textTransform: "uppercase", fontSize: 13, letterSpacing: 1 }}>Contact Info</h6>
            {[
              { icon: "fa-map-marker", text: "Navrangpura, Ahmedabad, Gujarat" },
              { icon: "fa-phone", text: "+91 12345 67890" },
              { icon: "fa-envelope", text: "support@gamezone.in" },
              { icon: "fa-clock", text: "Mon–Sun: 10:00 AM – 11:00 PM" },
            ].map((x, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <i className={`fa ${x.icon}`} style={{ color: "#CBFE1C", marginTop: 2, width: 16, flexShrink: 0 }} />
                <span style={{ color: "#ABABAB", fontSize: 14 }}>{x.text}</span>
              </div>
            ))}
          </div>
        </div>
        <hr style={{ borderColor: "rgba(255,255,255,.08)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, paddingTop: 20 }}>
          <p style={{ color: "#ABABAB", fontSize: 13, margin: 0 }}>© {new Date().getFullYear()} <strong style={{ color: "#CBFE1C" }}>GameZone</strong>. All rights reserved.</p>
          <p style={{ color: "#ABABAB", fontSize: 13, margin: 0 }}>Payments secured by <strong style={{ color: "#CBFE1C" }}>Razorpay</strong></p>
        </div>
      </div>
    </footer>
  )
}
