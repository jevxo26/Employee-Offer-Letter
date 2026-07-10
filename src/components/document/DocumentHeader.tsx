"use client";
import React from "react";
import JevxoLogo from "../JevxoLogo";

export default function DocumentHeader() {
  return (
    <header className="flex justify-between items-start">
      <div className="flex flex-col">
        <JevxoLogo />
        <div className="relative ml-2 md:ml-2.75 lg:ml-3.5">
          <div className="w-7 md:w-9.5 lg:w-12 h-0.5 md:h-0.75 absolute top-1.5 md:top-2 lg:top-2.5 bg-linear-to-l from-blue-400 to-violet-400" />
          <p className="ml-8 md:ml-11 lg:ml-15 text-[9px] md:text-xs lg:text-sm"><strong> Build your Empire </strong></p>
        </div>
      </div>
    </header>
  );
}
