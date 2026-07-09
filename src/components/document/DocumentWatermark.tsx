"use client";
import React from "react";
import Image from "next/image";
import XLogo from "../../../assets/x-logo.jpg";

export default function DocumentWatermark() {
  return (
    <Image
      src={XLogo}
      alt="Watermark"
      width={520}
      height={520}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-20 pointer-events-none"
    />
  );
}
