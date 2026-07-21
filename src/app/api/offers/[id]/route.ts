import { NextResponse } from "next/server";
import { findAgreementById, deleteAgreement } from "../../../../lib/agreementStore";

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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let pin = "";
    try {
      const body = await request.json();
      pin = body.pin;
    } catch {}

    // Security check: Only allow deletion if PIN is exactly 22302010
    if (pin !== "22302010") {
      return NextResponse.json({ error: "Forbidden: Invalid security PIN." }, { status: 403 });
    }

    const success = await deleteAgreement(id);
    if (!success) {
      return NextResponse.json({ error: "Agreement not found or already deleted." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Agreement deleted successfully." });
  } catch (err: unknown) {
    console.error("[Next.js API] Error deleting agreement:", err);
    return NextResponse.json({ error: "Failed to delete agreement." }, { status: 500 });
  }
}
