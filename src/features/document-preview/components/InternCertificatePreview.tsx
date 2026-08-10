"use client";

import React from "react";
import { FirstParty, SecondParty, DocSettings } from "@/types";
import JevxoLogo from "@/shared/layout/JevxoLogo";
import { buildVerifyUrl } from "@/lib/verifyUrl";
import QRCode from "react-qr-code";

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

  const verifyUrl = buildVerifyUrl(d.certId);

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
      {/* Vector Background and Corner Accents */}
      {/* ── Vector Background and Corner Accents ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 1123 794"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="cert-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.5" fill="#64748B" opacity="0.123" />
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
           <JevxoLogo/>
            <div className="relative">
              <div className="w-7 md:w-9.5 lg:w-12 h-0.5 md:h-0.75 absolute top-1.5 md:top-2 lg:top-2.5 lg:left-3 md:left-2.5 left-2 bg-linear-to-l from-blue-400 to-violet-400" />
              <p className="ml-10 md:ml-12 lg:ml-16 text-[9px] md:text-xs lg:text-sm italic font-normal text-slate-500" style={{ fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif", fontWeight: "700" }}>
                Build your Empire
              </p>
            </div>
          </div>
          <div className="text-right space-y-0.5">
            <p style={{ fontFamily: "var(--font-opensans), 'Open Sans', sans-serif", fontSize: '10pt', fontWeight: 600 }} className="text-slate-400 uppercase tracking-wider">
              Intern ID: <span style={{ fontWeight: 400 }} className="text-slate-600 font-normal">{d.internId}</span>
            </p>
            <p style={{ fontFamily: "var(--font-opensans), 'Open Sans', sans-serif", fontSize: '10pt', fontWeight: 600 }} className="text-slate-400 uppercase tracking-wider">
              Certificate ID: <span style={{ fontWeight: 400 }} className="text-slate-600 font-normal">{d.certId}</span>
            </p>
          </div>
        </div>

        {/* Center: Main Certificate Text block */}
        <div className="flex-1 flex flex-col justify-center items-center text-center max-w-4xl mx-auto my-2">
          <div className="space-y-1">
            <p style={{ fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif", fontSize: '13pt', fontWeight: 400, letterSpacing: '0.25em' }} className="uppercase text-blue-600 text-center">
              OFFICIAL RECOGNITION
            </p>
            <h1 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: '30pt', fontWeight: 700, letterSpacing: '0.05em' }} className="uppercase text-slate-900 text-center my-2">
              CERTIFICATE OF INTERNSHIP
            </h1>
          </div>

          <p style={{ fontFamily: "var(--font-ebgaramond), 'EB Garamond', serif", fontSize: '16pt', fontStyle: 'italic' }} className="text-slate-600 text-center">
            This certificate is proudly presented to
          </p>

          {/* Prominent Intern Name */}
          <div className="space-y-2">
            <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: '44pt', fontWeight: 500 }} className="text-blue-950 text-center ">
              {d.internName || "Juwel Khan Shanto"}
            </h2>
            <div className="w-48 h-0.5 bg-slate-200 mx-auto" />
          </div>

          {/* completion phrased text */}
          <p style={{ fontFamily: "var(--font-ebgaramond), 'EB Garamond', serif", fontSize: '15pt', lineHeight: '1.6', textAlign: 'justify' }} className="text-slate-700 max-w-3xl mx-auto my-4">
            In recognition of their successful completion of the professional internship at JEVXO. During this tenure, they demonstrated exemplary technical competence, dedication, and professional excellence. We highly appreciate their valuable contributions and wish them the very best in their future career.
          </p>

          {/* details grid */}
          <div className="flex justify-between items-center mt-4 px-10 py-3.5 bg-slate-50/60 border border-slate-100/80 rounded-2xl text-center w-full max-w-3xl">
            <div>
              <p style={{ fontFamily: "var(--font-opensans), 'Open Sans', sans-serif", fontSize: '10pt', fontWeight: 600 }} className="text-slate-400 uppercase tracking-wider">Position</p>
              <p style={{ fontFamily: "var(--font-opensans), 'Open Sans', sans-serif", fontSize: '11pt', fontWeight: 400 }} className="text-slate-800 mt-1">{d.position}</p>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-opensans), 'Open Sans', sans-serif", fontSize: '10pt', fontWeight: 600 }} className="text-slate-400 uppercase tracking-wider">Department</p>
              <p style={{ fontFamily: "var(--font-opensans), 'Open Sans', sans-serif", fontSize: '11pt', fontWeight: 400 }} className="text-slate-800 mt-1">{d.department}</p>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-opensans), 'Open Sans', sans-serif", fontSize: '10pt', fontWeight: 600 }} className="text-slate-400 uppercase tracking-wider">Duration</p>
              <p style={{ fontFamily: "var(--font-opensans), 'Open Sans', sans-serif", fontSize: '11pt', fontWeight: 400 }} className="text-slate-800 mt-1">{d.startDate} - {d.endDate}</p>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-opensans), 'Open Sans', sans-serif", fontSize: '10pt', fontWeight: 600 }} className="text-slate-400 uppercase tracking-wider">Rating / Grade</p>
              <p style={{ fontFamily: "var(--font-opensans), 'Open Sans', sans-serif", fontSize: '11pt', fontWeight: 800 }} className="text-[#6366F1] mt-1 font-semibold">{d.performanceGrade}</p>
            </div>
          </div>
        </div>

        {/* Bottom: Signature Block */}
        <div className="flex justify-between items-end pt-5">
          <div className="text-left space-y-1">
            <p style={{ fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif", fontSize: '10pt', fontWeight: 600 }} className="text-slate-400 uppercase tracking-wider">Date of Issue</p>
            <p style={{ fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif", fontSize: '10.5pt', fontWeight: 400 }} className="text-slate-800">{d.issueDate}</p>
          </div>

          {/* Centered verification QR Code */}
          <div className="flex flex-col items-center space-y-1 select-none pointer-events-none pb-1">
            <div className="bg-white p-1 border border-slate-200/80 rounded shadow-xs shrink-0">
              <QRCode value={verifyUrl} size={46} level="M" />
            </div>
            <p className="text-[7.5px] font-mono font-bold tracking-widest text-slate-400 uppercase">Verify Doc</p>
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
            <p style={{ fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif", fontSize: '13pt', fontWeight: 800 }} className="text-slate-800 border-t border-slate-300 pt-1 w-48 text-center">
              {d.ceoName}
            </p>
            <p style={{ fontFamily: "var(--font-ebgaramond), 'EB Garamond', serif", fontSize: '12pt', fontWeight: 600 }} className="text-slate-500 tracking-wider text-center w-48">
              {d.ceoRole}, {d.companyName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
