"use client";

import { useEffect, useState, type CSSProperties } from "react";

const CURSOR_COLOR = "rgba(242, 239, 228, 0.85)";

const barBase: CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 9999,
  backgroundColor: CURSOR_COLOR,
  transform: "translate(-50%, -50%)",
};

export default function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    document.body.style.cursor = "none";
    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <>
      <div
        aria-hidden
        style={{
          ...barBase,
          left: pos.x,
          top: pos.y,
          width: 20,
          height: 1.5,
        }}
      />
      <div
        aria-hidden
        style={{
          ...barBase,
          left: pos.x,
          top: pos.y,
          width: 1.5,
          height: 20,
        }}
      />
    </>
  );
}
