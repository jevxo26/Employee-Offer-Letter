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

export interface DocSettings {
  date: string;
  minimumServicePeriod: number;
  equityShare: number;
  noticePeriod: number;
  refId?: string; // e.g. "JVX/AGREEMENT/2026/001"
  refIdSerial?: string;
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
export type DocType = 'appointment' | 'idCard' | 'both';

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
