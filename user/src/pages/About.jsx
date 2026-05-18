import React from "react"
import { Link } from "react-router-dom"
export default function About() {
  return (
    <div>
      <div className="gt-breadcrumb-wrapper bg-cover" style={{ backgroundImage:"url(/assets/img/breadcrumb.png)",padding:"60px 0",position:"relative" }}>
        <div style={{ position:"absolute",inset:0,background:"rgba(11,14,19,.7)" }}/>
        <div className="container" style={{ position:"relative",zIndex:2 }}>
          <div className="gt-page-heading text-center">
            <h1 style={{ color:"#fff",fontWeight:900,fontSize:"clamp(1.8rem,3vw,2.6rem)",marginBottom:8 }}>About GameZone</h1>
            <div style={{ display:"flex",justifyContent:"center",gap:8 }}><Link to="/" style={{ color:"#ABABAB",fontSize:13,textDecoration:"none" }}>Home</Link><span style={{ color:"#CBFE1C" }}>›</span><span style={{ color:"#CBFE1C",fontSize:13 }}>About</span></div>
          </div>
        </div>
      </div>
      <section className="about-section section-padding fix">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div style={{ background:"linear-gradient(135deg,rgba(203,254,28,.08),rgba(90,117,1,.08))",border:"1px solid rgba(203,254,28,.15)",borderRadius:20,padding:40,textAlign:"center" }}>
                <div style={{ fontSize:120 }}>🎮</div>
                <h3 style={{ color:"#CBFE1C",fontWeight:800,marginTop:16 }}>GameZone</h3>
                <p style={{ color:"#ABABAB",fontSize:14 }}>Premium Gaming Experience</p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="section-title mb-0">
                <h6 className="subtitle text-uppercase" style={{ letterSpacing:2,fontSize:12,marginBottom:12 }}>Who We Are</h6>
                <h2 className="tx-title" style={{ marginBottom:16 }}>India's Premier <span>Gaming Seat Reservation</span> Platform</h2>
                <p style={{ color:"#ABABAB",lineHeight:1.8,marginBottom:16 }}>GameZone is a comprehensive digital platform that makes booking gaming seats effortless. Browse available games, choose your time slot, pick your seat, and pay securely — all in under 2 minutes.</p>
                <p style={{ color:"#ABABAB",lineHeight:1.8,marginBottom:28 }}>We eliminate queues and manual booking hassles, giving gamers instant access to their favourite experiences while helping gaming centers manage reservations efficiently.</p>
                <div className="row g-3 mb-4">
                  {[{n:"10+",l:"Games"},{n:"500+",l:"Happy Gamers"},{n:"5.0★",l:"Avg Rating"},{n:"2 min",l:"To Book"}].map(s=>(
                    <div key={s.l} className="col-6">
                      <div style={{ background:"rgba(203,254,28,.06)",border:"1px solid rgba(203,254,28,.15)",borderRadius:10,padding:16,textAlign:"center" }}>
                        <h3 style={{ color:"#CBFE1C",fontWeight:900,marginBottom:2 }}>{s.n}</h3>
                        <p style={{ color:"#ABABAB",fontSize:12,margin:0 }}>{s.l}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/games" className="theme-btn">Browse Games →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
