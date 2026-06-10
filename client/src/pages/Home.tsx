import { Link, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
// @ts-ignore
import "./Home.css";

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useCountUp(end: number, duration = 2500) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const startTime = Date.now();
          const frame = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(frame);
          };
          requestAnimationFrame(frame);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

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

function Reveal({
  children,
  delay = 0,
  threshold = 0.1,
}: {
  children: React.ReactNode;
  delay?: number;
  threshold?: number;
}) {
  const { ref, visible } = useReveal(threshold);
  return (
    <div
      ref={ref}
      className={`reveal-ready ${visible ? "reveal-visible" : "reveal-hidden"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function StatCell({
  value,
  suffix,
  label,
  index,
}: {
  value: number;
  suffix: string;
  label: string;
  index: number;
}) {
  const { count, ref } = useCountUp(value);
  const { ref: rRef, visible } = useReveal(0.3);

  return (
    <div
      ref={(node) => {
        (rRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={`stat-cell reveal-ready ${visible ? "reveal-visible" : "reveal-hidden"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="stat-num">
        {count.toLocaleString()}
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

  // Duplicate testimonials for seamless marquee loop
  const allTestimonials = [...testimonialsData, ...testimonialsData];

  return (
    <div className="dh-root">
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
              <div className="hero-eyebrow">
                <span className="dh-badge">
                  <span className="dh-badge-dot" />
                  12,000+ developers online now
                </span>
              </div>

              <h1 className="dh-display hero-headline">
                <span className="text-cyan">Hire</span> the
                <br />
                <span className="text-cyan">Devs</span> that
                <br />
                <span className="hero-headline line-muted">ship.</span>
              </h1>

              <p className="hero-sub">
                The freelance marketplace built for engineers. Find your next
                contract or source exceptional talent — no noise, just signal.
              </p>

              <div className="hero-cta-row">
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
                <div className="tech-pills">
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
              <div className="dash-card">
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
                className="float-chip"
                style={{
                  top: "-16px",
                  right: "-16px",
                  animationDelay: "1s",
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
        <div className="dh-container" style={{ padding: 0, maxWidth: "100%" }}>
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
      <section className="steps-section">
        <div className="dh-container">
          <Reveal>
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
          </Reveal>

          <div className="steps-grid">
            {stepsData.map((step, i) => (
              <Reveal key={step.num} delay={i * 120}>
                <div className="step-cell" style={{ height: "100%" }}>
                  <div className="step-number">{step.num}</div>
                  <span className="step-glyph">{step.glyph}</span>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                  {i < stepsData.length - 1 && (
                    <div
                      className="step-connector"
                      style={{ display: "none" }}
                    />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <div className="dh-container">
          <Reveal>
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
          </Reveal>

          <div className="features-grid">
            {featuresData.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div
                  className="feature-cell"
                  style={{ "--accent-color": f.accent } as React.CSSProperties}
                >
                  <span className="feature-glyph" style={{ color: f.accent }}>
                    {f.glyph}
                  </span>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section">
        <div className="dh-container">
          <Reveal>
            <div className="testimonials-header">
              <p className="section-eyebrow">// Community</p>
              <h2 className="section-heading">
                Trusted by
                <br />
                builders worldwide.
              </h2>
            </div>
          </Reveal>
        </div>

        <div className="marquee-wrapper">
          <div style={{ overflow: "hidden" }}>
            <div className="marquee-track">
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
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="dh-container">
          <Reveal>
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
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="dh-footer">
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
