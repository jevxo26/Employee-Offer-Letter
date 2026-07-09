import mongoose, { Schema, Document } from "mongoose";
import { DocSettings, FirstParty, SecondParty } from "../types";

export interface IAgreement extends Document {
  agreementId: string;
  partnerId: string;
  docType: string;
  salesAgreementType?: string;
  status: "PENDING_PARTNER_SIGNATURE" | "FULLY_EXECUTED";
  founderSigned: boolean;
  partnerSigned: boolean;
  signedAt?: Date;

  firstParty: FirstParty;
  secondParty: SecondParty;
  docSettings: DocSettings;

  // Appointment letter
  letterPDFdata?: string; // base64 — renamed from pdfData
  letterSentToBoth?: boolean;

  // ID card
  idCardGenerated?: boolean;
  cardPDFdata?: string; // base64
}

const AgreementSchema: Schema = new Schema(
  {
    agreementId: { type: String, required: true, unique: true },
    partnerId: { type: String, required: true },
    docType: { type: String, default: "appointment" },
    salesAgreementType: { type: String },
    status: { type: String, default: "PENDING_PARTNER_SIGNATURE" },
    founderSigned: { type: Boolean, default: true },
    partnerSigned: { type: Boolean, default: false },
    signedAt: { type: Date },

    firstParty: { type: Schema.Types.Mixed, required: true },
    secondParty: { type: Schema.Types.Mixed, required: true },
    docSettings: { type: Schema.Types.Mixed, required: true },

    // Appointment letter
    letterPDFdata: { type: String },
    letterSentToBoth: { type: Boolean, default: false },

    // ID card
    idCardGenerated: { type: Boolean, default: false },
    cardPDFdata: { type: String },
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.models.Agreement ||
  mongoose.model<IAgreement>("Agreement", AgreementSchema, "docsAgreement");
