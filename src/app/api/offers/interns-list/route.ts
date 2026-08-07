import { NextResponse } from "next/server";
import { listAgreements } from "../../../../lib/agreementStore";

/**
 * GET /api/offers/interns-list
 * Returns all FULLY_EXECUTED Internship agreements
 * that have not yet received a certificate (docSettings.certificateGenerated !== true).
 */
export async function GET() {
  try {
    const all = await listAgreements();

    const internsList = all
      .filter((a) => {
        const ds = a.docSettings as Record<string, unknown> | undefined;
        const template = ds?.agreementTemplate || a.agreementTemplate;
        const isInternship = template === "internship";
        const hasCertificate = ds?.certificateGenerated === true;
        return a.status === "FULLY_EXECUTED" && isInternship && !hasCertificate;
      })
      .map((a) => {
        const sp = a.secondParty as Record<string, string> | undefined;
        const ds = a.docSettings as Record<string, unknown> | undefined;
        
        // Find start and end date
        // Default startDate to the date the agreement was created or signed, or docSettings.date
        const startDate = (ds?.date as string) || (a.createdAt as string) || "";
        const endDate = (ds?.internExpiryDate as string) || "";

        return {
          agreementId: a.agreementId || "",
          internId: sp?.partnerId || (ds?.internId as string) || "",
          fullName: sp?.fullName || "",
          email: sp?.email || "",
          position: sp?.position || "",
          department: sp?.department || "",
          startDate,
          endDate,
          performanceGrade: sp?.performanceGrade || "",
        };
      })
      .filter((intern) => Boolean(intern.internId));

    return NextResponse.json({ success: true, internsList });
  } catch (err: unknown) {
    console.error("[interns-list API] Error:", err);
    return NextResponse.json(
      { error: "Failed to load interns list." },
      { status: 500 }
    );
  }
}
