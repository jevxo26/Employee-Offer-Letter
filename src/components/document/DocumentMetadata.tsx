"use client";
import React from "react";
import QRCode from "react-qr-code";

interface DocumentMetadataProps {
  refId: string;
  idLabel: string;
  idValue: string;
  verifyUrl: string;
}

export default function DocumentMetadata({ refId, idLabel, idValue, verifyUrl }: DocumentMetadataProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-right font-sans">
        <div className="bg-slate-900 text-white text-[10px] px-2.5 py-1 font-mono font-semibold tracking-wider rounded mb-0.5">
          Ref: {refId}
        </div>
        <span className="text-[11px] text-slate-600 font-bold">
          {idLabel}: {idValue}
        </span>
      </div>
      <div className="bg-white p-1 border border-slate-200 rounded shadow-sm shrink-0">
        <QRCode value={verifyUrl} size={52} level="M" />
      </div>
    </div>
  );
}
