import { FirstParty, SecondParty } from "@/types";

// ─── Default first party (JEVXO company) ──────────────────────────────────────
export const DEFAULT_FIRST_PARTY: FirstParty = {
  companyName: "JEVXO",
  representedBy: "Md. Shahid Hasan",
  role: "Founder",
  ceoName: "Imtiaz Ahmed Tuhin",
  ceoMobile: "+8801840-017065",
  hrName: "Juwel Khan Shanto",
  hrMobile: "+8801405-749386",
  currentAddress:
    "9th floor, Silicon Tower, Hi-tech park, Rajshahi, Bangladesh",
  permanentAddress: "Gopalpur, Sapahar, Naogaon, Bangladesh.",
  mobileNumber: "+8801405-749386",
  nidNumber: "2874935543",
  email: "info@jevxo.com",
  website: "www.jevxo.com",
  signatureImg: "",
};

// ─── Blank second party (new candidate) ───────────────────────────────────────
export const DEFAULT_SECOND_PARTY: SecondParty = {
  partnerId: "",
  partnerIdSerial: "",
  fullName: "",
  email: "",
  guardianName: "",
  guardianRelation: "Father",
  mobileNumber: "",
  guardianMobile: "",
  presentAddress: "",
  permanentAddress: "",
  dob: "",
  nidNumber: "",
  position: "",
  bloodGroup: "Select",
  photoUrl: "",
  signatureImg: "",
};

// ─── Pre-filled demo second party ─────────────────────────────────────────────
export const SAMPLE_SECOND_PARTY: SecondParty = {
  partnerId: "JVX-PT-26-002",
  partnerIdSerial: "002",
  fullName: "Md. Golam Rabbi",
  email: "rabbi@gmail.com",
  guardianName: "Md. Abdul Haque",
  guardianRelation: "Father",
  mobileNumber: "01558984151",
  guardianMobile: "01786809081",
  presentAddress: "Savar-DOHS, Dhaka",
  permanentAddress: "Harodanga, Faridpur, Pabna",
  dob: "2005-10-15",
  nidNumber: "4229023884",
  position: "Full Stack Developer (React/Next.js)",
  bloodGroup: "B+",
  photoUrl: "",
  signatureImg: "",
};
