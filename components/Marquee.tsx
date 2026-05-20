const SEGMENT =
  "IOE · ENTREPRENEURSHIP · MICHIGAN · BUILDING · AVAILABLE TO COLLABORATE · ";

export default function Marquee() {
  const content = SEGMENT.repeat(4);

  return (
    <div
      className="marquee-root flex h-11 items-center overflow-hidden border-y border-[rgba(242,239,228,0.08)] bg-bg"
      aria-hidden
    >
      <div className="marquee-track flex w-max animate-marquee-scroll will-change-transform">
        <div className="flex shrink-0 items-center whitespace-nowrap px-4 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
          {content}
        </div>
        <div className="flex shrink-0 items-center whitespace-nowrap px-4 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
          {content}
        </div>
      </div>
    </div>
  );
}
