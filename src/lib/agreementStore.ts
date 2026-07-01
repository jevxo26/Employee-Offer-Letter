import dbConnect from "./mongodb";
import Agreement from "../models/Agreement";
import * as fileStore from "./fileAgreementStore";

export { TOTAL_DOCUMENT_PAGES } from "./documentConstants";

async function tryMongo<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    await dbConnect();
    return await fn();
  } catch (err: unknown) {
    console.warn(
      "[agreementStore] MongoDB unavailable, using local file store:",
      (err as Error).message,
    );
    return null;
  }
}

export async function generateAgreementIds() {
  const mongoIds = await tryMongo(async () => {
    const currentYearStr = new Date().getFullYear().toString().slice(-2);
    const latestAgreement = await Agreement.findOne({
      agreementId: new RegExp(`^JVX-AGR-${currentYearStr}-`),
    }).sort({ createdAt: -1 });

    let nextSequence = 1;
    if (latestAgreement) {
      const parts = latestAgreement.agreementId.split("-");
      const lastSequence = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(lastSequence)) nextSequence = lastSequence + 1;
    }

    const sequenceStr = nextSequence.toString().padStart(3, "0");
    return {
      agreementId: `JVX-AGR-${currentYearStr}-${sequenceStr}`,
      partnerId: `JVX-PT-${currentYearStr}-${sequenceStr}`,
    };
  });

  if (mongoIds) return { ...mongoIds, storage: "mongodb" as const };
  const fileIds = await fileStore.fileGenerateIds();
  return { ...fileIds, storage: "file" as const };
}

export async function saveAgreement(data: Record<string, unknown>) {
  const mongoDoc = await tryMongo(async () => {
    const doc = new Agreement(data);
    await doc.save();
    return doc.toObject();
  });

  if (mongoDoc) return { agreement: mongoDoc, storage: "mongodb" as const };

  const fileDoc = await fileStore.fileSaveAgreement(data);
  return { agreement: fileDoc, storage: "file" as const };
}

export async function findAgreementById(id: string) {
  const normalized = decodeURIComponent(id).trim();

  const mongoDoc = await tryMongo(async () => {
    let agreement = await Agreement.findOne({ agreementId: normalized });
    if (!agreement) {
      agreement = await Agreement.findOne({ partnerId: normalized });
    }
    return agreement?.toObject() || null;
  });

  if (mongoDoc) return mongoDoc;
  return fileStore.fileFindAgreement(normalized);
}

export async function listAgreements() {
  const mongoList = await tryMongo(async () => {
    const docs = await Agreement.find({}, "-letterPDFdata -cardPDFdata")
      .sort({ createdAt: -1 })
      .limit(200);
    return docs.map((d) => d.toObject());
  });

  if (mongoList) return mongoList;
  const fileList = await fileStore.fileListAgreements();
  return fileList.map(
    ({ letterPDFdata: _letter, cardPDFdata: _card, ...rest }) => rest,
  );
}

export async function updateAgreement(
  agreementId: string,
  updates: Record<string, unknown>,
) {
  const mongoDoc = await tryMongo(async () => {
    const agreement = await Agreement.findOne({ agreementId });
    if (!agreement) return null;

    Object.assign(agreement, updates);
    if (updates.secondParty) agreement.markModified("secondParty");
    await agreement.save();
    return agreement.toObject();
  });

  if (mongoDoc) return mongoDoc;
  return fileStore.fileUpdateAgreement(agreementId, updates);
}

export function toAgreementSummary(agreement: Record<string, unknown>) {
  return {
    agreementId: agreement.agreementId,
    partnerId: agreement.partnerId,
    docType: agreement.docType || "appointment",
    status: agreement.status,
    founderSigned: agreement.founderSigned,
    partnerSigned: agreement.partnerSigned,
    signedAt: agreement.signedAt,
    createdAt: agreement.createdAt,
    partnerName:
      (agreement.secondParty as Record<string, string> | undefined)?.fullName ||
      "",
    partnerEmail:
      (agreement.secondParty as Record<string, string> | undefined)?.email ||
      "",
    companyName:
      (agreement.firstParty as Record<string, string> | undefined)
        ?.companyName || "",
    position:
      (agreement.secondParty as Record<string, string> | undefined)?.position ||
      "",
  };
}
