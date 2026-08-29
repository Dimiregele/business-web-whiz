/**
 * ScanVogue — pagina de promovare (single-file, portabil).
 *
 * Fișierul acesta NU depinde de Tailwind, de shadcn sau de altceva din Lovable.
 * Are nevoie doar de React. Îl poți copia în orice proiect React/Next
 * (`export default`) și funcționează identic: toate stilurile sunt inline sau
 * într-un <style> injectat mai jos.
 *
 * Contact / vânzări: scanvogue@gmail.com
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Design tokens                                                       */
/* ------------------------------------------------------------------ */

const C = {
  bg: "#0B0A08",
  bg2: "#100E0B",
  card: "rgba(22,19,15,0.78)",
  cardSolid: "#16130F",
  border: "rgba(198,161,91,0.16)",
  border2: "rgba(255,255,255,0.08)",
  gold: "#C6A15B",
  goldLight: "#E8D2A0",
  goldDeep: "#8A6B38",
  text: "#F5F0E6",
  muted: "#9C9382",
  green: "#8FD3A0",
  amber: "#E0A88C",
};

const SALES_EMAIL = "scanvogue@gmail.com";

const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'Inter', system-ui, -apple-system, Segoe UI, sans-serif";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; }

.sv-root { background: ${C.bg}; color: ${C.text}; font-family: ${sans}; overflow-x: hidden; }
.sv-root ::selection { background: ${C.gold}; color: #100F0D; }

@keyframes sv-fadeUp { from { opacity:0; transform: translateY(26px); } to { opacity:1; transform:none; } }
@keyframes sv-float1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,-50px) scale(1.12); } }
@keyframes sv-float2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-45px,35px) scale(1.08); } }
@keyframes sv-spin { to { transform: rotate(360deg); } }
@keyframes sv-drawCircle { from { stroke-dashoffset: 126; } to { stroke-dashoffset: 0; } }
@keyframes sv-drawCheck { from { stroke-dashoffset: 36; } to { stroke-dashoffset: 0; } }
@keyframes sv-corner { 0%,100% { opacity:.45; } 50% { opacity:1; } }
@keyframes sv-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes sv-scanline { 0% { top: 4%; opacity:0; } 12% { opacity:1; } 88% { opacity:1; } 100% { top: 96%; opacity:0; } }
@keyframes sv-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(198,161,91,.45); } 70% { box-shadow: 0 0 0 16px rgba(198,161,91,0); } }
@keyframes sv-shimmer { from { background-position: -220% 0; } to { background-position: 220% 0; } }
@keyframes sv-riseBar { from { transform: scaleY(0); } to { transform: scaleY(1); } }

.sv-reveal { opacity: 0; transform: translateY(28px); transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); will-change: opacity, transform; }
.sv-reveal.sv-in { opacity: 1; transform: none; }

.sv-btn { position: relative; font-family: ${sans}; cursor: pointer; border-radius: 14px; font-weight: 600; font-size: 15px;
  display: inline-flex; align-items: center; justify-content: center; gap: 9px; padding: 15px 26px; border: 1px solid transparent;
  transition: transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .3s ease, background .3s ease, border-color .3s ease, color .3s ease; text-decoration: none; }
.sv-btn:active { transform: scale(.97); }
.sv-btn-primary { background: linear-gradient(135deg, ${C.goldLight}, ${C.gold} 58%, ${C.goldDeep}); color: #100F0D; box-shadow: 0 10px 34px -14px rgba(198,161,91,.8); }
.sv-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 18px 46px -14px rgba(198,161,91,.85); }
.sv-btn-ghost { background: rgba(198,161,91,.05); color: ${C.text}; border-color: rgba(198,161,91,.32); }
.sv-btn-ghost:hover { transform: translateY(-3px); border-color: ${C.gold}; background: rgba(198,161,91,.11); }
.sv-btn-sm { padding: 11px 18px; font-size: 13.5px; border-radius: 12px; }

.sv-card { background: ${C.card}; border: 1px solid ${C.border}; border-radius: 20px; backdrop-filter: blur(10px); }
.sv-lift { transition: transform .35s cubic-bezier(.16,1,.3,1), border-color .35s ease, box-shadow .35s ease; }
.sv-lift:hover { transform: translateY(-6px); border-color: rgba(198,161,91,.42); box-shadow: 0 24px 60px -30px rgba(0,0,0,.9); }

.sv-input { width: 100%; background: rgba(255,255,255,.035); border: 1px solid rgba(255,255,255,.09); border-radius: 12px;
  color: ${C.text}; font-family: ${sans}; font-size: 14px; padding: 13px 14px; transition: border-color .2s, box-shadow .2s, background .2s; }
.sv-input:focus { outline: none; border-color: ${C.gold}; box-shadow: 0 0 0 3px rgba(198,161,91,.15); background: rgba(255,255,255,.05); }
.sv-input::placeholder { color: #6E6759; }

.sv-corner { position: absolute; width: 20px; height: 20px; animation: sv-corner 3.6s ease-in-out infinite; }

.sv-eyebrow { font-size: 10.5px; letter-spacing: .3em; text-transform: uppercase; color: ${C.gold}; font-weight: 600; }
.sv-h2 { font-family: ${serif}; font-weight: 600; font-size: clamp(30px, 4.6vw, 50px); line-height: 1.08; margin: 14px 0 0; letter-spacing: -.01em; }
.sv-lead { color: ${C.muted}; font-size: 16px; line-height: 1.7; margin: 16px 0 0; max-width: 58ch; }

.sv-link { color: ${C.muted}; text-decoration: none; transition: color .2s; font-size: 13.5px; }
.sv-link:hover { color: ${C.gold}; }

.sv-marquee-track { display: flex; width: max-content; animation: sv-marquee 38s linear infinite; }
.sv-marquee:hover .sv-marquee-track { animation-play-state: paused; }

.sv-grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 18px; }
.sv-grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 18px; }
.sv-split { display: grid; grid-template-columns: 0.92fr 1.08fr; gap: 46px; align-items: center; }

.sv-tab { border: 1px solid transparent; background: transparent; color: ${C.muted}; font-family: ${sans}; font-size: 13.5px; font-weight: 600;
  padding: 10px 18px; border-radius: 999px; cursor: pointer; transition: all .25s ease; }
.sv-tab:hover { color: ${C.text}; }
.sv-tab-on { background: rgba(198,161,91,.12); border-color: rgba(198,161,91,.4); color: ${C.text}; }

.sv-phone { width: 330px; max-width: 100%; border-radius: 42px; padding: 12px; background: linear-gradient(160deg, #2A2620, #100E0B 55%);
  border: 1px solid rgba(198,161,91,.22); box-shadow: 0 50px 90px -40px rgba(0,0,0,1), inset 0 1px 0 rgba(255,255,255,.06); }
.sv-phone-screen { position: relative; overflow: hidden; border-radius: 32px; background: radial-gradient(120% 80% at 50% 0%, #18140F 0%, ${C.bg} 62%);
  min-height: 560px; padding: 26px 22px; display: flex; flex-direction: column; }

.sv-bar { transform-origin: bottom; animation: sv-riseBar .7s cubic-bezier(.16,1,.3,1) both; }

.sv-shimmer { background: linear-gradient(100deg, transparent 20%, rgba(232,210,160,.75) 50%, transparent 80%);
  background-size: 220% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: sv-shimmer 5.5s linear infinite; }

@media (max-width: 900px) {
  .sv-split { grid-template-columns: 1fr; gap: 34px; }
  .sv-grid-3 { grid-template-columns: 1fr; }
  .sv-grid-2 { grid-template-columns: 1fr; }
  .sv-hide-sm { display: none !important; }
}
@media (prefers-reduced-motion: reduce) {
  .sv-reveal { opacity: 1 !important; transform: none !important; }
  .sv-root * { animation-duration: .001ms !important; animation-iteration-count: 1 !important; }
}
`;

/* ------------------------------------------------------------------ */
/* Utilitare mici                                                      */
/* ------------------------------------------------------------------ */

function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".sv-reveal"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("sv-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("sv-in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (!("IntersectionObserver" in window)) return setSeen(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return { ref, seen };
}

function Counter({ to, decimals = 0, suffix = "", prefix = "" }: { to: number; decimals?: number; suffix?: string; prefix?: string }) {
  const { ref, seen } = useInView<HTMLSpanElement>();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!seen) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1500;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return (
    <span ref={ref}>
      {prefix}
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* Iconițe inline (fără dependențe externe) */
const Ic = {
  star: (p: { size?: number; fill?: string; color?: string }) => (
    <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" fill={p.fill ?? "none"} stroke={p.color ?? C.gold} strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45-4.7-4.6 6.5-.95z" />
    </svg>
  ),
  qr: (p: { size?: number }) => (
    <svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.6">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3h-3zM20 14v3M14 20h6" />
    </svg>
  ),
  shield: (p: { size?: number }) => (
    <svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v5.5c0 4.4-3 8.2-7 9.5-4-1.3-7-5.1-7-9.5V6z" /><path d="M9 12l2 2 4-4" />
    </svg>
  ),
  spark: (p: { size?: number }) => (
    <svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  ),
  chart: (p: { size?: number }) => (
    <svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.6" strokeLinecap="round">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  ),
  mail: (p: { size?: number }) => (
    <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" /><path d="M3 7l9 6 9-6" />
    </svg>
  ),
  arrow: (p: { size?: number }) => (
    <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  ),
  msg: (p: { size?: number }) => (
    <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a8 8 0 01-11.6 7.1L3 21l1.9-6.3A8 8 0 1121 12z" />
    </svg>
  ),
  send: (p: { size?: number }) => (
    <svg width={p.size ?? 17} height={p.size ?? 17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 3L10.5 13.5M21 3l-6.8 18-3.7-7.5L3 10z" />
    </svg>
  ),
  cart: (p: { size?: number }) => (
    <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h2l2.4 11.2a2 2 0 002 1.6h7.7a2 2 0 002-1.6L21 8H6" /><circle cx="10" cy="20" r="1.2" /><circle cx="18" cy="20" r="1.2" />
    </svg>
  ),
};

function Corners({ children, inset = -9 }: { children: React.ReactNode; inset?: number }) {
  const s = { borderColor: C.gold } as React.CSSProperties;
  return (
    <div style={{ position: "relative" }}>
      <span className="sv-corner" style={{ ...s, top: inset, left: inset, borderTop: `1px solid ${C.gold}`, borderLeft: `1px solid ${C.gold}`, borderTopLeftRadius: 4 }} />
      <span className="sv-corner" style={{ ...s, top: inset, right: inset, borderTop: `1px solid ${C.gold}`, borderRight: `1px solid ${C.gold}`, borderTopRightRadius: 4, animationDelay: ".4s" }} />
      <span className="sv-corner" style={{ ...s, bottom: inset, left: inset, borderBottom: `1px solid ${C.gold}`, borderLeft: `1px solid ${C.gold}`, borderBottomLeftRadius: 4, animationDelay: ".8s" }} />
      <span className="sv-corner" style={{ ...s, bottom: inset, right: inset, borderBottom: `1px solid ${C.gold}`, borderRight: `1px solid ${C.gold}`, borderBottomRightRadius: 4, animationDelay: "1.2s" }} />
      {children}
    </div>
  );
}

function Section({ id, children, style }: { id?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section id={id} style={{ position: "relative", padding: "clamp(70px, 9vw, 130px) 22px", ...style }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

/* mailto helpers */
const mailto = (subject: string, body: string) =>
  `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

/* ------------------------------------------------------------------ */
/* DEMO 1 — pagina clientului (replica funcțională a paginii de scan)   */
/* ------------------------------------------------------------------ */

type DemoView = "initial" | "negative" | "thanks" | "redirect";

function ClientDemo({ restaurantName }: { restaurantName: string }) {
  const [view, setView] = useState<DemoView>("initial");
  const [msg, setMsg] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [sending, setSending] = useState(false);

  const reset = () => {
    setView("initial");
    setMsg("");
    setName("");
    setContact("");
  };

  const send = () => {
    if (!msg.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setView("thanks");
    }, 900);
  };

  const goGoogle = () => {
    setView("redirect");
    setTimeout(() => setView("initial"), 2600);
  };

  return (
    <div className="sv-phone">
      <div className="sv-phone-screen">
        {/* bokeh */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-10%", left: "-14%", width: 220, height: 220, borderRadius: "50%", filter: "blur(20px)", background: "radial-gradient(circle, rgba(198,161,91,.18) 0%, transparent 70%)", animation: "sv-float1 9s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "-12%", right: "-12%", width: 250, height: 250, borderRadius: "50%", filter: "blur(20px)", background: "radial-gradient(circle, rgba(150,100,50,.16) 0%, transparent 70%)", animation: "sv-float2 11s ease-in-out infinite" }} />
        </div>

        <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {/* wordmark */}
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div style={{ fontFamily: serif, fontSize: 26, letterSpacing: ".13em", fontWeight: 600 }}>{restaurantName}</div>
            <div style={{ fontSize: 9.5, letterSpacing: ".28em", color: C.muted, marginTop: 6, textTransform: "uppercase" }}>Bine ai venit</div>
          </div>

          {view === "initial" && (
            <div key="initial" style={{ animation: "sv-fadeUp .5s cubic-bezier(.16,1,.3,1) both" }}>
              <Corners>
                <div style={{ border: `1px solid ${C.border}`, borderRadius: 18, padding: "22px 18px", background: "rgba(22,19,15,.6)" }}>
                  <div style={{ display: "flex", justifyContent: "center", gap: 5, marginBottom: 14 }}>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span key={i} style={{ animation: `sv-fadeUp .5s cubic-bezier(.16,1,.3,1) ${0.05 * i}s both` }}>
                        <Ic.star size={17} fill={C.gold} color={C.gold} />
                      </span>
                    ))}
                  </div>
                  <p style={{ textAlign: "center", fontSize: 14.5, lineHeight: 1.6, color: C.text, margin: "0 0 20px" }}>
                    Cum a fost experiența ta astăzi?
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <button className="sv-btn sv-btn-ghost" style={{ width: "100%" }} onClick={goGoogle}>
                      <Ic.star size={16} fill={C.gold} color={C.gold} /> Lasă o recenzie pe Google <Ic.arrow size={14} />
                    </button>
                    <button className="sv-btn sv-btn-ghost" style={{ width: "100%" }} onClick={() => setView("negative")}>
                      <Ic.msg size={16} /> Trimite un mesaj privat
                    </button>
                  </div>
                  <p style={{ fontSize: 10.5, color: C.muted, textAlign: "center", margin: "16px 0 0", lineHeight: 1.6 }}>
                    Ambele opțiuni au aceeași greutate vizuală — fără „review gating”, conform politicii Google.
                  </p>
                </div>
              </Corners>
            </div>
          )}

          {view === "negative" && (
            <div key="neg" style={{ animation: "sv-fadeUp .5s cubic-bezier(.16,1,.3,1) both" }}>
              <div style={{ border: `1px solid ${C.border}`, borderRadius: 18, padding: 18, background: "rgba(22,19,15,.6)" }}>
                <p style={{ fontSize: 13.5, color: C.text, margin: "0 0 4px", fontWeight: 600 }}>Spune-ne ce n-a mers</p>
                <p style={{ fontSize: 11.5, color: C.muted, margin: "0 0 14px", lineHeight: 1.6 }}>
                  Mesajul ajunge direct la manager, în privat. Nu apare public nicăieri.
                </p>
                <textarea className="sv-input" rows={4} placeholder="Ex.: am așteptat 35 de minute la desert..." value={msg} onChange={(e) => setMsg(e.target.value)} style={{ resize: "none", marginBottom: 10 }} />
                <input className="sv-input" placeholder="Nume (opțional)" value={name} onChange={(e) => setName(e.target.value)} style={{ marginBottom: 10 }} />
                <input className="sv-input" placeholder="Telefon sau email (opțional)" value={contact} onChange={(e) => setContact(e.target.value)} style={{ marginBottom: 14 }} />
                <button className="sv-btn sv-btn-primary" style={{ width: "100%", opacity: msg.trim() ? 1 : 0.45 }} onClick={send} disabled={!msg.trim() || sending}>
                  {sending ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#100F0D" strokeWidth="2.2" strokeLinecap="round" style={{ animation: "sv-spin 1s linear infinite" }}>
                      <path d="M21 12a9 9 0 11-6.2-8.6" />
                    </svg>
                  ) : (
                    <Ic.send />
                  )}
                  {sending ? "Se trimite..." : "Trimite mesajul"}
                </button>
                <button className="sv-link" style={{ background: "none", border: "none", width: "100%", marginTop: 12, cursor: "pointer" }} onClick={reset}>
                  Înapoi
                </button>
              </div>
            </div>
          )}

          {view === "thanks" && (
            <div key="thanks" style={{ animation: "sv-fadeUp .5s cubic-bezier(.16,1,.3,1) both", textAlign: "center" }}>
              <svg width="52" height="52" viewBox="0 0 52 52" style={{ margin: "0 auto 16px", display: "block" }}>
                <circle cx="26" cy="26" r="20" fill="none" stroke={C.gold} strokeWidth="1.5" strokeDasharray="126" style={{ animation: "sv-drawCircle .7s cubic-bezier(.16,1,.3,1) both" }} />
                <path d="M16 27l7 7 13-15" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="36" style={{ animation: "sv-drawCheck .4s ease .6s both" }} />
              </svg>
              <p style={{ fontFamily: serif, fontSize: 22, margin: 0 }}>Mulțumim.</p>
              <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.7, margin: "10px 0 18px" }}>
                Managerul a primit deja o alertă pe email, cu rezumat AI și un draft de răspuns.
              </p>
              <button className="sv-btn sv-btn-ghost sv-btn-sm" onClick={reset}>Reia demo-ul</button>
            </div>
          )}

          {view === "redirect" && (
            <div key="redir" style={{ animation: "sv-fadeUp .4s ease both", textAlign: "center" }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" style={{ animation: "sv-spin 1s linear infinite", margin: "0 auto 14px", display: "block" }}>
                <path d="M21 12a9 9 0 11-6.2-8.6" />
              </svg>
              <p style={{ fontSize: 13.5, color: C.text, margin: 0 }}>Te ducem pe pagina Google...</p>
              <p style={{ fontSize: 11.5, color: C.muted, margin: "8px 0 0" }}>(în demo nu se face redirect real)</p>
            </div>
          )}
        </div>

        <div style={{ position: "relative", textAlign: "center", fontSize: 9.5, letterSpacing: ".22em", color: "#5F594D", textTransform: "uppercase", marginTop: 18 }}>
          powered by ScanVogue
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DEMO 2 — panoul de manager                                          */
/* ------------------------------------------------------------------ */

type Complaint = {
  id: number;
  when: string;
  text: string;
  contact: string;
  summary: string;
  reply: string;
  tag: string;
  status: "new" | "progress" | "resolved";
};

const SEED_COMPLAINTS: Complaint[] = [
  {
    id: 1,
    when: "azi, 21:14",
    text: "Am rezervat pentru 20:30 și am primit masa la 21:05. Nimeni nu ne-a spus nimic între timp.",
    contact: "Andrei M. · 07xx xxx 214",
    summary: "Întârziere de 35 min la o rezervare confirmată, fără comunicare din partea gazdei.",
    reply:
      "Bună, Andrei. Ai avut dreptate să fii nemulțumit — o rezervare confirmată înseamnă o masă la ora stabilită. Am revizuit deja modul în care ținem rezervările în intervalul 20:00–21:30. Ne-ar face plăcere să te avem înapoi, cu desertul din partea casei.",
    tag: "Timp de așteptare",
    status: "new",
  },
  {
    id: 2,
    when: "ieri, 20:02",
    text: "Ciorba a venit călduță, iar când am semnalat, chelnerul a ridicat din umeri.",
    contact: "fără contact",
    summary: "Preparat servit la temperatură scăzută + reacție defensivă a personalului de sală.",
    reply:
      "Vă mulțumim că ne-ați spus. Temperatura la servire și modul în care reacționăm când ceva nu e în regulă sunt două lucruri pe care le-am discutat azi cu echipa de sală. Ne-ar plăcea să reparăm impresia la o următoare vizită.",
    tag: "Temperatura preparatelor",
    status: "new",
  },
  {
    id: 3,
    when: "vineri, 22:41",
    text: "Muzica era atât de tare încât nu ne auzeam la masă. Am plecat fără desert.",
    contact: "Ioana P. · ioana@…",
    summary: "Volum ambiental prea ridicat după ora 22:00; a scurtat durata mesei și consumul.",
    reply:
      "Bună, Ioana. Am măsurat volumul în sală vineri seara și l-am coborât cu 6 dB după ora 22:00. Mulțumim că ne-ai scris în loc să pleci în tăcere — exact asta ne ajută să reparăm lucrurile.",
    tag: "Zgomot / ambient",
    status: "progress",
  },
];

const SCAN_SERIES = [
  { d: "Lu", pos: 18, neg: 3 },
  { d: "Ma", pos: 22, neg: 2 },
  { d: "Mi", pos: 26, neg: 4 },
  { d: "Jo", pos: 31, neg: 3 },
  { d: "Vi", pos: 47, neg: 6 },
  { d: "Sâ", pos: 58, neg: 5 },
  { d: "Du", pos: 39, neg: 2 },
];

const THEMES = [
  { theme: "Timp de așteptare la masă", count: 14, pattern: "vineri & sâmbătă, 20:00–21:30", fixed: null as string | null },
  { theme: "Temperatura preparatelor", count: 9, pattern: "prânz, 12:30–14:00", fixed: null },
  { theme: "Zgomot în sala mare", count: 6, pattern: "după 22:00", fixed: "Remediat pe 12 aug — 0 reclamații noi în 3 săptămâni" },
];

function ManagerDemo({ restaurantName }: { restaurantName: string }) {
  const [complaints, setComplaints] = useState(SEED_COMPLAINTS);
  const [open, setOpen] = useState<number | null>(1);
  const [copied, setCopied] = useState<number | null>(null);

  const setStatus = (id: number, status: Complaint["status"]) =>
    setComplaints((cs) => cs.map((c) => (c.id === id ? { ...c, status } : c)));

  const totalScans = SCAN_SERIES.reduce((a, b) => a + b.pos + b.neg, 0);
  const negTotal = SCAN_SERIES.reduce((a, b) => a + b.neg, 0);
  const satisfaction = Math.round(((totalScans - negTotal) / totalScans) * 100);
  const maxBar = Math.max(...SCAN_SERIES.map((s) => s.pos + s.neg));
  const openCount = complaints.filter((c) => c.status !== "resolved").length;

  const copyReply = async (c: Complaint) => {
    try {
      await navigator.clipboard.writeText(c.reply);
    } catch {
      /* clipboard indisponibil în unele iframe-uri — demo-ul continuă */
    }
    setCopied(c.id);
    setTimeout(() => setCopied(null), 1800);
  };

  const statusLabel: Record<Complaint["status"], string> = { new: "Nouă", progress: "În lucru", resolved: "Rezolvată" };
  const statusColor: Record<Complaint["status"], string> = { new: C.amber, progress: C.gold, resolved: C.green };

  return (
    <div className="sv-card" style={{ padding: 20, background: "rgba(16,14,11,.9)" }}>
      {/* header */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: serif, fontSize: 20, letterSpacing: ".06em" }}>{restaurantName}</div>
          <div style={{ fontSize: 10.5, letterSpacing: ".24em", color: C.muted, textTransform: "uppercase", marginTop: 4 }}>Panou manager</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11.5, color: C.muted }}>Ultimele 7 zile</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: C.green, border: `1px solid rgba(143,211,160,.28)`, borderRadius: 999, padding: "5px 11px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, animation: "sv-pulse 2.4s infinite" }} /> live
          </span>
        </div>
      </div>

      {/* KPI */}
      <div className="sv-grid-3" style={{ gap: 12, marginBottom: 16 }}>
        {[
          { l: "Scanări", v: <Counter to={totalScans} />, s: "+38% vs. săpt. trecută" },
          { l: "Satisfacție", v: <Counter to={satisfaction} suffix="%" />, s: `${negTotal} mesaje private` },
          { l: "Reclamații deschise", v: <Counter to={openCount} />, s: "medie răspuns: 3h 12m" },
        ].map((k) => (
          <div key={k.l} className="sv-lift" style={{ border: `1px solid ${C.border2}`, borderRadius: 14, padding: 14, background: "rgba(255,255,255,.02)" }}>
            <div style={{ fontSize: 10.5, letterSpacing: ".2em", textTransform: "uppercase", color: C.muted }}>{k.l}</div>
            <div style={{ fontFamily: serif, fontSize: 34, fontWeight: 600, marginTop: 6, color: C.text }}>{k.v}</div>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{k.s}</div>
          </div>
        ))}
      </div>

      {/* chart */}
      <div style={{ border: `1px solid ${C.border2}`, borderRadius: 14, padding: "16px 16px 10px", marginBottom: 16, background: "rgba(255,255,255,.02)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600 }}>Scanări pe zi</span>
          <span style={{ display: "flex", gap: 14, fontSize: 11, color: C.muted }}>
            <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: C.green, marginRight: 5 }} />Google</span>
            <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: C.amber, marginRight: 5 }} />privat</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 130 }}>
          {SCAN_SERIES.map((s, i) => {
            const h = ((s.pos + s.neg) / maxBar) * 100;
            return (
              <div key={s.d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
                <div className="sv-bar" style={{ width: "100%", height: `${h}%`, display: "flex", flexDirection: "column", justifyContent: "flex-end", animationDelay: `${i * 0.07}s` }} title={`${s.pos} Google · ${s.neg} private`}>
                  <div style={{ height: `${(s.neg / (s.pos + s.neg)) * 100}%`, background: C.amber, borderRadius: "4px 4px 0 0", opacity: 0.85 }} />
                  <div style={{ height: `${(s.pos / (s.pos + s.neg)) * 100}%`, background: `linear-gradient(180deg, ${C.green}, rgba(143,211,160,.35))`, borderRadius: "0 0 4px 4px" }} />
                </div>
                <span style={{ fontSize: 10.5, color: C.muted }}>{s.d}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* teme recurente */}
      <div style={{ border: `1px solid ${C.border2}`, borderRadius: 14, padding: 16, marginBottom: 16, background: "rgba(255,255,255,.02)" }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 3 }}>Teme recurente (AI, ultimele 30 de zile)</div>
        <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 14 }}>Calculate automat săptămânal — nu ai nimic de apăsat.</div>
        {THEMES.map((t, i) => (
          <div key={t.theme} style={{ marginBottom: i === THEMES.length - 1 ? 0 : 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 12.5, marginBottom: 6 }}>
              <span>{t.theme}</span>
              <span style={{ color: C.muted, whiteSpace: "nowrap" }}>{t.count}×</span>
            </div>
            <div style={{ height: 5, borderRadius: 999, background: "rgba(255,255,255,.06)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(t.count / THEMES[0].count) * 100}%`, background: `linear-gradient(90deg, ${C.goldDeep}, ${C.goldLight})`, borderRadius: 999, transition: "width 1s cubic-bezier(.16,1,.3,1)" }} />
            </div>
            <div style={{ fontSize: 11, color: t.fixed ? C.green : C.muted, marginTop: 6 }}>{t.fixed ?? `Tipar: ${t.pattern}`}</div>
          </div>
        ))}
      </div>

      {/* reclamații */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {complaints.map((c) => {
          const isOpen = open === c.id;
          return (
            <div key={c.id} style={{ border: `1px solid ${isOpen ? "rgba(198,161,91,.4)" : C.border2}`, borderRadius: 14, background: "rgba(255,255,255,.02)", transition: "border-color .3s ease" }}>
              <button
                onClick={() => setOpen(isOpen ? null : c.id)}
                style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: 14, color: C.text, fontFamily: sans }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: statusColor[c.status], border: `1px solid ${statusColor[c.status]}44`, borderRadius: 999, padding: "3px 9px" }}>
                    {statusLabel[c.status]}
                  </span>
                  <span style={{ fontSize: 11, color: C.muted }}>{c.when}</span>
                </div>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: "10px 0 0" }}>„{c.text}”</p>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>{c.contact} · {c.tag}</div>
              </button>

              <div style={{ maxHeight: isOpen ? 460 : 0, overflow: "hidden", transition: "max-height .5s cubic-bezier(.16,1,.3,1)" }}>
                <div style={{ padding: "0 14px 14px" }}>
                  <div style={{ borderTop: `1px solid ${C.border2}`, paddingTop: 12 }}>
                    <div style={{ display: "flex", gap: 7, alignItems: "center", fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: C.gold, marginBottom: 7 }}>
                      <Ic.spark size={14} /> Rezumat AI
                    </div>
                    <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, margin: 0 }}>{c.summary}</p>

                    <div style={{ display: "flex", gap: 7, alignItems: "center", fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: C.gold, margin: "14px 0 7px" }}>
                      <Ic.msg size={14} /> Draft de răspuns
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0, background: "rgba(198,161,91,.06)", border: `1px solid ${C.border}`, borderRadius: 12, padding: 12 }}>{c.reply}</p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                      <button className="sv-btn sv-btn-primary sv-btn-sm" onClick={() => copyReply(c)}>
                        {copied === c.id ? "Copiat ✓" : "Copiază răspunsul"}
                      </button>
                      <button className="sv-btn sv-btn-ghost sv-btn-sm" onClick={() => setStatus(c.id, "progress")}>În lucru</button>
                      <button className="sv-btn sv-btn-ghost sv-btn-sm" onClick={() => setStatus(c.id, "resolved")}>Marchează rezolvată</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {complaints.every((c) => c.status === "resolved") && (
          <button className="sv-btn sv-btn-ghost sv-btn-sm" onClick={() => setComplaints(SEED_COMPLAINTS)}>Reia demo-ul</button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pagina                                                              */
/* ------------------------------------------------------------------ */

export default function ScanVogueLanding() {
  useReveal();

  const [restaurantName, setRestaurantName] = useState("Numele restaurantului tău");
  const [tab, setTab] = useState<"client" | "manager">("client");
  const [scrollY, setScrollY] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    const onMove = (e: MouseEvent) =>
      setPointer({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  const displayName = restaurantName.trim() || "Numele restaurantului tău";

  const buyHref = useMemo(
    () =>
      mailto(
        `Comandă ScanVogue — ${displayName}`,
        `Bună,\n\nVreau să pornim ScanVogue pentru: ${displayName}\n\nOraș / adresă:\nNumăr de mese:\nPersoană de contact:\nTelefon:\n\nMulțumesc!`
      ),
    [displayName]
  );

  const contactHref = useMemo(
    () =>
      mailto(
        `Întrebare despre ScanVogue — ${displayName}`,
        `Bună,\n\nAm văzut demo-ul ScanVogue și aș vrea să aflu mai multe pentru ${displayName}.\n\nÎntrebarea mea:\n`
      ),
    [displayName]
  );

  return (
    <div className="sv-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ---------------- NAV ---------------- */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backdropFilter: "blur(14px)",
          background: scrollY > 40 ? "rgba(11,10,8,.82)" : "transparent",
          borderBottom: `1px solid ${scrollY > 40 ? C.border2 : "transparent"}`,
          transition: "background .4s ease, border-color .4s ease",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "14px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: serif, fontSize: 21, letterSpacing: ".16em", fontWeight: 600 }}>
            SCAN<span style={{ color: C.gold }}>VOGUE</span>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <a className="sv-link sv-hide-sm" href="#dovezi">Dovezi</a>
            <a className="sv-link sv-hide-sm" href="#demo">Demo</a>
            <a className="sv-link sv-hide-sm" href="#pret">Preț</a>
            <a className="sv-btn sv-btn-primary sv-btn-sm" href={buyHref}>
              <Ic.cart size={15} /> Cumpără
            </a>
          </nav>
        </div>
      </header>

      {/* ---------------- HERO ---------------- */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", padding: "130px 22px 80px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              top: "-18%",
              left: "-8%",
              width: 620,
              height: 620,
              borderRadius: "50%",
              filter: "blur(30px)",
              background: "radial-gradient(circle, rgba(198,161,91,.16) 0%, transparent 68%)",
              transform: `translate3d(${pointer.x * 26}px, ${pointer.y * 22 - scrollY * 0.12}px, 0)`,
              transition: "transform .6s cubic-bezier(.16,1,.3,1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-24%",
              right: "-12%",
              width: 700,
              height: 700,
              borderRadius: "50%",
              filter: "blur(34px)",
              background: "radial-gradient(circle, rgba(150,100,50,.16) 0%, transparent 68%)",
              transform: `translate3d(${pointer.x * -30}px, ${pointer.y * -20 - scrollY * 0.06}px, 0)`,
              transition: "transform .6s cubic-bezier(.16,1,.3,1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(${C.border2} 1px, transparent 1px), linear-gradient(90deg, ${C.border2} 1px, transparent 1px)`,
              backgroundSize: "72px 72px",
              maskImage: "radial-gradient(70% 60% at 50% 40%, #000 0%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(70% 60% at 50% 40%, #000 0%, transparent 100%)",
              opacity: 0.55,
              transform: `translateY(${scrollY * 0.08}px)`,
            }}
          />
        </div>

        <div className="sv-split" style={{ maxWidth: 1140, margin: "0 auto", position: "relative", width: "100%" }}>
          <div>
            <div style={{ animation: "sv-fadeUp .7s cubic-bezier(.16,1,.3,1) .05s both" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1px solid ${C.border}`, borderRadius: 999, padding: "7px 14px", fontSize: 11.5, color: C.muted }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, animation: "sv-pulse 2.4s infinite" }} />
                Un QR pe masă. Restul se întâmplă singur.
              </span>
            </div>
            <h1
              style={{
                fontFamily: serif,
                fontWeight: 600,
                fontSize: "clamp(42px, 6.6vw, 78px)",
                lineHeight: 1.02,
                letterSpacing: "-.02em",
                margin: "22px 0 0",
                animation: "sv-fadeUp .8s cubic-bezier(.16,1,.3,1) .15s both",
              }}
            >
              Recenziile bune ajung pe Google.
              <br />
              <span className="sv-shimmer">Cele proaste ajung la tine.</span>
            </h1>
            <p className="sv-lead" style={{ animation: "sv-fadeUp .8s cubic-bezier(.16,1,.3,1) .28s both" }}>
              ScanVogue transformă fiecare masă într-un canal de feedback. Clientul scanează, alege singur dacă scrie
              public sau privat, iar tu primești pe email reclamația rezumată de AI, cu un draft de răspuns gata scris —
              înainte să ajungă pe Google.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30, animation: "sv-fadeUp .8s cubic-bezier(.16,1,.3,1) .4s both" }}>
              <a className="sv-btn sv-btn-primary" href="#demo">
                Încearcă demo-ul live <Ic.arrow />
              </a>
              <a className="sv-btn sv-btn-ghost" href={contactHref}>
                <Ic.mail /> Contactează-ne
              </a>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 26, marginTop: 38, animation: "sv-fadeUp .8s cubic-bezier(.16,1,.3,1) .5s both" }}>
              {[
                { v: <><Counter to={9} suffix="%" /></>, l: "creștere de încasări la +1 stea (Harvard)" },
                { v: <><Counter to={26} /></>, l: "clienți tac pentru fiecare unul care reclamă (TARP)" },
                { v: <><Counter to={30} suffix="s" /></>, l: "de la scanare la alertă pe email" },
              ].map((s, i) => (
                <div key={i} style={{ minWidth: 130 }}>
                  <div style={{ fontFamily: serif, fontSize: 32, fontWeight: 600, color: C.gold }}>{s.v}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.5, marginTop: 2, maxWidth: 200 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", animation: "sv-fadeUp 1s cubic-bezier(.16,1,.3,1) .35s both" }}>
            <div
              style={{
                transform: `perspective(1200px) rotateY(${pointer.x * -5}deg) rotateX(${pointer.y * 4}deg) translateY(${scrollY * -0.03}px)`,
                transition: "transform .5s cubic-bezier(.16,1,.3,1)",
                position: "relative",
              }}
            >
              <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, opacity: 0.7, animation: "sv-scanline 4.5s ease-in-out infinite", zIndex: 3, pointerEvents: "none" }} />
              <ClientDemo restaurantName={displayName} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- MARQUEE ---------------- */}
      <div className="sv-marquee" style={{ overflow: "hidden", borderTop: `1px solid ${C.border2}`, borderBottom: `1px solid ${C.border2}`, padding: "14px 0", background: "rgba(255,255,255,.015)" }}>
        <div className="sv-marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} style={{ display: "flex", gap: 44, paddingRight: 44 }}>
              {[
                "+1 stea pe Yelp = +5–9% încasări · Harvard Business School",
                "76% dintre consumatori citesc recenzii înainte să aleagă un local · BrightLocal 2024",
                "Recenziile cântăresc ~16% în clasamentul Google Local Pack · Whitespark",
                "Produsele cu recenzii convertesc cu până la 270% mai bine · Spiegel Research Center",
                "5% retenție în plus = 25–95% profit în plus · Bain & Company",
              ].map((t) => (
                <span key={t} style={{ fontSize: 12.5, color: C.muted, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.gold }} />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- DOVEZI ---------------- */}
      <Section id="dovezi">
        <div className="sv-reveal" style={{ maxWidth: 720 }}>
          <span className="sv-eyebrow">Nu e o părere. E cercetare.</span>
          <h2 className="sv-h2">Reputația online se măsoară direct în încasări</h2>
          <p className="sv-lead">
            Fiecare cifră de mai jos vine dintr-un studiu public, nu dintr-o broșură de vânzări. Le poți verifica una
            câte una.
          </p>
        </div>

        <div className="sv-grid-3" style={{ marginTop: 44 }}>
          {[
            {
              big: <><Counter to={9} suffix="%" /></>,
              t: "creștere de încasări",
              d: "Michael Luca, Harvard Business School — o stea în plus pe Yelp aduce restaurantelor independente între 5% și 9% venituri suplimentare.",
              src: "„Reviews, Reputation, and Revenue: The Case of Yelp.com”, HBS Working Paper 12-016",
            },
            {
              big: <><Counter to={76} suffix="%" /></>,
              t: "citesc recenzii",
              d: "Trei sferturi dintre consumatori citesc regulat recenziile afacerilor locale înainte să decidă unde merg — iar restaurantele sunt categoria cea mai verificată.",
              src: "BrightLocal, Local Consumer Review Survey 2024",
            },
            {
              big: <><Counter to={16} suffix="%" /></>,
              t: "din clasamentul local",
              d: "Semnalele de recenzii (număr, prospețime, notă) sunt unul dintre cei mai grei factori pentru poziția în Google Local Pack — locul unde te caută lumea flămândă.",
              src: "Whitespark, Local Search Ranking Factors",
            },
            {
              big: <><Counter to={26} /></>,
              t: "clienți tac",
              d: "Pentru fiecare client care reclamă, alți 26 pleacă fără să spună un cuvânt. ScanVogue le dă acelor 26 un loc unde să vorbească — privat, la tine.",
              src: "Cercetare TARP / Lee Resources, citată pe larg în literatura de customer service",
            },
            {
              big: <><Counter to={4.7} decimals={1} /></>,
              t: "nota ideală",
              d: "Încrederea crește până la 4,2–4,7 stele și scade după: un profil perfect de 5,0 pare fabricat. Câteva recenzii critice, gestionate elegant, vând mai bine decât perfecțiunea.",
              src: "Spiegel Research Center, Northwestern University",
            },
            {
              big: <><Counter to={33} suffix="%" /></>,
              t: "revin după un răspuns",
              d: "O treime dintre clienții care primesc un răspuns rapid la o plângere își schimbă recenzia negativă sau revin. Viteza contează mai mult decât cadoul.",
              src: "Harvard Business Review — „Responding to Customer Reviews Yields Better Ratings”",
            },
          ].map((s) => (
            <div key={s.t} className="sv-card sv-lift sv-reveal" style={{ padding: 22 }}>
              <div style={{ fontFamily: serif, fontSize: 46, fontWeight: 600, color: C.gold, lineHeight: 1 }}>{s.big}</div>
              <div style={{ fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", color: C.text, marginTop: 8 }}>{s.t}</div>
              <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7, margin: "12px 0 0" }}>{s.d}</p>
              <p style={{ fontSize: 11, color: "#6E6759", lineHeight: 1.6, margin: "12px 0 0", borderTop: `1px solid ${C.border2}`, paddingTop: 10 }}>Sursă: {s.src}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------- CUM FUNCȚIONEAZĂ ---------------- */}
      <Section style={{ background: `linear-gradient(180deg, transparent, ${C.bg2} 30%, transparent)` }}>
        <div className="sv-reveal" style={{ maxWidth: 720 }}>
          <span className="sv-eyebrow">Fluxul complet</span>
          <h2 className="sv-h2">Patru pași. Zero muncă în plus pentru echipă.</h2>
        </div>
        <div className="sv-grid-2" style={{ marginTop: 44 }}>
          {[
            { i: <Ic.qr size={22} />, n: "01", t: "Clientul scanează QR-ul de pe masă", d: "Nicio aplicație, niciun cont. Se deschide o pagină cu numele și identitatea vizuală ale localului tău, în 1,2 secunde." },
            { i: <Ic.shield size={22} />, n: "02", t: "Alege singur: public sau privat", d: "Cele două opțiuni au aceeași greutate vizuală — respectăm strict politica Google împotriva filtrării recenziilor (review gating). Nu riști penalizarea profilului." },
            { i: <Ic.spark size={22} />, n: "03", t: "AI-ul rezumă și scrie răspunsul", d: "Reclamația privată ajunge la tine pe email în ~30 de secunde: rezumat în două rânduri, semnalizare dacă e sensibilă (igienă, discriminare, siguranță) și un draft de răspuns pe care doar îl copiezi." },
            { i: <Ic.chart size={22} />, n: "04", t: "Tiparele ies la suprafață", d: "Săptămânal, sistemul grupează reclamațiile în teme recurente cu tipar orar („vineri, 20:00–21:30”) și îți arată dacă remediul aplicat a funcționat. Lunar primești raportul complet." },
          ].map((s) => (
            <div key={s.n} className="sv-card sv-lift sv-reveal" style={{ padding: 24, display: "flex", gap: 16 }}>
              <div style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 14, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(198,161,91,.06)" }}>{s.i}</div>
              <div>
                <div style={{ fontSize: 11, letterSpacing: ".22em", color: C.gold }}>{s.n}</div>
                <h3 style={{ fontFamily: serif, fontSize: 22, fontWeight: 600, margin: "6px 0 0" }}>{s.t}</h3>
                <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7, margin: "8px 0 0" }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------- DEMO ---------------- */}
      <Section id="demo">
        <div className="sv-reveal" style={{ maxWidth: 760 }}>
          <span className="sv-eyebrow">Demo funcțional — apasă pe orice</span>
          <h2 className="sv-h2">Vezi exact ce vede clientul și ce vezi tu</h2>
          <p className="sv-lead">
            Ambele demo-uri de mai jos sunt reale și interactive: trimite o reclamație, deschide-o în panou, copiază
            răspunsul AI, marchează-o rezolvată. Scrie numele localului tău și tot demo-ul se personalizează instant.
          </p>
        </div>

        <div className="sv-reveal" style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginTop: 28 }}>
          <label style={{ fontSize: 12, color: C.muted, letterSpacing: ".1em", textTransform: "uppercase" }}>Numele localului</label>
          <input
            className="sv-input"
            style={{ maxWidth: 320 }}
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value.slice(0, 40))}
            placeholder="Numele restaurantului tău"
            aria-label="Numele restaurantului tău"
          />
        </div>

        <div className="sv-reveal" style={{ display: "flex", gap: 8, marginTop: 24, flexWrap: "wrap" }}>
          <button className={`sv-tab ${tab === "client" ? "sv-tab-on" : ""}`} onClick={() => setTab("client")}>Pagina clientului</button>
          <button className={`sv-tab ${tab === "manager" ? "sv-tab-on" : ""}`} onClick={() => setTab("manager")}>Panoul de manager</button>
        </div>

        <div className="sv-reveal" style={{ marginTop: 26 }}>
          {tab === "client" ? (
            <div className="sv-split" style={{ alignItems: "center" }}>
              <div>
                <h3 style={{ fontFamily: serif, fontSize: 30, fontWeight: 600, margin: 0 }}>Ce vede clientul</h3>
                <p className="sv-lead" style={{ fontSize: 15 }}>
                  O singură pagină, elegantă, cu numele tău în față. Fără formulare lungi, fără login. Alege una dintre
                  cele două căi — și în ambele cazuri tu câștigi: fie o recenzie publică, fie o problemă pe care o afli
                  primul.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "22px 0 0", display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    "Se încarcă instant, chiar și pe 3G",
                    "Conform politicii Google — fără review gating",
                    "Mesajul privat nu apare public niciodată",
                    "Datele de contact sunt opționale (GDPR-friendly)",
                  ].map((t) => (
                    <li key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: C.muted }}>
                      <span style={{ color: C.gold, marginTop: 1 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5 5L20 6.5" /></svg>
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <ClientDemo restaurantName={displayName} />
              </div>
            </div>
          ) : (
            <div>
              <h3 style={{ fontFamily: serif, fontSize: 30, fontWeight: 600, margin: "0 0 6px" }}>Ce vezi tu, dimineața, cu cafeaua</h3>
              <p className="sv-lead" style={{ fontSize: 15, marginBottom: 24 }}>
                Un singur ecran: câți au scanat, cât de mulțumiți sunt, ce reclamații au apărut, ce se repetă și ce
                trebuie să răspunzi. Apasă pe o reclamație ca să vezi rezumatul AI și draftul de răspuns.
              </p>
              <ManagerDemo restaurantName={displayName} />
            </div>
          )}
        </div>
      </Section>

      {/* ---------------- BENEFICII ---------------- */}
      <Section style={{ background: `linear-gradient(180deg, transparent, ${C.bg2} 40%, transparent)` }}>
        <div className="sv-grid-3">
          {[
            { t: "Prinzi problema în seara în care s-a întâmplat", d: "Nu peste trei zile, într-o recenzie de o stea citită de 400 de oameni. Alerta ajunge pe email în ~30 de secunde." },
            { t: "Nu mai scrii răspunsuri de la zero", d: "AI-ul îți dă un draft calm, specific și fără clișee corporate. Îl citești, îl ajustezi în 20 de secunde, îl trimiți." },
            { t: "Vezi tipare, nu incidente izolate", d: "„Zgomot după 22:00 — de 6 ori luna asta” e o decizie de business. O reclamație singură e doar o seară proastă." },
            { t: "Rapoarte lunare fără să le ceri", d: "Un email pe lună cu evoluția scanărilor, satisfacției și temelor — bun de trimis mai departe către asociați sau proprietar." },
            { t: "Export CSV oricând", d: "Toate reclamațiile, cu status și dată, într-un fișier. Al tău, nu al nostru." },
            { t: "Instalare în aceeași zi", d: "Îți trimitem QR-urile gata proiectate pentru mese și un panou de manager cu contul tău. Nu ai nimic de configurat." },
          ].map((b) => (
            <div key={b.t} className="sv-card sv-lift sv-reveal" style={{ padding: 22 }}>
              <h3 style={{ fontFamily: serif, fontSize: 21, fontWeight: 600, margin: 0, lineHeight: 1.25 }}>{b.t}</h3>
              <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7, margin: "10px 0 0" }}>{b.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------- PREȚ / CTA ---------------- */}
      <Section id="pret">
        <div className="sv-reveal" style={{ textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
          <span className="sv-eyebrow">Începe astăzi</span>
          <h2 className="sv-h2">Un abonament costă mai puțin decât o masă anulată</h2>
          <p className="sv-lead" style={{ margin: "16px auto 0" }}>
            Dacă studiul Harvard are dreptate și ajungi la o stea în plus, sistemul se plătește singur din prima
            săptămână. Dacă nu, îl oprești oricând.
          </p>
        </div>

        <div className="sv-reveal" style={{ maxWidth: 560, margin: "44px auto 0" }}>
          <Corners inset={-10}>
            <div className="sv-card" style={{ padding: 34, textAlign: "center", background: "linear-gradient(160deg, rgba(198,161,91,.07), rgba(22,19,15,.85))" }}>
              <div style={{ fontSize: 11, letterSpacing: ".24em", textTransform: "uppercase", color: C.gold }}>Pachet complet</div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 8, marginTop: 14 }}>
                <span style={{ fontFamily: serif, fontSize: 62, fontWeight: 600, lineHeight: 1 }}>
                  <Counter to={149} />
                </span>
                <span style={{ fontSize: 15, color: C.muted, paddingBottom: 10 }}>lei / lună</span>
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>fără contract pe termen lung · prima lună de probă</div>

              <div style={{ borderTop: `1px solid ${C.border2}`, margin: "24px 0", paddingTop: 22, textAlign: "left", display: "flex", flexDirection: "column", gap: 11 }}>
                {[
                  "Pagină de scanare personalizată cu brandul tău",
                  "QR-uri gata de tipar pentru toate mesele",
                  "Alerte pe email cu rezumat AI și draft de răspuns",
                  "Panou de manager cu analize și teme recurente",
                  "Raport lunar automat + export CSV",
                  "Suport direct, om real, pe email",
                ].map((f) => (
                  <div key={f} style={{ display: "flex", gap: 10, fontSize: 13.5, color: C.muted }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><path d="M4 12.5l5 5L20 6.5" /></svg>
                    {f}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                <a className="sv-btn sv-btn-primary" href={buyHref} style={{ flex: "1 1 190px" }}>
                  <Ic.cart /> Cumpără
                </a>
                <a className="sv-btn sv-btn-ghost" href={contactHref} style={{ flex: "1 1 190px" }}>
                  <Ic.mail /> Contactează-ne
                </a>
              </div>
              <p style={{ fontSize: 11.5, color: "#6E6759", margin: "16px 0 0" }}>
                Ambele butoane deschid un email către{" "}
                <a href={`mailto:${SALES_EMAIL}`} style={{ color: C.gold, textDecoration: "none" }}>{SALES_EMAIL}</a>, cu
                mesajul deja pregătit.
              </p>
            </div>
          </Corners>
        </div>
      </Section>

      {/* ---------------- FAQ ---------------- */}
      <Section>
        <div className="sv-reveal" style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 className="sv-h2" style={{ textAlign: "center" }}>Întrebări firești</h2>
          <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { q: "Nu e asta „filtrare de recenzii”? Google nu penalizează?", a: "Nu. Review gating înseamnă să arăți calea către Google doar clienților mulțumiți. La noi ambele opțiuni apar simultan, cu exact aceeași greutate vizuală, pentru toată lumea. Clientul decide, nu algoritmul tău." },
              { q: "Ce se întâmplă dacă cineva scrie ceva grav?", a: "AI-ul marchează mesajele sensibile (igienă, siguranță alimentară, comportament discriminatoriu) și le pune în capul listei, cu semnalizare distinctă în alerta pe email. Le vezi primele, nu îngropate." },
              { q: "Cât durează instalarea?", a: "O zi. Ne trimiți numele, sigla și linkul profilului Google, iar noi îți dăm pagina, QR-urile pentru mese și accesul la panou. Personalul nu trebuie să învețe nimic." },
              { q: "Datele clienților sunt în siguranță?", a: "Contactul e opțional, se stochează criptat, nu se vinde și nu se folosește pentru marketing. Poți exporta sau șterge tot, oricând." },
              { q: "Merge și pentru cafenele, baruri, hoteluri?", a: "Da. Orice loc unde oamenii stau la o masă sau la o recepție și au o părere. Scrie-ne ce tip de local ai și îți spunem exact cum îl configurăm." },
            ].map((f) => (
              <details key={f.q} className="sv-card sv-reveal" style={{ padding: "16px 18px", cursor: "pointer" }}>
                <summary style={{ listStyle: "none", fontSize: 15, fontWeight: 600, display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center" }}>
                  {f.q}
                  <span style={{ color: C.gold, flexShrink: 0 }}>+</span>
                </summary>
                <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.75, margin: "12px 0 0" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------- FINAL CTA ---------------- */}
      <Section style={{ paddingTop: 0 }}>
        <div className="sv-reveal" style={{ position: "relative", overflow: "hidden", borderRadius: 26, border: `1px solid ${C.border}`, padding: "clamp(40px, 6vw, 74px) 26px", textAlign: "center", background: "radial-gradient(120% 140% at 50% 0%, rgba(198,161,91,.12), rgba(16,14,11,.9) 62%)" }}>
          <div style={{ position: "absolute", top: "-40%", left: "50%", width: 700, height: 700, marginLeft: -350, borderRadius: "50%", filter: "blur(40px)", background: "radial-gradient(circle, rgba(198,161,91,.14), transparent 65%)", animation: "sv-float1 12s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <h2 className="sv-h2" style={{ margin: 0 }}>
              Următoarea recenzie de o stea
              <br />
              poate fi doar un email către tine.
            </h2>
            <p className="sv-lead" style={{ margin: "16px auto 0", textAlign: "center" }}>
              Pornim {displayName} în 24 de ore. Scrie-ne și îți trimitem QR-urile.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 30 }}>
              <a className="sv-btn sv-btn-primary" href={buyHref}><Ic.cart /> Cumpără</a>
              <a className="sv-btn sv-btn-ghost" href={contactHref}><Ic.mail /> Contactează-ne</a>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------- FOOTER ---------------- */}
      <footer style={{ borderTop: `1px solid ${C.border2}`, padding: "30px 22px 46px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: serif, fontSize: 17, letterSpacing: ".16em" }}>SCAN<span style={{ color: C.gold }}>VOGUE</span></div>
          <div style={{ fontSize: 12, color: "#6E6759" }}>© {new Date().getFullYear()} ScanVogue · Platformă de management al recenziilor</div>
          <a className="sv-link" href={`mailto:${SALES_EMAIL}`}>{SALES_EMAIL}</a>
        </div>
      </footer>
    </div>
  );
}
