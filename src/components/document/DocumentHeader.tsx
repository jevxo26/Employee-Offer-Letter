"use client";
import React from "react";
import JevxoLogo from "../JevxoLogo";

export default function DocumentHeader() {
  return (
    <header className="flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-1">
      <div className="flex flex-col">
        <JevxoLogo />
        <div className="relative ml-3.5">
          <div className="w-12 h-0.75 absolute top-3 bg-linear-to-l from-blue-400 to-violet-400" />
          <p className="ml-16"><strong> Build your Empire </strong></p>
        </div>
      </div>
    </header>
  );
}
