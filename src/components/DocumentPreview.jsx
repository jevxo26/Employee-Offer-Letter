import React from "react";
import JevxoLogo from "./JevxoLogo";
import { numberToWords } from "../utils/numberToWords";

const AppointmentLetterPreview = ({
  firstParty,
  secondParty,
  settings,
  previewRef1,
  previewRef2,
  previewRef3,
}) => {
  const getMonthsText = (months) => {
    const word = numberToWords(months);
    return `${word} (${months})`;
  };

  const getDaysText = (days) => {
    const word = numberToWords(days);
    return `${word} (${days})`;
  };

  const founderSignatureSvg = (
    <svg
      viewBox="0 0 160 50"
      className="w-32 h-10 text-[#2D2A26] opacity-95 select-none pointer-events-none transform -rotate-2 -translate-y-1"
    >
      <path
        d="M 10,25 C 30,10 50,5 65,15 C 80,25 45,45 60,35 C 75,25 90,15 110,20 C 130,25 140,15 150,12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="65" cy="15" r="2" fill="currentColor" />
      <path
        d="M 55,25 Q 70,5 90,30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );

  return (
    <div
      className="flex flex-col items-center gap-10 w-full overflow-y-auto max-h-[85vh] p-4 bg-white/40 rounded-2xl border border-[#EBE5DE] scrollbar-thin scrollbar-thumb-slate-200"
      id="preview_scrollable_deck"
    >
      {/* PAGE 1 */}
      <div
        ref={previewRef1}
        id="jevxo_p1"
        className="relative w-[793px] h-[1122px] bg-white text-slate-900 px-14 py-12 flex flex-col justify-between shadow-2xl rounded-sm shrink-0 select-none overflow-hidden text-[13.5px] leading-[1.45]"
        style={{ fontFamily: '"Inter", sans-serif' }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none z-0">
          <div className="transform -rotate-12 scale-[2.2]">
            <JevxoLogo size="lg" />
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-[155px] pointer-events-none z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-[420px] h-[35px] bg-[#2563EB] transform -skew-x-30 origin-top-left shadow-lg"></div>
          <div className="absolute top-0 left-0 w-[200px] h-[45px] bg-[#3B82F6] transform -skew-x-30 origin-top-left opacity-90"></div>
          <div className="absolute top-0 left-0 w-[140px] h-[140px] bg-gradient-to-br from-indigo-600 to-blue-500 rounded-full blur-2xl opacity-15 -translate-x-12 -translate-y-12"></div>
          <div className="absolute top-0 right-0 w-[150px] h-[10px] bg-cyan-400 transform -skew-x-45 origin-top-right"></div>
          <div className="absolute top-[8px] right-0 w-[90px] h-[6px] bg-[#2563EB] opacity-60 transform -skew-x-45 origin-top-right"></div>
        </div>

        <div className="relative z-20 flex flex-col items-center pt-8">
          <JevxoLogo size="md" />
          <div className="w-full h-[2.5px] bg-gradient-to-r from-transparent via-[#2563EB] to-transparent mt-3"></div>
          <h1
            className="text-center font-bold text-[#2563EB] tracking-wider text-[20px] mt-6 select-text uppercase"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            LETTER OF APPOINTMENT & PARTNERSHIP AGREEMENT
          </h1>
        </div>

        <div className="relative z-20 flex flex-col gap-5 select-text">
          <div className="flex justify-end text-slate-800 font-bold text-[13.5px]">
            Date : {settings.date}
          </div>

          <div>
            <h2 className="font-bold text-primary text-[14.5px] border-b border-[#EBE5DE] pb-1 mb-2 tracking-wide uppercase">
              First Party (Company):-
            </h2>
            <div className="grid grid-cols-1 gap-y-0.5 pl-2 text-slate-800 font-medium">
              <div>
                <span className="font-bold text-slate-900 w-[190px] inline-block">
                  Company Name:-
                </span>{" "}
                {firstParty.companyName}
              </div>
              <div>
                <span className="font-bold text-slate-900 w-[190px] inline-block">
                  Represented By:-
                </span>{" "}
                {firstParty.representedBy}
              </div>
              <div>
                <span className="font-bold text-slate-900 w-[190px] inline-block">
                  Current Address:-
                </span>{" "}
                {firstParty.currentAddress}
              </div>
              <div>
                <span className="font-bold text-slate-900 w-[190px] inline-block">
                  Permanent Address:-
                </span>{" "}
                {firstParty.permanentAddress}
              </div>
              <div>
                <span className="font-bold text-slate-900 w-[190px] inline-block">
                  Mobile Number:-
                </span>{" "}
                {firstParty.mobileNumber}
              </div>
              <div>
                <span className="font-bold text-slate-900 w-[190px] inline-block">
                  National ID (NID) Number:-
                </span>{" "}
                {firstParty.nidNumber}
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-bold text-[#2563EB] text-[14.5px] border-b border-[#EBE5DE] pb-1 mb-2 tracking-wide uppercase">
              Second Party (Partner):-
            </h2>
            <div className="grid grid-cols-1 gap-y-0.5 pl-2 text-slate-800 font-medium">
              <div>
                <span className="font-bold text-slate-900 w-[190px] inline-block">
                  Name:-
                </span>{" "}
                {secondParty.fullName || "____________________"}
              </div>
              <div>
                <span className="font-bold text-slate-900 w-[190px] inline-block">
                  {secondParty.guardianRelation}'s Name:-
                </span>{" "}
                {secondParty.guardianName || "____________________"}
              </div>
              <div>
                <span className="font-bold text-slate-900 w-[190px] inline-block">
                  Present Address:-
                </span>{" "}
                {secondParty.presentAddress || "____________________"}
              </div>
              <div>
                <span className="font-bold text-slate-900 w-[190px] inline-block">
                  Permanent Address:-
                </span>{" "}
                {secondParty.permanentAddress || "____________________"}
              </div>
              <div>
                <span className="font-bold text-slate-900 w-[190px] inline-block">
                  National ID (NID) Number:-
                </span>{" "}
                {secondParty.nidNumber || "____________________"}
              </div>
              <div>
                <span className="font-bold text-slate-900 w-[190px] inline-block">
                  Mobile Number:-
                </span>{" "}
                {secondParty.mobileNumber || "____________________"}
              </div>
              <div>
                <span className="font-bold text-slate-900 w-[190px] inline-block">
                  {secondParty.guardianRelation}'s Mobile:-
                </span>{" "}
                {secondParty.guardianMobile || "____________________"}
              </div>
              <div>
                <span className="font-bold text-slate-900 w-[190px] inline-block">
                  Position:-
                </span>{" "}
                <span className="font-bold text-[#2563EB]">
                  {secondParty.position || "____________________"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="font-bold text-primary text-[14px] uppercase tracking-wide">
              Role & Ownership Mindset
            </h2>
            <p className="text-slate-800 text-justify text-[13px] leading-relaxed">
              You are hereby appointed as the{" "}
              <strong className="font-bold">
                {secondParty.position || "[Position]"}
              </strong>{" "}
              of <strong className="font-bold">{firstParty.companyName}</strong>
              . Please note that JEVXO is not a conventional workplace; it
              operates under a{" "}
              <strong className="font-bold">partnership-based model</strong>. As
              such, you are not merely an employee but a valued{" "}
              <strong className="font-bold">Partner</strong> of the
              organization. In this role, you are expected to demonstrate an{" "}
              <strong className="font-bold">ownership mindset</strong>, take
              responsibility for the company's growth and success, and
              consistently uphold the highest standards of professionalism,
              integrity, and accountability. As a Partner, your contributions
              should reflect the commitment, dedication, and strategic thinking
              of a business owner, working collaboratively to achieve JEVXO's
              long-term vision, objectives, and sustainable growth.
            </p>
          </div>

          <h2 className="font-bold text-primary text-[14px] uppercase tracking-wide">
            Equity & Share Distribution:
          </h2>

          <div className="space-y-1">
            <h2 className="font-bold text-primary text-[14px] uppercase tracking-wide">
              Minimum Service Period
            </h2>
            <p className="text-slate-800 text-justify text-[13px] leading-relaxed">
              To become eligible for partnership equity, you must successfully
              perform your responsibilities within the company for a minimum
              period of{" "}
              <strong className="font-bold">
                {getMonthsText(settings.minimumServicePeriod)} months
              </strong>
              .
            </p>
          </div>
        </div>

        <div className="relative z-20 border-t border-slate-200 pt-3 flex justify-between items-center text-[10.5px] text-slate-500 font-medium select-text">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></span>
              {firstParty.mobileNumber}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></span>
              {firstParty.email}
            </span>
          </div>
          <div>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></span>
              {firstParty.website}
            </span>
          </div>
          <div className="absolute -bottom-12 -right-14 w-[160px] h-[70px] bg-gradient-to-tl from-indigo-700 to-blue-500 transform skew-y-12 origin-bottom-right opacity-85 pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-14 w-[80px] h-[35px] bg-[#3B82F6] transform -skew-y-12 origin-bottom-left opacity-35 pointer-events-none"></div>
        </div>
      </div>

      {/* PAGE 2 */}
      <div
        ref={previewRef2}
        id="jevxo_p2"
        className="relative w-[793px] h-[1122px] bg-white text-slate-900 px-14 py-12 flex flex-col justify-between shadow-2xl rounded-sm shrink-0 select-none overflow-hidden text-[13.5px] leading-[1.45]"
        style={{ fontFamily: '"Inter", sans-serif' }}
      >
        {/* Background Watermark */}

        <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none z-0">
          <div className="transform -rotate-12 scale-[2.2]">
            <JevxoLogo size="lg" />
          </div>
        </div>

        {/* Diagonal Ribbon Header */}

        <div className="absolute top-0 left-0 w-full h-[155px] pointer-events-none z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-[420px] h-[35px] bg-[#2563EB] transform -skew-x-30 origin-top-left shadow-lg"></div>

          <div className="absolute top-0 left-0 w-[200px] h-[45px] bg-[#3B82F6] transform -skew-x-30 origin-top-left opacity-90"></div>

          <div className="absolute top-0 right-0 w-[150px] h-[10px] bg-cyan-400 transform -skew-x-45 origin-top-right"></div>
        </div>

        {/* Page 2 Logo */}

        <div className="relative z-20 flex flex-col pt-8">
          <div className="flex justify-center">
            <JevxoLogo size="md" />
          </div>

          <div className="w-full h-[1.5px] bg-slate-100 mt-2"></div>
        </div>

        {/* Page 2 Content Clauses */}

        <div className="relative z-20 flex flex-col gap-6 mt-6 select-text">
          {/* Equity Allocation Agreement */}

          <div className="space-y-1.5">
            <h2 className="font-bold text-primary text-[14.5px] uppercase tracking-wide">
              Equity Allocation Agreement
            </h2>

            <p className="text-slate-800 text-justify text-[13.2px] leading-relaxed">
              The allocation of the agreed{" "}
              <strong className="font-bold">
                {settings.equityShare}% equity share
              </strong>{" "}
              shall be executed through a separate legally binding agreement.
              This agreement will clearly define the ownership structure,
              rights, responsibilities, vesting conditions, and all other
              relevant terms and conditions associated with the equity.
            </p>
          </div>

          {/* Equity Continuity */}

          <div className="space-y-1.5">
            <h2 className="font-bold text-primary text-[14.5px] uppercase tracking-wide">
              Equity Continuity
            </h2>

            <p className="text-slate-800 text-justify text-[13.2px] leading-relaxed">
              Once granted, the equity share shall remain valid and effective in
              accordance with the company's applicable policies, shareholder
              agreements, and the terms outlined in the relevant legal
              documentation. The ownership and retention of such equity shall be
              subject to compliance with those terms and conditions.
            </p>
          </div>

          {/* Place of Work (Remote Work Policy) */}

          <div className="space-y-1.5">
            <h2 className="font-bold text-primary text-[14.5px] uppercase tracking-wide">
              Place of Work (Remote Work Policy)
            </h2>

            <p className="text-slate-800 text-justify text-[13.2px] leading-relaxed">
              At present, all duties and responsibilities under this agreement
              shall be performed on a remote basis. The Company reserves the
              right to transition operations to a physical office environment
              when it reaches a sustainable and profitable stage. In such
              circumstances, the Partner shall be notified in advance through an
              official written notice, and reasonable arrangements shall be made
              for the transition.
            </p>
          </div>

          {/* Confidentiality & Non-Disclosure Agreement (NDA) */}

          <div className="space-y-2">
            <h2 className="font-bold text-primary text-[14.5px] uppercase tracking-wide">
              Confidentiality & Non-Disclosure Agreement (NDA)
            </h2>

            <p className="text-slate-800 text-justify text-[13.2px] leading-relaxed mb-2">
              All company-related information, including but not limited to
              projects, source code, client data, business strategies, financial
              information, intellectual property, and future plans, shall be
              treated as strictly confidential.
            </p>

            <p className="text-slate-800 text-justify text-[13.2px] leading-relaxed">
              The Partner agrees not to disclose, share, reproduce, distribute,
              or misuse any confidential information without prior written
              authorization from the Company. Any unauthorized disclosure or
              misuse of confidential information shall be considered a material
              breach of this agreement and may result in legal action, claims
              for damages, and other remedies available under applicable law.
              This confidentiality obligation shall remain in effect during the
              term of this agreement and continue even after the termination of
              the partnership relationship.
            </p>
          </div>

          {/* Termination & Resignation */}

          <div className="space-y-1.5">
            <h2 className="font-bold text-primary text-[14.5px] uppercase tracking-wide">
              Termination & Resignation
            </h2>

            <p className="text-slate-800 text-justify text-[13.2px] leading-relaxed">
              Either Party may terminate this agreement by providing the other
              Party with a minimum of{" "}
              <strong className="font-bold">
                {getDaysText(settings.noticePeriod)} days'
              </strong>{" "}
              prior written notice.
            </p>
          </div>

          <div className="relative z-20 flex flex-col justify-between h-full py-4 select-text">
            <div className="space-y-4">
              <p className="text-slate-800 text-justify text-[13.2px] leading-relaxed">
                However, the Company reserves the right to implement immediate
                termination without notice in cases involving fraud, misconduct,
                breach of confidentiality, gross negligence, unethical behavior,
                violation of company policies, or any action that causes
                significant harm to the Company's interests, reputation, or
                operations.
              </p>

              <p className="text-slate-800 text-justify text-[13.2px] leading-relaxed">
                Upon termination, both Parties shall fulfill any outstanding
                obligations and return any Company owned property, documents,
                credentials, or confidential information in their possession.
              </p>
            </div>

            {/* Big custom center watermarked symbol for acceptance */}

            <div className="flex justify-center items-center my-6 py-6 opacity-10">
              <svg
                id="jevxo_p3_watermark"
                viewBox="0 0 100 100"
                className="w-40 h-40 text-blue-600"
              >
                <path
                  d="M10 10 L90 90 M90 10 L10 90"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Acceptance Section & Signatures */}

            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-bold text-primary text-[14.5px] uppercase tracking-wide">
                  Signatures & Acceptance
                </h2>

                <p className="text-slate-800 text-justify text-[13px] leading-relaxed">
                  I,{" "}
                  <strong className="font-bold text-slate-900">
                    {secondParty.fullName || "[Second Party Full Name]"}
                  </strong>
                  , hereby acknowledge that I have read, understood, and agreed
                  to all the terms and conditions set forth in this{" "}
                  <strong className="font-semibold text-slate-900">
                    Appointment Letter and Partnership
                  </strong>{" "}
                  Policy of{" "}
                  <strong className="font-bold text-[#2563EB]">
                    {firstParty.companyName}
                  </strong>
                  . I further undertake to comply with and uphold all{" "}
                  <strong className="font-semibold text-slate-900">
                    obligations, responsibilities, and policies
                  </strong>{" "}
                  contained herein.
                </p>
              </div>

              {/* Signature Placement Fields */}

              <div className="grid grid-cols-1 gap-y-12 pt-8 pl-1">
                {/* Second Party Signature Holder */}

                <div className="relative">
                  {/* Drawn Signature Canvas or Uploaded Image Base64 rendering */}

                  <div className="absolute -top-12 left-10 h-16 w-48 flex items-end justify-start pointer-events-none select-none">
                    {secondParty.signatureImg ? (
                      <img
                        src={secondParty.signatureImg}
                        alt="Second Party Signature"
                        className="max-h-16 max-w-[190px] object-contain block opacity-95 transition-all duration-300"
                      />
                    ) : (
                      <div className="text-rose-500 font-bold tracking-wide animate-pulse text-[11px] bg-rose-50 px-2 py-0.5 border border-rose-200 rounded uppercase">
                        Needs Signature *
                      </div>
                    )}
                  </div>

                  <div className="text-slate-800 font-medium text-[12.5px] border-t border-slate-400 border-dashed pt-1.5 w-[380px]">
                    Signature & Date (Second Party / Partner)
                  </div>
                </div>

                {/* Founder First Party Signature */}

                <div className="relative flex flex-col">
                  <div className="absolute -top-9 left-10 h-12 w-48 flex items-end justify-start pointer-events-none select-none">
                    {founderSignatureSvg}
                  </div>

                  <div className="text-slate-800 font-medium text-[12.5px] border-t border-slate-400 border-dashed pt-1.5 w-[380px]">
                    Signature & Date (Founder, JEVXO)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}

        <div className="relative z-20 border-t border-slate-200 pt-3 flex justify-between items-center text-[10.5px] text-slate-500 font-medium select-text mt-8">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></span>

              {firstParty.mobileNumber}
            </span>

            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></span>

              {firstParty.email}
            </span>
          </div>

          <div>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></span>

              {firstParty.website}
            </span>
          </div>

          <div className="absolute -bottom-12 -right-14 w-[160px] h-[70px] bg-gradient-to-tl from-indigo-700 to-blue-500 transform skew-y-12 origin-bottom-right opacity-85 pointer-events-none"></div>

          <div className="absolute -bottom-12 -left-14 w-[80px] h-[35px] bg-[#3B82F6] transform -skew-y-12 origin-bottom-left opacity-35 pointer-events-none"></div>
        </div>
      </div>

      {/* PAGE 3 */}

      <div
        ref={previewRef3}
        id="jevxo_p3"
        className="relative w-[793px] h-[1122px] bg-white text-slate-900 px-14 py-12 flex flex-col justify-between shadow-2xl rounded-sm shrink-0 select-none overflow-hidden text-[13.5px] leading-[1.45]"
        style={{ fontFamily: '"Inter", sans-serif' }}
      >
        {/* Background Watermark */}

        <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none z-0">
          <div className="transform -rotate-12 scale-[2.2]">
            <JevxoLogo size="lg" />
          </div>
        </div>

        {/* Diagonal Ribbon Header */}

        <div className="absolute top-0 left-0 w-full h-[155px] pointer-events-none z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-[420px] h-[35px] bg-[#2563EB] transform -skew-x-30 origin-top-left shadow-lg"></div>
          <div className="absolute top-0 left-0 w-[200px] h-[45px] bg-[#3B82F6] transform -skew-x-30 origin-top-left opacity-90"></div>
          <div className="absolute top-0 right-0 w-[150px] h-[10px] bg-cyan-400 transform -skew-x-45 origin-top-right"></div>
        </div>

        {/* Page 3 Logo */}

        <div className="relative z-20 flex flex-col pt-8">
          <div className="flex justify-center">
            <JevxoLogo size="md" />
          </div>

          <div className="w-full h-[1.5px] bg-slate-100 mt-2"></div>
        </div>

        {/* Page 3 Clauses & Signatures */}

        <div className="relative z-20 flex flex-col justify-between h-full py-4 select-text">
          <div className="space-y-4">
            <p className="text-slate-800 text-justify text-[13.2px] leading-relaxed">
              However, the Company reserves the right to implement immediate
              termination without notice in cases involving fraud, misconduct,
              breach of confidentiality, gross negligence, unethical behavior,
              violation of company policies, or any action that causes
              significant harm to the Company's interests, reputation, or
              operations.
            </p>

            <p className="text-slate-800 text-justify text-[13.2px] leading-relaxed">
              Upon termination, both Parties shall fulfill any outstanding
              obligations and return any Company owned property, documents,
              credentials, or confidential information in their possession.
            </p>
          </div>

          {/* Big custom center watermarked symbol for acceptance */}

          <div className="flex justify-center items-center my-6 py-6 opacity-10">
            <svg
              id="jevxo_p3_watermark"
              viewBox="0 0 100 100"
              className="w-40 h-40 text-blue-600"
            >
              <path
                d="M10 10 L90 90 M90 10 L10 90"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Acceptance Section & Signatures */}

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-bold text-primary text-[14.5px] uppercase tracking-wide">
                Signatures & Acceptance
              </h2>

              <p className="text-slate-800 text-justify text-[13px] leading-relaxed">
                I,{" "}
                <strong className="font-bold text-slate-900">
                  {secondParty.fullName || "[Second Party Full Name]"}
                </strong>
                , hereby acknowledge that I have read, understood, and agreed to
                all the terms and conditions set forth in this{" "}
                <strong className="font-semibold text-slate-900">
                  Appointment Letter and Partnership
                </strong>{" "}
                Policy of{" "}
                <strong className="font-bold text-[#2563EB]">
                  {firstParty.companyName}
                </strong>
                . I further undertake to comply with and uphold all{" "}
                <strong className="font-semibold text-slate-900">
                  obligations, responsibilities, and policies
                </strong>{" "}
                contained herein.
              </p>
            </div>

            {/* Signature Placement Fields */}

            <div className="grid grid-cols-1 gap-y-12 pt-8 pl-1">
              {/* Second Party Signature Holder */}

              <div className="relative">
                {/* Drawn Signature Canvas or Uploaded Image Base64 rendering */}

                <div className="absolute -top-12 left-10 h-16 w-48 flex items-end justify-start pointer-events-none select-none">
                  {secondParty.signatureImg ? (
                    <img
                      src={secondParty.signatureImg}
                      alt="Second Party Signature"
                      className="max-h-16 max-w-[190px] object-contain block opacity-95 transition-all duration-300"
                    />
                  ) : (
                    <div className="text-rose-500 font-bold tracking-wide animate-pulse text-[11px] bg-rose-50 px-2 py-0.5 border border-rose-200 rounded uppercase">
                      Needs Signature *
                    </div>
                  )}
                </div>

                <div className="text-slate-800 font-medium text-[12.5px] border-t border-slate-400 border-dashed pt-1.5 w-[380px]">
                  Signature & Date (Second Party / Partner)
                </div>
              </div>

              {/* Founder First Party Signature */}

              <div className="relative flex flex-col">
                <div className="absolute -top-9 left-10 h-12 w-48 flex items-end justify-start pointer-events-none select-none">
                  {founderSignatureSvg}
                </div>

                <div className="text-slate-800 font-medium text-[12.5px] border-t border-slate-400 border-dashed pt-1.5 w-[380px]">
                  Signature & Date (Founder, JEVXO)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}

        <div className="relative z-20 border-t border-slate-200 pt-3 flex justify-between items-center text-[10.5px] text-slate-500 font-medium select-text">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></span>

              {firstParty.mobileNumber}
            </span>

            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></span>

              {firstParty.email}
            </span>
          </div>

          <div>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></span>

              {firstParty.website}
            </span>
          </div>

          <div className="absolute -bottom-12 -right-14 w-[160px] h-[70px] bg-gradient-to-tl from-indigo-700 to-blue-500 transform skew-y-12 origin-bottom-right opacity-85 pointer-events-none"></div>

          <div className="absolute -bottom-12 -left-14 w-[80px] h-[35px] bg-[#3B82F6] transform -skew-y-12 origin-bottom-left opacity-35 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentLetterPreview;
