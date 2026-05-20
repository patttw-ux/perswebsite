"use client";

import Link from "next/link";
import { useState, type ReactNode, type Ref } from "react";

export type ProjectCardProps = {
  index: string;
  title: string;
  tags: string[];
  description?: string;
  status: "live" | "wip" | "building" | "soon";
  link?: string | null;
  videoUrl?: string;
  variant?: "pinned" | "solo";
  className?: string;
  pinRef?: Ref<HTMLSpanElement>;
};

function StatusBadge({ status }: { status: ProjectCardProps["status"] }) {
  if (status === "live") {
    return (
      <span className="font-mono text-[9px] uppercase tracking-wider text-accent">
        LIVE
      </span>
    );
  }
  if (status === "wip" || status === "building") {
    return (
      <span className="font-mono text-[9px] uppercase tracking-wider text-accent">
        {status === "building" ? "BUILDING" : "WIP"}
      </span>
    );
  }
  return (
    <span className="font-mono text-[9px] uppercase tracking-wider text-dim">
      SOON
    </span>
  );
}

const cardClassName =
  "group relative block max-w-[min(100%,320px)] border border-[rgba(242,239,228,0.22)] bg-[rgba(242,239,228,0.025)] px-8 py-7 shadow-[0_6px_16px_rgba(0,0,0,0.45)] transition-[border-color,background-color] duration-300 hover:border-[rgba(242,239,228,0.45)] hover:bg-[rgba(242,239,228,0.05)]";

const watchDemoClassName =
  "border border-dim/20 px-2 py-1 font-mono text-[9px] uppercase text-dim transition-colors hover:border-accent/40 hover:text-ink";

export default function ProjectCard({
  index,
  title,
  tags,
  description,
  status,
  link,
  videoUrl,
  variant = "pinned",
  className = "",
  pinRef,
}: ProjectCardProps) {
  const [videoOpen, setVideoOpen] = useState(false);

  const inner: ReactNode = (
    <>
      {variant === "pinned" ? (
        <span
          ref={pinRef}
          className="absolute -top-1.5 left-1/2 z-10 h-2 w-2 -translate-x-1/2 rounded-full bg-ink/70 shadow-[0_1px_3px_rgba(0,0,0,0.5)] ring-1 ring-ink/20"
          aria-hidden
        />
      ) : (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-wider text-accent">
          IN PROGRESS
        </span>
      )}
      <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent">
        {index}
      </p>
      <h3 className="mb-2 font-display text-[28px] leading-tight text-ink">{title}</h3>
      {description ? (
        <p className="mb-4 font-display text-[14px] leading-relaxed text-dim">
          {description}
        </p>
      ) : null}
      <div className="mb-4 flex flex-row flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="border border-dim/20 px-2 py-1 font-mono text-[9px] uppercase text-dim"
          >
            {tag}
          </span>
        ))}
      </div>
      <StatusBadge status={status} />
      {videoUrl ? (
        <button
          type="button"
          className={`mt-4 ${watchDemoClassName}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setVideoOpen(true);
          }}
        >
          ▶ Watch Demo
        </button>
      ) : null}
    </>
  );

  const videoModal =
    videoOpen && videoUrl ? (
      <div
        className="fixed inset-0 z-[100000] flex items-center justify-center p-6"
        style={{
          backdropFilter: "blur(12px)",
          background: "rgba(10,11,15,0.85)",
        }}
        onClick={() => setVideoOpen(false)}
        role="dialog"
        aria-modal
        aria-label={`${title} demo video`}
      >
        <div
          className="relative w-full overflow-hidden bg-black"
          style={{
            maxWidth: "min(92vw, 1100px)",
            aspectRatio: "16 / 9",
            height: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="absolute right-2 top-2 z-10 font-mono text-[12px] text-ink/80 transition-colors hover:text-ink"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setVideoOpen(false);
            }}
            aria-label="Close video"
          >
            ✕
          </button>
          <iframe
            className="h-full w-full"
            src={`${videoUrl}?autoplay=1&controls=1&modestbranding=1`}
            title={`${title} demo`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    ) : null;

  const combinedClassName = `${cardClassName} ${className}`.trim();

  if (link) {
    return (
      <>
        <Link href={link} className={combinedClassName} data-cursor="view">
          {inner}
        </Link>
        {videoModal}
      </>
    );
  }

  return (
    <>
      <article className={combinedClassName} data-cursor="view">
        {inner}
      </article>
      {videoModal}
    </>
  );
}
