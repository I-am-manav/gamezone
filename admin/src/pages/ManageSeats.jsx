import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import AdminLayout from "../common/AdminLayout"
import DataTable from "../common/DataTable"
import { getAdminSeats, getAdminGames, addSeat, updateSeat, deleteSeat } from "../services/api"

export default function ManageSeats({ setIsAuthenticated, adminName }) {
  const [seats,setSeats]=useState([]); const [games,setGames]=useState([]); const [loading,setLoading]=useState(true)
  const [modal,setModal]=useState(false); const [form,setForm]=useState({game_id:"",seat_no:""}); const [saving,setSaving]=useState(false); const [toggling,setToggling]=useState(null)

  const fetch = async () => {
    setLoading(true)
    try { const [sR,gR]=await Promise.all([getAdminSeats(),getAdminGames()]); setSeats(sR.data.data||[]); setGames(gR.data.data||[]) }
    catch { toast.error("Failed") } finally { setLoading(false) }
  }
  useEffect(()=>{fetch()},[])

  const handleAdd = async (e) => {
    e.preventDefault(); setSaving(true)
    try { const r=await addSeat(form); if(r.data.success){toast.success("Seat added!");setModal(false);setForm({game_id:"",seat_no:""});fetch()} }
    catch(err){toast.error(err.response?.data?.message||"Failed!")} finally{setSaving(false)}
  }

  const handleToggle = async (seat) => {
    const newStatus = seat.status==="Available"?"Booked":"Available"
    if(!window.confirm(`Mark seat ${seat.seat_no} as ${newStatus}?`)) return
    setToggling(seat._id)
    try { const r=await updateSeat({id:seat._id,status:newStatus}); if(r.data.success){toast.success(`Seat marked as ${newStatus}!`);fetch()} }
    catch(err){toast.error(err.response?.data?.message||"Failed!")} finally{setToggling(null)}
  }

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this seat?")) return
    try { const r=await deleteSeat(id); if(r.data.success){toast.success("Seat deleted!");fetch()} }
    catch(err){toast.error(err.response?.data?.message||"Delete failed!")}
  }

  const avail=seats.filter(s=>s.status==="Available").length

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="mb-4"><h4 className="fw-bold mb-1">Manage Seats</h4><p className="text-muted mb-0">Configure seat capacity for each game.</p></div>
      {!loading&&(<div className="row g-3 mb-4">
        {[{l:"Total Seats",v:seats.length,c:"#5D87FF"},{l:"Available",v:avail,c:"#13DEB9"},{l:"Booked",v:seats.length-avail,c:"#FA896B"}].map(s=>(
          <div key={s.l} className="col-md-4"><div className="card" style={{borderLeft:`4px solid ${s.c}`}}><div className="card-body py-3"><p className="text-muted mb-1" style={{fontSize:12}}>{s.l}</p><h4 className="fw-bold mb-0" style={{color:s.c}}>{s.v}</h4></div></div></div>
        ))}
      </div>)}
      <DataTable title="All Seats" columns={["Game","Seat No","Status","Actions"]}
        data={seats} loading={loading} searchKeys={["game.name","seat_no","status"]} emptyMessage="No seats yet."
        headerAction={<button className="btn btn-primary" onClick={()=>setModal(true)}><i className="ti-plus me-1"/>Add Seat</button>}
        renderRow={(s,idx)=>(
          <tr key={s._id}>
            <td>{idx}</td>
            <td><strong style={{fontSize:13}}>{s.game?.name||"—"}</strong></td>
            <td><span className="badge bg-light-primary text-primary fs-3">{s.seat_no}</span></td>
            <td><span className={`badge ${s.status==="Available"?"bg-success":"bg-warning text-dark"}`}>{s.status}</span></td>
            <td>
              <div className="d-flex gap-1">
                <button className={`btn btn-sm ${s.status==="Available"?"btn-outline-warning":"btn-outline-success"}`} onClick={()=>handleToggle(s)} disabled={toggling===s._id} title={s.status==="Available"?"Mark Booked":"Mark Available"}>
                  {toggling===s._id?<span className="spinner-border spinner-border-sm"/>:<i className={`${s.status==="Available"?"ti-lock":"ti-lock-open"}`}/>}
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={()=>handleDelete(s._id)} title="Delete"><i className="ti-trash"/></button>
              </div>
            </td>
          </tr>
        )}
      />
      {modal&&(
        <div className="modal fade show d-block" style={{background:"rgba(0,0,0,.5)"}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header"><h5 className="modal-title fw-bold">Add New Seat</h5><button type="button" className="btn-close" onClick={()=>setModal(false)}/></div>
              <form onSubmit={handleAdd}>
                <div className="modal-body">
                  <div className="mb-3"><label className="form-label fw-semibold">Game *</label>
                    <select className="form-select" value={form.game_id} onChange={e=>setForm({...form,game_id:e.target.value})} required>
                      <option value="">Select a game</option>
                      {games.map(g=><option key={g._id} value={g._id}>{g.name}</option>)}
                    </select>
                  </div>
                  <div className="mb-3"><label className="form-label fw-semibold">Seat Number *</label>
                    <input type="text" className="form-control" value={form.seat_no} onChange={e=>setForm({...form,seat_no:e.target.value})} placeholder="e.g. A1, B3, S05" required/>
                    <div className="form-text">Must be unique per game. Examples: A1, A2, B1, S01</div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={()=>setModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving?<><span className="spinner-border spinner-border-sm me-1"/>Adding...</>:"Add Seat"}
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
