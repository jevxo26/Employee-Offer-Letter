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

export type AgreementTemplate =
  | 'partner'
  | 'internship'
  | 'countrySeller'
  | 'countryAgent';

export interface DocSettings {
  date: string;
  minimumServicePeriod: number;
  equityShare: number;
  noticePeriod: number;
  refId?: string;
  refIdSerial?: string;
  agreementTemplate?: AgreementTemplate;
  // ── Internship-specific ──────────────────────────────────────────────────
  internId?: string;        // e.g. "JVX-INT-26-001"
  internIdSerial?: string;
  internRefId?: string;     // e.g. "JVX-INT-REF-26-001"
  internRefIdSerial?: string;
  internshipDuration?: string; // e.g. "3 months"
  isPaid?: boolean;
  internExpiryDate?: string;  // expiry date shown on the internee ID card
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
  | 'appointment'
  | 'idCard'
  | 'both'
  | 'Partner Agreement & ID Card'
  | 'Intern Offerletter & ID Card';

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
  docType: DocType;
  agreementTemplate?: AgreementTemplate;
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
