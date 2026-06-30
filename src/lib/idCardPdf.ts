/**
 * Server-side ID card PDF generator — production safe for Vercel.
 * Uses jsPDF in pure data mode (no DOM, no canvas, no native bindings).
 *
 * Output: A4 landscape, two portrait ID cards side-by-side with a gap.
 *   Left  card — front (dark themed, photo, name, position, QR)
 *   Right card — back  (static id-card-back.png)
 *
 * Layout (A4 landscape = 297 × 210 mm):
 *   margin: 8mm each side
 *   gap between cards: 10mm
 *   each card width: (297 - 8 - 8 - 10) / 2 = 135.5mm
 *   each card height: 210 - 8 - 8 = 194mm
 *   card x positions: front at 8mm, back at 8 + 135.5 + 10 = 153.5mm
 */

import { jsPDF } from "jspdf";
import * as QRCodeLib from "qrcode";
import fs from "fs/promises";
import path from "path";

// ─── Page & card geometry ─────────────────────────────────────────────────────
const PW      = 297;   // A4 landscape width mm
const PH      = 210;   // A4 landscape height mm
const MARGIN  = 8;     // outer margin mm
const GAP     = 10;    // gap between the two cards mm
const CARD_W  = (PW - MARGIN * 2 - GAP) / 2;  // ~135.5 mm
const CARD_H  = PH - MARGIN * 2;               // 194 mm
const FRONT_X = MARGIN;
const BACK_X  = MARGIN + CARD_W + GAP;
const CARD_Y  = MARGIN;

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function readFileB64(filePath: string): Promise<string> {
  try {
    const buf = await fs.readFile(filePath);
    return buf.toString("base64");
  } catch {
    return "";
  }
}

async function makeQrB64(text: string): Promise<string> {
  const dataUrl = await QRCodeLib.toDataURL(text, {
    width: 256,
    margin: 1,
    color: { dark: "#000000", light: "#ffffff" },
  });
  return dataUrl.replace(/^data:image\/png;base64,/, "");
}

// Convert hex colour to [r, g, b]
function hexRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

// ─── Draw the front card ──────────────────────────────────────────────────────
function drawFront(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  opts: {
    fullName: string;
    position: string;
    partnerId: string;
    issueDate: string;
    photoB64: string;
    qrB64: string;
    xLogoB64: string;
    logoB64: string;
  }
) {
  const { fullName, position, partnerId, issueDate, photoB64, qrB64, xLogoB64, logoB64 } = opts;

  // ── Card background ──
  const [bgR, bgG, bgB] = hexRgb("#0A0B10");
  doc.setFillColor(bgR, bgG, bgB);
  doc.roundedRect(x, y, w, h, 4, 4, "F");

  // Clip to card bounds for all subsequent drawing
  doc.saveGraphicsState();

  // ── X-logo watermark behind photo ──
  if (xLogoB64) {
    try {
      // Place large in top-right quadrant of card, dimmed
      const logoW = w * 0.75;
      const logoH = logoW;
      doc.addImage(
        `data:image/png;base64,${xLogoB64}`, "PNG",
        x + w - logoW * 0.55, y + h * 0.08,
        logoW, logoH
      );
      // Overlay to dim it
      doc.setGState(doc.GState({ opacity: 0.78 }));
      doc.setFillColor(bgR, bgG, bgB);
      doc.rect(x, y, w, h * 0.72, "F");
      doc.setGState(doc.GState({ opacity: 1 }));
    } catch { /* skip */ }
  }

  // ── Candidate photo — right ~72% of card, top 72% ──
  if (photoB64) {
    try {
      const photoData = photoB64.startsWith("data:") ? photoB64 : `data:image/jpeg;base64,${photoB64}`;
      const mime = photoData.includes("image/png") ? "PNG" : "JPEG";
      const raw  = photoData.replace(/^data:image\/[^;]+;base64,/, "");
      const leftStrip = w * 0.16;  // reserved for vertical name
      doc.addImage(raw, mime, x + leftStrip, y, w - leftStrip, h * 0.72);
    } catch { /* skip */ }
  }

  // ── JEVXO logo — top right of card ──
  if (logoB64) {
    try {
      const lw = w * 0.42;
      const lh = lw * 0.32;
      doc.addImage(`data:image/png;base64,${logoB64}`, "PNG", x + w - lw - 4, y + 5, lw, lh);
    } catch { /* skip */ }
  }

  // ── Vertical name — left strip, bottom to top ──
  const nameChars = fullName.toUpperCase().split("").reverse();
  const stripW    = w * 0.13;
  const charSize  = Math.min(10, (h * 0.68) / Math.max(nameChars.length, 1) * 1.5);
  const charH     = (h * 0.62) / Math.max(nameChars.length, 1);
  const nameAreaH = nameChars.length * charH;
  const nameStartY = y + h * 0.05 + Math.max(0, (h * 0.65 - nameAreaH) / 2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(Math.max(7, Math.min(charSize, 11)));
  doc.setTextColor(255, 255, 255);

  nameChars.forEach((char, i) => {
    if (char === " ") return;
    const cx = x + stripW / 2;
    const cy = nameStartY + i * charH + charH * 0.7;
    if (cy < y + h * 0.68) {
      doc.text(char, cx, cy, { align: "center" });
    }
  });

  // ── Bottom info panel ──
  const panelY = y + h * 0.70;
  const panelH = h - h * 0.70;

  // Dark solid panel
  doc.setFillColor(bgR, bgG, bgB);
  doc.rect(x, panelY, w, panelH, "F");

  // ── Position on gradient bar (simulate purple→blue gradient with rect) ──
  const barX = x + w * 0.14;
  const barW = w * 0.83;
  const barH = 10;
  const barY = panelY + 4;

  // Simulate gradient: draw overlapping rects from purple to blue
  const steps = 20;
  for (let s = 0; s < steps; s++) {
    const t   = s / (steps - 1);
    const r   = Math.round(123 + (37  - 123) * t);  // 123→37  (#7B→#25)
    const g   = Math.round(63  + (98  - 63)  * t);  // 63→98   (#3F→#62)
    const bv  = Math.round(245 + (255 - 245) * t);  // 245→255 (#F5→#FF)
    doc.setFillColor(r, g, bv);
    doc.rect(barX + (barW / steps) * s, barY, barW / steps + 0.5, barH, "F");
  }

  // Position text on bar
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  const posLines = doc.splitTextToSize(position, barW - 4) as string[];
  doc.text(posLines[0] || position, barX + barW / 2, barY + 7, { align: "center" });

  // ── ID No & Issue Date — left-aligned below bar ──
  const textX = x + w * 0.16;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`ID No: ${partnerId}`, textX, barY + barH + 6);

  if (issueDate) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(220, 220, 220);
    doc.text(`Issue Date: ${issueDate}`, textX, barY + barH + 12);
  }

  // QR code — bottom left
  const qrSize = Math.min(panelH * 0.68, 28);
  const qrX    = x + 3;
  const qrY    = y + h - qrSize - 5;
  if (qrB64) {
    try {
      doc.setFillColor(255, 255, 255);
      doc.rect(qrX - 1, qrY - 1, qrSize + 2, qrSize + 2, "F");
      doc.addImage(`data:image/png;base64,${qrB64}`, "PNG", qrX, qrY, qrSize, qrSize);
    } catch { /* skip */ }
  }

  // NFC icon text — bottom right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(5.5);
  doc.setTextColor(160, 160, 160);
  doc.text("((•))", x + w - 6, y + h - 4, { align: "center" });

  doc.restoreGraphicsState();
}

// ─── Main export ──────────────────────────────────────────────────────────────
export async function generateIdCardPdf(
  agreement: Record<string, unknown>
): Promise<string> {
  const secondParty = (agreement.secondParty as Record<string, string>) || {};
  const docSettings = (agreement.docSettings as Record<string, unknown>) || {};

  const fullName  = secondParty.fullName  || "Employee Name";
  const position  = secondParty.position  || "Partner";
  const partnerId = secondParty.partnerId || (agreement.partnerId as string) || "";
  const photoB64  = secondParty.photoUrl  || "";
  const issueDate = (docSettings.date as string) || "";

  const verifyUrl = `https://www.jevxo.com/verify/${encodeURIComponent(
    partnerId.replace(/\//g, "-")
  )}`;

  const cwd = process.cwd();

  const [qrB64, xLogoB64, logoB64, backB64] = await Promise.all([
    makeQrB64(verifyUrl),
    readFileB64(path.join(cwd, "public",  "x-logo0bg.png")),
    readFileB64(path.join(cwd, "assets",  "logo0bg.png")),
    readFileB64(path.join(cwd, "public",  "id-card-back.png")),
  ]);

  // ── Create A4 landscape page ──────────────────────────────────────────────
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  // Light grey page background to show card boundaries
  doc.setFillColor(230, 232, 238);
  doc.rect(0, 0, PW, PH, "F");

  // ── Draw front card ───────────────────────────────────────────────────────
  drawFront(doc, FRONT_X, CARD_Y, CARD_W, CARD_H, {
    fullName,
    position,
    partnerId,
    issueDate,
    photoB64,
    qrB64,
    xLogoB64,
    logoB64,
  });

  // ── Draw back card (static image) ─────────────────────────────────────────
  if (backB64) {
    try {
      doc.addImage(
        `data:image/png;base64,${backB64}`, "PNG",
        BACK_X, CARD_Y, CARD_W, CARD_H
      );
    } catch { /* skip */ }
  } else {
    // Fallback dark card
    doc.setFillColor(...hexRgb("#0A0B10"));
    doc.roundedRect(BACK_X, CARD_Y, CARD_W, CARD_H, 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...hexRgb("#7B3FF5"));
    doc.text("JEVXO", BACK_X + CARD_W / 2, CARD_Y + CARD_H / 2, { align: "center" });
  }

  // ── Output ────────────────────────────────────────────────────────────────
  const output = doc.output("arraybuffer");
  const bytes  = new Uint8Array(output);
  let binary   = "";
  const chunk  = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}
