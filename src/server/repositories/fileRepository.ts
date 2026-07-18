/**
 * File-system fallback repository.
 * Used automatically when MongoDB is unavailable (dev / offline).
 * Stores agreements as individual JSON files under data/agreements/.
 */
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "agreements");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function fileSaveAgreement(agreement: Record<string, unknown>) {
  await ensureDir();
  const id = agreement.agreementId as string;
  const payload = {
    ...agreement,
    createdAt: agreement.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(
    path.join(DATA_DIR, `${id}.json`),
    JSON.stringify(payload, null, 2),
    "utf-8",
  );
  return payload;
}

export async function fileFindAgreement(id: string) {
  await ensureDir();
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, `${id}.json`), "utf-8");
    return JSON.parse(raw);
  } catch {
    // Fall back to scanning all files
    const all = await fileListAgreements();
    return all.find((a) => a.agreementId === id || a.partnerId === id) ?? null;
  }
}

export async function fileListAgreements() {
  await ensureDir();
  const files = (await fs.readdir(DATA_DIR)).filter((f) => f.endsWith(".json"));
  const results: Record<string, unknown>[] = [];
  for (const file of files) {
    try {
      const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
      results.push(JSON.parse(raw));
    } catch {
      /* skip corrupt files */
    }
  }
  return results.sort(
    (a, b) =>
      new Date(b.createdAt as string || 0).getTime() -
      new Date(a.createdAt as string || 0).getTime(),
  );
}

export async function fileUpdateAgreement(
  agreementId: string,
  updates: Record<string, unknown>,
) {
  const existing = await fileFindAgreement(agreementId);
  if (!existing) return null;
  const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
  await fileSaveAgreement(merged);
  return merged;
}

export async function fileGenerateIds() {
  const agreements = await fileListAgreements();
  const year = new Date().getFullYear().toString().slice(-2);
  const prefix = `JVX-AGR-${year}-`;
  let next = 1;
  for (const a of agreements) {
    if (typeof a.agreementId === "string" && a.agreementId.startsWith(prefix)) {
      const seq = parseInt((a.agreementId as string).split("-").pop() || "0", 10);
      if (!isNaN(seq) && seq >= next) next = seq + 1;
    }
  }
  const pad = next.toString().padStart(3, "0");
  return {
    agreementId: `${prefix}${pad}`,
    partnerId:   `JVX-PT-${year}-${pad}`,
  };
}
