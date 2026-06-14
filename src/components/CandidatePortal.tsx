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
}: CandidatePortalProps) {
  return (
    <motion.section
      key="candidatePortal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col xl:flex-row w-full relative h-screen"
    >
      <div className="sticky top-20 h-screen">
      <CandidateSidebar
        firstParty={firstParty}
        secondParty={secondParty}
        setSecondParty={setSecondParty}
        isExporting={isExporting}
        onExport={onExport}
        offerId={offerId}
      />
      </div>
      <WorkspaceCanvas
        firstParty={firstParty}
        secondParty={secondParty}
        settings={docSettings}
        previewRef1={previewRef1}
        previewRef2={previewRef2}
        isExporting={isExporting}
        onExport={onExport}
        isDemo={false}
      />
    </motion.section>
  );
}
