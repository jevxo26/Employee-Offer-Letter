/**
 * Server-side ID card PDF generator.
 * Uses jsPDF in pure data mode — no DOM, no canvas, no native bindings.
 * Safe to run in Vercel serverless / edge functions.
 *
 * Produces a single A5-landscape page with:
 *   Left half  — ID card front (dark bg, name, position, partner ID, QR)
 *   Right half — ID card back  (back image)
 */

import { jsPDF } from "jspdf";
import * as QRCodeLib from "qrcode";
import fs from "fs/promises";
import path from "path";

// ─── Dimensions (A5 landscape in mm) ─────────────────────────────────────────
const PAGE_W = 210;   // A5 landscape width
const PAGE_H = 148;   // A5 landscape height
const HALF   = PAGE_W / 2;  // 105mm — dividing line between front and back

// ─── Brand colours ────────────────────────────────────────────────────────────
const BG        = "#0A0B10";
const PURPLE    = "#7B3FF5";
const WHITE     = "#FFFFFF";
const WHITE_DIM = "#AAAAAA";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function readPublicAsBase64(filename: string): Promise<string> {
  const filePath = path.join(process.cwd(), "public", filename);
  const buf = await fs.readFile(filePath);
  return buf.toString("base64");
}

async function readAssetsAsBase64(filename: string): Promise<string> {
  const filePath = path.join(process.cwd(), "assets", filename);
  const buf = await fs.readFile(filePath);
  return buf.toString("base64");
}

async function makeQrBase64(text: string): Promise<string> {
  // Returns a PNG data URL — strip the prefix, keep base64
  const dataUrl = await QRCodeLib.toDataURL(text, {
    width: 200,
    margin: 1,
    color: { dark: "#000000", light: "#ffffff" },
  });
  return dataUrl.replace(/^data:image\/png;base64,/, "");
}

// Wrap text into lines that fit within maxWidth (mm) at current font size
function splitText(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth) as string[];
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function generateIdCardPdf(
  agreement: Record<string, unknown>
): Promise<string> {
  const secondParty = (agreement.secondParty as Record<string, string>) || {};
  const docSettings = (agreement.docSettings as Record<string, unknown>) || {};

  const fullName  = (secondParty.fullName  || "Employee Name").toUpperCase();
  const position  = secondParty.position   || "Partner";
  const partnerId = secondParty.partnerId  || (agreement.partnerId as string) || "";
  const photoB64  = secondParty.photoUrl   || "";   // already base64 data URL from form
  const issueDate = (docSettings.date as string) || "";

  // QR links to jevxo.com verify
  const verifyUrl = `https://www.jevxo.com/verify/${encodeURIComponent(
    partnerId.replace(/\//g, "-")
  )}`;

  // Load assets in parallel
  const [qrB64, xLogoB64, logoB64, backB64] = await Promise.all([
    makeQrBase64(verifyUrl),
    readPublicAsBase64("x-logo0bg.png").catch(() => ""),
    readAssetsAsBase64("logo0bg.png").catch(() => ""),
    readPublicAsBase64("id-card-back.png").catch(() => ""),
  ]);

  // ── Build PDF ──────────────────────────────────────────────────────────────
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a5",
    compress: true,
  });

  // ── FRONT — left half ──────────────────────────────────────────────────────

  // Dark background
  doc.setFillColor(10, 11, 16);
  doc.rect(0, 0, HALF, PAGE_H, "F");

  // X-logo watermark (right portion of front half, semi-transparent via low opacity trick)
  if (xLogoB64) {
    try {
      doc.saveGraphicsState();
      // jsPDF doesn't have native opacity for images, so we overlay a semi-transparent rect after
      doc.addImage(`data:image/png;base64,${xLogoB64}`, "PNG", HALF - 65, 5, 70, 70);
      // Dim it with a semi-opaque dark overlay
      doc.setFillColor(10, 11, 16);
      doc.setGState(doc.GState({ opacity: 0.75 }));
      doc.rect(HALF - 65, 5, 70, 70, "F");
      doc.restoreGraphicsState();
    } catch { /* skip if image fails */ }
  }

  // Candidate photo (right ~65% of front half, top portion)
  if (photoB64) {
    try {
      // photoB64 may be a full data URL
      const photoData = photoB64.startsWith("data:")
        ? photoB64
        : `data:image/jpeg;base64,${photoB64}`;
      const mime = photoData.includes("image/png") ? "PNG" : "JPEG";
      const raw  = photoData.replace(/^data:image\/[^;]+;base64,/, "");
      doc.addImage(raw, mime, 26, 0, HALF - 26, PAGE_H * 0.72);
    } catch { /* skip if photo fails */ }
  }

  // JEVXO logo top-right of front half
  if (logoB64) {
    try {
      doc.addImage(`data:image/png;base64,${logoB64}`, "PNG", HALF - 38, 3, 35, 12);
    } catch { /* skip */ }
  }

  // Vertical name — left strip (rotated text)
  doc.saveGraphicsState();
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  // Draw each character stacked — simpler than true rotation in jsPDF
  const nameChars = fullName.split("").reverse();
  const charH     = 7;   // mm per character
  const nameH     = nameChars.length * charH;
  const nameStartY = Math.max(8, (PAGE_H * 0.68 - nameH) / 2 + 8);
  nameChars.forEach((char, i) => {
    if (char === " ") return;
    doc.text(char, 4, nameStartY + i * charH);
  });
  doc.restoreGraphicsState();

  // Bottom info panel — dark overlay
  const panelY = PAGE_H * 0.68;
  const panelH = PAGE_H - panelY;
  doc.setFillColor(10, 11, 16);
  doc.rect(0, panelY, HALF, panelH, "F");

  // Thin gradient-like accent line
  doc.setDrawColor(123, 63, 245);
  doc.setLineWidth(0.5);
  doc.line(0, panelY, HALF, panelY);

  // Position text (purple)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(123, 63, 245);
  const posLines = splitText(doc, position, HALF - 22);
  doc.text(posLines, HALF / 2 + 4, panelY + 7, { align: "center" });

  // Partner ID
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(220, 220, 220);
  doc.text(`Partner ID: ${partnerId}`, HALF / 2 + 4, panelY + 13, { align: "center" });

  // Issue date
  if (issueDate) {
    doc.setFontSize(6.5);
    doc.setTextColor(160, 160, 160);
    doc.text(`Joined: ${issueDate}`, HALF / 2 + 4, panelY + 18, { align: "center" });
  }

  // QR code (bottom-left of panel)
  if (qrB64) {
    try {
      doc.addImage(`data:image/png;base64,${qrB64}`, "PNG", 3, panelY + 22, 22, 22);
    } catch { /* skip */ }
  }

  // NFC label (bottom-right of panel)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(5.5);
  doc.setTextColor(180, 180, 180);
  doc.text("NFC", HALF - 7, PAGE_H - 4, { align: "center" });

  // Thin vertical divider between front and back
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(HALF, 0, HALF, PAGE_H);

  // ── BACK — right half ──────────────────────────────────────────────────────
  if (backB64) {
    try {
      doc.addImage(`data:image/png;base64,${backB64}`, "PNG", HALF, 0, HALF, PAGE_H);
    } catch { /* skip */ }
  } else {
    // Fallback: plain dark rectangle with JEVXO text
    doc.setFillColor(10, 11, 16);
    doc.rect(HALF, 0, HALF, PAGE_H, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(123, 63, 245);
    doc.text("JEVXO", HALF + HALF / 2, PAGE_H / 2, { align: "center" });
  }

  // ── Output as base64 ───────────────────────────────────────────────────────
  const output = doc.output("arraybuffer");
  const bytes  = new Uint8Array(output);
  let binary   = "";
  const chunk  = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}
