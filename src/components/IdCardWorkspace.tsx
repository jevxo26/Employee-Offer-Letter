"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import html2canvas from "html2canvas-pro";
import { Download, Upload, User, Briefcase, Hash, Calendar, Image } from "lucide-react";
import EmployeeIdCard from "./EmployeeIdCard";
import { EmployeeCard } from "../types";

// ─── Card fixed dimensions ────────────────────────────────────────────────────
const CARD_W = 360;
const CARD_H = 570;

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
        <span className="ml-auto text-[9px] font-bold text-[#CBD5E1] uppercase tracking-wider shrink-0">
          Read only
        </span>
      </div>
    </Field>
  );
}

// ─── Pixel-perfect card export ────────────────────────────────────────────────
// html2canvas cannot render:
//   1. CSS background-image: url(...)  → preload image & inline it into a clone
//   2. -webkit-background-clip: text   → patch to a solid colour in the clone
// We build an off-screen clone, fix those two issues, capture it, then remove it.
async function captureCardPixelPerfect(
  sourceEl: HTMLDivElement,
  scale = 3
): Promise<HTMLCanvasElement> {
  // 1 ── deep-clone the element
  const clone = sourceEl.cloneNode(true) as HTMLDivElement;

  // 2 ── position it off-screen but fully rendered
  clone.style.position = "fixed";
  clone.style.top = "-9999px";
  clone.style.left = "-9999px";
  clone.style.zIndex = "-1";
  clone.style.pointerEvents = "none";
  document.body.appendChild(clone);

  try {
    // 3 ── fix CSS background-image → real <img> element
    const bgImgUrl = getComputedStyle(sourceEl).backgroundImage;
    const urlMatch = bgImgUrl.match(/url\(["']?([^"')]+)["']?\)/);
    if (urlMatch) {
      const imgSrc = urlMatch[1];
      // Preload as blob to guarantee html2canvas can read it
      const resp = await fetch(imgSrc);
      const blob = await resp.blob();
      const dataUrl = await new Promise<string>((res) => {
        const fr = new FileReader();
        fr.onload = () => res(fr.result as string);
        fr.readAsDataURL(blob);
      });

      // Remove the CSS background from the clone
      clone.style.backgroundImage = "none";

      // Insert an <img> at z-index 0 as first child, same size as card
      const bgImg = document.createElement("img");
      bgImg.src = dataUrl;
      bgImg.style.cssText = `
        position:absolute;top:0;left:0;
        width:175%;height:auto;
        transform:translateX(calc(-37.5% + ${CARD_W * 0.25 * 0.375}px));
        object-fit:cover;
        z-index:0;pointer-events:none;
      `;
      clone.insertBefore(bgImg, clone.firstChild);

      // Wait for the image to load
      await new Promise<void>((res) => {
        if (bgImg.complete) { res(); return; }
        bgImg.onload = () => res();
        bgImg.onerror = () => res(); // skip if fails
      });
    }

    // 4 ── fix -webkit-background-clip: text elements (gradient text)
    //      Walk all descendants, find those using WebkitTextFillColor: transparent
    //      and replace with the gradient start colour so text is visible
    clone.querySelectorAll<HTMLElement>("*").forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.webkitTextFillColor === "transparent" || (cs as unknown as Record<string, string>)["-webkit-text-fill-color"] === "transparent") {
        // Extract the first colour stop from the gradient background
        const bg = cs.backgroundImage || cs.background;
        const colourMatch = bg.match(/rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}/);
        const fallback = colourMatch ? colourMatch[0] : "#7B3FF5";
        el.style.webkitTextFillColor = "unset";
        el.style.backgroundImage = "none";
        el.style.background = "none";
        el.style.color = fallback;
      }
    });

    // 5 ── capture
    const canvas = await html2canvas(clone, {
      scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#0A0B10",
      imageTimeout: 15000,
      foreignObjectRendering: false,
      width: CARD_W,
      height: CARD_H,
    });

    return canvas;
  } finally {
    document.body.removeChild(clone);
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface IdCardWorkspaceProps {
  initialData?: Partial<EmployeeCard>;
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

  useEffect(() => {
    if (isControlled) {
      setCard((p) => ({ ...p, photoUrl: controlledPhotoUrl }));
    }
  }, [controlledPhotoUrl, isControlled]);

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

  // Responsive scale for the card preview area
  const previewAreaRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  useEffect(() => {
    const el = previewAreaRef.current;
    if (!el) return;
    const update = () => {
      const available = el.clientWidth - 32; // 16px padding each side
      const scale = Math.min(1, available / CARD_W);
      setPreviewScale(Math.max(0.3, scale));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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

  const exportFront = async () => {
    if (!frontRef.current) return;
    setIsExportingFront(true);
    try {
      const canvas = await captureCardPixelPerfect(frontRef.current, 3);
      const link = document.createElement("a");
      link.download = `${card.fullName || "Employee"} - JEVXO ID Card Front.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExportingFront(false);
    }
  };

  const exportBack = async () => {
    if (!backRef.current) return;
    setIsExportingBack(true);
    try {
      const canvas = await html2canvas(backRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: null,
      });
      const link = document.createElement("a");
      link.download = `${card.fullName || "Employee"} - JEVXO ID Card Back.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExportingBack(false);
    }
  };

  return (
    <motion.section
      key="idCardWorkspace"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col xl:flex-row w-full min-h-0 overflow-hidden"
    >
      {/* ── LEFT: Form Panel ────────────────────────────────────────────────── */}
      <div className="w-full xl:w-[400px] bg-[#F8FAFC] border-b xl:border-b-0 xl:border-r border-[#DBEAFE] flex flex-col overflow-y-auto shrink-0 max-h-[60vh] xl:max-h-none xl:h-full">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <span className="text-[10px] bg-[#EFF6FF] border border-[#DBEAFE]/50 text-[#1E3A8A] font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block">
              ID Card Preview
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">Employee ID Card</h2>
            <p className="text-[#64748B] text-xs">
              Card details are pulled from the appointment form. Upload the employee photo below.
            </p>
          </div>

          {/* Photo Upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[#334155] uppercase tracking-wider flex items-center gap-1.5">
              <Image className="w-3 h-3 text-[#2563EB]" />
              Employee Photo{" "}
              <span className="text-rose-500 font-extrabold">* Required</span>
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
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
            {card.photoUrl && (
              <button
                onClick={() => {
                  if (isControlled && onPhotoChange) onPhotoChange("");
                  else setCard((p) => ({ ...p, photoUrl: "" }));
                }}
                className="text-[10px] font-semibold text-red-400 hover:text-red-600 text-right transition cursor-pointer"
              >
                Remove photo
              </button>
            )}
          </div>

          {/* Read-only fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3 sm:gap-4">
            <ReadOnlyField label="Full Name"      icon={User}     value={card.fullName}   placeholder="From appointment form" />
            <ReadOnlyField label="Position / Role" icon={Briefcase} value={card.position}  placeholder="From appointment form" />
            <ReadOnlyField label="Partner ID"     icon={Hash}     value={card.employeeId} placeholder="From appointment form" />
            <ReadOnlyField label="Issue Date"     icon={Calendar} value={card.issueDate}  placeholder="From appointment form" />
          </div>
        </div>

        {/* Download Footer */}
        <div className="p-4 sm:p-6 border-t border-[#DBEAFE] space-y-2 mt-auto shrink-0 bg-[#F8FAFC]">
          <div className="flex flex-col sm:flex-row xl:flex-col gap-2">
            <button
              onClick={exportFront}
              disabled={isExportingFront}
              className="flex-1 py-2.5 px-4 border border-[#DBEAFE] hover:border-[#2563EB] hover:bg-[#EFF6FF] text-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              {isExportingFront ? "Generating..." : "Download Front (PNG)"}
            </button>
            <button
              onClick={exportBack}
              disabled={isExportingBack}
              className="flex-1 py-2.5 px-4 border border-[#DBEAFE] hover:border-[#7C3AED] hover:bg-[#F5F3FF] text-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              {isExportingBack ? "Generating..." : "Download Back (PNG)"}
            </button>
          </div>
          <div className="flex justify-between text-[11px] text-[#64748B] px-1 font-semibold">
            <span>PNG · 3× scale · Print ready</span>
            <span>Front + Back</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Card Preview — scales to fit any screen ──────────────────── */}
      <div
        ref={previewAreaRef}
        className="flex-1 flex items-center justify-center bg-[#1a1a2e] overflow-hidden p-4"
      >
        {/* Scaler wrapper — same pattern as A4DocumentScaler */}
        <div
          style={{
            width:  CARD_W * previewScale * 2 + 40 * previewScale, // front + back + gap
            height: CARD_H * previewScale,
            position: "relative",
          }}
        >
          <div
            style={{
              transform: `scale(${previewScale})`,
              transformOrigin: "top left",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <EmployeeIdCard data={card} frontRef={frontRef} backRef={backRef} />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
