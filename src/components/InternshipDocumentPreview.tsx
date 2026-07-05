"use client";

import React from "react";
import Image from "next/image";
import QRCode from "react-qr-code";
import JevxoLogo from "./JevxoLogo";
import XLogo from "../../assets/x-logo.jpg";
import { A4_WIDTH, A4_HEIGHT } from "./A4DocumentScaler";
import { buildVerifyUrl } from "../lib/verifyUrl";
import { FirstParty, SecondParty, DocSettings } from "../types";

interface InternshipDocumentPreviewProps {
  firstParty: FirstParty;
  secondParty: SecondParty;
  settings: DocSettings;
  previewRefs?: React.RefObject<HTMLDivElement | null>[];
}

const pageStyle: React.CSSProperties = {
  boxSizing: "border-box",
  width: A4_WIDTH,
  height: A4_HEIGHT,
  flexShrink: 0,
};

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
      <div
        id="internship-page-1"
        ref={previewRefs[0]}
        className="relative bg-white text-slate-800 shadow-2xl flex flex-col justify-between border border-slate-100 print:border-none print:shadow-none"
        style={pageStyle}
      >
        {/* Top gradient bars */}
        <div className="absolute top-0 right-0 w-64 h-2 bg-gradient-to-l from-indigo-600 via-sky-500 to-transparent" />
        <div className="absolute top-2.25 right-0 w-48 h-2 bg-gradient-to-r from-transparent via-indigo-600 to-sky-500" />

        {/* Watermark */}
        <Image
          src={XLogo}
          alt="Watermark"
          width={520}
          height={520}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-20 pointer-events-none"
        />

        {/* Page content */}
        <div className="z-10 flex flex-col flex-grow px-10 pt-8 pb-4 gap-3">
          {/* Header row — logo + ref */}
          <header className="flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-1">
            <div className="flex flex-col">
              <JevxoLogo />
              <div className="relative ml-3.5">
                <div className="w-12 h-0.75 absolute top-3 bg-linear-to-l from-blue-400 to-violet-400" />
                <p className="ml-16"><strong> Build your Empire </strong></p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right font-sans">
                <div className="bg-slate-900 text-white text-[10px] px-2.5 py-1 font-mono font-semibold tracking-wider rounded mb-0.5">
                  Ref: {d.refId}
                </div>
                <span className="text-[11px] text-slate-600 font-bold">
                  Intern ID: {d.internId}
                </span>
              </div>
              <div className="bg-white p-1 border border-slate-200 rounded shadow-sm shrink-0">
                <QRCode value={verifyUrl} size={52} level="M" />
              </div>
            </div>
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
            <div className="relative h-12 w-48 mb-1">
              {d.founderSig ? (
                <Image
                  src={d.founderSig}
                  alt="Founder Signature"
                  fill
                  className="object-contain object-left opacity-95"
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

        {/* Bottom gradient bars */}
        <div className="absolute bottom-0 left-0 w-64 h-2 bg-gradient-to-l from-transparent via-sky-500 to-indigo-600" />
        <div className="absolute bottom-2.25 left-0 w-48 h-2 bg-gradient-to-r from-sky-500 via-indigo-600 to-transparent" />

        <div className="absolute bottom-0 right-0 w-64 h-2 bg-gradient-to-l from-indigo-600 via-sky-500 to-transparent" />
        <div className="absolute bottom-2.25 right-0 w-48 h-2 bg-gradient-to-r from-transparent via-indigo-600 to-sky-500" />

        {/* Footer */}
        <footer className="z-10 px-10 pb-6 pt-3 border-t border-slate-300 text-[12px] text-slate-400 font-mono flex flex-col justify-center">
          <div className="flex justify-between">
            <span>
              Generated by:{" "}
              <strong className="text-indigo-600">
                HR Document Engine by JEVXO
              </strong>
            </span>
            <div className="flex gap-6">
              <span>
                Email:{" "}
                <strong className="text-slate-600 font-semibold">
                  {d.companyEmail}
                </strong>
              </span>
              <span>
                Website:{" "}
                <strong className="text-slate-600 font-semibold">
                  {firstParty.website || "www.jevxo.com"}
                </strong>
              </span>
            </div>
          </div>
          <span className="text-center">
            <strong className="text-slate-600 font-semibold">
              {d.location || "Rajshahi, Bangladesh"}
            </strong>
          </span>
        </footer>
      </div>
    </div>
  );
}
