"use client";
import React from "react";
import { FirstParty, SecondParty, DocSettings, SalesAgreementType } from "../../types";
import { A4_WIDTH } from "../A4DocumentScaler";
import { buildVerifyUrl } from "../../lib/verifyUrl";
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
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-4">
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

function FieldTable({ rows }: { rows: [string, string][] }) {
  return (
    <table className="w-full text-[11.5px] border-collapse mt-2 font-sans">
      <thead>
        <tr className="bg-slate-100">
          <th className="border border-slate-200 px-2 py-1 text-left font-bold text-slate-600 w-1/3">Field</th>
          <th className="border border-slate-200 px-2 py-1 text-left font-bold text-slate-600">Details</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([field, detail]) => (
          <tr key={field} className="even:bg-slate-50/50">
            <td className="border border-slate-200 px-2 py-1 font-medium text-slate-500">{field}</td>
            <td className="border border-slate-200 px-2 py-1 text-slate-800">{detail || "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SummaryTable({ rows }: { rows: [string, string][] }) {
  return (
    <table className="w-full text-[11.5px] border-collapse font-sans">
      <thead>
        <tr className="bg-indigo-50">
          <th className="border border-indigo-100 px-3 py-1.5 text-left font-bold text-indigo-700 w-1/2">Term</th>
          <th className="border border-indigo-100 px-3 py-1.5 text-left font-bold text-indigo-700">Standard Value</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([term, value]) => (
          <tr key={term} className="even:bg-slate-50/50">
            <td className="border border-slate-200 px-3 py-1.5 font-medium text-slate-600">{term}</td>
            <td className="border border-slate-200 px-3 py-1.5 text-slate-800">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CommissionTable({ rows }: { rows: [string, string, string][] }) {
  return (
    <table className="w-full text-[11.5px] border-collapse mt-2 mb-2 font-sans">
      <thead>
        <tr className="bg-emerald-50">
          <th className="border border-emerald-100 px-2 py-1.5 text-left font-bold text-emerald-700">Commission Type</th>
          <th className="border border-emerald-100 px-2 py-1.5 text-left font-bold text-emerald-700 w-16">Rate</th>
          <th className="border border-emerald-100 px-2 py-1.5 text-left font-bold text-emerald-700">Applied To</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([type, rate, applied]) => (
          <tr key={type} className="even:bg-slate-50/50">
            <td className="border border-slate-200 px-2 py-1 font-medium text-slate-700">{type}</td>
            <td className="border border-slate-200 px-2 py-1 text-center font-bold text-emerald-700">{rate}</td>
            <td className="border border-slate-200 px-2 py-1 text-slate-600 text-[11px]">{applied}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ContinuationHeader({ refId, date, title }: { refId: string; date: string; title: string }) {
  return (
    <header className="flex justify-between items-start border-b border-slate-200 pb-2 mb-3 z-10">
      <span className="font-sans text-xs font-bold tracking-wider text-slate-500 uppercase">{title}</span>
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

  const d = {
    date: settings.date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    companyName: firstParty.companyName || "JEVXO",
    companyRepName: firstParty.representedBy || "Authorized Signatory",
    companyRepRole: firstParty.role || "Founder",
    companyEmail: firstParty.email || "info@jevxo.com",
    companyWebsite: firstParty.website || "www.jevxo.com",
    companyAddress: firstParty.currentAddress || "Rajshahi, Bangladesh",
    companySignature: firstParty.signatureImg || "",

    partnerName: secondParty.fullName || (isCSP ? "Partner Name" : "Agent Name"),
    partnerContact: `${secondParty.mobileNumber || ""} / ${secondParty.email || ""}`,
    partnerSignature: secondParty.signatureImg || "",

    salesRefId: settings.salesRefId || (isCSP ? "JVX-CSP-REF-26-001" : "JVX-SAG-REF-26-001"),
    salesPartnerId: settings.salesPartnerId || (isCSP ? "JVX-CSP-26-001" : "JVX-SAG-26-001"),

    territory: settings.territory || "[COUNTRY / TERRITORY NAME]",
    isExclusive: settings.isExclusive ?? false,
    partnerAgreementRef: settings.partnerAgreementRef || "[PARTNER AGREEMENT REF. NO.]",
    paymentDays: settings.paymentDays || 14,
    noticePeriodSales: settings.noticePeriodSales || (isCSP ? "30/60" : "7/14"),
    governingJurisdiction: settings.governingJurisdiction || "[GOVERNING JURISDICTION]",
    salesExpiryDate: settings.salesExpiryDate || "",
  };

  const verifyUrl = buildVerifyUrl(d.salesRefId);
  const totalPages = 4;
  const docTitle = isCSP ? "Country Sales Partner Agreement" : "Sales Agent Agreement";
  const idLabel = isCSP ? "Partner ID" : "Agent ID";

  // Signature parties
  const sigParty1 = isCSP
    ? {
        name: d.partnerName,
        role: "Country Sales Partner",
        sigImg: secondParty.signatureImg,
        awaitingLabel: "Awaiting Partner Sign *",
      }
    : {
        name: d.partnerName,
        role: "Country Sales Partner",
        sigImg: firstParty.signatureImg,
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
        sigImg: secondParty.signatureImg,
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
          <div className="flex justify-between items-start mb-4">
            <DocumentHeader />
            <DocumentMetadata
              refId={d.salesRefId}
              idLabel={idLabel}
              idValue={d.salesPartnerId}
              verifyUrl={verifyUrl}
            />
          </div>

          {/* Document title */}
          <div className="text-center mb-5">
            <h1 className="font-sans font-extrabold text-[20px] uppercase tracking-widest text-slate-900 leading-tight">
              {docTitle}
            </h1>
            <div className="mt-1 mx-auto w-24 h-1 rounded bg-gradient-to-r from-indigo-500 to-sky-400" />
          </div>

          {/* ── Section 01 — Parties ── */}
          {isCSP ? (
            <Section num="01" title="Parties">
              <p>
                This Country Sales Partner Agreement (&ldquo;Agreement&rdquo;) is entered into between:
              </p>
              <ul className="list-disc ml-5 mt-1 space-y-0.5">
                <li>
                  <strong>JEVXO</strong> — a global SaaS and digital business ecosystem (&ldquo;Company&rdquo;); and
                </li>
                <li>
                  <strong>{d.partnerName}</strong> — appointed as Country Sales Partner (&ldquo;Partner&rdquo;) for the Territory of <strong>{d.territory}</strong>.
                </li>
              </ul>
              <FieldTable
                rows={[
                  ["Agreement Reference No.", d.salesRefId],
                  ["Date of Agreement", d.date],
                  ["Territory", d.territory],
                  ["Partner Contact", d.partnerContact],
                ]}
              />
            </Section>
          ) : (
            <Section num="01" title="Parties">
              <p>
                This Sales Agent Agreement (&ldquo;Agreement&rdquo;) is entered into between:
              </p>
              <ul className="list-disc ml-5 mt-1 space-y-0.5">
                <li>
                  <strong>{d.partnerName}</strong> — appointed by JEVXO as Country Sales Partner (&ldquo;Partner&rdquo;) for the Territory of <strong>{d.territory}</strong>, acting under Agreement Ref. <strong>{d.partnerAgreementRef}</strong>; and
                </li>
                <li>
                  <strong>{secondParty.fullName || "Agent Name"}</strong> — appointed as Sales Agent (&ldquo;Agent&rdquo;) within the Partner&apos;s network in the Territory.
                </li>
              </ul>
              <p className="mt-1">
                The Agent works under the supervision of, and reports to, the Country Sales Partner. The Agent does not have a direct contractual relationship with JEVXO; all Agent activity is conducted under the authority granted to the Partner by JEVXO.
              </p>
              <FieldTable
                rows={[
                  ["Agreement Reference No.", d.salesRefId],
                  ["Date of Agreement", d.date],
                  ["Territory / Local Area", d.territory],
                  ["Country Sales Partner", d.partnerName],
                  ["Agent Contact", d.partnerContact],
                ]}
              />
            </Section>
          )}

          {/* ── Section 02 ── */}
          {isCSP ? (
            <Section num="02" title="Territory &amp; Exclusivity">
              <p>
                This appointment covers the Territory named above. The exclusivity status must be explicitly selected below — only one option applies:
              </p>
              <ul className="list-disc ml-5 mt-1 space-y-0.5">
                <li>
                  <span className={d.isExclusive ? "font-bold text-green-700 bg-green-50 px-1 rounded" : "text-slate-500"}>
                    {d.isExclusive ? "☑" : "☐"} Exclusive
                  </span>{" "}
                  — JEVXO will not appoint any other Country Sales Partner for this Territory for the duration of this Agreement.
                </li>
                <li>
                  <span className={!d.isExclusive ? "font-bold text-slate-700 bg-slate-100 px-1 rounded" : "text-slate-500"}>
                    {!d.isExclusive ? "☑" : "☐"} Non-Exclusive
                  </span>{" "}
                  — JEVXO may appoint additional Country Sales Partners or agents for this Territory.
                </li>
              </ul>
              <p className="mt-1 text-[11.5px] italic text-slate-500">
                Note: Select exactly one option per Partner and per Territory at the time of signing. This corrects the earlier template error where both options appeared listed together without a clear selection.
              </p>
            </Section>
          ) : (
            <Section num="02" title="Role &amp; Scope of the Sales Agent">
              <ul className="list-disc ml-5 space-y-0.5">
                <li>Represent JEVXO&apos;s products and services within the assigned local area in a professional and accurate manner, under the guidance of the Country Sales Partner.</li>
                <li>Generate client leads and close sales for JEVXO&apos;s website, app, SEO, marketing, design, and consulting packages.</li>
                <li>Carry out local marketing, outreach, and promotional activities as directed by the Partner, in line with the Partner&apos;s own marketing responsibility to JEVXO.</li>
                <li>Provide accurate client information to the Partner for onboarding, invoicing, and record-keeping.</li>
                <li>Follow JEVXO&apos;s pricing, service descriptions, and policies exactly as provided by the Partner — the Agent may not alter pricing or make unauthorized commitments to clients.</li>
                <li>Submit regular activity and client updates to the Partner as requested.</li>
              </ul>
            </Section>
          )}

          {/* ── Section 03 ── */}
          {isCSP ? (
            <Section num="03" title="Role &amp; Responsibilities of the Country Sales Partner">
              <ul className="list-disc ml-5 space-y-0.5">
                <li>Represent JEVXO&apos;s products and services within the Territory in a professional and accurate manner.</li>
                <li>Generate client leads, close sales, and onboard clients onto JEVXO&apos;s website, app, SEO, marketing, design, and consulting packages.</li>
                <li>Build and manage a local sales agent network as described in Section 4.</li>
                <li>Carry out general marketing and promotional activities within the Territory as described in Section 6.</li>
                <li>Collect client payments in local currency as described in Section 7.</li>
                <li>Maintain accurate records of clients and agents, and report to JEVXO as required under this Agreement.</li>
              </ul>
            </Section>
          ) : (
            <Section num="03" title="Reporting Structure">
              <ul className="list-disc ml-5 space-y-0.5">
                <li>The Agent is recruited, managed, and supervised directly by the Country Sales Partner, under the open recruitment authorization granted to the Partner by JEVXO.</li>
                <li>The Partner is responsible for including the Agent in its monthly agent report submitted to JEVXO.</li>
                <li>All communication regarding targets, support, and escalations is routed through the Partner unless JEVXO requests direct contact.</li>
                <li>The Partner may set reasonable local performance expectations for the Agent, provided these do not conflict with this Agreement or JEVXO&apos;s standard client policies.</li>
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
          <ContinuationHeader refId={d.salesRefId} date={d.date} title={docTitle} />

          {/* ── Section 04 ── */}
          {isCSP ? (
            <Section num="04" title="Sales Agent Network">
              <p>
                The Partner is authorized to recruit and manage a network of independent sales agents within the Territory to support client outreach and lead generation, under the following standard terms:
              </p>
              <ul className="list-disc ml-5 mt-1 space-y-0.5">
                <li>Open recruitment authorization: the Partner may recruit sales agents without requiring separate written consent from JEVXO for each individual agent.</li>
                <li>This blanket authorization satisfies any general prior-consent requirement for the appointment of sub-agents under this Agreement.</li>
                <li>The Partner must submit an updated list/report of all active agents to JEVXO on a monthly basis, including agent name, contact details, and onboarding date.</li>
                <li>JEVXO reserves the right to request the removal of any agent found to be acting outside JEVXO&apos;s standards or this Agreement.</li>
              </ul>
            </Section>
          ) : (
            <Section num="04" title="Commission Structure">
              <p>
                The following commission structure applies to all Sales Agents working under a Country Sales Partner, in any Territory:
              </p>
              <CommissionTable
                rows={[
                  ["Sales Commission", "10%", "Total (Gross) Sale Value of each client sale closed by the Agent"],
                  ["Recurring Monthly Commission", "10%", "Active monthly subscription revenue from clients brought in by the Agent, for as long as the client's subscription remains active — following the same recurring commission model used for Country Sales Partners"],
                ]}
              />
              <ul className="list-disc ml-5 mt-1 space-y-0.5">
                <li>Commission is calculated on the same Gross Sale Value and subscription revenue basis used throughout JEVXO&apos;s pricing structure — not on the Partner&apos;s override earnings.</li>
                <li>The Agent&apos;s commission is paid separately from, and does not reduce, the Country Sales Partner&apos;s own base or override commission.</li>
                <li>Recurring commission continues each month for as long as the client&apos;s subscription remains active, and stops if the client&apos;s subscription is cancelled or permanently discontinued.</li>
              </ul>
              <p className="mt-1 text-[11.5px] italic text-slate-500">
                Note: These rates apply uniformly to all Sales Agents across all Territories, unless a signed custom addendum states otherwise.
              </p>
            </Section>
          )}

          {/* ── Section 05 ── */}
          {isCSP ? (
            <Section num="05" title="Commission &amp; Payment Terms">
              <CommissionTable
                rows={[
                  ["Base Commission", "10%", "Gross Sale Value of each new client sale"],
                  ["Recurring Monthly Commission", "12%", "Active monthly subscription revenue from clients brought in by the Partner or their agent network, for as long as the subscription remains active"],
                  ["Override Commission", "10%", "Commission earned by agents within the Partner's network, paid to the Partner as network overseer"],
                ]}
              />
              <p className="mt-1 text-[11.5px] italic text-slate-500">
                Note: These rates apply uniformly to all Country Sales Partners in all Territories, unless a signed custom addendum states otherwise.
              </p>
            </Section>
          ) : (
            <Section num="05" title="Payment &amp; Commission Disbursement">
              <ul className="list-disc ml-5 space-y-0.5">
                <li>Client payments are collected in local currency by the Country Sales Partner (or by the Agent on the Partner&apos;s behalf, if agreed locally), following the Partner&apos;s standard local currency collection process.</li>
                <li>The Partner is responsible for calculating and disbursing the Agent&apos;s commission after client payment is confirmed and reconciled.</li>
                <li>Commission is paid to the Agent within <strong>{d.paymentDays}</strong> days of the Partner receiving the corresponding client payment and confirming it with JEVXO.</li>
                <li>The Agent should maintain their own record of closed sales and active subscriptions to reconcile against the Partner&apos;s reports.</li>
              </ul>
            </Section>
          )}

          {/* ── Section 06 ── */}
          {isCSP ? (
            <Section num="06" title="Marketing Responsibility">
              <p>
                Given the combined earning structure in Section 5 (base commission, recurring commission, and override commission), the Partner and their agent network are responsible for carrying out general and local marketing activities within the Territory — including client outreach, local promotion, and awareness campaigns — as a standard part of the Partner role. JEVXO will continue to provide branding materials, product training, and platform support, but day-to-day local marketing execution is the responsibility of the Country Sales Partner.
              </p>
            </Section>
          ) : (
            <Section num="06" title="Marketing Responsibility">
              <p>
                The Agent carries out local marketing and outreach activities as directed by and in support of the Country Sales Partner. This includes client meetings, local promotion, and awareness activities within the assigned local area. The Agent&apos;s marketing efforts align with the broader Territory marketing responsibility held by the Country Sales Partner.
              </p>
            </Section>
          )}

          {/* ── Section 07 (CSP: Local Currency | salesAgent: Term & Termination) ── */}
          {isCSP ? (
            <Section num="07" title="Local Currency Payment Collection">
              <p>
                The Partner is responsible for collecting client payments within the Territory in the local currency, using payment methods appropriate to that market.
              </p>
              <ul className="list-disc ml-5 mt-1 space-y-0.5">
                <li>The Partner must report collected amounts to JEVXO in USD-equivalent value for commission calculation and reconciliation.</li>
                <li>Currency conversion and local transaction costs are managed by the Partner as part of standard operations.</li>
                <li>JEVXO may provide guidance on approved local payment channels but does not directly process client payments on the Partner&apos;s behalf unless separately agreed in writing.</li>
              </ul>
            </Section>
          ) : (
            <Section num="07" title="Term &amp; Termination">
              <ul className="list-disc ml-5 space-y-0.5">
                <li>This Agreement remains in effect from the Date of Agreement until terminated by either party.</li>
                <li>Either party may terminate this Agreement with <strong>[{d.noticePeriodSales}]</strong> days&apos; written notice to the other.</li>
                <li>Commission already earned on active client subscriptions prior to termination remains payable according to the standard recurring commission terms, unless the Agent&apos;s conduct directly caused the client relationship to end.</li>
                <li>The Partner may terminate this Agreement immediately if the Agent is found acting outside JEVXO&apos;s standards, misrepresenting pricing, or violating confidentiality.</li>
              </ul>
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
          <ContinuationHeader refId={d.salesRefId} date={d.date} title={docTitle} />

          {/* ── Section 08 (CSP: Term & Termination | salesAgent: Confidentiality) ── */}
          {isCSP ? (
            <Section num="08" title="Term &amp; Termination">
              <ul className="list-disc ml-5 space-y-0.5">
                <li>This Agreement remains in effect from the Date of Agreement until terminated by either party in accordance with this Section.</li>
                <li>Either party may terminate this Agreement with <strong>[{d.noticePeriodSales}]</strong> days&apos; written notice.</li>
                <li>Any client websites or apps under active subscription at the time of Partner termination continue to be governed by JEVXO&apos;s standard client terms, including the 3-month notice requirement for planned shutdowns and the 5-day payment window described in JEVXO&apos;s Global Pricing Guide.</li>
                <li>Commission owed for revenue generated prior to termination remains payable according to the standard billing cycle.</li>
              </ul>
            </Section>
          ) : (
            <Section num="08" title="Confidentiality">
              <p>
                The Agent agrees to keep confidential all non-public business information shared by the Partner or JEVXO, including pricing structures, client data, commission terms, and internal strategy, both during and after the term of this Agreement.
              </p>
            </Section>
          )}

          {/* ── Section 09 (CSP: Confidentiality | salesAgent: Independent Contractor) ── */}
          {isCSP ? (
            <Section num="09" title="Confidentiality">
              <p>
                The Partner agrees to keep confidential all non-public business information shared by JEVXO, including pricing structures, client data, commission terms, and internal strategy, both during and after the term of this Agreement.
              </p>
            </Section>
          ) : (
            <Section num="09" title="Independent Contractor Status">
              <p>
                The Agent operates as an independent contractor and not as an employee of the Partner or of JEVXO. The Agent is responsible for their own taxes, licenses, and local regulatory compliance.
              </p>
            </Section>
          )}

          {/* ── Section 10 (CSP: Independent Contractor | salesAgent: Governing Law) ── */}
          {isCSP ? (
            <Section num="10" title="Independent Contractor Status">
              <p>
                The Partner operates as an independent contractor and not as an employee, agent (in the legal sense), partner, or joint venturer of JEVXO. The Partner is responsible for their own taxes, licenses, and local regulatory compliance within the Territory.
              </p>
            </Section>
          ) : (
            <Section num="10" title="Governing Law &amp; Dispute Resolution">
              <p>
                This Agreement is governed by the laws of <strong>{d.governingJurisdiction}</strong>. Any disputes arising from this Agreement will first be addressed through good-faith written discussion between the Agent and the Partner before pursuing formal resolution.
              </p>
              <p className="mt-1 text-[11.5px] italic text-slate-500">
                Note: This template is provided as a standardized business document, not as formal legal advice. Because Sales Agent Agreements will be used across multiple countries with different labor and contractor laws, each Territory version should be reviewed by a local qualified lawyer before signing, particularly for Sections 6, 7, 8 and 9.
              </p>
            </Section>
          )}

          {/* ── Section 11 (CSP: Governing Law | salesAgent: Summary) ── */}
          {isCSP ? (
            <Section num="11" title="Governing Law &amp; Dispute Resolution">
              <p>
                This Agreement is governed by the laws of <strong>{d.governingJurisdiction}</strong>. Any disputes arising from this Agreement will first be addressed through good-faith written discussion between both parties before pursuing formal resolution.
              </p>
              <p className="mt-1 text-[11.5px] italic text-slate-500">
                Note: This template is provided as a standardized business document, not as formal legal advice. Because this Agreement will be used across multiple countries with different legal systems, JEVXO should have each Territory version reviewed by a local qualified lawyer before signing, particularly for Sections 8, 9, 10 and 11.
              </p>
            </Section>
          ) : (
            <Section num="11" title="Summary of Standard Terms">
              <SummaryTable
                rows={[
                  ["Reports To", "Country Sales Partner (not JEVXO directly)"],
                  ["Sales Commission", "10% of Gross Sale Value"],
                  ["Recurring Monthly Commission", "10% of active subscription revenue"],
                  ["Payment Collection", "Handled by / through the Country Sales Partner"],
                  ["Marketing Responsibility", "Agent supports local marketing under Partner's direction"],
                  ["Contractor Status", "Independent contractor, not an employee"],
                ]}
              />
            </Section>
          )}

          {/* ── Section 12 / Summary (CSP only on page 3) ── */}
          {isCSP && (
            <Section num="12" title="Summary of Standard Terms">
              <SummaryTable
                rows={[
                  ["Exclusivity", "Selected per Partner (Exclusive / Non-Exclusive)"],
                  ["Sales Agent Network", "Approved — open recruitment, monthly reporting required"],
                  ["Base Commission", "10% of Gross Sale Value"],
                  ["Recurring Monthly Commission", "12% of active subscription revenue"],
                  ["Override Commission", "10% on agent network sales"],
                  ["Local Marketing Responsibility", "Country Sales Partner & agent network"],
                  ["Payment Collection", "Local currency, collected by Country Sales Partner"],
                ]}
              />
            </Section>
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

      {/* ══════════════════════════════════════════════ PAGE 4 ══ */}
      <DocumentLayout pageNum={4} refProp={previewRefs[3]}>
        <div className="px-10 pt-8 pb-0 flex flex-col flex-1">
          <ContinuationHeader refId={d.salesRefId} date={d.date} title={docTitle} />

          {/* Signature page heading */}
          <div className="mb-4">
            <h3 className="font-sans font-bold text-[15px] uppercase tracking-wider text-slate-800">
              Section 12 — Signatures
            </h3>
            <p className="text-[12.5px] text-slate-600 mt-1 leading-relaxed font-sans text-justify">
              By signing below, both parties confirm that they have read, understood, and agreed to all terms set out in this{" "}
              {docTitle}. This Agreement becomes legally effective as of the Date of Agreement stated in Section 1.
            </p>
          </div>

          <SignatureSection
            party1={sigParty1}
            party2={sigParty2}
            titleText="Acceptance & Executory Signatures"
            bodyText={
              isCSP
                ? `This Country Sales Partner Agreement is executed between JEVXO and ${d.partnerName} as Country Sales Partner for the Territory of ${d.territory}, effective ${d.date}.`
                : `This Sales Agent Agreement is executed between ${d.partnerName} (Country Sales Partner) and ${secondParty.fullName || "Agent Name"} (Sales Agent) for the Territory of ${d.territory}, effective ${d.date}.`
            }
          />
        </div>
        <DocumentFooter
          email={d.companyEmail}
          website={d.companyWebsite}
          address={d.companyAddress}
          pageNum={4}
          totalPages={totalPages}
        />
      </DocumentLayout>
    </div>
  );
}
