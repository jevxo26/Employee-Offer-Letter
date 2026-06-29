"use client";

import React from "react";
import QRCode from "react-qr-code";
import { buildVerifyUrl } from "../lib/verifyUrl";
import { EmployeeCard } from "../types";
import Image from "next/image"
import logo from "../../assets/logo0bg.png";

// ─── Card dimensions — CR80 portrait ratio (54×85.6mm) at screen scale ───────
const CARD_W = 360;
const CARD_H = 570;

// ─── Brand palette ────────────────────────────────────────────────────────────
const C = {
  bg: "#0A0B10",
  purple: "#7B3FF5",
  blue: "#2562FF",
  cyan: "#4B9EFF",
};

// ─── NFC tap icon (matches the card image) ────────────────────────────────────
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
    >
      {/* card body */}
      <rect x="2" y="5" width="16" height="22" rx="2.5" strokeWidth="1.8" />
      {/* chip */}
      <rect x="4.5" y="8" width="7" height="5" rx="0.8" strokeWidth="1.2" fill={color} />
      {/* wave arcs — right side */}
      <path d="M22 11 C24 14 24 18 22 21" strokeWidth="1.8" />
      <path d="M26 8.5 C29.5 12.5 29.5 19.5 26 23.5" strokeWidth="1.8" />
    </svg>
  );
}

// ─── FRONT SIDE ───────────────────────────────────────────────────────────────
interface FrontProps {
  data: EmployeeCard;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export function IdCardFront({ data, cardRef }: FrontProps) {
  const verifyUrl = buildVerifyUrl(
    data.employeeId || "000-000-0001",
    "https://www.jevxo.com"
  );
  const nameChars = (data.fullName || "EMPLOYEE NAME")
    .toUpperCase()
    .split("")
    .reverse();

  return (
    <div
      ref={cardRef}
      style={{
        width: `${CARD_W}px`,
        height: `${CARD_H}px`,
        background: C.bg,
        backgroundImage: "url('/x-logo0bg.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "175% auto",
        backgroundPosition: "25% 100%",
        borderRadius: "18px",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        boxShadow:
          "0 32px 64px rgba(0,0,0,0.75), inset 0 0 0 1px rgba(255,255,255,0.07)",
        fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
        userSelect: "none",
      }}
    >
      {/* ── Layer 2: Candidate photo ── */}
      {data.photoUrl ? (
        <img
          src={data.photoUrl}
          alt={data.fullName || "Employee"}
          style={{
            position: "absolute",
            top: "14px",
            right: "-14px",
            width: "320px",
            height: "490px",
            objectFit: "cover",
            objectPosition: "center top",
            zIndex: 2,
            maskImage:
              "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.55) 75%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.55) 75%, transparent 100%)",
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            top: "55px",
            right: "-14px",
            width: "320px",
            height: "510px",
            zIndex: 2,
            background:
              "linear-gradient(140deg, #13141f 0%, #1e2035 55%, #13141f 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maskImage:
              "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.55) 75%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.55) 75%, transparent 100%)",
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.12)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textAlign: "center",
              lineHeight: 1.8,
            }}
          >
            NO PHOTO
            <br />
            PROVIDED
          </span>
        </div>
      )}

      {/* ── Layer 3: Top-right JEVXO brand logo ── */}
      <div
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          zIndex: 10,
        }}
      >
        <Image src={logo} width={150} height={100} alt="logo" />
      </div>

      {/* ── Layer 4: Vertical name on the left ── */}
      <div
        style={{
          position: "absolute",
          left: "8px",
          top: "20px",
          bottom: "150px",
          width: "42px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 900,
            fontSize: "33px",
            lineHeight: "28px",
            color: "#ffffff",
            textShadow:
              "0 3px 14px rgba(0,0,0,0.98), 0 1px 3px rgba(0,0,0,0.85)",
          }}
        >
          {nameChars.map((char, i) => (
            <span
              className="tracking-tighter"
              key={i}
              style={{ display: "block", rotate: "270deg" }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      </div>

      {/* ── Layer 5: Bottom info panel ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "200px",
          background:
            "linear-gradient(to top, rgba(10,11,16,1) 0%, rgba(10,11,16,0.97) 60%, transparent 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 20px 18px 20px",
          zIndex: 10,
        }}
      >
        {/* Position / Role — gradient text */}
        <div
          style={{
            fontWeight: 900,
            fontSize: "22px",
            fontFamily: "'Orbitron', sans-serif",
            background: `linear-gradient(90deg, ${C.purple} 0%, ${C.cyan} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            paddingLeft: "42px",
            marginBottom: "4px",
            textAlign: "center",
            letterSpacing: "0.01em",
          }}
        >
          {data.position || "UI/UX Lead Designer"}
        </div>

        {/* Employee ID */}
        <div
          style={{
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 500,
            fontFamily: "'Orbitron', sans-serif",
            textAlign: "center",
            paddingLeft: "42px",
            marginBottom: "14px",
            letterSpacing: "0.1em",
            opacity: 0.95,
          }}
        >
          ID No: {data.employeeId || "000-000-0001"}
        </div>

        {/* Bottom row: QR (left) + NFC (right) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          {/* QR code — links to jevxo.com verify */}
          <div
            style={{
              background: "#ffffff",
              padding: "5px",
              borderRadius: "7px",
              lineHeight: 0,
              boxShadow: "0 4px 14px rgba(0,0,0,0.55)",
            }}
          >
            <QRCode
              value={verifyUrl}
              size={58}
              fgColor="#000000"
              bgColor="#ffffff"
              level="M"
            />
          </div>

          {/* NFC icon */}
          <NfcIcon color="rgba(255,255,255,0.6)" size={32} />
        </div>
      </div>
    </div>
  );
}

// ─── BACK SIDE — static image, same for all cards ─────────────────────────────
interface BackProps {
  data: EmployeeCard;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export function IdCardBack({ data: _data, cardRef }: BackProps) {
  return (
    <div
      ref={cardRef}
      style={{
        width: `${CARD_W}px`,
        height: `${CARD_H}px`,
        borderRadius: "18px",
        overflow: "hidden",
        flexShrink: 0,
        boxShadow:
          "0 32px 64px rgba(0,0,0,0.75), inset 0 0 0 1px rgba(255,255,255,0.07)",
        position: "relative",
      }}
    >
      {/* Static back image — identical for every card */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/id-card-back.png"
        alt="ID Card Back"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export interface EmployeeIdCardProps {
  data: EmployeeCard;
  frontRef: React.RefObject<HTMLDivElement | null>;
  backRef: React.RefObject<HTMLDivElement | null>;
}

export default function EmployeeIdCard({
  data,
  frontRef,
  backRef,
}: EmployeeIdCardProps) {
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
