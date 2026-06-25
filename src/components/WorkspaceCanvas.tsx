"use client";

import React from "react";
import { FileText, Download, RefreshCw } from "lucide-react";
import DocumentPreview from "./DocumentPreview";
import A4DocumentScaler from "./A4DocumentScaler";
import { TOTAL_DOCUMENT_PAGES } from "../lib/documentConstants";
import { FirstParty, SecondParty, DocSettings } from "../types";

interface WorkspaceCanvasProps {
  firstParty: FirstParty;
  secondParty: SecondParty;
  settings: DocSettings;
  previewRefs: React.RefObject<HTMLDivElement | null>[];
  isExporting: boolean;
  onExport: () => void;
  isDemo: boolean;
}

export default function WorkspaceCanvas({
  firstParty,
  secondParty,
  settings,
  previewRefs,
  isExporting,
  onExport,
  isDemo,
}: WorkspaceCanvasProps) {
  return (
    <div className="flex-1 bg-[#F1F5F9] flex flex-col items-center justify-start p-6 overflow-y-auto">
      {/* Info ribbon
      <div className="w-full max-w-[800px] flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6 p-4 bg-[#EFF6FF]/60 border border-[#DBEAFE] rounded-2xl">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 bg-[#2563EB]/10 border border-[#2563EB]/25 text-[#2563EB] mt-0.5">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0F172A]">
              Interactive A4 Contract Canvas
            </h4>
            <p className="text-[11px] text-[#334155]">
              Replicating precise corporate guidelines, diagonals, NID
              alignments, and dual-party signature modules.
            </p>
          </div>
        </div>

        {!isDemo && (
          <button
            onClick={onExport}
            disabled={isExporting}
            className="self-start md:self-auto h-9 px-4 bg-white border border-[#DBEAFE] hover:border-[#2563EB] hover:bg-[#EFF6FF] rounded-xl transition font-bold text-xs flex items-center gap-1.5 text-[#2563EB] cursor-pointer"
          >
            {isExporting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Download PDF</span>
          </button>
        )}
      </div> */}

      {/* Document pages — fixed A4 canvas scaled to viewport */}
      <div className="w-full max-w-[860px]">
        <A4DocumentScaler pageCount={TOTAL_DOCUMENT_PAGES}>
          <DocumentPreview
            firstParty={firstParty}
            secondParty={secondParty}
            settings={settings}
            previewRefs={previewRefs}
            isDemo={isDemo}
          />
        </A4DocumentScaler>
      </div>

      <div className="h-10 shrink-0" />
    </div>
  );
}
