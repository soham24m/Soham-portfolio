import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import heroPhoto from "@/assets/portfolio/hero-photo.png";
import thinkingPhoto from "@/assets/portfolio/thinking-photo.png";
import closingPhoto from "@/assets/portfolio/closing-photo-new.png";
import peaceHand from "@/assets/portfolio/peace-hand.png";
import bust from "@/assets/portfolio/bust.png";
import questionMark from "@/assets/portfolio/question.png";
import pointHand from "@/assets/portfolio/point-hand.png";

import journeyTitle from "@/assets/portfolio/journey-title.png";
import skillsBust from "@/assets/portfolio/skills-bust.png";

export const Route = createFileRoute("/")({
  component: Portfolio,
});

// ————————————————————— hooks & primitives —————————————————————

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setShown(true)),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

function Reveal({
  children,
  delay = 0,
  as: As = "div",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  as?: React.ElementType;
  className?: string;
}) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <As
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[900ms] ease-out ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
    >
      {children}
    </As>
  );
}

function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 label-mono">
      <span>{n}</span>
      <span className="h-px w-8 bg-rule" />
      <span>{children}</span>
    </div>
  );
}

function DashedArrow({ className = "", d }: { className?: string; d: string }) {
  return (
    <svg
      className={`draw-arrow pointer-events-none absolute ${className}`}
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="5 6"
    >
      <path d={d} />
    </svg>
  );
}

// ————————————————————— page —————————————————————

function Portfolio() {
  return (
    <main className="min-h-screen bg-background text-ink">
      <TopBar />
      <Hero />
      <SayHi />
      <WhyHire />
      <Projects />
      <Journey />
      <Highlights />
      <Skills />
      <Leadership />
      <Closing />
      <Footer />
    </main>
  );
}

function TopBar() {
  return (
    <header className="rule-b sticky top-0 z-30 bg-background/95 backdrop-blur-[2px]">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 sm:px-10">
        <a href="#top" className="label-mono text-ink">SSM · Portfolio · MMXXVI</a>
        <nav className="hidden gap-8 label-mono md:flex">
          <a href="#work" className="hover:text-primary">Work</a>
          <a href="#journey" className="hover:text-primary">Journey</a>
          <a href="#skills" className="hover:text-primary">Skills</a>
          <a href="#leadership" className="hover:text-primary">Leadership</a>
          <a href="#contact" className="hover:text-primary">Contact</a>
        </nav>
        <a href="mailto:sohamsiddhartham@icloud.com" className="label-mono text-primary hover:underline">
          Open to work →
        </a>
      </div>
    </header>
  );
}

// —————— Hero ——————
function Hero() {
  return (
    <section id="top" className="rule-b relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-14 sm:px-10 lg:pb-24 lg:pt-20">
        <SectionLabel n="00 / Intro">Ranchi → Chennai</SectionLabel>

        {/* Big centered heading at the very top */}
        <div className="mt-10 text-center">
          <div className="mb-2 flex flex-col items-center leading-none">
            <span className="font-script text-2xl text-primary sm:text-3xl lg:text-4xl">Hey there,</span>
            <span className="font-script text-2xl text-primary sm:text-3xl lg:text-4xl">I'm</span>
          </div>
          <h1
            className="display-serif w-full font-black uppercase tracking-[-0.04em] leading-[0.82] text-ink"
            style={{ fontSize: "clamp(3.5rem, 16vw, 14rem)" }}
          >
            SOHAM
          </h1>
        </div>

        <div className="relative mt-10 flex items-center justify-between gap-6">
          {/* Peace hand — huge, extreme left */}
          <div className="relative flex-shrink-0">
            <img
              src={peaceHand}
              alt=""
              aria-hidden
              className="float-slow block h-auto w-full max-w-[620px] object-contain"
            />
          </div>

          {/* Hero photo — extreme right, boxed with caption */}
          <div className="relative flex-shrink-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="rule-t rule-b border-x border-rule bg-muted/40 p-4">
                <img
                  src={heroPhoto}
                  alt="Soham Siddhartha Mishra"
                  className="mx-auto block h-auto w-full max-w-sm object-contain"
                />
                <div className="mt-3 flex items-center justify-between label-mono">
                  <span>Fig. 01</span>
                  <span>Peace &amp; Ship</span>
                </div>
              </div>

              <div className="absolute -right-4 -bottom-8 max-w-[240px] border border-ink bg-paper p-4 sm:-right-8">
                <div className="label-mono text-primary">Welcome to my tech side</div>
                <p className="mt-2 font-display text-xl leading-tight">
                  Building thoughtful software, one commit at a time.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-12">
            <div className="grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-[auto_1fr] sm:items-start">
              <div className="label-mono">Role</div>
              <p className="font-display text-2xl leading-tight sm:text-3xl">
                AI Engineer <span className="text-muted-foreground">&amp;</span> Full-Stack Developer.
              </p>
              <div className="label-mono">Status</div>
              <p className="text-lg">
                <span className="mr-2 inline-block h-2 w-2 translate-y-[-2px] rounded-full bg-primary" />
                Open to work — internships & founding-engineer roles.
              </p>
              <div className="label-mono">Base</div>
              <p className="text-lg"> Chennai , Tamil Nadu · India</p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#contact" className="border border-ink bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:bg-primary hover:border-primary">
                Say hi →
              </a>
              <a href="#work" className="border border-ink px-5 py-3 text-sm font-medium transition hover:bg-ink hover:text-paper">
                See the work
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="rule-t">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-10 gap-y-2 px-6 py-3 label-mono sm:px-10">
          <span>Java</span><span>C++</span><span>Python</span><span>React</span><span>Node</span>
          <span>TensorFlow</span><span>MongoDB</span><span>Docker</span>
          <span className="ml-auto text-primary">GPA 9.9 / 10</span>
        </div>
      </div>
    </section>
  );
}

// —————— Say Hi / Contact ——————
function SayHi() {
  const contacts = [
    { label: "Email", value: "sohamsiddhartham@icloud.com", href: "mailto:sohamsiddhartham@icloud.com" },
    { label: "Phone", value: "+91 82358 21666", href: "tel:+918235821666" },
    { label: "LinkedIn", value: "in/soham-siddhartha-mishra", href: "https://www.linkedin.com/in/soham-siddhartha-mishra-ba1aa822a/" },
    { label: "GitHub", value: "@soham24m", href: "https://github.com/soham24m" },
  ];
  return (
    <section id="contact" className="rule-b relative">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 py-20 sm:px-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionLabel n="01 / Contact">Say hi</SectionLabel>
          <Reveal>
            <h2 className="display-serif mt-6 text-6xl sm:text-7xl lg:text-8xl">
              Say hi, <br />
              <em className="font-script not-italic text-primary">let's build</em> <br />
              something.
            </h2>
          </Reveal>

          <div className="rule-t mt-12">
            {contacts.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="rule-b group flex items-center justify-between py-5 transition hover:bg-muted/50"
              >
                <span className="label-mono w-28">{c.label}</span>
                <span className="flex-1 font-display text-xl sm:text-2xl">{c.value}</span>
                <span className="label-mono text-primary opacity-60 transition group-hover:opacity-100">→</span>
              </a>
            ))}
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div className="relative mx-auto max-w-sm">
            <img src={bust} alt="" aria-hidden className="float-slow mx-auto block w-full" />
            <DashedArrow
              className="left-[-40px] top-[20%] hidden h-40 w-40 text-ink lg:block"
              d="M10 20 C 60 40, 90 80, 160 100"
            />
          </div>
          <p className="mt-6 max-w-xs font-script text-2xl text-muted-foreground">
            reflect · reach out · reply
          </p>
        </div>
      </div>
    </section>
  );
}

// —————— Why Hire ——————
function WhyHire() {
  const points = [
    {
      k: "01",
      h: "Production-ready AI applications.",
      b: "I build LLM-powered products end-to-end — RAG pipelines, tool-using agents, streaming chat UIs — wired to real APIs with prompt evals, guardrails, and cost/latency budgets that hold up outside a notebook.",
    },
    {
      k: "02",
      h: "End-to-end full-stack ownership.",
      b: "React and TypeScript on the front, Node and Python on the back, Postgres and Mongo underneath. Auth, REST endpoints, schema design, background jobs, deployment — I ship the whole slice, not just the happy path.",
    },
    {
      k: "03",
      h: "Clean code, scalable architecture.",
      b: "Typed contracts, small modules, tests where they earn their keep, and boundaries that let systems grow. I optimise for the engineer reading this in six months, not for a demo on Friday.",
    },
    {
      k: "04",
      h: "Polished user experiences.",
      b: "Interfaces that respect load states, empty states, and errors; motion and typography used with intent. AI features should feel considered — not like a chat box bolted onto a dashboard.",
    },
    {
      k: "05",
      h: "Concept → cloud, owned.",
      b: "Comfortable taking a rough idea through spec, prototype, Dockerised deploy on cloud infra, and iteration on real usage. I move fast on unfamiliar stacks and leave documentation behind me.",
    },
  ];
  return (
    <section className="rule-b relative">
      <div className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel n="02 / Pitch">The case</SectionLabel>
            <div className="relative mt-6">
              <h2 className="display-serif text-5xl sm:text-6xl lg:text-7xl">
                Why should <br /> you hire me?
              </h2>
              <img
                src={questionMark}
                alt=""
                aria-hidden
                className="float-slow absolute -right-4 -top-10 w-28 sm:w-36 lg:-right-8 lg:-top-16 lg:w-44"
              />
            </div>
            <div className="mt-10 border border-rule bg-muted/40 p-4">
              <img src={thinkingPhoto} alt="Soham thinking" className="mx-auto block w-full max-w-sm" />
              <div className="mt-3 flex justify-between label-mono">
                <span>Fig. 02</span><span>In thought</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rule-t">
              {points.map((p, i) => (
                <Reveal key={p.k} delay={i * 80}>
                  <div className="rule-b grid grid-cols-[auto_1fr] gap-6 py-8 sm:gap-10">
                    <span className="label-mono text-primary">{p.k}</span>
                    <div>
                      <h3 className="font-display text-2xl sm:text-3xl">{p.h}</h3>
                      <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">{p.b}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// —————— Projects ——————
function Projects() {
  const projects = [
    {
      title: "Splitr",
      year: "2025",
      tag: "Systems / C++",
      desc: "Command-line expense splitter. Tracks balances across n users and computes the minimum-transaction settlement using efficient data structures and OOP design.",
      stack: ["C++", "STL", "OOP"],
      links: [{ label: "GitHub", href: "#" }],
    },
    {
      title: "Dance of the Dragons",
      year: "2025",
      tag: "Web / R3F",
      desc: "Immersive fantasy-themed web experience: cinematic scroll transitions, interactive storytelling, and a component-based architecture optimised for premium feel.",
      stack: ["React", "TypeScript", "Tailwind", "Framer Motion", "Three.js"],
      links: [
        { label: "GitHub", href: "#" },
        { label: "Live", href: "#" },
      ],
    },
    { title: "In progress", year: "—", tag: "Reserved", desc: "// TODO: add project (title, description, tech stack, links).", stack: [], links: [] },
    { title: "In progress", year: "—", tag: "Reserved", desc: "// TODO: add project (title, description, tech stack, links).", stack: [], links: [] },
  ];

  return (
    <section id="work" className="rule-b">
      <div className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex-1">
            <SectionLabel n="03 / Work">Selected projects</SectionLabel>
            <div className="relative mt-4 flex items-end justify-between gap-6">
              <h2 className="display-serif text-5xl sm:text-6xl lg:text-7xl">
                Have a look at <br /> my projects.
              </h2>
             <img
  src={pointHand}
  alt=""
  aria-hidden
  className="hidden self-end sm:block"
  style={{
    height: "clamp(11rem, 22vw, 22rem)",
    width: "auto",
    transform: "scaleX(-1) rotate(12deg)",
  }}
/>
            </div>
          </div>
        </div>

        <div className="rule-t mt-12 grid grid-cols-1 md:grid-cols-2">
          {projects.map((p, i) => {
            const isPlaceholder = p.stack.length === 0;
            return (
              <Reveal key={i} delay={i * 80}>
                <article
                  className={`rule-b group relative flex h-full flex-col p-8 transition ${
                    i % 2 === 0 ? "md:border-r" : ""
                  } ${isPlaceholder ? "bg-muted/30" : "hover:bg-muted/40"}`}
                >
                  <div className="flex items-center justify-between label-mono">
                    <span>{p.tag}</span><span>{p.year}</span>
                  </div>
                  <h3 className="display-serif mt-6 text-4xl sm:text-5xl">{p.title}</h3>
                  <p className="mt-4 max-w-md text-muted-foreground">{p.desc}</p>
                  {p.stack.length > 0 && (
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {p.stack.map((s) => (
                        <li key={s} className="border border-rule px-2 py-1 label-mono">{s}</li>
                      ))}
                    </ul>
                  )}
                  {p.links.length > 0 && (
                    <div className="mt-8 flex gap-4">
                      {p.links.map((l) => (
                        <a key={l.label} href={l.href} className="label-mono text-primary hover:underline">
                          {l.label} →
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// —————— Journey ——————
function Journey() {
  const items = [
    { date: "Aug 2025 → present", h: "B.Tech Computer Science, SRM Institute of Science and Technology", b: "GPA 9.9 / 10. Core focus: DSA, systems, ML." },
    { date: "2025", h: "JEE Main — top 3% of ~1.54M candidates", b: "Placed among the top 3% nationally." },
    { date: "2022 → 2024", h: "Senior Secondary (PCM + IP), DPS Ranchi — 92%", b: "" },
    { date: "2010 → 2022", h: "Secondary, St. Thomas School, Ranchi — 98%", b: "Felicitated by the Chief Minister of Jharkhand for board results." },
    { date: "Ongoing", h: "// TODO: confirm — Stanford ML (Andrew Ng) & Meta Back-End Development", b: "Kept off the timeline until confirmed." },
  ];
  return (
    <section id="journey" className="rule-b relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10">
        <SectionLabel n="04 / Timeline">Chronology</SectionLabel>
        <img
          src={journeyTitle}
          alt="My journey so far"
          className="mt-8 block h-auto w-full max-w-3xl"
        />

        <ol className="rule-t mt-16 max-w-4xl">
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 60}>
              <li className="rule-b grid grid-cols-1 gap-2 py-7 sm:grid-cols-[220px_1fr] sm:gap-10">
                <span className="label-mono text-primary">{it.date}</span>
                <div>
                  <h3 className="font-display text-2xl">{it.h}</h3>
                  {it.b && <p className="mt-2 text-muted-foreground">{it.b}</p>}
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

// —————— Highlights strip ——————
function Highlights() {
  const stats = [
    { n: "9.9", l: "GPA · SRM CSE" },
    { n: "Top 3%", l: "JEE Main 2025" },
    { n: "4000+", l: "Students led as Head Boy" },
    { n: "2", l: "Leadership roles · SRMIST" },
  ];
  return (
    <section className="rule-b bg-ink text-paper">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-px bg-paper/20 px-0 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="bg-ink p-8">
            <div className="display-serif text-5xl sm:text-6xl">{s.n}</div>
            <div className="mt-3 label-mono text-paper/70">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// —————— Skills ——————
function Skills() {
  const groups = [
    { title: "Languages", items: ["C", "C++", "Java", "Python", "JavaScript", "SQL"] },
    { title: "Web / Full-Stack", items: ["HTML", "CSS", "React", "Node.js", "Express"] },
    { title: "Data / AI-ML", items: ["TensorFlow", "Pandas", "NumPy", "Machine Learning"] },
    { title: "Databases", items: ["MongoDB"] },
    { title: "Concepts", items: ["DSA", "OOP", "REST APIs", "DBMS", "Web Development"] },
    { title: "Tools", items: ["Git", "GitHub", "VS Code", "Antigravity", "Figma", "Docker", "Firebase", "Postman"] },
    { title: "Soft skills", items: ["Problem-solving", "Leadership", "Team collaboration", "Communication", "Public speaking"] },
  ];
  return (
    <section id="skills" className="rule-b">
      <div className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10">
        <SectionLabel n="05 / Toolkit">What I'm good at</SectionLabel>

        <div className="mt-6 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <h2 className="display-serif text-5xl sm:text-6xl lg:text-7xl">
              Stuff I am g
              <span className="relative mx-1 inline-block align-middle">
                <span className="inline-block h-[0.55em] w-[0.55em] rounded-full border-[6px] border-ink" />
              </span>
              <span className="relative mx-1 inline-block align-middle">
                <span className="inline-block h-[0.55em] w-[0.55em] rounded-full border-[6px] border-primary" />
              </span>
              d at.
            </h2>
          </div>
          <div className="lg:col-span-3">
            <img
              src={skillsBust}
              alt=""
              aria-hidden
              className="float-slow mx-auto block h-auto w-40 object-contain mix-blend-multiply sm:w-52 lg:w-full lg:max-w-[220px]"
            />
          </div>
        </div>

        <div className="rule-t mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((g, i) => (
            <Reveal key={g.title} delay={i * 60}>
              <div className={`rule-b group h-full p-6 transition hover:bg-muted/50 ${i % 3 !== 2 ? "lg:border-r" : ""} ${i % 2 === 0 ? "md:border-r lg:border-r" : ""}`}>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl">{g.title}</h3>
                  <span className="label-mono">0{i + 1}</span>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <li key={it} className="border border-rule px-2.5 py-1 font-mono text-xs transition group-hover:border-ink">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// —————— Leadership ——————
function Leadership() {
  const roles = [
    {
      k: "01",
      role: "Technical Lead",
      org: "GeeksForGeeks SRMIST",
      when: "Sep 2025 → present",
      b: "Lead advanced coding initiatives across the chapter — running competitive-programming sessions, mentoring peers on DSA, and publishing technical content that keeps a large student body engaged with real engineering practice.",
    },
    {
      k: "02",
      role: "Curations",
      org: "TEDx SRMIST",
      when: "Oct 2025 → present",
      b: "Research, evaluate, and shortlist speakers; refine talk concepts with the curation team so ideas land with clarity, not noise.",
    },
    {
      k: "03",
      role: "Head Boy",
      org: "St. Thomas School, Ranchi",
      when: "2021 → 2022",
      b: "Represented a 4,000-student community. Ran assemblies, coordinated inter-house events, and worked directly with faculty on student initiatives.",
    },
  ];
  const skills = ["Event management", "Community building", "Team collaboration", "Public speaking", "Mentorship"];
  return (
    <section id="leadership" className="rule-b">
      <div className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10">
        <SectionLabel n="06 / Leadership">Beyond the editor</SectionLabel>
        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="display-serif text-5xl sm:text-6xl lg:text-7xl">
              Leading <br />
              <em className="font-script not-italic text-primary">rooms,</em> not <br /> just repos.
            </h2>
            <p className="mt-8 max-w-md text-muted-foreground">
              Software gets built by people. These are the rooms I've been trusted with — and the skills I've sharpened running them.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {skills.map((s) => (
                <li key={s} className="border border-rule px-2.5 py-1 font-mono text-xs">{s}</li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="rule-t">
              {roles.map((r, i) => (
                <Reveal key={r.k} delay={i * 80}>
                  <div className="rule-b grid grid-cols-[auto_1fr] gap-6 py-8 sm:gap-10">
                    <span className="label-mono text-primary">{r.k}</span>
                    <div>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-display text-2xl sm:text-3xl">{r.role}</h3>
                        <span className="label-mono">{r.when}</span>
                      </div>
                      <p className="mt-1 label-mono text-primary">{r.org}</p>
                      <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">{r.b}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// —————— Closing ——————
function Closing() {
  return (
    <section className="rule-b relative overflow-hidden">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 py-24 sm:px-10 lg:grid-cols-12">
        <div className="relative lg:col-span-7">
          <SectionLabel n="07 / Sign-off">One line to remember</SectionLabel>
          <Reveal>
            <blockquote className="display-serif mt-8 text-6xl leading-[0.95] sm:text-7xl lg:text-[8rem]">
              "I'm too young <br />
              <em className="font-script not-italic text-primary">not to try.</em>"
            </blockquote>
          </Reveal>

          <div className="relative mt-16 inline-block">
            <svg viewBox="0 0 320 120" className="absolute -left-6 -top-4 h-full w-full text-muted -z-10" aria-hidden>
              <path d="M20,60 C 40,10 220,10 300,50 C 320,90 200,110 40,100 Z" fill="currentColor" />
            </svg>
            <p className="label-mono">Signed,</p>
            <p className="font-script text-5xl leading-tight text-ink sm:text-6xl">
              Soham Siddhartha Mishra
            </p>
          </div>

          <DashedArrow className="right-0 bottom-10 hidden h-40 w-40 text-ink lg:block" d="M20 20 C 80 60, 140 100, 180 160" />
        </div>

        <div className="lg:col-span-5">
          <div className="border border-rule bg-muted/40 p-4">
            <img src={closingPhoto} alt="Soham Siddhartha Mishra" className="mx-auto block w-full max-w-sm" />
            <div className="mt-3 flex justify-between label-mono">
              <span>Fig. 03</span><span>Ranchi, 2026</span>
            </div>
          </div>
          <a
            href="mailto:sohamsiddhartham@icloud.com"
            className="mt-8 flex items-center justify-between border border-ink px-6 py-5 transition hover:bg-ink hover:text-paper"
          >
            <span className="font-display text-xl">Start a conversation</span>
            <span className="label-mono">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-6 py-8 label-mono sm:px-10">
        <span>© 2026 Soham Siddhartha Mishra</span>
        <span>Built in Ranchi · Set in Fraunces &amp; Public Sans</span>
        <a href="#top" className="text-primary hover:underline">Back to top ↑</a>
      </div>
    </footer>
  );
}