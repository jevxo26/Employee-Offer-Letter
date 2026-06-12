import React from "react";

interface JevxoLogoProps {
  size?: "sm" | "md" | "lg";
}

export default function JevxoLogo({ size = "md" }: JevxoLogoProps) {
  const sizeClasses = {
    sm: "w-28 h-8",
    md: "w-40 h-12",
    lg: "w-64 h-20"
  }[size] || "w-40 h-12";

  return (
    <div className={`${sizeClasses} flex-none`}>
      <svg
        viewBox="0 0 320 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="logoBlueGrad" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="60%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        
        <g transform="translate(10, 10)">
          <path
            d="M 12 12 Q 27 15 37 30 T 42 50 Q 27 50 17 35 T 12 12 Z"
            fill="url(#logoBlueGrad)"
          />
          <path
            d="M 48 12 Q 33 15 23 30 T 18 50 Q 33 50 43 35 T 48 12 Z"
            fill="url(#logoBlueGrad)"
            opacity="0.85"
          />
        </g>
        
        <text
          x="80"
          y="52"
          fill="#1E3A8A"
          fontWeight="900"
          fontSize="44"
          fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif"
          letterSpacing="2"
        >
          JEVXO
        </text>
      </svg>
    </div>
  );
}
