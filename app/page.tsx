import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ProjectsBoard from "@/components/ProjectsBoard";
import SectionReveal from "@/components/SectionReveal";

const projects = [
  {
    index: "001",
    title: "ClearPA",
    tags: ["Healthcare AI", "Ophthalmology", "Claude API"],
    description:
      "AI prior authorization assistant for ophthalmology practices. Upload a patient chart, paste the payer questionnaire — Claude answers every question in 30 seconds in the exact language insurers approve. Won MAISI track at UM Claude Builder Club Hackathon 2026.",
    status: "live" as const,
    link: "https://github.com/patttw-ux/clearpa",
  },
  {
    index: "002",
    title: "Ventori",
    tags: ["AI Agent", "Inventory Management", "SMB Retail"],
    description:
      "AI operations agent for small retail stores — the COO they can't afford. Analyzes sales velocity, predicts demand, flags dead stock, and drafts purchase orders automatically on owner approval. Built for my family's lighting store.",
    status: "building" as const,
    link: "https://github.com/patttw-ux/ventori",
  },
  {
    index: "003",
    title: "Persist",
    tags: ["Consumer Healthcare", "SaaS", "Jac"],
    description:
      "Autonomous PA appeal agent built in Jac — an agentic programming language developed at University of Michigan. Parses denial letters, drafts appeals, scores approval viability, and monitors CMS deadlines. Built at JacHacks 2026.",
    status: "live" as const,
    link: "https://github.com/patttw-ux/persist",
    videoUrl: "https://www.youtube.com/embed/1jH-H-h2Y2c",
  },
];

export default function Home() {
  return (
    <main style={{ position: "relative" }}>
      <Hero />
      <div style={{ position: "relative", zIndex: 10, background: "#0a0b0f" }}>
        <SectionReveal
          index="/ 01"
          eyebrow="ABOUT"
          headline="Industrial focus with creative range."
          body="IOE at Michigan. I grew up in my family's lighting store learning that operations is everything — now I'm building software to fix the broken systems that hold small businesses and healthcare back. I think in sprints, ship fast, and care about things that actually work."
          accentWord="creative"
        />

        <section id="work" className="px-7 pb-24 pt-8 md:px-16">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            / 02 — WORK
          </p>
          <h2 className="font-display text-[72px] leading-none tracking-tight text-ink">
            Projects.
          </h2>
          <div className="mt-6 h-px w-full bg-ink/10" />

          <ProjectsBoard projects={projects} className="mt-10" />
        </section>

        <Footer />
      </div>
    </main>
  );
}
