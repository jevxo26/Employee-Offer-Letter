"use client";

import React from "react";
import { motion } from "motion/react";
import { ArrowRight, LayoutDashboard, FileText, CreditCard } from "lucide-react";
import { DocType } from "../types";

interface DocTypeSelectorProps {
  onSelect: (type: DocType) => void;
  onOpenAdmin?: () => void;
}

export default function DocTypeSelector({ onSelect, onOpenAdmin }: DocTypeSelectorProps) {
  return (
    <motion.div
      key="docTypeSelect"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35 }}
      className="flex-1 flex items-center justify-center px-6 py-12"
    >
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] bg-[#EFF6FF] border border-[#DBEAFE]/50 text-[#1E3A8A] font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block">
            Step 2 of 2
          </span>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Create New Partner Document
          </h1>
          <p className="text-sm text-[#64748B]">
            Generates the appointment letter and ID card together in one session.
          </p>
        </div>

        {/* Single merged option card */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onSelect("both")}
          className="w-full text-left p-6 rounded-2xl border-2 border-[#2563EB] bg-[#EFF6FF] shadow-md shadow-[#2563EB]/10 cursor-pointer group transition-all hover:shadow-lg hover:shadow-[#2563EB]/15"
        >
          <div className="flex items-start gap-4">
            {/* Dual icon stack */}
            <div className="flex flex-col gap-1.5 shrink-0">
              <div className="p-2.5 rounded-xl bg-[#2563EB]/15">
                <FileText className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div className="p-2.5 rounded-xl bg-[#7C3AED]/15">
                <CreditCard className="w-5 h-5 text-[#7C3AED]" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#0F172A] text-base leading-snug">
                Appointment Letter & ID Card
              </h3>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                Full partner onboarding package — legal appointment letter with NDA and equity clause, plus a dual-sided ID card with QR verification.
              </p>

              {/* Two tag rows */}
              <div className="mt-3 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {["PDF Export", "Email Delivery", "Multi-page", "Legal", "Digital Signature"].map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["PNG Export", "Front + Back", "QR Verification", "NFC Layout", "HR"].map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#7C3AED]/10 text-[#7C3AED]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <ArrowRight className="w-5 h-5 shrink-0 mt-1 text-[#2563EB] group-hover:translate-x-0.5 transition-transform" />
          </div>
        </motion.button>

        {/* Proceed button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect("both")}
          className="w-full py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-lg shadow-[#2563EB]/20 hover:shadow-[#2563EB]/35"
        >
          Proceed to Form
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        <p className="text-center text-[11px] text-[#94A3B8]">
          More document types coming soon — the system is modular and extensible.
        </p>

        {onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="w-full py-3 px-6 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border border-[#DBEAFE] bg-white hover:border-[#2563EB] hover:bg-[#EFF6FF] text-[#64748B] hover:text-[#2563EB] transition cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            Open Agreement Registry (Admin)
          </button>
        )}
      </div>
    </motion.div>
  );
}
