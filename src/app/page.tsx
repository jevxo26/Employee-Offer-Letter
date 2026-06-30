"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { Mail, RefreshCw, CreditCard, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";
import { toast } from "react-toastify";

import JevxoLogo from "../components/JevxoLogo";
import Hero from "../components/Hero";
import Login from "../components/Login";
import DocTypeSelector from "../components/DocTypeSelector";
import FormWizard from "../components/FormWizard";
import CeoWorkspace from "../components/CeoWorkspace";
import CandidatePortal from "../components/CandidatePortal";
import EmailPortalModal from "../components/EmailPortalModal";
import IdCardWorkspace from "../components/IdCardWorkspace";
import AdminDashboard from "../components/AdminDashboard";
import { buildIdCardPdfBase64 } from "../components/IdCardWorkspace";

import { FirstParty, SecondParty, DocSettings, AppState, DocType, EmployeeCard } from "../types";


// ─── Default state values ────────────────────────────────────────────────────
const DEFAULT_FIRST_PARTY: FirstParty = {
  companyName: "JEVXO",
  representedBy: "Md. Shahid Hasan",
  role: "Founder",  ceoName: "Imtiaz Ahmed Tuhin",
  ceoMobile: "01840017065",  currentAddress: "9th floor, Silicon Tower, Hi-tech park, Rajshahi, Bangladesh",
  permanentAddress: "Gopalpur, Sapahar, Naogaon, Bangladesh.",
  mobileNumber: "01844532000",
  nidNumber: "2874935543",
  email: "info@jevxo.com",
  website: "www.jevxo.com",
  signatureImg: "",
};

const DEFAULT_SECOND_PARTY: SecondParty = {
  partnerId: "JVX-PT-26-001",
  partnerIdSerial: "001",
  fullName: "Jhon Doe",
  email: "jhon@example.com",
  guardianName: "Jhon Doe Sr.",
  guardianRelation: "Father",
  mobileNumber: "0123456789",
  guardianMobile: "01987654321",
  presentAddress: "Delhi, India",
  permanentAddress: "Wahington, USA",
  dob: "2002-01-01",
  nidNumber: "555555555",
  position: "Web Developer",
  bloodGroup: "A+",
  signatureImg: "",
};

const SAMPLE_SECOND_PARTY: SecondParty = {
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
  signatureImg: "",
};

const TOTAL_STEPS = 5;

function formatDisplayDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getDefaultIssueDate() {
  return formatDisplayDate(new Date());
}

function getDefaultExpiryDate() {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 2);
  return formatDisplayDate(expiryDate);
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>("home");
  const [docType, setDocType] = useState<DocType>("appointment");
  const [activeStep, setActiveStep] = useState(1);
  const [isDemo, setIsDemo] = useState(false);

  const [firstParty, setFirstParty] = useState<FirstParty>(DEFAULT_FIRST_PARTY);
  const [secondParty, setSecondParty] = useState<SecondParty>(DEFAULT_SECOND_PARTY);
  const [docSettings, setDocSettings] = useState<DocSettings>({
    date: getDefaultIssueDate(),
    minimumServicePeriod: 4,
    equityShare: 7,
    noticePeriod: 15,
  });

  // Derived employee card from secondParty data (for "both" mode)
  const [employeeCard, setEmployeeCard] = useState<EmployeeCard>({
    fullName: "",
    position: "",
    employeeId: "000-000-0001",
    bloodGroup: "A+",
    department: "",
    photoUrl: "",
    issueDate: getDefaultIssueDate(),
    expiryDate: getDefaultExpiryDate(),
  });

  const [sameAddress, setSameAddress] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState("settings");
  const [validationError, setValidationError] = useState("");
  const [isCandidateSigned, setIsCandidateSigned] = useState(false);
  const [isOfferSent, setIsOfferSent] = useState(false);

  const [offerId, setOfferId] = useState("");
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [candidateLink, setCandidateLink] = useState("");

  const previewRef0 = useRef<HTMLDivElement>(null);
  const previewRef1 = useRef<HTMLDivElement>(null);
  const previewRef2 = useRef<HTMLDivElement>(null);
  const previewRef3 = useRef<HTMLDivElement>(null);
  const previewRef4 = useRef<HTMLDivElement>(null);
  const previewRefs = [previewRef0, previewRef1, previewRef2, previewRef3, previewRef4];

  // ID card refs — populated by CandidatePortal when it mounts
  const candidateCardFrontRef = useRef<React.RefObject<HTMLDivElement | null> | null>(null);
  const candidateCardBackRef  = useRef<React.RefObject<HTMLDivElement | null> | null>(null);

  // Initial fetching of ID
  useEffect(() => {
    async function fetchNextIds() {
      try {
        const res = await fetch("/api/check-id?action=next");
        if (res.ok) {
          const data = await res.json();
          setDocSettings((p) => ({
            ...p,
            refId: data.agreementId,
            refIdSerial: data.agreementId.split("-").pop(),
          }));
          setSecondParty((p) => ({
            ...p,
            partnerId: data.partnerId,
            partnerIdSerial: data.partnerId.split("-").pop(),
          }));
        }
      } catch (err) {
        console.error("Failed to fetch next IDs", err);
      }
    }
    fetchNextIds();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const candidateViewId = params.get("candidateView");
    if (candidateViewId) {
      fetch(`/api/offers/${candidateViewId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Offer not found on backend.");
          return res.json();
        })
        .then((data) => {
          setFirstParty(data.firstParty);
          setSecondParty(data.secondParty);
          setDocSettings(data.docSettings);
          setIsCandidateSigned(Boolean(data.partnerSigned || data.status === "FULLY_EXECUTED"));
          setOfferId(candidateViewId);
          setIsDemo(false);
          setAppState("candidatePortal");
        })
        .catch((err) => {
          console.warn("Backend fetch failed, trying localStorage fallback:", err);
          const stored = localStorage.getItem("jevxo_offer_" + candidateViewId);
          if (stored) {
            try {
              const data = JSON.parse(stored);
              setFirstParty(data.firstParty);
              setSecondParty(data.secondParty);
              setDocSettings(data.docSettings);
              setIsCandidateSigned(Boolean(data.partnerSigned || data.status === "FULLY_EXECUTED"));
              setOfferId(candidateViewId);
              setIsDemo(false);
              setAppState("candidatePortal");
            } catch (e) {
              console.error("Error loading offer data from localStorage", e);
            }
          }
        });
    }
  }, []);

  // ── When docType selector chooses a type ────────────────────────────────────
  const handleDocTypeSelect = (type: DocType) => {
    setDocType(type);
    setIsOfferSent(false);
    if (type === "idCard") {
      // Skip the full form wizard, go straight to ID card workspace
      setAppState("idCard");
    } else {
      // appointment or both — go through full form wizard
      setActiveStep(1);
      setAppState("form");
    }
  };

  // ── Sync employee card from secondParty data when entering workspace ─────────
  const syncEmployeeCardFromForm = () => {
    setEmployeeCard((prev) => ({
      ...prev,
      fullName: secondParty.fullName,
      position: secondParty.position,
      bloodGroup: secondParty.bloodGroup || "A+",
    }));
  };

  const handleSendOffer = async (idCardPdfBase64?: string) => {
    // Generate a temporary ID for local storage fallback, but we will use the DB ID for the real link.
    const tempId = Math.random().toString(36).substring(2, 11);
    const stateToSave = { firstParty, secondParty, docSettings };
    localStorage.setItem("jevxo_offer_" + tempId, JSON.stringify(stateToSave));

    let saved = false;
    let dbAgreementId = "";
    
    for (let i = 0; i < 3; i++) {
      try {
        const res = await fetch("/api/offers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstParty,
            secondParty,
            docSettings,
            docType,
            // Store pre-generated id card PDF so sign route can attach it
            cardPDFdata: idCardPdfBase64 || undefined,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          dbAgreementId = data.agreementId;
          saved = true;
          break;
        }
      } catch (e) {
        console.error("Save attempt failed", e);
      }
      await new Promise((r) => setTimeout(r, 300));
    }

    if (!saved || !dbAgreementId) {
      alert("Failed to save offer to database. Please try again.");
      return;
    }

    const link = `${window.location.origin}${window.location.pathname}?candidateView=${dbAgreementId}`;
    setCandidateLink(link);
    setOfferId(dbAgreementId);
    setEmailModalOpen(true);
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const validateStep = () => {
    const p = secondParty;
    if (activeStep === 1) {
      if (!p.fullName.trim()) return "Full Name is required.";
      if (!p.dob) return "Date of Birth is required.";
      if (!p.nidNumber.trim()) return "National ID (NID) is required.";
      if (!p.position.trim()) return "Company role position is required.";
    } else if (activeStep === 2) {
      if (!p.guardianName.trim()) return `${p.guardianRelation}'s Name is required.`;
      if (!p.guardianMobile.trim()) return "Guardian Mobile Number is required.";
    } else if (activeStep === 3) {
      if (!p.mobileNumber.trim()) return "Candidate Mobile Number is required.";
      if (!p.email.trim()) return "Candidate Email Address is required.";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(p.email.trim())) return "Please enter a valid email address.";
      if (!p.presentAddress.trim()) return "Present Address is required.";
      if (!p.permanentAddress.trim()) return "Permanent Address is required.";
    } else if (activeStep === 4) {
      if (!docSettings.date.trim()) return "Signing Date is required.";
      if (!secondParty.partnerIdSerial?.trim()) return "Partner ID serial is required.";
      if (!docSettings.refIdSerial?.trim()) return "Agreement ID serial is required.";
      if (!docSettings.equityShare) return "Equity Share is required.";
      if (docSettings.equityShare < 1 || docSettings.equityShare > 100) return "Equity Share must be between 1% and 100%.";
      if (!docSettings.minimumServicePeriod) return "Minimum Service Period is required.";
      if (!docSettings.noticePeriod) return "Notice Period is required.";
    } else if (activeStep === 5) {
      if (!firstParty.signatureImg)
        return "The Founder / CEO signature is required to complete the agreement.";
    }
    return "";
  };

  // ── Wizard nav ──────────────────────────────────────────────────────────────
  const handleNext = () => {
    const error = validateStep();
    if (error) { setValidationError(error); return; }
    setValidationError("");
    if (activeStep < TOTAL_STEPS) {
      setActiveStep((s) => s + 1);
    } else {
      setIsOfferSent(false);
      syncEmployeeCardFromForm();
      setAppState("workspace");
    }
  };

  const handlePrev = () => {
    if (activeStep > 1) setActiveStep((s) => s - 1);
  };

  // ── Address toggle ──────────────────────────────────────────────────────────
  const handleAddressToggle = (checked: boolean) => {
    setSameAddress(checked);
    if (checked) setSecondParty((p) => ({ ...p, permanentAddress: p.presentAddress }));
  };

  // ── PDF export ──────────────────────────────────────────────────────────────
  const handleExportPDF = async () => {
    if (isExporting || (appState === "candidatePortal" && isCandidateSigned)) return;
    setIsExporting(true);
    document.documentElement.classList.add("a4-exporting");
    try {
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4", compress: true });
      const pages = previewRefs
        .map((ref) => ref.current)
        .filter((el): el is HTMLDivElement => el != null && el.style.display !== "none");
      if (!pages.length) {
        throw new Error("No document pages were available for PDF generation.");
      }
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i] as HTMLElement, {
          scale: 2.5,
          useCORS: true,
          logging: false,
          allowTaint: false,
          backgroundColor: "#ffffff",
        });
        pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 210, 297, undefined, "FAST");
        if (i < pages.length - 1) pdf.addPage();
      }
      if (appState === "candidatePortal") {
        const pdfData = arrayBufferToBase64(pdf.output("arraybuffer"));

        // Generate pixel-perfect ID card PDF from the candidate's DOM (same quality as Download Both PDF)
        let cardPDFdata = "";
        const frontEl = candidateCardFrontRef.current?.current;
        const backEl  = candidateCardBackRef.current?.current;
        if (frontEl && backEl) {
          try {
            cardPDFdata = await buildIdCardPdfBase64(frontEl, backEl);
          } catch (cardErr) {
            console.warn("ID card PDF generation skipped:", cardErr);
          }
        }

        const res = await fetch(`/api/offers/${offerId}/sign`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            signatureImg: secondParty.signatureImg,
            letterPDFdata: pdfData,
            ...(cardPDFdata ? { cardPDFdata } : {}),
          }),
        });
        const data = await res.json().catch(() => null);
        if (res.ok) {
          setIsCandidateSigned(true);
          toast.success(
            data?.message ||
              "Signature applied successfully! The fully executed PDF has been emailed to you and the Founder."
          );
        } else {
          throw new Error(data?.error || "Failed to finalize the agreement. Please try again.");
        }
      } else {
        const partnerName = secondParty.fullName ? secondParty.fullName.trim() : "Partner";
        pdf.save(`${partnerName} - Appointment Letter.pdf`);
      }
    } catch (err: unknown) {
      const e = err as Error;
      console.error("PDF export error:", e);
      toast.error("We had an issue generating your PDF: " + e.message);
    } finally {
      document.documentElement.classList.remove("a4-exporting");
      setIsExporting(false);
    }
  };

  // ── Back button label ───────────────────────────────────────────────────────
  const getBackLabel = () => {
    if (appState === "form") return "← Back to Doc Select";
    if (appState === "workspace") return "← Back to Form";
    if (appState === "idCard") return "← Back to Doc Select";
    if (appState === "docTypeSelect") return "← Back to Home";
    if (appState === "adminDashboard") return "← Back to Doc Select";
    return null;
  };

  const handleHeaderBack = () => {
    if (appState === "form") { setAppState("docTypeSelect"); }
    else if (appState === "workspace") { setAppState("form"); setActiveStep(5); }
    else if (appState === "idCard") { setAppState("docTypeSelect"); }
    else if (appState === "docTypeSelect") { setAppState("home"); }
    else if (appState === "adminDashboard") { setAppState("docTypeSelect"); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#2563EB]/20">
      {/* Header */}
      <header className="border-b border-[#DBEAFE] bg-[#F8FAFC]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            if (appState !== "candidatePortal") setAppState("home");
          }}
        >
          <JevxoLogo />
          <div className="hidden sm:block h-6 w-[1.5px] bg-[#DBEAFE]" />
          <p className="hidden sm:block text-xs text-[#64748B] font-medium uppercase tracking-wider">
            HR Document Engine
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Back button for navigable states */}
          {getBackLabel() && (
            <button
              onClick={handleHeaderBack}
              className="text-xs font-semibold px-4 py-2 border border-[#DBEAFE] hover:border-[#2563EB] hover:bg-[#F8FAFC] text-[#334155] rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              {getBackLabel()}
            </button>
          )}

          {/* Doc type badge when in workspace */}
          {appState === "workspace" && (
            <span className="hidden md:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-[#EFF6FF] text-[#1E3A8A] border border-[#DBEAFE]">
              {docType === "both" ? (
                <>
                  <FileText className="w-3 h-3" />
                  <CreditCard className="w-3 h-3" /> Docs + ID Card
                </>
              ) : (
                <>
                  <FileText className="w-3 h-3" /> Appointment Letter
                </>
              )}
            </span>
          )}

          {appState === "workspace" && (
            <button
              onClick={() => {
                setAppState("form");
                setActiveStep(1);
              }}
              className="text-xs font-semibold px-4 py-2 border border-[#DBEAFE] hover:border-[#2563EB] hover:bg-[#F8FAFC] text-[#334155] rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Start Over
            </button>
          )}
          <a
            href="mailto:info@jevxo.com"
            className="hidden md:flex text-xs text-[#64748B] hover:text-[#2563EB] font-medium items-center gap-1.5 px-3 py-1.5 transition"
          >
            <Mail className="w-3.5 h-3.5" /> Corporate Support
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {appState === "home" && (
            <Hero
              key="home"
              onStart={() => setAppState("login")}
              onDemo={() => {
                setSecondParty(SAMPLE_SECOND_PARTY);
                setSameAddress(false);
                setAppState("form");
                setDocType("appointment");
                setIsDemo(true);
              }}
            />
          )}

          {appState === "login" && (
            <Login
              key="login"
              onLoginSuccess={() => setAppState("docTypeSelect")}
              onBackToHome={() => setAppState("home")}
            />
          )}

          {appState === "docTypeSelect" && (
            <DocTypeSelector
              key="docTypeSelect"
              onSelect={handleDocTypeSelect}
              onOpenAdmin={() => setAppState("adminDashboard")}
            />
          )}

          {appState === "adminDashboard" && (
            <AdminDashboard
              key="adminDashboard"
              onBack={() => setAppState("docTypeSelect")}
            />
          )}

          {appState === "form" && (
            <FormWizard
              key="form"
              activeStep={activeStep}
              secondParty={secondParty}
              setSecondParty={setSecondParty}
              firstParty={firstParty}
              setFirstParty={setFirstParty}
              sameAddress={sameAddress}
              onAddressToggle={handleAddressToggle}
              validationError={validationError}
              onClearError={() => setValidationError("")}
              onNext={handleNext}
              onPrev={handlePrev}
              docSettings={docSettings}
              setDocSettings={setDocSettings}
            />
          )}

          {appState === "workspace" && (
            <CeoWorkspace
              activeWorkspaceTab={activeWorkspaceTab}
              setActiveWorkspaceTab={setActiveWorkspaceTab}
              docSettings={docSettings}
              setDocSettings={setDocSettings}
              secondParty={secondParty}
              setSecondParty={setSecondParty}
              firstParty={firstParty}
              setFirstParty={setFirstParty}
              isExporting={isExporting}
              onExport={handleExportPDF}
              isDemo={isDemo}
              isOfferSent={isOfferSent}
              onSendOffer={handleSendOffer}
              previewRefs={previewRefs}
              docType={docType}
              employeeCard={employeeCard}
              setEmployeeCard={setEmployeeCard}
            />
          )}

          {appState === "idCard" && <IdCardWorkspace key="idCard" />}

          {appState === "candidatePortal" && (
            <CandidatePortal
              firstParty={firstParty}
              secondParty={secondParty}
              setSecondParty={setSecondParty}
              docSettings={docSettings}
              isExporting={isExporting}
              isCompleted={isCandidateSigned}
              onExport={handleExportPDF}
              offerId={offerId}
              previewRefs={previewRefs}
              onIdCardRefsReady={(frontRef, backRef) => {
                candidateCardFrontRef.current = frontRef;
                candidateCardBackRef.current  = backRef;
              }}
            />
          )}
        </AnimatePresence>
      </main>

      <EmailPortalModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        onSentSuccess={() => setIsOfferSent(true)}
        secondParty={secondParty}
        firstParty={firstParty}
        candidateLink={candidateLink}
        offerId={offerId}
      />
    </div>
  );
}
