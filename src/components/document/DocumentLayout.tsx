"use client";
import React from "react";
import DocumentWatermark from "./DocumentWatermark";
import { A4_WIDTH, A4_HEIGHT } from "../A4DocumentScaler";

interface DocumentLayoutProps {
  pageNum: number;
  refProp?: React.RefObject<HTMLDivElement | null>;
  showWatermark?: boolean;
  children: React.ReactNode;
}

const pageStyle: React.CSSProperties = {
  boxSizing: "border-box",
  width: A4_WIDTH,
  height: A4_HEIGHT,
  flexShrink: 0,
};

export default function DocumentLayout({ pageNum, refProp, showWatermark = true, children }: DocumentLayoutProps) {
  return (
    <div
      id={`document-page-${pageNum}`}
      ref={refProp}
      className="relative bg-white text-slate-800 shadow-2xl flex flex-col justify-between border border-slate-100 print:border-none print:shadow-none"
      style={pageStyle}
    >
      {/* Top gradient bars */}
      <div className="absolute top-0 right-0 w-64 h-2 bg-gradient-to-l from-indigo-600 via-sky-500 to-transparent" />
      <div className="absolute top-2.25 right-0 w-48 h-2 bg-gradient-to-r from-transparent via-indigo-600 to-sky-500" />

      {showWatermark && <DocumentWatermark />}

      {children}

      {/* Bottom gradient bars */}
      <div className="absolute bottom-0 left-0 w-64 h-2 bg-gradient-to-l from-transparent via-sky-500 to-indigo-600" />
      <div className="absolute bottom-2.25 left-0 w-48 h-2 bg-gradient-to-r from-sky-500 via-indigo-600 to-transparent" />
      <div className="absolute bottom-0 right-0 w-64 h-2 bg-gradient-to-l from-indigo-600 via-sky-500 to-transparent" />
      <div className="absolute bottom-2.25 right-0 w-48 h-2 bg-gradient-to-r from-transparent via-indigo-600 to-sky-500" />
    </div>
  );
}
