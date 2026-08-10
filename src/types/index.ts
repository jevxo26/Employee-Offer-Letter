export interface FirstParty {
  companyName: string;
  representedBy: string;
  role: string;
  ceoName?: string;
  ceoMobile?: string;
  hrName?: string;
  hrMobile?: string;
  currentAddress: string;
  permanentAddress: string;
  mobileNumber: string;
  nidNumber: string;
  email: string;
  website: string;
  signatureImg: string;
}

export interface SecondParty {
  fullName: string;
  partnerId?: string; // e.g. "JVX-PT-26-001"
  partnerIdSerial?: string;
  salesPartnerId?: string; // e.g. "JVX-CSP-26-001" or "JVX-SAG-26-001"
  email: string;
  guardianName: string;
  guardianRelation: string;
  mobileNumber: string;
  guardianMobile: string;
  presentAddress: string;
  permanentAddress: string;
  dob: string;
  nidNumber: string;
  position: string;
  bloodGroup: string;
  photoUrl?: string;
  signatureImg: string;
  department?: string;
  performanceGrade?: string;
}

export type AgreementTemplate =
  | "partner"
  | "internship"
  | "sales_agent"
  | "country_sales_partner"
  | "hrHiringNotice"
  | "internCertificate";

export type SalesAgreementType = "countrySales" | "salesAgent";

export interface SalesPartnerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  partnerId: string;
  signatureImg?: string;
}

export interface DocSettings {
  date: string;
  minimumServicePeriod: number;
  equityShare: number;
  noticePeriod: number;
  refId?: string;
  refIdSerial?: string;
  agreementTemplate?: AgreementTemplate;
  // ── Internship-specific ──────────────────────────────────────────────────
  internId?: string; // e.g. "JVX-INT-26-001"
  internIdSerial?: string;
  internRefId?: string; // e.g. "JVX-INT-REF-26-001"
  internRefIdSerial?: string;
  internshipDuration?: string; // e.g. "3 months"
  isPaid?: boolean;
  internExpiryDate?: string; // expiry date shown on the internee ID card
  // ── HR Hiring Notice-specific ────────────────────────────────────────────
  hrNoticeId?: string; // e.g. "JVX-HR-26-001"
  hrNoticeIdSerial?: string;
  hrNoticeRefId?: string; // e.g. "JVX-HR-REF-26-001"
  hrNoticeRefIdSerial?: string;
  hrRecipientRole?: string; // e.g. "CEO", "CTO", "Founder"
  hrRecipientRoleCustom?: string; // set when hrRecipientRole === "Other"
  hrRecipientName?: string; // e.g. "Imtiaz Ahmed Tuhin"
  hrRecipientEmail?: string; // e.g. "ceo@jevxo.com"
  hrNoticeTitle?: string; // e.g. "UI/UX Designer Recruitment"
  hrSubject?: string; // full subject line
  hrPositionName?: string; // e.g. "UI/UX Designer"
  hrVacancies?: number; // e.g. 4
  hrDepartment?: string; // e.g. "Design Department"
  hrEmploymentType?: string; // e.g. "Internship" | "Full-Time"
  hrWorkMode?: string; // e.g. "Onsite" | "Remote" | "Hybrid"
  hrLocation?: string; // e.g. "Rajshahi"
  hrRecruitmentStartDate?: string;
  hrRecruitmentEndDate?: string;
  hrRequiredSkills?: string[]; // dynamic skill tags
  hrExperienceRequired?: string; // e.g. "2+ years", "Fresher / No Experience"
  hrExperienceNote?: string; // optional elaboration, e.g. "in UI/UX or product design"
  hrPreparedByName?: string; // e.g. "Juwel Khan Shanto"
  hrPreparedByDesignation?: string; // e.g. "Head of HR Department"
  hrOrganization?: string; // default: "JEVXO"
  // ── Sales Agreement-specific ─────────────────────────────────────────────
  salesAgreementType?: SalesAgreementType;
  salesRefId?: string; // e.g. "JVX-CSP-REF-26-001" or "JVX-SAG-REF-26-001"
  salesRefIdSerial?: string;
  salesPartnerId?: string; // e.g. "JVX-CSP-26-001" or "JVX-SAG-26-001"
  salesPartnerIdSerial?: string;
  territory?: string;
  isExclusive?: boolean; // countrySales only
  partnerAgreementRef?: string; // salesAgent only — which Partner they report to
  initialTerm?: number; // e.g. 1 (years) — countrySales initial term
  noticePeriodSales?: string; // e.g. "7/14" or "30/60"
  governingJurisdiction?: string;
  salesExpiryDate?: string; // ID card expiry for sales types
  salesPartner?: SalesPartnerInfo; // contracting Country Sales Partner for Sales Agent agreements
  partnerSignedDate?: string; // date the partner/CSP confirmed their signature
  commissionConfiguration?: string;
  baseCommissionRate?: number;
  recurringCommissionRate?: number;
  overrideCommissionRate?: number;
  paymentCurrency?: string;
  reportingStructure?: string;
  // ── Certificate-specific ─────────────────────────────────────────────────
  certId?: string; // e.g. "JVX-CRT-26-001"
  certIdSerial?: string;
  certRefId?: string; // e.g. "JVX-CRT-REF-26-001"
  certRefIdSerial?: string;
  certStartDate?: string;
  certEndDate?: string;
  certPerformanceGrade?: string;
  certOriginalAgreementId?: string;
  certInternId?: string;
  certificateGenerated?: boolean;
}

export interface EmployeeCard {
  fullName: string;
  position: string;
  employeeId: string;
  bloodGroup: string;
  department: string;
  photoUrl: string;
  issueDate: string;
  expiryDate: string;
}

/** Which document types the HR is generating in this session */
export type DocType =
  | "Partner Agreement & ID Card"
  | "Intern Offerletter & ID Card"
  | "Country Sales Partner Agreement & ID Card"
  | "Sales Agent Agreement & ID Card";

export type AppState =
  | "home"
  | "login"
  | "docTypeSelect"
  | "form"
  | "workspace"
  | "candidatePortal"
  | "idCard"
  | "adminDashboard";

export type AgreementStatus =
  | "PENDING_CSP_SIGNATURE"
  | "PENDING_PARTNER_SIGNATURE"
  | "FULLY_EXECUTED";

export interface AgreementSummary {
  agreementId: string;
  partnerId: string;
  docType: string; // string for backward compat (old records may have "both" / "appointment")
  agreementTemplate?: AgreementTemplate;
  salesAgreementType?: SalesAgreementType;
  status: AgreementStatus;
  founderSigned: boolean;
  partnerSigned: boolean;
  signedAt?: string;
  createdAt: string;
  partnerName: string;
  partnerEmail: string;
  companyName: string;
  position: string;
  // HR Hiring Notice — recipient info (separate from partnerName/Email for display purposes)
  hrRecipientName?: string;
  hrRecipientEmail?: string;
}
