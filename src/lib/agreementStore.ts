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

export async function generateInternIds() {
  const currentYearStr = new Date().getFullYear().toString().slice(-2);
  const refPrefix  = `JVX-INT-REF-${currentYearStr}-`;
  const internPrefix = `JVX-INT-${currentYearStr}-`;

  const mongoIds = await tryMongo(async () => {
    // Fetch ALL intern agreements for the current year (not just the last inserted)
    // and find the true maximum sequence to avoid gaps / out-of-order issues.
    const internDocs = await Agreement.find({
      agreementId: new RegExp(`^JVX-INT-REF-${currentYearStr}-`),
    }, "agreementId");

    let maxSequence = 0;
    for (const doc of internDocs) {
      const parts = doc.agreementId.split("-");
      const seq = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(seq) && seq > maxSequence) maxSequence = seq;
    }

    const seq = (maxSequence + 1).toString().padStart(3, "0");
    return {
      internId:    `${internPrefix}${seq}`,
      internRefId: `${refPrefix}${seq}`,
    };
  });

  if (mongoIds) return { ...mongoIds, storage: "mongodb" as const };

  // File fallback — intern agreements are stored with:
  //   agreementId = "JVX-INT-REF-26-XXX"  (the ref ID)
  //   partnerId   = "JVX-INT-26-XXX"       (the intern ID)
  // So we must check the agreementId for the REF prefix to get the sequence.
  const fileList = await fileStore.fileListAgreements();
  let maxSeq = 0;
  for (const a of fileList) {
    if (typeof a.agreementId === "string" && a.agreementId.startsWith(refPrefix)) {
      const parts = (a.agreementId as string).split("-");
      const seq = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
    }
  }
  const seq = (maxSeq + 1).toString().padStart(3, "0");
  return {
    internId:    `${internPrefix}${seq}`,
    internRefId: `${refPrefix}${seq}`,
    storage: "file" as const,
  };
}

export async function generateCountrySalesPartnerIds() {
  const currentYearStr = new Date().getFullYear().toString().slice(-2);
  const refPrefix     = `JVX-CSP-REF-${currentYearStr}-`;
  const partnerPrefix = `JVX-CSP-${currentYearStr}-`;

  const mongoIds = await tryMongo(async () => {
    const docs = await Agreement.find({
      agreementId: new RegExp(`^JVX-CSP-REF-${currentYearStr}-`),
    }, "agreementId");

    let maxSequence = 0;
    for (const doc of docs) {
      const parts = doc.agreementId.split("-");
      const seq = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(seq) && seq > maxSequence) maxSequence = seq;
    }

    const seq = (maxSequence + 1).toString().padStart(3, "0");
    return {
      salesRefId:     `${refPrefix}${seq}`,
      salesPartnerId: `${partnerPrefix}${seq}`,
    };
  });

  if (mongoIds) return { ...mongoIds, storage: "mongodb" as const };

  const fileList = await fileStore.fileListAgreements();
  let maxSeq = 0;
  for (const a of fileList) {
    if (typeof a.agreementId === "string" && a.agreementId.startsWith(refPrefix)) {
      const parts = (a.agreementId as string).split("-");
      const seq = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
    }
  }
  const seq = (maxSeq + 1).toString().padStart(3, "0");
  return {
    salesRefId:     `${refPrefix}${seq}`,
    salesPartnerId: `${partnerPrefix}${seq}`,
    storage: "file" as const,
  };
}

export async function generateSalesAgentIds() {
  const currentYearStr = new Date().getFullYear().toString().slice(-2);
  const refPrefix     = `JVX-SAG-REF-${currentYearStr}-`;
  const partnerPrefix = `JVX-SAG-${currentYearStr}-`;

  const mongoIds = await tryMongo(async () => {
    const docs = await Agreement.find({
      agreementId: new RegExp(`^JVX-SAG-REF-${currentYearStr}-`),
    }, "agreementId");

    let maxSequence = 0;
    for (const doc of docs) {
      const parts = doc.agreementId.split("-");
      const seq = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(seq) && seq > maxSequence) maxSequence = seq;
    }

    const seq = (maxSequence + 1).toString().padStart(3, "0");
    return {
      salesRefId:     `${refPrefix}${seq}`,
      salesPartnerId: `${partnerPrefix}${seq}`,
    };
  });

  if (mongoIds) return { ...mongoIds, storage: "mongodb" as const };

  const fileList = await fileStore.fileListAgreements();
  let maxSeq = 0;
  for (const a of fileList) {
    if (typeof a.agreementId === "string" && a.agreementId.startsWith(refPrefix)) {
      const parts = (a.agreementId as string).split("-");
      const seq = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
    }
  }
  const seq = (maxSeq + 1).toString().padStart(3, "0");
  return {
    salesRefId:     `${refPrefix}${seq}`,
    salesPartnerId: `${partnerPrefix}${seq}`,
    storage: "file" as const,
  };
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
      .limit(500);
    return docs.map((d) => d.toObject());
  });

  if (mongoList) return mongoList;

  // File store fallback — only reached when MongoDB is genuinely unavailable
  console.warn("[listAgreements] MongoDB unavailable — serving local file store.");
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
  // salesAgreementType may be stored at the top level OR inside docSettings
  const salesAgreementType =
    (agreement.salesAgreementType as string | undefined) ||
    (agreement.docSettings as Record<string, unknown> | undefined)
      ?.salesAgreementType as string | undefined ||
    undefined;

  return {
    agreementId: agreement.agreementId,
    partnerId: agreement.partnerId,
    docType: agreement.docType || "appointment",
    agreementTemplate:
      (agreement.docSettings as Record<string, string> | undefined)
        ?.agreementTemplate || undefined,
    salesAgreementType,
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

export async function deleteAgreement(id: string): Promise<boolean> {
  const normalized = decodeURIComponent(id).trim();

  const mongoDeleted = await tryMongo(async () => {
    let res = await Agreement.deleteOne({ agreementId: normalized });
    if (res.deletedCount === 0) {
      res = await Agreement.deleteOne({ partnerId: normalized });
    }
    return res.deletedCount > 0;
  });

  if (mongoDeleted !== null) return mongoDeleted;
  return fileStore.fileDeleteAgreement(normalized);
}
