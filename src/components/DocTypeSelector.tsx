"use client";

import React from "react";
import { motion } from "motion/react";
import { ArrowRight, LayoutDashboard, FileText, CreditCard } from "lucide-react";

// Local union — covers all selectable doc types including the new sales types.
// Not exported from types/index.ts intentionally (only used at the selector layer).
type SelectableDocType = "partner" | "internship" | "countrySales" | "salesAgent";

interface DocTypeSelectorProps {
  onSelect: (type: SelectableDocType) => void;
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
            Select Agreement Template
          </h1>
          <p className="text-sm text-[#64748B]">
            Each template generates a tailored appointment letter. The ID card is included in every package.
          </p>
        </div>

        <div className="grid gap-4">
          {/* Partner */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect("partner")}
            className="w-full text-left p-6 rounded-2xl border-2 border-[#2563EB] bg-[#EFF6FF] shadow-md shadow-[#2563EB]/10 cursor-pointer group transition-all hover:shadow-lg hover:shadow-[#2563EB]/15"
          >
            <div className="flex items-start gap-4">
              <div className="flex flex-col gap-1.5 shrink-0">
                <div className="p-2.5 rounded-xl bg-[#2563EB]/15">
                  <FileText className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div className="p-2.5 rounded-xl bg-[#7C3AED]/15">
                  <CreditCard className="w-5 h-5 text-[#7C3AED]" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#0F172A] text-base leading-snug">
                  Partner Agreement &amp; ID Card
                </h3>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  Standard partner onboarding — appointment letter with equity, NDA, and ID card.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["Equity Clause", "NDA", "PDF Export", "Digital Signature", "ID Card"].map((tag) => (
                    <span key={tag} className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB]">{tag}</span>
                  ))}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 shrink-0 mt-1 text-[#2563EB] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </motion.button>

          {/* Internship */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect("internship")}
            className="w-full text-left p-6 rounded-2xl border border-[#DBEAFE] bg-white shadow-sm cursor-pointer group transition-all hover:border-[#0EA5E9] hover:shadow-md hover:shadow-[#0EA5E9]/10"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-[#0EA5E9]/10 shrink-0">
                <FileText className="w-5 h-5 text-[#0EA5E9]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#0F172A] text-base leading-snug">
                  Internship Offer Letter
                </h3>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  Internship appointment with learning objectives, duration, and ID card.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["Internship Duration", "NDA", "PDF Export", "ID Card"].map((tag) => (
                    <span key={tag} className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9]">{tag}</span>
                  ))}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 shrink-0 mt-1 text-[#0EA5E9] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </motion.button>

          {/* Country Sales Partner */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect("countrySales")}
            className="w-full text-left p-6 rounded-2xl border border-[#DBEAFE] bg-white shadow-sm cursor-pointer group transition-all hover:border-[#10B981] hover:shadow-md hover:shadow-[#10B981]/10"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-[#10B981]/10 shrink-0">
                <FileText className="w-5 h-5 text-[#10B981]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#0F172A] text-base leading-snug">
                  Country Sales Partner Agreement
                </h3>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  Sales partner agreement with commission structure, territory, and ID card.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["Commission Terms", "Territory", "NDA", "PDF Export", "ID Card"].map((tag) => (
                    <span key={tag} className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981]">{tag}</span>
                  ))}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 shrink-0 mt-1 text-[#10B981] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </motion.button>

          {/* Sales Agent */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect("salesAgent")}
            className="w-full text-left p-6 rounded-2xl border border-[#DBEAFE] bg-white shadow-sm cursor-pointer group transition-all hover:border-[#F59E0B] hover:shadow-md hover:shadow-[#F59E0B]/10"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-[#F59E0B]/10 shrink-0">
                <FileText className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#0F172A] text-base leading-snug">
                  Sales Agent Agreement
                </h3>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  Agent agreement under a Country Sales Partner, with commission and ID card.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["Agent Commission", "Reporting Structure", "NDA", "PDF Export", "ID Card"].map((tag) => (
                    <span key={tag} className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B]">{tag}</span>
                  ))}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 shrink-0 mt-1 text-[#F59E0B] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </motion.button>
        </div>

        <p className="text-center text-[11px] text-[#94A3B8]">
          All templates use the same document theme and PDF/email pipeline.
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
