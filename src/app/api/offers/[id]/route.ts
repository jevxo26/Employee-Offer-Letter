import { NextResponse } from "next/server";
import { findAgreementById } from "../../../../lib/agreementStore";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const agreement = await findAgreementById(id);

    if (!agreement) {
      return NextResponse.json({ error: "Agreement not found." }, { status: 404 });
    }

    return NextResponse.json(agreement);
  } catch (err: unknown) {
    console.error("[Next.js API] Error retrieving agreement:", err);
    return NextResponse.json({ error: "Failed to retrieve agreement." }, { status: 500 });
  }
}
