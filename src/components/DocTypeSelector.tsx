"use client";

import React from "react";
import { motion } from "motion/react";
import { FileText, CreditCard, ArrowRight, ChevronRight } from "lucide-react";
import { DocType } from "../types";

interface DocOption {
  id: DocType;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  subtitle: string;
  tags: string[];
  color: string;
}

const DOC_OPTIONS: DocOption[] = [
  {
    id: "appointment",
    icon: FileText,
    title: "Appointment Letter &\nPartnership Agreement",
    subtitle: "5-page legal document with NDA, equity clause, and digital signature",
    tags: ["PDF Export", "Email Delivery", "5 Pages", "Legal"],
    color: "#2563EB",
  },
  {
    id: "idCard",
    icon: CreditCard,
    title: "Employee ID Card",
    subtitle: "Dual-sided photo ID card with QR code and NFC layout",
    tags: ["PNG Export", "Email Delivery", "Front + Back", "HR"],
    color: "#7C3AED",
  },
  // Future modules can be added here by simply pushing to this array
];

interface DocTypeSelectorProps {
  onSelect: (type: DocType) => void;
}

export default function DocTypeSelector({ onSelect }: DocTypeSelectorProps) {
  const [selected, setSelected] = React.useState<Set<DocType>>(new Set());

  const toggle = (id: DocType) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleProceed = () => {
    if (selected.size === 0) return;
    if (selected.has("appointment") && selected.has("idCard")) {
      onSelect("both");
    } else if (selected.has("idCard")) {
      onSelect("idCard");
    } else {
      onSelect("appointment");
    }
  };

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
            What would you like to build?
          </h1>
          <p className="text-sm text-[#64748B]">
            Select one or more documents to generate. You can combine them in a single session.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid gap-4">
          {DOC_OPTIONS.map(({ id, icon: Icon, title, subtitle, tags, color }) => {
            const isSelected = selected.has(id);
            return (
              <motion.button
                key={id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => toggle(id)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all cursor-pointer group ${
                  isSelected
                    ? "border-[#2563EB] bg-[#EFF6FF] shadow-md shadow-[#2563EB]/10"
                    : "border-[#DBEAFE] bg-white hover:border-[#93C5FD] hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      isSelected
                        ? "bg-[#2563EB] border-[#2563EB]"
                        : "border-[#CBD5E1] bg-white"
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>

                  {/* Icon */}
                  <div
                    className="p-2.5 rounded-xl shrink-0"
                    style={{ background: `${color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#0F172A] text-sm leading-snug whitespace-pre-line">
                      {title}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1">{subtitle}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ background: `${color}15`, color }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 shrink-0 mt-1 transition-all ${
                      isSelected ? "text-[#2563EB]" : "text-[#CBD5E1] group-hover:text-[#94A3B8]"
                    }`}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Proceed Button */}
        <motion.button
          whileHover={selected.size > 0 ? { scale: 1.02 } : {}}
          whileTap={selected.size > 0 ? { scale: 0.98 } : {}}
          onClick={handleProceed}
          disabled={selected.size === 0}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
            selected.size > 0
              ? "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-lg shadow-[#2563EB]/20 hover:shadow-[#2563EB]/35"
              : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
          }`}
        >
          Proceed to Form
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        <p className="text-center text-[11px] text-[#94A3B8]">
          More document types coming soon — the system is modular and extensible.
        </p>
      </div>
    </motion.div>
  );
}
