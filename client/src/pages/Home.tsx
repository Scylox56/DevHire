import { Link, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
// @ts-ignore
import "./Home.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

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

// ─── Cursor glow ──────────────────────────────────────────────────────────────

function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    gsap.ticker.add(() => {
      gsap.set(glow, { x: mouseX, y: mouseY });
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <div className="cursor-glow" ref={glowRef} />;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

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

  return (
    <div
      ref={ref}
      className="stat-cell gsap-stat"
      data-index={index}
      style={{ opacity: 0, transform: "translateY(30px)" }}
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

  const allTestimonials = [...testimonialsData, ...testimonialsData];

  // Refs for GSAP targets
  const heroHeadlineRef = useRef<HTMLHeadingElement>(null);
  const heroSubRef = useRef<HTMLParagraphElement>(null);
  const heroEyebrowRef = useRef<HTMLDivElement>(null);
  const heroCtaRef = useRef<HTMLDivElement>(null);
  const heroStackRef = useRef<HTMLDivElement>(null);
  const heroVisualRef = useRef<HTMLDivElement>(null);
  const heroChip1Ref = useRef<HTMLDivElement>(null);
  const heroChip2Ref = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const stepsHeaderRef = useRef<HTMLDivElement>(null);
  const stepCellsRef = useRef<HTMLDivElement[]>([]);
  const featuresHeaderRef = useRef<HTMLDivElement>(null);
  const featureCellsRef = useRef<HTMLDivElement[]>([]);
  const testimonialsHeaderRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const primaryBtnRef = useRef<HTMLAnchorElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReduced) return;

      // ── 1. HERO ENTRANCE ─────────────────────────────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Badge
      tl.fromTo(
        heroEyebrowRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.1,
      );

      // Split headline words
      if (heroHeadlineRef.current) {
        const split = new SplitText(heroHeadlineRef.current, {
          type: "words,chars",
        });
        tl.fromTo(
          split.words,
          { opacity: 0, y: 60, rotateX: -40 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.7,
            stagger: 0.08,
            transformOrigin: "0% 50% -30px",
          },
          0.3,
        );
      }

      tl.fromTo(
        heroSubRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.85,
      );

      tl.fromTo(
        heroCtaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        1.0,
      );

      tl.fromTo(
        heroStackRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5 },
        1.15,
      );

      // Hero visual: slide in from right with perspective tilt
      tl.fromTo(
        heroVisualRef.current,
        { opacity: 0, x: 80, rotateY: 12, scale: 0.92 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out",
        },
        0.5,
      );

      // Floating chips cascade in
      tl.fromTo(
        heroChip1Ref.current,
        { opacity: 0, scale: 0.7, y: -20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" },
        1.2,
      );
      tl.fromTo(
        heroChip2Ref.current,
        { opacity: 0, scale: 0.7, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" },
        1.35,
      );

      // ── 2. STATS BAR ─────────────────────────────────────────────────────────
      const statCells = document.querySelectorAll(".gsap-stat");
      if (statCells.length) {
        gsap.to(statCells, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
            once: true,
          },
        });
      }

      // ── 3. STEPS SECTION ─────────────────────────────────────────────────────
      if (stepsHeaderRef.current) {
        const split = new SplitText(
          stepsHeaderRef.current.querySelector(".section-heading"),
          { type: "lines" },
        );
        gsap.fromTo(
          stepsHeaderRef.current.querySelector(".section-eyebrow"),
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            scrollTrigger: {
              trigger: stepsHeaderRef.current,
              start: "top 80%",
              once: true,
            },
          },
        );
        gsap.fromTo(
          split.lines,
          { opacity: 0, y: 40, skewY: 3 },
          {
            opacity: 1,
            y: 0,
            skewY: 0,
            duration: 0.7,
            stagger: 0.1,
            scrollTrigger: {
              trigger: stepsHeaderRef.current,
              start: "top 78%",
              once: true,
            },
          },
        );
        gsap.fromTo(
          stepsHeaderRef.current.querySelector(".section-sub"),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.3,
            scrollTrigger: {
              trigger: stepsHeaderRef.current,
              start: "top 78%",
              once: true,
            },
          },
        );
      }

      stepCellsRef.current.forEach((cell, i) => {
        if (!cell) return;
        gsap.fromTo(
          cell,
          { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            delay: i * 0.15,
            ease: "power2.out",
            scrollTrigger: { trigger: cell, start: "top 85%", once: true },
          },
        );
        // Glyph spin-in
        const glyph = cell.querySelector(".step-glyph");
        if (glyph) {
          gsap.fromTo(
            glyph,
            { rotate: -90, opacity: 0, scale: 0.5 },
            {
              rotate: 0,
              opacity: 1,
              scale: 1,
              duration: 0.5,
              delay: i * 0.15 + 0.25,
              ease: "back.out(2)",
              scrollTrigger: { trigger: cell, start: "top 85%", once: true },
            },
          );
        }
      });

      // ── 4. FEATURES SECTION ──────────────────────────────────────────────────
      if (featuresHeaderRef.current) {
        gsap.fromTo(
          featuresHeaderRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            scrollTrigger: {
              trigger: featuresHeaderRef.current,
              start: "top 80%",
              once: true,
            },
          },
        );
      }

      featureCellsRef.current.forEach((cell, i) => {
        if (!cell) return;
        const row = Math.floor(i / 3);
        const col = i % 3;
        gsap.fromTo(
          cell,
          { opacity: 0, y: 40 + row * 10, x: (col - 1) * 15 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cell,
              start: "top 88%",
              once: true,
            },
            delay: col * 0.08 + row * 0.05,
          },
        );
      });

      // ── 5. TESTIMONIALS MARQUEE ──────────────────────────────────────────────
      if (testimonialsHeaderRef.current) {
        gsap.fromTo(
          testimonialsHeaderRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            scrollTrigger: {
              trigger: testimonialsHeaderRef.current,
              start: "top 80%",
              once: true,
            },
          },
        );
      }

      // GSAP-driven infinite marquee (replaces CSS animation)
      if (marqueeRef.current) {
        const track = marqueeRef.current;
        const totalWidth = track.scrollWidth / 2; // half because content is doubled

        gsap.to(track, {
          x: `-=${totalWidth}`,
          duration: totalWidth / 60, // speed: px/s
          ease: "none",
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
          },
        });
      }

      // ── 6. CTA SECTION ───────────────────────────────────────────────────────
      if (ctaRef.current) {
        const ctaTl = gsap.timeline({
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 75%",
            once: true,
          },
        });

        ctaTl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 40, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" },
        );

        const ctaHeading = ctaRef.current.querySelector(".cta-heading");
        if (ctaHeading) {
          const split = new SplitText(ctaHeading, { type: "lines" });
          ctaTl.fromTo(
            split.lines,
            { opacity: 0, y: 30, skewY: 2 },
            { opacity: 1, y: 0, skewY: 0, duration: 0.6, stagger: 0.1 },
            0.15,
          );
        }

        ctaTl.fromTo(
          ctaRef.current.querySelector(".cta-sub"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          0.4,
        );

        ctaTl.fromTo(
          ctaRef.current.querySelector(".cta-row"),
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5 },
          0.55,
        );

        // Glow pulse on the cta block after enter
        gsap.to(ctaRef.current, {
          boxShadow:
            "0 0 80px rgba(0,255,209,0.12), 0 0 160px rgba(0,255,209,0.05)",
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.5,
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 75%",
            once: true,
          },
        });
      }

      // ── 7. MAGNETIC PRIMARY BUTTON ───────────────────────────────────────────
      const btn = primaryBtnRef.current;
      if (btn) {
        const onEnter = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) * 0.35;
          const dy = (e.clientY - cy) * 0.35;
          gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: "power2.out" });
        };
        const onLeave = () => {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.4)",
          });
        };
        btn.addEventListener("mousemove", onEnter);
        btn.addEventListener("mouseleave", onLeave);
        return () => {
          btn.removeEventListener("mousemove", onEnter);
          btn.removeEventListener("mouseleave", onLeave);
        };
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="dh-root" ref={rootRef}>
      <CursorGlow />
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
              <div
                className="hero-eyebrow"
                ref={heroEyebrowRef}
                style={{ opacity: 0 }}
              >
                <span className="dh-badge">
                  <span className="dh-badge-dot" />
                  12,000+ developers online now
                </span>
              </div>

              <h1 className="dh-display hero-headline" ref={heroHeadlineRef}>
                <span className="text-cyan">Hire</span> the
                <br />
                <span className="text-cyan">Devs</span> that
                <br />
                <span className="hero-headline line-muted">ship.</span>
              </h1>

              <p className="hero-sub" ref={heroSubRef} style={{ opacity: 0 }}>
                The freelance marketplace built for engineers. Find your next
                contract or source exceptional talent — no noise, just signal.
              </p>

              <div
                className="hero-cta-row"
                ref={heroCtaRef}
                style={{ opacity: 0 }}
              >
                <Link
                  to="/register"
                  className="dh-btn-primary"
                  ref={primaryBtnRef}
                >
                  Get Started Free
                  <span style={{ fontSize: "1.1em" }}>→</span>
                </Link>
                <Link to="/jobs" className="dh-btn-ghost">
                  Browse Jobs
                </Link>
              </div>

              <div ref={heroStackRef} style={{ opacity: 0 }}>
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
            <div
              className="hero-visual"
              ref={heroVisualRef}
              style={{ opacity: 0, perspective: "1000px" }}
            >
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
                ref={heroChip1Ref}
                style={{
                  top: "-16px",
                  right: "-16px",
                  opacity: 0,
                  animation: "float-slow 5s ease-in-out infinite 1s",
                }}
              >
                <span className="float-chip-icon" style={{ fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace" }}>&lt;/&gt;</span>
                <div>
                  <div className="float-chip-title">+250 devs</div>
                  <div className="float-chip-sub">joined today</div>
                </div>
              </div>

              <div
                className="float-chip"
                ref={heroChip2Ref}
                style={{
                  bottom: "-16px",
                  left: "-16px",
                  opacity: 0,
                  animation: "float-slow 5s ease-in-out infinite 2.5s",
                }}
              >
                <span className="float-chip-icon" style={{ fontSize: "0.7rem" }}>⎔</span>
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
      <section className="stats-section" ref={statsRef}>
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
          <div className="steps-header" ref={stepsHeaderRef}>
            <p className="section-eyebrow" style={{ opacity: 0 }}>
              // Process
            </p>
            <h2 className="section-heading">
              Three steps.
              <br />
              Zero friction.
            </h2>
            <p className="section-sub" style={{ opacity: 0 }}>
              Whether you're shipping a product or landing your next contract,
              you're up and running in minutes.
            </p>
          </div>

          <div className="steps-grid">
            {stepsData.map((step, i) => (
              <div
                key={step.num}
                className="step-cell"
                style={{ height: "100%", opacity: 0 }}
                ref={(el) => {
                  if (el) stepCellsRef.current[i] = el;
                }}
              >
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
      <section className="features-section">
        <div className="dh-container">
          <div
            className="features-header"
            ref={featuresHeaderRef}
            style={{ opacity: 0 }}
          >
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

          <div className="features-grid">
            {featuresData.map((f, i) => (
              <div
                key={f.title}
                className="feature-cell"
                style={
                  {
                    "--accent-color": f.accent,
                    opacity: 0,
                  } as React.CSSProperties
                }
                ref={(el) => {
                  if (el) featureCellsRef.current[i] = el;
                }}
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
      <section className="testimonials-section">
        <div className="dh-container">
          <div
            className="testimonials-header"
            ref={testimonialsHeaderRef}
            style={{ opacity: 0 }}
          >
            <p className="section-eyebrow">// Community</p>
            <h2 className="section-heading">
              Trusted by
              <br />
              builders worldwide.
            </h2>
          </div>
        </div>

        <div className="marquee-wrapper">
          <div style={{ overflow: "hidden" }}>
            <div className="marquee-track" ref={marqueeRef}>
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
          <div className="cta-block" ref={ctaRef} style={{ opacity: 0 }}>
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
                Get Started Free
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
