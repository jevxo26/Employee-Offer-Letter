"use client";

import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import html2canvas from "html2canvas-pro";
import {
  Download,
  Upload,
  User,
  Briefcase,
  Hash,
  Calendar,
  Droplets,
  Building2,
  Mail,
  Image,
} from "lucide-react";
import EmployeeIdCard from "./EmployeeIdCard";
import { EmployeeCard } from "../types";

// ─── Input primitives ─────────────────────────────────────────────────────────
function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-[#334155] uppercase tracking-wider flex items-center gap-1.5">
        <Icon className="w-3 h-3 text-[#2563EB]" />
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full bg-[#F1F5F9] border border-[#DBEAFE] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] font-medium focus:outline-none focus:border-[#2563EB] transition";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// ─── Main Component ───────────────────────────────────────────────────────────
interface IdCardWorkspaceProps {
  initialData?: Partial<EmployeeCard>;
  onSendEmail?: (data: EmployeeCard) => void;
}

export default function IdCardWorkspace({
  initialData,
  onSendEmail,
}: IdCardWorkspaceProps) {
  const [card, setCard] = useState<EmployeeCard>({
    fullName: initialData?.fullName || "",
    position: initialData?.position || "",
    employeeId: initialData?.employeeId || "000-000-0001",
    bloodGroup: initialData?.bloodGroup || "A+",
    department: initialData?.department || "",
    photoUrl: initialData?.photoUrl || "",
    issueDate: initialData?.issueDate || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    expiryDate: initialData?.expiryDate || new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  });

  const [isExportingFront, setIsExportingFront] = useState(false);
  const [isExportingBack, setIsExportingBack] = useState(false);

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const set = (key: keyof EmployeeCard) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setCard((p) => ({ ...p, [key]: e.target.value }));

  // Photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCard((p) => ({ ...p, photoUrl: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // PNG export for a single card
  const exportCard = async (
    ref: React.RefObject<HTMLDivElement | null>,
    filename: string,
    setSaving: (v: boolean) => void
  ) => {
    if (!ref.current) return;
    setSaving(true);
    try {
      const canvas = await html2canvas(ref.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });
      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setSaving(false);
    }
  };

  const name = card.fullName || "Employee";

  return (
    <motion.section
      key="idCardWorkspace"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col xl:flex-row w-full h-[calc(100vh-77px)] overflow-hidden"
    >
      {/* ── LEFT: Form Panel ────────────────────────────────────────────────── */}
      <div className="w-full xl:w-[420px] bg-[#F8FAFC] border-r border-[#DBEAFE] flex flex-col overflow-y-auto shrink-0">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-1.5">
            <span className="text-[10px] bg-[#EFF6FF] border border-[#DBEAFE]/50 text-[#1E3A8A] font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block">
              ID Card Generator
            </span>
            <h2 className="text-xl font-bold text-[#0F172A]">Employee Details</h2>
            <p className="text-[#64748B] text-xs">
              Fill in employee information — card updates live in the preview.
            </p>
          </div>

          {/* Photo Upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[#334155] uppercase tracking-wider flex items-center gap-1.5">
              <Image className="w-3 h-3 text-[#2563EB]" />
              Employee Photo
            </label>
            <label className="flex flex-col items-center justify-center gap-2 h-28 border-2 border-dashed border-[#DBEAFE] hover:border-[#2563EB] rounded-xl cursor-pointer bg-white transition-all group">
              {card.photoUrl ? (
                <img
                  src={card.photoUrl}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-xl"
                />
              ) : (
                <>
                  <Upload className="w-5 h-5 text-[#94A3B8] group-hover:text-[#2563EB] transition" />
                  <span className="text-xs font-medium text-[#94A3B8] group-hover:text-[#2563EB] transition">
                    Click to upload photo
                  </span>
                  <span className="text-[10px] text-[#CBD5E1]">PNG, JPG — recommended 400×600px</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
            {card.photoUrl && (
              <button
                onClick={() => setCard((p) => ({ ...p, photoUrl: "" }))}
                className="text-[10px] font-semibold text-red-400 hover:text-red-600 text-right transition cursor-pointer"
              >
                Remove photo
              </button>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <Field label="Full Name" icon={User}>
              <input
                type="text"
                placeholder="e.g. Ahsanul Haque"
                value={card.fullName}
                onChange={set("fullName")}
                className={inputClass}
              />
            </Field>

            <Field label="Position / Role" icon={Briefcase}>
              <input
                type="text"
                placeholder="e.g. UI/UX Lead Designer"
                value={card.position}
                onChange={set("position")}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Employee ID" icon={Hash}>
                <input
                  type="text"
                  placeholder="000-000-0001"
                  value={card.employeeId}
                  onChange={set("employeeId")}
                  className={inputClass}
                />
              </Field>

              <Field label="Blood Group" icon={Droplets}>
                <select
                  value={card.bloodGroup}
                  onChange={set("bloodGroup")}
                  className={inputClass}
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Department" icon={Building2}>
              <input
                type="text"
                placeholder="e.g. Design & Creative"
                value={card.department}
                onChange={set("department")}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Issue Date" icon={Calendar}>
                <input
                  type="text"
                  placeholder="June 13, 2026"
                  value={card.issueDate}
                  onChange={set("issueDate")}
                  className={inputClass}
                />
              </Field>

              <Field label="Expiry Date" icon={Calendar}>
                <input
                  type="text"
                  placeholder="June 13, 2028"
                  value={card.expiryDate}
                  onChange={set("expiryDate")}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        </div>

        {/* Export Footer */}
        <div className="p-6 border-t border-[#DBEAFE] space-y-3 mt-auto shrink-0 bg-[#F8FAFC]">
          {onSendEmail && (
            <button
              onClick={() => onSendEmail(card)}
              className="w-full py-3.5 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] font-bold text-white text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-md shadow-[#2563EB]/10 hover:shadow-[#2563EB]/25 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              Send ID Card via Email
            </button>
          )}
          <button
            onClick={() =>
              exportCard(frontRef, `${name} - JEVXO ID Card Front.png`, setIsExportingFront)
            }
            disabled={isExportingFront}
            className="w-full py-2.5 px-6 border border-[#DBEAFE] hover:border-[#2563EB] hover:bg-[#EFF6FF] text-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {isExportingFront ? "Generating..." : "Download Front (PNG)"}
          </button>
          <button
            onClick={() =>
              exportCard(backRef, `${name} - JEVXO ID Card Back.png`, setIsExportingBack)
            }
            disabled={isExportingBack}
            className="w-full py-2.5 px-6 border border-[#DBEAFE] hover:border-[#7C3AED] hover:bg-[#F5F3FF] text-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {isExportingBack ? "Generating..." : "Download Back (PNG)"}
          </button>
          <div className="flex justify-between text-[11px] text-[#64748B] px-1 font-semibold">
            <span>PNG · 3× scale · Print ready</span>
            <span>Front + Back</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Card Preview ──────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-[#1a1a2e] overflow-y-auto p-8">
        <EmployeeIdCard data={card} frontRef={frontRef} backRef={backRef} />
      </div>
    </motion.section>
  );
}
