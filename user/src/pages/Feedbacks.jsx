import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getFeedbacks } from "../services/api"
export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]); const [loading, setLoading] = useState(true)
  useEffect(() => { getFeedbacks().then(r => setFeedbacks(r.data.data || [])).catch(() => { }).finally(() => setLoading(false)) }, [])
  const avg = feedbacks.length ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : 0
  return (
    <div>
      <div className="gt-breadcrumb-wrapper bg-cover" style={{ backgroundImage: "url(/assets/img/breadcrumb.png)", padding: "60px 0", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(11,14,19,.7)" }} />
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="gt-page-heading text-center">
            <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(1.8rem,3vw,2.6rem)", marginBottom: 8 }}>Customer Reviews</h1>
            <div style={{ display: "flex", justifyContent: "center", gap: 8 }}><Link to="/" style={{ color: "#ABABAB", fontSize: 13, textDecoration: "none" }}>Home</Link><span style={{ color: "#CBFE1C" }}>›</span><span style={{ color: "#CBFE1C", fontSize: 13 }}>Feedbacks</span></div>
          </div>
        </div>
      </div>
      <section className="section-padding">
        <div className="container">
          {!loading && feedbacks.length > 0 && (
            <div style={{ background: "#1C1D20", border: "1px solid rgba(203,254,28,.15)", borderRadius: 14, padding: 28, marginBottom: 40, display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap" }}>
              <div className="text-center">
                <div style={{ fontSize: 64, fontWeight: 900, color: "#CBFE1C", lineHeight: 1 }}>{avg}</div>
                <div style={{ display: "flex", justifyContent: "center", gap: 4, margin: "8px 0" }}>{[1, 2, 3, 4, 5].map(s => <span key={s} style={{ color: s <= Math.round(avg) ? "#CBFE1C" : "rgba(255,255,255,.2)", fontSize: 20 }}>★</span>)}</div>
                <p style={{ color: "#ABABAB", fontSize: 13, margin: 0 }}>{feedbacks.length} total reviews</p>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                {[5, 4, 3, 2, 1].map(star => {
                  const c = feedbacks.filter(r => Math.round(r.rating) === star).length; const p = feedbacks.length ? Math.round((c / feedbacks.length) * 100) : 0; return (
                    <div key={star} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ color: "#ABABAB", fontSize: 13, width: 20 }}>{star}</span><span style={{ color: "#CBFE1C" }}>★</span>
                      <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,.08)", borderRadius: 3 }}><div style={{ width: `${p}%`, height: "100%", background: "linear-gradient(90deg,#CBFE1C,#5A7501)", borderRadius: 3 }} /></div>
                      <span style={{ color: "#ABABAB", fontSize: 12, width: 24 }}>{c}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          {loading ? (<div className="text-center py-5"><div style={{ width: 40, height: 40, border: "3px solid rgba(203,254,28,.2)", borderTopColor: "#CBFE1C", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto" }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>)
            : feedbacks.length === 0 ? (<div style={{ textAlign: "center", padding: "80px 0" }}><div style={{ fontSize: 64, marginBottom: 16 }}>⭐</div><h4 style={{ color: "#fff", marginBottom: 8 }}>No reviews yet</h4><p style={{ color: "#ABABAB" }}>Be the first to review after your gaming session!</p></div>)
              : (<div className="row g-4">{feedbacks.map((f, i) => (
                <div key={f._id || i} className="col-lg-4 col-md-6">
                  <div style={{ background: "#1C1D20", border: "1px solid rgba(255,255,255,.07)", borderRadius: 12, padding: 24, height: "100%" }}>
                    <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>{[1, 2, 3, 4, 5].map(s => <span key={s} style={{ color: s <= f.rating ? "#CBFE1C" : "rgba(255,255,255,.2)", fontSize: 18 }}>★</span>)}</div>
                    <p style={{ color: "#ABABAB", fontSize: 14, fontStyle: "italic", lineHeight: 1.7, marginBottom: 16 }}>"{f.feedback}"</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#CBFE1C,#5A7501)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0B0E13", fontWeight: 800, fontSize: 14 }}>{f.user?.name?.charAt(0)?.toUpperCase() || "G"}</div>
                      <div><p style={{ color: "#fff", fontWeight: 700, fontSize: 13, margin: 0 }}>{f.user?.name || "Gamer"}</p><p style={{ color: "#CBFE1C", fontSize: 11, margin: 0 }}>{f.rating}/5 · {f.game?.name || ""}</p></div>
                    </div>
                  </div>
                </div>
              ))}</div>)}
        </div>
      </section>
    </div>
  )
}
