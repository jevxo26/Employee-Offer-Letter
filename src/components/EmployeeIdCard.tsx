"use client";

import React from "react";
import QRCode from "react-qr-code";
import { buildVerifyUrl } from "../lib/verifyUrl";
import { EmployeeCard } from "../types";
import Image from "next/image";
import logo from "../../assets/logo0bg.png";

// ─── Card dimensions — CR80 portrait ratio (54×85.6mm) at screen scale ───────
const CARD_W = 360;
const CARD_H = 570;

// ─── Brand palette ────────────────────────────────────────────────────────────
const C = {
  bg: "#000000",
  purple: "#7B3FF5",
  blue: "#2562FF",
  cyan: "#4B9EFF",
};

// ─── NFC tap icon ─────────────────────────────────────────────────────────────
function NfcIcon({
  color = "rgba(255,255,255,0.55)",
  size = 30,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0"
    >
      {/* card body */}
      <rect x="2" y="5" width="16" height="22" rx="2.5" strokeWidth="1.8" />
      {/* chip */}
      <rect
        x="4.5"
        y="8"
        width="7"
        height="5"
        rx="0.8"
        strokeWidth="1.2"
        fill={color}
      />
      {/* wave arcs */}
      <path d="M22 11 C24 14 24 18 22 21" strokeWidth="1.8" />
      <path d="M26 8.5 C29.5 12.5 29.5 19.5 26 23.5" strokeWidth="1.8" />
    </svg>
  );
}

// ─── Canvas-drawn gradient text — renders identically in browser AND html2canvas
// Uses Canvas 2D API which html2canvas captures natively, bypassing font/SVG issues.
// Stores a redraw callback on the canvas DOM element (via dataset) so that
// captureCard() can force a redraw after Orbitron is guaranteed to be loaded,
// ensuring the exported PDF always uses the correct brand font.
function GradientText({
  text,
  fromColor,
  toColor,
  fontSize = 22,
  fontWeight = 900,
}: {
  text: string;
  fromColor: string;
  toColor: string;
  fontSize?: number;
  fontWeight?: number;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const W = 280;
  const H = 40;

  const draw = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // DPR-aware for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, W, H);
    ctx.font = `${fontWeight} ${fontSize}px 'Orbitron', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, fromColor);
    grad.addColorStop(1, toColor);
    ctx.fillStyle = grad;
    ctx.fillText(text, W / 2, H / 2);
  }, [text, fromColor, toColor, fontSize, fontWeight]);

  React.useEffect(() => {
    draw();
    // Also redraw whenever document fonts finish loading (catches async font injection)
    document.fonts.ready.then(draw);
  }, [draw]);

  // Store the draw function on the canvas element so captureCard() can call it
  // after ensuring Orbitron is loaded — guarantees correct font in PDF exports
  const refCallback = React.useCallback(
    (el: HTMLCanvasElement | null) => {
      (canvasRef as React.MutableRefObject<HTMLCanvasElement | null>).current =
        el;
      if (el) {
        (
          el as HTMLCanvasElement & { __gradientRedraw?: () => void }
        ).__gradientRedraw = draw;
      }
    },
    [draw],
  );

  return (
    <canvas
      ref={refCallback}
      width={W}
      height={H}
      style={{ display: "block", width: W, height: H }}
    />
  );
}

// ─── FRONT SIDE ───────────────────────────────────────────────────────────────
interface FrontProps {
  data: EmployeeCard;
  cardRef: React.RefObject<HTMLDivElement | null>;
  idLabel?: string; // default "ID No" — override to "Internee ID" for interns
}

export function IdCardFront({ data, cardRef, idLabel = "ID No" }: FrontProps) {
  const verifyUrl = buildVerifyUrl(
    data.employeeId || "000-000-0001",
    "https://www.jevxo.com",
  );

  const nameChars = (data.fullName || "EMPLOYEE NAME")
    .toUpperCase()
    .split("")
    .reverse();

  return (
    <div
      ref={cardRef}
      className="relative w-[360px] h-[570px] rounded-[18px] overflow-hidden flex-shrink-0 shadow-2xl"
      style={{
        backgroundColor: C.bg,
        fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
      }}
    >
      {/* X-logo watermark
      <img
        src="/x-logo0bg.png"
        alt=""
        style={{
          position: "absolute",
          zIndex: 0,
          width: "350px",
          height: "auto",
          top: "390px",
          left: "390px",
          transform: "scale(1.85) translate(-50%, -50%)",
          opacity: 0.78,
          pointerEvents: "none",
          userSelect: "none",
          filter: "blur(0.8px)",
        }}
      /> */}

      {/* Candidate Photo */}
      {data.photoUrl ? (
        <img
          src={data.photoUrl}
          alt={data.fullName || "Employee"}
          className="absolute top-0 right-[-10px] w-[330px] h-[504px] object-cover object-top z-10"
        />
      ) : (
        <div
          className="absolute top-[55px] right-[-14px] w-[320px] h-[510px] z-10 flex items-center justify-center"
          style={{
            background:
              "linear-gradient(140deg, #13141f 0%, #1e2035 55%, #13141f 100%)",
            maskImage:
              "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.55) 75%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.55) 75%, transparent 100%)",
          }}
        >
          <span className="text-[11px] font-bold tracking-[0.18em] text-white/12 text-center leading-tight">
            NO PHOTO
            <br />
            PROVIDED
          </span>
        </div>
      )}

      {/* JEVXO Logo */}
      <div className="absolute top-2 right-2 z-10 bg-black backdrop-blur-sm px-2 py-1 rounded-xl">
        <Image
          src={logo}
          width={140}
          height={95}
          alt="JEVXO Logo"
          className="drop-shadow-md"
        />
      </div>

      {/* Vertical Name */}
      <div className="absolute top-10 bottom-[150px] w-[42px] flex items-center justify-center z-20 pointer-events-none">
        <div
          className="flex flex-col items-center font-black text-[33px] leading-[28px] text-white"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            textShadow:
              "0 3px 14px rgba(0,0,0,0.98), 0 1px 3px rgba(0,0,0,0.85)",
          }}
        >
          {nameChars.map((char, i) => (
            <span key={i} className="block -rotate-90">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Info Panel — FIXED GRADIENT (No visible line) */}
      {idLabel == "Internee ID" ? (
        <div
          className="absolute bottom-0 left-0 right-0 h-[125px] z-20 flex flex-col justify-end px-5 pb-[18px]"
          style={{
            background: `linear-gradient(to top, 
        #0A0B10 50%, 
        #0A0B10 70%, 
        rgba(10, 11, 16, 0.98) 80%, 
        rgba(10, 11, 16, 0.85) 96%, 
        rgba(10, 11, 16, 0.65) 150%)`,
          }}
        >
          <div className="absolute top-0 left-0 w-full">
            <div className="font-black text-[22px] text-center tracking-[0.01em] pb-1.5 flex justify-center">
              <GradientText
                text={data.position || "UI/UX Lead Designer"}
                fromColor={C.purple}
                toColor={C.cyan}
              />
            </div>

            <div className="text-white text-sm text-center font-medium tracking-widest opacity-95 mb-2">
              {idLabel}: {data.employeeId || "000-000-0001"}
            </div>

            <div className="flex justify-around">
              <div className="text-white text-sm font-sans font-semibold opacity-55">
                Issue Date: {data.issueDate || "2026"}
              </div>

              {data.expiryDate && (
                <div className="text-white text-sm font-sans font-semibold opacity-55">
                  Expiry: {data.expiryDate}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // <-- Fixed the missing ) here and wrapped the second block in ( ) for balance
        <div
          className="absolute bottom-0 left-0 right-0 h-[125px] z-20 flex flex-col justify-end px-5 pb-[18px]"
          style={{
            background: `linear-gradient(to top, 
        #0A0B10 50%, 
        #0A0B10 70%, 
        rgba(10, 11, 16, 0.98) 80%, 
        rgba(10, 11, 16, 0.85) 96%, 
        rgba(10, 11, 16, 0.65) 150%)`,
          }}
        >
          <div className="absolute top-0 left-0 w-full">
            <div className="font-black text-[22px] text-center tracking-[0.01em] pb-1.5 flex justify-center">
              <GradientText
                text={data.position || "UI/UX Lead Designer"}
                fromColor={C.purple}
                toColor={C.cyan}
              />
            </div>

            <div className="text-white text-sm pl-24 font-medium tracking-widest opacity-95 mb-2">
              {idLabel}: {data.employeeId || "000-000-0001"}
            </div>

            <div className="text-white text-sm pl-24 font-sans font-semibold opacity-80">
              Issue Date: {data.issueDate || "2026"}
            </div>

            {data.expiryDate && (
              <div className="text-white text-sm pl-24 font-sans font-semibold opacity-80">
                Expiry: {data.expiryDate}
              </div>
            )}
          </div>
        </div>
      )}

      {idLabel !== "Internee ID" && (
        <div className="flex justify-between items-end">
          <div className="bg-white p-1 rounded-md shadow-xl">
            <QRCode
              value={verifyUrl}
              size={58}
              fgColor="#000000"
              bgColor="#ffffff"
              level="M"
            />
          </div>
          <NfcIcon color="rgba(255,255,255,0.6)" size={32} />
        </div>
      )}
    </div>
  );
}

// ─── BACK SIDE ────────────────────────────────────────────────────────────────
interface BackProps {
  data: EmployeeCard;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export function IdCardBack({ data: _data, cardRef }: BackProps) {
  return (
    <div
      ref={cardRef}
      className="w-[360px] h-[570px] rounded-[18px] overflow-hidden flex-shrink-0 shadow-2xl relative"
    >
      <img
        src="/id-card-back.png"
        alt="ID Card Back"
        className="w-full h-full object-fill"
      />
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export interface EmployeeIdCardProps {
  data: EmployeeCard;
  frontRef: React.RefObject<HTMLDivElement | null>;
  backRef: React.RefObject<HTMLDivElement | null>;
  idLabel?: string;
}

export default function EmployeeIdCard({
  data,
  frontRef,
  backRef,
  idLabel,
}: EmployeeIdCardProps) {
  return (
    <div className="flex flex-col xl:flex-row gap-10 items-center justify-center w-full">
      <div className="flex flex-col items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
          Front Side
        </span>
        <IdCardFront data={data} cardRef={frontRef} idLabel={idLabel} />
      </div>

      <div className="flex flex-col items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
          Back Side
        </span>
        <IdCardBack data={data} cardRef={backRef} />
      </div>
    </div>
  );
}
