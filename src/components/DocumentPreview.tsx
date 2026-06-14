import React from "react";
import JevxoLogo from "./JevxoLogo";
import XLogo from "../../assets/x-logo.jpg";
import Image from "next/image";
import { FirstParty, SecondParty, DocSettings } from "../types";

interface DocumentPreviewProps {
  firstParty: FirstParty;
  secondParty: SecondParty;
  settings: DocSettings;
  layoutMode?: "comfortable" | "compact";
  accentColor?: string;
  previewRef1?: React.RefObject<HTMLDivElement | null>;
  previewRef2?: React.RefObject<HTMLDivElement | null>;
  previewRef3?: React.RefObject<HTMLDivElement | null>;
  previewRef4?: React.RefObject<HTMLDivElement | null>;
  previewRef5?: React.RefObject<HTMLDivElement | null>;
  isDemo?: boolean;
}

export default function DocumentPreview({
  firstParty,
  secondParty,
  settings,
  layoutMode = "comfortable",
}: DocumentPreviewProps) {
  // Transform form data into document-ready format
  const safeData = {
    documentId: "JEVXO-2026-DOC-001",
    date: settings.date || new Date().toLocaleDateString(),
    tagline: "INNOVATING BEYOND BOUNDARIES",
    companyName: firstParty.companyName || "JEVXO",
    companyRepName: firstParty.representedBy || "N/A",
    companyRepRole: firstParty.role || "Founder",
    companyCurrentAddress: firstParty.currentAddress || "Address not provided",
    companyPermanentAddress:
      firstParty.permanentAddress || "Address not provided",
    companyMobile: firstParty.mobileNumber || "+880-XXX-XXXXXX",
    companyNid: firstParty.nidNumber || "N/A",
    partnerName: secondParty.fullName || "Partner Name",
    partnerFatherName: secondParty.guardianName || "Father Name",
    partnerPresentAddress: secondParty.presentAddress || "Address not provided",
    partnerPermanentAddress:
      secondParty.permanentAddress || "Address not provided",
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

  return (
    <div
      id="document-preview-container"
      className="w-full flex flex-col gap-8 print:gap-0 select-text"
    >
      {/* ==================== PAGE 1 ==================== */}
      <div
        id="document-page-1"
        className="relative bg-white text-slate-800 shadow-2xl p-10 md:p-14 w-full flex flex-col justify-between overflow-hidden border border-slate-100 print:border-none print:shadow-none print:p-0"
        style={{
          boxSizing: "border-box",
          aspectRatio: layoutMode === "comfortable" ? "1 / 1.414" : "auto",
          minHeight: "297mm", // A4 height standard fallback
        }}
      >
        {/* Subtle decorative geometric overlay corner */}
        <div className="absolute top-0 right-0 w-64 h-2 bg-gradient-to-l from-indigo-600 via-sky-500 to-transparent" />
        <div className="absolute top-2.25 right-0 w-48 h-2 bg-gradient-to-r from-transparent via-indigo-600 to-sky-500" />

        {/* Watermark from XLogo component */}
        <Image
          src={XLogo}
          alt="Watermark"
          width={520}
          height={520}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-25"
        />

        <div className="z-10 flex flex-col flex-grow">
          {/* Header Layout */}
          <header
            id="page-header"
            className="flex justify-between items-start border-b-2 border-slate-900 pb-5 mb-2 relative"
          >
            <div className="flex flex-col">
              <JevxoLogo
                size={46}
                showText={true}
                showTagline={true}
                tagline="A subscription based business ecosystem"
              />
              <p className="text-center text-slate-500 text-sm font-medium">
                A global subscription-based digital business ecosystem
              </p>
            </div>
            <div className="flex flex-col items-end text-right font-sans">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                Agreement Document
              </span>
              <div className="bg-slate-900 text-white text-xs px-3 py-1 font-mono font-semibold tracking-wider rounded">
                Ref: {safeData.documentId}
              </div>
              <span className="text-[11px] font-medium text-slate-500 mt-1.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full inline-block"></span>
                Date: {safeData.date}
              </span>
            </div>

            {/* Tech line indicator under header */}
            <div className="absolute -bottom-[2px] left-0 w-48 h-[2px] bg-gradient-to-r from-indigo-500 to-sky-400"></div>
          </header>

          {/* Document Title */}
          <div id="doc-title-container" className="text-center my-4">
            <h1 className="font-sans font-black text-[30px] tracking-wide text-slate-900 uppercase">
              Letter of Appointment
            </h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <div className="h-[1px] w-8 bg-slate-300"></div>
              <h2 className="font-sans text-[16px] font-bold tracking-[0.25em] text-indigo-600 uppercase">
                &amp; Partnership Agreement
              </h2>
              <div className="h-[1px] w-8 bg-slate-300"></div>
            </div>
          </div>

          {/* Parties Introduction */}
          <div
            id="parties-description"
            className="text-[14px] text-slate-600 mb-3 leading-relaxed font-sans border-l-2 border-slate-200 pl-4 py-1 italic"
          >
            This Appointment Letter and Partnership Agreement is declared and
            entered into on{" "}
            <strong className="text-slate-800 font-semibold">
              {safeData.date}
            </strong>{" "}
            by and between the following parties:
          </div>

          {/* TWO PARTY GRIDS (Professional Grid Placement with Clean Alignment) */}
          <div
            id="parties-grids"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
          >
            {/* First Party Card */}
            <div
              id="first-party-card"
              className="bg-slate-50/50 border border-slate-100 rounded-lg p-4 flex flex-col justify-between shadow-sm relative overflow-hidden backdrop-blur-xs"
            >
              <div className="absolute top-0 left-0 w-12 h-[3px] bg-indigo-500"></div>
              <div>
                <span className="text-[12px] uppercase tracking-wider font-extrabold text-indigo-600 font-mono block mb-1">
                  First Party (Company)
                </span>
                <h3 className="font-sans font-extrabold text-slate-900 text-[18px] mb-3 border-b border-slate-200/60 pb-1.5">
                  {safeData.companyName}
                </h3>

                <div className="space-y-2 text-[14px]">
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-400 font-medium">Rep. By:</span>
                    <span className="col-span-2 text-slate-800 font-semibold">
                      {safeData.companyRepName}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-400 font-medium">Role:</span>
                    <span className="col-span-2 text-slate-700">
                      {safeData.companyRepRole}
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
                  <div className="mt-2 border-t border-slate-200/40 pt-2">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase block mb-0.5">
                      Current Address:
                    </span>
                    <span className="text-slate-700 text-[12px] leading-tight block">
                      {safeData.companyCurrentAddress}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Party Card */}
            <div
              id="second-party-card"
              className="bg-slate-50/50 border border-slate-100 rounded-lg p-5 flex flex-col justify-between shadow-sm relative overflow-hidden backdrop-blur-xs"
            >
              <div className="absolute top-0 left-0 w-12 h-[3px] bg-sky-500"></div>
              <div>
                <span className="text-[12px] uppercase tracking-wider font-extrabold text-sky-600 font-mono block mb-1">
                  Second Party (Partner)
                </span>
                <h3 className="font-sans font-extrabold text-slate-900 text-[18px] mb-3 border-b border-slate-200/60 pb-1.5">
                  {safeData.partnerName}
                </h3>

                <div className="space-y-2 text-[14px]">
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-400 font-medium">
                      Position:
                    </span>
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
                    <span className="text-slate-400 font-medium font-sans">
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
                  <div className="mt-2 border-t border-slate-200/40 pt-2">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase block mb-0.5">
                      Current Address:
                    </span>
                    <span className="text-slate-700 text-[12px] leading-tight block">
                      {safeData.partnerPresentAddress}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1: Appointment */}
          <section id="section-appointment" className="mb-5 z-10">
            <h4 className="font-sans font-bold text-[18px] uppercase tracking-wider text-indigo-600 mb-1 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-800 text-[12px] font-mono px-1.5 py-0.5 rounded">
                01
              </span>
              Appointment
            </h4>
            <div className="text-[14px] text-slate-700 leading-relaxed text-justify font-sans bg-white/50 border border-slate-100 p-4 rounded-md shadow-sm">
              <p className="mb-2 font-medium">
                Dear{" "}
                <strong className="text-slate-900 font-semibold">
                  {safeData.partnerName}
                </strong>
                ,
              </p>
              <p className="mb-1">
                We are pleased to formally appoint you as a{" "}
                <strong className="text-slate-900 font-semibold">
                  {safeData.partnerPosition}
                </strong>{" "}
                at{" "}
                <strong className="text-slate-900 font-semibold">
                  {safeData.companyName}
                </strong>
                .
              </p>
              <p>
                Your appointment reflects our confidence in your technical
                abilities, professional integrity, and potential contribution to
                the long-term growth of the company.
              </p>
            </div>
          </section>

          {/* SECTION 2: Role & Ownership Mindset */}
          <section id="section-role-ownership" className="mb-5 z-10">
            <h4 className="font-sans font-bold text-[18px] uppercase tracking-wider text-indigo-600 mb-1 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-800 text-[12px] font-mono px-1.5 py-0.5 rounded">
                02
              </span>
              Professional Responsibilities
            </h4>
            <div className="text-[14px] text-slate-700 leading-relaxed text-justify font-sans bg-white/50 border border-slate-100 p-4 rounded-md shadow-sm">
              <p className="text-slate-600">
                <strong className="text-slate-800 font-medium">
                  {safeData.companyName}
                </strong>{" "}
                is not a conventional workplace; it operates under a
                partnership-based model. As such, you are not merely an employee
                but <strong> a valued Partner </strong> of the organization.
                Accordingly, the Partner is expected to demonstrate an{" "}
                <strong> ownership mindset </strong>, take responsibility,
                contribute actively toward the{" "}
                <strong> Company's growth</strong>, sustainability and long-term
                objectives while maintaining the{" "}
                <strong> highest standards of professionalism</strong>,
                integrity, accountability and <strong> ethical conduct</strong>.{" "}
                <br />
                The Partner shall perform assigned duties and responsibilities
                diligently and in accordance with the Company's policies,
                operational requirements, and strategic objectives.
              </p>
            </div>
          </section>

          {/* SECTION 3: Equity & Share Distribution */}
          <section id="section-equity-distribution" className="mb-4 z-10">
            <h4 className="font-sans font-bold text-[18px] uppercase tracking-wider text-indigo-600 mb-1 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-800 text-[12px] font-mono px-1.5 py-0.5 rounded">
                03
              </span>
              Equity &amp; Share Distribution
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-[14px]">
              <div className="bg-emerald-50/30 border border-emerald-100/60 shadow-sm rounded-md p-3">
                <span className="text-[14px] uppercase font-bold text-emerald-800 block mb-1">
                  Partnership Equity
                </span>
                <span className="text-2xl font-black text-emerald-700 tracking-tight block mb-1">
                  {safeData.equityShare}
                </span>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Agreed permanent equity share
                </p>
              </div>
              <div className="bg-indigo-50/30 border shadow-sm border-indigo-100/60 rounded-md p-3 col-span-2">
                <span className="text-[14px] uppercase font-bold text-indigo-800 block mb-1">
                  Minimum Service Period
                </span>
                <p className="text-slate-700 leading-relaxed">
                  To become eligible for partnership equity, you must
                  successfully perform your responsibilities within the company
                  for a minimum period of{" "}
                  <strong className="text-indigo-900 font-bold">
                    {safeData.minServicePeriod}
                  </strong>
                  .
                </p>
              </div>
            </div>

            <div className="mt-3 text-[14px] text-slate-600 leading-relaxed text-justify bg-white/50 border border-slate-100 p-4 rounded-md shadow-sm">
              <p className="mb-2">
                <strong className="text-slate-800 font-semibold block mb-0.5">
                  Equity Allocation Agreement:
                </strong>
                The allocation of the agreed{" "}
                <strong className="text-indigo-600 font-bold">
                  {safeData.equityShare}
                </strong>{" "}
                <strong> equity share </strong> shall be executed through a
                separate legally binding agreement. This agreement will clearly
                define the ownership structure, rights, responsibilities,
                vesting conditions and all other relevant terms and conditions
                associated with the equity.
              </p>
              <p>
                <strong className="text-slate-800 font-semibold block mb-0.5">
                  Equity Continuity:
                </strong>
                Once granted, the equity share shall remain valid and effective
                in accordance with the company's applicable policies,
                shareholder agreements and the terms outlined in the relevant
                legal documentation. The ownership and retention of such equity
                shall be subject to compliance with those terms and conditions.
              </p>
            </div>
          </section>
        </div>

        {/* Footer Page 1 */}
        <footer
          id="page-1-footer"
          className="mt-2 pt-4 border-t border-slate-200 text-[14px] text-slate-400 font-mono flex justify-between items-center z-10"
        >
          <div className="flex gap-4">
            <span>
              Email:{" "}
              <strong className="text-slate-600 font-semibold">
                {safeData.companyEmail}
              </strong>
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">
              Web:{" "}
              <strong className="text-slate-600 font-semibold">
                {safeData.companyWebsite}
              </strong>
            </span>
          </div>
          <div>Page 1 of 2</div>
        </footer>
        {/* Subtle decorative geometric overlay corner */}
        <div className="absolute bottom-0 left-0 w-64 h-2 bg-gradient-to-l from-transparent via-sky-500 to-indigo-600" />
        <div className="absolute bottom-2.25 left-0 w-48 h-2 bg-gradient-to-r from-sky-500 via-indigo-600 to-transparent" />
      </div>

      {/* PAGE BREAK (Force break when printing, comfortable layout spacing screen) */}
      <div className="print:break-after-page print:h-0 print:m-0 print:p-0 my-4" />

      {/* ==================== PAGE 2 ==================== */}
      <div
        id="document-page-2"
        className="relative bg-white text-slate-800 shadow-2xl p-10 md:p-14 w-full flex flex-col justify-between overflow-hidden border border-slate-100 print:border-none print:shadow-none print:p-0"
        style={{
          boxSizing: "border-box",
          aspectRatio: layoutMode === "comfortable" ? "1 / 1.414" : "auto",
          minHeight: "297mm", // A4 height standard fallback
        }}
      >
        {/* Subtle decorative geometric overlay corner */}
        <div className="absolute top-0 right-0 w-64 h-2 bg-gradient-to-l from-indigo-600 via-sky-500 to-transparent" />
        <div className="absolute top-2.25 right-0 w-48 h-2 bg-gradient-to-r from-transparent via-indigo-600 to-sky-500" />

        {/* Watermark from XLogo component */}
        <Image
          src={XLogo}
          alt="Watermark"
          width={520}
          height={520}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-25"
        />

        <div className="z-10 flex flex-col flex-grow">
          {/* Sibling Header for consistency across printed pages */}
          <header
            id="page-header-2"
            className="flex justify-between items-start border-b border-slate-200 pb-3 mb-6"
          >
            <span className="font-sans text-xs font-bold tracking-wider text-slate-500">
              JEVXO PARTNERSHIP DEED &amp; POLICY
            </span>
            <div className="text-right text-[10px] font-mono text-slate-400">
              Ref: {safeData.documentId} | Date: {safeData.date}
            </div>
          </header>

          {/* SECTION 4: Place of Work (Remote Work Policy) */}
          <section id="section-place-of-work" className="mb-5 z-10">
            <h4 className="font-sans font-bold text-[18px] uppercase tracking-wider text-indigo-600 mb-1 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-800 text-[12px] font-mono px-1.5 py-0.5 rounded">
                04
              </span>
              Place of Work (Remote Work Policy)
            </h4>
            <div className="text-[14px] text-slate-700 leading-relaxed text-justify font-sans bg-white/50 border border-slate-100 p-4 rounded-md shadow-sm">
              <p className="mb-2">
                At present, all duties and responsibilities under this agreement
                shall be performed on a{" "}
                <strong className="text-indigo-600 font-semibold">
                  remote basis
                </strong>
                .
              </p>
              <p className="text-slate-600">
                The Company reserves the right to transition operations to a
                physical office environment when it reaches a sustainable and
                profitable stage. In such circumstances, the Partner shall be
                notified in advance through an official written notice and
                reasonable arrangements shall be made for the transition.
              </p>
            </div>
          </section>

          {/* SECTION 5: Confidentiality & NDA */}
          <section id="section-confidentiality-nda" className="mb-5 z-10">
            <h4 className="font-sans font-bold text-[18px] uppercase tracking-wider text-indigo-600 mb-1 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-800 text-[12px] font-mono px-1.5 py-0.5 rounded">
                05
              </span>
              Confidentiality &amp; Non-Disclosure Agreement (NDA)
            </h4>
            <div className="text-[14px] text-slate-700 leading-relaxed text-justify font-sans bg-white/50 border border-slate-100 p-4 rounded-md shadow-sm">
              <p className="mb-2 text-slate-800 font-medium">
                All company-related information, including but not limited to
                projects, source code, client data, business strategies,
                financial information, intellectual property, and future plans,
                shall be treated as strictly confidential.
              </p>
              <p className="text-slate-600 mb-2">
                The Partner agrees not to disclose, share, reproduce, distribute
                or misuse any confidential information without prior written
                authorization from the Company. Any unauthorized disclosure or
                misuse of confidential information shall be considered a
                material breach of this agreement and may result in legal
                action, claims for damages and other remedies available under
                applicable law.
              </p>
              <p className="text-slate-600 font-medium italic border-t border-slate-100 pt-2 text-[12.5px]">
                This confidentiality obligation shall remain in effect during
                the term of this agreement and continue even after the
                termination of the partnership relationship.
              </p>
            </div>
          </section>

          {/* SECTION 6: Intellectual Property Ownership */}
          <section id="section-intellectual-property" className="mb-5 z-10">
            <h4 className="font-sans font-bold text-[18px] uppercase tracking-wider text-indigo-600 mb-1 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-800 text-[12px] font-mono px-1.5 py-0.5 rounded">
                06
              </span>
              Intellectual Property Ownership
            </h4>
            <div className="text-[14px] text-slate-700 leading-relaxed text-justify font-sans bg-white/50 border border-slate-100 p-4 rounded-md shadow-sm">
              <p className="mb-3 text-slate-800 font-medium">
                All source code, software applications, systems, designs,
                documents, inventions, developments, work products, databases,
                content, and other intellectual property created, developed, or
                produced by the Partner in connection with Company activities
                shall remain the exclusive property of{" "}
                <strong className="text-indigo-700 font-bold">
                  {safeData.companyName}
                </strong>{" "}
                unless otherwise agreed in writing.
              </p>
              <p className="text-slate-600 font-medium italic border-t border-slate-100 pt-2 text-[12.5px]">
                The Partner shall not claim ownership of Company intellectual
                property developed during the course of engagement under this
                Agreement.
              </p>
            </div>
          </section>

          {/* SECTION 7: Termination & Resignation */}
          <section id="section-termination-resignation" className="mb-8 z-10">
            <h4 className="font-sans font-bold text-[18px] uppercase tracking-wider text-indigo-600 mb-1 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-800 text-[12px] font-mono px-1.5 py-0.5 rounded">
                07
              </span>
              Termination &amp; Resignation Policy
            </h4>
            <div className="text-[14px] text-slate-700 leading-relaxed text-justify font-sans bg-white/50 border border-slate-100 p-4 rounded-md shadow-sm">
              <p className="mb-2">
                Either Party may terminate this agreement by providing the other
                Party with a minimum of{" "}
                <strong className="text-red-600 font-semibold">
                  {safeData.noticePeriodDays} days'
                </strong>{" "}
                prior written notice.
              </p>
              <p className="text-slate-600 mb-2">
                However, the Company reserves the right to implement{" "}
                <strong className="text-red-700 font-semibold">
                  immediate termination without notice
                </strong>{" "}
                in cases involving fraud, misconduct, breach of confidentiality,
                gross negligence, unethical behavior, violation of company
                policies or any action that causes significant harm to the
                Company's interests, reputation or operations.
              </p>
              <p className="text-slate-600">
                Upon termination, both Parties shall fulfill any outstanding
                obligations and return any Company-owned property, documents,
                credentials or confidential information in their possession.
              </p>
            </div>
          </section>

          {/* SIGNATURES & ACCEPTANCE DETAILS */}
          <section
            id="signatures-acceptance"
            className="mt-auto pt-8 border-t border-slate-200 z-10"
          >
            <h4 className="font-sans font-bold text-indigo-800 text-[18px] uppercase tracking-wider mb-4">
              Acceptance &amp; Executory Signatures
            </h4>
            <p className="text-[14px] text-slate-600 leading-relaxed font-sans mb-6 bg-white/50 p-4 rounded-md border border-slate-100 shadow-sm text-justify">
              I,{" "}
              <strong className="text-slate-800 font-bold">
                {safeData.partnerName}
              </strong>
              , hereby acknowledge that I have read, understood and agreed to
              all the terms and conditions set forth in this Appointment Letter
              and Partnership Policy of{" "}
              <strong className="text-slate-800 font-bold">
                {safeData.companyName}
              </strong>
              . I further undertake to comply with and uphold all obligations,
              responsibilities and policies contained herein.
            </p>

            <div className="grid grid-cols-2 gap-12 pt-10 font-sans text-[14px]">
              {/* Partner Signature */}
              <div className="flex flex-col">
                <div className="mt-6 pt-2 font-semibold text-slate-800 text-center">
                  ..............................................................................
                </div>
                <div className="text-center font-bold text-slate-900 mt-1">
                  {safeData.partnerName}
                </div>
                <div className="text-[12px] text-slate-500 text-center">
                  Partner (Second Party)
                </div>
                <div className="text-[10px] text-slate-400 text-center mt-2">
                  Date: ________________________
                </div>
              </div>

              {/* Founder Signature */}
              <div className="flex flex-col">
                <div className="mt-6 pt-2 font-semibold text-slate-800 text-center">
                  ..............................................................................
                </div>
                <div className="text-center font-bold text-slate-900 mt-1">
                  {safeData.companyRepName}
                </div>
                <div className="text-[12px] text-slate-500 text-center">
                  {safeData.companyRepRole}, {safeData.companyName}
                </div>
                <div className="text-[10px] text-slate-400 text-center mt-2">
                  Date: ________________________
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Global Footer Page 2 */}
        <footer
          id="page-2-footer"
          className="mt-14 pt-4 border-t border-slate-900 text-[14px] text-slate-500 font-mono flex flex-col gap-2 z-10"
        >
          <div className="flex justify-between items-center text-slate-400 py-1 border-b border-slate-100">
            <span>
              Generated by:{" "}
              <strong className="text-indigo-600">HR Document Engine by JEVXO</strong>
            </span>
            <span>Ref: {safeData.documentId}</span>
            <span>Page 2 of 2</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 text-[12px] text-slate-400">
            <div>JEVXO • A global subscription-based digital business ecosystem</div>
            <div className="flex gap-3">
              <span>Web: {safeData.companyWebsite}</span>
              <span>•</span>
              <span>Email: {safeData.companyEmail}</span>
              <span>•</span>
              <span>Contact: {safeData.companyContact}</span>
            </div>
          </div>
        </footer>
        {/* Subtle decorative geometric overlay corner */}
        <div className="absolute bottom-0 left-0 w-48 h-2 bg-gradient-to-l from-transparent via-sky-500 to-indigo-600" />
        <div className="absolute bottom-0 right-0 w-48 h-2 bg-gradient-to-r from-transparent via-sky-500 to-indigo-600" />
      </div>
    </div>
  );
}
