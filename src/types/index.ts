export interface FirstParty {
  companyName: string;
  representedBy: string;
  role: string;
  ceoName?: string;
  ceoMobile?: string;
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
}

export type AgreementTemplate = 'partner' | 'internship' | 'sales_agent' | 'country_sales_partner';

export type SalesAgreementType = 'countrySales' | 'salesAgent';

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
  internId?: string;           // e.g. "JVX-INT-26-001"
  internIdSerial?: string;
  internRefId?: string;        // e.g. "JVX-INT-REF-26-001"
  internRefIdSerial?: string;
  internshipDuration?: string; // e.g. "3 months"
  isPaid?: boolean;
  internExpiryDate?: string;   // expiry date shown on the internee ID card
  // ── Sales Agreement-specific ─────────────────────────────────────────────
  salesAgreementType?: SalesAgreementType;
  salesRefId?: string;             // e.g. "JVX-CSP-REF-26-001" or "JVX-SAG-REF-26-001"
  salesRefIdSerial?: string;
  salesPartnerId?: string;         // e.g. "JVX-CSP-26-001" or "JVX-SAG-26-001"
  salesPartnerIdSerial?: string;
  territory?: string;
  isExclusive?: boolean;           // countrySales only
  partnerAgreementRef?: string;    // salesAgent only — which Partner they report to
  paymentDays?: number;            // salesAgent commission payment window
  noticePeriodSales?: string;      // e.g. "7/14" or "30/60"
  governingJurisdiction?: string;
  salesExpiryDate?: string;        // ID card expiry for sales types
  salesPartner?: SalesPartnerInfo; // contracting Country Sales Partner for Sales Agent agreements
  partnerSignedDate?: string;      // date the partner/CSP confirmed their signature
  commissionConfiguration?: string;
  baseCommissionRate?: number;
  recurringCommissionRate?: number;
  overrideCommissionRate?: number;
  paymentCurrency?: string;
  paymentTerms?: string;
  reportingStructure?: string;
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
  | 'Partner Agreement & ID Card'
  | 'Intern Offerletter & ID Card'
  | 'Country Sales Partner Agreement & ID Card'
  | 'Sales Agent Agreement & ID Card';

export type AppState =
  | 'home'
  | 'login'
  | 'docTypeSelect'
  | 'form'
  | 'workspace'
  | 'candidatePortal'
  | 'idCard'
  | 'adminDashboard';

export type AgreementStatus = 'PENDING_PARTNER_SIGNATURE' | 'FULLY_EXECUTED';

export interface AgreementSummary {
  agreementId: string;
  partnerId: string;
  docType: string;  // string for backward compat (old records may have "both" / "appointment")
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
}
