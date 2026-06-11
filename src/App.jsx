import { useState, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mail, RefreshCw } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import JevxoLogo from "./components/JevxoLogo";
import FormWizard from "./components/FormWizard";
import WorkspaceSidebar from "./components/WorkspaceSidebar";
import WorkspaceCanvas from "./components/WorkspaceCanvas";
import Hero from "./components/Hero";
import { tr } from "motion/react-client";

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
};

const DEFAULT_SECOND_PARTY = {
  fullName: "",
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

const TOTAL_STEPS = 4;

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [appState, setAppState] = useState("home"); // 'home' | 'form' | 'workspace'
  const [activeStep, setActiveStep] = useState(1);
  const [isDemo, setIsDemo] = useState(false);

  const [firstParty, setFirstParty] = useState(DEFAULT_FIRST_PARTY);
  const [secondParty, setSecondParty] = useState(DEFAULT_SECOND_PARTY);
  const [docSettings, setDocSettings] = useState(DEFAULT_DOC_SETTINGS);

  const [sameAddress, setSameAddress] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState("settings");
  const [validationError, setValidationError] = useState("");

  const previewRef1 = useRef(null);
  const previewRef2 = useRef(null);
  const previewRef3 = useRef(null);

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
      if (!p.presentAddress.trim()) return "Present Address is required.";
      if (!p.permanentAddress.trim()) return "Permanent Address is required.";
    } else if (activeStep === 4) {
      if (!p.signatureImg)
        return "A signature image or pad drawing is required to complete the agreement.";
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
        previewRef3.current,
      ];

      for (let i = 0; i < pages.length; i++) {
        if (!pages[i]) continue;
        const canvas = await html2canvas(pages[i], {
          scale: 2.5,
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: "#ffffff",
          width: 793,
          height: 1122,
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

      const cleanName = (secondParty.fullName || "Partner_Agreement").replace(
        /\s+/g,
        "_",
      );
      pdf.save(`JEVXO_Appointment_And_Partnership_Agreement_${cleanName}.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
      alert("We had an issue generating your PDF. Please try again.");
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
          onClick={() => setAppState("home")}
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
              onStart={() => setAppState("form")}
              onDemo={() => {
                setSecondParty(SAMPLE_SECOND_PARTY);
                setSameAddress(false);
                setAppState("form");
                setIsDemo(true);
              }}
            />
          )}

          {appState === "form" && (
            <FormWizard
              key="form"
              activeStep={activeStep}
              secondParty={secondParty}
              setSecondParty={setSecondParty}
              sameAddress={sameAddress}
              onAddressToggle={handleAddressToggle}
              validationError={validationError}
              onClearError={() => setValidationError("")}
              onNext={handleNext}
              onPrev={handlePrev}
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
              />
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
