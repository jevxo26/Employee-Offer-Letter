"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import {
  Download,
  Upload,
  User,
  Briefcase,
  Hash,
  Calendar,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import EmployeeIdCard from "./EmployeeIdCard";
import { EmployeeCard } from "../types";

// ─── Card fixed dimensions ────────────────────────────────────────────────────
const CARD_W = 360;
const CARD_H = 570;

// ─── PDF geometry — A4 landscape, cards fill the page at correct CR80 ratio ──
// CR80 ratio: width/height = 54/85.6 = 0.6308 (portrait card)
const PDF_PAGE_W   = 297;                        // A4 landscape width mm
const PDF_PAGE_H   = 210;                        // A4 landscape height mm
const PDF_MARGIN_Y = 10;                         // top/bottom margin mm
const PDF_GAP      = 8;                          // gap between front and back mm
const PDF_CARD_H   = PDF_PAGE_H - PDF_MARGIN_Y * 2;          // 190mm
const PDF_CARD_W   = PDF_CARD_H * (54 / 85.6);               // ~119.6mm — exact CR80 ratio
const PDF_FRONT_X  = (PDF_PAGE_W - PDF_CARD_W * 2 - PDF_GAP) / 2; // centered
const PDF_BACK_X   = PDF_FRONT_X + PDF_CARD_W + PDF_GAP;
const PDF_CARD_Y   = PDF_MARGIN_Y;
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

// ─── Capture helpers ───────────────────────────────────────────────────────────
// Fetches Orbitron font as base64 and injects it into the document so
// html2canvas can use it for SVG <text> elements.
let orbitronFontCss: string | null = null;
async function ensureOrbitronEmbedded(): Promise<void> {
  if (orbitronFontCss !== null) return; // already done
  try {
    // Fetch the CSS from Google Fonts
    const cssResp = await fetch(
      "https://fonts.googleapis.com/css2?family=Orbitron:wght@900&display=swap"
    );
    const css = await cssResp.text();
    // Extract the woff2 URL from the CSS
    const woffMatch = css.match(/src:\s*url\(([^)]+)\)\s*format\('woff2'\)/);
    if (!woffMatch) return;
    const woffUrl = woffMatch[1];
    // Fetch the actual font binary and base64-encode it
    const fontResp = await fetch(woffUrl);
    const fontBuf  = await fontResp.arrayBuffer();
    const b64      = btoa(
      new Uint8Array(fontBuf).reduce((s, b) => s + String.fromCharCode(b), "")
    );
    orbitronFontCss = `@font-face {
      font-family: 'Orbitron';
      font-weight: 900;
      src: url('data:font/woff2;base64,${b64}') format('woff2');
    }`;
    // Inject once into the real document so html2canvas picks it up
    const style = document.createElement("style");
    style.id = "orbitron-embedded";
    style.textContent = orbitronFontCss;
    document.head.appendChild(style);
  } catch {
    // Non-fatal — falls back to system font
    orbitronFontCss = "";
  }
}

// Waits for every <img> inside an element to finish loading
async function waitForImages(el: HTMLElement): Promise<void> {
  const imgs = Array.from(el.querySelectorAll("img"));
  await Promise.all(
    imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.addEventListener("load", () => resolve(), { once: true });
        img.addEventListener("error", () => resolve(), { once: true });
      });
    }),
  );
}

// Captures the REAL rendered card element — no cloning, no off-screen tricks.
// Temporarily removes Tailwind shadow class (renders as border line at 3×).
// Also forces document fonts to load before capture.
async function captureCard(
  el: HTMLDivElement,
  opts: { scale?: number; backgroundColor?: string | null } = {},
): Promise<HTMLCanvasElement> {
  await ensureOrbitronEmbedded();
  await waitForImages(el);

  // Force all fonts in the document to be loaded and ready
  await document.fonts.ready;

  // Tailwind shadow-2xl is class-based — we must remove the class, not inline style
  const hadShadow = el.classList.contains("shadow-2xl");
  if (hadShadow) el.classList.remove("shadow-2xl");
  // Also clear any inline box-shadow just in case
  const originalBoxShadow = el.style.boxShadow;
  el.style.boxShadow = "none";

  // Force SVG text elements to use font-family as CSS property (not just attribute)
  // so html2canvas resolves it through the CSS cascade where our @font-face lives
  const svgTexts = Array.from(el.querySelectorAll<SVGTextElement>("text"));
  svgTexts.forEach((t) => {
    const attr = t.getAttribute("fontFamily") || t.getAttribute("font-family");
    if (attr) t.style.fontFamily = attr;
  });

  try {
    return await html2canvas(el, {
      scale: opts.scale ?? 3,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: opts.backgroundColor ?? "#0A0B10",
      imageTimeout: 15000,
      onclone: (_doc, clonedEl) => {
        // In the clone, also set font-family as CSS on SVG texts
        clonedEl.querySelectorAll<SVGTextElement>("text").forEach((t) => {
          const attr = t.getAttribute("fontFamily") || t.getAttribute("font-family");
          if (attr) t.style.fontFamily = attr;
        });
        // Remove shadow from clone too
        clonedEl.classList.remove("shadow-2xl");
        clonedEl.style.boxShadow = "none";
      },
    });
  } finally {
    if (hadShadow) el.classList.add("shadow-2xl");
    el.style.boxShadow = originalBoxShadow;
    // Restore SVG text inline styles
    svgTexts.forEach((t) => { t.style.fontFamily = ""; });
  }
}

// ─── Exported helper: builds the pixel-perfect ID card PDF base64 ─────────────
// Called by the founder's workflow (handleSendOffer) to pre-generate the PDF
// before the candidate signs, so the sign route can attach it to the email.
export async function buildIdCardPdfBase64(
  frontEl: HTMLDivElement,
  backEl: HTMLDivElement,
): Promise<string> {
  const [frontCanvas, backCanvas] = await Promise.all([
    captureCard(frontEl, { scale: 3, backgroundColor: "#0A0B10" }),
    captureCard(backEl,  { scale: 3, backgroundColor: null }),
  ]);

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, PDF_PAGE_W, PDF_PAGE_H, "F");
  doc.addImage(frontCanvas.toDataURL("image/png"), "PNG", PDF_FRONT_X, PDF_CARD_Y, PDF_CARD_W, PDF_CARD_H);
  doc.addImage(backCanvas.toDataURL("image/png"),  "PNG", PDF_BACK_X,  PDF_CARD_Y, PDF_CARD_W, PDF_CARD_H);

  const buf = doc.output("arraybuffer");
  const bytes = new Uint8Array(buf);
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface IdCardWorkspaceProps {
  initialData?: Partial<EmployeeCard>;
  controlledPhotoUrl?: string;
  onPhotoChange?: (dataUrl: string) => void;
  onRequestPdfBase64?: (getter: () => Promise<string>) => void;
  /** When true, hides the photo upload section (used in founder workspace — candidate uploads their own photo) */
  hidePhotoUpload?: boolean;
}

export default function IdCardWorkspace({
  initialData,
  controlledPhotoUrl,
  onPhotoChange,
  onRequestPdfBase64,
  hidePhotoUpload = false,
}: IdCardWorkspaceProps) {
  const isControlled = controlledPhotoUrl !== undefined;
  const defaultIssueDate = React.useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [],
  );
  const [uncontrolledPhotoUrl, setUncontrolledPhotoUrl] = useState(initialData?.photoUrl || "");

  const card: EmployeeCard = React.useMemo(
    () => ({
      fullName: initialData?.fullName || "",
      position: initialData?.position || "",
      employeeId: initialData?.employeeId || "000-000-0001",
      bloodGroup: initialData?.bloodGroup || "A+",
      department: initialData?.department || "",
      photoUrl: isControlled ? controlledPhotoUrl || "" : uncontrolledPhotoUrl,
      issueDate: initialData?.issueDate || defaultIssueDate,
      expiryDate: initialData?.expiryDate || "",
    }),
    [controlledPhotoUrl, defaultIssueDate, initialData, isControlled, uncontrolledPhotoUrl],
  );

  const [isExportingFront, setIsExportingFront] = useState(false);
  const [isExportingBack, setIsExportingBack] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

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
  const backRef = useRef<HTMLDivElement>(null);

  // Register the PDF getter with the parent so it can call it before sending offer
  useEffect(() => {
    if (!onRequestPdfBase64) return;
    onRequestPdfBase64(async () => {
      if (!frontRef.current || !backRef.current) return "";
      try {
        return await buildIdCardPdfBase64(frontRef.current, backRef.current);
      } catch {
        return "";
      }
    });
  }, [onRequestPdfBase64]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (isControlled && onPhotoChange) {
        onPhotoChange(dataUrl);
      } else {
        setUncontrolledPhotoUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const exportFront = async () => {
    if (!frontRef.current) return;
    setIsExportingFront(true);
    try {
      const canvas = await captureCard(frontRef.current, {
        scale: 3,
        backgroundColor: "#0A0B10",
      });
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
      const canvas = await captureCard(backRef.current, {
        scale: 3,
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

  // Builds the PDF from the SAME captures used for the PNG downloads, so the
  // PDF is guaranteed to match the on-screen design exactly — front and back
  // side-by-side on one A4 landscape page.
  const exportPdf = async () => {
    if (!frontRef.current || !backRef.current) return;
    setIsExportingPdf(true);
    try {
      const [frontCanvas, backCanvas] = await Promise.all([
        captureCard(frontRef.current, { scale: 3, backgroundColor: "#0A0B10" }),
        captureCard(backRef.current, { scale: 3, backgroundColor: null }),
      ]);

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, PDF_PAGE_W, PDF_PAGE_H, "F");

      doc.addImage(
        frontCanvas.toDataURL("image/png"),
        "PNG",
        PDF_FRONT_X,
        PDF_CARD_Y,
        PDF_CARD_W,
        PDF_CARD_H,
      );
      doc.addImage(
        backCanvas.toDataURL("image/png"),
        "PNG",
        PDF_BACK_X,
        PDF_CARD_Y,
        PDF_CARD_W,
        PDF_CARD_H,
      );

      doc.save(`${card.fullName || "Employee"} - JEVXO ID Card.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
    } finally {
      setIsExportingPdf(false);
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
            <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
              Employee ID Card
            </h2>
            <p className="text-[#64748B] text-xs">
              {hidePhotoUpload
                ? "Card details are pulled from the appointment form. The candidate uploads their own photo in the candidate portal."
                : "Card details are pulled from the appointment form. Upload the employee photo below."}
            </p>
          </div>

          {/* Photo Upload */}
          {!hidePhotoUpload && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[#334155] uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3 h-3 text-[#2563EB]" />
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
                  <span className="text-[10px] text-[#CBD5E1]">
                    PNG, JPG — recommended 400×600px
                  </span>
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
                  if (isControlled && onPhotoChange) onPhotoChange("");
                  else setUncontrolledPhotoUrl("");
                }}
                className="text-[10px] font-semibold text-red-400 hover:text-red-600 text-right transition cursor-pointer"
              >
                Remove photo
              </button>
            )}
          </div>
          )}

          {/* Read-only fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3 sm:gap-4">
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
            <button
              onClick={exportPdf}
              disabled={isExportingPdf}
              className="flex-1 py-2.5 px-4 border border-[#DBEAFE] hover:border-emerald-500 hover:bg-emerald-50 text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              {isExportingPdf ? "Generating..." : "Download Both (PDF)"}
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
            width: CARD_W * previewScale * 2 + 40 * previewScale, // front + back + gap
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
