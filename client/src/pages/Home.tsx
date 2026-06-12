import { Link, Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// @ts-ignore
import "./Home.css";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────

const logos = [
  { label: "React", symbol: "⚛" },
  { label: "Next.js", symbol: "▲" },
  { label: "Node.js", symbol: "⬡" },
  { label: "Python", symbol: "🐍" },
  { label: "TypeScript", symbol: "TS" },
  { label: "AWS", symbol: "☁" },
  { label: "Rust", symbol: "⚙" },
  { label: "Go", symbol: "◈" },
];

const stepsData = [
  {
    num: "01",
    title: "Create Your Account",
    desc: "Sign up in under 60 seconds as a developer or client. Set up your profile and start exploring opportunities.",
    glyph: "⌬",
  },
  {
    num: "02",
    title: "Find Your Match",
    desc: "Browse projects that fit your skills or post a job and receive proposals from vetted developers.",
    glyph: "⊕",
  },
  {
    num: "03",
    title: "Collaborate & Succeed",
    desc: "Work together with built-in messaging, milestone tracking, and secure escrow payments.",
    glyph: "◎",
  },
];

const featuresData = [
  {
    title: "Developer Profiles",
    desc: "Showcase your skills, portfolio, and experience with a rich profile that stands out to clients.",
    glyph: "⊞",
    accent: "#00FFD1",
  },
  {
    title: "Smart Job Matching",
    desc: "Our AI-powered algorithm connects you with projects that match your skills and preferences.",
    glyph: "⊗",
    accent: "#7B61FF",
  },
  {
    title: "Secure Escrow",
    desc: "Funds are held securely and released only when work meets your requirements.",
    glyph: "⊘",
    accent: "#FF3E6C",
  },
  {
    title: "Real-Time Chat",
    desc: "Built-in messaging with instant notifications keeps communication seamless and organized.",
    glyph: "⊙",
    accent: "#00FFD1",
  },
  {
    title: "Milestone Tracking",
    desc: "Break projects into milestones with scheduled payments. Always know where your project stands.",
    glyph: "⊛",
    accent: "#7B61FF",
  },
  {
    title: "Review System",
    desc: "Build reputation with verified reviews. Quality work leads to more opportunities.",
    glyph: "◈",
    accent: "#FF3E6C",
  },
];

const testimonialsData = [
  {
    name: "Sarah Chen",
    role: "Full-Stack Developer",
    initials: "SC",
    text: "DevHire completely transformed my freelance career. I've worked with amazing clients from around the world and the secure payment system gives me total peace of mind.",
    accent: "#00FFD1",
  },
  {
    name: "Marcus Johnson",
    role: "Startup Founder",
    initials: "MJ",
    text: "Finding skilled developers used to be a nightmare. DevHire made it effortless. I posted a project and had qualified proposals within hours. The quality of talent is outstanding.",
    accent: "#7B61FF",
  },
  {
    name: "Priya Patel",
    role: "UI/UX Designer",
    initials: "PP",
    text: "What sets DevHire apart is the community. The collaboration tools, milestone tracking, and responsive support team make every project a smooth experience.",
    accent: "#FF3E6C",
  },
  {
    name: "Dmitri Volkov",
    role: "Backend Engineer",
    initials: "DV",
    text: "I've tried every freelance platform. DevHire is the only one that actually understands developers. The matching algorithm is eerily good.",
    accent: "#00FFD1",
  },
  {
    name: "Aisha Okonkwo",
    role: "Product Manager",
    initials: "AO",
    text: "We scaled our product team from 2 to 12 using DevHire. The escrow system protected us throughout. Zero bad hires in 18 months.",
    accent: "#7B61FF",
  },
];

// ─── Circuit background SVG ───────────────────────────────────────────────────

function CircuitBg() {
  return (
    <div className="circuit-bg">
      <svg
        viewBox="0 0 1440 900"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Horizontal traces */}
        {[80, 180, 300, 420, 540, 660, 780].map((y, i) => (
          <path
            key={`h${i}`}
            className={`trace-line ${i % 3 === 1 ? "v" : i % 3 === 2 ? "c" : ""}`}
            d={`M0 ${y} L${200 + i * 60} ${y} L${220 + i * 60} ${y + 20} L${600 + i * 40} ${y + 20} L${620 + i * 40} ${y} L1440 ${y}`}
            strokeDasharray="80 360"
            style={{
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${7 + i * 0.5}s`,
            }}
          />
        ))}
        {/* Vertical traces */}
        {[120, 280, 480, 720, 960, 1160, 1360].map((x, i) => (
          <path
            key={`v${i}`}
            className={`trace-line ${i % 2 === 0 ? "v" : ""}`}
            d={`M${x} 0 L${x} ${100 + i * 30} L${x + 20} ${120 + i * 30} L${x + 20} ${500 + i * 20} L${x} ${520 + i * 20} L${x} 900`}
            strokeDasharray="60 340"
            style={{
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${6 + i * 0.4}s`,
            }}
          />
        ))}
        {/* Junction nodes */}
        {[
          [120, 80],
          [280, 180],
          [480, 300],
          [720, 420],
          [960, 540],
          [1160, 660],
          [1360, 780],
          [200, 420],
          [400, 180],
          [600, 540],
          [800, 300],
          [1000, 80],
          [1200, 420],
        ].map(([x, y], i) => (
          <circle
            key={`n${i}`}
            className={`circuit-node ${i % 2 === 0 ? "v" : ""}`}
            cx={x}
            cy={y}
            r={3}
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </svg>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCell({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
  index: number;
}) {
  const cellRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cellRef}
      className="stat-cell"
      data-count={value}
    >
      <div className="stat-num">
        <span className="stat-value">0</span>
        <span className="stat-suffix">{suffix}</span>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Home() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  // Refs for GSAP targets
  const rootRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRowRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const dashRef = useRef<HTMLDivElement>(null);
  const chip1Ref = useRef<HTMLDivElement>(null);
  const chip2Ref = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const stepsSectionRef = useRef<HTMLDivElement>(null);
  const stepsGridRef = useRef<HTMLDivElement>(null);
  const featuresSectionRef = useRef<HTMLDivElement>(null);
  const featuresGridRef = useRef<HTMLDivElement>(null);
  const testimonialsSectionRef = useRef<HTMLDivElement>(null);
  const testimonialsHeaderRef = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  // Duplicate testimonials
  const allTestimonials = [...testimonialsData, ...testimonialsData];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMob = window.matchMedia("(max-width: 768px)").matches;

    // Defensive helper — calls fn only if target is truthy, returns true if it ran
    function safe(el: unknown, fn: () => void) { if (el) fn(); return !!el; }
    function safeAll(list: unknown, fn: () => void) { if (list && (list as []).length) fn(); }

    const ctx = gsap.context(() => {
      // ── Hero timeline ──
      const tl = gsap.timeline({ defaults: { ease: isMob ? "power2.out" : "power3.out" } });

      safe(badgeRef.current, () =>
        tl.from(badgeRef.current, { y: isMob ? -12 : -24, opacity: 0, duration: isMob ? 0.4 : 0.6 })
      );

      safe(headlineRef.current, () => {
        const w = headlineRef.current!.querySelectorAll(".word-split");
        safeAll(w, () => tl.from(w, { y: isMob ? 30 : 60, opacity: 0, stagger: isMob ? 0.04 : 0.075, duration: isMob ? 0.5 : 0.8 }, "-=0.25"));
      });

      safe(subRef.current, () => tl.from(subRef.current, { y: isMob ? 15 : 30, opacity: 0, duration: isMob ? 0.35 : 0.6 }, "-=0.35"));

      safe(ctaRowRef.current, () => {
        const c = ctaRowRef.current!.children;
        safeAll(c, () => tl.from(c, { y: isMob ? 12 : 20, opacity: 0, stagger: isMob ? 0.06 : 0.1, duration: isMob ? 0.3 : 0.5 }, "-=0.25"));
      });

      safe(pillsRef.current, () => {
        const p = pillsRef.current!.children;
        safeAll(p, () => tl.from(p, {
          y: isMob ? 12 : 24,
          opacity: 0,
          stagger: isMob ? 0.03 : 0.04,
          duration: isMob ? 0.3 : 0.5,
          ...(isMob ? {} : { rotateX: -90 }),
        }, "-=0.15"));
      });

      safe(dashRef.current, () => {
        if (isMob) {
          tl.from(dashRef.current, { y: 30, opacity: 0 }, "-=0.25");
        } else {
          tl.from(dashRef.current, { x: 120, opacity: 0, rotate: 3, duration: 1, ease: "power4.out" }, "-=0.7");
        }
      });

      safeAll([chip1Ref.current, chip2Ref.current], () => {
        tl.from([chip1Ref.current, chip2Ref.current], {
          scale: isMob ? 0.8 : 0,
          opacity: 0,
          stagger: isMob ? 0.1 : 0.2,
          duration: isMob ? 0.3 : 0.6,
          ...(isMob ? {} : { ease: "back.out(1.7)" }),
        }, "-=0.4");
      });

      // ── Stats count-up ──
      const statCells = statsRef.current?.querySelectorAll(".stat-cell");
      statCells?.forEach((cell) => {
        const target = parseInt(cell.getAttribute("data-count") || "0", 10);
        const numEl = cell.querySelector(".stat-value");
        if (!numEl) return;
        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: target,
          scrollTrigger: { trigger: cell, start: "top 85%" },
          duration: 2.5,
          ease: "power2.out",
          onUpdate: () => { numEl.textContent = Math.floor(proxy.val).toLocaleString(); },
        });
      });

      // ── Steps ──
      safe(stepsSectionRef.current, () => {
        const h = stepsSectionRef.current!.querySelector(".steps-header");
        safe(h, () => gsap.from(h, { scrollTrigger: { trigger: stepsSectionRef.current, start: "top 82%" }, y: 40, opacity: 0, duration: 0.8, ease: "power3.out" }));
      });
      safe(stepsGridRef.current, () => {
        safeAll(stepsGridRef.current!.children, () => gsap.from(stepsGridRef.current!.children, { scrollTrigger: { trigger: stepsGridRef.current, start: "top 82%" }, y: 50, opacity: 0, stagger: 0.15, duration: 0.7, ease: "power3.out" }));
      });

      // ── Features ──
      safe(featuresSectionRef.current, () => {
        const h = featuresSectionRef.current!.querySelector(".features-header");
        safe(h, () => gsap.from(h, { scrollTrigger: { trigger: featuresSectionRef.current, start: "top 82%" }, y: 40, opacity: 0, duration: 0.8, ease: "power3.out" }));
      });
      safe(featuresGridRef.current, () => {
        safeAll(featuresGridRef.current!.children, () => gsap.from(featuresGridRef.current!.children, { scrollTrigger: { trigger: featuresGridRef.current, start: "top 85%" }, y: 40, opacity: 0, stagger: 0.08, duration: 0.7, ease: "power3.out" }));
      });

      // ── Testimonials header ──
      safe(testimonialsHeaderRef.current, () =>
        gsap.from(testimonialsHeaderRef.current, { scrollTrigger: { trigger: testimonialsSectionRef.current, start: "top 82%" }, y: 40, opacity: 0, duration: 0.8, ease: "power3.out" })
      );

      // ── Testimonials marquee ──
      safe(marqueeTrackRef.current, () => {
        const t = marqueeTrackRef.current!;
        gsap.to(t, { x: () => -(t.scrollWidth / 2), duration: 50, ease: "none", repeat: -1 });
        const w = t.closest(".marquee-wrapper");
        safe(w, () => {
          w!.addEventListener("mouseenter", () => gsap.to(t, { timeScale: 0, duration: 0.3 }));
          w!.addEventListener("mouseleave", () => gsap.to(t, { timeScale: 1, duration: 0.3 }));
        });
      });

      // ── CTA ──
      safe(ctaSectionRef.current, () => {
        const b = ctaSectionRef.current!.querySelector(".cta-block");
        safe(b, () => gsap.from(b, { scrollTrigger: { trigger: ctaSectionRef.current, start: "top 82%" }, y: 50, opacity: 0, scale: 0.97, duration: 1, ease: "power3.out" }));
      });

      // ── Footer ──
      safe(footerRef.current, () =>
        gsap.from(footerRef.current, { scrollTrigger: { trigger: footerRef.current, start: "top 90%" }, y: 20, opacity: 0, duration: 0.6, ease: "power2.out" })
      );
    });

    // Prevent ScrollTrigger from mutating body and causing double scrollbars
    ScrollTrigger.config({ ignoreMobileResize: true });
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="dh-root">
      {/* Background layers */}
      <CircuitBg />
      <div className="scanlines" />

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="dh-container">
          <div
            className="hero-layout"
            style={{ display: "flex", gap: "64px", alignItems: "center" }}
          >
            {/* Left */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div ref={badgeRef} className="hero-eyebrow">
                <span className="dh-badge">
                  <span className="dh-badge-dot" />
                  12,000+ developers online now
                </span>
              </div>

              <h1 ref={headlineRef} className="dh-display hero-headline">
                <span className="word-split"><span className="text-cyan">Hire</span></span>
                <span className="word-split">the</span>
                <br />
                <span className="word-split"><span className="text-cyan">Devs</span></span>
                <span className="word-split">that</span>
                <br />
                <span className="word-split line-muted">ship.</span>
              </h1>

              <p ref={subRef} className="hero-sub">
                The freelance marketplace built for engineers. Find your next
                contract or source exceptional talent — no noise, just signal.
              </p>

              <div ref={ctaRowRef} className="hero-cta-row">
                <Link to="/register" className="dh-btn-primary">
                  Get Started Free
                  <span style={{ fontSize: "1.1em" }}>→</span>
                </Link>
                <Link to="/jobs" className="dh-btn-ghost">
                  Browse Jobs
                </Link>
              </div>

              <div>
                <p className="hero-stack-label">Trusted technology stack</p>
                <div ref={pillsRef} className="tech-pills">
                  {logos.map((l) => (
                    <span key={l.label} className="tech-pill">
                      <span className="tech-pill-sym">{l.symbol}</span>
                      {l.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Dashboard preview */}
            <div className="hero-visual">
              <div ref={dashRef} className="dash-card">
                <div className="dash-chrome">
                  <div className="dash-dot" style={{ background: "#FF5F57" }} />
                  <div className="dash-dot" style={{ background: "#FFBD2E" }} />
                  <div className="dash-dot" style={{ background: "#28C840" }} />
                  <span className="dash-url">dashboard.devhire.io</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "4px",
                  }}
                >
                  <div className="dash-label">Active Projects</div>
                  <div className="dash-value">24</div>
                </div>
                <div className="dash-bar-track">
                  <div className="dash-bar-fill" />
                </div>

                <div className="dash-mini-grid">
                  {[
                    ["$12.4k", "Earned"],
                    ["98%", "Satisfaction"],
                    ["4.9★", "Rating"],
                  ].map(([v, l]) => (
                    <div key={l} className="dash-mini-cell">
                      <div className="dash-mini-val">{v}</div>
                      <div className="dash-mini-lbl">{l}</div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: "20px",
                    padding: "14px",
                    background: "var(--dash-inner-bg)",
                    border: "1px solid var(--dash-inner-border)",
                    borderRadius: "6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          color: "var(--text-primary)",
                        }}
                      >
                        React Dashboard — v2
                      </div>
                      <div className="dash-label" style={{ marginTop: "3px" }}>
                        Milestone 3 of 5
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "4px 10px",
                        background: "var(--dash-inner-bg)",
                        border: "1px solid var(--badge-border)",
                        borderRadius: "4px",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.62rem",
                        color: "var(--cyan)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      IN REVIEW
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating chips */}
              <div
                ref={chip1Ref}
                className="float-chip"
                style={{
                  top: "-16px",
                  right: "-16px",
                  animation: "float-slow 5s ease-in-out infinite 1s",
                }}
              >
                <span className="float-chip-icon">👾</span>
                <div>
                  <div className="float-chip-title">+250 devs</div>
                  <div className="float-chip-sub">joined today</div>
                </div>
              </div>

              <div
                ref={chip2Ref}
                className="float-chip"
                style={{
                  bottom: "-16px",
                  left: "-16px",
                  animation: "float-slow 5s ease-in-out infinite 2.5s",
                }}
              >
                <span className="float-chip-icon">💼</span>
                <div>
                  <div className="float-chip-title">1,200+ jobs</div>
                  <div className="float-chip-sub">open now</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-section">
        <div ref={statsRef} className="dh-container" style={{ padding: 0, maxWidth: "100%" }}>
          <div className="stats-grid">
            <StatCell value={12000} suffix="+" label="Developers" index={0} />
            <StatCell value={25000} suffix="+" label="Job Listings" index={1} />
            <StatCell
              value={50000}
              suffix="+"
              label="Projects Done"
              index={2}
            />
            <StatCell value={98} suffix="%" label="Satisfaction" index={3} />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section ref={stepsSectionRef} className="steps-section">
        <div className="dh-container">
          <div className="steps-header">
            <p className="section-eyebrow">// Process</p>
            <h2 className="section-heading">
              Three steps.
              <br />
              Zero friction.
            </h2>
            <p className="section-sub">
              Whether you're shipping a product or landing your next contract,
              you're up and running in minutes.
            </p>
          </div>

          <div ref={stepsGridRef} className="steps-grid">
            {stepsData.map((step, i) => (
              <div key={step.num} className="step-cell" style={{ height: "100%" }}>
                <div className="step-number">{step.num}</div>
                <span className="step-glyph">{step.glyph}</span>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section ref={featuresSectionRef} className="features-section">
        <div className="dh-container">
          <div className="features-header">
            <div>
              <p className="section-eyebrow">// Capabilities</p>
              <h2 className="section-heading">
                Built for
                <br />
                how devs work.
              </h2>
            </div>
            <p className="section-sub" style={{ maxWidth: "360px" }}>
              Every tool you need from first contact to final payment, without
              the bloat.
            </p>
          </div>

          <div ref={featuresGridRef} className="features-grid">
            {featuresData.map((f, i) => (
              <div
                key={f.title}
                className="feature-cell"
                style={{ "--accent-color": f.accent } as React.CSSProperties}
              >
                <span className="feature-glyph" style={{ color: f.accent }}>
                  {f.glyph}
                </span>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section ref={testimonialsSectionRef} className="testimonials-section">
        <div className="dh-container">
          <div ref={testimonialsHeaderRef} className="testimonials-header">
            <p className="section-eyebrow">// Community</p>
            <h2 className="section-heading">
              Trusted by
              <br />
              builders worldwide.
            </h2>
          </div>
        </div>

        <div className="marquee-wrapper">
          <div ref={marqueeTrackRef} className="marquee-track">
              {allTestimonials.map((t, i) => (
                <div key={`${t.name}-${i}`} className="testimonial-card">
                  <div className="t-stars">
                    {[...Array(5)].map((_, j) => (
                      <span
                        key={j}
                        className="t-star"
                        style={{ color: t.accent }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="t-text">"{t.text}"</p>
                  <div className="t-author">
                    <div className="t-avatar" style={{ background: t.accent }}>
                      {t.initials}
                    </div>
                    <div>
                      <div className="t-name">{t.name}</div>
                      <div className="t-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={ctaSectionRef} className="cta-section">
        <div className="dh-container">
          <div className="cta-block">
            <div className="cta-glow-line" />

            <p className="section-eyebrow" style={{ marginBottom: "20px" }}>
              // Ready to build?
            </p>

            <h2 className="cta-heading">
              Your next great
              <br />
              project starts <span className="text-cyan">here.</span>
            </h2>

            <p className="cta-sub">
              Join the fastest-growing freelance marketplace for developers.
              Free to sign up. No credit card required.
            </p>

            <div className="cta-row">
              <Link
                to="/register"
                className="dh-btn-primary"
                style={{ fontSize: "1rem", padding: "16px 36px" }}
              >
                Get Started Free →
              </Link>
              <Link
                to="/devs"
                className="dh-btn-ghost"
                style={{ fontSize: "1rem", padding: "15px 36px" }}
              >
                Browse Developers
              </Link>
            </div>

            <p className="cta-note">
              FREE_FOR_DEVS · NO_CARD_REQUIRED · CANCEL_ANYTIME
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer ref={footerRef} className="dh-footer">
        <div className="dh-container">
          <div className="footer-inner">
            <Link to="/" className="footer-brand">
              <div className="footer-brand-mark">DH</div>
              DevHire
            </Link>

            <ul className="footer-links">
              <li>
                <Link to="/jobs">Browse Jobs</Link>
              </li>
              <li>
                <Link to="/devs">Find Devs</Link>
              </li>
              <li>
                <Link to="/register">Sign Up</Link>
              </li>
            </ul>

            <p className="footer-copy">
              © {new Date().getFullYear()} DevHire. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
