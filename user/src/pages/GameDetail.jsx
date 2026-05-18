import React, { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { getGameDetails, getSlots, getSeats, bookSeat, genOrderId, verifyPayment } from "../services/api"

const BACKEND = "http://localhost:8000"
const RAZORPAY_KEY = "rzp_test_SpMwdOCtOvvVKT" // replace with your key

export default function GameDetail({ isAuthenticated }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [game, setGame] = useState(null)
  const [slots, setSlots] = useState([])
  const [seats, setSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [booking, setBooking] = useState(false)
  const [seatsLoading, setSeatsLoading] = useState(false)

  useEffect(() => {
    Promise.all([getGameDetails(id), getSlots(id), getSeats(id)])
      .then(([gR, slR, seR]) => {
        setGame(gR.data.data)
        setSlots(slR.data.data || [])
        setSeats(seR.data.data || [])
      })
      .catch(() => { toast.error("Game not found!"); navigate("/games") })
      .finally(() => setLoading(false))
  }, [id])

  const handleBook = async () => {
    if (!isAuthenticated) { toast.error("Please login to book a seat"); navigate("/login"); return }
    if (!selectedSlot) { toast.error("Please select a time slot"); return }
    if (!selectedSeat) { toast.error("Please select a seat"); return }
    setBooking(true)
    try {
      const bRes = await bookSeat({ game_id: id, slot_id: selectedSlot._id, seat_id: selectedSeat._id })
      if (!bRes.data.success) { toast.error(bRes.data.message); return }
      toast.success("Seat reserved! Initiating payment...")
      // get booking id from my bookings (latest)
      const { myBookings } = await import("../services/api")
      const mbRes = await myBookings()
      const latest = (mbRes.data.data || []).find(b => b.slot_id?.toString() === selectedSlot._id && b.seat_id?.toString() === selectedSeat._id && b.payment_status === "Pending")
      if (!latest) { toast.success("Seat reserved! Go to My Bookings to pay."); navigate("/my-bookings"); return }
      await initiatePayment(latest._id, selectedSlot.price)
    } catch (err) { toast.error(err.response?.data?.message || "Booking failed!") }
    finally { setBooking(false) }
  }

  const initiatePayment = async (booking_id, amount) => {
    try {
      const oRes = await genOrderId({ booking_id })
      if (!oRes.data.success) { toast.error(oRes.data.message); return }
      const { order_id, amount: amt } = oRes.data.data
      const options = {
        key: RAZORPAY_KEY,
        amount: amt,
        currency: "INR",
        name: "GameZone",
        description: `Booking: ${game?.name}`,
        order_id,
        handler: async (response) => {
          try {
            const vRes = await verifyPayment({ booking_id, razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature })
            if (vRes.data.success) { toast.success("Payment successful! Booking confirmed! 🎮"); navigate("/my-bookings") }
          } catch { toast.error("Payment verification failed. Please contact support.") }
        },
        prefill: {},
        theme: { color: "#CBFE1C" },
        modal: { ondismiss: () => { toast.info("Payment cancelled. Your seat is reserved — pay from My Bookings."); navigate("/my-bookings") } }
      }
      if (!window.Razorpay) {
        const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js"; document.body.appendChild(script)
        await new Promise(resolve => script.onload = resolve)
      }
      new window.Razorpay(options).open()
    } catch (err) { toast.error("Could not initiate payment. Seat reserved — pay from My Bookings."); navigate("/my-bookings") }
  }

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0B0E13" }}>
      <div style={{ width: 40, height: 40, border: "3px solid rgba(203,254,28,.2)", borderTopColor: "#CBFE1C", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (!game) return null

  const availableSeats = seats.filter(s => s.status === "Available")

  return (
    <div>
      {/* Breadcrumb */}
      <div className="gt-breadcrumb-wrapper bg-cover" style={{ backgroundImage: "url(/assets/img/breadcrumb.png)", padding: "60px 0", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(11,14,19,.7)" }} />
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="gt-page-heading text-center">
            <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(1.6rem,3vw,2.4rem)", marginBottom: 8 }}>{game.name}</h1>
            <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
              <Link to="/" style={{ color: "#ABABAB", fontSize: 13, textDecoration: "none" }}>Home</Link>
              <span style={{ color: "#CBFE1C" }}>›</span>
              <Link to="/games" style={{ color: "#ABABAB", fontSize: 13, textDecoration: "none" }}>Games</Link>
              <span style={{ color: "#CBFE1C" }}>›</span>
              <span style={{ color: "#CBFE1C", fontSize: 13 }}>{game.name}</span>
            </div>
          </div>
        </div>
      </div>

      <section className="gt-game-details-section section-padding fix">
        <div className="container">

          <div className="row g-5">
            {/* Left: Game Info */}
            <div className="col-lg-8">
              {/* Game Image */}
              <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 28, position: "relative" }}>
                {game.image ? (
                  <img src={`${BACKEND}${game.image}`} alt={game.name} style={{ width: "100%", maxHeight: 400, objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
                ) : (
                  <div style={{ height: 300, background: "linear-gradient(135deg,#1C1D20,#0B0E13)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80 }}>🎮</div>
                )}
              </div>

              {/* Description */}
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 28, marginBottom: 12 }}>{game.name}</h2>
                <p style={{ color: "#ABABAB", fontSize: 15, lineHeight: 1.8 }}>{game.description}</p>
              </div>

              {/* Available Slots */}
              <div style={{ marginBottom: 28 }}>
                <h4 style={{ color: "#fff", fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#CBFE1C" }}>🕐</span> Available Time Slots
                  <span style={{ background: "rgba(203,254,28,.1)", color: "#CBFE1C", fontSize: 12, padding: "2px 10px", borderRadius: 20, fontWeight: 600 }}>{slots.length} available</span>
                </h4>
                {slots.length === 0 ? (
                  <div style={{ background: "#1C1D20", border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, padding: 20, textAlign: "center" }}>
                    <p style={{ color: "#ABABAB", margin: 0 }}>No available slots at this time. Please check back later.</p>
                  </div>
                ) : (
                  <div className="row g-3">
                    {slots.map(s => (
                      <div key={s._id} className="col-md-6">
                        <div onClick={() => setSelectedSlot(selectedSlot?._id === s._id ? null : s)}
                          style={{ background: selectedSlot?._id === s._id ? "rgba(203,254,28,.12)" : "#1C1D20", border: `2px solid ${selectedSlot?._id === s._id ? "#CBFE1C" : "rgba(255,255,255,.08)"}`, borderRadius: 10, padding: "16px 20px", cursor: "pointer", transition: "all .2s" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{s.slot_time_start} – {s.slot_time_end}</p>
                              <p style={{ color: "#ABABAB", fontSize: 12, margin: 0 }}>⏱ {s.duration} min</p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <p style={{ color: "#CBFE1C", fontWeight: 800, fontSize: 20, margin: 0 }}>₹{s.price}</p>
                              {selectedSlot?._id === s._id && <span style={{ color: "#CBFE1C", fontSize: 11, fontWeight: 700 }}>✓ Selected</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Seat Map */}
              {seats.length > 0 && (
                <div>
                  <h4 style={{ color: "#fff", fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#CBFE1C" }}>💺</span> Seat Map
                    <span style={{ background: "rgba(203,254,28,.1)", color: "#CBFE1C", fontSize: 12, padding: "2px 10px", borderRadius: 20, fontWeight: 600 }}>{availableSeats.length}/{seats.length} available</span>
                  </h4>
                  {/* Legend */}
                  <div style={{ display: "flex", gap: 20, marginBottom: 16, flexWrap: "wrap" }}>
                    {[{ color: "#CBFE1C", bg: "rgba(203,254,28,.12)", label: "Selected" }, { color: "#CBFE1C", bg: "rgba(203,254,28,.06)", label: "Available" }, { color: "#ABABAB", bg: "rgba(255,255,255,.04)", label: "Booked" }].map(l => (
                      <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 20, height: 20, borderRadius: 4, background: l.bg, border: `1px solid ${l.color}30` }} />
                        <span style={{ color: "#ABABAB", fontSize: 12 }}>{l.label}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {seats.map(s => {
                      const isSelected = selectedSeat?._id === s._id
                      const isBooked = s.status === "Booked"
                      return (
                        <div key={s._id}
                          onClick={() => !isBooked && setSelectedSeat(isSelected ? null : s)}
                          title={s.seat_no}
                          style={{ width: 52, height: 52, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, cursor: isBooked ? "not-allowed" : "pointer", transition: "all .15s", background: isSelected ? "rgba(203,254,28,.2)" : isBooked ? "rgba(255,255,255,.04)" : "rgba(203,254,28,.06)", border: isSelected ? "2px solid #CBFE1C" : isBooked ? "1px solid rgba(255,255,255,.08)" : "1px solid rgba(203,254,28,.2)", color: isSelected ? "#CBFE1C" : isBooked ? "#555" : "#CBFE1C" }}>
                          <span style={{ fontSize: 16 }}>{isBooked ? "✕" : isSelected ? "✓" : "💺"}</span>
                          <span style={{ fontSize: 9, marginTop: 2 }}>{s.seat_no}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Booking Card */}
            <div className="col-lg-4">
              <div style={{ background: "#1C1D20", border: "1px solid rgba(203,254,28,.15)", borderRadius: 14, padding: 28, position: "sticky", top: 90 }}>
                <h4 style={{ color: "#fff", fontWeight: 800, marginBottom: 4 }}>Reserve Your Seat</h4>
                <p style={{ color: "#ABABAB", fontSize: 13, marginBottom: 20 }}>{game.status === "Active" ? "Book now — slots fill up fast!" : "This game is currently inactive"}</p>

                {/* Summary */}
                <div style={{ background: "rgba(203,254,28,.06)", border: "1px solid rgba(203,254,28,.15)", borderRadius: 10, padding: 16, marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ color: "#ABABAB", fontSize: 13 }}>Game</span>
                    <span style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{game.name}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ color: "#ABABAB", fontSize: 13 }}>Slot</span>
                    <span style={{ color: selectedSlot ? "#CBFE1C" : "#555", fontWeight: 600, fontSize: 13 }}>
                      {selectedSlot ? `${selectedSlot.slot_time_start} – ${selectedSlot.slot_time_end}` : "Not selected"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ color: "#ABABAB", fontSize: 13 }}>Seat</span>
                    <span style={{ color: selectedSeat ? "#CBFE1C" : "#555", fontWeight: 600, fontSize: 13 }}>
                      {selectedSeat ? selectedSeat.seat_no : "Not selected"}
                    </span>
                  </div>
                  <hr style={{ borderColor: "rgba(203,254,28,.1)", margin: "10px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#fff", fontWeight: 700 }}>Total</span>
                    <span style={{ color: "#CBFE1C", fontWeight: 900, fontSize: 24 }}>
                      {selectedSlot ? `₹${selectedSlot.price}` : "₹0"}
                    </span>
                  </div>
                </div>

                {game.status === "Active" && slots.length > 0 ? (
                  <button className="theme-btn" style={{ width: "100%", fontSize: 15, padding: "3px 20px", opacity: booking ? .7 : 1, cursor: booking ? "not-allowed" : "pointer" }}
                    onClick={handleBook} disabled={booking}>
                    {booking ? "Processing..." : isAuthenticated ? "🎮 Book & Pay Now" : "Login to Book"}
                  </button>
                ) : (
                  <div style={{ textAlign: "center", padding: 14, background: "rgba(255,255,255,.04)", borderRadius: 8, color: "#555", fontWeight: 600 }}>
                    {game.status !== "Active" ? "Game Inactive" : "No Slots Available"}
                  </div>
                )}

                {!isAuthenticated && (
                  <p style={{ color: "#ABABAB", fontSize: 12, textAlign: "center", marginTop: 12 }}>
                    <Link to="/login" style={{ color: "#CBFE1C" }}>Login</Link> or <Link to="/register" style={{ color: "#CBFE1C" }}>Register</Link> to book
                  </p>
                )}

                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                  {["🔒 Secure payment via Razorpay", "❌ Cancel anytime from My Bookings", "📧 Instant booking confirmation"].map(t => (
                    <p key={t} style={{ color: "#555", fontSize: 11, margin: 0 }}>{t}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
