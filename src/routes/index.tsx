import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Github, Linkedin, Mail, Phone } from "lucide-react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroPhoto from "@/assets/portfolio/hero-photo.png";
import thinkingPhoto from "@/assets/portfolio/thinking-photo.png";
import closingPhoto from "@/assets/portfolio/closing-portrait.png";
import peaceHand from "@/assets/portfolio/peace-hand.png";
import bust from "@/assets/portfolio/bust.png";
import questionMark from "@/assets/portfolio/question.png";
import pointHand from "@/assets/portfolio/point-hand.png";

import journeyTitle from "@/assets/portfolio/journey-title.png";
import journeyMilestones from "@/assets/portfolio/journey-milestones.png";
import skillsBust from "@/assets/portfolio/skills-bust.png";

export const Route = createFileRoute("/")({
  component: Portfolio,
});

// ————————————————————— hooks & primitives —————————————————————

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    // Content-level elements stay visible. Section-level motion below carries the
    // entrance, so a card can never remain hidden while someone is reading it.
    setShown(true);
  }, []);

  return { ref, shown };
}

function useGalleryMotion(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !root.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, syncTouch: false });
    const update = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(".section-motion");
      const gallery = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });

      sections.forEach((section, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        gallery.fromTo(
          section,
          { y: 20, rotateX: 0.35 * direction, rotateZ: 0.08 * direction, transformPerspective: 1400 },
          { y: -12, rotateX: -0.2 * direction, rotateZ: -0.05 * direction, ease: "none" },
          index,
        );
      });

      gsap.utils.toArray<HTMLElement>(".gallery-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { clipPath: "inset(0 0 2px 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            ease: "none",
            scrollTrigger: { trigger: element, start: "top 86%", end: "top 52%", scrub: 0.55 },
          },
        );
      });
    }, root);

    return () => {
      context.revert();
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, [root]);
}

function useCustomCursor(cursor: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || !cursor.current) return;

    const element = cursor.current;
    let frame = 0;
    let x = -100;
    let y = -100;
    const render = () => {
      frame = 0;
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(render);
      const target = event.target instanceof Element ? event.target : null;
      const project = target?.closest(".project-card")?.querySelector("h3")?.textContent;
      const interactive = target?.closest("a, button, .project-card");
      element.classList.toggle("is-active", Boolean(interactive));
      element.dataset.label = project || (interactive ? "Explore" : "");
    };
    const onDown = () => element.classList.add("is-pressed");
    const onUp = () => element.classList.remove("is-pressed");
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [cursor]);
}

function MotionSection({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`section-motion ${className}`}>
      {children}
    </section>
  );
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
      className={`reveal ${shown ? "is-visible" : ""} ${className}`}
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
  const root = useRef<HTMLElement | null>(null);
  const cursor = useRef<HTMLDivElement | null>(null);
  useGalleryMotion(root);
  useCustomCursor(cursor);
  return (
    <main ref={root} className="gallery-root min-h-screen bg-background text-ink">
      <div ref={cursor} className="gallery-cursor" aria-hidden />
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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="rule-b relative sticky top-0 z-30 bg-background/95 backdrop-blur-[2px]">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 sm:px-10">
        <a href="#top" className="label-mono text-ink whitespace-nowrap">
          SSM · Portfolio · MMXXVI
        </a>
        <nav className="hidden gap-8 label-mono md:flex">
          <a href="#work" className="nav-link hover:text-primary">
            Work
          </a>
          <a href="#journey" className="nav-link hover:text-primary">
            Journey
          </a>
          <a href="#skills" className="nav-link hover:text-primary">
            Skills
          </a>
          <a href="#leadership" className="nav-link hover:text-primary">
            Leadership
          </a>
          <a href="#contact" className="nav-link hover:text-primary">
            Contact
          </a>
        </nav>
        <button
          type="button"
          className="label-mono shrink-0 text-primary md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
        <a
          href="mailto:sohamsiddhartham@icloud.com"
          className="hidden label-mono text-primary hover:underline md:block"
        >
          Open to work →
        </a>
      </div>
      <div id="mobile-navigation" className={`mobile-menu ${menuOpen ? "is-open" : ""} md:hidden`}>
        <nav className="flex flex-col gap-4 border-t border-rule bg-background px-6 py-5 label-mono sm:px-10">
          {[
            ["Work", "#work"],
            ["Journey", "#journey"],
            ["Skills", "#skills"],
            ["Leadership", "#leadership"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a key={href} href={href} className="nav-link w-fit" onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <a href="mailto:sohamsiddhartham@icloud.com" className="nav-link w-fit text-primary">
            Open to work →
          </a>
        </nav>
      </div>
    </header>
  );
}

// —————— Hero ——————
function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);

  const setHeroPointer = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch" || !heroRef.current) return;
    const bounds = heroRef.current.getBoundingClientRect();
    const pointerX = event.clientX - bounds.left;
    const pointerY = event.clientY - bounds.top;
    heroRef.current.style.setProperty("--hero-pointer-x", `${pointerX}px`);
    heroRef.current.style.setProperty("--hero-pointer-y", `${pointerY}px`);
    heroRef.current.style.setProperty("--hero-hand-x", `${(pointerX / bounds.width - 0.5) * -12}px`);
    heroRef.current.style.setProperty("--hero-hand-y", `${(pointerY / bounds.height - 0.5) * -8}px`);
    heroRef.current.style.setProperty("--hero-portrait-x", `${(pointerX / bounds.width - 0.5) * 8}px`);
    heroRef.current.style.setProperty("--hero-portrait-y", `${(pointerY / bounds.height - 0.5) * 6}px`);
  };

  const resetHeroPointer = () => {
    heroRef.current?.style.removeProperty("--hero-pointer-x");
    heroRef.current?.style.removeProperty("--hero-pointer-y");
    heroRef.current?.style.removeProperty("--hero-hand-x");
    heroRef.current?.style.removeProperty("--hero-hand-y");
    heroRef.current?.style.removeProperty("--hero-portrait-x");
    heroRef.current?.style.removeProperty("--hero-portrait-y");
  };

  return (
    <section
      ref={heroRef}
      id="top"
      className="hero-section hero-depth rule-b relative overflow-hidden"
      onPointerMove={setHeroPointer}
      onPointerLeave={resetHeroPointer}
    >
      <span className="hero-orb hero-orb-one" aria-hidden />
      <span className="hero-orb hero-orb-two" aria-hidden />
      <div className="hero-shell mx-auto max-w-[1400px] px-6 sm:px-10">
        <div className="hero-intro hero-load">
          <SectionLabel n="00 / Intro">Ranchi → Chennai</SectionLabel>
          <div className="hero-greeting">
            <div className="hero-load hero-load-delay-1 leading-none">
              <p className="font-script text-3xl text-primary sm:text-4xl">Hi there, I&apos;m</p>
              <h1 className="hero-name display-serif mt-4 font-black uppercase tracking-[-0.04em] text-ink">
                SOHAM
              </h1>
            </div>
          </div>
        </div>

        <div className="hero-visuals hero-load hero-load-delay-2" aria-hidden>
          <div className="hero-hand">
            <img
              src={peaceHand}
              alt=""
              className="float-slow block h-auto w-full max-w-[620px] object-contain"
            />
          </div>

          <div className="hero-portrait">
            <div className="relative">
              <div className="rule-t rule-b border-x border-rule bg-muted/40 p-4">
                <img
                  src={heroPhoto}
                  alt="Soham Siddhartha Mishra"
                  className="hero-photo mx-auto block h-auto w-full max-w-sm object-contain"
                />
                <div className="mt-3 flex items-center justify-between label-mono">
                  <span>Fig. 01</span>
                  <span>Peace &amp; Ship</span>
                </div>
              </div>

              <div className="hero-welcome absolute border border-ink bg-paper p-4">
                <div className="label-mono text-primary">A little about me</div>
                <p className="mt-2 font-display text-xl leading-tight">
                  Thoughtful software, fewer rough edges.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-copy hero-load hero-load-delay-3">
          <div>
            <div className="hero-facts grid max-w-2xl grid-cols-[auto_1fr] gap-x-6 gap-y-4 sm:gap-x-10">
              <div className="label-mono">Role</div>
              <p className="font-display text-2xl leading-tight sm:text-3xl">
                AI Engineer <span className="text-muted-foreground">&amp;</span> Full-Stack
                Developer.
              </p>
              <div className="label-mono">Status</div>
              <p className="text-lg">
                <span className="mr-2 inline-block h-2 w-2 translate-y-[-2px] rounded-full bg-primary" />
                Open to work — internships & founding-engineer roles.
              </p>
              <div className="label-mono">Base</div>
              <p className="text-lg"> Chennai , Tamil Nadu · India</p>
            </div>

            <div className="hero-actions mt-8 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="button-lift magnetic-button border border-ink bg-ink px-5 py-3 text-sm font-medium text-paper hover:border-primary hover:bg-primary"
              >
                Say hi →
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Soham Siddhartha Mishra's resume in a new tab"
                className="button-lift magnetic-button border border-ink px-5 py-3 text-sm font-medium hover:bg-ink hover:text-paper"
              >
                Resume
              </a>
              <a
                href="#work"
                className="button-lift magnetic-button border border-ink px-5 py-3 text-sm font-medium hover:bg-ink hover:text-paper"
              >
                See the work
              </a>
            </div>
          </div>
        </div>

        <div className="hero-skills rule-t">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-10 gap-y-2 px-6 py-3 label-mono sm:px-10">
            <span>Java</span>
            <span>C++</span>
            <span>Python</span>
            <span>React</span>
            <span>Node</span>
            <span>TensorFlow</span>
            <span>MongoDB</span>
            <span>Docker</span>
            <span className="ml-auto text-primary">GPA 9.9 / 10</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// —————— Say Hi / Contact ——————
function SayHi() {
  const contacts = [
    {
      label: "Email",
      value: "sohamsiddhartham@icloud.com",
      href: "mailto:sohamsiddhartham@icloud.com",
      icon: Mail,
    },
    { label: "Phone", value: "+91 82358 21666", href: "tel:+918235821666", icon: Phone },
    {
      label: "LinkedIn",
      value: "in/soham-siddhartha-mishra",
      href: "https://www.linkedin.com/in/soham-siddhartha-mishra-ba1aa822a/",
      icon: Linkedin,
    },
    { label: "GitHub", value: "@soham24m", href: "https://github.com/soham24m", icon: Github },
  ];
  return (
    <MotionSection id="contact" className="rule-b relative">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 py-20 sm:px-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionLabel n="01 / Contact">Come say hi</SectionLabel>
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
                className="contact-link rule-b group flex items-center gap-3 py-5"
              >
                <c.icon aria-hidden size={20} strokeWidth={1.6} className="contact-icon shrink-0 text-ink" />
                <span className="label-mono w-28">{c.label}</span>
                <span className="min-w-0 flex-1 break-words font-display text-xl sm:text-2xl">
                  {c.value}
                </span>
                <span className="contact-arrow label-mono text-primary">
                  →
                </span>
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
            Yes, I do check my email. Drop a hi.
          </p>
        </div>
      </div>
    </MotionSection>
  );
}

// —————— Why Hire ——————
function WhyHire() {
  const points = [
    {
      k: "01",
      h: "Intelligent products, built for real use.",
      b: "I bring machine learning and AI-powered application ideas into useful products: integrating models with dependable backend systems, clear interfaces, and the practical constraints that make a project work beyond a demo.",
    },
    {
      k: "02",
      h: "Modern frontend, dependable backend.",
      b: "From React and TypeScript on the front to Node, Python, APIs, data stores, and deployment behind it, I build the complete product slice with an eye on the people and systems it needs to serve.",
    },
    {
      k: "03",
      h: "Scalable architecture with product thinking.",
      b: "I use typed contracts, focused modules, and thoughtful system boundaries to turn ambiguous problems into maintainable real-world projects — while keeping the next user and next engineer in view.",
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
    <MotionSection className="rule-b relative">
      <div className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel n="02 / Pitch">The case for me</SectionLabel>
            <div className="relative mt-6">
              <h2 className="display-serif text-5xl sm:text-6xl lg:text-7xl">
                Why me, <br /> though?
              </h2>
              <img
                src={questionMark}
                alt=""
                aria-hidden
                className="float-slow absolute -right-4 -top-10 w-28 sm:w-36 lg:-right-8 lg:-top-16 lg:w-44"
              />
            </div>
            <div className="mt-10 border border-rule bg-muted/40 p-4">
              <div className="overflow-hidden">
                <img
                  src={thinkingPhoto}
                  alt="Soham thinking"
                  className="image-zoom mx-auto block w-full max-w-sm"
                />
              </div>
              <div className="mt-3 flex justify-between label-mono">
                <span>Fig. 02</span>
                <span>In thought</span>
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
    </MotionSection>
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
    {
      title: "In progress",
      year: "—",
      tag: "Reserved",
      desc: "// TODO: add project (title, description, tech stack, links).",
      stack: [],
      links: [],
    },
    {
      title: "In progress",
      year: "—",
      tag: "Reserved",
      desc: "// TODO: add project (title, description, tech stack, links).",
      stack: [],
      links: [],
    },
  ];

  return (
    <MotionSection id="work" className="rule-b">
      <div className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex-1">
            <SectionLabel n="03 / Work">Selected projects</SectionLabel>
            <div className="relative mt-4 flex items-end justify-between gap-6">
              <h2 className="display-serif text-5xl sm:text-6xl lg:text-7xl">
                A few things <br /> I&apos;ve built.
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

        <div className="gallery-reveal rule-t mt-12 grid grid-cols-1 md:grid-cols-2">
          {projects.map((p, i) => {
            const isPlaceholder = p.stack.length === 0;
            return (
              <Reveal key={i} delay={i * 80}>
                <article
                  className={`rule-b project-card group relative flex h-full flex-col p-6 sm:p-8 ${
                    i % 2 === 0 ? "md:border-r" : ""
                  } ${isPlaceholder ? "bg-muted/30" : "hover:bg-muted/40"}`}
                >
                  <div className="flex items-center justify-between label-mono">
                    <span>{p.tag}</span>
                    <span>{p.year}</span>
                  </div>
                  <h3 className="display-serif mt-6 text-4xl sm:text-5xl">{p.title}</h3>
                  <p className="mt-4 max-w-md text-muted-foreground">{p.desc}</p>
                  {p.stack.length > 0 && (
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {p.stack.map((s) => (
                        <li key={s} className="project-stack border border-rule px-2 py-1 label-mono">
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                  {p.links.length > 0 && (
                    <div className="mt-8 flex gap-4">
                      {p.links.map((l) => (
                        <a
                          key={l.label}
                          href={l.href}
                          className="magnetic-link label-mono text-primary"
                        >
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
    </MotionSection>
  );
}

// —————— Journey ——————
function Journey() {
  const items = [
    {
      date: "2026",
      h: "Machine Learning Specialization, Coursera — completed",
      b: "Completed the Machine Learning Specialization, strengthening my foundation in practical ML concepts and model-driven problem solving.",
    },
    {
      date: "Aug 2025 → present",
      h: "B.Tech Computer Science, SRM Institute of Science and Technology",
      b: "GPA 9.9 / 10. Core focus: DSA, systems, ML.",
    },
    {
      date: "2025",
      h: "JEE Main — top 3% of ~1.54M candidates",
      b: "Placed among the top 3% nationally.",
    },
    { date: "2022 → 2024", h: "Senior Secondary (PCM + IP), DPS Ranchi — 92%", b: "" },
    {
      date: "2010 → 2022",
      h: "Secondary, St. Thomas School, Ranchi — 98%",
      b: "Felicitated by the Chief Minister of Jharkhand for board results.",
    },
    {
      date: "2022",
      h: "Head Boy, St. Thomas School",
      b: "Led a community of 4,000+ students with care and responsibility.",
    },
    {
      date: "2026",
      h: "TEDx SRMIST team member",
      b: "Contributing to an ideas-driven team and the next chapter of my journey.",
    },
  ];
  return (
    <MotionSection id="journey" className="rule-b relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10">
        <SectionLabel n="04 / Timeline">Chronology</SectionLabel>
        <div className="mt-8 grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.62fr)]">
          <img
            src={journeyTitle}
            alt="My journey so far"
            className="block h-auto w-full max-w-3xl"
          />
          <figure className="journey-photo-frame border border-rule bg-muted/40 p-3">
            <div className="overflow-hidden border border-rule bg-paper">
              <img
                src={journeyMilestones}
                alt="Soham's Head Boy and TEDx milestones"
                className="journey-milestones-image block h-auto w-full"
              />
            </div>
            <figcaption className="mt-3 flex items-center justify-between gap-3 label-mono">
              <span>Fig. 04</span>
              <span>Leadership → TEDx</span>
            </figcaption>
          </figure>
        </div>

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
    </MotionSection>
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
    <MotionSection className="rule-b bg-ink text-paper">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-px bg-paper/20 px-0 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="bg-ink p-8">
            <div className="display-serif text-5xl sm:text-6xl">{s.n}</div>
            <div className="mt-3 label-mono text-paper/70">{s.l}</div>
          </div>
        ))}
      </div>
    </MotionSection>
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
    {
      title: "Tools",
      items: ["Git", "GitHub", "VS Code", "Antigravity", "Figma", "Docker", "Firebase", "Postman"],
    },
    {
      title: "Soft skills",
      items: [
        "Problem-solving",
        "Leadership",
        "Team collaboration",
        "Communication",
        "Public speaking",
      ],
    },
  ];
  return (
    <MotionSection id="skills" className="rule-b">
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
              <div
                className={`rule-b card-lift group h-full p-6 hover:bg-muted/50 ${i % 3 !== 2 ? "lg:border-r" : ""} ${i % 2 === 0 ? "md:border-r lg:border-r" : ""}`}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl">{g.title}</h3>
                  <span className="label-mono">0{i + 1}</span>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <li
                      key={it}
                      className="border border-rule px-2.5 py-1 font-mono text-xs transition group-hover:border-ink"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </MotionSection>
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
  const skills = [
    "Event management",
    "Community building",
    "Team collaboration",
    "Public speaking",
    "Mentorship",
  ];
  return (
    <MotionSection id="leadership" className="rule-b">
      <div className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10">
        <SectionLabel n="06 / Leadership">Beyond the editor</SectionLabel>
        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="display-serif text-5xl sm:text-6xl lg:text-7xl">
              Leading <br />
              <em className="font-script not-italic text-primary">rooms,</em> not <br /> just repos.
            </h2>
            <p className="mt-8 max-w-md text-muted-foreground">
              Software gets built by people. These are the rooms I&apos;ve been trusted with — and
              the skills I&apos;ve picked up while running them.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {skills.map((s) => (
                <li key={s} className="border border-rule px-2.5 py-1 font-mono text-xs">
                  {s}
                </li>
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
    </MotionSection>
  );
}

// —————— Closing ——————
function Closing() {
  return (
    <MotionSection className="rule-b relative overflow-hidden">
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
            <svg
              viewBox="0 0 320 120"
              className="absolute -left-6 -top-4 h-full w-full text-muted -z-10"
              aria-hidden
            >
              <path
                d="M20,60 C 40,10 220,10 300,50 C 320,90 200,110 40,100 Z"
                fill="currentColor"
              />
            </svg>
            <p className="label-mono">Signed,</p>
            <p className="font-script text-5xl leading-tight text-ink sm:text-6xl">
              Soham Siddhartha Mishra
            </p>
          </div>

          <DashedArrow
            className="right-0 bottom-10 hidden h-40 w-40 text-ink lg:block"
            d="M20 20 C 80 60, 140 100, 180 160"
          />
        </div>

        <div className="lg:col-span-5">
          <div className="border border-rule bg-muted/40 p-4">
            <div className="aspect-[4/5] overflow-hidden border border-rule bg-paper">
              <img
                src={closingPhoto}
                alt="Soham Siddhartha Mishra"
                className="image-zoom block h-full w-full object-cover object-center"
              />
            </div>
            <div className="mt-3 flex justify-between label-mono">
              <span>Fig. 03</span>
              <span>Ranchi, 2026</span>
            </div>
          </div>
          <a
            href="mailto:sohamsiddhartham@icloud.com"
            className="button-lift mt-8 flex items-center justify-between border border-ink px-6 py-5 hover:bg-ink hover:text-paper"
          >
            <span className="font-display text-xl">Got an idea? Let&apos;s build it.</span>
            <span className="label-mono">→</span>
          </a>
        </div>
      </div>
    </MotionSection>
  );
}

function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-6 py-8 label-mono sm:px-10">
        <span>© 2026 Soham Siddhartha Mishra</span>
        <span>Built in Ranchi · Set in Fraunces &amp; Public Sans</span>
        <a href="#top" className="text-primary hover:underline">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
