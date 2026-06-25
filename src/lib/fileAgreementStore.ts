import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "agreements");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function fileSaveAgreement(agreement: Record<string, unknown>) {
  await ensureDir();
  const id = agreement.agreementId as string;
  const filePath = path.join(DATA_DIR, `${id}.json`);
  const payload = {
    ...agreement,
    createdAt: agreement.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf-8");
  return payload;
}

export async function fileFindAgreement(id: string) {
  await ensureDir();
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    const all = await fileListAgreements();
    return (
      all.find((a) => a.agreementId === id || a.partnerId === id) || null
    );
  }
}

export async function fileListAgreements() {
  await ensureDir();
  const files = await fs.readdir(DATA_DIR);
  const agreements = [];
  for (const file of files.filter((f) => f.endsWith(".json"))) {
    try {
      const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
      agreements.push(JSON.parse(raw));
    } catch {
      /* skip corrupt files */
    }
  }
  return agreements.sort(
    (a, b) =>
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
}

export async function fileUpdateAgreement(
  agreementId: string,
  updates: Record<string, unknown>
) {
  const existing = await fileFindAgreement(agreementId);
  if (!existing) return null;
  const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
  await fileSaveAgreement(merged);
  return merged;
}

export async function fileGenerateIds() {
  const agreements = await fileListAgreements();
  const currentYearStr = new Date().getFullYear().toString().slice(-2);
  const yearPrefix = `JVX-AGR-${currentYearStr}-`;
  let nextSequence = 1;

  for (const a of agreements) {
    if (a.agreementId?.startsWith(yearPrefix)) {
      const parts = a.agreementId.split("-");
      const seq = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(seq) && seq >= nextSequence) nextSequence = seq + 1;
    }
  }

  const sequenceStr = nextSequence.toString().padStart(3, "0");
  return {
    agreementId: `${yearPrefix}${sequenceStr}`,
    partnerId: `JVX-PT-${currentYearStr}-${sequenceStr}`,
  };
}
