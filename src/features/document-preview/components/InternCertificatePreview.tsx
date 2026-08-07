"use client";

import React from "react";
import { FirstParty, SecondParty, DocSettings } from "@/types";
import JevxoLogo from "@/shared/layout/JevxoLogo";

interface GradientTextCanvasProps {
  text: string;
}

function GradientTextCanvas({ text }: GradientTextCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const scale = 3;
      const baseWidth = 800;
      const baseHeight = 50;

      canvas.width = baseWidth * scale;
      canvas.height = baseHeight * scale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale);

      // Create linear gradient matching CSS stops
      const gradient = ctx.createLinearGradient(200, 0, 600, 0);
      gradient.addColorStop(0, "#2563EB");
      gradient.addColorStop(1, "#7C3AED");

      ctx.fillStyle = gradient;
      ctx.font = "900 30px 'Inter', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillText(text, baseWidth / 2, baseHeight / 2);
    };

    draw();

    if (typeof document !== "undefined" && (document as any).fonts) {
      (document as any).fonts.ready.then(draw);
    }
  }, [text]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 800, height: 50 }}
      className="mx-auto block select-none pointer-events-none"
    />
  );
}

interface InternCertificatePreviewProps {
  firstParty: FirstParty;
  secondParty: SecondParty;
  settings: DocSettings;
  previewRefs?: React.RefObject<HTMLDivElement | null>[];
}

export default function InternCertificatePreview({
  firstParty,
  secondParty,
  settings,
  previewRefs = [],
}: InternCertificatePreviewProps) {
  const d = {
    internName: secondParty.fullName || "Intern Name",
    position: secondParty.position || "Intern Position",
    department: secondParty.department || "Engineering",
    startDate: settings.certStartDate || "—",
    endDate: settings.certEndDate || "—",
    performanceGrade: settings.certPerformanceGrade || "Outstanding",
    certId: settings.certId || "JVX-CRT-26-001",
    internId: secondParty.partnerId || settings.certInternId || "JVX-INT-2026-04",
    companyName: firstParty.companyName || "JEVXO",
    ceoName: firstParty.representedBy || "Founder Name",
    ceoRole: firstParty.role || "Founder & CEO",
    ceoSig: firstParty.signatureImg || "",
    issueDate: settings.date || new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };

  return (
    <div
      id="certificate-preview-container"
      className="flex flex-col select-none relative bg-white border border-slate-200 overflow-hidden shadow-2xl print:border-none print:shadow-none"
      ref={previewRefs[0]}
      style={{
        boxSizing: "border-box",
        width: 1123,
        height: 794,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Vector Background and Corner Accents ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 1123 794"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="cert-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.5" fill="#64748B" opacity="0.25" />
          </pattern>
          <linearGradient id="corner-grad-top" x1="0" y1="0" x2="350" y2="350" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="corner-grad-bottom" x1="1123" y1="794" x2="773" y2="444" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Dot grid pattern across the page */}
        <rect width="100%" height="100%" fill="url(#cert-dots)" />

        {/* Sleek Top-Left Corner Geometric Accents */}
        <polygon points="0,0 350,0 0,350" fill="url(#corner-grad-top)" opacity="0.25" />
        <polygon points="0,0 240,0 0,240" fill="url(#corner-grad-top)" opacity="0.7" />
        <polygon points="0,0 120,0 0,120" fill="#488af7" />

        {/* Sleek Bottom-Right Corner Geometric Accents */}
        <polygon points="1123,794 773,794 1123,444" fill="url(#corner-grad-bottom)" opacity="0.25" />
        <polygon points="1123,794 883,794 1123,554" fill="url(#corner-grad-bottom)" opacity="0.7" />
        <polygon points="1123,794 1003,794 1123,674" fill="#8c56e8" />
      </svg>

      {/* ── Central watermark logo ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/x-logo0bg.png"
          alt="Jevxo Watermark"
          className="w-[500px] h-[500px] object-contain opacity-[0.1]"
        />
      </div>

      {/* ── Certificate Content (Z-10 to stay above SVGs) ── */}
      <div className="z-10 flex flex-col justify-between h-full p-16 relative">
        
        {/* Top: Header branding & IDs */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
              <JevxoLogo />
            <div className="relative ml-1.75 md:ml-2.25 lg:ml-3">
              <div className="w-7 md:w-9.5 lg:w-12 h-0.5 md:h-0.75 absolute top-1.5 md:top-2 lg:top-2.5 bg-linear-to-l from-blue-400 to-violet-400" />
              <p className="ml-8 md:ml-11 lg:ml-15 text-[9px] md:text-xs lg:text-sm"><strong> Build your Empire </strong></p>
            </div>
          </div>
          <div className="text-right font-mono text-[13px] font-semibold text-slate-400 space-y-0.5">
            <p>Intern ID: <span className="text-slate-600 font-bold">{d.internId}</span></p>
            <p>Certificate ID: <span className="text-slate-600 font-bold">{d.certId}</span></p>
          </div>
        </div>

        {/* Center: Main Certificate Text block */}
        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6 max-w-4xl mx-auto my-4">
          <div className="space-y-1">
            <span className="text-xs font-black tracking-[0.25em] text-[#6366F1] uppercase">Official Recognition</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight uppercase">
              Certificate of Internship
            </h2>
          </div>

          <p className="text-sm italic text-slate-500">This certificate is proudly presented to</p>

          {/* Prominent Intern Name */}
          <div className="space-y-2 select-none pointer-events-none">
            <GradientTextCanvas text={d.internName} />
            <div className="w-48 h-0.5 bg-slate-200 mx-auto" />
          </div>

          {/* completion phrased text */}
          <p className="text-center text-slate-600 text-[15px] leading-relaxed max-w-3xl mx-auto my-3 font-sans">
            In recognition of their successful completion of the professional internship program at{" "}
            <strong className="text-slate-800 font-bold">JEVXO</strong>. Throughout this tenure, they have actively contributed to key departmental projects, showcased exemplary technical competence, and consistently demonstrated outstanding dedication, teamwork, and professional excellence. We deeply appreciate their valuable contributions and wish them the very best in all their future career endeavors.
          </p>

          {/* details grid */}
          <div className="flex justify-between items-center mt-5 px-10 py-3.5 bg-slate-50/60 border border-slate-100/80 rounded-2xl text-center w-full max-w-3xl">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Position</p>
              <p className="text-sm font-extrabold text-slate-800 mt-1">{d.position}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Department</p>
              <p className="text-sm font-extrabold text-slate-800 mt-1">{d.department}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Duration</p>
              <p className="text-sm font-extrabold text-slate-800 mt-1">{d.startDate} - {d.endDate}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rating / Grade</p>
              <p className="text-sm font-extrabold text-indigo-600 mt-1">{d.performanceGrade}</p>
            </div>
          </div>
        </div>

        {/* Bottom: Signature Block */}
        <div className="flex justify-between items-end pt-6">
          <div className="text-left space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date of Issue</p>
            <p className="text-[13px] font-extrabold text-slate-800">{d.issueDate}</p>
          </div>

          <div className="text-right flex flex-col items-center">
            <div className="h-12 mb-1 flex items-center justify-center">
              {d.ceoSig ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={d.ceoSig}
                  alt="CEO Signature"
                  className="max-h-11 max-w-[180px] object-contain object-right opacity-95 block"
                />
              ) : (
                <div className="text-amber-600 font-bold tracking-wide animate-pulse text-[8.5px] bg-amber-50 px-2 py-0.5 border border-amber-200 rounded uppercase inline-block">
                  Awaiting Authorization *
                </div>
              )}
            </div>
            <p className="text-sm font-extrabold text-slate-800 border-t border-slate-200 pt-1 w-48 text-center">
              {d.ceoName}
            </p>
            <p className="text-xs text-slate-500 font-semibold tracking-wider text-center w-48">
              {d.ceoRole}, {d.companyName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
