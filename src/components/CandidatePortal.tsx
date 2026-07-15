"use client";

import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import { Upload } from "lucide-react";
import CandidateSidebar from "./CandidateSidebar";
import WorkspaceCanvas from "./WorkspaceCanvas";
import { IdCardFront, IdCardBack } from "./EmployeeIdCard";
import { FirstParty, SecondParty, DocSettings, SalesAgreementType, EmployeeCard } from "../types";

interface CandidatePortalProps {
  firstParty: FirstParty;
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
  isExporting: boolean;
  isCompleted: boolean;
  onExport: () => void;
  offerId: string;
  previewRefs: React.RefObject<HTMLDivElement | null>[];
  agreementTemplate?: string;
  salesAgreementType?: SalesAgreementType;
  onIdCardRefsReady?: (
    frontRef: React.RefObject<HTMLDivElement | null>,
    backRef: React.RefObject<HTMLDivElement | null>,
  ) => void;
}

export default function CandidatePortal({
  firstParty,
  secondParty,
  setSecondParty,
  docSettings,
  setDocSettings,
  isExporting,
  isCompleted,
  onExport,
  offerId,
  previewRefs,
  agreementTemplate,
  salesAgreementType,
  onIdCardRefsReady,
}: CandidatePortalProps) {
  const [activeTab, setActiveTab] = useState<"letter" | "idcard">("letter");
  const [candidatePhotoUrl, setCandidatePhotoUrl] = useState(
    secondParty.photoUrl || "",
  );
  const [isSavingPhotoAssets, setIsSavingPhotoAssets] = useState(false);
  const lastSavedPhotoRef = useRef<string | null>(null);

  // ── ID card refs ─────────────────────────────────────────────────────────────
  // The card components are rendered in a hidden-but-visible layer (opacity:0,
  // position:fixed at top:0/left:0) so html2canvas can fully render them at any time.
  // This is the ONLY approach that works: visibility:hidden and display:none both
  // produce black output; off-screen at -9999px also fails because html2canvas
  // uses the viewport rect to determine what to render.
  const cardFrontRef = useRef<HTMLDivElement>(null);
  const cardBackRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (onIdCardRefsReady) {
      onIdCardRefsReady(cardFrontRef, cardBackRef);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!offerId || isCompleted) return;
    if (candidatePhotoUrl === lastSavedPhotoRef.current) return;

    let cancelled = false;

    const persistCandidateAssets = async () => {
      setIsSavingPhotoAssets(true);
      try {
        // Only persist the photo URL here — the card PDF is generated and sent
        // separately via /card-pdf after the candidate confirms their signature.
        // Sending the card PDF in this call would push the payload over Vercel's
        // 4.5 MB request-body limit and cause a FUNCTION_PAYLOAD_TOO_LARGE error.
        const response = await fetch(`/api/offers/${offerId}/sign`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            photoUrl: candidatePhotoUrl,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save candidate photo.");
        }

        if (!cancelled) {
          lastSavedPhotoRef.current = candidatePhotoUrl;
        }
      } catch (error) {
        console.error("Failed to persist candidate photo assets:", error);
        if (!cancelled) {
          toast.error(
            "We could not save your ID card photo. Please upload it again.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsSavingPhotoAssets(false);
        }
      }
    };

    persistCandidateAssets();

    return () => {
      cancelled = true;
    };
  }, [candidatePhotoUrl, isCompleted, offerId]);

  const isInternship = agreementTemplate === "internship";
  const isCSP = salesAgreementType === "countrySales";
  const isSalesAgent = salesAgreementType === "salesAgent";
  const isSalesType = isCSP || isSalesAgent;
  const isPendingCSP = isSalesAgent && (!docSettings.salesPartner || !docSettings.salesPartner.signatureImg);

  // When the partner draws/saves their signature, stamp today's date into docSettings
  // so the document preview updates instantly with the correct signed date.
  const handleSignatureSaved = (hasSignature: boolean) => {
    if (isCSP || isSalesAgent) {
      setDocSettings((prev) => ({
        ...prev,
        partnerSignedDate: hasSignature
          ? new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
          : "",
      }));
    }
  };

  // Determine the correct ID label for the card front
  const idLabel: string | undefined = isInternship ? "Internee ID" : undefined;

  const cardData: EmployeeCard = {
    fullName: secondParty.fullName || "",
    position: isCSP ? "Country Sales Partner" : isSalesAgent ? "Sales Agent" : secondParty.position || "",
    // Sales types use salesPartnerId; internship/partner use partnerId
    employeeId: isSalesType
      ? (secondParty.salesPartnerId || docSettings.salesPartnerId || "")
      : (secondParty.partnerId || ""),
    bloodGroup: secondParty.bloodGroup || "Select",
    department: "",
    photoUrl: candidatePhotoUrl,
    issueDate: docSettings.date || "",
    expiryDate: isInternship ? (docSettings.internExpiryDate || "") : "",
  };


  const handleConfirmSign = () => {
    // Both internship and partner require a photo before signing
    if (!isPendingCSP && !candidatePhotoUrl) {
      toast.error(
        "Please upload your photo in the ID Card tab before signing.",
        { autoClose: 5000 },
      );
      setActiveTab("idcard");
      return;
    }
    if (isSavingPhotoAssets) {
      toast.info(
        "Your ID card photo is still being prepared. Please wait a moment and try again.",
      );
      return;
    }
    onExport();
  };

  const compressPhoto = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const maxWidth = 640;
          const maxHeight = 960;
          const scale = Math.min(
            maxWidth / img.width,
            maxHeight / img.height,
            1,
          );
          const width = Math.max(1, Math.round(img.width * scale));
          const height = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not prepare image canvas."));
            return;
          }
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = () => reject(new Error("Failed to read image."));
        img.src = typeof reader.result === "string" ? reader.result : "";
      };
      reader.onerror = () => reject(new Error("Failed to load file."));
      reader.readAsDataURL(file);
    });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressPhoto(file);
      lastSavedPhotoRef.current = null;
      setCandidatePhotoUrl(dataUrl);
      setSecondParty((prev) => ({ ...prev, photoUrl: dataUrl }));
    } catch (error) {
      console.error("Photo compression failed:", error);
      toast.error("We could not process your photo. Please try another image.");
    }
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
      {/* ── Hidden card render layer — always present so html2canvas can capture it ── */}
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
        <IdCardFront data={cardData} cardRef={cardFrontRef} idLabel={idLabel} />
        <IdCardBack data={cardData} cardRef={cardBackRef} />
      </div>

      {/* ── Tab bar ── */}
      <div className="sticky top-10 z-20 w-full flex border-b border-[#DBEAFE] bg-[#F8FAFC] px-6 shrink-0">
        {[
          {
            id: "letter" as const,
            label: isInternship
              ? "📄 Internship Offer Letter"
              : isCSP
              ? "📄 Country Sales Partner Agreement"
              : isSalesAgent
              ? "📄 Sales Agent Agreement"
              : "📄 Appointment Letter",
          },
          {
            id: "idcard" as const,
            label: isInternship
              ? "🪪 Your Internee ID Card"
              : isCSP
              ? "🪪 Your Country Sales Partner ID Card"
              : isSalesAgent
              ? "🪪 Your Sales Agent ID Card"
              : "🪪 Your ID Card",
          },
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
            <div className="sticky top-0 h-screen shrink-0">
              <CandidateSidebar
                isPendingCSP={isPendingCSP}
                firstParty={firstParty}
                secondParty={secondParty}
                setSecondParty={setSecondParty}
                isExporting={isExporting}
                isCompleted={isCompleted}
                onExport={handleConfirmSign}
                offerId={offerId}
                isPhotoUploaded={!!candidatePhotoUrl}
                onSwitchToIdCard={() => setActiveTab("idcard")}
                onSignatureSaved={handleSignatureSaved}
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
              agreementTemplate={agreementTemplate}
              salesAgreementType={salesAgreementType}
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
                    <span className="text-rose-500 font-extrabold">
                      * Required before signing
                    </span>
                  </span>
                  <p className="text-[10px] text-[#64748B]">
                    Upload a professional photo without background. This will
                    appear on your ID card.
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
                      <span className="text-[10px] text-[#CBD5E1]">
                        PNG, JPG — transparent or plain background recommended
                      </span>
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
                    onClick={() => {
                      lastSavedPhotoRef.current = null;
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
                Your JEVXO ID Card Preview
              </p>
              <div className="flex flex-col xl:flex-row gap-8 items-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                    Front Side
                  </span>
                  {/* Display-only card — uses a separate ref just for visual preview */}
                  <IdCardFront data={cardData} cardRef={React.createRef()} idLabel={idLabel} />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                    Back Side
                  </span>
                  <IdCardBack data={cardData} cardRef={React.createRef()} />
                </div>
              </div>
              {!isCompleted && (
                <p className="text-[10px] text-slate-400 mt-1 text-center max-w-sm">
                  Upload your photo above, then go to the{" "}
                  {isInternship
                    ? "Internship Offer Letter"
                    : isCSP
                    ? "Country Sales Partner Agreement"
                    : isSalesAgent
                    ? "Sales Agent Agreement"
                    : "Appointment Letter"}{" "}
                  tab to sign and confirm.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
