"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Loader2, FileText, CreditCard } from "lucide-react";
import {
  FirstParty,
  SecondParty,
  DocSettings,
  AgreementTemplate,
  SalesAgreementType,
} from "@/types";
import A4DocumentScaler from "@/features/document-preview/components/A4DocumentScaler";
import DocumentPreview from "@/features/document-preview/components/DocumentPreview";
import InternshipDocumentPreview from "@/features/document-preview/components/InternshipDocumentPreview";
import SalesAgreementDocument from "@/features/document-preview/templates/document/SalesAgreementDocument";
import IdCardWorkspace from "@/features/id-card/components/IdCardWorkspace";

type PreviewTab = "agreement" | "idCard";

interface Props {
  agreementId: string | null;
  onClose: () => void;
}

export default function PreviewModal({ agreementId, onClose }: Props) {
  const [firstParty, setFirstParty] = useState<FirstParty | null>(null);
  const [secondParty, setSecondParty] = useState<SecondParty | null>(null);
  const [docSettings, setDocSettings] = useState<DocSettings | null>(null);
  const [agreementTemplate, setAgreementTemplate] =
    useState<AgreementTemplate>("partner");
  const [salesAgreementType, setSalesAgreementType] = useState<
    SalesAgreementType | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<PreviewTab>("agreement");

  // Dummy refs — preview is view-only, no PDF capture needed
  const dummyRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  useEffect(() => {
    if (!agreementId) return;
    setFirstParty(null);
    setSecondParty(null);
    setDocSettings(null);
    setError("");
    setTab("agreement");
    setLoading(true);

    fetch(`/api/offers/${encodeURIComponent(agreementId)}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load agreement.");
        return r.json();
      })
      .then((data) => {
        setFirstParty(data.firstParty);
        setSecondParty(data.secondParty);
        setDocSettings(data.docSettings);
        setAgreementTemplate(
          (data.docSettings?.agreementTemplate as AgreementTemplate) ||
            "partner",
        );
        const salesType = data.docSettings
          ?.salesAgreementType as SalesAgreementType | undefined;
        setSalesAgreementType(salesType || undefined);
      })
      .catch((e: unknown) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [agreementId]);

  if (!agreementId) return null;

  const isSales = Boolean(salesAgreementType);
  const isInternship = agreementTemplate === "internship" && !isSales;

  // Count pages for scaler
  const pageCount = (() => {
    if (salesAgreementType === "countrySales") return 5;
    if (salesAgreementType === "salesAgent") return 3;
    if (isInternship) return 2;
    return 3; // standard partner
  })();

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DBEAFE] shrink-0">
          <div>
            <h2 className="font-bold text-[#0F172A] text-base">
              Document Preview
            </h2>
            <p className="text-[11px] text-[#64748B] font-mono mt-0.5">
              {agreementId}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Tab toggles */}
            {!loading && firstParty && (
              <>
                <button
                  onClick={() => setTab("agreement")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    tab === "agreement"
                      ? "bg-[#2563EB] text-white border-[#2563EB]"
                      : "bg-white border-[#DBEAFE] text-[#64748B] hover:border-[#2563EB]"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Agreement
                </button>
                <button
                  onClick={() => setTab("idCard")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    tab === "idCard"
                      ? "bg-[#2563EB] text-white border-[#2563EB]"
                      : "bg-white border-[#DBEAFE] text-[#64748B] hover:border-[#2563EB]"
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" /> ID Card
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-4 py-4">
          {loading && (
            <div className="flex justify-center py-16">
              <Loader2 className="w-7 h-7 animate-spin text-[#2563EB]" />
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
              {error}
            </div>
          )}

          {!loading && firstParty && secondParty && docSettings && (
            <>
              {tab === "agreement" && (
                <A4DocumentScaler pageCount={pageCount}>
                  {isSales ? (
                    <SalesAgreementDocument
                      docType={salesAgreementType!}
                      firstParty={firstParty}
                      secondParty={secondParty}
                      settings={docSettings}
                      previewRefs={dummyRefs}
                    />
                  ) : isInternship ? (
                    <InternshipDocumentPreview
                      firstParty={firstParty}
                      secondParty={secondParty}
                      settings={docSettings}
                      previewRefs={dummyRefs}
                    />
                  ) : (
                    <DocumentPreview
                      firstParty={firstParty}
                      secondParty={secondParty}
                      settings={docSettings}
                      previewRefs={dummyRefs}
                      agreementTemplate={agreementTemplate}
                    />
                  )}
                </A4DocumentScaler>
              )}

              {tab === "idCard" && (
                <div className="max-w-lg mx-auto">
                  <IdCardWorkspace
                    initialData={{
                      fullName: secondParty.fullName || "",
                      position:
                        salesAgreementType === "countrySales"
                          ? "Country Sales Partner"
                          : salesAgreementType === "salesAgent"
                            ? "Sales Agent"
                            : secondParty.position || "",
                      bloodGroup: secondParty.bloodGroup || "Select",
                      employeeId:
                        secondParty.salesPartnerId ||
                        secondParty.partnerId ||
                        docSettings.salesPartnerId ||
                        docSettings.refId ||
                        "",
                      issueDate: docSettings.date || "",
                      expiryDate:
                        docSettings.salesExpiryDate ||
                        docSettings.internExpiryDate ||
                        "",
                    }}
                    controlledPhotoUrl={secondParty.photoUrl || ""}
                    hidePhotoUpload
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
