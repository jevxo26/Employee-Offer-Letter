import { NextResponse } from "next/server";
import {
  generateCertificateIds,
  saveAgreement,
  findAgreementById,
  updateAgreement,
} from "../../../../lib/agreementStore";

/**
 * POST /api/offers/certificate
 * Generates certificate sequential IDs, saves the certificate document,
 * and updates the original internship agreement to sync edits and set certificateGenerated = true.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstParty,
      secondParty,
      docSettings,
      docType = "Intern Certificate",
    } = body;

    // Generate unique sequential IDs for the certificate
    const generated = await generateCertificateIds();
    const certRefId = generated.certRefId;
    const certId = generated.certId;
    const storage = generated.storage;

    // Build the certificate document settings
    const certificateDocSettings = {
      ...docSettings,
      agreementTemplate: "internCertificate",
      certRefId,
      certId,
      date: docSettings.date || new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    // Save the certificate document record
    const certDoc = await saveAgreement({
      agreementId: certRefId,
      partnerId: certId,
      docType,
      status: "FULLY_EXECUTED",
      founderSigned: true,
      partnerSigned: true,
      signedAt: new Date(),
      firstParty,
      secondParty,
      docSettings: certificateDocSettings,
    });

    // Mutate the original internship agreement to keep details perfectly synced
    const originalAgreementId = docSettings.certOriginalAgreementId;
    if (originalAgreementId) {
      const originalAgreement = await findAgreementById(originalAgreementId);
      if (originalAgreement) {
        // Sync modified details back to the original agreement
        const updatedOriginalSecondParty = {
          ...originalAgreement.secondParty,
          fullName: secondParty.fullName,
          position: secondParty.position,
          department: secondParty.department || "",
        };

        const updatedOriginalDocSettings = {
          ...originalAgreement.docSettings,
          date: docSettings.certStartDate || originalAgreement.docSettings.date,
          internExpiryDate: docSettings.certEndDate || originalAgreement.docSettings.internExpiryDate,
          certificateGenerated: true,
          certPerformanceGrade: docSettings.certPerformanceGrade,
        };

        await updateAgreement(originalAgreementId, {
          secondParty: updatedOriginalSecondParty,
          docSettings: updatedOriginalDocSettings,
          isCertificateIssued: true,
          certificateId: certId,
          certificatePdfUrl: `/storage/certificates/${certId}.pdf`,
        });

        console.log(`[certificate API] Mutated original agreement ${originalAgreementId} successfully.`);
      } else {
        console.warn(`[certificate API] Original agreement ${originalAgreementId} not found to mutate.`);
      }
    }

    console.log(`[certificate API] Certificate generated (${storage}): ${certRefId}`);
    return NextResponse.json({
      success: true,
      agreementId: certRefId,
      partnerId: certId,
      storage,
    });
  } catch (err: unknown) {
    console.error("[Next.js API] Error issuing certificate:", err);
    return NextResponse.json(
      {
        error: "Failed to issue certificate.",
        details: process.env.NODE_ENV === "development" ? (err as Error).message : undefined,
      },
      { status: 500 }
    );
  }
}
