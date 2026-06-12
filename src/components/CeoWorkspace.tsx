"use client";

import React from "react";
import { motion } from "motion/react";
import WorkspaceSidebar from "./WorkspaceSidebar";
import WorkspaceCanvas from "./WorkspaceCanvas";
import { FirstParty, SecondParty, DocSettings } from "../types";

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
}: CeoWorkspaceProps) {
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
        isExporting={isExporting}
        onExport={onExport}
        isDemo={isDemo}
      />
    </motion.section>
  );
}
