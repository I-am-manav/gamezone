import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import AdminLayout from "../common/AdminLayout"
import DataTable from "../common/DataTable"
import { getAdminGames, addGame, updateGame, deleteGame } from "../services/api"

const BACKEND = "http://localhost:8000"
const empty = { name: "", description: "", status: "Active" }

export default function ManageGames({ setIsAuthenticated, adminName }) {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetch = async () => {
    setLoading(true)
    try { const r = await getAdminGames(); setGames(r.data.data || []) }
    catch { toast.error("Failed to load games") }
    finally { setLoading(false) }
  }
  useEffect(() => { fetch() }, [])

  const openAdd = () => { setEditing(null); setForm(empty); setImageFile(null); setPreview(null); setModal(true) }
  const openEdit = (g) => { setEditing(g); setForm({ name: g.name, description: g.description, status: g.status || "Active" }); setImageFile(null); setPreview(g.image ? `${BACKEND}${g.image}` : null); setModal(true) }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const fd = new FormData()
      fd.append("name", form.name); fd.append("description", form.description)
      if (editing) { fd.append("id", editing._id); fd.append("status", form.status) }
      if (imageFile) fd.append("image", imageFile)
      const res = editing ? await updateGame(fd) : await addGame(fd)
      if (res.data.success) { toast.success(editing ? "Game updated!" : "Game added!"); setModal(false); fetch() }
    } catch (err) { toast.error(err.response?.data?.message || "Failed!") }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this game? All related slots, seats and bookings may be affected.")) return
    try { const r = await deleteGame(id); if (r.data.success) { toast.success("Game deleted!"); fetch() } }
    catch (err) { toast.error(err.response?.data?.message || "Delete failed!") }
  }

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Manage Games</h4>
        <p className="text-muted mb-0">Add and manage gaming options available for reservation.</p>
      </div>

      <DataTable title="All Games" columns={["Image", "Name", "Description", "Status", "Actions"]}
        data={games} loading={loading} searchKeys={["name", "status"]} emptyMessage="No games yet. Add your first game!"
        headerAction={<button className="btn btn-primary" onClick={openAdd}><i className="ti-plus me-1" />Add Game</button>}
        renderRow={(g, idx) => (
          <tr key={g._id}>
            <td>{idx}</td>
            <td>
              {g.image ? (
                <img src={`${BACKEND}${g.image}`} alt={g.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: 8, background: "linear-gradient(135deg,#CBFE1C,#5A7501)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🎮</div>
              )}
            </td>
            <td><strong style={{ fontSize: 14 }}>{g.name}</strong></td>
            <td><span className="text-muted" style={{ fontSize: 13 }}>{g.description?.slice(0, 60)}{g.description?.length > 60 ? "..." : ""}</span></td>
            <td><span className={`badge ${g.status === "Active" ? "bg-success" : "bg-danger"}`}>{g.status || "Active"}</span></td>
            <td>
              <div className="d-flex gap-1">
                <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(g)} title="Edit"><i className="ti-pencil" /></button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(g._id)} title="Delete"><i className="ti-trash" /></button>
              </div>
            </td>
          </tr>
        )}
      />

      {/* Add/Edit Modal */}
      {modal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{editing ? "Edit Game" : "Add New Game"}</h5>
                <button type="button" className="btn-close" onClick={() => setModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Image Upload */}
                  <div className="text-center mb-4">
                    <div style={{ position: "relative", display: "inline-block" }}>
                      {preview ? (
                        <img src={preview} alt="Preview" style={{ width: 100, height: 100, borderRadius: 12, objectFit: "cover", border: "2px dashed #5D87FF" }} onError={e => e.target.style.display = "none"} />
                      ) : (
                        <div style={{ width: 100, height: 100, borderRadius: 12, background: "linear-gradient(135deg,#CBFE1C,#5A7501)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🎮</div>
                      )}
                      <label htmlFor="game-img" style={{ position: "absolute", bottom: -6, right: -6, width: 28, height: 28, borderRadius: "50%", background: "#5D87FF", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, border: "2px solid #fff" }}>
                        <i className="ti-camera" />
                        <input id="game-img" type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) { setImageFile(f); setPreview(URL.createObjectURL(f)) } }} />
                      </label>
                    </div>
                    <p className="text-muted mt-2 mb-0" style={{ fontSize: 12 }}>Click to upload game image</p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Game Name *</label>
                    <input type="text" className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. VR Shooting, Racing Simulator" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description *</label>
                    <textarea className="form-control" rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the game experience..." required />
                  </div>
                  {editing && (
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Status</label>
                      <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-1" />{editing ? "Updating..." : "Adding..."}</> : (editing ? "Update Game" : "Add Game")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
