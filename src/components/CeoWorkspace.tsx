"use client";

import React from "react";
import { motion } from "motion/react";
import WorkspaceSidebar from "./WorkspaceSidebar";
import WorkspaceCanvas from "./WorkspaceCanvas";
import IdCardWorkspace, { buildIdCardPdfBase64 } from "./IdCardWorkspace";
import { IdCardFront, IdCardBack } from "./EmployeeIdCard";
import {
  FirstParty,
  SecondParty,
  DocSettings,
  DocType,
  AgreementTemplate,
  EmployeeCard,
} from "../types";

interface CeoWorkspaceProps {
  activeWorkspaceTab: string;
  setActiveWorkspaceTab: (tab: string) => void;
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  firstParty: FirstParty;
  setFirstParty: React.Dispatch<React.SetStateAction<FirstParty>>;
  isExporting: boolean;
  onExport: () => void;
  isDemo: boolean;
  isOfferSent: boolean;
  isOpeningModal?: boolean;
  onSendOffer: (options?: { cardPDFdata?: string }) => Promise<void> | void;
  previewRefs: React.RefObject<HTMLDivElement | null>[];
  docType: DocType;
  agreementTemplate?: AgreementTemplate;
  employeeCard: EmployeeCard;
  setEmployeeCard: React.Dispatch<React.SetStateAction<EmployeeCard>>;
}

export default function CeoWorkspace({
  activeWorkspaceTab,
  setActiveWorkspaceTab,
  docSettings,
  setDocSettings,
  secondParty,
  setSecondParty,
  firstParty,
  setFirstParty,
  isExporting,
  onExport,
  isDemo,
  isOfferSent,
  isOpeningModal = false,
  onSendOffer,
  previewRefs,
  docType,
  agreementTemplate,
  employeeCard,
  setEmployeeCard,
}: CeoWorkspaceProps) {
  const hiddenCardFrontRef = React.useRef<HTMLDivElement>(null);
  const hiddenCardBackRef = React.useRef<HTMLDivElement>(null);

  const founderCardData = React.useMemo(
    () => ({
      fullName: secondParty.fullName,
      position: secondParty.position,
      bloodGroup: secondParty.bloodGroup || "Select",
      employeeId: secondParty.partnerId || employeeCard.employeeId,
      department: employeeCard.department,
      photoUrl: employeeCard.photoUrl,
      issueDate: docSettings.date || employeeCard.issueDate,
      expiryDate: employeeCard.expiryDate,
    }),
    [docSettings.date, employeeCard, secondParty],
  );

  const handleSendOffer = async () => {
    if (docType === "both") {
      let cardPDFdata = "";
      if (hiddenCardFrontRef.current && hiddenCardBackRef.current) {
        try {
          cardPDFdata = await buildIdCardPdfBase64(
            hiddenCardFrontRef.current,
            hiddenCardBackRef.current,
          );
        } catch (error) {
          console.warn(
            "Founder ID card pre-generation failed, continuing without cached PDF.",
            error,
          );
        }
      }

      await onSendOffer({ cardPDFdata });
      return;
    }

    await onSendOffer();
  };

  // ── "both" mode: tabbed view ──────────────────────────────────────────────
  if (docType === "both") {
    const isIdCardTab = activeWorkspaceTab === "idCard";

    return (
      <motion.section
        key="workspace"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col w-full relative h-screen"
      >
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            opacity: 0,
            pointerEvents: "none",
            zIndex: 0,
            display: "flex",
            gap: "40px",
          }}
        >
          <IdCardFront data={founderCardData} cardRef={hiddenCardFrontRef} />
          <IdCardBack data={founderCardData} cardRef={hiddenCardBackRef} />
        </div>

        {/* Tab bar */}
        <div className="sticky top-15 z-20 w-full flex border-b border-[#DBEAFE] bg-[#F8FAFC] px-6">
          {[
            { id: "settings", label: "📄 Appointment Docs" },
            { id: "idCard", label: "🪪 Partner ID Card" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveWorkspaceTab(id)}
              className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wide border-b-2 transition cursor-pointer ${
                activeWorkspaceTab === id
                  ? "border-[#2563EB] text-[#2563EB]"
                  : "border-transparent text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex relative min-h-0 overflow-visible">
          {!isIdCardTab ? (
            <>
              <div className="sticky top-30 h-screen">
                <div className="h-[calc(100vh-50px)] overflow-y-auto pr-2">
                  <WorkspaceSidebar
                    activeTab={activeWorkspaceTab}
                    setActiveTab={setActiveWorkspaceTab}
                    docSettings={docSettings}
                    setDocSettings={setDocSettings}
                    secondParty={secondParty}
                    setSecondParty={setSecondParty}
                    firstParty={firstParty}
                    setFirstParty={setFirstParty}
                    isExporting={isExporting}
                    onExport={onExport}
                    isDemo={isDemo}
                    isOfferSent={isOfferSent}
                    isOpeningModal={isOpeningModal}
                    onSendOffer={handleSendOffer}
                  />
                </div>
              </div>
              <WorkspaceCanvas
                firstParty={firstParty}
                secondParty={secondParty}
                settings={docSettings}
                previewRefs={previewRefs}
                isExporting={isExporting}
                onExport={onExport}
                isDemo={isDemo}
                agreementTemplate={agreementTemplate}
              />
            </>
          ) : (
            <IdCardWorkspace
              initialData={{
                fullName: secondParty.fullName,
                position: secondParty.position,
                bloodGroup: secondParty.bloodGroup,
                employeeId: secondParty.partnerId || employeeCard.employeeId,
                issueDate: docSettings.date || employeeCard.issueDate,
                expiryDate: employeeCard.expiryDate,
              }}
              controlledPhotoUrl={employeeCard.photoUrl}
              onPhotoChange={(dataUrl) =>
                setEmployeeCard((p) => ({ ...p, photoUrl: dataUrl }))
              }
              hidePhotoUpload
            />
          )}
        </div>
      </motion.section>
    );
  }

  // ── Appointment-only mode ─────────────────────────────────────────────────
  return (
    <motion.section
      key="workspace"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 relative h-screen flex flex-col xl:flex-row w-full"
    >
      <div className="sticky top-15 h-screen">
        <WorkspaceSidebar
          activeTab={activeWorkspaceTab}
          setActiveTab={setActiveWorkspaceTab}
          docSettings={docSettings}
          setDocSettings={setDocSettings}
          secondParty={secondParty}
          setSecondParty={setSecondParty}
          firstParty={firstParty}
          setFirstParty={setFirstParty}
          isExporting={isExporting}
          onExport={onExport}
          isDemo={isDemo}
          isOfferSent={isOfferSent}
          isOpeningModal={isOpeningModal}
          onSendOffer={onSendOffer}
        />
      </div>
      <WorkspaceCanvas
        firstParty={firstParty}
        secondParty={secondParty}
        settings={docSettings}
        previewRefs={previewRefs}
        isExporting={isExporting}
        onExport={onExport}
        isDemo={isDemo}
        agreementTemplate={agreementTemplate}
      />
    </motion.section>
  );
}
