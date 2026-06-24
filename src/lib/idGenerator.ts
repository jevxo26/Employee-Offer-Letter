import dbConnect from "./mongodb";
import Agreement from "../models/Agreement";

/**
 * Generates sequential IDs.
 * Format: JVX-AGR-YY-XXXX and JVX-PT-YY-XXXX
 */
export async function generateIds(): Promise<{ agreementId: string; partnerId: string }> {
  await dbConnect();
  
  const currentYearStr = new Date().getFullYear().toString().slice(-2); // e.g. "26"

  // Find the latest agreement for the current year
  const latestAgreement = await Agreement.findOne({
    agreementId: new RegExp(`^JVX-AGR-${currentYearStr}-`)
  }).sort({ createdAt: -1 });

  let nextSequence = 1;

  if (latestAgreement) {
    const parts = latestAgreement.agreementId.split("-");
    const lastSequence = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastSequence)) {
      nextSequence = lastSequence + 1;
    }
  }

  const sequenceStr = nextSequence.toString().padStart(4, "0");

  const agreementId = `JVX-AGR-${currentYearStr}-${sequenceStr}`;
  const partnerId = `JVX-PT-${currentYearStr}-${sequenceStr}`;

  return { agreementId, partnerId };
}
