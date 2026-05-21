"use client";

import {
  useLayoutEffect,
  useRef,
  useEffect,
  useCallback,
  useState,
  type CSSProperties,
} from "react";
import gsap from "gsap";
import Marquee from "@/components/Marquee";

const SITE_BG = "#0a0b0f";
const DOT_COLOR = "242, 239, 228";
const CELL = 28;
const BASE_OPACITY = 0.12;
const BASE_RADIUS = 1.2;
const INFLUENCE_RADIUS = 120;
const PULL_ALPHA = 0.5;
const PULL_SCALE = 2.2;
const LERP = 0.14;
const BRIGHT_THRESHOLD = BASE_OPACITY * 1.35;
const PULSE_CYCLE_MS = 3500;
const PULSE_AMPLITUDE = 0.08;

type Dot = {
  x: number;
  y: number;
  opacity: number;
  radius: number;
  phase: number;
};

function DotGridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    canvas.width = vw * dpr;
    canvas.height = vh * dpr;
    canvas.style.width = `${vw}px`;
    canvas.style.height = `${vh}px`;

    const dots: Dot[] = [];
    for (let y = CELL / 2; y < vh; y += CELL) {
      for (let x = CELL / 2; x < vw; x += CELL) {
        dots.push({
          x,
          y,
          opacity: BASE_OPACITY,
          radius: BASE_RADIUS,
          phase: (x + y) * 0.01,
        });
      }
    }
    dotsRef.current = dots;
  }, []);

  useEffect(() => {
    initCanvas();

    const onResize = () => {
      initCanvas();
    };

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      window.scrollBy({ top: e.deltaY, left: e.deltaX, behavior: "auto" });
    };

    const canvas = canvasRef.current;
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);
    canvas?.addEventListener("wheel", onWheel, { passive: false });

    const ctx2d = canvas?.getContext("2d");

    const draw = () => {
      if (!ctx2d || !canvas) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const now = performance.now();
      const vw = canvas.style.width ? parseFloat(canvas.style.width) : window.innerWidth;
      const vh = canvas.style.height ? parseFloat(canvas.style.height) : window.innerHeight;
      const dpr = canvas.width / vw;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const dots = dotsRef.current;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const dist = Math.hypot(dot.x - mx, dot.y - my);
        let targetOpacity = BASE_OPACITY;
        let targetRadius = BASE_RADIUS;

        if (dist < INFLUENCE_RADIUS) {
          const pull = 1 - dist / INFLUENCE_RADIUS;
          targetOpacity = BASE_OPACITY + pull * PULL_ALPHA;
          targetRadius = BASE_RADIUS + pull * PULL_SCALE;
        }

        dot.opacity += (targetOpacity - dot.opacity) * LERP;
        dot.radius += (targetRadius - dot.radius) * LERP;
      }

      ctx2d.setTransform(1, 0, 0, 1, 0, 0);
      ctx2d.scale(dpr, dpr);
      ctx2d.fillStyle = SITE_BG;
      ctx2d.fillRect(0, 0, vw, vh);

      const pulsePhase = (now / PULSE_CYCLE_MS) * Math.PI * 2;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        let drawOpacity = dot.opacity;
        if (dot.opacity > BRIGHT_THRESHOLD) {
          drawOpacity *= 1 + PULSE_AMPLITUDE * Math.sin(pulsePhase + dot.phase);
        }
        ctx2d.beginPath();
        ctx2d.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx2d.fillStyle = `rgba(${DOT_COLOR}, ${drawOpacity})`;
        ctx2d.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      canvas?.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(rafRef.current);
    };
  }, [initCanvas]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-auto fixed inset-0 z-0"
      style={{ width: "100vw", height: "100vh", backgroundColor: SITE_BG }}
      aria-hidden
    />
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const bottomTextRef = useRef<HTMLDivElement | null>(null);
  const [heroInView, setHeroInView] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [clockTime, setClockTime] = useState("00:00:00");

  useEffect(() => {
    const formatTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      return `${h}:${m}:${s}`;
    };

    setClockTime(formatTime());
    const id = setInterval(() => setClockTime(formatTime()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.15);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroInView(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  /** Run as soon as the overlay mounts — do not wait for Spline (hero text uses overflow clips + from-opacity-0). */
  useLayoutEffect(() => {
    if (!overlayRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const textBlocks = [
        ...Array.from(overlayRef.current?.querySelectorAll(":scope > .hero-text-block") ?? []),
        ...(bottomTextRef.current ? [bottomTextRef.current] : []),
      ];
      const wordSpans = bottomTextRef.current?.querySelectorAll(".hero-word-inner");

      if (textBlocks.length) {
        gsap.fromTo(
          textBlocks,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out", delay: 1.2 }
        );
      }

      if (wordSpans?.length) {
        gsap.fromTo(
          wordSpans,
          { y: "110%" },
          { y: "0%", stagger: 0.1, duration: 0.8, ease: "power4.out", delay: 1.0 }
        );
      }
    });

    return () => {
      ctx.revert();
    };
  }, []);

  const heroVisibilityStyle: CSSProperties = {
    visibility: heroInView ? "visible" : "hidden",
    opacity: heroInView ? 1 : 0,
  };

  const cornerFadeStyle: CSSProperties = {
    opacity: scrolled ? 0 : 1,
    transition: "opacity 0.3s ease",
  };

  return (
    <section
      ref={sectionRef}
      className="pointer-events-none flex h-[100svh] flex-col overflow-visible"
      style={{ position: "relative" }}
    >
      <DotGridCanvas />

      <p
        className="pointer-events-none fixed right-[28px] top-[28px] z-20 font-mono text-[11px] uppercase tracking-[0.2em] text-dim"
        style={cornerFadeStyle}
        aria-hidden
      >
        {clockTime}
      </p>

      <div
        className="pointer-events-none fixed left-[62vw] z-[6] m-0 h-[75vh] p-0"
        style={{ ...heroVisibilityStyle, top: "12vh" }}
      >
        <div className="relative m-0 h-full w-full overflow-hidden p-0">
          <img
            src="/Prof_headshot_2025_-_Serious.jpg"
            alt=""
            className="block h-full w-auto max-w-none object-cover"
            style={{
              filter: "contrast(1.1)",
              objectPosition: "top center",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[200px]"
            style={{ background: "linear-gradient(to bottom, #0a0b0f, transparent)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-[200px]"
            style={{ background: "linear-gradient(to right, #0a0b0f, transparent)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-[120px]"
            style={{ background: "linear-gradient(to left, #0a0b0f, transparent)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2] h-[120px]"
            style={{ background: "linear-gradient(to top, #0a0b0f, transparent)" }}
          />
        </div>
      </div>

      <div className="min-h-0 flex-1" aria-hidden />

      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-20"
        style={heroVisibilityStyle}
      >
        <div
          className="hero-text-block pointer-events-none fixed left-[28px] top-[28px] flex flex-col gap-[10px]"
          style={cornerFadeStyle}
        >
          <div className="flex items-start gap-3">
            <span className="mt-[3px] h-2 w-2 shrink-0 animate-[blink_1.6s_steps(2)_infinite] bg-[#2155B8]" />
            <div className="flex flex-col gap-[4px]">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em]">
                PATRICK WANG
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
                NEW YORK ✈ ANN ARBOR, University of Michigan
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="pulse-available h-[6px] w-[6px] shrink-0 rounded-full bg-[#2155B8]" />
            <p className="font-mono text-[9px] tracking-widest text-accent">
              building, learning, exploring
            </p>
          </div>
        </div>
      </div>

      <div
        ref={bottomTextRef}
        className="hero-text-block pointer-events-none fixed bottom-[120px] left-5 z-[5] max-w-[520px] md:left-[28px]"
        style={heroVisibilityStyle}
      >
        <h1 className="font-display pb-4 text-[clamp(32px,9vw,56px)] leading-[0.92] tracking-[-0.03em] md:text-[clamp(44px,7vw,108px)]">
          <span className="mr-[0.25em] inline-block overflow-hidden align-top">
            <span className="hero-word-inner inline-block">Industrial</span>
          </span>
          <span className="inline-block overflow-hidden align-top">
            <span className="hero-word-inner inline-block">&amp;</span>
          </span>
          <br />
          <span className="inline-block overflow-hidden align-top">
            <em className="hero-word-inner inline-block italic text-[#2155B8]">Operations</em>
          </span>
          <br />
          <span className="inline-block overflow-hidden align-top">
            <span className="hero-word-inner inline-block">Engineer.</span>
          </span>
        </h1>
        <div className="mt-8 h-px w-[180px] bg-[rgba(242,239,228,0.2)]" />
      </div>

      <div className="relative z-[25] mt-auto w-full shrink-0 overflow-visible bg-bg">
        <Marquee />
      </div>
    </section>
  );
}
