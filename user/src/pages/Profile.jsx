import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { getProfile, updateProfile, changePassword } from "../services/api"

const BACKEND = "http://localhost:8000"

export default function Profile({ userData, setUserData }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("info")
  const [saving, setSaving] = useState(false)
  const [changing, setChanging] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [form, setForm] = useState({ name: "", phone: "", address: "" })
  const [passForm, setPassForm] = useState({ newPassword: "", confirm: "" })

  const fetchProfile = async () => {
    try { const r = await getProfile(); const d = r.data.data; setProfile(d); setForm({ name: d.name||"", phone: d.phone||"", address: d.address||"" }) }
    catch { toast.error("Failed to load profile") }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchProfile() }, [])

  const handleSave = async (e) => {
    e?.preventDefault(); setSaving(true)
    try {
      const fd = new FormData()
      fd.append("name", form.name); fd.append("phone", form.phone); fd.append("address", form.address)
      if (imageFile) fd.append("profile_image", imageFile)
      const r = await updateProfile(fd)
      if (r.data.success) { toast.success("Profile updated!"); setImageFile(null); setPreview(null); fetchProfile(); setUserData(prev => ({...prev, name: form.name})) }
    } catch (err) { toast.error(err.response?.data?.message || "Update failed!") }
    finally { setSaving(false) }
  }

  const handlePassChange = async (e) => {
    e.preventDefault()
    if (passForm.newPassword !== passForm.confirm) { toast.error("Passwords don't match!"); return }
    if (passForm.newPassword.length < 6) { toast.error("Min 6 characters!"); return }
    setChanging(true)
    try {
      const r = await changePassword({ email: profile.email, newPassword: passForm.newPassword })
      if (r.data.success) { toast.success("Password changed!"); setPassForm({ newPassword: "", confirm: "" }) }
    } catch (err) { toast.error(err.response?.data?.message || "Failed!") }
    finally { setChanging(false) }
  }

  const avatarSrc = preview ? preview : profile?.profile_image ? `${BACKEND}${profile.profile_image}` : null
  const inp = { width: "100%", padding: "13px 16px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none" }

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0B0E13" }}>
      <div style={{ width: 40, height: 40, border: "3px solid rgba(203,254,28,.2)", borderTopColor: "#CBFE1C", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div>
      <div className="gt-breadcrumb-wrapper bg-cover" style={{ backgroundImage: "url(/assets/img/breadcrumb.png)", padding: "60px 0", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(11,14,19,.7)" }} />
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="gt-page-heading text-center">
            <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(1.8rem,3vw,2.6rem)", marginBottom: 8 }}>My Profile</h1>
            <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
              <Link to="/" style={{ color: "#ABABAB", fontSize: 13, textDecoration: "none" }}>Home</Link>
              <span style={{ color: "#CBFE1C" }}>›</span>
              <span style={{ color: "#CBFE1C", fontSize: 13 }}>Profile</span>
            </div>
          </div>
        </div>
      </div>

      <section className="section-padding">
        <div className="container">
          <div className="row g-5">
            {/* Avatar card */}
            <div className="col-lg-4">
              <div style={{ background: "#1C1D20", border: "1px solid rgba(203,254,28,.15)", borderRadius: 14, overflow: "hidden" }}>
                <div style={{ background: "linear-gradient(135deg,rgba(203,254,28,.15),rgba(90,117,1,.15))", padding: "40px 20px", textAlign: "center" }}>
                  <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
                    {avatarSrc ? (
                      <img src={avatarSrc} alt="Profile" style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: "3px solid #CBFE1C" }} onError={e => e.target.style.display = "none"} />
                    ) : (
                      <div style={{ width: 96, height: 96, borderRadius: "50%", background: "linear-gradient(135deg,#CBFE1C,#5A7501)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: "#0B0E13", fontWeight: 800 }}>
                        {profile?.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    <label htmlFor="avatar-upload" style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: "50%", background: "#CBFE1C", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 13, color: "#0B0E13" }}>
                      📷
                      <input id="avatar-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) { setImageFile(f); setPreview(URL.createObjectURL(f)) } }} />
                    </label>
                  </div>
                  <h4 style={{ color: "#fff", fontWeight: 800, marginBottom: 2 }}>{profile?.name}</h4>
                  <p style={{ color: "#CBFE1C", fontSize: 13, margin: 0 }}>Gaming Member</p>
                </div>
                <div style={{ padding: 20 }}>
                  {[{ icon: "fa-envelope", label: "Email", value: profile?.email }, { icon: "fa-phone", label: "Phone", value: profile?.phone }, { icon: "fa-map-marker", label: "Address", value: profile?.address }].map(item => (
                    <div key={item.label} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                      <i className={`fa ${item.icon}`} style={{ color: "#CBFE1C", marginTop: 2, width: 16, flexShrink: 0 }} />
                      <div>
                        <p style={{ color: "#ABABAB", fontSize: 11, margin: 0 }}>{item.label}</p>
                        <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0 }}>{item.value || "—"}</p>
                      </div>
                    </div>
                  ))}
                  <Link to="/my-bookings" className="theme-btn" style={{ display: "block", textAlign: "center", marginTop: 16, padding: "10px" }}>My Bookings</Link>
                  {imageFile && (
                    <button onClick={handleSave} disabled={saving} style={{ width: "100%", padding: "10px", background: "rgba(203,254,28,.15)", color: "#CBFE1C", border: "1px solid rgba(203,254,28,.3)", borderRadius: 8, marginTop: 8, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
                      {saving ? "Saving..." : "Save New Photo"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="col-lg-8">
              <div style={{ background: "#1C1D20", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, overflow: "hidden" }}>
                <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                  {[{ key: "info", label: "Account Info" }, { key: "password", label: "Change Password" }].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                      style={{ flex: 1, padding: "16px 20px", border: "none", background: "none", cursor: "pointer", fontWeight: activeTab === tab.key ? 700 : 500, color: activeTab === tab.key ? "#CBFE1C" : "rgba(255,255,255,.4)", borderBottom: activeTab === tab.key ? "2px solid #CBFE1C" : "2px solid transparent", fontSize: 14, transition: "all .2s" }}>
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div style={{ padding: 28 }}>
                  {activeTab === "info" && (
                    <form onSubmit={handleSave}>
                      <div className="row g-3">
                        {[{ field: "name", label: "Full Name", type: "text" }, { field: "phone", label: "Phone Number", type: "tel" }].map(f => (
                          <div key={f.field} className="col-md-6">
                            <label style={{ color: "#ABABAB", fontSize: 13, marginBottom: 6, display: "block" }}>{f.label}</label>
                            <input type={f.type} style={inp} value={form[f.field]} onChange={e => setForm({ ...form, [f.field]: e.target.value })} />
                          </div>
                        ))}
                        <div className="col-12">
                          <label style={{ color: "#ABABAB", fontSize: 13, marginBottom: 6, display: "block" }}>Address</label>
                          <input type="text" style={inp} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                        </div>
                        <div className="col-12">
                          <label style={{ color: "#ABABAB", fontSize: 13, marginBottom: 6, display: "block" }}>Email <span style={{ color: "#555", fontSize: 11 }}>(cannot change)</span></label>
                          <div style={{ ...inp, color: "#555", cursor: "not-allowed" }}>{profile?.email}</div>
                        </div>
                      </div>
                      <button type="submit" className="theme-btn" style={{ marginTop: 20, padding: "12px 28px", fontSize: 14 }} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </form>
                  )}
                  {activeTab === "password" && (
                    <form onSubmit={handlePassChange}>
                      <div style={{ background: "rgba(203,254,28,.06)", border: "1px solid rgba(203,254,28,.15)", borderRadius: 8, padding: 14, marginBottom: 20, fontSize: 13, color: "#ABABAB" }}>
                        ⚠️ New password must be at least 6 characters long.
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ color: "#ABABAB", fontSize: 13, marginBottom: 6, display: "block" }}>New Password *</label>
                        <input type="password" style={inp} value={passForm.newPassword} onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })} placeholder="Min 6 characters" required minLength={6} />
                      </div>
                      <div style={{ marginBottom: 24 }}>
                        <label style={{ color: "#ABABAB", fontSize: 13, marginBottom: 6, display: "block" }}>Confirm Password *</label>
                        <input type="password" style={inp} value={passForm.confirm} onChange={e => setPassForm({ ...passForm, confirm: e.target.value })} required />
                        {passForm.confirm && <small style={{ color: passForm.newPassword === passForm.confirm ? "#CBFE1C" : "#ff6b6b", fontSize: 12, marginTop: 4, display: "block" }}>{passForm.newPassword === passForm.confirm ? "✓ Passwords match" : "✗ Passwords don't match"}</small>}
                      </div>
                      <button type="submit" className="theme-btn" style={{ padding: "12px 28px", fontSize: 14 }} disabled={changing}>
                        {changing ? "Updating..." : "Update Password"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
