"use client";

import React from "react";
import { A4_WIDTH } from "./A4DocumentScaler";
import { buildVerifyUrl } from "../lib/verifyUrl";
import { FirstParty, SecondParty, DocSettings } from "../types";
import DocumentLayout from "./document/DocumentLayout";
import DocumentHeader from "./document/DocumentHeader";
import DocumentMetadata from "./document/DocumentMetadata";
import DocumentFooter from "./document/DocumentFooter";

interface InternshipDocumentPreviewProps {
  firstParty: FirstParty;
  secondParty: SecondParty;
  settings: DocSettings;
  previewRefs?: React.RefObject<HTMLDivElement | null>[];
}

export default function InternshipDocumentPreview({
  firstParty,
  secondParty,
  settings,
  previewRefs = [],
}: InternshipDocumentPreviewProps) {
  const d = {
    date:
      settings.date ||
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    internName: secondParty.fullName || "Intern Name",
    position: secondParty.position || "Intern Position",
    internId: settings.internId || "JVX-INT-26-001",
    refId: settings.internRefId || "JVX-INT-REF-26-001",
    duration: settings.internshipDuration || "3 months",
    isPaid: settings.isPaid ?? false,
    companyName: firstParty.companyName || "JEVXO",
    founderName: firstParty.representedBy || "Founder Name",
    founderRole: firstParty.role || "Founder",
    companyEmail: firstParty.email || "info@jevxo.com",
    founderSig: firstParty.signatureImg || "",
    location: firstParty.currentAddress || "Rajshahi, Bangladesh",
  };

  const verifyUrl = buildVerifyUrl(d.internId);

  return (
    <div
      id="internship-preview-container"
      className="flex flex-col select-text"
      style={{ width: A4_WIDTH }}
    >
      {/* Single A4 page */}
      <DocumentLayout pageNum={1} refProp={previewRefs[0]}>
        {/* Page content */}
        <div className="z-10 flex flex-col flex-grow px-10 pt-8 pb-4 gap-3">
          {/* Header row — logo + ref */}
          <header className="flex justify-between items-start border-b-2 border-slate-900 pb-2 mb-1">
            <DocumentHeader />
            <DocumentMetadata
              refId={d.refId}
              idLabel="Intern ID"
              idValue={d.internId}
              verifyUrl={verifyUrl}
            />
          </header>

          {/* Date + addressee */}
          <p className="text-[13px] text-slate-600 font-sans italic">
            Date:{" "}
            <strong className="text-slate-800 not-italic font-semibold">
              {d.date}
            </strong>
          </p>
          <p className="text-[14px] font-bold text-slate-900 font-sans">
            {d.internName}
          </p>

          {/* Subject line */}
          <p className="text-[13px] text-slate-700 font-sans">
            Subject:{" "}
            <strong className="text-slate-900">
              Internship Offer for {d.position}
            </strong>
          </p>

          {/* Opening */}
          <p className="text-[13px] text-slate-600 leading-relaxed text-justify font-sans">
            Dear <strong className="text-slate-900">{d.internName}</strong>,
          </p>
          <p className="text-[13px] text-slate-600 leading-relaxed text-justify font-sans">
            We are thrilled to offer you the opportunity to join{" "}
            <strong>{d.companyName}</strong> as a <strong>{d.position}</strong>{" "}
            Intern. This letter serves as a formal agreement detailing the terms
            and conditions of your internship. We believe that your skills and
            enthusiasm will add significant value to our team and look forward
            to an exciting journey together.
          </p>

          {/* Internship Details */}
          <div>
            <h4 className="font-bold text-[14px] text-slate-900 font-sans mb-1.5">
              Internship Details
            </h4>
            <ol className="list-decimal ml-5 space-y-1 text-[13px] text-slate-700 leading-relaxed font-sans">
              <li>
                <strong>Duration:</strong> Your internship will span{" "}
                <strong>{d.duration} months</strong>, starting from your official
                joining date, which will be the day you receive your email
                credentials.
              </li>
              <li>
                <strong>Compensation:</strong> This is a{" "}
                <strong>{d.isPaid ? "paid" : "unpaid"} internship</strong>
                {d.isPaid
                  ? ". Your stipend details will be communicated separately."
                  : ". While this internship does not offer a fixed salary, we are committed to recognizing your contributions through rewards that reflect your dedication and impact on our projects."}
              </li>
              <li>
                <strong>Privileges:</strong> As an intern, you will enjoy nearly
                all the rights and privileges of our employees, ensuring a sense
                of inclusion and providing you with a comprehensive professional
                experience.
              </li>
            </ol>
          </div>

          {/* Responsibilities */}
          <div>
            <h4 className="font-bold text-[14px] text-slate-900 font-sans mb-1.5">
              Your Responsibilities
            </h4>
            <ol className="list-decimal ml-5 space-y-1 text-[13px] text-slate-700 leading-relaxed font-sans">
              <li>
                Adhere to the rules and regulations of {d.companyName} at all
                times.
              </li>
              <li>
                Follow the guidance and instructions provided by your mentors
                and senior officers.
              </li>
              <li>
                Complete and submit all assigned tasks within the stipulated
                deadlines.
              </li>
            </ol>
          </div>

          {/* Termination Policy */}
          <div>
            <h4 className="font-bold text-[14px] text-slate-900 font-sans mb-1">
              Termination Policy
            </h4>
            <p className="text-[13px] text-slate-700 leading-relaxed font-sans">
              Your internship may be revoked under the following circumstances:
              participation in activities that violate the law or company
              policies; engaging in conduct that harms the company&apos;s
              reputation or operations.
            </p>
          </div>

          {/* Acceptance of Terms */}
          <div>
            <h4 className="font-bold text-[14px] text-slate-900 font-sans mb-1">
              Acceptance of Terms
            </h4>
            <p className="text-[13px] text-slate-700 leading-relaxed text-justify font-sans">
              By signing below, you agree to the terms outlined in this offer.
              Please confirm your acceptance by signing. We are excited to
              welcome you to the {d.companyName} family and look forward to
              crafting an extraordinary future together.
            </p>
          </div>

          {/* Founder sign-off */}
          <div className="mt-1">
            <p className="text-[13px] text-slate-600 font-sans mb-4">
              Warm regards,
            </p>
            <div className="h-12 mb-1 flex items-end">
              {d.founderSig ? (
                <img
                  src={d.founderSig}
                  alt="Founder Signature"
                  className="max-h-11 max-w-[180px] object-contain object-left opacity-95 block"
                />
              ) : (
                <div className="text-amber-600 font-bold tracking-wide animate-pulse text-[8.5px] bg-amber-50 px-2 py-0.5 border border-amber-200 rounded uppercase inline-block">
                  Awaiting Signature *
                </div>
              )}
            </div>
            <p className="text-[13px] font-bold text-slate-900 font-sans">
              {d.founderName}
            </p>
            <p className="text-[12px] text-slate-600 font-sans">
              {d.founderRole}, {d.companyName}
            </p>
          </div>

          {/* Acknowledgment */}
          <div className="border-t border-slate-200 pt-3 mt-1">
            <p className="text-[13px] font-bold text-slate-900 font-sans mb-1">
              Acknowledgment and Acceptance
            </p>
            <p className="text-[13px] text-slate-600 font-sans mb-3">
              I have read, understood and agreed to the terms and conditions of
              this internship offer.
            </p>
            <div className="flex gap-12 text-[13px] font-sans mt-5">
              <div>
                <span className="text-slate-600">Signature: </span>
                <span className="inline-block w-32 border-b border-slate-400 ml-1 pb-2 align-bottom">
                  {secondParty.signatureImg ? (
                    <img
                      src={secondParty.signatureImg}
                      alt="Intern Signature"
                      className="h-6 w-28 object-contain object-center inline-block"
                    />
                  ) : null}
                </span>
              </div>
              <div className="mt-3">
                <span className="text-slate-600">Date: </span>
                <span className="inline-block text-center w-24 border-b border-slate-400 ml-1 align-bottom text-slate-700">
                  {secondParty.signatureImg ? d.date : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DocumentFooter
          email={d.companyEmail}
          website={firstParty.website || "www.jevxo.com"}
          address={d.location}
        />
      </DocumentLayout>
    </div>
  );
}
