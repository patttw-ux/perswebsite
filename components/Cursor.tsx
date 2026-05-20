"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const OFF = -100;
const LERP = 0.15;
const CROSSHAIR_COLOR = "rgba(242, 239, 228, 0.85)";

/** Skip custom cursor only on true touch-primary devices (not hybrid laptops). */
function isTouchOnlyDevice() {
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

export default function Cursor() {
  const crosshairRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsActive(!isTouchOnlyDevice());
  }, []);

  useLayoutEffect(() => {
    if (!isMounted || !isActive) {
      return;
    }

    const crosshair = crosshairRef.current;
    if (!crosshair) {
      return;
    }

    let mouseX = OFF;
    let mouseY = OFF;
    let x = OFF;
    let y = OFF;
    let revealed = false;
    let rafId = 0;

    const applyPosition = () => {
      crosshair.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    crosshair.style.opacity = "0";
    applyPosition();

    const onMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (!revealed) {
        revealed = true;
        crosshair.style.opacity = "1";
      }
    };

    const onLeave = () => {
      mouseX = OFF;
      mouseY = OFF;
      crosshair.style.opacity = "0";
    };

    const tick = () => {
      x += (mouseX - x) * LERP;
      y += (mouseY - y) * LERP;
      applyPosition();
      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.cancelAnimationFrame(rafId);
    };
  }, [isMounted, isActive]);

  if (!isMounted || !isActive) {
    return null;
  }

  return createPortal(
    <div
      ref={crosshairRef}
      className="pointer-events-none fixed left-0 top-0 z-[99999] [will-change:transform]"
      aria-hidden
    >
      <div
        className="absolute left-1/2 top-1/2 h-[1.5px] w-5 -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: CROSSHAIR_COLOR }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-5 w-[1.5px] -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: CROSSHAIR_COLOR }}
      />
    </div>,
    document.body
  );
}
