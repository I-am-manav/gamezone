import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import AdminLayout from "../common/AdminLayout"
import { getProfile, updateProfile, changePassword } from "../services/api"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:8000"

export default function AdminProfile({ setIsAuthenticated, adminName }) {
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
    try { const r = await getProfile(); const d = r.data.data; setProfile(d); setForm({ name: d.name || "", phone: d.phone || "", address: d.address || "" }) }
    catch { toast.error("Failed to load profile") }
    finally { setLoading(false) }
  }

  useEffect(() => {
    const close = () => setProfileOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  useEffect(() => { fetchProfile() }, [])

  const handleSave = async (e) => {
    e?.preventDefault(); setSaving(true)
    try {
      const fd = new FormData()
      fd.append("name", form.name); fd.append("phone", form.phone); fd.append("address", form.address)
      if (imageFile) fd.append("profile_image", imageFile)
      const r = await updateProfile(fd)
      if (r.data.success) { toast.success("Profile updated!"); setImageFile(null); setPreview(null); fetchProfile() }
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

  if (loading) return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="text-center py-5"><div className="spinner-border text-primary" /><p className="mt-3 text-muted">Loading...</p></div>
    </AdminLayout>
  )

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Admin Profile</h4>
        <p className="text-muted mb-0">Manage your account details and security settings.</p>
      </div>

      <div className="row g-4">
        {/* Avatar Card */}
        <div className="col-xl-4 col-lg-5">
          <div className="card">
            <div className="card-body text-center pt-5 pb-4">
              <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
                {avatarSrc ? (
                  <img src={avatarSrc} alt="Admin" style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: "4px solid #5D87FF" }} onError={e => e.target.style.display = "none"} />
                ) : (
                  <div style={{ width: 96, height: 96, borderRadius: "50%", background: "linear-gradient(135deg,#CBFE1C,#5A7501)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: "#0B0E13", fontWeight: 800, margin: "0 auto" }}>
                    {profile?.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <label htmlFor="admin-img" style={{ position: "absolute", bottom: 2, right: 2, width: 28, height: 28, borderRadius: "50%", background: "#5D87FF", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 13, border: "2px solid #fff" }}>
                  <i className="ti-camera" />
                  <input id="admin-img" type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) { setImageFile(f); setPreview(URL.createObjectURL(f)) } }} />
                </label>
              </div>
              <h5 className="fw-bold mb-1">{profile?.name}</h5>
              <span className="badge bg-light-primary text-primary mb-3">Administrator</span>
              <hr />
              <div className="text-start px-2">
                {[{ icon: "ti-mail", label: "Email", value: profile?.email }, { icon: "ti-phone", label: "Phone", value: profile?.phone }, { icon: "ti-map-pin", label: "Address", value: profile?.address }, { icon: "ti-calendar", label: "Joined", value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "—" }].map(item => (
                  <div key={item.label} className="d-flex align-items-start gap-2 mb-3">
                    <i className={`${item.icon}`} style={{ color: "#5D87FF", fontSize: 16, marginTop: 2, width: 18, flexShrink: 0 }} />
                    <div>
                      <p className="text-muted mb-0" style={{ fontSize: 11 }}>{item.label}</p>
                      <p className="mb-0 fw-semibold" style={{ fontSize: 13 }}>{item.value || "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
              {imageFile && (
                <button className="btn btn-primary btn-sm w-100 mt-2" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save New Photo"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="col-xl-8 col-lg-7">
          <div className="card">
            <div className="card-header p-0 border-bottom">
              <ul className="nav nav-tabs card-header-tabs" style={{ paddingLeft: 20 }}>
                {[{ key: "info", icon: "ti-user", label: "Account Info" }, { key: "password", icon: "ti-lock", label: "Change Password" }].map(tab => (
                  <li className="nav-item" key={tab.key}>
                    <button className={`nav-link ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}
                      style={{ border: "none", background: "none", padding: "14px 20px", fontSize: 14 }}>
                      <i className={`${tab.icon} me-1`} />{tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-body p-4">
              {activeTab === "info" && (
                <form onSubmit={handleSave}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Full Name *</label>
                      <input type="text" className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Email <small className="text-muted fw-normal">(cannot change)</small></label>
                      <input type="email" className="form-control" value={profile?.email || ""} disabled style={{ background: "#f8f9fa" }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Phone</label>
                      <input type="tel" className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Role</label>
                      <input type="text" className="form-control" value="Administrator" disabled style={{ background: "#f8f9fa" }} />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Address</label>
                      <textarea className="form-control" rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                    </div>
                  </div>
                  <div className="mt-4 d-flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</> : <><i className="ti-device-floppy me-1" />Save Changes</>}
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setForm({ name: profile?.name || "", phone: profile?.phone || "", address: profile?.address || "" })}>Reset</button>
                  </div>
                </form>
              )}
              {activeTab === "password" && (
                <form onSubmit={handlePassChange}>
                  <div className="alert alert-warning mb-4" style={{ fontSize: 13 }}>
                    <i className="ti-info-circle me-1" />New password must be at least 6 characters.
                  </div>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">New Password *</label>
                      <input type="password" className="form-control" value={passForm.newPassword} onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })} placeholder="Min 6 characters" required minLength={6} />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Confirm Password *</label>
                      <input type="password" className="form-control" value={passForm.confirm} onChange={e => setPassForm({ ...passForm, confirm: e.target.value })} required />
                      {passForm.confirm && (
                        <small className={`mt-1 d-block ${passForm.newPassword === passForm.confirm ? "text-success" : "text-danger"}`}>
                          <i className={`${passForm.newPassword === passForm.confirm ? "ti-check" : "ti-x"} me-1`} />
                          {passForm.newPassword === passForm.confirm ? "Passwords match" : "Passwords don't match"}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <button type="submit" className="btn btn-primary" disabled={changing || passForm.newPassword !== passForm.confirm || passForm.newPassword.length < 6}>
                      {changing ? <><span className="spinner-border spinner-border-sm me-1" />Updating...</> : <><i className="ti-lock-open me-1" />Update Password</>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
