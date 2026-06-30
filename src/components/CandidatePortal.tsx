"use client";

import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import { Upload } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"letter" | "idcard">("letter");

  // Candidate's own photo — uploaded in ID card tab
  const [candidatePhotoUrl, setCandidatePhotoUrl] = useState("");

  // ID card DOM refs
  const cardFrontRef = useRef<HTMLDivElement>(null);
  const cardBackRef  = useRef<HTMLDivElement>(null);

  // Register refs with page.tsx on mount
  React.useEffect(() => {
    if (onIdCardRefsReady) {
      onIdCardRefsReady(cardFrontRef, cardBackRef);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Card data — uses candidate's uploaded photo
  const cardData: EmployeeCard = {
    fullName:   secondParty.fullName   || "",
    position:   secondParty.position   || "",
    employeeId: secondParty.partnerId  || "",
    bloodGroup: secondParty.bloodGroup || "A+",
    department: "",
    photoUrl:   candidatePhotoUrl,
    issueDate:  docSettings.date       || "",
    expiryDate: "",
  };

  // Gate: candidate must upload photo before confirming
  const handleConfirmSign = () => {
    if (!candidatePhotoUrl) {
      toast.error(
        "Please upload your photo in the ID Card tab before signing.",
        { autoClose: 5000 }
      );
      setActiveTab("idcard");
      return;
    }
    onExport();
  };

  // Photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCandidatePhotoUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
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
            {/* Red dot if photo not uploaded yet */}
            {id === "idcard" && !candidatePhotoUrl && !isCompleted && (
              <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-rose-500 align-middle" />
            )}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col xl:flex-row min-h-0 overflow-hidden">
        {activeTab === "letter" ? (
          <>
            {/* Appointment letter tab — existing layout, pass photo gate via onExport override */}
            <div className="sticky top-20 h-screen shrink-0">
              <CandidateSidebar
                firstParty={firstParty}
                secondParty={secondParty}
                setSecondParty={setSecondParty}
                isExporting={isExporting}
                isCompleted={isCompleted}
                onExport={handleConfirmSign}
                offerId={offerId}
                isPhotoUploaded={!!candidatePhotoUrl}
                onSwitchToIdCard={() => setActiveTab("idcard")}
              />
            </div>
            <WorkspaceCanvas
              firstParty={firstParty}
              secondParty={secondParty}
              settings={docSettings}
              previewRefs={previewRefs}
              isExporting={isExporting}
              onExport={handleConfirmSign}
              isDemo={false}
            />
          </>
        ) : (
          /* ID Card tab — photo upload + card preview */
          <div className="flex-1 flex flex-col items-center bg-[#1a1a2e] overflow-auto p-6 sm:p-8 gap-6">

            {/* Photo upload panel */}
            {!isCompleted && (
              <div className="w-full max-w-md bg-[#F8FAFC] rounded-2xl p-5 space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#334155] uppercase tracking-wider flex items-center gap-1.5">
                    <Upload className="w-3 h-3 text-[#2563EB]" />
                    Your Photo{" "}
                    <span className="text-rose-500 font-extrabold">* Required before signing</span>
                  </span>
                  <p className="text-[10px] text-[#64748B]">
                    Upload a professional photo without background. This will appear on your ID card.
                  </p>
                </div>
                <label className="flex flex-col items-center justify-center gap-2 h-28 border-2 border-dashed border-[#DBEAFE] hover:border-[#2563EB] rounded-xl cursor-pointer bg-white transition-all group">
                  {candidatePhotoUrl ? (
                    <img
                      src={candidatePhotoUrl}
                      alt="Your photo"
                      className="h-full w-full object-cover rounded-xl"
                    />
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-[#94A3B8] group-hover:text-[#2563EB] transition" />
                      <span className="text-xs font-medium text-[#94A3B8] group-hover:text-[#2563EB] transition">
                        Click to upload your photo
                      </span>
                      <span className="text-[10px] text-[#CBD5E1]">PNG, JPG — transparent or plain background recommended</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
                {candidatePhotoUrl && (
                  <button
                    onClick={() => setCandidatePhotoUrl("")}
                    className="text-[10px] font-semibold text-red-400 hover:text-red-600 text-right w-full transition cursor-pointer"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            )}

            {/* Card preview */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
                Your JEVXO Employee ID Card Preview
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
              {!isCompleted && (
                <p className="text-[10px] text-slate-400 mt-1 text-center max-w-sm">
                  Upload your photo above, then go to the Appointment Letter tab to sign and confirm.
                </p>
              )}
            </div>

          </div>
        )}
      </div>
    </motion.section>
  );
}
