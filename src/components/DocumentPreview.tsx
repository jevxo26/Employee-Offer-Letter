"use client";

import React, { useState, useEffect } from "react";
import JevxoLogo from "./JevxoLogo";
import { numberToWords } from "../utils/numberToWords";
import { FirstParty, SecondParty, DocSettings } from "../types";

interface AppointmentLetterPreviewProps {
  firstParty: FirstParty;
  secondParty: SecondParty;
  settings: DocSettings;
  previewRef1: React.RefObject<HTMLDivElement | null>;
  previewRef2: React.RefObject<HTMLDivElement | null>;
  previewRef3: React.RefObject<HTMLDivElement | null>;
  isDemo: boolean;
}

export default function AppointmentLetterPreview({
  firstParty,
  secondParty,
  settings,
  previewRef1,
  previewRef2,
  previewRef3,
  isDemo,
}: AppointmentLetterPreviewProps) {
  const getMonthsText = (months: number) => {
    const word = numberToWords(months);
    return `${word} (${months})`;
  };

  const getDaysText = (days: number) => {
    const word = numberToWords(days);
    return `${word} (${days})`;
  };

  // State to track if the browser window has focus (used to prevent screenshots by blurring)
  const [isWindowFocused, setIsWindowFocused] = useState(true);

  useEffect(() => {
    if (!isDemo) return;

    const handleFocus = () => setIsWindowFocused(true);
    const handleBlur = () => setIsWindowFocused(false);

    // Prevent PrintScreen, Save, Print and Copy hotkeys
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === "p" || e.key === "s" || e.key === "c")) ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
        alert("Action disabled in demo preview mode for privacy and document protection.");
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("copy", handleCopy);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("copy", handleCopy);
    };
  }, [isDemo]);

  const founderSignatureSvg = (
    <svg
      viewBox="0 0 160 50"
      className="w-28 h-8 text-[#2D2A26] opacity-95 select-none pointer-events-none transform -rotate-2 -translate-y-1"
    >
      <path
        d="M 10,25 C 30,10 50,5 65,15 C 80,25 45,45 60,35 C 75,25 90,15 110,20 C 130,25 140,15 150,12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="65" cy="15" r="2" fill="currentColor" />
      <path
        d="M 55,25 Q 70,5 90,30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );

  // Apply blur effect to the outer wrapper when window loses focus in demo mode
  const blurClass = isDemo && !isWindowFocused ? "blur-[12px] grayscale-[50%] transition-all duration-300 pointer-events-none" : "transition-all duration-300";

  return (
    <div
      className={`flex flex-col items-center gap-6 w-full overflow-y-auto max-h-[85vh] p-4 bg-white/40 rounded-2xl border border-[#EBE5DE] scrollbar-thin scrollbar-thumb-slate-200 ${isDemo ? "select-none" : ""}`}
      id="preview_scrollable_deck"
      onContextMenu={isDemo ? (e) => e.preventDefault() : undefined}
      onDragStart={isDemo ? (e) => e.preventDefault() : undefined}
      style={isDemo ? {
        userSelect: "none",
        WebkitUserSelect: "none",
        msUserSelect: "none",
        MozUserSelect: "none",
      } : {}}
    >
      {/* Wrapper that handles client-side blur in demo mode */}
      <div className={blurClass}>
        {/* PAGE 1 */}
        <div
          ref={previewRef1}
          id="jevxo_p1"
          className="relative w-[793px] h-[1122px] bg-white text-slate-900 px-14 py-10 flex flex-col justify-between shadow-2xl rounded-sm shrink-0 overflow-hidden text-[12.5px] leading-[1.4]"
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          {/* Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none z-0">
            <div className="transform -rotate-12 scale-[2.2]">
              <JevxoLogo size="lg" />
            </div>
          </div>

          {/* Demo Watermark Overlay */}
          {isDemo && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-30 opacity-[0.06]">
              <div className="transform -rotate-45 text-slate-900 font-extrabold text-5xl tracking-widest uppercase border-8 border-slate-900 p-6 whitespace-nowrap">
                JEVXO DEMO ONLY
              </div>
            </div>
          )}

          {/* Top-Left Corner Geometric Accent */}
          <div className="absolute top-0 left-0 w-full h-[155px] pointer-events-none z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-[420px] h-[35px] bg-[#2563EB] transform -skew-x-30 origin-top-left shadow-lg"></div>
            <div className="absolute top-0 left-0 w-[200px] h-[45px] bg-[#3B82F6] transform -skew-x-30 origin-top-left opacity-90"></div>
            <div
              className="absolute top-0 left-0 w-[140px] h-[140px] rounded-full blur-2xl opacity-15 -translate-x-12 -translate-y-12"
              style={{ backgroundImage: "linear-gradient(to bottom right, #4f46e5, #3b82f6)" }}
            ></div>
            <div className="absolute top-0 right-0 w-[150px] h-[10px] bg-cyan-400 transform -skew-x-45 origin-top-right"></div>
            <div className="absolute top-[8px] right-0 w-[90px] h-[6px] bg-[#2563EB] opacity-60 transform -skew-x-45 origin-top-right"></div>
          </div>

          <div className="relative z-20 flex flex-col items-center pt-6">
            <JevxoLogo size="md" />
            <div
              className="w-full h-[2px] mt-3.5"
              style={{ backgroundImage: "linear-gradient(to right, transparent, #2563eb, transparent)" }}
            ></div>
            <h1
              className="text-center font-extrabold text-[#1E3A8A] tracking-wider text-[17px] mt-4 select-text uppercase"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              Letter Of Appointment & Partnership Agreement
            </h1>
          </div>

          <div className="relative z-20 flex flex-col gap-5 select-text mt-2">
            <div className="flex justify-between items-center text-slate-500 text-[11px] font-bold tracking-wider">
              <span>REF: JEVXO/PA/{new Date(settings.date).getFullYear() || "2026"}/092</span>
              <span className="text-slate-800">Date: {settings.date}</span>
            </div>

            {/* Side-by-side cards */}
            <div className="grid grid-cols-2 gap-5">
              {/* First Party (Company) */}
              <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-[11.5px] font-extrabold text-[#2563EB] uppercase tracking-wider mb-3 pb-1 border-b border-[#2563EB]/15">
                    First Party (Company)
                  </h3>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex flex-col border-b border-slate-100 pb-1">
                      <span className="text-slate-400 font-semibold uppercase text-[9px]">Company Name</span>
                      <span className="font-bold text-slate-800 mt-0.5">{firstParty.companyName}</span>
                    </div>
                    <div className="flex flex-col border-b border-slate-100 pb-1">
                      <span className="text-slate-400 font-semibold uppercase text-[9px]">Represented By</span>
                      <span className="font-bold text-slate-800 mt-0.5">{firstParty.representedBy} ({firstParty.role})</span>
                    </div>
                    <div className="flex flex-col border-b border-slate-100 pb-1">
                      <span className="text-slate-400 font-semibold uppercase text-[9px]">Office Address</span>
                      <span className="font-bold text-slate-800 mt-0.5 line-clamp-1">{firstParty.currentAddress}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 font-semibold uppercase text-[9px]">NID / Corporate Registration</span>
                      <span className="font-bold text-slate-800 mt-0.5">{firstParty.nidNumber}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Party (Partner) */}
              <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-[11.5px] font-extrabold text-[#2563EB] uppercase tracking-wider mb-3 pb-1 border-b border-[#2563EB]/15">
                    Second Party (Partner)
                  </h3>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex flex-col border-b border-slate-100 pb-1">
                      <span className="text-slate-400 font-semibold uppercase text-[9px]">Full Name</span>
                      <span className="font-bold text-slate-800 mt-0.5">{secondParty.fullName || "____________________"}</span>
                    </div>
                    <div className="flex flex-col border-b border-slate-100 pb-1">
                      <span className="text-slate-400 font-semibold uppercase text-[9px]">{secondParty.guardianRelation}'s Name</span>
                      <span className="font-bold text-slate-800 mt-0.5">{secondParty.guardianName || "____________________"}</span>
                    </div>
                    <div className="flex flex-col border-b border-slate-100 pb-1">
                      <span className="text-slate-400 font-semibold uppercase text-[9px]">Permanent Address</span>
                      <span className="font-bold text-slate-800 mt-0.5 line-clamp-1">{secondParty.permanentAddress || "____________________"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 font-semibold uppercase text-[9px]">Assigned Role Position</span>
                      <span className="font-extrabold text-[#2563EB] mt-0.5">{secondParty.position || "____________________"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Description */}
            <div className="space-y-1.5 mt-1">
              <h4 className="text-[11px] font-bold text-[#1E3A8A] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
                Role & Ownership Mindset
              </h4>
              <p className="text-slate-600 text-justify text-[11.5px] leading-relaxed">
                You are hereby appointed as the <strong className="font-bold text-slate-900">{secondParty.position || "[Position]"}</strong> of <strong className="font-bold text-slate-900">{firstParty.companyName}</strong>. Please note that JEVXO is not a conventional corporate workplace; it operates under a <strong className="font-bold text-[#2563EB]">partnership-based model</strong>. As such, you are not merely an employee but a valued <strong className="font-bold text-slate-900">Partner</strong> of the organization. In this role, you are expected to demonstrate an <strong className="font-bold text-slate-900">ownership mindset</strong>, take active responsibility for the company's growth, and consistently uphold the highest standards of professional ethics, accountability, and integrity.
              </p>
            </div>

            {/* Probation Clause */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-bold text-[#1E3A8A] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
                Minimum Service Period & Vesting
              </h4>
              <p className="text-slate-600 text-justify text-[11.5px] leading-relaxed">
                To become eligible for partnership equity and core developer benefits, you must successfully perform your assigned duties within the company for a minimum probation period of <strong className="font-bold text-slate-900">{getMonthsText(settings.minimumServicePeriod)} months</strong>. During this duration, performance reviews will be conducted regularly to assess alignment with JEVXO's culture and milestones.
              </p>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="relative z-20 border-t border-slate-200 pt-3 flex justify-between items-center text-[10.5px] text-slate-500 font-medium select-text">
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></span>
                {firstParty.mobileNumber}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></span>
                {firstParty.email}
              </span>
            </div>
            <div>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></span>
                {firstParty.website}
              </span>
            </div>
            <div
              className="absolute -bottom-12 -right-14 w-[160px] h-[70px] transform skew-y-12 origin-bottom-right opacity-85 pointer-events-none"
              style={{ backgroundImage: "linear-gradient(to top left, #4338ca, #3b82f6)" }}
            ></div>
            <div className="absolute -bottom-12 -left-14 w-[80px] h-[35px] bg-[#3B82F6] transform -skew-y-12 origin-bottom-left opacity-35 pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* PAGE 2 (Hidden in Demo Preview) */}
      {!isDemo && (
        <div className={blurClass}>
          {/* PAGE 2 */}
          <div
            ref={previewRef2}
            id="jevxo_p2"
            className="relative w-[793px] h-[1122px] bg-white text-slate-900 px-14 py-10 flex flex-col justify-between shadow-2xl rounded-sm shrink-0 overflow-hidden text-[12.5px] leading-[1.38]"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none z-0">
              <div className="transform -rotate-12 scale-[2.2]">
                <JevxoLogo size="lg" />
              </div>
            </div>

            {/* Top-Left Corner Geometric Accent */}
            <div className="absolute top-0 left-0 w-full h-[155px] pointer-events-none z-10 overflow-hidden">
              <div className="absolute top-0 left-0 w-[420px] h-[35px] bg-[#2563EB] transform -skew-x-30 origin-top-left shadow-lg"></div>
              <div className="absolute top-0 left-0 w-[200px] h-[45px] bg-[#3B82F6] transform -skew-x-30 origin-top-left opacity-90"></div>
              <div
                className="absolute top-0 left-0 w-[140px] h-[140px] rounded-full blur-2xl opacity-15 -translate-x-12 -translate-y-12"
                style={{ backgroundImage: "linear-gradient(to bottom right, #4f46e5, #3b82f6)" }}
              ></div>
              <div className="absolute top-0 right-0 w-[150px] h-[10px] bg-cyan-400 transform -skew-x-45 origin-top-right"></div>
              <div className="absolute top-[8px] right-0 w-[90px] h-[6px] bg-[#2563EB] opacity-60 transform -skew-x-45 origin-top-right"></div>
            </div>

            <div className="relative z-20 flex flex-col pt-6">
              <div className="flex justify-center">
                <JevxoLogo size="md" />
              </div>
              <div className="w-full h-[1.5px] bg-slate-100 mt-2"></div>
            </div>

            <div className="relative z-20 flex flex-col gap-3 select-text mt-2">
              {/* Equity Allocation Agreement */}
              <div className="space-y-0.5">
                <h2 className="font-bold text-[#1E3A8A] text-[13.5px] uppercase tracking-wide">
                  Equity Allocation Agreement
                </h2>
                <p className="text-slate-600 text-justify text-[11.5px] leading-relaxed">
                  The allocation of the agreed <strong className="font-bold text-slate-800">{settings.equityShare}% equity share</strong> shall be executed through a separate legally binding agreement. This agreement will clearly define the ownership structure, rights, responsibilities, vesting conditions, and all other relevant terms and conditions associated with the equity.
                </p>
              </div>

              {/* Equity Continuity */}
              <div className="space-y-0.5">
                <h2 className="font-bold text-[#1E3A8A] text-[13.5px] uppercase tracking-wide">
                  Equity Continuity
                </h2>
                <p className="text-slate-600 text-justify text-[11.5px] leading-relaxed">
                  Once granted, the equity share shall remain valid and effective in accordance with the company's applicable policies, shareholder agreements, and the terms outlined in the relevant legal documentation. The ownership and retention of such equity shall be subject to compliance with those terms and conditions.
                </p>
              </div>

              {/* Place of Work (Remote Work Policy) */}
              <div className="space-y-0.5">
                <h2 className="font-bold text-[#1E3A8A] text-[13.5px] uppercase tracking-wide">
                  Place of Work (Remote Work Policy)
                </h2>
                <p className="text-slate-600 text-justify text-[11.5px] leading-relaxed">
                  At present, all duties and responsibilities under this agreement shall be performed on a remote basis. The Company reserves the right to transition operations to a physical office environment when it reaches a sustainable and profitable stage. In such circumstances, the Partner shall be notified in advance through an official written notice.
                </p>
              </div>

              {/* Confidentiality & NDA */}
              <div className="space-y-0.5">
                <h2 className="font-bold text-[#1E3A8A] text-[13.5px] uppercase tracking-wide">
                  Confidentiality & Non-Disclosure (NDA)
                </h2>
                <p className="text-slate-600 text-justify text-[11.5px] leading-relaxed">
                  All company-related information, including source code, client data, business strategies, and financial records, shall be treated as strictly confidential. The Partner agrees not to disclose, share, or misuse any confidential information without prior written authorization. Unauthorized disclosure shall be considered a material breach and may result in legal actions and claims for damages.
                </p>
              </div>

              {/* Termination & Resignation */}
              <div className="space-y-0.5">
                <h2 className="font-bold text-[#1E3A8A] text-[13.5px] uppercase tracking-wide">
                  Termination & Resignation
                </h2>
                <p className="text-slate-600 text-justify text-[11.5px] leading-relaxed">
                  Either Party may terminate this agreement by providing the other Party with a minimum of <strong className="font-bold text-slate-800">{getDaysText(settings.noticePeriod)} days'</strong> prior written notice. However, the Company reserves the right to implement immediate termination without notice in cases involving fraud, gross misconduct, breach of confidentiality, gross negligence, or unethical behavior. Upon termination, all Company owned properties and documents must be returned.
                </p>
              </div>

              {/* Acceptance Section & Signatures */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <h2 className="font-bold text-[#1E3A8A] text-[13.5px] uppercase tracking-wide">
                  Signatures & Acceptance
                </h2>
                
                <div className="p-3 bg-[#2563EB]/5 border border-[#2563EB]/10 rounded-2xl">
                  <p className="text-slate-700 text-justify text-[11px] leading-relaxed">
                    I, <strong className="font-bold text-slate-900">{secondParty.fullName || "[Second Party Name]"}</strong>, hereby acknowledge that I have read, understood, and agreed to all the terms and conditions set forth in this Appointment Letter and Partnership Policy of <strong className="font-bold text-[#2563EB]">{firstParty.companyName}</strong>. I further undertake to comply with and uphold all obligations and policies contained herein.
                  </p>
                </div>

                {/* Compact elegant signatures */}
                <div className="grid grid-cols-2 gap-x-10 pt-8 pl-1">
                  {/* Second Party Signature Holder */}
                  <div className="relative">
                    <div className="absolute -top-12 left-4 h-12 w-48 flex items-end justify-start pointer-events-none select-none">
                      {secondParty.signatureImg ? (
                        <img
                          src={secondParty.signatureImg}
                          alt="Second Party Signature"
                          className="max-h-11 max-w-[170px] object-contain block opacity-95 transition-all duration-300"
                        />
                      ) : (
                        <div className="text-amber-600 font-bold tracking-wide animate-pulse text-[8.5px] bg-amber-50 px-2 py-0.5 border border-amber-200 rounded uppercase">
                          Awaiting Partner Sign *
                        </div>
                      )}
                    </div>
                    <div className="text-slate-800 font-bold text-[11px] border-t border-slate-400 border-dashed pt-1.5">
                      Signature & Date (Second Party / Partner)
                    </div>
                  </div>

                  {/* Founder First Party Signature */}
                  <div className="relative">
                    <div className="absolute -top-12 left-4 h-12 w-48 flex items-end justify-start pointer-events-none select-none">
                      {firstParty.signatureImg ? (
                        <img
                          src={firstParty.signatureImg}
                          alt="Founder Signature"
                          className="max-h-11 max-w-[170px] object-contain block opacity-95 transition-all duration-300"
                        />
                      ) : (
                        founderSignatureSvg
                      )}
                    </div>
                    <div className="text-slate-800 font-bold text-[11px] border-t border-slate-400 border-dashed pt-1.5">
                      Signature & Date (Founder, JEVXO)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Bar */}
            <div className="relative z-20 border-t border-slate-200 pt-3 flex justify-between items-center text-[10.5px] text-slate-500 font-medium select-text">
              <div className="flex gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></span>
                  {firstParty.mobileNumber}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></span>
                  {firstParty.email}
                </span>
              </div>
              <div>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></span>
                  {firstParty.website}
                </span>
              </div>
              <div
                className="absolute -bottom-12 -right-14 w-[160px] h-[70px] transform skew-y-12 origin-bottom-right opacity-85 pointer-events-none"
                style={{ backgroundImage: "linear-gradient(to top left, #4338ca, #3b82f6)" }}
              ></div>
              <div className="absolute -bottom-12 -left-14 w-[80px] h-[35px] bg-[#3B82F6] transform -skew-y-12 origin-bottom-left opacity-35 pointer-events-none"></div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Mode Notice Box */}
      {isDemo && (
        <div className="w-[793px] mt-4 p-5 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3 shadow-md relative z-10">
          <div className="p-2 bg-blue-100 rounded-xl text-[#2563EB] shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m0-6v2m0-6h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#1E3A8A]">
              Demo Preview Mode Active
            </h4>
            <p className="text-xs text-[#334155] mt-1 leading-relaxed">
              For privacy and intellectual property reasons, exporting, downloading,
              copying, and screenshotting are disabled in this demo environment. Additionally,
              only Page 1 is visible, and subsequent pages are restricted. Please authenticate
              via the founder's portal using the main "Start Partner Entry" option to access
              the full multi-page agreement generation and signature workflows.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
