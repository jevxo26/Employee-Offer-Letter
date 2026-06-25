import { findAgreementById } from "./agreementStore";
import { normalizeVerifyId } from "./verifyUrl";

export async function findAgreementByVerifyId(id: string) {
  const normalized = normalizeVerifyId(id);
  let agreement = await findAgreementById(normalized);

  if (!agreement && normalized.includes("-")) {
    agreement = await findAgreementById(normalized.replace(/-/g, "/"));
  }

  return agreement;
}
