import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getGames, getFeedbacks } from "../services/api"

const BACKEND = "http://localhost:8000"

export default function Home() {
  const [games, setGames] = useState([])
  const [feedbacks, setFeedbacks] = useState([])

  useEffect(() => {
    getGames().then(r => setGames(r.data.data || [])).catch(() => { })
    getFeedbacks().then(r => setFeedbacks((r.data.data || []).slice(0, 6))).catch(() => { })
  }, [])

  const avg = feedbacks.length ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : "5.0"

  return (
    <div>
      {/* ── HERO ── */}
      <section className="hero-section hero-1 " style={{ minHeight: "90vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 50%, rgba(203,254,28,.08) 0%, transparent 70%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row g-5 align-items-center" style={{
            // marginLeft: "50px"
          }}>
            <div className="col-lg-7">
              <div className="hero-content">
                <p style={{ color: "#CBFE1C", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 3, marginBottom: 16 }}>
                  🎮 #1 Gaming Seat Reservation Platform
                </p>
                <h1 className="wow fadeInUp" style={{ fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: 24, color: "#fff" }}>
                  RESERVE YOUR GAMING SEAT{" "}
                  <span style={{ color: "#CBFE1C" }}>INSTANTLY</span> ONLINE
                </h1>
                <p style={{ color: "#ABABAB", fontSize: 16, lineHeight: 1.8, marginBottom: 36, maxWidth: 520 }}>
                  Browse available games, select your preferred time slot, pick a seat, and pay securely. Skip the queues — start gaming now.
                </p>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 48 }}>
                  <Link to="/games" className="theme-btn" style={{ fontSize: 15, padding: "2px 32px" }}>
                    Browse Games →
                  </Link>
                  {/* <Link to="/register" style={{ padding: "14px 32px", borderRadius: 6, border: "2px solid rgba(255,255,255,.2)", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                    Create Account
                  </Link> */}
                </div>
                {/* Stats */}
                <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
                  {[
                    { n: games.length || "10", s: "+", l: "Games Available" },
                    { n: "500", s: "+", l: "Happy Gamers" },
                    { n: avg, s: "★", l: "Average Rating" },
                  ].map((s, i) => (
                    <div key={i}>
                      <h2 style={{ color: "#CBFE1C", fontWeight: 900, fontSize: 36, marginBottom: 2 }}>
                        {s.n}<span style={{ fontSize: 20 }}>{s.s}</span>
                      </h2>
                      <p style={{ color: "#ABABAB", fontSize: 13, margin: 0 }}>{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block">
              <div style={{ position: "relative" }}>
                <div style={{ width: "100%", maxWidth: 440, borderRadius: 20, overflow: "hidden", border: "2px solid rgba(203,254,28,.2)", boxShadow: "0 0 60px rgba(203,254,28,.12)", aspectRatio: "4/3", background: "#1C1D20", display: "flex", flexDirection: "column", gap: 12, padding: 24 }}>
                  {/* mini game cards preview */}
                  {games.slice(0, 3).map((g, i) => (
                    <div key={g._id} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,.04)", borderRadius: 10, padding: "12px 16px", border: "1px solid rgba(203,254,28,.1)" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 8, background: "linear-gradient(135deg,#CBFE1C,#5A7501)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🎮</div>
                      <div>
                        <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, margin: 0 }}>{g.name}</p>
                        <p style={{ color: "#CBFE1C", fontSize: 12, margin: 0 }}>Available Now</p>
                      </div>
                      <Link to={`/game/${g._id}`} style={{ marginLeft: "auto", background: "#CBFE1C", color: "#0B0E13", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>Book</Link>
                    </div>
                  ))}
                  {games.length === 0 && [1, 2, 3].map(i => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,.04)", borderRadius: 10, padding: "12px 16px", border: "1px solid rgba(203,254,28,.1)" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 8, background: "rgba(203,254,28,.1)", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ height: 12, background: "rgba(255,255,255,.08)", borderRadius: 4, width: "60%", marginBottom: 6 }} />
                        <div style={{ height: 10, background: "rgba(255,255,255,.04)", borderRadius: 4, width: "40%" }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(#CBFE1C,transparent)", opacity: .3, filter: "blur(20px)" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="game-feature-section fix section-padding">
        <div className="container">
          <div className="section-title-2 text-center mb-5">
            <h6 className="subtitle text-uppercase" style={{ letterSpacing: 2, fontSize: 12, marginBottom: 8 }}>Simple Process</h6>
            <h2 className="tx-title">How to Reserve Your <span>Gaming Seat</span></h2>
          </div>
          <div className="row g-4">
            {[
              { icon: "🎮", step: "01", title: "Browse Games", desc: "Explore all available games with descriptions and pricing." },
              { icon: "🕐", step: "02", title: "Pick a Slot", desc: "Choose from available time slots that fit your schedule." },
              { icon: "💺", step: "03", title: "Select a Seat", desc: "Pick any available seat for your preferred game session." },
              { icon: "💳", step: "04", title: "Pay & Confirm", desc: "Secure payment via Razorpay. Instant booking confirmation." },
            ].map((s, i) => (
              <div key={i} className="col-xl-3 col-lg-6 col-md-6">
                <div className="game-feature-box-items" style={{ position: "relative", padding: 28, borderRadius: 12, background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.07)", height: "100%", transition: "all .3s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(203,254,28,.3)"; e.currentTarget.style.background = "rgba(203,254,28,.03)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,.07)"; e.currentTarget.style.background = "rgba(255,255,255,.02)" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
                  <span style={{ color: "#CBFE1C", fontWeight: 800, fontSize: 12, letterSpacing: 2 }}>STEP {s.step}</span>
                  <h4 style={{ color: "#fff", fontWeight: 700, margin: "8px 0 10px", fontSize: 18 }}>{s.title}</h4>
                  <p style={{ color: "#ABABAB", fontSize: 14, margin: 0, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GAMES GRID ── */}
      {games.length > 0 && (
        <div className="game-wrapper section-padding pb-0">
          <div className="container">
            <div className="row g-4 align-items-center mb-4">
              <div className="col-lg-8">
                <div className="section-title">
                  <h6 className="subtitle text-uppercase" style={{ letterSpacing: 2, fontSize: 12 }}>Available Games</h6>
                  <h2 className="tx-title">Book a Seat for Your <span>Favourite Game</span></h2>
                </div>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link to="/games" className="theme-btn">View All Games</Link>
              </div>
            </div>
            <div className="row g-4">
              {games.slice(0, 6).map((g) => (
                <div key={g._id} className="col-lg-4 col-md-6">
                  <div className="game-image-items" style={{ position: "relative", borderRadius: 12, overflow: "hidden", background: "#1C1D20", border: "1px solid rgba(255,255,255,.06)", transition: "all .3s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(203,254,28,.3)"; e.currentTarget.style.transform = "translateY(-4px)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,.06)"; e.currentTarget.style.transform = "none" }}>
                    <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
                      {g.image ? (
                        <img src={`${BACKEND}${g.image}`} alt={g.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px;background:#1C1D20">🎮</div>` }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, background: "linear-gradient(135deg,#1C1D20,#0B0E13)" }}>🎮</div>
                      )}
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(11,14,19,.95) 0%, transparent 55%)" }} />
                    </div>
                    <div className="game-content" style={{ padding: "16px 20px 20px" }}>
                      <h3 style={{ margin: 0 }}>
                        <Link to={`/game/${g._id}`} style={{ color: "#fff", fontWeight: 700, fontSize: 17, textDecoration: "none" }}>{g.name}</Link>
                      </h3>
                      <p style={{ color: "#ABABAB", fontSize: 13, marginTop: 6, marginBottom: 14, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {g.description}
                      </p>
                      <Link to={`/game/${g._id}`} className="theme-btn" style={{ display: "inline-block", padding: "px 20px", fontSize: 13 }}>
                        Book Seat →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CTA BANNER ── */}
      <section className="cta-contact-section section-padding" style={{ marginTop: 60 }}>
        <div className="container">
          <div style={{ background: "linear-gradient(135deg,rgba(203,254,28,.12) 0%, rgba(90,117,1,.12) 100%)", border: "1px solid rgba(203,254,28,.2)", borderRadius: 20, padding: "60px 40px", textAlign: "center" }}>
            <h2 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(1.6rem,3vw,2.4rem)", marginBottom: 12 }}>
              Ready to Start <span style={{ color: "#CBFE1C" }}>Gaming?</span>
            </h2>
            <p style={{ color: "#ABABAB", fontSize: 15, marginBottom: 28 }}>Create your account and reserve a seat in less than 2 minutes.</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/games" className="theme-btn" style={{
                padding: "2px 32px", fontSize: 15
              }}>Browse All Games</Link>
              <Link to="/register" style={{ padding: "14px 32px", borderRadius: 6, border: "2px solid rgba(203,254,28,.4)", color: "#CBFE1C", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>Register Free</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEEDBACKS ── */}
      {feedbacks.length > 0 && (
        <section className="section-padding">
          <div className="container">
            <div className="section-title-2 text-center mb-5">
              <h6 className="subtitle text-uppercase" style={{ letterSpacing: 2, fontSize: 12 }}>Customer Reviews</h6>
              <h2 className="tx-title">What Our <span>Gamers Say</span></h2>
            </div>
            <div className="row g-4">
              {feedbacks.map((f, i) => (
                <div key={f._id || i} className="col-lg-4 col-md-6">
                  <div style={{ background: "#1C1D20", border: "1px solid rgba(255,255,255,.07)", borderRadius: 12, padding: 24, height: "100%" }}>
                    <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} style={{ color: s <= f.rating ? "#CBFE1C" : "rgba(255,255,255,.2)", fontSize: 16 }}>★</span>
                      ))}
                    </div>
                    <p style={{ color: "#ABABAB", fontSize: 14, fontStyle: "italic", lineHeight: 1.7, marginBottom: 16 }}>"{f.feedback}"</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#CBFE1C,#5A7501)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0B0E13", fontWeight: 800, fontSize: 14 }}>
                        {f.user?.name?.charAt(0)?.toUpperCase() || "G"}
                      </div>
                      <div>
                        <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, margin: 0 }}>{f.user?.name || "Gamer"}</p>
                        <p style={{ color: "#CBFE1C", fontSize: 11, margin: 0 }}>{f.rating}/5 Rating</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link to="/feedbacks" className="theme-btn">View All Reviews</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
