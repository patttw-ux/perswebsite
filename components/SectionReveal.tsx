"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SectionRevealProps = {
  index: string;
  eyebrow: string;
  headline: string;
  body: string;
  align?: "left" | "right";
  accentWord?: string;
  /** Word clip reveal duration (default 0.4s). */
  wordDuration?: number;
  /** Delay between each word (default 0.05s). */
  wordStagger?: number;
};

type HeadlineToken = {
  key: string;
  text: string;
  isWhitespace: boolean;
  accent: boolean;
};

function parseHeadline(headline: string, accentWord?: string): HeadlineToken[] {
  const parts = headline.split(/(\s+)/);
  const aw = accentWord?.toLowerCase();

  return parts.map((text, i) => {
    const isWhitespace = /^\s+$/.test(text);
    let accent = false;
    if (!isWhitespace && aw) {
      const stripped = text.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, "");
      accent = stripped.toLowerCase() === aw;
    }
    return {
      key: `w-${i}`,
      text,
      isWhitespace,
      accent,
    };
  });
}

export default function SectionReveal({
  index,
  eyebrow,
  headline,
  body,
  align = "left",
  accentWord,
  wordDuration = 0.4,
  wordStagger = 0.05,
}: SectionRevealProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const metaRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLParagraphElement | null>(null);

  const tokens = parseHeadline(headline, accentWord);

  useEffect(() => {
    const section = sectionRef.current;
    const meta = metaRef.current;
    const bodyEl = bodyRef.current;
    if (!section || !meta || !bodyEl) {
      return;
    }

    const wordInners = Array.from(
      section.querySelectorAll<HTMLElement>("[data-section-reveal-word]")
    );

    if (wordInners.length === 0) {
      return;
    }

    gsap.set(meta, { opacity: 0, y: 8 });
    gsap.set(wordInners, { clipPath: "inset(0 0 100% 0)" });
    gsap.set(bodyEl, { opacity: 0, filter: "blur(4px)" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        once: true,
      },
    });

    tl.to(meta, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
    tl.to(
      wordInners,
      {
        clipPath: "inset(0 0 0% 0)",
        duration: wordDuration,
        stagger: wordStagger,
        ease: "power4.out",
      },
      "-=0.15"
    );
    tl.to(
      bodyEl,
      {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.4,
        ease: "power2.out",
      },
      "+=0.05"
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [headline, body, accentWord, wordDuration, wordStagger]);

  const justify = align === "right" ? "md:ml-auto" : "";

  return (
    <section
      ref={sectionRef}
      className="flex min-h-[60vh] items-center px-7 md:px-16"
    >
      <div className={`w-full max-w-[900px] ${justify}`}>
        <div ref={metaRef}>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            {index}
          </p>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-dim">
            {eyebrow}
          </p>
        </div>

        <h2 className="mb-8 font-display text-[clamp(42px,6vw,96px)] leading-[0.95] tracking-[-0.025em]">
          {tokens.map((token) => {
            if (token.isWhitespace) {
              return <span key={token.key}>{token.text}</span>;
            }

            return (
              <span
                key={token.key}
                className="inline-block max-w-none whitespace-nowrap align-baseline"
              >
                <span className="inline-block overflow-hidden align-baseline">
                  <span
                    data-section-reveal-word
                    className="inline-block will-change-[clip-path]"
                  >
                    {token.accent ? (
                      <em className="font-display italic text-accent">
                        {token.text}
                      </em>
                    ) : (
                      token.text
                    )}
                  </span>
                </span>
              </span>
            );
          })}
        </h2>

        <p
          ref={bodyRef}
          className="max-w-[600px] font-display text-[20px] italic leading-[1.6] text-dim"
        >
          {body}
        </p>
      </div>
    </section>
  );
}
