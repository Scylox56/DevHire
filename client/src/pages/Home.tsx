import { Link, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

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

const stars = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: `${2 + Math.random() * 4}px`,
  duration: `${2 + Math.random() * 4}s`,
  delay: `${Math.random() * 5}s`,
}));

const logos = [
  "⚛️ React",
  "▲ Next.js",
  "🟢 Node.js",
  "🐍 Python",
  "🔷 TypeScript",
  "☁️ AWS",
];

const stepsData = [
  {
    num: "01",
    title: "Create Your Account",
    desc: "Sign up in under 60 seconds as a developer or client. Set up your profile and start exploring opportunities.",
    icon: "📝",
  },
  {
    num: "02",
    title: "Find Your Match",
    desc: "Browse projects that fit your skills or post a job and receive proposals from vetted developers.",
    icon: "🔍",
  },
  {
    num: "03",
    title: "Collaborate & Succeed",
    desc: "Work together with built-in messaging, milestone tracking, and secure escrow payments.",
    icon: "🤝",
  },
];

const featuresData = [
  {
    title: "Developer Profiles",
    desc: "Showcase your skills, portfolio, and experience with a rich profile that stands out to clients.",
    icon: "🎯",
    color: "from-primary-500 to-primary-600",
  },
  {
    title: "Smart Job Matching",
    desc: "Our AI-powered algorithm connects you with projects that match your skills and preferences.",
    icon: "🤖",
    color: "from-secondary-300 to-secondary-400",
  },
  {
    title: "Secure Escrow",
    desc: "Funds are held securely and released only when work meets your requirements. Peace of mind guaranteed.",
    icon: "🔒",
    color: "from-accent-400 to-accent-500",
  },
  {
    title: "Real-Time Chat",
    desc: "Built-in messaging with instant notifications keeps communication seamless and organized.",
    icon: "💬",
    color: "from-primary-500 to-secondary-400",
  },
  {
    title: "Milestone Tracking",
    desc: "Break projects into milestones with scheduled payments. Always know where your project stands.",
    icon: "📊",
    color: "from-secondary-300 to-accent-400",
  },
  {
    title: "Review System",
    desc: "Build reputation with verified reviews. Quality work leads to more opportunities.",
    icon: "⭐",
    color: "from-accent-400 to-primary-500",
  },
];

const testimonialsData = [
  {
    name: "Sarah Chen",
    role: "Full-Stack Developer",
    avatar: "SC",
    text: "DevHire completely transformed my freelance career. I've worked with amazing clients from around the world and the secure payment system gives me total peace of mind.",
    rating: 5,
    color: "from-primary-400 to-primary-600",
  },
  {
    name: "Marcus Johnson",
    role: "Startup Founder",
    avatar: "MJ",
    text: "Finding skilled developers used to be a nightmare. DevHire made it effortless. I posted a project and had qualified proposals within hours. The quality of talent is outstanding.",
    rating: 5,
    color: "from-secondary-300 to-secondary-500",
  },
  {
    name: "Priya Patel",
    role: "UI/UX Designer",
    avatar: "PP",
    text: "What sets DevHire apart is the community. The collaboration tools, milestone tracking, and responsive support team make every project a smooth experience.",
    rating: 5,
    color: "from-accent-400 to-accent-600",
  },
];

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`text-center mb-14 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <h2 className="text-4xl md:text-5xl font-black gradient-text mb-6 leading-[1.15] pb-2">
        {title}
      </h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
}

function StatCard({
  stat,
  index,
}: {
  stat: { value: number; label: string; icon: string; suffix: string };
  index: number;
}) {
  const { count, ref } = useCountUp(stat.value);
  const { ref: revealRef, visible } = useReveal(0.3);

  return (
    <div
      ref={(node) => {
        (revealRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node;
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={`glass-card-light text-center group hover:-translate-y-1 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="text-4xl mb-3 block">{stat.icon}</div>
      <div className="flex items-baseline justify-center gap-0 mb-1">
        <span className="stat-value text-5xl md:text-6xl font-black">
          {count.toLocaleString()}
        </span>
        <span className="text-3xl md:text-4xl font-black text-primary-600 dark:text-primary-400">
          {stat.suffix}
        </span>
      </div>
      <div className="text-slate-500 dark:text-slate-400 font-medium">
        {stat.label}
      </div>
    </div>
  );
}

function StepCard({
  step,
  index,
}: {
  step: (typeof stepsData)[0];
  index: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`relative flex flex-col items-center text-center transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-400 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-primary-500/20">
          {step.icon}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent-400 text-slate-900 text-sm font-bold flex items-center justify-center shadow-lg">
          {step.num}
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">
        {step.title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
        {step.desc}
      </p>
    </div>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof featuresData)[0];
  index: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`glass-card-light group hover:-translate-y-1 cursor-default transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
      >
        {feature.icon}
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
        {feature.title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        {feature.desc}
      </p>
    </div>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonialsData)[0];
  index: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`glass-card-light transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="flex gap-1 mb-4">
        {Array.from({ length: testimonial.rating }, (_, j) => (
          <span key={j} className="text-amber-400 text-lg">
            ★
          </span>
        ))}
        {Array.from({ length: 5 - testimonial.rating }, (_, j) => (
          <span key={j} className="text-slate-300 dark:text-slate-600 text-lg">
            ★
          </span>
        ))}
      </div>
      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 italic">
        &ldquo;{testimonial.text}&rdquo;
      </p>
      <div className="flex items-center gap-3 mt-auto">
        <div
          className={`w-11 h-11 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white text-sm font-bold`}
        >
          {testimonial.avatar}
        </div>
        <div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {testimonial.name}
          </div>
          <div className="text-xs text-slate-400">{testimonial.role}</div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[40rem] h-[40rem] bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-pulse-slow" />
        <div
          className="absolute -bottom-40 -left-40 w-[40rem] h-[40rem] bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-accent-300 rounded-full mix-blend-multiply filter blur-3xl opacity-[0.15] dark:opacity-[0.08] animate-pulse-slow"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={
            {
              "--top": star.top,
              "--left": star.left,
              "--size": star.size,
              "--duration": star.duration,
              "--delay": star.delay,
            } as React.CSSProperties
          }
        />
      ))}

      {/* ===== HERO SECTION ===== */}
      <section className="container relative z-10 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left: Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 text-sm font-medium text-primary-300 dark:text-primary-300 animate-fade-in-down">
              <span className="w-2 h-2 rounded-full bg-primary-400 dark:bg-primary-500 animate-pulse" />
              Now connecting 12,000+ developers worldwide
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] mb-6">
              <span className="gradient-text">Hire Devs.</span>
              <br />
              <span className="text-slate-800 dark:text-slate-100">
                Build Fast.
              </span>
              <br />
              <span className="text-slate-800 dark:text-slate-100">
                Scale Up.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-xl mb-8 leading-relaxed mx-auto lg:mx-0">
              The modern freelance marketplace where top developers meet
              ambitious projects. Find your next opportunity or hire exceptional
              talent &mdash; all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="btn-primary btn-lg group text-base shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5"
              >
                <span>Get Started Free</span>
                <span className="inline-block ml-2 transition-all group-hover:translate-x-1.5 group-hover:scale-110">
                  &rarr;
                </span>
              </Link>
              <Link
                to="/jobs"
                className="btn-ghost btn-lg border-2 border-primary-400/40 dark:border-primary-500/30 text-primary-300 dark:text-primary-400 hover:bg-primary-400/20 dark:hover:bg-primary-500/10 hover:border-primary-600 dark:hover:border-primary-400 hover:scale-105 text-base"
              >
                Browse Jobs
              </Link>
            </div>

            {/* Trusted by */}
            <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
                Trusted Technology Stack
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                {logos.map((logo) => (
                  <span
                    key={logo}
                    className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg"
                  >
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Hero Visual */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none">
            <div className="relative">
              <div className="glass rounded-2xl p-6 shadow-2xl animate-float-slow">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-xs text-slate-400 font-mono">
                    dashboard.preview
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Active Projects
                    </span>
                    <span className="text-2xl font-black gradient-text">
                      24
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-primary-500 to-secondary-400 animate-gradient-shift" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {["$12.4k", "98%", "4.9\u2605"].map((val, i) => (
                      <div key={i} className="glass rounded-xl p-3 text-center">
                        <div className="text-sm font-bold gradient-text">
                          {val}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {["Earned", "Satisfaction", "Rating"][i]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating decorator cards */}
              <div
                className="absolute -top-4 -right-4 glass rounded-xl p-3 shadow-xl animate-float-slow hidden md:block"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">👨‍💻</span>
                  <div>
                    <div className="text-xs font-bold">+250 devs</div>
                    <div className="text-[10px] text-slate-400">
                      joined today
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="absolute -bottom-4 -left-4 glass rounded-xl p-3 shadow-xl animate-float-slow hidden md:block"
                style={{ animationDelay: "2s" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">💼</span>
                  <div>
                    <div className="text-xs font-bold">1,200+ jobs</div>
                    <div className="text-[10px] text-slate-400">open now</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="container relative z-10 pb-16 md:pb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { value: 12000, label: "Developers", icon: "👨‍💻", suffix: "+" },
            { value: 25000, label: "Job Listings", icon: "💼", suffix: "+" },
            { value: 50000, label: "Projects Done", icon: "🚀", suffix: "+" },
            { value: 98, label: "Satisfaction Rate", icon: "⭐", suffix: "%" },
          ].map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="container relative z-10 py-16 md:py-20">
        <SectionHeading
          title="How It Works"
          subtitle="Three simple steps to start your freelancing journey or find the perfect developer."
        />

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="hidden md:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-primary-400 via-secondary-300 to-accent-400" />

          {stepsData.map((step, i) => (
            <StepCard key={step.num} step={step} index={i} />
          ))}
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="container relative z-10 py-16 md:py-20">
        <SectionHeading
          title="Everything You Need"
          subtitle="Powerful tools and features designed to make freelancing seamless and rewarding."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresData.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="container relative z-10 py-16 md:py-20">
        <SectionHeading
          title="What Our Community Says"
          subtitle="Join thousands of developers and clients who trust DevHire for their projects."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialsData.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>
      </section>

      {/* ===== FINAL CTA SECTION ===== */}
      <section className="container relative z-10 py-16 md:py-24">
        <div className="gradient-border">
          <div className="glass-card-light rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary-400/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent-400/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-50 mb-4">
                Ready to Build Something{" "}
                <span className="gradient-text">Amazing</span>?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-8">
                Join the fastest-growing freelance marketplace for developers.
                Start your journey today &mdash; it&rsquo;s free to sign up.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="btn-primary btn-lg group text-base shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5"
                >
                  Get Started Free
                  <span className="inline-block ml-2 transition-all group-hover:translate-x-1.5 group-hover:scale-110">
                    &rarr;
                  </span>
                </Link>
                <Link
                  to="/devs"
                  className="btn-ghost btn-lg border-2 border-primary-400/40 dark:border-primary-500/30 text-primary-300 dark:text-primary-400 hover:bg-primary-400/20 dark:hover:bg-primary-500/10 text-base"
                >
                  Browse Developers
                </Link>
              </div>
              <p className="mt-6 text-xs text-slate-400 dark:text-slate-500">
                No credit card required. Free forever for developers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="container relative z-10 py-8 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <span className="font-bold gradient-text">DevHire</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link
              to="/jobs"
              className="hover:text-primary-500 transition-colors"
            >
              Browse Jobs
            </Link>
            <Link
              to="/devs"
              className="hover:text-primary-500 transition-colors"
            >
              Find Devs
            </Link>
            <Link
              to="/register"
              className="hover:text-primary-500 transition-colors"
            >
              Sign Up
            </Link>
          </div>
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} DevHire. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
