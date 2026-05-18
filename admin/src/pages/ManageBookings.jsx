import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import AdminLayout from "../common/AdminLayout"
import DataTable from "../common/DataTable"
import { getBookings, updateBooking } from "../services/api"

export default function ManageBookings({ setIsAuthenticated, adminName }) {
  const [bookings,setBookings]=useState([]); const [loading,setLoading]=useState(true)
  const [modal,setModal]=useState(false); const [selected,setSelected]=useState(null); const [status,setStatus]=useState(""); const [saving,setSaving]=useState(false)

  const fetch = async () => { setLoading(true); try{const r=await getBookings();setBookings(r.data.data||[])}catch{toast.error("Failed")}finally{setLoading(false)} }
  useEffect(()=>{fetch()},[])

  const openUpdate = (b) => { setSelected(b); setStatus(b.status); setModal(true) }
  const handleUpdate = async (e) => {
    e.preventDefault(); setSaving(true)
    try { const r=await updateBooking({id:selected._id,status}); if(r.data.success){toast.success("Booking updated!");setModal(false);fetch()} }
    catch(err){toast.error(err.response?.data?.message||"Failed!")} finally{setSaving(false)}
  }

  const badge = (s,type="status") => {
    if(type==="pay") { const m={Success:"bg-success",Pending:"bg-warning text-dark",Failed:"bg-danger"}; return <span className={`badge ${m[s]||"bg-secondary"}`}>{s}</span> }
    const m={Booked:"bg-success",Cancelled:"bg-danger"}; return <span className={`badge ${m[s]||"bg-secondary"}`}>{s}</span>
  }

  const counts = { booked:bookings.filter(b=>b.status==="Booked").length, cancelled:bookings.filter(b=>b.status==="Cancelled").length, revenue:bookings.filter(b=>b.payment_status==="Success").reduce((s,b)=>s+b.amount,0) }

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="mb-4"><h4 className="fw-bold mb-1">Manage Bookings</h4><p className="text-muted mb-0">View and manage all seat reservations.</p></div>
      {!loading&&(<div className="row g-3 mb-4">
        {[{l:"Total",v:bookings.length,c:"#5D87FF"},{l:"Booked",v:counts.booked,c:"#13DEB9"},{l:"Cancelled",v:counts.cancelled,c:"#FA896B"},{l:"Revenue",v:`₹${counts.revenue.toLocaleString("en-IN")}`,c:"#FFAE1F"}].map(s=>(
          <div key={s.l} className="col-md-3"><div className="card" style={{borderLeft:`4px solid ${s.c}`}}><div className="card-body py-3"><p className="text-muted mb-1" style={{fontSize:12}}>{s.l}</p><h4 className="fw-bold mb-0" style={{color:s.c}}>{s.v}</h4></div></div></div>
        ))}
      </div>)}
      <DataTable title="All Bookings" columns={["Customer","Game","Slot","Seat","Amount","Status","Payment","Date","Action"]}
        data={bookings} loading={loading} searchKeys={["user.name","game.name","seat.seat_no","status"]} emptyMessage="No bookings yet."
        renderRow={(b,idx)=>(
          <tr key={b._id}>
            <td>{idx}</td>
            <td><p className="mb-0 fw-semibold" style={{fontSize:13}}>{b.user?.name||"—"}</p><small className="text-muted">{b.user?.email}</small></td>
            <td><span style={{fontSize:13}}>{b.game?.name||"—"}</span></td>
            <td><small className="text-muted">{b.slot?.slot_time_start||"—"} – {b.slot?.slot_time_end||""}</small></td>
            <td><span className="badge bg-light-primary text-primary">{b.seat?.seat_no||"—"}</span></td>
            <td><strong style={{color:"#5D87FF"}}>₹{b.amount}</strong></td>
            <td>{badge(b.status)}</td>
            <td>{badge(b.payment_status||"Pending","pay")}</td>
            <td><span className="text-muted" style={{fontSize:12}}>{b.date?new Date(b.date).toLocaleDateString("en-IN"):"—"}</span></td>
            <td><button className="btn btn-sm btn-outline-primary" onClick={()=>openUpdate(b)}><i className="ti-pencil"/></button></td>
          </tr>
        )}
      />
      {modal&&selected&&(
        <div className="modal fade show d-block" style={{background:"rgba(0,0,0,.5)"}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header"><h5 className="modal-title fw-bold">Update Booking</h5><button type="button" className="btn-close" onClick={()=>setModal(false)}/></div>
              <form onSubmit={handleUpdate}>
                <div className="modal-body">
                  <div className="alert alert-light mb-3" style={{fontSize:13}}>
                    <p className="mb-1"><strong>Customer:</strong> {selected.user?.name}</p>
                    <p className="mb-1"><strong>Game:</strong> {selected.game?.name}</p>
                    <p className="mb-1"><strong>Slot:</strong> {selected.slot?.slot_time_start} – {selected.slot?.slot_time_end}</p>
                    <p className="mb-0"><strong>Seat:</strong> {selected.seat?.seat_no} · ₹{selected.amount}</p>
                  </div>
                  <div className="mb-3"><label className="form-label fw-semibold">Booking Status</label>
                    <select className="form-select" value={status} onChange={e=>setStatus(e.target.value)} required>
                      <option value="Booked">Booked</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={()=>setModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving?<><span className="spinner-border spinner-border-sm me-1"/>Updating...</>:"Update"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
