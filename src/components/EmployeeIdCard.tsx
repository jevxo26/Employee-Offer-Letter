"use client";

import React from "react";
import QRCode from "react-qr-code";
import { EmployeeCard } from "../types";

// ─── Brand Colors ────────────────────────────────────────────────────────────
const C = {
  bg: "#0A0B10",         // Sleek dark gray/black background (matching the absolute image)
  purple: "#7B3FF5",     // Gradient start (Indigo-Purple)
  blue: "#2562FF",       // Gradient end (Royal Blue)
  cyan: "#4B9EFF",       // Light Blue / Cyan accent color
};

// ─── JEVXO X-Mark Brand Logo SVG ──────────────────────────────────────────────
// Uses the official curves of JEVXO Logo
function JevxoXMark({
  size = 40,
  color = "#ffffff",
  opacity = 1,
  gradientId,
  useGradient = false,
}: {
  size?: number;
  color?: string;
  opacity?: number;
  gradientId?: string;
  useGradient?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      style={{ opacity, display: "block" }}
    >
      {useGradient && gradientId && (
        <defs>
          <linearGradient id={gradientId} x1="12" y1="12" x2="48" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2562FF" />
            <stop offset="100%" stopColor="#7B3FF5" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M 12 12 Q 27 15 37 30 T 42 50 Q 27 50 17 35 T 12 12 Z"
        fill={useGradient && gradientId ? `url(#${gradientId})` : color}
      />
      <path
        d="M 48 12 Q 33 15 23 30 T 18 50 Q 33 50 43 35 T 48 12 Z"
        fill={useGradient && gradientId ? `url(#${gradientId})` : color}
        opacity="0.85"
      />
    </svg>
  );
}

// ─── NFC / Tap Icon ──────────────────────────────────────────────────────────
function NfcIcon({ color = "rgba(255,255,255,0.55)", size = 26 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" stroke={color} strokeLinecap="round">
      {/* Card shape */}
      <rect x="1" y="4" width="14" height="18" rx="2" strokeWidth="1.5" />
      <rect x="3" y="6" width="6" height="4" rx="0.5" strokeWidth="1" fill={color} />
      {/* Wave arcs */}
      <path d="M18 9 C19.5 11 19.5 15 18 17" strokeWidth="1.5" />
      <path d="M21 7 C23.5 10 23.5 16 21 19" strokeWidth="1.5" />
    </svg>
  );
}

// ─── Deterministic Barcode ────────────────────────────────────────────────────
function SvgBarcode({
  value,
  width = 190,
  height = 32,
  color = "rgba(255,255,255,0.85)",
}: {
  value: string;
  width?: number;
  height?: number;
  color?: string;
}) {
  const seed = value
    .split("")
    .reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 1) * 31, 1);

  const units: number[] = [2, 1]; // start
  for (let i = 0; i < Math.max(value.length, 12); i++) {
    const v = (value.charCodeAt(i % value.length) ?? 65) * (i + 1) * 7 + seed;
    units.push(
      v % 100 < 35 ? 1 : v % 100 < 70 ? 2 : v % 100 < 90 ? 3 : 4,
      v % 100 < 50 ? 1 : 2
    );
  }
  units.push(2, 1, 2); // end

  const total = units.reduce((a, b) => a + b, 0);
  const uw = width / total;

  const rects: Array<{ x: number; w: number }> = [];
  let x = 0;
  units.forEach((u, i) => {
    if (i % 2 === 0) rects.push({ x: x * uw, w: Math.max(u * uw, 0.8) });
    x += u;
  });

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={0} width={r.w} height={height} fill={color} />
      ))}
    </svg>
  );
}

// ─── Circuit Corner Decoration ───────────────────────────────────────────────
function CircuitCorner({ pos, size = 34 }: { pos: "tl" | "tr" | "bl" | "br"; size?: number }) {
  const rot = { tl: 0, tr: 90, br: 180, bl: 270 }[pos];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      style={{ transform: `rotate(${rot}deg)`, transformOrigin: "center", display: "block" }}
    >
      <path d="M2 38 L2 14 Q2 2 14 2 L38 2" stroke={C.cyan} strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />
      <circle cx="2" cy="38" r="2.5" fill={C.cyan} opacity="0.85" />
      <path d="M8 36 L8 22" stroke={C.cyan} strokeWidth="0.9" opacity="0.45" />
      <path d="M36 8 L22 8" stroke={C.cyan} strokeWidth="0.9" opacity="0.45" />
      <rect x="16" y="4" width="6" height="6" rx="1" stroke={C.cyan} strokeWidth="0.9" opacity="0.65" />
      <circle cx="24" cy="2" r="1" fill={C.cyan} opacity="0.5" />
      <circle cx="2" cy="26" r="1" fill={C.cyan} opacity="0.5" />
    </svg>
  );
}

// ─── FRONT SIDE component ─────────────────────────────────────────────────────
interface FrontProps {
  data: EmployeeCard;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export function IdCardFront({ data, cardRef }: FrontProps) {
  const qrValue = `JEVXO-EMP-${data.employeeId || "000-000-0001"}`;
  const barValue = data.employeeId || "000-000-0001";
  
  // Format vertical name letters (upright & stacked)
  const nameChars = (data.fullName || "AHSANUL HAQUE").toUpperCase().split("");

  return (
    <div
      ref={cardRef}
      style={{
        width: "375px",
        height: "620px",
        background: C.bg,
        borderRadius: "16px",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        boxShadow: "0 32px 64px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.06)",
        fontFamily: "'Orbitron', sans-serif",
      }}
    >
      {/* ── Large X logo BEHIND the candidate photo ── */}
      <div style={{
        position: "absolute",
        top: "70px",
        right: "-20px",
        width: "350px",
        height: "350px",
        zIndex: 1,
        pointerEvents: "none",
      }}>
        <JevxoXMark size={350} useGradient gradientId="frontBgX" opacity={0.35} />
      </div>

      {/* ── Candidate photo ON TOP of X logo ── */}
      {data.photoUrl ? (
        <img
          src={data.photoUrl}
          alt="Employee photo"
          style={{
            position: "absolute",
            top: "20px",
            right: "-10px",
            width: "310px",
            height: "480px",
            objectFit: "cover",
            objectPosition: "center top",
            zIndex: 2,
            maskImage: "linear-gradient(to bottom, black 50%, rgba(0,0,0,0.4) 80%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 50%, rgba(0,0,0,0.4) 80%, transparent 100%)",
          }}
        />
      ) : (
        /* Placeholder */
        <div style={{
          position: "absolute",
          top: "20px",
          right: "-10px",
          width: "310px",
          height: "480px",
          zIndex: 2,
          background: "linear-gradient(135deg, #12131C 0%, #1E1F30 55%, #12131C 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maskImage: "linear-gradient(to bottom, black 50%, rgba(0,0,0,0.4) 80%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 50%, rgba(0,0,0,0.4) 80%, transparent 100%)",
        }}>
          <div style={{
            color: "rgba(255,255,255,0.15)",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textAlign: "center",
          }}>
            NO PHOTO<br />PROVIDED
          </div>
        </div>
      )}

      {/* ── Top-right JEVXO Brand Logo ── */}
      <div style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        zIndex: 10,
      }}>
        <JevxoXMark size={22} useGradient gradientId="frontTopLogo" />
        <span style={{
          color: "#ffffff",
          fontWeight: 900,
          fontSize: "17px",
          letterSpacing: "0.08em",
          fontFamily: "'Orbitron', sans-serif",
          lineHeight: 1,
        }}>
          JEVXO
        </span>
      </div>

      {/* ── Left vertical full name (Upright stacked characters) ── */}
      <div style={{
        position: "absolute",
        left: "20px",
        top: "25px",
        bottom: "190px",
        width: "45px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        pointerEvents: "none",
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: 900,
          fontSize: "27px",
          lineHeight: "1.1",
          color: "#ffffff",
          textShadow: "0 4px 15px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.8)",
          letterSpacing: "0.02em",
        }}>
          {nameChars.map((char, index) => (
            <span key={index} style={{ display: "block" }}>
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      </div>

      {/* ── Bottom Info Panel ── */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "200px",
        background: "linear-gradient(to top, rgba(10,11,16,1) 0%, rgba(10,11,16,0.96) 65%, transparent 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 22px 18px 22px",
        zIndex: 10,
      }}>
        {/* Position / Role (glowing gradient text) */}
        <div style={{
          fontWeight: 900,
          fontSize: "21px",
          fontFamily: "'Orbitron', sans-serif",
          fontStyle: "normal",
          background: `linear-gradient(90deg, ${C.purple} 0%, ${C.cyan} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: "6px",
          textAlign: "center",
          letterSpacing: "0.02em",
          textShadow: "0 2px 10px rgba(123,63,245,0.15)",
        }}>
          {data.position || "UI/UX Lead Designer"}
        </div>

        {/* Employee ID Number */}
        <div style={{
          color: "#ffffff",
          fontSize: "14px",
          fontWeight: 500,
          fontFamily: "'Orbitron', sans-serif",
          textAlign: "center",
          marginBottom: "8px",
          letterSpacing: "0.08em",
          opacity: 0.95,
        }}>
          ID No: {data.employeeId || "000-000-0001"}
        </div>

        {/* Barcode under ID */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
          <SvgBarcode value={barValue} width={220} height={28} color="rgba(255,255,255,0.85)" />
        </div>

        {/* Bottom strip: QR Code (left) and NFC icon (right) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          {/* Small scannable QR Code */}
          <div style={{
            background: "#ffffff",
            padding: "5px",
            borderRadius: "6px",
            lineHeight: 0,
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}>
            <QRCode
              value={qrValue}
              size={54}
              fgColor="#000000"
              bgColor="#ffffff"
              level="M"
            />
          </div>

          <NfcIcon color="rgba(255,255,255,0.6)" size={28} />
        </div>
      </div>
    </div>
  );
}

// ─── BACK SIDE component ──────────────────────────────────────────────────────
interface BackProps {
  data: EmployeeCard;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export function IdCardBack({ data, cardRef }: BackProps) {
  const qrValue = `https://www.jevxo.com/verify?id=${data.employeeId || "000-000-0001"}`;
  const backChars = "JEVXO".split("");

  return (
    <div
      ref={cardRef}
      style={{
        width: "375px",
        height: "620px",
        background: C.bg,
        borderRadius: "16px",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        boxShadow: "0 32px 64px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.06)",
        fontFamily: "'Orbitron', sans-serif",
      }}
    >
      {/* Decorative Outer Circuit Board Lines */}
      <div style={{ position: "absolute", top: "28px", left: "46px", right: "46px", height: "1px", background: `${C.cyan}40` }} />
      <div style={{ position: "absolute", bottom: "28px", left: "46px", right: "46px", height: "1px", background: `${C.cyan}40` }} />
      <div style={{ position: "absolute", left: "28px", top: "46px", bottom: "46px", width: "1px", background: `${C.cyan}40` }} />
      <div style={{ position: "absolute", right: "28px", top: "46px", bottom: "46px", width: "1px", background: `${C.cyan}40` }} />

      {/* 4 Corner brackets */}
      {(["tl", "tr", "bl", "br"] as const).map((pos) => (
        <div key={pos} style={{
          position: "absolute",
          top: pos.startsWith("t") ? "10px" : undefined,
          bottom: pos.startsWith("b") ? "10px" : undefined,
          left: pos.endsWith("l") ? "10px" : undefined,
          right: pos.endsWith("r") ? "10px" : undefined,
          zIndex: 5,
        }}>
          <CircuitCorner pos={pos} size={34} />
        </div>
      ))}

      {/* Large Brand Mark in Top-Right */}
      <div style={{ position: "absolute", top: "18px", right: "18px", zIndex: 10 }}>
        <JevxoXMark size={58} useGradient gradientId="backTopX" />
      </div>

      {/* Left side vertical "JEVXO" gradient text */}
      <div style={{
        position: "absolute",
        left: "10px",
        top: 0,
        bottom: 0,
        width: "70px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        pointerEvents: "none",
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: 900,
          fontSize: "66px",
          lineHeight: "1.05",
          background: `linear-gradient(to bottom, ${C.blue} 0%, ${C.purple} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "0.01em",
        }}>
          {backChars.map((char, index) => (
            <span key={index} style={{ display: "block" }}>
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* ── Center Content Column ── */}
      <div style={{
        position: "absolute",
        left: "85px",
        right: "25px",
        top: "50px",
        bottom: "60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
      }}>
        
        {/* "if found, please contact JEVXO" text above the QR code */}
        <div style={{
          color: C.cyan,
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textAlign: "center",
          fontFamily: "'Orbitron', sans-serif",
          marginBottom: "4px",
          opacity: 0.9,
        }}>
          if found, please contact JEVXO
        </div>

        {/* QR Code Container with circuit overlays and logo in center */}
        <div style={{ position: "relative" }}>
          {/* Circuit details framing around the QR */}
          <svg
            width="250" height="250"
            viewBox="0 0 250 250"
            fill="none"
            style={{ position: "absolute", top: "-25px", left: "-25px", pointerEvents: "none" }}
          >
            {/* TL */}
            <path d="M25 60 L25 25 L60 25" stroke={C.cyan} strokeWidth="1.6" strokeLinecap="round" opacity="0.8"/>
            <path d="M42 25 L42 14" stroke={C.cyan} strokeWidth="1" opacity="0.4"/>
            <path d="M25 42 L14 42" stroke={C.cyan} strokeWidth="1" opacity="0.4"/>
            {/* TR */}
            <path d="M190 25 L225 25 L225 60" stroke={C.cyan} strokeWidth="1.6" strokeLinecap="round" opacity="0.8"/>
            <path d="M208 25 L208 14" stroke={C.cyan} strokeWidth="1" opacity="0.4"/>
            <path d="M225 42 L236 42" stroke={C.cyan} strokeWidth="1" opacity="0.4"/>
            {/* BL */}
            <path d="M25 190 L25 225 L60 225" stroke={C.cyan} strokeWidth="1.6" strokeLinecap="round" opacity="0.8"/>
            <path d="M42 225 L42 236" stroke={C.cyan} strokeWidth="1" opacity="0.4"/>
            <path d="M25 208 L14 208" stroke={C.cyan} strokeWidth="1" opacity="0.4"/>
            {/* BR */}
            <path d="M190 225 L225 225 L225 190" stroke={C.cyan} strokeWidth="1.6" strokeLinecap="round" opacity="0.8"/>
            <path d="M208 225 L208 236" stroke={C.cyan} strokeWidth="1" opacity="0.4"/>
            <path d="M225 208 L236 208" stroke={C.cyan} strokeWidth="1" opacity="0.4"/>
          </svg>

          {/* QR code itself */}
          <div style={{ position: "relative", lineHeight: 0 }}>
            <QRCode
              value={qrValue}
              size={200}
              fgColor={C.cyan}
              bgColor="transparent"
              level="H"
            />

            {/* JEVXO X brand logo centered in QR code */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "48px",
              height: "48px",
              background: C.bg,
              borderRadius: "8px",
              border: `1.5px solid ${C.cyan}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <JevxoXMark size={32} color={C.cyan} />
            </div>
          </div>
        </div>

        {/* Contact info block */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
          {[
            {
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              ),
              text: "www.jevxo.com",
            },
            {
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              ),
              text: "info@jevxo.com",
            },
            {
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              ),
              text: "+880 18445-32000",
            },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: "12px", color: C.cyan, fontSize: "12px", fontWeight: 600 }}>
              <span style={{
                width: "24px",
                height: "24px",
                border: `1.2px solid ${C.cyan}60`,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                {icon}
              </span>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar with Pin Icon + Address and NFC Icon */}
      <div style={{
        position: "absolute",
        bottom: "34px",
        left: "85px",
        right: "25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "4px", color: `${C.cyan}aa`, fontSize: "9px", lineHeight: 1.5, maxWidth: "210px", fontWeight: 500 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginTop: "2px", flexShrink: 0 }}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <div>
            5th Floor, Incubation Centre, Starlink Ground<br />
            Station Hi-Tech Park Rajshahi, Rajshahi, Bangladesh
          </div>
        </div>
        <NfcIcon color={`${C.cyan}80`} size={24} />
      </div>
    </div>
  );
}

// ─── MAIN CONTAINER component ──────────────────────────────────────────────────
export interface EmployeeIdCardProps {
  data: EmployeeCard;
  frontRef: React.RefObject<HTMLDivElement | null>;
  backRef: React.RefObject<HTMLDivElement | null>;
}

export default function EmployeeIdCard({ data, frontRef, backRef }: EmployeeIdCardProps) {
  return (
    <div className="flex flex-col xl:flex-row gap-10 items-center justify-center w-full">
      <div className="flex flex-col items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] font-mono">
          Front Side
        </span>
        <IdCardFront data={data} cardRef={frontRef} />
      </div>
      <div className="flex flex-col items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] font-mono">
          Back Side
        </span>
        <IdCardBack data={data} cardRef={backRef} />
      </div>
    </div>
  );
}
