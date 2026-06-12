export interface FirstParty {
  companyName: string;
  representedBy: string;
  role: string;
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
  signatureImg: string;
}

export interface DocSettings {
  date: string;
  minimumServicePeriod: number;
  equityShare: number;
  noticePeriod: number;
}

export type AppState = 'home' | 'login' | 'form' | 'workspace' | 'candidatePortal';
