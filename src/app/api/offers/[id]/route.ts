import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Agreement from "../../../../models/Agreement";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await dbConnect();
    
    const agreement = await Agreement.findOne({ agreementId: id });

    if (!agreement) {
      return NextResponse.json({ error: "Agreement not found." }, { status: 404 });
    }

    return NextResponse.json(agreement);
  } catch (err: any) {
    console.error("[Next.js API] Error retrieving agreement:", err);
    return NextResponse.json({ error: "Failed to retrieve agreement." }, { status: 500 });
  }
}
