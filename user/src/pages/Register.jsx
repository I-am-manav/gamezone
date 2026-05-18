import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { signup } from "../services/api"

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", password: "", confirm: "" })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error("Passwords don't match!"); return }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters!"); return }
    setLoading(true)
    try {
      const r = await signup({ name: form.name, email: form.email, phone: form.phone, address: form.address, password: form.password })
      if (r.data.success) { toast.success("Account created! Please login."); navigate("/login") }
    } catch (err) { toast.error(err.response?.data?.message || "Registration failed!") }
    finally { setLoading(false) }
  }

  const inp = { width: "100%", padding: "13px 16px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none" }

  return (
    <div style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", background: "#0B0E13" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: "linear-gradient(135deg,#CBFE1C,#5A7501)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>🎮</div>
          <h2 style={{ color: "#fff", fontWeight: 900, marginBottom: 4 }}>Create Account</h2>
          <p style={{ color: "#ABABAB", fontSize: 14 }}>Join GameZone and start booking today!</p>
        </div>
        <div style={{ background: "#1C1D20", border: "1px solid rgba(203,254,28,.15)", borderRadius: 14, padding: 32 }}>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {[{field:"name",label:"Full Name",type:"text",ph:"Aman Patel"},{field:"email",label:"Email",type:"email",ph:"aman@email.com"},{field:"phone",label:"Phone Number",type:"tel",ph:"+91 98765 43210"},{field:"address",label:"Address",type:"text",ph:"City, State"}].map(f => (
                <div key={f.field} className="col-md-6">
                  <label style={{ color: "#ABABAB", fontSize: 13, marginBottom: 6, display: "block" }}>{f.label} *</label>
                  <input type={f.type} style={inp} placeholder={f.ph} value={form[f.field]} onChange={e => setForm({...form,[f.field]:e.target.value})} required />
                </div>
              ))}
              <div className="col-md-6">
                <label style={{ color: "#ABABAB", fontSize: 13, marginBottom: 6, display: "block" }}>Password *</label>
                <input type="password" style={inp} placeholder="Min 6 chars" value={form.password} onChange={e => setForm({...form,password:e.target.value})} required minLength={6} />
              </div>
              <div className="col-md-6">
                <label style={{ color: "#ABABAB", fontSize: 13, marginBottom: 6, display: "block" }}>Confirm Password *</label>
                <input type="password" style={inp} placeholder="Repeat password" value={form.confirm} onChange={e => setForm({...form,confirm:e.target.value})} required />
                {form.confirm && <small style={{ color: form.password===form.confirm?"#CBFE1C":"#ff6b6b", fontSize: 12 }}>{form.password===form.confirm?"✓ Match":"✗ Don't match"}</small>}
              </div>
            </div>
            <button type="submit" className="theme-btn" style={{ width: "100%", padding: "0px", fontSize: 15, marginTop: 20 }} disabled={loading}>
              {loading ? "Creating Account..." : "Create Account →"}
            </button>
          </form>
        </div>
        <p style={{ color: "#ABABAB", textAlign: "center", marginTop: 20, fontSize: 14 }}>
          Already have an account? <Link to="/login" style={{ color: "#CBFE1C", fontWeight: 700 }}>Login</Link>
        </p>
      </div>
    </div>
  )
}
