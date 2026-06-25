"use client";

import React, { useEffect, useRef, useState } from "react";

/** A4 at 96 DPI — fixed canvas size for consistent layout across devices */
export const A4_WIDTH = 794;
export const A4_HEIGHT = 1123;
export const A4_PAGE_GAP = 32;

interface A4DocumentScalerProps {
  children: React.ReactNode;
  pageCount?: number;
  className?: string;
}

export default function A4DocumentScaler({
  children,
  pageCount = 2,
  className = "",
}: A4DocumentScalerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const naturalHeight =
    pageCount * A4_HEIGHT + Math.max(0, pageCount - 1) * A4_PAGE_GAP;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const available = el.clientWidth - 48;
      setScale(Math.min(1, Math.max(0.25, available / A4_WIDTH)));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={containerRef} className={`a4-scaler-container w-full ${className}`}>
      <div
        className="a4-scaler-spacer relative mx-auto"
        style={{ width: A4_WIDTH * scale, height: naturalHeight * scale }}
      >
        <div
          className="a4-scaler-inner absolute top-0 left-0"
          style={{
            width: A4_WIDTH,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
