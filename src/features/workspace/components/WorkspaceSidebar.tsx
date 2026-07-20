"use client";

import React from "react";
import { Settings, User, BookOpen, Mail, RefreshCw } from "lucide-react";
import { FirstParty, SecondParty, DocSettings, AgreementTemplate, SalesAgreementType } from "@/types";
import { SettingsTab, InternshipSettingsTab, SalesSettingsTab } from "./sidebar/SettingsTab";
import { FirstPartyTab, SecondPartyTab, SalesPartyTab } from "./sidebar/PartiesTab";

// ─── Main sidebar tabs configuration ─────────────────────────────────────────
const PARTNER_TABS = [
  { id: "settings", label: "Agreement Cl.", icon: Settings },
  { id: "secondParty", label: "2nd Party (You)", icon: User },
  { id: "firstParty", label: "1st Party (Jevxo)", icon: BookOpen },
];

const INTERN_TABS = [
  { id: "settings", label: "Offer Terms", icon: Settings },
  { id: "secondParty", label: "Intern Details", icon: User },
  { id: "firstParty", label: "Company Info", icon: BookOpen },
];

const SALES_TABS = [
  { id: "settings", label: "Sales Terms", icon: Settings },
  { id: "secondParty", label: "Parties", icon: User },
  { id: "firstParty", label: "JEVXO Approval", icon: BookOpen },
];

interface WorkspaceSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
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
  onSendOffer: () => void;
  isOpeningModal?: boolean;
  agreementTemplate?: AgreementTemplate;
  salesAgreementType?: SalesAgreementType;
}

export default function WorkspaceSidebar({
  activeTab,
  setActiveTab,
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
  onSendOffer,
  isOpeningModal = false,
  agreementTemplate,
  salesAgreementType,
}: WorkspaceSidebarProps) {
  const isInternship = agreementTemplate === "internship";
  const isSalesAgreement = salesAgreementType === "countrySales" || salesAgreementType === "salesAgent";

  return (
    <div className="w-full xl:w-[500px] bg-[#F8FAFC] border-b xl:border-b-0 xl:border-r border-[#DBEAFE] flex flex-col xl:h-full overflow-hidden shrink-0">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <span className={`text-[10px] border font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block ${isInternship ? "bg-[#F0F9FF] border-[#BAE6FD] text-[#0EA5E9]" : "bg-[#EFF6FF] border-[#DBEAFE]/50 text-[#1E3A8A]"}`}>
            {isInternship ? "Internship Offer Ready!" : isSalesAgreement ? `${salesAgreementType === "countrySales" ? "Country Sales Partner" : "Sales Agent"} Agreement Ready!` : "Agreement ready!"}
          </span>
          <h2 className="text-xl font-bold text-[#0F172A]">
            Document Workspace
          </h2>
          <p className="text-[#64748B] text-xs">
            {isInternship
              ? "Adjust internship offer details with live preview."
              : isSalesAgreement
              ? "Adjust sales agreement details with a live document preview."
              : "Fine-tune standard clause parameters with real-time browser preview compilation."}
          </p>
        </div>

        {/* Tab headers */}
        <div className="flex border-b border-[#DBEAFE]">
          {(isInternship ? INTERN_TABS : isSalesAgreement ? SALES_TABS : PARTNER_TABS).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 pb-3 text-xs font-bold tracking-wide border-b-2 transition flex flex-col md:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === id
                  ? "border-[#2563EB] text-[#2563EB]"
                  : "border-transparent text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="space-y-5">
          {activeTab === "settings" && (
            isInternship ? (
              <InternshipSettingsTab docSettings={docSettings} setDocSettings={setDocSettings} />
            ) : isSalesAgreement ? (
              <SalesSettingsTab docSettings={docSettings} setDocSettings={setDocSettings} salesAgreementType={salesAgreementType!} />
            ) : (
              <SettingsTab docSettings={docSettings} setDocSettings={setDocSettings} />
            )
          )}
          {activeTab === "secondParty" && (
            isSalesAgreement ? (
              <SalesPartyTab secondParty={secondParty} setSecondParty={setSecondParty} docSettings={docSettings} setDocSettings={setDocSettings} salesAgreementType={salesAgreementType!} />
            ) : (
              <SecondPartyTab secondParty={secondParty} setSecondParty={setSecondParty} />
            )
          )}
          {activeTab === "firstParty" && (
            <FirstPartyTab firstParty={firstParty} setFirstParty={setFirstParty} />
          )}
        </div>
        {/* Export footer */}
        <div className="p-6 bg-[#F8FAFC] border-t border-[#DBEAFE] space-y-3 shrink-0">
          {isDemo ? (
            <div className="w-full py-4 px-6 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-2xl text-center">
              PDF Export Disabled in Demo Mode
            </div>
          ) : (
            <button
              onClick={onSendOffer}
              disabled={isOfferSent || isOpeningModal}
              className="w-full py-3.5 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-emerald-600 disabled:hover:bg-emerald-600 disabled:cursor-not-allowed font-bold text-white text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-md shadow-[#2563EB]/10 hover:shadow-[#2563EB]/25 cursor-pointer"
            >
              {isOpeningModal ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Opening Offer
                  Letter Modal…
                </>
              ) : isOfferSent ? (
                <>
                  <Mail className="w-4 h-4" /> Sent Offer Letter Successfully
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" /> Send Offer to Candidate
                </>
              )}
            </button>
          )}
          <div className="flex justify-between text-[11px] text-[#64748B] px-1 font-semibold">
            <span>A4 dimensions output</span>
            <span>{isDemo ? "1 page" : isInternship ? "1 page" : isSalesAgreement ? "5 pages" : "2 pages"} automatic layout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
