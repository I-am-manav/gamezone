import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
const BASE = "http://localhost:8000"
const inp = { width: "100%", padding: "13px 16px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none" }
export default function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState(""); const [otp, setOtp] = useState(""); const [newPass, setNewPass] = useState(""); const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const sendOtp = async (e) => { e.preventDefault(); setLoading(true); try { const r = await axios.post(`${BASE}/sendOtp`, { email }); if (r.data.success) { toast.success("OTP sent to your email!"); setStep(2) } else toast.error(r.data.message) } catch (err) { toast.error(err.response?.data?.message || "Failed!") } finally { setLoading(false) } }
  const verifyOtp = async (e) => { e.preventDefault(); setLoading(true); try { const r = await axios.post(`${BASE}/verifyOtp`, { email, otp }); if (r.data.success) { toast.success("OTP verified!"); setStep(3) } else toast.error(r.data.message) } catch (err) { toast.error(err.response?.data?.message || "Invalid OTP!") } finally { setLoading(false) } }
  const resetPass = async (e) => { e.preventDefault(); if (newPass !== confirm) { toast.error("Passwords don't match!"); return }; setLoading(true); try { const r = await axios.post(`${BASE}/changePassword`, { email, newPassword: newPass }); if (r.data.success) { toast.success("Password changed!"); navigate("/login") } else toast.error(r.data.message) } catch (err) { toast.error(err.response?.data?.message || "Failed!") } finally { setLoading(false) } }
  return (
    <div style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", background: "#0B0E13" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: "linear-gradient(135deg,#CBFE1C,#5A7501)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>🔑</div>
          <h2 style={{ color: "#fff", fontWeight: 900, marginBottom: 4 }}>Forgot Password</h2>
          <p style={{ color: "#ABABAB", fontSize: 14 }}>Step {step} of 3 — {["Enter Email", "Verify OTP", "Set New Password"][step - 1]}</p>
        </div>
        <div style={{ background: "#1C1D20", border: "1px solid rgba(203,254,28,.15)", borderRadius: 14, padding: 32 }}>
          {step === 1 && <form onSubmit={sendOtp}><label style={{ color: "#ABABAB", fontSize: 13, marginBottom: 6, marginTop: 20, display: "block" }}>Email Address *</label><input type="email" style={inp} placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required /><button type="submit" className="theme-btn" style={{ width: "100%", padding: "2px 14px", fontSize: 15, marginTop: 20 }} disabled={loading}>{loading ? "Sending..." : "Send OTP →"}</button></form>}
          {step === 2 && <form onSubmit={verifyOtp}><label style={{ color: "#ABABAB", fontSize: 13, marginBottom: 6, display: "block" }}>Enter OTP *</label><input type="text" style={inp} placeholder="6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} required maxLength={6} /><button type="submit" className="theme-btn" style={{ width: "100%", padding: "2px 14px", fontSize: 15, marginTop: 20 }} disabled={loading}>{loading ? "Verifying..." : "Verify OTP →"}</button></form>}
          {step === 3 && <form onSubmit={resetPass}><div style={{ marginBottom: 16 }}><label style={{ color: "#ABABAB", fontSize: 13, marginBottom: 6, display: "block" }}>New Password *</label><input type="password" style={inp} placeholder="Min 6 characters" value={newPass} onChange={e => setNewPass(e.target.value)} required minLength={6} /></div><div style={{ marginBottom: 20 }}><label style={{ color: "#ABABAB", fontSize: 13, marginBottom: 6, display: "block" }}>Confirm Password *</label><input type="password" style={inp} placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)} required /></div><button type="submit" className="theme-btn" style={{ width: "100%", padding: "14px", fontSize: 15 }} disabled={loading}>{loading ? "Resetting..." : "Reset Password →"}</button></form>}
        </div>
        <p style={{ color: "#ABABAB", textAlign: "center", marginTop: 20, fontSize: 14 }}><Link to="/login" style={{ color: "#CBFE1C", fontWeight: 700 }}>← Back to Login</Link></p>
      </div>
    </div>
  )
}
