import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import AdminLayout from "../common/AdminLayout"
import DataTable from "../common/DataTable"
import { getAdminSlots, getAdminGames, addSlot, updateSlot, deleteSlot } from "../services/api"

const empty = { game_id: "", slot_time_start: "", slot_time_end: "", duration: "", price: "", status: "Available" }

export default function ManageSlots({ setIsAuthenticated, adminName }) {
  const [slots, setSlots] = useState([])
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  const fetch = async () => {
    setLoading(true)
    try {
      const [sR, gR] = await Promise.all([getAdminSlots(), getAdminGames()])
      setSlots(sR.data.data || [])
      setGames(gR.data.data || [])
    } catch { toast.error("Failed to load slots") }
    finally { setLoading(false) }
  }
  useEffect(() => { fetch() }, [])

  const openAdd = () => { setEditing(null); setForm(empty); setModal(true) }
  const openEdit = (s) => {
    setEditing(s)
    setForm({ game_id: String(s.game_id || s.game?._id || ""), slot_time_start: s.slot_time_start, slot_time_end: s.slot_time_end, duration: s.duration, price: s.price, status: s.status })
    setModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...form }
      if (editing) payload.id = editing._id
      const res = editing ? await updateSlot(payload) : await addSlot(payload)
      if (res.data.success) { toast.success(editing ? "Slot updated!" : "Slot added!"); setModal(false); fetch() }
    } catch (err) { toast.error(err.response?.data?.message || "Failed!") }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slot?")) return
    try { const r = await deleteSlot(id); if (r.data.success) { toast.success("Slot deleted!"); fetch() } }
    catch (err) { toast.error(err.response?.data?.message || "Delete failed!") }
  }

  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Manage Slots</h4>
        <p className="text-muted mb-0">Configure time slots with pricing for each game.</p>
      </div>

      <DataTable title="All Time Slots" columns={["Game", "Start Time", "End Time", "Duration", "Price", "Status", "Actions"]}
        data={slots} loading={loading} searchKeys={["game.name", "slot_time_start", "status"]} emptyMessage="No slots yet. Add slots for your games!"
        headerAction={<button className="btn btn-primary" onClick={openAdd}><i className="ti-plus me-1" />Add Slot</button>}
        renderRow={(s, idx) => (
          <tr key={s._id}>
            <td>{idx}</td>
            <td>
              <div className="d-flex align-items-center gap-2">
                <div style={{ width: 32, height: 32, borderRadius: 6, background: "linear-gradient(135deg,#CBFE1C,#5A7501)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🎮</div>
                <strong style={{ fontSize: 13 }}>{s.game?.name || "—"}</strong>
              </div>
            </td>
            <td><span className="badge bg-light-primary text-primary">{s.slot_time_start}</span></td>
            <td><span className="badge bg-light-success text-success">{s.slot_time_end}</span></td>
            <td><span className="text-muted" style={{ fontSize: 13 }}>{s.duration} min</span></td>
            <td><strong style={{ color: "#5D87FF", fontSize: 15 }}>₹{s.price}</strong></td>
            <td><span className={`badge ${s.status === "Available" ? "bg-success" : "bg-warning text-dark"}`}>{s.status}</span></td>
            <td>
              <div className="d-flex gap-1">
                <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(s)}><i className="ti-pencil" /></button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s._id)}><i className="ti-trash" /></button>
              </div>
            </td>
          </tr>
        )}
      />

      {modal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{editing ? "Edit Slot" : "Add New Slot"}</h5>
                <button type="button" className="btn-close" onClick={() => setModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Game *</label>
                      <select className="form-select" value={form.game_id} onChange={e => sf("game_id", e.target.value)} required>
                        <option value="">Select a game</option>
                        {games.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Start Time *</label>
                      <input type="text" className="form-control" value={form.slot_time_start} onChange={e => sf("slot_time_start", e.target.value)} placeholder="e.g. 10:00 AM" required />
                      <div className="form-text">Format: 10:00 AM, 2:30 PM</div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">End Time *</label>
                      <input type="text" className="form-control" value={form.slot_time_end} onChange={e => sf("slot_time_end", e.target.value)} placeholder="e.g. 11:00 AM" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Duration (minutes) *</label>
                      <input type="number" className="form-control" value={form.duration} onChange={e => sf("duration", e.target.value)} placeholder="60" min="15" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Price per Slot (₹) *</label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input type="number" className="form-control" value={form.price} onChange={e => sf("price", e.target.value)} placeholder="200" min="1" required />
                      </div>
                    </div>
                    {editing && (
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Status</label>
                        <select className="form-select" value={form.status} onChange={e => sf("status", e.target.value)}>
                          <option value="Available">Available</option>
                          <option value="Booked">Booked</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-1" />{editing ? "Updating..." : "Adding..."}</> : (editing ? "Update Slot" : "Add Slot")}
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
