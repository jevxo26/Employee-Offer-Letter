import React from "react";
import JevxoLogo from "./JevxoLogo";
import Image from "next/image";
import QRCode from "react-qr-code";
import { FirstParty, SecondParty, DocSettings, AgreementTemplate } from "../types";
import { A4_WIDTH } from "./A4DocumentScaler";
import { buildVerifyUrl } from "../lib/verifyUrl";
import { TOTAL_DOCUMENT_PAGES } from "../lib/documentConstants";
import DocumentLayout from "./document/DocumentLayout";
import DocumentFooter from "./document/DocumentFooter";

interface DocumentPreviewProps {
  firstParty: FirstParty;
  secondParty: SecondParty;
  settings: DocSettings;
  previewRefs?: React.RefObject<HTMLDivElement | null>[];
  isDemo?: boolean;
  agreementTemplate?: AgreementTemplate;
}

function ContinuationHeader({
  documentId,
  date,
}: {
  documentId: string;
  date: string;
}) {
  return (
    <header className="flex justify-between items-start border-b border-slate-200 pb-2 mb-3 z-10">
      <span className="font-sans text-xs font-bold tracking-wider text-slate-500">
        JEVXO PARTNERSHIP DEED &amp; POLICY
      </span>
      <div className="text-right text-[10px] font-mono text-slate-400">
        Ref: {documentId} | Date: {date}
      </div>
    </header>
  );
}

export default function DocumentPreview({
  firstParty,
  secondParty,
  settings,
  previewRefs = [],
  agreementTemplate = "partner",
}: DocumentPreviewProps) {
  const safeData = {
    documentId: settings.refId || "JVX-AGR-26-0001",
    date: settings.date || new Date().toLocaleDateString(),
    companyName: firstParty.companyName || "JEVXO",
    companyRepName: firstParty.representedBy || "N/A",
    companyRepRole: firstParty.role || "Founder",
    ceoName: firstParty.ceoName || "N/A",
    ceoMobile: firstParty.ceoMobile || "+880-XXX-XXXXXX",
    companyCurrentAddress: firstParty.currentAddress || "Address not provided",
    companyMobile: firstParty.mobileNumber || "+880-XXX-XXXXXX",
    companyNid: firstParty.nidNumber || "N/A",
    partnerName: secondParty.fullName || "Partner Name",
    partnerId: secondParty.partnerId || "JVX-PT-26-001",
    partnerFatherName: secondParty.guardianName || "Father Name",
    partnerPresentAddress: secondParty.presentAddress || "Address not provided",
    partnerNid: secondParty.nidNumber || "N/A",
    partnerMobile: secondParty.mobileNumber || "+880-XXX-XXXXXX",
    partnerFatherMobile: secondParty.guardianMobile || "+880-XXX-XXXXXX",
    partnerPosition: secondParty.position || "Position",
    equityShare: settings.equityShare ? `${settings.equityShare}%` : "0%",
    minServicePeriod: settings.minimumServicePeriod
      ? `${settings.minimumServicePeriod} months`
      : "6 months",
    noticePeriodDays: settings.noticePeriod ? `${settings.noticePeriod}` : "30",
    companyEmail: firstParty.email || "info@jevxo.com",
    companyWebsite: firstParty.website || "www.jevxo.com",
    companyContact: firstParty.mobileNumber || "+880-XXX-JEVXO",
  };

  const verifyUrl = buildVerifyUrl(safeData.documentId);

  // ── Template-specific document metadata ────────────────────────────────────
  const templateMeta = {
    partner: {
      docTitle: "Letter of Appointment",
      docSubtitle: "& Partnership Agreement",
      secondPartyLabel: "Second Party (Partner)",
      secondPartyLabelColor: "text-sky-600",
      secondPartyAccent: "bg-sky-500",
      appointmentBody: (
        <>
          Dear{" "}
          <strong className="text-slate-900 text-[13.5px] font-semibold">{safeData.partnerName}</strong>, <br />
          We are pleased to formally appoint you as a{" "}
          <strong className="text-slate-900 font-semibold">{safeData.partnerPosition}</strong>{" "}
          at{" "}
          <strong className="text-slate-900 font-semibold">{safeData.companyName}</strong>{" "}
          (ID: <strong className="text-slate-900 font-semibold">{safeData.partnerId}</strong>). <br />
          Your appointment reflects our confidence in your technical abilities, professional integrity and potential contribution to the long-term growth of the company.
        </>
      ),
      responsibilitiesBody: (
        <p className="text-slate-600">
          <strong className="text-slate-800 font-medium">{safeData.companyName}</strong>{" "}
          operates under a partnership-based model. As a Partner, you are expected to demonstrate an{" "}
          <strong>ownership mindset</strong>, take responsibility and contribute actively toward the{" "}
          <strong>Company&apos;s growth</strong>, sustainability, and objectives while maintaining the highest standards of
          <strong> professionalism</strong>, integrity, accountability and ethical conduct. <br />
          The partner shall perform assigned duties and responsibilities diligently and in accordance with the Company&apos;s policies, operational requirements and strategic objectives.
        </p>
      ),
      equityLabel: "Partnership Equity",
      equityNote: "Agreed permanent equity share",
      minServiceLabel: "Minimum Service Period",
      minServiceBody: (
        <>
          To become eligible for partnership equity, you must successfully perform your responsibilities for a minimum period of{" "}
          <strong className="text-indigo-900 font-bold">{safeData.minServicePeriod}</strong>.
        </>
      ),
      equityBodyText: (
        <p>
          The allocation of the agreed{" "}
          <strong className="text-indigo-600 font-bold">{safeData.equityShare}</strong>{" "}
          equity share shall be executed through a separate legally binding agreement. This agreement will clearly define the ownership structure, rights, responsibilities, vesting conditions and all other relevant terms and conditions associated with the equity. Once granted, the equity share shall remain valid and effective subject to compliance with company policies, shareholder agreements and relevant legal terms.
        </p>
      ),
      acceptanceText: (
        <>
          I,{" "}
          <strong className="text-slate-800 font-bold">{safeData.partnerName}</strong>
          , hereby acknowledge that I have read, understood, and agreed to all the terms and conditions set forth in this Appointment Letter and Partnership Policy of{" "}
          <strong className="text-slate-800 font-bold">{safeData.companyName}</strong>
          . I further undertake to comply with and uphold all obligations, responsibilities, and policies contained herein.
        </>
      ),
    },
  } as const;

  const tpl = templateMeta.partner;

  return (
    <div
      id="document-preview-container"
      className="flex flex-col select-text"
      style={{ width: A4_WIDTH, gap: 32 }}
    >
      {/* PAGE 1 — Header, parties, QR top-right, Appointment & Responsibilities */}
      <DocumentLayout pageNum={1} refProp={previewRefs[0]}>
        <div className="z-10 flex flex-col flex-grow p-10">
          <div className="absolute top-7 md:top-8 lg:top-10 right-10 z-20 flex items-center gap-2">
            <div className="flex flex-col items-end text-right font-sans">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                Agreement Document
              </span>
              <div className="bg-slate-900 text-white text-[10px] px-2.5 py-1 font-mono font-semibold tracking-wider rounded">
                Ref: {safeData.documentId}
              </div>
              <span className="text-[11px] text-slate-600 mt-0.5 font-bold">
                Partner ID: {safeData.partnerId}
              </span>
            </div>
            <div className="bg-white p-1 border border-slate-200 rounded shadow-sm shrink-0">
              <QRCode value={verifyUrl} size={56} level="M" />
            </div>
          </div>

          <header
            id="page-header"
            className="flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-2 relative pr-44"
          >
            <div className="flex flex-col">
              <JevxoLogo />
              <div className="relative ml-3.5">
                <div className="w-12 h-0.75 absolute top-3 bg-linear-to-l from-blue-400 to-violet-400" />
                <p className="ml-16">
                  <strong> Build your Empire </strong>
                </p>
              </div>
            </div>
            <div className="absolute -bottom-[2px] left-0 w-54 h-[2px] bg-gradient-to-r from-indigo-500 to-sky-400" />
          </header>

          <div id="doc-title-container" className="text-center">
            <h1 className="font-sans font-black text-[26px] tracking-wide text-slate-900 uppercase">
              {tpl.docTitle}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-0.5">
              <div className="h-[1.5px] w-8 bg-slate-300" />
              <h2 className="font-sans text-[14px] font-bold tracking-[0.25em] text-indigo-600 uppercase">
                {tpl.docSubtitle}
              </h2>
              <div className="h-[1.5px] w-8 bg-slate-300" />
            </div>
          </div>

          <div
            id="parties-description"
            className="text-[13px] text-slate-600 leading-relaxed font-sans border-l-3 border-slate-300 pl-4 py-0.5 italic"
          >
            This Appointment Letter and Partnership Agreement is declared and
            entered into on{" "}
            <strong className="text-slate-800 font-semibold">
              {safeData.date}
            </strong>{" "}
            by and between the following parties:
          </div>

          <div id="parties-grids" className="grid grid-cols-2 gap-4 my-4">
            <div
              id="first-party-card"
              className="bg-slate-50/50 border border-slate-100 rounded-lg p-3 shadow-sm relative"
            >
              <div className="absolute top-0 left-0 w-12 h-[3px] bg-indigo-500" />
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-indigo-600 font-mono block mb-1">
                First Party (Company)
              </span>
              <h3 className="font-sans font-extrabold text-slate-900 text-[15px] mb-1.5 border-b border-slate-200/60 pb-0.5">
                {safeData.companyName}
              </h3>
              <div className="space-y-1 text-[12px]">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">Rep By:</span>
                  <span className="col-span-2 text-slate-800 font-semibold">
                    {safeData.companyRepName} ({safeData.companyRepRole})
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">NID:</span>
                  <span className="col-span-2 text-slate-700 font-mono">
                    {safeData.companyNid}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">Mobile:</span>
                  <span className="col-span-2 text-slate-700 font-mono">
                    {safeData.companyMobile}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">
                    Present CEO:
                  </span>
                  <span className="col-span-2 text-slate-800 font-semibold">
                    {safeData.ceoName}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">
                    CEO Mobile:
                  </span>
                  <span className="col-span-2 text-slate-700 font-mono">
                    {safeData.ceoMobile}
                  </span>
                </div>
                <div className="mt-1.5 border-t border-slate-200/40 pt-1.5">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                    Current Address:
                  </span>
                  <span className="text-slate-700 text-[11px] leading-tight block">
                    {safeData.companyCurrentAddress}
                  </span>
                </div>
              </div>
            </div>

            <div
              id="second-party-card"
              className="bg-slate-50/50 border border-slate-100 rounded-lg p-3 shadow-sm relative"
            >
              <div className="absolute top-0 left-0 w-12 h-[3px] bg-sky-500" />
              <span
                className={`text-[11px] uppercase tracking-wider font-extrabold font-mono block mb-1 ${tpl.secondPartyLabelColor}`}
              >
                {tpl.secondPartyLabel}
              </span>
              <h3 className="font-sans font-extrabold text-slate-900 text-[15px] mb-1.5 border-b border-slate-200/60 pb-0.5">
                {safeData.partnerName}
              </h3>
              <div className="space-y-1 text-[12px]">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">Position:</span>
                  <span className="col-span-2 text-indigo-700 font-bold">
                    {safeData.partnerPosition}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">NID:</span>
                  <span className="col-span-2 text-slate-700 font-mono">
                    {safeData.partnerNid}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">Mobile:</span>
                  <span className="col-span-2 text-slate-700 font-mono">
                    {safeData.partnerMobile}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">
                    Father Name:
                  </span>
                  <span className="col-span-2 text-slate-800 font-semibold">
                    {safeData.partnerFatherName}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">
                    Father Mob:
                  </span>
                  <span className="col-span-2 text-slate-700 font-mono">
                    {safeData.partnerFatherMobile}
                  </span>
                </div>
                <div className="mt-1.5 border-t border-slate-200/40 pt-1.5">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                    Current Address:
                  </span>
                  <span className="text-slate-700 text-[11px] leading-tight block">
                    {safeData.partnerPresentAddress}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <section id="section-appointment">
              <h4 className="font-sans font-bold text-[15px] uppercase tracking-wider text-indigo-600 mb-0.5 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-mono px-1.5 py-0.5 rounded">
                  01
                </span>
                Appointment
              </h4>
              <div className="text-[13px] text-slate-700 leading-relaxed text-justify font-sans bg-white/50 border border-slate-100 p-3 rounded-md shadow-sm">
                <p className="mb-1">{tpl.appointmentBody}</p>
              </div>
            </section>

            <section id="section-role-ownership">
              <h4 className="font-sans font-bold text-[15px] uppercase tracking-wider text-indigo-600 mb-0.5 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-mono px-1.5 py-0.5 rounded">
                  02
                </span>
                Professional Responsibilities
              </h4>
              <div className="text-[13px] text-slate-700 leading-relaxed text-justify font-sans bg-white/50 border border-slate-100 p-3 rounded-md shadow-sm">
                {tpl.responsibilitiesBody}
              </div>
            </section>

            <section id="section-equity-distribution">
              <h4 className="font-sans font-bold text-[15px] uppercase tracking-wider text-indigo-600 mb-1 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-mono px-1.5 py-0.5 rounded">
                  03
                </span>
                Equity &amp; Share Distribution
              </h4>
              <div className="grid grid-cols-3 gap-3 font-sans text-[12px] mb-2">
                <div className="bg-emerald-50/30 border border-emerald-100/60 shadow-sm rounded-md p-2.5 flex flex-col justify-center">
                  <span className="text-[11px] uppercase font-bold text-emerald-800 block mb-0.5">
                    {tpl.equityLabel}
                  </span>
                  <span className="text-xl font-black text-emerald-700 tracking-tight block">
                    {safeData.equityShare}
                  </span>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                    {tpl.equityNote}
                  </p>
                </div>
                <div className="bg-indigo-50/30 border shadow-sm border-indigo-100/60 rounded-md p-2.5 col-span-2 flex flex-col justify-center">
                  <span className="text-[11px] uppercase font-bold text-indigo-800 block mb-0.5">
                    {tpl.minServiceLabel}
                  </span>
                  <p className="text-slate-700 leading-snug">
                    {tpl.minServiceBody}
                  </p>
                </div>
              </div>
              <div className="text-[13px] text-slate-600 leading-relaxed text-justify bg-white/50 border border-slate-100 p-3 mb-3 rounded-md shadow-sm">
                {tpl.equityBodyText}
              </div>
            </section>
          </div>
        </div>

        <DocumentFooter
          pageNum={1}
          totalPages={TOTAL_DOCUMENT_PAGES}
          email={safeData.companyEmail}
          website={safeData.companyWebsite}
          address={safeData.companyCurrentAddress}
        />
      </DocumentLayout>

      {/* PAGE 3 — Section 07, Signatures & Detailed Footer */}
      <DocumentLayout pageNum={3} refProp={previewRefs[2]}>
        <div className="z-10 flex flex-col flex-grow p-10">
          <ContinuationHeader
            documentId={safeData.documentId}
            date={safeData.date}
          />

          <div className="space-y-5">
            <section id="section-place-of-work">
              <h4 className="font-sans font-bold text-[15px] uppercase tracking-wider text-indigo-600 mb-1 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-mono px-1.5 py-0.5 rounded">
                  04
                </span>
                Work Arrangement & Remote Work Policy
              </h4>
              <div className="text-[13px] text-slate-700 leading-relaxed text-justify font-sans bg-white/50 border border-slate-100 p-3 rounded-md shadow-sm">
                <p>
                  At present, all duties and responsibilities under this
                  Agreement shall be performed on a remote basis. The Partner
                  shall dedicate a minimum of{" "}
                  <strong> six (6) productive working hours </strong>
                  per business day under a flexible work schedule, ensuring
                  timely completion of assigned responsibilities, regular
                  communication and attendance at scheduled meetings. The
                  Company reserves the right to transition operations to a
                  physical office environment upon reaching a sustainable and
                  profitable stage, with prior official written notice.
                </p>
              </div>
            </section>

            <section id="section-confidentiality-nda">
              <h4 className="font-sans font-bold text-[15px] uppercase tracking-wider text-indigo-600 mb-1 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-mono px-1.5 py-0.5 rounded">
                  05
                </span>
                Confidentiality &amp; Non-Disclosure Agreement (NDA)
              </h4>
              <div className="text-[13px] text-slate-700 leading-relaxed text-justify font-sans bg-white/50 border border-slate-100 p-3 rounded-md shadow-sm">
                <p>
                  All company-related information, including source code, client
                  data, business strategies, financial info, intellectual
                  property and future plans, shall be treated as strictly
                  confidential. The Partner agrees not to disclose, share, or
                  misuse any confidential information during or after the course
                  of engagement.
                  <br /> Any unauthorized disclosure or misuse of confidential
                  info shall be considered a material breach of this agreement
                  and may result in legal action, claims for damages and other
                  remedies available under applicable law.
                </p>
              </div>
            </section>

            <section id="section-intellectual-property">
              <h4 className="font-sans font-bold text-[15px] uppercase tracking-wider text-indigo-600 mb-1 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-mono px-1.5 py-0.5 rounded">
                  06
                </span>
                Intellectual Property Ownership
              </h4>
              <div className="text-[13px] text-slate-700 leading-relaxed text-justify font-sans bg-white/50 border border-slate-100 p-3 rounded-md shadow-sm">
                <p>
                  All source code, software applications, designs, systems,
                  documents, inventions, work products, databases and other
                  intellectual property developed by the Partner in connection
                  with Company activities shall remain the exclusive property of{" "}
                  <strong className="font-bold">{safeData.companyName}</strong>{" "}
                  unless otherwise agreed in writing.
                </p>
              </div>
            </section>
            <section id="section-termination-resignation">
              <h4 className="font-sans font-bold text-[15px] uppercase tracking-wider text-indigo-600 mb-1 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-mono px-1.5 py-0.5 rounded">
                  07
                </span>
                Termination &amp; Resignation Policy
              </h4>
              <div className="text-[13px] text-slate-700 leading-relaxed text-justify font-sans bg-white/50 border border-slate-100 p-3 rounded-md shadow-sm">
                <p>
                  Either Party may terminate this agreement by providing the
                  other Party with a minimum of{" "}
                  <strong className="text-indigo-600 font-bold">
                    {safeData.noticePeriodDays} days&apos;
                  </strong>{" "}
                  written notice. <br /> The Company reserves the right to
                  implement
                  <strong> immediate termination</strong> in cases involving
                  fraud, misconduct, breach of confidentiality, gross
                  negligence, unethical behavior, violation of company policies
                  or any action that causes significant harm to the Company's
                  interests, reputation or operations. <br />
                  Upon termination, both Parties shall fulfill any outstanding
                  obligations and return any Company-owned property, documents,
                  credentials or confidential information in their possession.
                </p>
              </div>
            </section>

            <section
              id="signatures-acceptance"
              className="pt-3 border-t border-slate-200"
            >
              <h4 className="font-sans font-bold text-indigo-700 text-[16px] uppercase tracking-wider mb-2">
                Acceptance &amp; Executory Signatures
              </h4>
              <p className="text-[13px] text-slate-600 leading-relaxed font-sans bg-white/50 p-3 rounded-md border border-slate-100 shadow-sm text-justify">
                {tpl.acceptanceText}
              </p>

              <div className="grid grid-cols-2 gap-12 pt-6 font-sans text-[13px]">
                <div className="flex flex-col">
                  <div className="relative mt-4 pt-2 font-semibold text-slate-800 text-center">
                    <div className="absolute -top-10 left-25 h-12 w-48 flex items-end justify-start pointer-events-none select-none">
                      {secondParty.signatureImg ? (
                        <Image
                          height={50}
                          width={100}
                          src={secondParty.signatureImg}
                          alt="Second Party Signature"
                          className="max-h-11 max-w-[170px] object-contain block opacity-95"
                        />
                      ) : (
                        <div className="text-amber-600 font-bold tracking-wide animate-pulse text-[8.5px] bg-amber-50 px-2 py-0.5 border border-amber-200 rounded uppercase">
                          Awaiting Partner Sign *
                        </div>
                      )}
                    </div>
                    ...................................................................................
                  </div>
                  <div className="text-center font-bold text-slate-900 mt-1">
                    {safeData.partnerName}
                  </div>
                  <div className="text-[11px] text-slate-500 text-center">
                    Partner (Second Party)
                  </div>
                  <div className="text-[10px] text-slate-400 text-center mt-2">
                    Date: {secondParty.signatureImg ? safeData.date : ""}
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="relative mt-4 pt-2 font-semibold text-slate-800 text-center">
                    <div className="absolute -top-10 left-0 right-0 h-12 flex items-end justify-center pointer-events-none select-none">
                      {firstParty.signatureImg ? (
                        <Image
                          height={50}
                          width={100}
                          src={firstParty.signatureImg}
                          alt="Founder Signature"
                          className="max-h-11 max-w-[170px] object-contain block opacity-95"
                        />
                      ) : null}
                    </div>
                    ...................................................................................
                  </div>
                  <div className="text-center font-bold text-slate-900 mt-1">
                    {safeData.companyRepName}
                  </div>
                  <div className="text-[11px] text-slate-500 text-center">
                    {safeData.companyRepRole}, {safeData.companyName}
                  </div>
                  <div className="text-[10px] text-slate-400 text-center my-2">
                    Date: {safeData.date}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <footer
          id="page-3-footer"
          className="mt-auto pt-1 border-t border-slate-900 text-[13px] text-slate-500 font-mono flex flex-col gap-1.5 z-10 pb-7"
        >
          <div className="flex justify-between items-center text-slate-400 py-0.5 border-b border-slate-100">
            <span>
              Generated by:{" "}
              <strong className="text-indigo-600">
                HR Document Engine by JEVXO
              </strong>
            </span>
            <span>
              Page {TOTAL_DOCUMENT_PAGES} of {TOTAL_DOCUMENT_PAGES}
            </span>
          </div>
          <div className="flex flex-row justify-center items-center gap-1 text-[11px] text-slate-500">
            <div className="flex gap-5">
              <span>
                Email:{" "}
                <strong className="text-slate-700 font-semibold">
                  {safeData.companyEmail}
                </strong>
              </span>
              <span>•</span>
              <span className="font-semibold">
                {safeData.companyCurrentAddress}
              </span>
              <span>•</span>
              <span>
                Web:{" "}
                <strong className="text-slate-700 font-semibold">
                  {safeData.companyWebsite}
                </strong>
              </span>
            </div>
          </div>
        </footer>
      </DocumentLayout>
    </div>
  );
}
