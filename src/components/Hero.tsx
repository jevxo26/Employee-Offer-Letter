"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  FolderCheck,
  Printer,
  Check,
  Sparkles,
} from "lucide-react";

interface HeroProps {
  onStart: () => void;
  onDemo: () => void;
}

export default function Hero({ onStart, onDemo }: HeroProps) {
  return (
    <motion.section
      key="home"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-[calc(100vh-77px)] flex items-center justify-center px-4 overflow-hidden"
      id="hero_viewport_container"
    >
      {/* Background grid & blobs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#DBEAFE_1px,transparent_1px),linear-gradient(to_bottom,#DBEAFE_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#2563EB]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#06B6D4]/5 rounded-full blur-3xl" />

      <div className="max-w-4xl text-center relative z-10 px-4 space-y-8 py-12">
        <div className="inline-flex items-center gap-2 bg-[#EFF6FF] border border-[#DBEAFE] px-3.5 py-1.5 rounded-full text-[#1E3A8A] font-semibold text-xs uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
          Official JEVXO Document Engine
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-tight font-sans">
            <span className="font-serif italic text-[#334155] font-normal">
              Automate Your
            </span>{" "}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#06B6D4] font-black">
              Partnership & Appointment
            </span>{" "}
            Documents
          </h1>
          <p className="text-[#334155] max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Empower JEVXO's onboarding process with high-fidelity legal document
            generation. Seamlessly enter second-party details to instantly
            compile, sign, preview, and download your exportable Partner
            Agreements as pristine PDFs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-2xl shadow-lg shadow-[#2563EB]/10 hover:shadow-[#2563EB]/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group text-base cursor-pointer"
          >
            Start Partner Entry
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </button>
          <button
            onClick={onDemo}
            className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-[#EFF6FF] border border-[#DBEAFE] font-semibold rounded-2xl transition flex items-center justify-center gap-2 text-[#334155] hover:text-[#0F172A] cursor-pointer"
          >
            Try with Demo Data
          </button>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 text-left">
          {[
            {
              icon: FolderCheck,
              title: "Interactive Wizard",
              desc: "Systematic forms designed to naturally capture present/permanent addresses, family contexts, and NID indexes.",
            },
            {
              icon: Printer,
              title: "A4 Pixel Perfect Layout",
              desc: "Perfect reproduction of the 3-page corporate agreement containing professional watermarks and official diagonals.",
            },
            {
              icon: Check,
              title: "Double Signing",
              desc: "Draw and save signatures locally or upload graphic assets instantly, embedded right alongside JEVXO founder pre-signs.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-5 bg-white border border-[#DBEAFE] rounded-2xl shadow-sm"
            >
              <div className="text-[#2563EB] mb-3 bg-[#F8FAFC] w-9 h-9 flex items-center justify-center rounded-xl border border-[#DBEAFE]/40">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-[#0F172A] font-bold text-sm mb-1">{title}</h3>
              <p className="text-[#64748B] text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
