import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mail, RefreshCw, Download } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

import JevxoLogo from "./components/JevxoLogo";
import FormWizard from "./components/FormWizard";
import WorkspaceSidebar from "./components/WorkspaceSidebar";
import WorkspaceCanvas from "./components/WorkspaceCanvas";
import Hero from "./components/Hero";
import EmailPortalModal from "./components/EmailPortalModal";
import SignaturePad from "./components/SignaturePad";

// ─── Default state values ────────────────────────────────────────────────────
const DEFAULT_FIRST_PARTY = {
  companyName: "JEVXO",
  representedBy: "Md. Shahid Hasan",
  role: "Founder",
  currentAddress: "9th floor, silicon Tower, Hi-tech park Rajshahi.",
  permanentAddress: "Gopalpur, Sapahar, Naogaon, Bangladesh.",
  mobileNumber: "+880 1844-532000",
  nidNumber: "2874935543",
  email: "info@jevxo.com",
  website: "www.jevxo.com",
  signatureImg: "",
};

const DEFAULT_SECOND_PARTY = {
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
  position: "Full Stack Developer (React/Next.js)",
  signatureImg: "",
};

const SAMPLE_SECOND_PARTY = {
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
  signatureImg: "",
};

const DEFAULT_DOC_SETTINGS = {
  date: new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  minimumServicePeriod: 4,
  equityShare: 7,
  noticePeriod: 15,
};

import Login from "./components/Login";

const TOTAL_STEPS = 5;

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [appState, setAppState] = useState("home"); // 'home' | 'login' | 'form' | 'workspace' | 'candidatePortal'
  const [activeStep, setActiveStep] = useState(1);
  const [isDemo, setIsDemo] = useState(false);

  const [firstParty, setFirstParty] = useState(DEFAULT_FIRST_PARTY);
  const [secondParty, setSecondParty] = useState(DEFAULT_SECOND_PARTY);
  const [docSettings, setDocSettings] = useState(DEFAULT_DOC_SETTINGS);

  const [sameAddress, setSameAddress] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState("settings");
  const [validationError, setValidationError] = useState("");

  const [offerId, setOfferId] = useState("");
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [candidateLink, setCandidateLink] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const candidateViewId = params.get("candidateView");
    if (candidateViewId) {
      // Primary: Fetch from backend persistent storage
      fetch(`/api/offers/${candidateViewId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Offer not found on backend.");
          return res.json();
        })
        .then((data) => {
          setFirstParty(data.firstParty);
          setSecondParty(data.secondParty);
          setDocSettings(data.docSettings);
          setOfferId(candidateViewId);
          setIsDemo(false);
          setAppState("candidatePortal");
        })
        .catch((err) => {
          console.warn("Backend fetch failed, trying localStorage fallback:", err);
          // Fallback: local storage (same browser test)
          const stored = localStorage.getItem("jevxo_offer_" + candidateViewId);
          if (stored) {
            try {
              const data = JSON.parse(stored);
              setFirstParty(data.firstParty);
              setSecondParty(data.secondParty);
              setDocSettings(data.docSettings);
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

  const handleSendOffer = async () => {
    const id = Math.random().toString(36).substring(2, 11);
    const stateToSave = {
      firstParty,
      secondParty,
      docSettings
    };
    
    // Save to localStorage (fallback/local preview)
    localStorage.setItem("jevxo_offer_" + id, JSON.stringify(stateToSave));
    
    // Save to Backend
    try {
      await fetch("/api/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offerId: id,
          firstParty,
          secondParty,
          docSettings
        }),
      });
    } catch (err) {
      console.error("Failed to save offer to backend:", err);
    }
    
    const link = `${window.location.origin}${window.location.pathname}?candidateView=${id}`;
    setCandidateLink(link);
    setOfferId(id);
    setEmailModalOpen(true);
  };

  const previewRef1 = useRef(null);
  const previewRef2 = useRef(null);
  const previewRef3 = useRef(null); // Keep ref definition to avoid syntax/reference errors, although we will not use it for A4 export when 2 pages.

  // ── Validation ──────────────────────────────────────────────────────────────
  const validateStep = () => {
    const p = secondParty;
    if (activeStep === 1) {
      if (!p.fullName.trim()) return "Full Name is required.";
      if (!p.dob) return "Date of Birth is required.";
      if (!p.nidNumber.trim()) return "National ID (NID) is required.";
      if (!p.position.trim()) return "Company role position is required.";
    } else if (activeStep === 2) {
      if (!p.guardianName.trim())
        return `${p.guardianRelation}'s Name is required.`;
      if (!p.guardianMobile.trim())
        return "Guardian Mobile Number is required.";
    } else if (activeStep === 3) {
      if (!p.mobileNumber.trim()) return "Candidate Mobile Number is required.";
      if (!p.email.trim()) return "Candidate Email Address is required.";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(p.email.trim())) return "Please enter a valid email address.";
      if (!p.presentAddress.trim()) return "Present Address is required.";
      if (!p.permanentAddress.trim()) return "Permanent Address is required.";
    } else if (activeStep === 4) {
      if (!docSettings.date.trim()) return "Signing Date is required.";
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
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError("");
    if (activeStep < TOTAL_STEPS) {
      setActiveStep((s) => s + 1);
    } else {
      setAppState("workspace");
    }
  };

  const handlePrev = () => {
    if (activeStep > 1) setActiveStep((s) => s - 1);
  };

  // ── Address toggle ──────────────────────────────────────────────────────────
  const handleAddressToggle = (checked) => {
    setSameAddress(checked);
    if (checked)
      setSecondParty((p) => ({ ...p, permanentAddress: p.presentAddress }));
  };

  // ── PDF export ──────────────────────────────────────────────────────────────
  const handleExportPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
        compress: true,
      });
      const pages = [
        previewRef1.current,
        previewRef2.current,
      ];

      for (let i = 0; i < pages.length; i++) {
        if (!pages[i]) continue;
        const canvas = await html2canvas(pages[i], {
          scale: 2.5,
          useCORS: true,
          logging: false,
          allowTaint: false,
          backgroundColor: "#ffffff",
        });
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.95),
          "JPEG",
          0,
          0,
          210,
          297,
          undefined,
          "FAST",
        );
        if (i < pages.length - 1) pdf.addPage();
      }

      const partnerName = secondParty.fullName ? secondParty.fullName.trim() : "Partner";
      pdf.save(`${partnerName} - Appointment Letter.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
      alert("We had an issue generating your PDF: " + err.message + "\nStack: " + err.stack);
    } finally {
      setIsExporting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#2563EB]/20">
      {/* Header */}
      <header className="border-b border-[#DBEAFE] bg-[#F8FAFC]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            if (appState !== "candidatePortal") {
              setAppState("home");
            }
          }}
        >
          <JevxoLogo />
          <div className="hidden sm:block h-6 w-[1.5px] bg-[#DBEAFE]" />
          <p className="hidden sm:block text-xs text-[#64748B] font-medium uppercase tracking-wider">
            Document Automation
          </p>
        </div>

        <div className="flex items-center gap-3">
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

      {/* Main */}
      <main className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {appState === "home" && (
            <Hero
              key="home"
              onStart={() => {
                setIsDemo(false);
                setAppState("login");
              }}
              onDemo={() => {
                setSecondParty(SAMPLE_SECOND_PARTY);
                setSameAddress(false);
                setAppState("form");
                setIsDemo(true);
              }}
            />
          )}

          {appState === "login" && (
            <Login
              key="login"
              onLoginSuccess={() => {
                setAppState("form");
                setActiveStep(1);
              }}
              onBackToHome={() => setAppState("home")}
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
            <motion.section
              key="workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col xl:flex-row w-full h-[calc(100vh-77px)] overflow-hidden"
            >
              <WorkspaceSidebar
                activeTab={activeWorkspaceTab}
                setActiveTab={setActiveWorkspaceTab}
                docSettings={docSettings}
                setDocSettings={setDocSettings}
                secondParty={secondParty}
                setSecondParty={setSecondParty}
                firstParty={firstParty}
                setFirstParty={setFirstParty}
                isExporting={isExporting}
                onExport={handleExportPDF}
                isDemo={isDemo}
                onSendOffer={handleSendOffer}
              />
              <WorkspaceCanvas
                firstParty={firstParty}
                secondParty={secondParty}
                settings={docSettings}
                previewRef1={previewRef1}
                previewRef2={previewRef2}
                previewRef3={previewRef3}
                isExporting={isExporting}
                onExport={handleExportPDF}
                isDemo={isDemo}
              />
            </motion.section>
          )}

          {appState === "candidatePortal" && (
            <motion.section
              key="candidatePortal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col xl:flex-row w-full h-[calc(100vh-77px)] overflow-hidden"
            >
              <CandidateSidebar
                firstParty={firstParty}
                secondParty={secondParty}
                setSecondParty={setSecondParty}
                isExporting={isExporting}
                onExport={handleExportPDF}
                offerId={offerId}
              />
              <WorkspaceCanvas
                firstParty={firstParty}
                secondParty={secondParty}
                settings={docSettings}
                previewRef1={previewRef1}
                previewRef2={previewRef2}
                previewRef3={previewRef3}
                isExporting={isExporting}
                onExport={handleExportPDF}
                isDemo={false}
              />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <EmailPortalModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        secondParty={secondParty}
        firstParty={firstParty}
        candidateLink={candidateLink}
        offerId={offerId}
      />
    </div>
  );
}

// ─── Helper Candidate Sidebar ────────────────────────────────────────────────
function CandidateSidebar({
  firstParty,
  secondParty,
  setSecondParty,
  isExporting,
  onExport,
  offerId
}) {
  const [sigError, setSigError] = useState("");

  const handleSaveSignature = (dataUrl) => {
    setSigError("");
    setSecondParty(p => {
      const updated = { ...p, signatureImg: dataUrl };
      const stored = localStorage.getItem("jevxo_offer_" + offerId);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          parsed.secondParty = updated;
          localStorage.setItem("jevxo_offer_" + offerId, JSON.stringify(parsed));
        } catch (e) {
          console.error(e);
        }
      }
      
      // Save signature to backend
      fetch(`/api/offers/${offerId}/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ signatureImg: dataUrl }),
      }).catch((err) => console.error("Failed to save signature to backend:", err));

      return updated;
    });
  };

  const handleClearSignature = () => {
    setSecondParty(p => {
      const updated = { ...p, signatureImg: "" };
      const stored = localStorage.getItem("jevxo_offer_" + offerId);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          parsed.secondParty = updated;
          localStorage.setItem("jevxo_offer_" + offerId, JSON.stringify(parsed));
        } catch (e) {
          console.error(e);
        }
      }

      // Clear signature on backend
      fetch(`/api/offers/${offerId}/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ signatureImg: "" }),
      }).catch((err) => console.error("Failed to clear signature on backend:", err));

      return updated;
    });
  };

  const handleActionClick = () => {
    if (!secondParty.signatureImg) {
      setSigError("Please draw and save your signature before exporting.");
      return;
    }
    onExport();
  };

  return (
    <div className="w-full xl:w-[420px] bg-[#F8FAFC] border-r border-[#DBEAFE] flex flex-col justify-between overflow-y-auto shrink-0">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <span className="text-[10px] bg-emerald-50 border border-emerald-250 text-emerald-800 font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block">
            Offer Awaiting Acceptance
          </span>
          <h2 className="text-xl font-bold text-[#0F172A]">Candidate Portal</h2>
          <p className="text-[#64748B] text-xs">
            Review the terms, draw your signature, and generate your counter-signed partnership contract.
          </p>
        </div>

        {/* Info card */}
        <div className="p-4 bg-white border border-[#DBEAFE] rounded-2xl space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400 font-semibold">Candidate:</span>
            <span className="font-bold text-slate-800">{secondParty.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-semibold">Position Offered:</span>
            <span className="font-bold text-[#2563EB]">{secondParty.position}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-semibold">Company:</span>
            <span className="font-bold text-slate-800">{firstParty.companyName}</span>
          </div>
        </div>

        {/* Signature Pad */}
        <div className="space-y-4">
          <div className="border-b border-[#DBEAFE] pb-1">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">
              Draw Your Signature *
            </h3>
            <p className="text-[10px] text-[#64748B]">Draw inside the pad below to accept the partnership terms.</p>
          </div>

          {sigError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-semibold rounded-xl">
              {sigError}
            </div>
          )}

          <SignaturePad
            onSave={handleSaveSignature}
            onClear={handleClearSignature}
            savedImage={secondParty.signatureImg}
          />
        </div>
      </div>

      {/* Action footer */}
      <div className="p-6 bg-[#F8FAFC] border-t border-[#DBEAFE] space-y-3 shrink-0">
        <button
          onClick={handleActionClick}
          disabled={isExporting}
          className="w-full py-4 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#64748B]/40 disabled:cursor-not-allowed font-bold text-white text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-md shadow-[#2563EB]/10 hover:shadow-[#2563EB]/25 cursor-pointer"
        >
          {isExporting ? (
            <><RefreshCw className="w-5 h-5 animate-spin" /> Generating Signed PDF...</>
          ) : (
            <><Download className="w-5 h-5" /> Sign & Download PDF (2 Pages)</>
          )}
        </button>
        <div className="flex justify-between text-[11px] text-[#64748B] px-1 font-semibold">
          <span>Official A4 formatting</span>
          <span>Dual signatures included</span>
        </div>
      </div>
    </div>
  );
}
