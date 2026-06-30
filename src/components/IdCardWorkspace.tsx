"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import html2canvas from "html2canvas-pro";
import { Download, Upload, User, Briefcase, Hash, Calendar, Image } from "lucide-react";
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

// Read-only display field — looks like an input but isn't editable
function ReadOnlyField({
  label,
  icon: Icon,
  value,
  placeholder,
}: {
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  value: string;
  placeholder?: string;
}) {
  return (
    <Field label={label} icon={Icon}>
      <div className="w-full bg-[#F1F5F9] border border-[#DBEAFE] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] font-medium select-text flex items-center gap-2">
        <span className={value ? "text-[#0F172A]" : "text-[#94A3B8]"}>
          {value || placeholder || "—"}
        </span>
        <span className="ml-auto text-[9px] font-bold text-[#CBD5E1] uppercase tracking-wider">
          Read only
        </span>
      </div>
    </Field>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface IdCardWorkspaceProps {
  initialData?: Partial<EmployeeCard>;
  /** Controlled photo from parent (CeoWorkspace) when in "both" mode */
  controlledPhotoUrl?: string;
  onPhotoChange?: (dataUrl: string) => void;
}

export default function IdCardWorkspace({
  initialData,
  controlledPhotoUrl,
  onPhotoChange,
}: IdCardWorkspaceProps) {
  const isControlled = controlledPhotoUrl !== undefined;

  const [card, setCard] = useState<EmployeeCard>({
    fullName:   initialData?.fullName   || "",
    position:   initialData?.position   || "",
    employeeId: initialData?.employeeId || "000-000-0001",
    bloodGroup: initialData?.bloodGroup || "A+",
    department: initialData?.department || "",
    photoUrl:   isControlled ? controlledPhotoUrl : (initialData?.photoUrl || ""),
    issueDate:  initialData?.issueDate  || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    expiryDate: initialData?.expiryDate || "",
  });

  // Sync controlled photo from parent into local card state
  useEffect(() => {
    if (isControlled) {
      setCard((p) => ({ ...p, photoUrl: controlledPhotoUrl }));
    }
  }, [controlledPhotoUrl, isControlled]);

  // Sync initialData changes live (partnerId from appointment tab updates employeeId here)
  useEffect(() => {
    if (initialData) {
      setCard((p) => ({
        ...p,
        fullName:   initialData.fullName   ?? p.fullName,
        position:   initialData.position   ?? p.position,
        employeeId: initialData.employeeId ?? p.employeeId,
        bloodGroup: initialData.bloodGroup ?? p.bloodGroup,
        issueDate:  initialData.issueDate  ?? p.issueDate,
      }));
    }
  }, [
    initialData?.fullName,
    initialData?.position,
    initialData?.employeeId,
    initialData?.bloodGroup,
    initialData?.issueDate,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  const [isExportingFront, setIsExportingFront] = useState(false);
  const [isExportingBack,  setIsExportingBack]  = useState(false);

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef  = useRef<HTMLDivElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (isControlled && onPhotoChange) {
        onPhotoChange(dataUrl);
      } else {
        setCard((p) => ({ ...p, photoUrl: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

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
      <div className="w-full xl:w-[400px] bg-[#F8FAFC] border-r border-[#DBEAFE] flex flex-col overflow-y-auto shrink-0">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-1.5">
            <span className="text-[10px] bg-[#EFF6FF] border border-[#DBEAFE]/50 text-[#1E3A8A] font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block">
              ID Card Preview
            </span>
            <h2 className="text-xl font-bold text-[#0F172A]">Employee ID Card</h2>
            <p className="text-[#64748B] text-xs">
              Card details are pulled from the appointment form. Upload the employee photo below.
            </p>
          </div>

          {/* Photo Upload — only interactive element */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[#334155] uppercase tracking-wider flex items-center gap-1.5">
              <Image className="w-3 h-3 text-[#2563EB]" />
              Employee Photo{" "}
              <span className="text-rose-500 font-extrabold">* Required</span>
            </label>
            <label className="flex flex-col items-center justify-center gap-2 h-32 border-2 border-dashed border-[#DBEAFE] hover:border-[#2563EB] rounded-xl cursor-pointer bg-white transition-all group">
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
                onClick={() => {
                  if (isControlled && onPhotoChange) {
                    onPhotoChange("");
                  } else {
                    setCard((p) => ({ ...p, photoUrl: "" }));
                  }
                }}
                className="text-[10px] font-semibold text-red-400 hover:text-red-600 text-right transition cursor-pointer"
              >
                Remove photo
              </button>
            )}
          </div>

          {/* Read-only fields */}
          <div className="space-y-4">
            <ReadOnlyField
              label="Full Name"
              icon={User}
              value={card.fullName}
              placeholder="From appointment form"
            />
            <ReadOnlyField
              label="Position / Role"
              icon={Briefcase}
              value={card.position}
              placeholder="From appointment form"
            />
            <ReadOnlyField
              label="Partner ID"
              icon={Hash}
              value={card.employeeId}
              placeholder="From appointment form"
            />
            <ReadOnlyField
              label="Issue Date"
              icon={Calendar}
              value={card.issueDate}
              placeholder="From appointment form"
            />
          </div>
        </div>

        {/* Download Footer */}
        <div className="p-6 border-t border-[#DBEAFE] space-y-3 mt-auto shrink-0 bg-[#F8FAFC]">
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
