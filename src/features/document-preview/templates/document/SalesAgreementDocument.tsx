"use client";
import React from "react";
import {
  FirstParty,
  SecondParty,
  DocSettings,
  SalesAgreementType,
} from "@/types";
import { A4_WIDTH } from "../../components/A4DocumentScaler";
import { buildVerifyUrl } from "@/lib/verifyUrl";
import DocumentLayout from "./DocumentLayout";
import DocumentHeader from "./DocumentHeader";
import DocumentMetadata from "./DocumentMetadata";
import DocumentFooter from "./DocumentFooter";
import SignatureSection from "./SignatureSection";

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface SalesAgreementDocumentProps {
  docType: SalesAgreementType; // 'countrySales' | 'salesAgent'
  firstParty: FirstParty;
  secondParty: SecondParty;
  settings: DocSettings;
  previewRefs?: React.RefObject<HTMLDivElement | null>[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helper components
// ─────────────────────────────────────────────────────────────────────────────

function Section({
  num,
  title,
  children,
  hidden = false,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
  hidden?: boolean;
}) {
  return (
    <section className={hidden ? "hidden" : "mb-4"}>
      <h4 className="font-sans font-bold text-[14px] uppercase tracking-wider text-indigo-600 mb-1.5 flex items-center gap-2">
        <span className="bg-indigo-100 text-indigo-800 text-[10px] font-mono px-1.5 py-0.5 rounded">
          {num}
        </span>
        {title}
      </h4>
      <div className="text-[12.5px] text-slate-700 leading-relaxed text-justify font-sans bg-white/50 border border-slate-100 p-3 rounded-md shadow-sm">
        {children}
      </div>
    </section>
  );
}

function V({ children }: { children: React.ReactNode }) {
  return <span className="text-[#594ED7] font-bold">{children}</span>;
}

function FieldTable({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <table className="w-full text-[11.5px] border-collapse mt-2 font-sans">
      <thead>
        <tr className="bg-slate-100">
          <th className="border border-slate-200 px-2 py-1 text-left font-bold text-slate-600 w-1/3">
            Field
          </th>
          <th className="border border-slate-200 px-2 py-1 text-left font-bold text-slate-600">
            Details
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([field, detail]) => (
          <tr key={field} className="even:bg-slate-50/50">
            <td className="border border-slate-200 px-2 py-1 font-medium text-slate-500">
              {field}
            </td>
            <td className="border border-slate-200 px-2 py-1 text-slate-800">
              {detail || "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CommissionTable({ rows }: { rows: [string, React.ReactNode, string][] }) {
  return (
    <table className="w-full text-[11.5px] border-collapse mt-2 mb-2 font-sans">
      <thead>
        <tr className="bg-emerald-50">
          <th className="border border-emerald-100 px-2 py-1.5 text-left font-bold text-emerald-700">
            Commission Type
          </th>
          <th className="border border-emerald-100 px-2 py-1.5 text-left font-bold text-emerald-700 w-16 whitespace-nowrap">
            Rate
          </th>
          <th className="border border-emerald-100 px-2 py-1.5 text-left font-bold text-emerald-700">
            Applied To
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([type, rate, applied]) => (
          <tr key={type} className="even:bg-slate-50/50">
            <td className="border border-slate-200 px-2 py-1 font-medium text-slate-700">
              {type}
            </td>
            <td className="border border-slate-200 px-2 py-1 text-center font-bold text-emerald-700">
              {rate}
            </td>
            <td className="border border-slate-200 px-2 py-1 text-slate-600 text-[11px]">
              {applied}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── Parties cards — mirrors DocumentPreview design exactly ──────────────────
function PartiesBlock({
  firstPartyName,
  firstPartyRep,
  ceoName,
  firstPartyHR,
  firstPartyHRcontact,
  firstPartyAddress,
  firstPartyEmail,
  partnerName,
  partnerContact,
  partnerNationality,
  partnerDob,
  partnerPassport,
  partnerEmail,
  partnerId,
  salesRefId,
  partnerAddress,
  territory,
  date,
}: {
  firstPartyName: string;
  firstPartyRep: string;
  ceoName: string,
  firstPartyHR: string,
  firstPartyHRcontact: string,
  firstPartyAddress: string;
  firstPartyEmail: string;
  partnerName: string;
  partnerContact: string;
  partnerNationality: string;
  partnerDob: string;
  partnerPassport: string;
  partnerEmail: string;
  partnerId: string;
  salesRefId: string;
  partnerAddress: string;
  territory: string;
  date: string;
}) {
  return (
    <div className="mb-4">
      <p className="text-[12.5px] text-slate-600 leading-relaxed font-sans border-l-[3px] border-slate-300 pl-3 py-0.5 italic mb-3">
        This Country Sales Partnership Agreement is declared and entered into on{" "}
        <strong className="text-slate-800 font-semibold">{date}</strong>{" "}
        by and between the following parties:
      </p>
      <div className="grid grid-cols-2 gap-4">
        {/* First Party */}
        <div className="bg-slate-50/50 border border-slate-100 rounded-lg p-3 shadow-sm relative">
          <div className="absolute top-0 left-0 w-12 h-[3px] bg-indigo-500 rounded-tl-lg" />
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-indigo-600 font-mono block mb-1">
            First Party (Company)
          </span>
          <h3 className="font-sans font-extrabold text-slate-900 text-[15px] mb-1.5 border-b border-slate-200/60 pb-0.5">
            {firstPartyName}
          </h3>
          <div className="space-y-1 text-[12px]">
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-400 font-medium">Rep By (CEO):</span>
              <span className="col-span-2 text-slate-800 font-bold">
                {ceoName}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-400 font-medium">Founder:</span>
              <span className="col-span-2 text-slate-700 font-medium">
                {firstPartyRep}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-400 font-medium">HR:</span>
              <span className="col-span-2 text-slate-700 font-mono">{firstPartyHR}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-400 font-medium">HR Contact:</span>
              <span className="col-span-2 text-slate-700 font-mono">{firstPartyHRcontact}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-400 font-medium">Email:</span>
              <span className="col-span-2 text-slate-700 font-mono">{firstPartyEmail}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-400 font-medium">Reference ID:</span>
              <span className="col-span-2 text-slate-700 font-mono font-semibold">{salesRefId}</span>
            </div>
          </div>
        </div>

        {/* Second Party */}
        <div className="bg-slate-50/50 border border-slate-100 rounded-lg p-3 shadow-sm relative">
          <div className="absolute top-0 left-0 w-12 h-[3px] bg-sky-500 rounded-tl-lg" />
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-sky-600 font-mono block mb-1">
            Second Party (Country Sales Partner)
          </span>
          <h3 className="font-sans font-extrabold text-slate-900 text-[15px] mb-1.5 border-b border-slate-200/60 pb-0.5">
            {partnerName}
          </h3>
          <div className="space-y-1 text-[12px]">
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-400 font-medium">Partner ID:</span>
              <span className="col-span-2 text-indigo-700 font-bold">{partnerId || "JVX-PT-26-014"}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-400 font-medium">Territory:</span>
              <span className="col-span-2 text-slate-800 font-semibold">{territory}</span>
            </div>
            {/* <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-400 font-medium">Email:</span>
              <span className="col-span-2 text-slate-700 font-mono">{partnerEmail}</span>
            </div> */}
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-400 font-medium">Contact:</span>
              <span className="col-span-2 text-slate-700 font-mono">{partnerContact}</span>
            </div>
            {partnerPassport && (
              <div className="grid grid-cols-3 gap-1">
                <span className="text-slate-400 font-medium">NID / Passport:</span>
                <span className="col-span-2 text-slate-700 font-mono">{partnerPassport}</span>
              </div>
            )}
            {partnerDob && (
              <div className="grid grid-cols-3 gap-1">
                <span className="text-slate-400 font-medium">Date of Birth:</span>
                <span className="col-span-2 text-slate-700 font-mono">{partnerDob}</span>
              </div>
            )}
            <div className="mt-1.5 border-t border-slate-200/40 pt-1.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                Partner Address:
              </span>
              <span className="text-slate-700 text-[11px] leading-tight block">
                {partnerAddress}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContinuationHeader({
  refId,
  date,
  title,
}: {
  refId: string;
  date: string;
  title: string;
}) {
  return (
    <header className="flex justify-between items-start border-b border-slate-200 pb-2 mb-3 z-10">
      <span className="font-sans text-xs font-bold tracking-wider text-slate-500 uppercase">
        {title}
      </span>
      <div className="text-right text-[10px] font-mono text-slate-400">
        Ref: {refId} | Date: {date}
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

export default function SalesAgreementDocument({
  docType,
  firstParty,
  secondParty,
  settings,
  previewRefs = [],
}: SalesAgreementDocumentProps) {
  const isCSP = docType === "countrySales";
  const isSalesAgent = !isCSP;
  const salesPartner = settings.salesPartner;
  const isPendingCSP = isSalesAgent && (!salesPartner || !salesPartner.signatureImg);

  const activeCSPSig = isPendingCSP ? secondParty.signatureImg : salesPartner?.signatureImg;
  const activeAgentSig = isPendingCSP ? undefined : secondParty.signatureImg;

  const d = {
    date:
      settings.date ||
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    companyName: firstParty.companyName || "JEVXO",
    companyRepName: firstParty.representedBy || "Authorized Signatory",
    companyCEO: firstParty.ceoName || "Imtiaz Ahmed Tuhin",
    companyHR: firstParty.hrName || "Juwel Khan",
    companyHRcontact: firstParty.hrMobile || "01405749386",
    companyRepRole: firstParty.role || "Founder",
    companyEmail: firstParty.email || "info@jevxo.com",
    companyWebsite: firstParty.website || "www.jevxo.com",
    companyAddress: firstParty.currentAddress || "Rajshahi, Bangladesh",
    companySignature: firstParty.signatureImg || "",

    partnerName:
      (isCSP ? secondParty.fullName : salesPartner?.fullName) ||
      (isCSP ? "Partner Name" : "Country Sales Partner"),
    partnerContact: isCSP
      ? `${secondParty.mobileNumber || ""} / ${secondParty.email || ""}`
      : `${salesPartner?.phone || ""} / ${salesPartner?.email || ""}`,
    agentContact: `${secondParty.mobileNumber || ""} / ${secondParty.email || ""}`,
    partnerSignature: secondParty.signatureImg || "",

    salesRefId:
      settings.salesRefId ||
      (isCSP ? "JVX-CSP-REF-26-001" : "JVX-SAG-REF-26-001"),
    salesPartnerId:
      settings.salesPartnerId || (isCSP ? "JVX-CSP-26-001" : "JVX-SAG-26-001"),

    territory: settings.territory || "[COUNTRY / TERRITORY NAME]",
    isExclusive: settings.isExclusive ?? false,
    partnerAgreementRef:
      settings.partnerAgreementRef || "[PARTNER AGREEMENT REF. NO.]",
    initialTerm: settings.initialTerm ?? 1,
    noticePeriodSales: settings.noticePeriodSales || (isCSP ? "30/60" : "7/14"),
    baseCommissionRate: settings.baseCommissionRate ?? 10,
    recurringCommissionRate:
      settings.recurringCommissionRate ?? 10,
    overrideCommissionRate: settings.overrideCommissionRate ?? 10,
    paymentCurrency: settings.paymentCurrency || "USD",
    effectiveDate: settings.date,
    governingJurisdiction:
      settings.governingJurisdiction || "Hong Kong Special Administrative Region",
    salesExpiryDate: settings.salesExpiryDate || "",
  };

  const verifyUrl = buildVerifyUrl(d.salesRefId);
  // CSP now uses 5 pages; SAG stays at 3
  const totalPages = isCSP ? 5 : 3;
  const docTitle = isCSP
    ? "Country Sales Partner Agreement"
    : "Sales Agent Agreement";
  const idLabel = isCSP ? "Partner ID" : "Agent ID";

  // Signature parties
  const sigParty1 = isCSP
    ? {
        name: d.partnerName,
        role: "Country Sales Partner",
        sigImg: secondParty.signatureImg,
        date: settings.partnerSignedDate || "",
        awaitingLabel: "Awaiting Partner Sign *",
      }
    : {
        name: d.partnerName,
        role: "Country Sales Partner",
        sigImg: activeCSPSig,
        date: settings.partnerSignedDate || "",
        awaitingLabel: "Awaiting Partner Sign *",
      };

  const sigParty2 = isCSP
    ? {
        name: d.companyRepName,
        role: `For JEVXO (${d.companyRepRole})`,
        sigImg: d.companySignature,
        date: d.date,
      }
    : {
        name: secondParty.fullName || "Agent Name",
        role: "Sales Agent",
        sigImg: activeAgentSig,
        date: activeAgentSig ? d.date : "",
      };

  const founderApproval = {
    name: d.companyRepName,
    role: `JEVXO Founder (${d.companyRepRole}) — Approval`,
    sigImg: d.companySignature,
    date: d.date,
  };

  return (
    <div
      id="sales-agreement-container"
      className="flex flex-col select-text"
      style={{ width: A4_WIDTH, gap: 32 }}
    >

      {/* ══════════════════════════════════════════════ PAGE 1 ══ */}
      <DocumentLayout pageNum={1} refProp={previewRefs[0]}>
        <div className="px-10 pt-8 pb-0 flex flex-col flex-1">
          {/* Header row */}
          <div className="flex justify-between items-center border-b-2 border-slate-900 pb-2 mb-1">
            <DocumentHeader />
            <DocumentMetadata
              refId={d.salesRefId}
              idLabel={idLabel}
              idValue={d.salesPartnerId}
              verifyUrl={verifyUrl}
            />
          </div>

          {/* Document title */}
          <div className="text-center my-4">
            <h1 className="font-sans font-extrabold text-[22px] uppercase tracking-wider text-slate-900 leading-tight">
              {docTitle}
            </h1>
            <div className="mt-2 mx-auto w-36 h-1 rounded bg-gradient-to-r from-indigo-500 to-sky-400" />
          </div>

          {/* ── Parties block (CSP only) / Section 01 header (SAG) ── */}
          {isCSP ? (
            <PartiesBlock
              firstPartyName={d.companyName}
              firstPartyRep={d.companyRepName}
              ceoName={d.companyCEO}
              firstPartyHR={d.companyHR}
              firstPartyHRcontact={d.companyHRcontact}
              firstPartyAddress={d.companyAddress}
              firstPartyEmail={d.companyEmail}
              partnerName={d.partnerName}
              partnerContact={d.partnerContact}
              partnerNationality={secondParty.nidNumber ? "Bangladeshi" : ""}
              partnerDob={secondParty.dob || ""}
              partnerPassport={secondParty.nidNumber || ""}
              partnerEmail={secondParty.email}
              partnerId={secondParty.salesPartnerId || d.salesPartnerId}
              salesRefId={d.salesRefId}
              partnerAddress={secondParty.presentAddress}
              territory={d.territory}
              date={d.date}
            />
          ) : (
            <Section num="01" title="Parties">
              <p>
                This Sales Agent Agreement (&ldquo;Agreement&rdquo;) is entered
                into between:
              </p>
              <ul className="list-disc ml-5 mt-1 space-y-0.5">
                <li>
                  <strong><V>{d.partnerName}</V> </strong> — appointed by JEVXO as
                  Country Sales Partner (&ldquo;Partner&rdquo;) for the
                  Territory of <strong><V>{d.territory}</V></strong>, acting under
                  Agreement Ref. <strong><V>{d.partnerAgreementRef}</V></strong>; and
                </li>
                <li>
                  <strong><V>{secondParty.fullName || "Agent Name"}</V> </strong> —
                  appointed as Sales Agent (&ldquo;Agent&rdquo;) within the
                  Partner&apos;s network in the Territory.
                </li>
              </ul>
              <p className="mt-1">
                The Agent works under the supervision of, and reports to, the
                Country Sales Partner. The Agent does not have a direct
                contractual relationship with JEVXO; all Agent activity is
                conducted under the authority granted to the Partner by JEVXO.
              </p>
              <FieldTable
                rows={[
                  ["Agreement Reference No.", <V key="ref">{d.salesRefId}</V>],
                  ["Effective Date", <V key="ed">{d.effectiveDate}</V>],
                  ["Territory / Local Area", <V key="terr">{d.territory}</V>],
                  ["Country Sales Partner", <V key="csp">{d.partnerName}</V>],
                  ["Agent Contact", <V key="ac">{d.agentContact}</V>],
                ]}
              />
            </Section>
          )}

          {/* ── Section 01 (CSP) / Section 02 (SAG) ── */}
          {isCSP ? (
            <>
              <Section num="01" title="Appointment, Relationship &amp; Exclusivity">
                <p>
                  The Company hereby appoints the Partner as its Official Country
                  Sales Partner for the Territory named above, and the Partner
                  accepts this appointment on the terms of this Agreement.
                </p>
                <p className="mt-2">
                  This appointment creates a relationship of independent
                  contractor/commercial agent only. It does not create an
                  employment, partnership, joint-venture, or franchise
                  relationship between the parties. The Partner is solely
                  responsible for their own taxes, social security, business
                  licensing, and statutory registrations required in the Territory
                  to perform this role legally. The Partner has no authority to
                  bind the Company to any contract, guarantee, or financial
                  obligation without the Company&apos;s prior written approval.
                </p>
                <p className="mt-3 text-sm font-semibold text-slate-800">Exclusivity</p>
                <p className="mt-1 mb-3">
                  This appointment is:{" "}
                  <span
                    className={
                      d.isExclusive
                        ? "font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded"
                        : "font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded"
                    }
                  >
                    {d.isExclusive ? "☑ Exclusive" : "☑ Non-Exclusive"} for the
                    Territory of <V>{d.territory}</V>
                  </span>
                  .
                </p>
                {d.isExclusive && (
                  <p className="mt-2">
                    For the duration of this Agreement, JEVXO will not appoint
                    any other Country Sales Partner for the Territory of{" "}
                    <strong><V>{d.territory}</V></strong>. This exclusivity applies
                    specifically to the Country Sales Partner role; it does not
                    restrict JEVXO&apos;s direct operations or unrelated brand
                    partnerships outside the scope of this Agreement. If the
                    Partner fails to meet the minimum performance targets set out
                    in Section 3, the Company may at its discretion convert this
                    exclusive appointment to non-exclusive.
                  </p>
                )}
                {!d.isExclusive && (
                  <p className="mt-2">
                    JEVXO may appoint additional Country Sales Partners or agents
                    for this Territory. The Partner&apos;s appointment does not
                    prevent JEVXO from engaging other representatives or partners
                    within the same Territory.
                  </p>
                )}
              </Section>

              <Section num="02" title="Responsibilities of the Country Sales Partner &amp; Agent Network">
                <p>
                  The Partner shall act as JEVXO&apos;s authorized Country Sales
                  Partner within the assigned Territory and shall perform the
                  following responsibilities in a professional, ethical, and
                  commercially reasonable manner:
                </p>
                <ul className="list-disc ml-5 mt-2 space-y-0.5">
                  <li>
                    Promote JEVXO&apos;s products and services within the assigned
                    Territory in line with Company branding and messaging.
                  </li>
                  <li>Actively generate new clients, leads, and business opportunities for the Company.</li>
                  <li>
                    Represent JEVXO professionally, honestly, and in accordance
                    with the Company&apos;s official pricing and policies.
                  </li>
                  <li>Protect and promote the Company&apos;s reputation and business interests at all times.</li>
                  <li>
                    Follow all official company policies, sales guidelines, and
                    ethical standards issued by the Company from time to time.
                  </li>
                  <li>Maintain strict confidentiality regarding all Company information.</li>
                  <li>Submit periodic sales/activity reports to the Company as reasonably requested.</li>
                </ul>
              </Section>
            </>
          ) : (
            <Section num="02" title="Role &amp; Scope of the Sales Agent">
              <ul className="list-disc ml-5 space-y-0.5">
                <li>
                  Represent JEVXO&apos;s products and services within the
                  assigned local area in a professional and accurate manner,
                  under the guidance of the Country Sales Partner.
                </li>
                <li>
                  The Partner is expected to generate client leads and
                  successfully close sales for JEVXO&apos;s portfolio of
                  services, which covers websites, apps, SEO, marketing,
                  design, and consulting solutions.
                </li>
                <li>
                  Carry out local marketing, outreach, and promotional
                  activities as directed by the Partner, in line with the
                  Partner&apos;s own marketing responsibility to JEVXO.
                </li>
                <li>
                  Provide accurate client information to the Partner for
                  onboarding, invoicing, and record-keeping.
                </li>
                <li>
                  Follow JEVXO&apos;s pricing, service descriptions, and
                  policies exactly as provided by the Partner — the Agent may
                  not alter pricing or make unauthorized commitments to clients.
                </li>
                <li>Submit regular activity and client updates to the Partner as requested.</li>
              </ul>
            </Section>
          )}

          {/* ── Section 03 (SAG only on Page 1) ── */}
          {!isCSP && (
            <Section num="03" title="Reporting Structure">
              <ul className="list-disc ml-5 space-y-0.5">
                <li>
                  The Agent is recruited, managed, and supervised directly by
                  the Country Sales Partner, under the open recruitment
                  authorization granted to the Partner by JEVXO.
                </li>
                <li>
                  The Partner is responsible for including the Agent in its
                  monthly agent report submitted to JEVXO.
                </li>
                <li>
                  All communication regarding targets, support, and escalations
                  is routed through the Partner unless JEVXO requests direct
                  contact.
                </li>
                <li>
                  The Partner may set reasonable local performance expectations
                  for the Agent, provided these do not conflict with this
                  Agreement or JEVXO&apos;s standard client policies.
                </li>
              </ul>
            </Section>
          )}
        </div>
        <DocumentFooter
          email={d.companyEmail}
          website={d.companyWebsite}
          address={d.companyAddress}
          pageNum={1}
          totalPages={totalPages}
        />
      </DocumentLayout>

      {/* ══════════════════════════════════════════════ PAGE 2 ══ */}
      <DocumentLayout pageNum={2} refProp={previewRefs[1]}>
        <div className="px-10 pt-8 pb-0 flex flex-col flex-1">
          <ContinuationHeader
            refId={d.salesRefId}
            date={d.date}
            title={docTitle}
          />

          {/* ── Section 02 (CSP Part 2): Responsibilities (Continued) ── */}
          {isCSP && (
            <Section num="02" title="Responsibilities of the Country Sales Partner &amp; Agent Network (Continued)">
              <ul className="list-disc ml-5 space-y-0.5">
                <li>
                  <strong>Sales Agent Network:</strong> The Partner is granted
                  open authorization to recruit and manage a network of
                  independent sales agents in the Territory on JEVXO&apos;s
                  behalf, without needing separate written consent for each
                  individual agent.
                </li>
                <li>
                  <strong>Reporting:</strong> The Partner is required to submit
                  an updated list/report of all active agents in their network
                  to JEVXO on a monthly basis, including agent name, contact
                  details, and onboarding date. JEVXO reserves the right to
                  request the removal of any agent found to be acting outside
                  JEVXO&apos;s standards or this Agreement.
                </li>
                <li>
                  <strong>Local Marketing Responsibility:</strong> The Partner
                  and their agent network are expected to independently carry
                  out general/local marketing activities in the Territory
                  including client outreach, local promotion, and awareness
                  campaigns. JEVXO will provide branding materials, product
                  training, and platform support, but day-to-day local
                  marketing execution is the responsibility of the Partner.
                </li>
                <li>
                  <strong>Payment Collection:</strong> The Partner is
                  responsible for collecting client payments in the Territory
                  in the local currency, through payment methods appropriate
                  to the market. The Partner will report collected amounts to
                  JEVXO in USD-equivalent value for commission calculation and
                  reconciliation purposes. Currency conversion and local
                  transaction costs are to be managed by the Partner.
                </li>
              </ul>
            </Section>
          )}

          {/* ── Section 03 (CSP) ── */}
          {isCSP && (
            <Section num="03" title="Performance &amp; Targets">
              <ul className="list-disc ml-5 space-y-0.5">
                <li>
                  <strong>Minimum Sales Target:</strong>{" "}
                  The Partner is expected to achieve a minimum of <V>10</V> new client sales per calendar month, unless otherwise agreed in writing by the Company. Performance shall be reviewed periodically.
                </li>
                <li>
                  If the Partner fails to meet the agreed minimum sales target for two (2) consecutive review periods without reasonable justification accepted by the Company, JEVXO may, at its sole discretion, issue a performance improvement notice, convert an exclusive appointment to a non-exclusive appointment, or terminate this Agreement in accordance with its termination provisions.
                </li>
              </ul>
            </Section>
          )}

          {/* ── Section 04 (CSP): Commission & Payment Terms ── */}
          {isCSP && (
            <Section num="04" title="Commission &amp; Payment Terms">
              <CommissionTable
                rows={[
                  [
                    "Base Commission",
                    <><V key="bc">{d.baseCommissionRate}</V>%</>,
                    "Gross Sale Value of each new client sale",
                  ],
                  [
                    "Recurring Monthly Commission",
                    <><V key="rc">{d.recurringCommissionRate}</V>%</>,
                    "Active monthly subscription revenue collected from clients brought in directly by the Partner or by agents within their network, for as long as the client's subscription remains active",
                  ],
                  [
                    "Override Commission",
                    <><V key="oc">{d.overrideCommissionRate}</V>%</>,
                    "Override on the commission earned by agents within the Partner's network on their sales, paid to the Partner overseeing that network",
                  ],
                ]}
              />
              <ul className="list-disc ml-5 mt-1 space-y-0.5">
                <li>
                  <strong>Currency of Payment:</strong> <V>{d.paymentCurrency}</V>
                </li>
                <li>
                  <strong>Payment Method:</strong> Bank or Binance
                </li>
                <li>
                  <strong>Payment Schedule:</strong> Monthly
                </li>
                <li>
                  <strong>Minimum Payout Threshold:</strong> USD $50 —
                  Commission is earned only once the Company has received full
                  payment from the client.
                </li>
              </ul>
              <p className="mt-2">
                If a sale is refunded, cancelled, or charged back, any
                commission already paid on that sale shall be deducted from the
                Partner&apos;s next payment(s) (&ldquo;Clawback&rdquo;). The
                Company reserves the right to withhold commission on any
                transaction under investigation for fraud, misrepresentation,
                or policy violation. All applicable taxes on commission earnings
                are the sole responsibility of the Partner.
              </p>
              <p className="mt-1 text-xs italic text-slate-500">
                Note: These rates apply uniformly to all Country Sales Partners
                in all Territories, unless a signed custom addendum states otherwise.
              </p>
            </Section>
          )}

          {/* ── Section 04 (SAG) ── */}
          {!isCSP && (
            <Section num="04" title="Commission Structure">
              <p>
                The following commission structure applies to all Sales Agents
                working under a Country Sales Partner, in any Territory:
              </p>
              <CommissionTable
                rows={[
                  [
                    "Sales Commission",
                    <V key="base">{d.baseCommissionRate}%</V>,
                    "Total (Gross) Sale Value of each client sale closed by the Agent",
                  ],
                  [
                    "Recurring Monthly Commission",
                    <V key="rec">{d.recurringCommissionRate}%</V>,
                    "Active monthly subscription revenue from clients brought in by the Agent, for as long as the client's subscription remains active — following the same recurring commission model used for Country Sales Partners",
                  ],
                ]}
              />
              <ul className="list-disc ml-5 mt-1 space-y-0.5">
                <li>
                  Commission is calculated on the same Gross Sale Value and
                  subscription revenue basis used throughout JEVXO&apos;s
                  pricing structure — not on the Partner&apos;s override earnings.
                </li>
                <li>
                  The Agent&apos;s commission is paid separately from, and does
                  not reduce, the Country Sales Partner&apos;s own base or
                  override commission.
                </li>
                <li>
                  Recurring commission continues each month for as long as the
                  client&apos;s subscription remains active, and stops if the
                  client&apos;s subscription is cancelled or permanently discontinued.
                </li>
              </ul>
              <p className="mt-1 text-[11.5px] italic text-slate-500">
                Note: These rates apply uniformly to all Sales Agents across all
                Territories, unless a signed custom addendum states otherwise.
              </p>
            </Section>
          )}

          {/* ── Section 05 (SAG) ── */}
          {!isCSP && (
            <Section num="05" title="Payment &amp; Commission Disbursement">
              <ul className="list-disc ml-5 space-y-0.5">
                <li>
                  Client payments are collected in local currency by the Country
                  Sales Partner (or by the Agent on the Partner&apos;s behalf,
                  if agreed locally), following the Partner&apos;s standard
                  local currency collection process.
                </li>
                <li>
                  The Partner is responsible for calculating and disbursing the
                  Agent&apos;s commission after client payment is confirmed and
                  reconciled.
                </li>
                <li>
                  Commission is paid to the Agent by the Partner upon
                  confirmation of the corresponding client payment with JEVXO.
                </li>
                <li>
                  The Agent should maintain their own record of closed sales and
                  active subscriptions to reconcile against the Partner&apos;s reports.
                </li>
              </ul>
            </Section>
          )}

          {/* ── Section 06 (SAG) ── */}
          {!isCSP && (
            <Section num="06" title="Term &amp; Termination">
              <ul className="list-disc ml-5 space-y-0.5">
                <li>
                  This Agreement remains in effect from the Date of Agreement
                  until terminated by either party.
                </li>
                <li>
                  Either party may terminate this Agreement with{" "}
                  <strong>[<V>{d.noticePeriodSales}</V>]</strong> days&apos; written
                  notice to the other.
                </li>
                <li>
                  Commission already earned on active client subscriptions prior
                  to termination remains payable according to the standard
                  recurring commission terms, unless the Agent&apos;s conduct
                  directly caused the client relationship to end.
                </li>
                <li>
                  The Partner may terminate this Agreement immediately if the
                  Agent is found acting outside JEVXO&apos;s standards,
                  misrepresenting pricing, or violating confidentiality.
                </li>
              </ul>
            </Section>
          )}

          {/* ── Section 07 (SAG) ── */}
          {!isCSP && (
            <Section num="07" title="Marketing Responsibility &amp; Independent Contractor Status">
              <p>
                The Agent carries out local marketing and outreach activities as
                directed by and in support of the Country Sales Partner. This
                includes client meetings, local promotion, and awareness
                activities within the assigned local area. The Agent&apos;s
                marketing efforts align with the broader Territory marketing
                responsibility held by the Country Sales Partner.
              </p>
              <p className="mt-2">
                The Agent operates as an independent contractor and not as an
                employee of the Partner or of JEVXO. The Agent is responsible
                for their own taxes, licenses, and local regulatory compliance.
              </p>
            </Section>
          )}
        </div>
        <DocumentFooter
          email={d.companyEmail}
          website={d.companyWebsite}
          address={d.companyAddress}
          pageNum={2}
          totalPages={totalPages}
        />
      </DocumentLayout>

      {/* ══════════════════════════════════════════════ PAGE 3 ══ */}
      <DocumentLayout pageNum={3} refProp={previewRefs[2]}>
        <div className="px-10 pt-8 pb-0 flex flex-col flex-1">
          <ContinuationHeader
            refId={d.salesRefId}
            date={d.date}
            title={docTitle}
          />

          {/* ── Section 05 (CSP): Brand Protection, Intellectual Property & Confidentiality ── */}
          {isCSP && (
            <Section num="05" title="Brand Protection, Intellectual Property &amp; Confidentiality">
              <ul className="list-disc ml-5 space-y-0.5">
                <li>
                  The Partner may use the JEVXO name, logo, and marketing
                  materials only for official promotional purposes connected to
                  this Agreement.
                </li>
                <li>
                  The Partner may not modify, misuse, or register the JEVXO
                  name, logo, or any similar trademark/domain in their own name
                  or any third party&apos;s name.
                </li>
                <li>
                  Upon termination, the Partner must immediately cease using
                  the JEVXO name/logo and return or destroy all Company
                  materials in their possession.
                </li>
                <li>
                  <strong>Confidentiality:</strong> The Partner agrees not to
                  disclose, publish, or use for personal benefit any
                  confidential information belonging to the Company, including
                  but not limited to: client information and databases; pricing
                  strategy and commercial terms; business plans and strategic
                  documents; marketing strategy and campaign data; software,
                  source code, and digital assets; internal documents, policies,
                  and communications. This obligation survives termination of
                  this Agreement indefinitely, or for a minimum of three (3)
                  years, whichever the Company elects to enforce.
                </li>
              </ul>
            </Section>
          )}

          {/* ── Section 06 (CSP): Data Protection ── */}
          {isCSP && (
            <Section num="06" title="Data Protection & Privacy">
              <p>
                The Partner shall collect, access, process, and use any personal data of clients or prospects solely for the purpose of performing responsibilities under this Agreement and in compliance with the applicable data protection and privacy laws of the relevant Territory. The Partner shall take reasonable measures to protect such data from unauthorized access, disclosure, misuse, or loss, and shall not disclose, sell, or transfer any personal data except as permitted by law or authorized by JEVXO. Upon termination of this Agreement, the Partner shall cease using such data and securely return or permanently delete it, unless retention is required by applicable law.
              </p>
            </Section>
          )}

          {/* ── Section 07 (CSP): Term & Termination ── */}
          {isCSP && (
            <Section num="07" title="Term &amp; Termination">
              <ul className="list-disc ml-5 space-y-0.5">
                <li>
                  This Agreement begins on the signing date and continues for
                  an initial term of: <strong><V>{d.initialTerm}</V> {d.initialTerm === 1 ? "year" : "years"}</strong>.
                </li>
                <li>
                  Either party may terminate this Agreement for convenience by
                  giving no less than <strong>{d.noticePeriodSales} days'</strong>; written notice to
                  the other party.
                </li>
                <li>
                  The Company may terminate this Agreement immediately, without
                  notice, in cases of fraud, misconduct, breach of
                  confidentiality, or any act that damages JEVXO&apos;s
                  reputation or business interests.
                </li>
                <li>
                  Upon termination, any commission legitimately earned prior to
                  the termination date (and not subject to clawback) shall
                  still be paid according to the normal payment schedule.
                </li>
              </ul>
            </Section>
          )}

          {/* ── Section 08 (CSP): Code of Conduct ── */}
          {isCSP && (
            <Section num="08" title="Code of Conduct">
              <ul className="list-disc ml-5 space-y-0.5">
                <li>Conduct all business activities honestly, ethically, and professionally while acting in the best interests of both JEVXO and its clients.</li>
                <li>Represent JEVXO's products, services, pricing, and policies accurately, and refrain from making any false, misleading, exaggerated, or unauthorized representations or commitments.</li>
                <li>
                  Comply with all applicable laws and regulations of the Territory, including consumer protection, anti-bribery, anti-corruption, and fair business practice requirements.
                </li>
                <li>
                  Maintain respectful, professional, and timely communication with clients, business partners, and Company representatives at all times.
                </li>
                <li>
                  Promptly report to JEVXO any significant client complaint, legal notice, regulatory inquiry, suspected fraud, or misconduct that may affect the Company's business, reputation, or legal compliance.
                </li>
              </ul>
            </Section>
          )}

          {/* ── Section 08 (SAG) ── */}
          {!isCSP && (
            <Section num="08" title="Confidentiality, Professional Standards &amp; Ethical Conduct">
              <p>
                The Agent agrees to keep confidential all non-public business
                information shared by the Partner or JEVXO, including pricing
                structures, client data, commission terms, and internal
                strategy, both during and after the term of this Agreement.
              </p>
              <p className="mt-2">
                The Agent shall conduct all business activities honestly,
                professionally, and in accordance with applicable laws,
                JEVXO&apos;s policies, and the Country Sales Partner&apos;s
                reasonable instructions. The Agent shall not engage in
                fraudulent activities, misleading sales practices, unauthorized
                pricing, false representations, harassment, discrimination, or
                any conduct that may reasonably damage the reputation, goodwill,
                or client relationships of JEVXO or the Country Sales Partner.
              </p>
            </Section>
          )}

          {/* ── Section 09 (SAG) ── */}
          {!isCSP && (
            <Section num="09" title="Governing Law &amp; Dispute Resolution">
              <p>
                This Agreement shall be governed by and construed in accordance
                with the laws of{" "}
                <strong><V>{d.governingJurisdiction}</V></strong>. Any dispute,
                controversy, or claim arising out of or relating to this
                Agreement shall first be addressed through good-faith written
                discussions between the Agent and the Partner, with the intent
                to reach an amicable resolution prior to initiating any formal
                proceedings. If such discussions fail, the parties may pursue
                formal resolution through the competent courts or tribunals of
                Bangladesh, subject to applicable law.
              </p>
              <p className="mt-1 text-[12px] italic text-slate-500">
                Note: This template is provided solely as a standardized
                business document and does not constitute formal legal advice.
                Because Sales Agent Agreements may be executed across multiple
                jurisdictions with differing labor, contractor, and commercial
                laws, each Territory-specific version must be reviewed and
                approved by a qualified local lawyer prior to execution. The
                parties acknowledge that independent legal or professional advice
                should be sought to ensure compliance with applicable laws and
                regulations.
              </p>
            </Section>
          )}

          {/* SAG-only Section 10 — Final Agreement */}
          {!isCSP && (
            <>
              <Section num="10" title="Final Agreement &amp; Acceptance">
                <p>
                  This Agreement constitutes the entire agreement between the
                  applicable contracting parties concerning its subject matter
                  and supersedes all prior discussions, representations, or
                  understandings relating to that subject matter. No amendment,
                  variation, or waiver is valid unless made in writing and
                  accepted by the applicable parties.
                </p>
                <p className="mt-2">
                  Electronic signatures, digital signatures, and signed
                  counterparts of this Agreement are valid and enforceable to
                  the fullest extent permitted by applicable law. By signing,
                  each applicable party confirms that it has read, understood,
                  and voluntarily accepted this <V>{docTitle}</V>, and
                  acknowledges that it has had sufficient opportunity to seek
                  independent legal or professional advice before signing.
                </p>
              </Section>
              <SignatureSection
                party1={sigParty1}
                party2={sigParty2}
                party3={founderApproval}
                titleText="Acceptance & Executory Signatures"
                bodyText={`This Sales Agent Agreement is executed between ${d.partnerName} (Country Sales Partner) and ${secondParty.fullName || "Agent Name"} (Sales Agent) for the Territory of ${d.territory}, effective ${d.date}. JEVXO acknowledges and approves this appointment but is not a contracting party.`}
              />
            </>
          )}
        </div>
        <DocumentFooter
          email={d.companyEmail}
          website={d.companyWebsite}
          address={d.companyAddress}
          pageNum={3}
          totalPages={totalPages}
        />
      </DocumentLayout>

      {/* ══════════════════════════════════════ PAGE 4 (CSP only) ══ */}
      {isCSP && (
        <DocumentLayout pageNum={4} refProp={previewRefs[3]}>
          <div className="px-10 pt-8 pb-0 flex flex-col flex-1">
            <ContinuationHeader
              refId={d.salesRefId}
              date={d.date}
              title={docTitle}
            />

            <Section num="09" title="Governing Law, Dispute Resolution &amp; Jurisdiction">
              <p className="font-semibold text-slate-800 mb-1">9.1 Governing Law</p>
              <p>
                This Agreement shall be governed by, construed, and enforced in
                accordance with the laws of the Hong Kong Special Administrative
                Region (&ldquo;Hong Kong&rdquo;), without regard to its conflict
                of laws principles.
              </p>

              <p className="font-semibold text-slate-800 mt-3 mb-1">9.2 Good Faith Negotiation</p>
              <p>
                The Parties agree that, in the event of any dispute,
                controversy, or claim arising out of or relating to this
                Agreement, they shall first attempt to resolve such dispute
                through good-faith negotiations within <strong>{d.noticePeriodSales} days' </strong>
                after written notice of the dispute has been delivered by either
                Party.
              </p>

              <p className="font-semibold text-slate-800 mt-3 mb-1">9.3 Arbitration</p>
              <p>
                If the dispute cannot be resolved through negotiation within the
                specified period, the dispute shall be finally resolved by
                arbitration administered by the Hong Kong International
                Arbitration Centre (HKIAC) in accordance with the HKIAC
                Administered Arbitration Rules in force at the time the
                arbitration is commenced. The seat of arbitration shall be Hong
                Kong. The language of the arbitration shall be English. The
                arbitral tribunal shall consist of one (1) arbitrator, unless
                the Parties mutually agree otherwise. The arbitral award shall
                be final, binding, and enforceable upon both Parties in any
                court of competent jurisdiction.
              </p>

              <p className="font-semibold text-slate-800 mt-3 mb-1">9.4 Continued Performance</p>
              <p>
                During the pendency of any dispute, both Parties shall continue
                to perform all undisputed obligations under this Agreement
                unless otherwise directed by the arbitral tribunal or mutually
                agreed in writing.
              </p>

              <p className="font-semibold text-slate-800 mt-3 mb-1">9.5 Confidentiality</p>
              <p>
                All negotiations, mediation discussions, arbitration
                proceedings, documents, evidence, and awards relating to any
                dispute shall remain strictly confidential unless disclosure is
                required by applicable law or for the enforcement of an arbitral
                award.
              </p>

              <p className="font-semibold text-slate-800 mt-3 mb-1">9.6 Limitation of Liability</p>
              <p>
                Except in cases of fraud, willful misconduct, gross negligence,
                breach of confidentiality, or infringement of intellectual
                property rights, neither Party shall be liable for any indirect,
                incidental, consequential, punitive, or special damages,
                including loss of profits, goodwill, or business opportunities.
                The Company&apos;s total liability to the Partner under this
                Agreement shall not exceed the total commission paid to the
                Partner in the three (3) months preceding the event giving rise
                to the claim.
              </p>

              <p className="font-semibold text-slate-800 mt-3 mb-1">9.7 Intellectual Property Protection</p>
              <p>
                All trademarks, trade names, logos, software, source code,
                databases, documentation, marketing materials, business
                strategies, confidential information, and other intellectual
                property associated with JEVXO shall remain the sole and
                exclusive property of JEVXO. Nothing contained in this
                Agreement shall be interpreted as transferring any ownership
                rights to the Country Sales Partner.
              </p>

              <p className="font-semibold text-slate-800 mt-3 mb-1">9.8 Compliance with Applicable Laws</p>
              <p>
                The Country Sales Partner shall comply with all applicable laws,
                regulations, licensing requirements, anti-corruption laws,
                anti-money laundering regulations, data protection obligations,
                and international trade compliance requirements applicable
                within the assigned territory.
              </p>

               <p className="font-semibold text-slate-800 mt-3 mb-1">9.9 Entire Agreement</p>
              <p>
                This Agreement constitutes the complete understanding between
                the Parties and supersedes all previous negotiations,
                discussions, representations, and agreements, whether written
                or oral. No amendment or modification shall be valid unless made
                in writing and signed by both Parties.
              </p>
            </Section>
          </div>
          <DocumentFooter
            email={d.companyEmail}
            website={d.companyWebsite}
            address={d.companyAddress}
            pageNum={4}
            totalPages={totalPages}
          />
        </DocumentLayout>
      )}

      {/* ══════════════════════════════════════ PAGE 5 (CSP only) ══ */}
      {isCSP && (
        <DocumentLayout pageNum={5} refProp={previewRefs[4]}>
          <div className="px-10 pt-8 pb-0 flex flex-col flex-1">
            <ContinuationHeader
              refId={d.salesRefId}
              date={d.date}
              title={docTitle}
            />

            {/* Continuation of Section 09 sub-clauses */}
            <Section num="09" title="Governing Law (Continued)">
              <p className="font-semibold text-slate-800 mt-3 mb-1">9.10 Severability</p>
              <p>
                If any provision of this Agreement is held to be invalid or
                unenforceable by a competent authority, the remaining provisions
                shall remain in full force and effect.
              </p>

              <p className="font-semibold text-slate-800 mt-3 mb-1">9.11 Force Majeure</p>
              <p>
                Neither Party shall be liable for any delay or failure in
                performing its obligations due to events beyond its reasonable
                control, including natural disasters, war, civil unrest,
                terrorism, governmental restrictions, pandemics, cyberattacks,
                or failures of public infrastructure.
              </p>

              <p className="font-semibold text-slate-800 mt-3 mb-1">9.12 Electronic Execution</p>
              <p>
                This Agreement may be executed electronically, including through
                digital signatures and electronic document platforms. Such
                electronic execution shall have the same legal force and effect
                as an original handwritten signature.
              </p>

              <p className="font-semibold text-slate-800 mt-3 mb-1">9.13 Survival</p>
              <p>
                The provisions relating to Confidentiality, Intellectual
                Property, Non-Disclosure, Non-Solicitation (if applicable),
                Limitation of Liability, Governing Law, Dispute Resolution, and
                any obligations intended to survive termination shall remain
                effective after this Agreement expires or is terminated.
              </p>
            </Section>

            {/* ── Section 10 — Final Agreement & Acceptance (preserved exactly) ── */}
            <Section num="10" title="Final Agreement &amp; Acceptance">
              <p>
                This Agreement constitutes the entire agreement between the
                applicable contracting parties concerning its subject matter
                and supersedes all prior discussions, representations, or
                understandings relating to that subject matter. No amendment,
                variation, or waiver is valid unless made in writing and
                accepted by the applicable parties.
              </p>
              <p className="mt-2">
                Electronic signatures, digital signatures, and signed
                counterparts are valid and enforceable to the fullest extent
                permitted by applicable law. By signing, each applicable party
                confirms that it has read, understood, and voluntarily accepted
                this <V>{docTitle}</V>, and acknowledges that it has had
                sufficient opportunity to seek independent legal or professional
                advice before signing.
              </p>
            </Section>

            <SignatureSection
              party1={sigParty1}
              party2={sigParty2}
              party1Left="left-25"
              titleText="Executory Signatures"
              bodyText={`This Country Sales Partner Agreement is executed between JEVXO and ${d.partnerName} as Country Sales Partner for the Territory of ${d.territory}, effective ${d.date}.`}
            />
          </div>
          <DocumentFooter
            email={d.companyEmail}
            website={d.companyWebsite}
            address={d.companyAddress}
            pageNum={5}
            totalPages={totalPages}
          />
        </DocumentLayout>
      )}
    </div>
  );
}
