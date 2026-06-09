import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getGames } from "../services/api"

const BACKEND = import.meta.env.VITE_API_URL

export default function Games() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    getGames().then(r => setGames(r.data.data || [])).catch(() => { }).finally(() => setLoading(false))
  }, [])

  const filtered = games.filter(g => !search || g.name?.toLowerCase().includes(search.toLowerCase()) || g.description?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      {/* Breadcrumb */}
      <div className="gt-breadcrumb-wrapper bg-cover" style={{ backgroundImage: "url(/assets/img/breadcrumb.png)", padding: "80px 0", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(11,14,19,.7)" }} />
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="gt-page-heading text-center">
            <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(2rem,4vw,3rem)", marginBottom: 12 }}>Our Games</h1>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
              <Link to="/" style={{ color: "#ABABAB", fontSize: 14, textDecoration: "none" }}>Home</Link>
              <span style={{ color: "#CBFE1C" }}>›</span>
              <span style={{ color: "#CBFE1C", fontSize: 14, fontWeight: 600 }}>Our Games</span>
            </div>
          </div>
        </div>
      </div>

      <section className="section-padding">
        <div className="container">
          {/* Search */}
          <div style={{ marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>
            <div style={{ position: "relative" }}>
              <i className="fa fa-search" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#CBFE1C" }} />
              <input type="text" placeholder="Search games..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", padding: "14px 16px 14px 44px", background: "#1C1D20", border: "1px solid rgba(203,254,28,.2)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none" }} />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div style={{ width: 40, height: 40, border: "3px solid rgba(203,254,28,.2)", borderTopColor: "#CBFE1C", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto" }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <p style={{ color: "#ABABAB", marginTop: 16 }}>Loading games...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎮</div>
              <h4 style={{ color: "#fff", marginBottom: 8 }}>No games found</h4>
              <p style={{ color: "#ABABAB" }}>Try adjusting your search</p>
            </div>
          ) : (
            <div className="row g-4">
              {filtered.map(g => (
                <div key={g._id} className="col-lg-4 col-md-6">
                  <div style={{ background: "#1C1D20", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, overflow: "hidden", transition: "all .3s", height: "100%", display: "flex", flexDirection: "column" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(203,254,28,.3)"; e.currentTarget.style.transform = "translateY(-4px)" }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.06)"; e.currentTarget.style.transform = "none" }}>
                    <div style={{ height: 220, position: "relative", overflow: "hidden" }}>
                      {g.image ? (
                        <img src={`${BACKEND}${g.image}`} alt={g.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={e => { e.target.style.display = "none" }} />
                      ) : null}
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, background: g.image ? "none" : "linear-gradient(135deg,#1C1D20,#0B0E13)", zIndex: g.image ? -1 : 1 }}>
                        {!g.image && "🎮"}
                      </div>
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(28,29,32,.95) 0%, transparent 60%)", zIndex: 2 }} />
                      <span style={{ position: "absolute", top: 12, right: 12, zIndex: 3, background: g.status === "Active" ? "rgba(203,254,28,.15)" : "rgba(255,60,60,.15)", color: g.status === "Active" ? "#CBFE1C" : "#ff6b6b", border: `1px solid ${g.status === "Active" ? "rgba(203,254,28,.3)" : "rgba(255,60,60,.3)"}`, borderRadius: 4, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                        {g.status}
                      </span>
                    </div>
                    <div style={{ padding: "20px 20px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{g.name}</h3>
                      <p style={{ color: "#ABABAB", fontSize: 13, lineHeight: 1.7, flex: 1, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {g.description}
                      </p>
                      <Link to={`/game/${g._id}`} className="theme-btn" style={{ display: "block", textAlign: "center", padding: "2px 20px", fontSize: 14 }}>
                        {g.status === "Active" ? "Book a Seat →" : "View Details →"}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
