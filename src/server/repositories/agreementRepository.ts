/**
 * Agreement repository — single source of truth for all DB operations.
 * Tries MongoDB first; falls back to the local file store if unavailable.
 */
import dbConnect from "@/server/db/mongodb";
import Agreement from "@/server/db/models/Agreement";
import * as fileRepo from "./fileRepository";

// ─── Internal helper ──────────────────────────────────────────────────────────
async function tryMongo<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    await dbConnect();
    return await fn();
  } catch (err: unknown) {
    console.warn("[repo] MongoDB unavailable, using file store:", (err as Error).message);
    return null;
  }
}

// ─── ID generation ────────────────────────────────────────────────────────────
function getYear() {
  return new Date().getFullYear().toString().slice(-2);
}

function findMaxSeq(docs: { agreementId: string }[]): number {
  let max = 0;
  for (const doc of docs) {
    const seq = parseInt(doc.agreementId.split("-").pop() || "0", 10);
    if (!isNaN(seq) && seq > max) max = seq;
  }
  return max;
}

export async function generateAgreementIds() {
  const year = getYear();
  const mongoIds = await tryMongo(async () => {
    const docs = await Agreement.find(
      { agreementId: new RegExp(`^JVX-AGR-${year}-`) },
      "agreementId",
    );
    const seq = (findMaxSeq(docs.map((d) => ({ agreementId: d.agreementId }))) + 1)
      .toString().padStart(3, "0");
    return { agreementId: `JVX-AGR-${year}-${seq}`, partnerId: `JVX-PT-${year}-${seq}` };
  });
  if (mongoIds) return { ...mongoIds, storage: "mongodb" as const };
  return { ...(await fileRepo.fileGenerateIds()), storage: "file" as const };
}

export async function generateInternIds() {
  const year = getYear();
  const refPrefix   = `JVX-INT-REF-${year}-`;
  const internPrefix = `JVX-INT-${year}-`;
  const mongoIds = await tryMongo(async () => {
    const docs = await Agreement.find(
      { agreementId: new RegExp(`^${refPrefix}`) },
      "agreementId",
    );
    const seq = (findMaxSeq(docs.map((d) => ({ agreementId: d.agreementId }))) + 1)
      .toString().padStart(3, "0");
    return { internId: `${internPrefix}${seq}`, internRefId: `${refPrefix}${seq}` };
  });
  if (mongoIds) return { ...mongoIds, storage: "mongodb" as const };
  const fileList = await fileRepo.fileListAgreements();
  let max = 0;
  for (const a of fileList) {
    if (typeof a.agreementId === "string" && (a.agreementId as string).startsWith(refPrefix)) {
      const seq = parseInt((a.agreementId as string).split("-").pop() || "0", 10);
      if (!isNaN(seq) && seq > max) max = seq;
    }
  }
  const seq = (max + 1).toString().padStart(3, "0");
  return { internId: `${internPrefix}${seq}`, internRefId: `${refPrefix}${seq}`, storage: "file" as const };
}

export async function generateCountrySalesPartnerIds() {
  const year = getYear();
  const refPrefix     = `JVX-CSP-REF-${year}-`;
  const partnerPrefix = `JVX-CSP-${year}-`;
  const mongoIds = await tryMongo(async () => {
    const docs = await Agreement.find(
      { agreementId: new RegExp(`^${refPrefix}`) },
      "agreementId",
    );
    const seq = (findMaxSeq(docs.map((d) => ({ agreementId: d.agreementId }))) + 1)
      .toString().padStart(3, "0");
    return { salesRefId: `${refPrefix}${seq}`, salesPartnerId: `${partnerPrefix}${seq}` };
  });
  if (mongoIds) return { ...mongoIds, storage: "mongodb" as const };
  const fileList = await fileRepo.fileListAgreements();
  let max = 0;
  for (const a of fileList) {
    if (typeof a.agreementId === "string" && (a.agreementId as string).startsWith(refPrefix)) {
      const seq = parseInt((a.agreementId as string).split("-").pop() || "0", 10);
      if (!isNaN(seq) && seq > max) max = seq;
    }
  }
  const seq = (max + 1).toString().padStart(3, "0");
  return { salesRefId: `${refPrefix}${seq}`, salesPartnerId: `${partnerPrefix}${seq}`, storage: "file" as const };
}

export async function generateSalesAgentIds() {
  const year = getYear();
  const refPrefix     = `JVX-SAG-REF-${year}-`;
  const partnerPrefix = `JVX-SAG-${year}-`;
  const mongoIds = await tryMongo(async () => {
    const docs = await Agreement.find(
      { agreementId: new RegExp(`^${refPrefix}`) },
      "agreementId",
    );
    const seq = (findMaxSeq(docs.map((d) => ({ agreementId: d.agreementId }))) + 1)
      .toString().padStart(3, "0");
    return { salesRefId: `${refPrefix}${seq}`, salesPartnerId: `${partnerPrefix}${seq}` };
  });
  if (mongoIds) return { ...mongoIds, storage: "mongodb" as const };
  const fileList = await fileRepo.fileListAgreements();
  let max = 0;
  for (const a of fileList) {
    if (typeof a.agreementId === "string" && (a.agreementId as string).startsWith(refPrefix)) {
      const seq = parseInt((a.agreementId as string).split("-").pop() || "0", 10);
      if (!isNaN(seq) && seq > max) max = seq;
    }
  }
  const seq = (max + 1).toString().padStart(3, "0");
  return { salesRefId: `${refPrefix}${seq}`, salesPartnerId: `${partnerPrefix}${seq}`, storage: "file" as const };
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────
export async function saveAgreement(data: Record<string, unknown>) {
  const mongoDoc = await tryMongo(async () => {
    const doc = new Agreement(data);
    await doc.save();
    return doc.toObject();
  });
  if (mongoDoc) return { agreement: mongoDoc, storage: "mongodb" as const };
  const fileDoc = await fileRepo.fileSaveAgreement(data);
  return { agreement: fileDoc, storage: "file" as const };
}

export async function findAgreementById(id: string) {
  const normalized = decodeURIComponent(id).trim();
  const mongoDoc = await tryMongo(async () => {
    const doc =
      (await Agreement.findOne({ agreementId: normalized })) ||
      (await Agreement.findOne({ partnerId: normalized }));
    return doc?.toObject() ?? null;
  });
  if (mongoDoc) return mongoDoc;
  return fileRepo.fileFindAgreement(normalized);
}

export async function listAgreements() {
  const mongoList = await tryMongo(async () => {
    const docs = await Agreement.find({}, "-letterPDFdata -cardPDFdata")
      .sort({ createdAt: -1 })
      .limit(200);
    return docs.map((d) => d.toObject());
  });
  if (mongoList) return mongoList;
  const fileList = await fileRepo.fileListAgreements();
  return fileList.map(({ letterPDFdata: _l, cardPDFdata: _c, ...rest }) => rest);
}

export async function updateAgreement(
  agreementId: string,
  updates: Record<string, unknown>,
) {
  const mongoDoc = await tryMongo(async () => {
    const doc = await Agreement.findOne({ agreementId });
    if (!doc) return null;
    Object.assign(doc, updates);
    if (updates.secondParty) doc.markModified("secondParty");
    if (updates.docSettings) doc.markModified("docSettings");
    await doc.save();
    return doc.toObject();
  });
  if (mongoDoc) return mongoDoc;
  return fileRepo.fileUpdateAgreement(agreementId, updates);
}

// ─── Summary mapper ───────────────────────────────────────────────────────────
export function toAgreementSummary(agreement: Record<string, unknown>) {
  const settings = agreement.docSettings as Record<string, unknown> | undefined;
  const second   = agreement.secondParty as Record<string, string> | undefined;
  const first    = agreement.firstParty  as Record<string, string> | undefined;
  return {
    agreementId:        agreement.agreementId,
    partnerId:          agreement.partnerId,
    docType:            agreement.docType || "appointment",
    agreementTemplate:  settings?.agreementTemplate,
    salesAgreementType: settings?.salesAgreementType,
    status:             agreement.status,
    founderSigned:      agreement.founderSigned,
    partnerSigned:      agreement.partnerSigned,
    signedAt:           agreement.signedAt,
    createdAt:          agreement.createdAt,
    partnerName:        second?.fullName  || "",
    partnerEmail:       second?.email     || "",
    companyName:        first?.companyName || "",
    position:           second?.position   || "",
  };
}
