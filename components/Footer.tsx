function LinkedInIcon() {
  return (
    <svg
      className="h-6 w-6 shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const LINKEDIN_URL = "https://linkedin.com/in/patrick--wang/";
const GITHUB_URL = "https://github.com/patttw-ux";

export default function Footer() {
  return (
    <footer id="contact" className="bg-bg text-ink">
      <div className="flex min-h-[60vh] flex-col justify-center gap-12 px-7 py-16 md:flex-row md:items-center md:justify-between md:px-16">
        <div className="max-w-xl">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            / 04 — CONTACT
          </p>
          <h2 className="font-display text-[clamp(64px,10vw,140px)] leading-[0.95] tracking-tight text-ink">
            Let&apos;s <em className="font-display italic">talk</em>.
          </h2>
          <p className="mt-6 max-w-md font-display text-[18px] italic leading-relaxed text-dim">
            Cold notes, collabs, interesting problems — all welcome.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:min-w-[280px]">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            className="magnetic group inline-flex w-full items-center justify-center gap-3 border border-ink px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-ink transition-colors hover:border-accent hover:bg-accent"
          >
            <LinkedInIcon />
            LinkedIn
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            className="font-mono text-[11px] uppercase tracking-wider text-ink transition-colors hover:text-accent"
          >
            GITHUB ↗
          </a>
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink">
            patwang@umich.edu
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-ink/10 py-6 px-7 sm:flex-row sm:items-center sm:justify-between md:px-16">
        <p className="font-mono text-[10px] text-dim">© 2026 Patrick Wang</p>
      </div>
    </footer>
  );
}
