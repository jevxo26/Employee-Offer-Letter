import mongoose, { Schema, Document } from "mongoose";
import { DocSettings, FirstParty, SecondParty } from "../types";

export interface IAgreement extends Document {
  agreementId: string;
  partnerId: string;
  docType: "appointment" | "idCard" | "both";
  status: "PENDING_PARTNER_SIGNATURE" | "FULLY_EXECUTED";
  founderSigned: boolean;
  partnerSigned: boolean;
  signedAt?: Date;
  
  firstParty: FirstParty;
  secondParty: SecondParty;
  docSettings: DocSettings;
  pdfData?: string; // base64 string
}

const AgreementSchema: Schema = new Schema({
  agreementId: { type: String, required: true, unique: true },
  partnerId: { type: String, required: true },
  docType: { type: String, default: "appointment" },
  status: { type: String, default: "PENDING_PARTNER_SIGNATURE" },
  founderSigned: { type: Boolean, default: true },
  partnerSigned: { type: Boolean, default: false },
  signedAt: { type: Date },
  
  firstParty: { type: Schema.Types.Mixed, required: true },
  secondParty: { type: Schema.Types.Mixed, required: true },
  docSettings: { type: Schema.Types.Mixed, required: true },
  pdfData: { type: String }
}, { timestamps: true });

export default mongoose.models.Agreement || mongoose.model<IAgreement>("Agreement", AgreementSchema, "docsAgreement");
