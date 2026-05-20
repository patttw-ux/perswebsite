import Nav from "@/components/Nav";
import SectionReveal from "@/components/SectionReveal";

export default function AboutPage() {
  return (
    <main
      className="relative min-h-screen w-full overflow-x-hidden overflow-y-auto"
      style={{ position: "relative" }}
    >
      <div className="pointer-events-none fixed right-[28px] top-[28px] z-20">
        <div className="pointer-events-auto">
          <Nav />
        </div>
      </div>
      <SectionReveal
        index="/ 03"
        eyebrow="ABOUT"
        headline="Industrial focus with creative range."
        body="IOE student at Michigan — I think in systems, build in sprints, and care about products that actually move the needle. I grew up watching my family run a small business and learned early that operations is everything. Now I'm applying that lens to startups."
        accentWord="creative"
      />
    </main>
  );
}
