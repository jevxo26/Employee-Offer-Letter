"use client";
import React from "react";
import Image from "next/image";

interface SignatureParty {
  name: string;
  role: string;
  sigImg?: string;
  date?: string;
  awaitingLabel?: string;
}

interface SignatureSectionProps {
  party1: SignatureParty;
  party2: SignatureParty;
  party3?: SignatureParty;
  titleText?: string;
  bodyText?: React.ReactNode;
}

export default function SignatureSection({
  party1,
  party2,
  party3,
  titleText = "Acceptance & Executory Signatures",
  bodyText,
}: SignatureSectionProps) {
  return (
    <section id="signatures-acceptance" className="pt-3 border-t border-slate-200">
      <h4 className="font-sans font-bold text-indigo-700 text-[16px] uppercase tracking-wider mb-2">
        {titleText}
      </h4>
      {bodyText && (
        <p className="text-[13px] text-slate-600 leading-relaxed font-sans bg-white/50 p-3 rounded-md border border-slate-100 shadow-sm text-justify">
          {bodyText}
        </p>
      )}
      <div className={`grid ${party3 ? "grid-cols-3 gap-5" : "grid-cols-2 gap-12"} pt-10 font-sans text-[13px]`}>
        {/* Party 1 — left */}
        <div className="flex flex-col">
          <div className="relative mt-4 pt-2 font-semibold text-slate-800 text-center">
            <div className="absolute -top-10 left-25 h-12 w-48 flex items-end justify-start pointer-events-none select-none">
              {party1.sigImg ? (
                <Image
                  height={50}
                  width={100}
                  src={party1.sigImg}
                  alt={`${party1.name} Signature`}
                  className="max-h-11 max-w-[170px] object-contain block opacity-95"
                />
              ) : (
                <div className="text-amber-600 font-bold tracking-wide animate-pulse text-[8.5px] bg-amber-50 px-2 py-0.5 border border-amber-200 rounded uppercase">
                  {party1.awaitingLabel || "Awaiting Signature *"}
                </div>
              )}
            </div>
            ...................................................................................
          </div>
          <div className="text-center font-bold text-slate-900 mt-1">{party1.name}</div>
          <div className="text-[11px] text-slate-500 text-center">{party1.role}</div>
          <div className="text-[10px] text-slate-400 text-center mt-2">
            Date: {party1.sigImg ? party1.date || "" : ""}
          </div>
        </div>

        {/* Party 2 — right */}
        <div className="flex flex-col">
          <div className="relative mt-4 pt-2 font-semibold text-slate-800 text-center">
            <div className="absolute -top-10 left-0 right-0 h-12 flex items-end justify-center pointer-events-none select-none">
              {party2.sigImg ? (
                <Image
                  height={50}
                  width={100}
                  src={party2.sigImg}
                  alt={`${party2.name} Signature`}
                  className="max-h-11 max-w-[170px] object-contain block opacity-95"
                />
              ) : null}
            </div>
            ...................................................................................
          </div>
          <div className="text-center font-bold text-slate-900 mt-1">{party2.name}</div>
          <div className="text-[11px] text-slate-500 text-center">{party2.role}</div>
          <div className="text-[10px] text-slate-400 text-center my-2">Date: {party2.date || ""}</div>
        </div>

        {party3 && <SignatureBlock party={party3} />}
      </div>
    </section>
  );
}

function SignatureBlock({ party }: { party: SignatureParty }) {
  return <div className="flex flex-col">
    <div className="relative mt-4 pt-2 font-semibold text-slate-800 text-center">
      <div className="absolute -top-10 left-0 right-0 h-12 flex items-end justify-center pointer-events-none select-none">
        {party.sigImg ? <Image height={50} width={100} src={party.sigImg} alt={`${party.name} Signature`} className="max-h-11 max-w-[150px] object-contain block opacity-95" /> : <div className="text-amber-600 font-bold tracking-wide text-[8.5px] bg-amber-50 px-2 py-0.5 border border-amber-200 rounded uppercase">{party.awaitingLabel || "Awaiting Signature *"}</div>}
      </div>
      ...................................................................................
    </div>
    <div className="text-center font-bold text-slate-900 mt-1">{party.name}</div>
    <div className="text-[11px] text-slate-500 text-center">{party.role}</div>
    <div className="text-[10px] text-slate-400 text-center mt-2">Date: {party.sigImg ? party.date || "" : ""}</div>
  </div>;
}
