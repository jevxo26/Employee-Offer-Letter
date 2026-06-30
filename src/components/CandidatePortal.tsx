"use client";

import React, { useRef } from "react";
import { motion } from "motion/react";
import CandidateSidebar from "./CandidateSidebar";
import WorkspaceCanvas from "./WorkspaceCanvas";
import { IdCardFront, IdCardBack } from "./EmployeeIdCard";
import { FirstParty, SecondParty, DocSettings, EmployeeCard } from "../types";

interface CandidatePortalProps {
  firstParty: FirstParty;
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  docSettings: DocSettings;
  isExporting: boolean;
  isCompleted: boolean;
  onExport: () => void;
  offerId: string;
  previewRefs: React.RefObject<HTMLDivElement | null>[];
  /** Receives the id card refs so page.tsx can call buildIdCardPdfBase64 at sign time */
  onIdCardRefsReady?: (
    frontRef: React.RefObject<HTMLDivElement | null>,
    backRef:  React.RefObject<HTMLDivElement | null>,
  ) => void;
}

export default function CandidatePortal({
  firstParty,
  secondParty,
  setSecondParty,
  docSettings,
  isExporting,
  isCompleted,
  onExport,
  offerId,
  previewRefs,
  onIdCardRefsReady,
}: CandidatePortalProps) {
  const [activeTab, setActiveTab] = React.useState<"letter" | "idcard">("letter");

  // ID card refs — created here, shared up to page.tsx via callback
  const cardFrontRef = useRef<HTMLDivElement>(null);
  const cardBackRef  = useRef<HTMLDivElement>(null);

  // Register refs with parent once on mount
  React.useEffect(() => {
    if (onIdCardRefsReady) {
      onIdCardRefsReady(cardFrontRef, cardBackRef);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build card data from agreement fields
  const cardData: EmployeeCard = {
    fullName:   secondParty.fullName   || "",
    position:   secondParty.position   || "",
    employeeId: secondParty.partnerId  || "",
    bloodGroup: secondParty.bloodGroup || "A+",
    department: "",
    photoUrl:   (secondParty as unknown as Record<string, string>).photoUrl || "",
    issueDate:  docSettings.date       || "",
    expiryDate: "",
  };

  return (
    <motion.section
      key="candidatePortal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col w-full relative h-screen"
    >
      {/* ── Tab bar ── */}
      <div className="sticky top-20 z-20 w-full flex border-b border-[#DBEAFE] bg-[#F8FAFC] px-6 shrink-0">
        {[
          { id: "letter" as const, label: "📄 Appointment Letter" },
          { id: "idcard" as const, label: "🪪 Your ID Card" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wide border-b-2 transition cursor-pointer ${
              activeTab === id
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col xl:flex-row min-h-0 overflow-hidden">
        {activeTab === "letter" ? (
          <>
            {/* Appointment letter tab — existing layout unchanged */}
            <div className="sticky top-20 h-screen shrink-0">
              <CandidateSidebar
                firstParty={firstParty}
                secondParty={secondParty}
                setSecondParty={setSecondParty}
                isExporting={isExporting}
                isCompleted={isCompleted}
                onExport={onExport}
                offerId={offerId}
              />
            </div>
            <WorkspaceCanvas
              firstParty={firstParty}
              secondParty={secondParty}
              settings={docSettings}
              previewRefs={previewRefs}
              isExporting={isExporting}
              onExport={onExport}
              isDemo={false}
            />
          </>
        ) : (
          /* ID Card tab — read-only view, refs captured for PDF generation */
          <div className="flex-1 flex items-center justify-center bg-[#1a1a2e] overflow-auto p-8">
            <div className="flex flex-col items-center gap-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono mb-2">
                Your JEVXO Employee ID Card
              </p>
              <div className="flex flex-col xl:flex-row gap-8 items-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                    Front Side
                  </span>
                  <IdCardFront data={cardData} cardRef={cardFrontRef} />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                    Back Side
                  </span>
                  <IdCardBack data={cardData} cardRef={cardBackRef} />
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">
                This ID card will be emailed to you once you sign the appointment letter.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
