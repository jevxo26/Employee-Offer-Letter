"use client";

import React from "react";
import { motion } from "motion/react";
import WorkspaceSidebar from "./WorkspaceSidebar";
import WorkspaceCanvas from "./WorkspaceCanvas";
import IdCardWorkspace from "./IdCardWorkspace";
import { FirstParty, SecondParty, DocSettings, DocType, EmployeeCard } from "../types";

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
  onSendOffer: () => void;
  previewRef1: React.RefObject<HTMLDivElement | null>;
  previewRef2: React.RefObject<HTMLDivElement | null>;
  previewRef3: React.RefObject<HTMLDivElement | null>;
  previewRef4: React.RefObject<HTMLDivElement | null>;
  previewRef5: React.RefObject<HTMLDivElement | null>;
  docType: DocType;
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
  onSendOffer,
  previewRef1,
  previewRef2,
  previewRef3,
  previewRef4,
  previewRef5,
  docType,
  employeeCard,
  setEmployeeCard,
}: CeoWorkspaceProps) {
  // "both" mode: show tabbed view with Documents + ID Card tabs
  if (docType === "both") {
    const isIdCardTab = activeWorkspaceTab === "idCard";
    return (
      <motion.section
        key="workspace"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col w-full h-[calc(100vh-77px)] overflow-hidden"
      >
        {/* Tab bar */}
        <div className="flex border-b border-[#DBEAFE] bg-[#F8FAFC] px-6 gap-0">
          {[
            { id: "settings", label: "📄 Appointment Docs" },
            { id: "idCard", label: "🪪 Employee ID Card" },
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
        <div className="flex-1 flex overflow-hidden">
          {!isIdCardTab ? (
            <>
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
                onSendOffer={onSendOffer}
              />
              <WorkspaceCanvas
                firstParty={firstParty}
                secondParty={secondParty}
                settings={docSettings}
                previewRef1={previewRef1}
                previewRef2={previewRef2}
                previewRef3={previewRef3}
                previewRef4={previewRef4}
                previewRef5={previewRef5}
                isExporting={isExporting}
                onExport={onExport}
                isDemo={isDemo}
              />
            </>
          ) : (
            <IdCardWorkspace
              initialData={{
                fullName: secondParty.fullName,
                position: secondParty.position,
                bloodGroup: secondParty.bloodGroup,
                employeeId: employeeCard.employeeId,
                issueDate: employeeCard.issueDate,
                expiryDate: employeeCard.expiryDate,
              }}
              onSendEmail={() => {}}
            />
          )}
        </div>
      </motion.section>
    );
  }

  // Default: appointment only
  return (
    <motion.section
      key="workspace"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col xl:flex-row w-full h-[calc(100vh-77px)] overflow-hidden"
    >
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
        onSendOffer={onSendOffer}
      />
      <WorkspaceCanvas
        firstParty={firstParty}
        secondParty={secondParty}
        settings={docSettings}
        previewRef1={previewRef1}
        previewRef2={previewRef2}
        previewRef3={previewRef3}
        previewRef4={previewRef4}
        previewRef5={previewRef5}
        isExporting={isExporting}
        onExport={onExport}
        isDemo={isDemo}
      />
    </motion.section>
  );
}
