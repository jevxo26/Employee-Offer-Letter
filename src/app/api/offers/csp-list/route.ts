import { NextResponse } from "next/server";
import { listAgreements } from "../../../../lib/agreementStore";

/**
 * GET /api/offers/csp-list
 * Returns all FULLY_EXECUTED Country Sales Partner agreements
 * with the minimal fields needed to populate the SAG wizard dropdown.
 */
export async function GET() {
  try {
    const all = await listAgreements();

    const cspList = all
      .filter(
        (a) => {
          const salesType =
            (a.salesAgreementType as string | undefined) ||
            (a.docSettings as Record<string, unknown> | undefined)?.salesAgreementType as string | undefined;
          return a.status === "FULLY_EXECUTED" && salesType === "countrySales";
        },
      )
      .map((a) => {
        const sp = a.secondParty as Record<string, string> | undefined;
        const ds = a.docSettings as Record<string, unknown> | undefined;
        return {
          salesPartnerId:
            sp?.salesPartnerId || (ds?.salesPartnerId as string) || "",
          fullName: sp?.fullName || "",
          email: sp?.email || "",
          phone: sp?.mobileNumber || "",
          address: sp?.presentAddress || "",
          salesRefId: (ds?.salesRefId as string) || a.agreementId || "",
          territory: (ds?.territory as string) || "",
        };
      })
      // filter out any entry that has no CSP ID
      .filter((c) => Boolean(c.salesPartnerId));

    return NextResponse.json({ success: true, cspList });
  } catch (err: unknown) {
    console.error("[csp-list] Error:", err);
    return NextResponse.json(
      { error: "Failed to load CSP list." },
      { status: 500 },
    );
  }
}
