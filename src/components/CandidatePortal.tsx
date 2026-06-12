"use client";

import React from "react";
import { motion } from "motion/react";
import CandidateSidebar from "./CandidateSidebar";
import WorkspaceCanvas from "./WorkspaceCanvas";
import { FirstParty, SecondParty, DocSettings } from "../types";

interface CandidatePortalProps {
  firstParty: FirstParty;
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  docSettings: DocSettings;
  isExporting: boolean;
  onExport: () => void;
  offerId: string;
  previewRef1: React.RefObject<HTMLDivElement | null>;
  previewRef2: React.RefObject<HTMLDivElement | null>;
  previewRef3: React.RefObject<HTMLDivElement | null>;
}

export default function CandidatePortal({
  firstParty,
  secondParty,
  setSecondParty,
  docSettings,
  isExporting,
  onExport,
  offerId,
  previewRef1,
  previewRef2,
  previewRef3,
}: CandidatePortalProps) {
  return (
    <motion.section
      key="candidatePortal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col xl:flex-row w-full h-[calc(100vh-77px)] overflow-hidden"
    >
      <CandidateSidebar
        firstParty={firstParty}
        secondParty={secondParty}
        setSecondParty={setSecondParty}
        isExporting={isExporting}
        onExport={onExport}
        offerId={offerId}
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
        isDemo={false}
      />
    </motion.section>
  );
}
