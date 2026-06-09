import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { myBookings, cancelBooking, genOrderId, verifyPayment, addFeedback } from "../services/api"

const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:8000"
const RAZORPAY_KEY = "rzp_test_SpMwdOCtOvvVKT"

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelId, setCancelId] = useState(null)
  const [cancelling, setCancelling] = useState(false)
  const [feedbackModal, setFeedbackModal] = useState(null)
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, feedback: "" })
  const [submitting, setSubmitting] = useState(false)
  const [paying, setPaying] = useState(null)

  const fetchBookings = async () => {
    setLoading(true)
    try { const r = await myBookings(); setBookings(r.data.data || []) }
    catch { toast.error("Failed to load bookings") }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchBookings() }, [])

  const handleCancel = async (id) => {
    setCancelling(true)
    try {
      const r = await cancelBooking({ booking_id: id })
      if (r.data.success) { toast.success("Booking cancelled!"); setCancelId(null); fetchBookings() }
    } catch (err) { toast.error(err.response?.data?.message || "Cancel failed!") }
    finally { setCancelling(false) }
  }

  const handlePay = async (booking) => {
    setPaying(booking._id)
    try {
      const oRes = await genOrderId({ booking_id: booking._id })
      if (!oRes.data.success) { toast.error(oRes.data.message); return }
      const { order_id, amount } = oRes.data.data
      const options = {
        key: RAZORPAY_KEY, amount, currency: "INR",
        name: "GameZone", description: `${booking.game?.name} - ${booking.seat?.seat_no}`,
        order_id,
        handler: async (response) => {
          try {
            const vRes = await verifyPayment({ booking_id: booking._id, razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature })
            if (vRes.data.success) { toast.success("Payment successful! 🎮"); fetchBookings() }
          } catch { toast.error("Payment verification failed.") }
        },
        theme: { color: "#CBFE1C" }
      }
      if (!window.Razorpay) {
        const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js"
        document.body.appendChild(script); await new Promise(r => script.onload = r)
      }
      new window.Razorpay(options).open()
    } catch { toast.error("Payment failed") }
    finally { setPaying(null) }
  }

  const handleFeedback = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try {
      const r = await addFeedback({ booking_id: feedbackModal._id, rating: feedbackForm.rating, feedback: feedbackForm.feedback })
      if (r.data.success) { toast.success("Feedback submitted! Thank you!"); setFeedbackModal(null); setFeedbackForm({ rating: 5, feedback: "" }) }
    } catch (err) { toast.error(err.response?.data?.message || "Failed!") }
    finally { setSubmitting(false) }
  }

  const statusColor = (s) => ({ Booked: "#CBFE1C", Cancelled: "#ff6b6b" }[s] || "#ABABAB")
  const payColor = (s) => ({ Success: "#CBFE1C", Pending: "#ffa500", Failed: "#ff6b6b" }[s] || "#ABABAB")

  return (
    <div>
      <div className="gt-breadcrumb-wrapper bg-cover" style={{ backgroundImage: "url(/assets/img/breadcrumb.png)", padding: "60px 0", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(11,14,19,.7)" }} />
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="gt-page-heading text-center">
            <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(1.8rem,3vw,2.6rem)", marginBottom: 8 }}>My Bookings</h1>
            <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
              <Link to="/" style={{ color: "#ABABAB", fontSize: 13, textDecoration: "none" }}>Home</Link>
              <span style={{ color: "#CBFE1C" }}>›</span>
              <span style={{ color: "#CBFE1C", fontSize: 13 }}>My Bookings</span>
            </div>
          </div>
        </div>
      </div>

      <section className="section-padding">
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div style={{ width: 40, height: 40, border: "3px solid rgba(203,254,28,.2)", borderTopColor: "#CBFE1C", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto" }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎮</div>
              <h4 style={{ color: "#fff", marginBottom: 8 }}>No bookings yet</h4>
              <p style={{ color: "#ABABAB", marginBottom: 24 }}>Book your first gaming seat now!</p>
              <Link to="/games" className="theme-btn">Browse Games</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {bookings.map(b => (
                <div key={b._id} style={{ background: "#1C1D20", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: 24 }}>
                  <div className="row g-4 align-items-start">
                    {/* Game info */}
                    <div className="col-md-3">
                      <div style={{ width: "100%", maxWidth: 120, height: 90, borderRadius: 8, overflow: "hidden", background: "#0B0E13", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
                        {b.game?.image ? <img src={`${BACKEND}${b.game.image}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} /> : "🎮"}
                      </div>
                    </div>
                    <div className="col-md-5">
                      <h4 style={{ color: "#fff", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{b.game?.name || "Game"}</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ color: "#ABABAB", fontSize: 13 }}>🕐 {b.slot?.slot_time_start} – {b.slot?.slot_time_end} ({b.slot?.duration} min)</span>
                        <span style={{ color: "#ABABAB", fontSize: 13 }}>💺 Seat: <strong style={{ color: "#CBFE1C" }}>{b.seat?.seat_no}</strong></span>
                        <span style={{ color: "#ABABAB", fontSize: 13 }}>📅 {b.date ? new Date(b.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {/* Status badges */}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ background: `${statusColor(b.status)}15`, color: statusColor(b.status), border: `1px solid ${statusColor(b.status)}30`, borderRadius: 4, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{b.status}</span>
                          <span style={{ background: `${payColor(b.payment_status)}15`, color: payColor(b.payment_status), border: `1px solid ${payColor(b.payment_status)}30`, borderRadius: 4, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>₹{b.amount} · {b.payment_status || "Pending"}</span>
                        </div>
                        {/* Action buttons */}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {b.status === "Booked" && b.payment_status !== "Success" && (
                            <button className="theme-btn" style={{ padding: "7px 14px", fontSize: 12, opacity: paying === b._id ? .7 : 1 }}
                              onClick={() => handlePay(b)} disabled={paying === b._id}>
                              {paying === b._id ? "..." : "💳 Pay"}
                            </button>
                          )}
                          {b.status === "Booked" && (
                            <button onClick={() => setCancelId(b._id)} style={{ padding: "7px 14px", fontSize: 12, background: "rgba(255,107,107,.1)", color: "#ff6b6b", border: "1px solid rgba(255,107,107,.3)", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
                              ✕ Cancel
                            </button>
                          )}
                          {b.status === "Booked" && b.payment_status === "Success" && (
                            <button onClick={() => { setFeedbackModal(b); setFeedbackForm({ rating: 5, feedback: "" }) }}
                              style={{ padding: "7px 14px", fontSize: 12, background: "rgba(203,254,28,.1)", color: "#CBFE1C", border: "1px solid rgba(203,254,28,.3)", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
                              ⭐ Review
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cancel Confirm Modal */}
      {cancelId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#1C1D20", border: "1px solid rgba(255,107,107,.3)", borderRadius: 14, padding: 32, maxWidth: 400, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <h4 style={{ color: "#fff", marginBottom: 8 }}>Cancel Booking?</h4>
            <p style={{ color: "#ABABAB", fontSize: 14, marginBottom: 24 }}>This will release your reserved seat and time slot. This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setCancelId(null)} style={{ flex: 1, padding: 12, background: "rgba(255,255,255,.06)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Keep Booking</button>
              <button onClick={() => handleCancel(cancelId)} disabled={cancelling}
                style={{ flex: 1, padding: 12, background: "rgba(255,107,107,.15)", color: "#ff6b6b", border: "1px solid rgba(255,107,107,.3)", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#1C1D20", border: "1px solid rgba(203,254,28,.2)", borderRadius: 14, padding: 32, maxWidth: 460, width: "100%" }}>
            <h4 style={{ color: "#fff", fontWeight: 700, marginBottom: 4 }}>Leave a Review</h4>
            <p style={{ color: "#ABABAB", fontSize: 13, marginBottom: 24 }}>How was your experience with <strong style={{ color: "#CBFE1C" }}>{feedbackModal.game?.name}</strong>?</p>
            <form onSubmit={handleFeedback}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: "#ABABAB", fontSize: 13, marginBottom: 8, display: "block" }}>Rating *</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} type="button" onClick={() => setFeedbackForm(f => ({ ...f, rating: s }))}
                      style={{ width: 44, height: 44, borderRadius: 8, border: s <= feedbackForm.rating ? "2px solid #CBFE1C" : "1px solid rgba(255,255,255,.12)", background: s <= feedbackForm.rating ? "rgba(203,254,28,.12)" : "rgba(255,255,255,.04)", color: s <= feedbackForm.rating ? "#CBFE1C" : "#ABABAB", fontSize: 20, cursor: "pointer" }}>
                      ★
                    </button>
                  ))}
                  <span style={{ color: "#CBFE1C", fontWeight: 700, fontSize: 16, alignSelf: "center", marginLeft: 8 }}>{feedbackForm.rating}/5</span>
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ color: "#ABABAB", fontSize: 13, marginBottom: 8, display: "block" }}>Your Review *</label>
                <textarea rows={4} placeholder="Share your gaming experience..." value={feedbackForm.feedback}
                  onChange={e => setFeedbackForm(f => ({ ...f, feedback: e.target.value }))} required
                  style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, color: "#fff", fontSize: 14, resize: "vertical", outline: "none" }} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button type="button" onClick={() => setFeedbackModal(null)} style={{ flex: 1, padding: 12, background: "rgba(255,255,255,.06)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                <button type="submit" className="theme-btn" style={{ flex: 2, padding: 12, fontSize: 14 }} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
