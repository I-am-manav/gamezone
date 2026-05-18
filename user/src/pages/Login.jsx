import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { login } from "../services/api"
import { setToken } from "../auth/authService"

export default function Login({ setIsAuthenticated, setUserData }) {
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const r = await login(form)
      if (r.data.success) {
        const role = r.data.userData?.session?.role
        if (role === "Admin") { toast.error("Use admin panel to login as Admin"); return }
        if (role !== "User") { toast.error("Invalid account type"); return }
        setToken(r.data.token); setIsAuthenticated(true); setUserData(r.data.userData?.session)
        toast.success(`Welcome back, ${r.data.userData?.session?.name?.split(" ")[0]}! 🎮`)
        navigate("/")
      }
    } catch (err) { toast.error(err.response?.data?.message || "Login failed!") }
    finally { setLoading(false) }
  }

  const inp = { width: "100%", padding: "13px 16px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none" }

  return (
    <div style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", background: "#0B0E13" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: "linear-gradient(135deg,#CBFE1C,#5A7501)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>🎮</div>
          <h2 style={{ color: "#fff", fontWeight: 900, marginBottom: 4 }}>Welcome Back!</h2>
          <p style={{ color: "#ABABAB", fontSize: 14 }}>Login to your GameZone account</p>
        </div>
        <div style={{ background: "#1C1D20", border: "1px solid rgba(203,254,28,.15)", borderRadius: 14, padding: 32 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "#ABABAB", fontSize: 13, marginBottom: 6, display: "block" }}>Email Address *</label>
              <input type="email" style={inp} placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div style={{ marginBottom: 20, position: "relative" }}>
              <label style={{ color: "#ABABAB", fontSize: 13, marginBottom: 6, display: "block" }}>Password *</label>
              <input type={show ? "text" : "password"} style={inp} placeholder="Your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              <button type="button" onClick={() => setShow(!show)} style={{ position: "absolute", right: 12, top: 50, background: "none", border: "none", color: "#CBFE1C", cursor: "pointer", fontSize: 16 }}>
                {show ? "🙈" : "👁"}
              </button>
            </div>
            <div style={{ textAlign: "right", marginBottom: 20 }}>
              <Link to="/forgot-password" style={{ color: "#CBFE1C", fontSize: 13 }}>Forgot password?</Link>
            </div>
            <button type="submit" className="theme-btn" style={{ width: "100%", padding: "0px", fontSize: 15 }} disabled={loading}>
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>
        </div>
        <p style={{ color: "#ABABAB", textAlign: "center", marginTop: 20, fontSize: 14 }}>
          New to GameZone? <Link to="/register" style={{ color: "#CBFE1C", fontWeight: 700 }}>Create Account</Link>
        </p>
      </div>
    </div>
  )
}
