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
  const [candidatePhotoUrl, setCandidatePhotoUrl] = useState(secondParty.photoUrl || "");

  // ── ID card refs ─────────────────────────────────────────────────────────────
  // The card components are rendered in a hidden-but-visible layer (opacity:0,
  // position:fixed at top:0/left:0) so html2canvas can fully render them at any time.
  // This is the ONLY approach that works: visibility:hidden and display:none both
  // produce black output; off-screen at -9999px also fails because html2canvas
  // uses the viewport rect to determine what to render.
  const cardFrontRef = useRef<HTMLDivElement>(null);
  const cardBackRef  = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (onIdCardRefsReady) {
      onIdCardRefsReady(cardFrontRef, cardBackRef);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setCandidatePhotoUrl(dataUrl);
      setSecondParty((prev) => ({ ...prev, photoUrl: dataUrl }));
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
      {/* ── Hidden card render layer ─────────────────────────────────────────────
          Rendered at opacity:0 at position fixed top-0 left-0 so html2canvas sees
          a fully rendered element. Using opacity instead of visibility/display/
          off-screen because html2canvas only renders elements inside the viewport. */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          opacity: 0,
          pointerEvents: "none",
          zIndex: -10,
          display: "flex",
          gap: "40px",
        }}
      >
        <IdCardFront data={cardData} cardRef={cardFrontRef} />
        <IdCardBack  data={cardData} cardRef={cardBackRef}  />
      </div>

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
            {id === "idcard" && !candidatePhotoUrl && !isCompleted && (
              <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-rose-500 align-middle" />
            )}
          </button>
        ))}
      </div>

      {/* ── Visible tab content ── */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "letter" ? (
          <div className="h-full flex flex-col xl:flex-row">
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
          </div>
        ) : (
          <div className="h-full flex flex-col items-center bg-[#1a1a2e] overflow-auto p-6 sm:p-8 gap-6">
            {/* Photo upload */}
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
                    <img src={candidatePhotoUrl} alt="Your photo" className="h-full w-full object-cover rounded-xl" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-[#94A3B8] group-hover:text-[#2563EB] transition" />
                      <span className="text-xs font-medium text-[#94A3B8] group-hover:text-[#2563EB] transition">
                        Click to upload your photo
                      </span>
                      <span className="text-[10px] text-[#CBD5E1]">PNG, JPG — transparent or plain background recommended</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
                {candidatePhotoUrl && (
                  <button
                    onClick={() => {
                      setCandidatePhotoUrl("");
                      setSecondParty((prev) => ({ ...prev, photoUrl: "" }));
                    }}
                    className="text-[10px] font-semibold text-red-400 hover:text-red-600 text-right w-full transition cursor-pointer"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            )}

            {/* Visible card preview — separate instance for display only */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
                Your JEVXO Employee ID Card Preview
              </p>
              <div className="flex flex-col xl:flex-row gap-8 items-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">Front Side</span>
                  {/* Display-only card — uses a separate ref just for visual preview */}
                  <IdCardFront data={cardData} cardRef={React.createRef()} />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">Back Side</span>
                  <IdCardBack data={cardData} cardRef={React.createRef()} />
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
