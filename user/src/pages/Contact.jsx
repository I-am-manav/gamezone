import React from "react"
import { Link } from "react-router-dom"
export default function Contact() {
  return (
    <div>
      <div className="gt-breadcrumb-wrapper bg-cover" style={{ backgroundImage: "url(/assets/img/breadcrumb.png)", padding: "60px 0", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(11,14,19,.7)" }} />
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="gt-page-heading text-center">
            <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(1.8rem,3vw,2.6rem)", marginBottom: 8 }}>Contact Us</h1>
            <div style={{ display: "flex", justifyContent: "center", gap: 8 }}><Link to="/" style={{ color: "#ABABAB", fontSize: 13, textDecoration: "none" }}>Home</Link><span style={{ color: "#CBFE1C" }}>›</span><span style={{ color: "#CBFE1C", fontSize: 13 }}>Contact</span></div>
          </div>
        </div>
      </div>
      <section className="section-padding">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-5">
              <div className="section-title mb-4">
                <h6 className="subtitle text-uppercase" style={{ letterSpacing: 2, fontSize: 12, marginBottom: 12 }}>Get In Touch</h6>
                <h2 className="tx-title">We'd Love to <span>Hear from You</span></h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[{ icon: "fa-map-marker", t: "Address", v: "Navrangpura, Ahmedabad, Gujarat - 380009" }, { icon: "fa-phone", t: "Phone", v: "+91 12345 67890" }, { icon: "fa-envelope", t: "Email", v: "support@gamezone.in" }, { icon: "fa-clock", t: "Hours", v: "Mon–Sun: 10:00 AM – 11:00 PM" }].map(c => (
                  <div key={c.t} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "#1C1D20", border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, padding: 18 }}>
                    <i className={`fa ${c.icon}`} style={{ color: "#CBFE1C", fontSize: 20, marginTop: 2, flexShrink: 0 }} />
                    <div><p style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{c.t}</p><p style={{ color: "#ABABAB", fontSize: 13, margin: 0 }}>{c.v}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-7">
              <div style={{ background: "#1C1D20", border: "1px solid rgba(203,254,28,.15)", borderRadius: 14, padding: 32 }}>
                <h4 style={{ color: "#fff", fontWeight: 700, marginBottom: 20 }}>Send a Message</h4>
                <div className="row g-3">
                  {[{ ph: "Full Name", t: "text" }, { ph: "Email Address", t: "email" }].map((f, i) => (
                    <div key={i} className="col-md-6"><input type={f.t} placeholder={f.ph} style={{ width: "100%", padding: "13px 16px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none" }} /></div>
                  ))}
                  <div className="col-12"><input type="text" placeholder="Subject" style={{ width: "100%", padding: "13px 16px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none" }} /></div>
                  <div className="col-12"><textarea rows={5} placeholder="Your message..." style={{ width: "100%", padding: "13px 16px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", resize: "vertical" }} /></div>
                  <div className="col-12"><button className="theme-btn" style={{ padding: "2px 32px", fontSize: 14 }}>Send Message →</button></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
