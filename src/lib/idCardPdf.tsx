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
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 1,
  },
  frontBottomPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 155,
    backgroundColor: "#0A0B10",
    padding: 12,
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
    marginBottom: 10,
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
    color: "#ffffff",
    alignSelf: "flex-end",
    marginBottom: 4,
    opacity: 0.5,
  },
  divider: {
    width: 1,
    backgroundColor: "#e2e8f0",
  },
  back: {
    width: "50%",
    height: "100%",
  },
  backImage: {
    width: "100%",
    height: "100%",
  },
});

// ─── QR helper ────────────────────────────────────────────────────────────────
async function makeQrDataUrl(text: string): Promise<string> {
  return QRCodeLib.toDataURL(text, {
    width: 120,
    margin: 1,
    color: { dark: "#000000", light: "#ffffff" },
  });
}

// ─── PDF Document component ───────────────────────────────────────────────────
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
        {/* FRONT */}
        <View style={styles.front}>
          <Image src={xLogoDataUrl} style={styles.frontBg} />
          {photoUrl ? <Image src={photoUrl} style={styles.frontPhoto} /> : null}
          <Image src={logoDataUrl} style={styles.frontLogo} />

          <View style={styles.frontNameContainer}>
            {nameChars.map((char, i) => (
              <Text key={i} style={styles.frontNameChar}>
                {char === " " ? " " : char}
              </Text>
            ))}
          </View>

          <View style={styles.frontBottomPanel}>
            <Text style={styles.frontPosition}>{position || "Partner"}</Text>
            <Text style={styles.frontEmployeeId}>
              Partner ID: {employeeId || "000-000-001"}
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

        {/* DIVIDER */}
        <View style={styles.divider} />

        {/* BACK */}
        <View style={styles.back}>
          <Image src={backImageDataUrl} style={styles.backImage} />
        </View>
      </Page>
    </Document>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
export async function generateIdCardPdf(
  agreement: Record<string, unknown>
): Promise<string> {
  const secondParty =
    (agreement.secondParty as Record<string, string>) || {};
  const docSettings =
    (agreement.docSettings as Record<string, unknown>) || {};

  const fullName  = secondParty.fullName  || "Employee Name";
  const position  = secondParty.position  || "Partner";
  const partnerId =
    secondParty.partnerId || (agreement.partnerId as string) || "";
  const photoUrl  = secondParty.photoUrl  || "";
  const issueDate = (docSettings.date as string) || "";

  const verifyUrl = `https://www.jevxo.com/verify/${encodeURIComponent(
    partnerId.replace(/\//g, "-")
  )}`;
  const qrDataUrl = await makeQrDataUrl(verifyUrl);

  const fsModule   = await import("fs/promises");
  const pathModule = await import("path");
  const cwd        = process.cwd();

  const readAsDataUrl = async (filePath: string, mime: string) => {
    const buf = await fsModule.readFile(filePath);
    return `data:${mime};base64,${buf.toString("base64")}`;
  };

  const xLogoDataUrl = await readAsDataUrl(
    pathModule.join(cwd, "public", "x-logo0bg.png"),
    "image/png"
  );
  const logoDataUrl = await readAsDataUrl(
    pathModule.join(cwd, "assets", "logo0bg.png"),
    "image/png"
  );
  const backImageDataUrl = await readAsDataUrl(
    pathModule.join(cwd, "public", "id-card-back.png"),
    "image/png"
  );

  const buffer = await renderToBuffer(
    <IdCardDocument
      fullName={fullName}
      position={position}
      employeeId={partnerId}
      issueDate={issueDate}
      photoUrl={photoUrl || undefined}
      qrDataUrl={qrDataUrl}
      xLogoDataUrl={xLogoDataUrl}
      logoDataUrl={logoDataUrl}
      backImageDataUrl={backImageDataUrl}
    />
  );

  return buffer.toString("base64");
}
