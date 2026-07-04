"use client";

import React from "react";
import DocumentPreview from "./DocumentPreview";
import InternshipDocumentPreview from "./InternshipDocumentPreview";
import A4DocumentScaler from "./A4DocumentScaler";
import { TOTAL_DOCUMENT_PAGES } from "../lib/documentConstants";
import { FirstParty, SecondParty, DocSettings, AgreementTemplate } from "../types";

interface WorkspaceCanvasProps {
  firstParty: FirstParty;
  secondParty: SecondParty;
  settings: DocSettings;
  previewRefs: React.RefObject<HTMLDivElement | null>[];
  isExporting: boolean;
  onExport: () => void;
  isDemo: boolean;
  agreementTemplate?: AgreementTemplate;
}

export default function WorkspaceCanvas({
  firstParty,
  secondParty,
  settings,
  previewRefs,
  isExporting,
  onExport,
  isDemo,
  agreementTemplate,
}: WorkspaceCanvasProps) {
  const template = agreementTemplate ?? settings.agreementTemplate ?? "partner";
  const isInternship = template === "internship";

  return (
    <div className="flex-1 bg-[#F1F5F9] flex flex-col items-center justify-start p-6 overflow-y-auto">
      <div className="w-full max-w-[860px]">
        <A4DocumentScaler pageCount={isInternship ? 1 : TOTAL_DOCUMENT_PAGES}>
          {isInternship ? (
            <InternshipDocumentPreview
              firstParty={firstParty}
              secondParty={secondParty}
              settings={settings}
              previewRefs={previewRefs}
            />
          ) : (
            <DocumentPreview
              firstParty={firstParty}
              secondParty={secondParty}
              settings={settings}
              previewRefs={previewRefs}
              isDemo={isDemo}
              agreementTemplate={template}
            />
          )}
        </A4DocumentScaler>
      </div>
      <div className="h-10 shrink-0" />
    </div>
  );
}
