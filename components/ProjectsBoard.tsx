"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ProjectCard, { type ProjectCardProps } from "@/components/ProjectCard";

type Project = Omit<ProjectCardProps, "variant" | "className" | "pinRef">;

type ProjectsBoardProps = {
  projects: Project[];
  className?: string;
};

type PathState = {
  d: string;
  length: number;
  labelX: number;
  labelY: number;
};

function quadMidpoint(
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number
) {
  return {
    x: 0.25 * x0 + 0.5 * cx + 0.25 * x2,
    y: 0.25 * y0 + 0.5 * cy + 0.25 * y2,
  };
}

export default function ProjectsBoard({ projects, className = "" }: ProjectsBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const clearPaPinRef = useRef<HTMLSpanElement>(null);
  const persistPinRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const [lineVisible, setLineVisible] = useState(false);
  const [pathReady, setPathReady] = useState(false);
  const [pathState, setPathState] = useState<PathState>({
    d: "",
    length: 0,
    labelX: 0,
    labelY: 0,
  });

  const byTitle = Object.fromEntries(projects.map((p) => [p.title, p]));
  const clearPA = byTitle["ClearPA"];
  const persist = byTitle["Persist"];
  const ventori = byTitle["Ventori"];

  const updatePath = useCallback(() => {
    const board = boardRef.current;
    const pinA = clearPaPinRef.current;
    const pinB = persistPinRef.current;
    const pathEl = pathRef.current;

    if (!board || !pinA || !pinB) return;

    const boardRect = board.getBoundingClientRect();
    const aRect = pinA.getBoundingClientRect();
    const bRect = pinB.getBoundingClientRect();

    const x1 = aRect.left + aRect.width / 2 - boardRect.left;
    const y1 = aRect.top + aRect.height / 2 - boardRect.top;
    const x2 = bRect.left + bRect.width / 2 - boardRect.left;
    const y2 = bRect.top + bRect.height / 2 - boardRect.top;

    const cx = (x1 + x2) / 2;
    const cy = Math.min(y1, y2) - 40;

    const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
    const mid = quadMidpoint(x1, y1, cx, cy, x2, y2);

    setPathState((prev) => ({
      ...prev,
      d,
      labelX: mid.x,
      labelY: mid.y,
    }));

    requestAnimationFrame(() => {
      const length = pathEl?.getTotalLength() ?? 0;
      setPathState((prev) => ({ ...prev, length }));
      setPathReady(length > 0);
    });
  }, []);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setLineVisible(true);
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );

    io.observe(board);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    updatePath();

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(updatePath);
    });

    ro.observe(board);
    window.addEventListener("resize", updatePath);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updatePath);
    };
  }, [updatePath]);

  const { length, d, labelX, labelY } = pathState;
  const dashOffset = lineVisible ? 0 : length;

  return (
    <div
      ref={boardRef}
      className={`relative rounded-sm border border-[rgba(242,239,228,0.08)] bg-[rgba(242,239,228,0.03)] p-6 shadow-[inset_0_2px_12px_rgba(0,0,0,0.35)] md:min-h-[520px] md:p-10 ${className}`}
    >
      <svg
        className={`pointer-events-none absolute inset-0 hidden h-full w-full md:block ${pathReady ? "visible" : "invisible"}`}
        aria-hidden
      >
        <path
          ref={pathRef}
          d={d}
          fill="none"
          stroke="#8B0000"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={dashOffset}
          style={{
            transition: "stroke-dashoffset 1.2s ease-in-out",
          }}
        />
        {d ? (
          <text
            x={labelX}
            y={labelY}
            fill="#8B0000"
            fontSize={9}
            fontFamily="JetBrains Mono, ui-monospace, monospace"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              opacity: lineVisible ? 1 : 0,
              transition: "opacity 0.4s ease-in-out 0.6s",
            }}
          >
            v2
          </text>
        ) : null}
      </svg>

      <div className="flex flex-col gap-6 md:relative md:min-h-[480px]">
        {clearPA ? (
          <ProjectCard
            {...clearPA}
            variant="pinned"
            pinRef={clearPaPinRef}
            className="md:absolute md:left-10 md:top-12"
          />
        ) : null}
        {persist ? (
          <ProjectCard
            {...persist}
            variant="pinned"
            pinRef={persistPinRef}
            className="md:absolute md:right-10 md:top-12"
          />
        ) : null}
        {ventori ? (
          <ProjectCard
            {...ventori}
            variant="solo"
            className="md:absolute md:bottom-10 md:left-1/2 md:-translate-x-1/2"
          />
        ) : null}
      </div>
    </div>
  );
}
