import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import * as QRCodeLib from "qrcode";

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 0,
  },
  // ── Front card ──
  front: {
    width: "50%",
    height: "100%",
    backgroundColor: "#0A0B10",
    position: "relative",
    padding: 0,
    overflow: "hidden",
  },
  frontBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.18,
  },
  frontPhoto: {
    position: "absolute",
    top: 10,
    right: 0,
    width: "82%",
    height: "72%",
    objectFit: "cover",
    objectPositionX: "center",
    objectPositionY: "top",
  },
  frontLogo: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 90,
    height: 30,
  },
  frontNameContainer: {
    position: "absolute",
    top: 16,
    left: 6,
    bottom: 160,
    width: 28,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  frontNameChar: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 1,
    transform: "rotate(-90deg)",
  },
  frontBottomPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: "rgba(10,11,16,0.97)",
    padding: "10 14 14 14",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  frontPosition: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#7B3FF5",
    textAlign: "center",
    marginBottom: 3,
    paddingLeft: 28,
  },
  frontEmployeeId: {
    fontSize: 8,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 2,
    paddingLeft: 28,
    opacity: 0.95,
  },
  frontIssueDate: {
    fontSize: 7,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 12,
    paddingLeft: 28,
    opacity: 0.75,
  },
  frontBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  frontQr: {
    width: 52,
    height: 52,
    backgroundColor: "#ffffff",
    padding: 3,
    borderRadius: 4,
  },
  frontNfcText: {
    fontSize: 7,
    color: "rgba(255,255,255,0.5)",
    alignSelf: "flex-end",
    marginBottom: 4,
  },
  // ── Back card ──
  back: {
    width: "50%",
    height: "100%",
  },
  backImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  // ── Divider ──
  divider: {
    width: 1,
    backgroundColor: "#e2e8f0",
  },
});

// ─── Helper: generate QR as data URL ─────────────────────────────────────────
async function makeQrDataUrl(text: string): Promise<string> {
  return QRCodeLib.toDataURL(text, {
    width: 120,
    margin: 1,
    color: { dark: "#000000", light: "#ffffff" },
  });
}

// ─── ID Card PDF document ─────────────────────────────────────────────────────
interface IdCardDocProps {
  fullName: string;
  position: string;
  employeeId: string;
  issueDate: string;
  photoUrl?: string;
  qrDataUrl: string;
  xLogoDataUrl: string;
  logoDataUrl: string;
  backImageDataUrl: string;
}

function IdCardDocument({
  fullName,
  position,
  employeeId,
  issueDate,
  photoUrl,
  qrDataUrl,
  xLogoDataUrl,
  logoDataUrl,
  backImageDataUrl,
}: IdCardDocProps) {
  const nameChars = fullName.toUpperCase().split("").reverse();

  return (
    <Document>
      <Page size="A5" orientation="landscape" style={styles.page}>
        {/* ── FRONT SIDE ── */}
        <View style={styles.front}>
          {/* X logo watermark */}
          <Image src={xLogoDataUrl} style={styles.frontBg} />

          {/* Photo */}
          {photoUrl && (
            <Image src={photoUrl} style={styles.frontPhoto} />
          )}

          {/* JEVXO logo top-right */}
          <Image src={logoDataUrl} style={styles.frontLogo} />

          {/* Vertical name — bottom to top */}
          <View style={styles.frontNameContainer}>
            {nameChars.map((char, i) => (
              <Text key={i} style={styles.frontNameChar}>
                {char === " " ? " " : char}
              </Text>
            ))}
          </View>

          {/* Bottom info panel */}
          <View style={styles.frontBottomPanel}>
            <Text style={styles.frontPosition}>
              {position || "Position"}
            </Text>
            <Text style={styles.frontEmployeeId}>
              ID No: {employeeId || "000-000-0001"}
            </Text>
            <Text style={styles.frontIssueDate}>
              Issue Date: {issueDate || "—"}
            </Text>
            <View style={styles.frontBottomRow}>
              <Image src={qrDataUrl} style={styles.frontQr} />
              <Text style={styles.frontNfcText}>NFC</Text>
            </View>
          </View>
        </View>

        {/* ── DIVIDER ── */}
        <View style={styles.divider} />

        {/* ── BACK SIDE ── */}
        <View style={styles.back}>
          <Image src={backImageDataUrl} style={styles.backImage} />
        </View>
      </Page>
    </Document>
  );
}

// ─── Public function ──────────────────────────────────────────────────────────
export async function generateIdCardPdf(
  agreement: Record<string, unknown>
): Promise<string> {
  const secondParty = (agreement.secondParty as Record<string, string>) || {};
  const docSettings = (agreement.docSettings as Record<string, unknown>) || {};

  const fullName   = secondParty.fullName   || "Employee Name";
  const position   = secondParty.position   || "Partner";
  const partnerId  = secondParty.partnerId  || (agreement.partnerId as string) || "";
  const photoUrl   = secondParty.photoUrl   || "";
  const employeeId = partnerId;
  const issueDate  = (docSettings.date as string) || "";

  // QR — links to jevxo.com verify
  const verifyUrl = `https://www.jevxo.com/verify/${encodeURIComponent(partnerId.replace(/\//g, "-"))}`;
  const qrDataUrl = await makeQrDataUrl(verifyUrl);

  // Read static assets as base64 data URLs
  const fs   = await import("fs/promises");
  const path = await import("path");
  const cwd  = process.cwd();

  const readAsDataUrl = async (filePath: string, mime: string) => {
    const buf = await fs.readFile(filePath);
    return `data:${mime};base64,${buf.toString("base64")}`;
  };

  const xLogoDataUrl   = await readAsDataUrl(path.join(cwd, "public", "x-logo0bg.png"), "image/png");
  const logoDataUrl    = await readAsDataUrl(path.join(cwd, "assets", "logo0bg.png"),   "image/png");
  const backImageDataUrl = await readAsDataUrl(path.join(cwd, "public", "id-card-back.png"), "image/png");

  const doc = React.createElement(IdCardDocument, {
    fullName,
    position,
    employeeId,
    issueDate,
    photoUrl: photoUrl || undefined,
    qrDataUrl,
    xLogoDataUrl,
    logoDataUrl,
    backImageDataUrl,
  });

  const buffer = await renderToBuffer(doc as React.ReactElement);
  return buffer.toString("base64");
}
