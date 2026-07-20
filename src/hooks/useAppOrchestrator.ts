"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";
import { buildIdCardPdfBase64 } from "@/features/id-card/components/IdCardWorkspace";
import { arrayBufferToBase64 } from "@/utils/pdfUtils";
import {
  DEFAULT_FIRST_PARTY,
  DEFAULT_SECOND_PARTY,
} from "@/shared/constants/defaults";
import {
  FirstParty,
  SecondParty,
  DocSettings,
  AppState,
  AgreementTemplate,
  SalesAgreementType,
  EmployeeCard,
} from "@/types";

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

export function useAppOrchestrator() {
  const [appState, setAppState] = useState<AppState>("home");
  const [docType, setDocType] = useState<string>("both");
  const [agreementTemplate, setAgreementTemplate] = useState<AgreementTemplate>("partner");
  const [salesAgreementType, setSalesAgreementType] = useState<SalesAgreementType | undefined>(undefined);
  const [activeStep, setActiveStep] = useState(1);
  const [isDemo, setIsDemo] = useState(false);

  const [firstParty, setFirstParty] = useState<FirstParty>(DEFAULT_FIRST_PARTY);
  const [secondParty, setSecondParty] = useState<SecondParty>(DEFAULT_SECOND_PARTY);
  const [docSettings, setDocSettings] = useState<DocSettings>({
    date: getDefaultIssueDate(),
    minimumServicePeriod: 3,
    equityShare: 7,
    noticePeriod: 15,
    agreementTemplate: "partner",
  });

  const [employeeCard, setEmployeeCard] = useState<EmployeeCard>({
    fullName: "",
    position: "",
    employeeId: "000-000-0001",
    bloodGroup: "Select",
    department: "",
    photoUrl: "",
    issueDate: getDefaultIssueDate(),
    expiryDate: getDefaultExpiryDate(),
  });

  const [sameAddress, setSameAddress] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isOpeningModal, setisOpeningModal] = useState(false);
  const [isLoadingOffer, setIsLoadingOffer] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState("settings");
  const [validationError, setValidationError] = useState("");
  const [isCandidateSigned, setIsCandidateSigned] = useState(false);
  const [isOfferSent, setIsOfferSent] = useState(false);

  const [offerId, setOfferId] = useState("");
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [salesAgentModalOpen, setSalesAgentModalOpen] = useState(false);
  const [candidateLink, setCandidateLink] = useState("");

  const previewRef0 = useRef<HTMLDivElement>(null);
  const previewRef1 = useRef<HTMLDivElement>(null);
  const previewRef2 = useRef<HTMLDivElement>(null);
  const previewRef3 = useRef<HTMLDivElement>(null);
  const previewRef4 = useRef<HTMLDivElement>(null);
  const previewRefs = [
    previewRef0,
    previewRef1,
    previewRef2,
    previewRef3,
    previewRef4,
  ];

  const candidateCardFrontRef = useRef<React.RefObject<HTMLDivElement | null> | null>(null);
  const candidateCardBackRef = useRef<React.RefObject<HTMLDivElement | null> | null>(null);

  // Initial fetching of IDs
  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("candidateView")) return;
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

  // Pre-load intern IDs
  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("candidateView")) return;
    if (agreementTemplate !== "internship") return;
    async function fetchNextInternIds() {
      try {
        const res = await fetch("/api/check-id?action=nextIntern");
        if (res.ok) {
          const data = await res.json();
          const internSerial = data.internId?.split("-").pop() || "001";
          const refSerial    = data.internRefId?.split("-").pop() || "001";
          setDocSettings((p) => ({
            ...p,
            internId:           data.internId,
            internIdSerial:     internSerial,
            internRefId:        data.internRefId,
            internRefIdSerial:  refSerial,
          }));
          setSecondParty((p) => ({
            ...p,
            partnerId:       data.internId,
            partnerIdSerial: internSerial,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch next intern IDs", err);
      }
    }
    fetchNextInternIds();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agreementTemplate]);

  // Pre-load sales IDs
  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("candidateView")) return;
    if (!salesAgreementType) return;

    const action = salesAgreementType === "countrySales" ? "nextCountrySales" : "nextSalesAgent";

    async function fetchNextSalesIds() {
      try {
        const res = await fetch(`/api/check-id?action=${action}`);
        if (res.ok) {
          const data = await res.json();
          const serial = data.salesPartnerId?.split("-").pop() || "001";
          const refSerial = data.salesRefId?.split("-").pop() || "001";
          setDocSettings((p) => ({
            ...p,
            salesRefId: data.salesRefId,
            salesRefIdSerial: refSerial,
            salesPartnerId: data.salesPartnerId,
            salesPartnerIdSerial: serial,
            salesAgreementType: salesAgreementType,
          }));
          setSecondParty((p) => ({
            ...p,
            salesPartnerId: data.salesPartnerId,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch next sales IDs", err);
      }
    }
    fetchNextSalesIds();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesAgreementType]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const candidateViewId = params.get("candidateView");
    if (candidateViewId) {
      setIsLoadingOffer(true);
      fetch(`/api/offers/${candidateViewId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Offer not found on backend.");
          return res.json();
        })
        .then((data) => {
          setFirstParty(data.firstParty);
          setSecondParty(data.secondParty);
          setDocSettings({ ...data.docSettings, ...(data.signedAt ? { partnerSignedDate: new Date(data.signedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) } : {}) });
          setAgreementTemplate(
            (data.docSettings?.agreementTemplate as AgreementTemplate) ||
              "partner",
          );
          const restored = data.docSettings?.salesAgreementType as SalesAgreementType | undefined;
          setSalesAgreementType(restored || undefined);
          setIsCandidateSigned(
            Boolean(data.partnerSigned || data.status === "FULLY_EXECUTED"),
          );
          setOfferId(candidateViewId);
          setIsDemo(false);
          setAppState("candidatePortal");
          setIsLoadingOffer(false);
        })
        .catch((err) => {
          console.warn(
            "Backend fetch failed, trying localStorage fallback:",
            err,
          );
          const stored = localStorage.getItem("jevxo_offer_" + candidateViewId);
          if (stored) {
            try {
              const data = JSON.parse(stored);
              setFirstParty(data.firstParty);
              setSecondParty(data.secondParty);
              setDocSettings(data.docSettings);
              setAgreementTemplate(
                (data.agreementTemplate as AgreementTemplate) ||
                  data.docSettings?.agreementTemplate ||
                  "partner",
              );
              const restoredSales = data.docSettings?.salesAgreementType as SalesAgreementType | undefined;
              setSalesAgreementType(restoredSales || undefined);
              setIsCandidateSigned(
                Boolean(data.partnerSigned || data.status === "FULLY_EXECUTED"),
              );
              setOfferId(candidateViewId);
              setIsDemo(false);
              setAppState("candidatePortal");
            } catch (e) {
              console.error("Error loading offer data from localStorage", e);
            }
          }
          setIsLoadingOffer(false);
        });
    }
  }, []);

  const handleTemplateSelect = (type: "partner" | "internship" | "countrySales" | "salesAgent") => {
    if (type === "countrySales" || type === "salesAgent") {
      setSalesAgreementType(type);
      setAgreementTemplate("partner");
      setDocSettings((prev) => ({
        ...prev,
        agreementTemplate: "partner",
        salesAgreementType: type,
        governingJurisdiction: prev.governingJurisdiction || "Hong Kong Special Administrative Region",
        paymentCurrency: prev.paymentCurrency || "USD",
        noticePeriodSales: prev.noticePeriodSales || "30",
      }));
    } else if (type === "internship") {
      setSalesAgreementType(undefined);
      setAgreementTemplate("internship");
      setDocSettings((prev) => ({
        ...prev,
        agreementTemplate: "internship" as AgreementTemplate,
        salesAgreementType: undefined,
      }));
    } else {
      setSalesAgreementType(undefined);
      setAgreementTemplate("partner");
      setDocSettings((prev) => ({
        ...prev,
        agreementTemplate: "partner",
        salesAgreementType: undefined,
      }));
    }
    setDocType("both");
    setIsOfferSent(false);
    setActiveStep(1);
    setAppState("form");
  };

  const getIdLabel = (): string | undefined => {
    if (agreementTemplate === "internship") return "Internee ID";
    return undefined;
  };

  const syncEmployeeCardFromForm = () => {
    setEmployeeCard((prev) => ({
      ...prev,
      fullName: secondParty.fullName,
      position: salesAgreementType === "countrySales" ? "Country Sales Partner" : salesAgreementType === "salesAgent" ? "Sales Agent" : secondParty.position,
      bloodGroup: secondParty.bloodGroup || "Select",
      ...(agreementTemplate === "internship" && docSettings.internExpiryDate
        ? { expiryDate: docSettings.internExpiryDate }
        : {}),
      ...(salesAgreementType && docSettings.salesExpiryDate
        ? { expiryDate: docSettings.salesExpiryDate }
        : {}),
      ...(salesAgreementType
        ? { employeeId: secondParty.salesPartnerId || docSettings.salesPartnerId || prev.employeeId }
        : {}),
    }));
  };

  const handleSendOffer = async (options?: { cardPDFdata?: string }) => {
    setisOpeningModal(true);
    const tempId = Math.random().toString(36).substring(2, 11);
    const stateToSave = { firstParty, secondParty, docSettings, agreementTemplate };
    localStorage.setItem("jevxo_offer_" + tempId, JSON.stringify(stateToSave));
    const cardPDFdata = options?.cardPDFdata || "";

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
            agreementTemplate,
            salesAgreementType,
            ...(cardPDFdata ? { cardPDFdata } : {}),
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

    setisOpeningModal(false);

    if (!saved || !dbAgreementId) {
      alert("Failed to save offer to database. Please try again.");
      return;
    }

    const link = `${window.location.origin}${window.location.pathname}?candidateView=${dbAgreementId}`;
    setCandidateLink(link);
    setOfferId(dbAgreementId);
    setEmailModalOpen(true);
  };

  const validateStep = () => {
    const p = secondParty;
    const isInternship = agreementTemplate === "internship";
    const isSalesAgreement = Boolean(salesAgreementType);

    if (isSalesAgreement) {
      const isCSP = salesAgreementType === "countrySales";
      const partner = docSettings.salesPartner;
      const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
      if (activeStep === 1) {
        if (!docSettings.salesRefId?.trim() || !docSettings.date.trim()) return "Agreement reference and date are required.";
      } else if (activeStep === 2) {
        if (!p.fullName.trim() || !validEmail(p.email) || !p.mobileNumber.trim()) return isCSP ? "Partner name, valid email, and phone are required." : "Sales Agent name, valid email, and phone are required.";
        if (isCSP && !p.presentAddress.trim()) return "Partner address is required.";
        if (!isCSP && (!partner?.fullName.trim() || !validEmail(partner.email) || !partner.phone.trim() || !docSettings.partnerAgreementRef?.trim())) return "Country Sales Partner name, email, phone, and agreement reference are required.";
      } else if (activeStep === 3) {
        if (!docSettings.territory?.trim() || !docSettings.governingJurisdiction?.trim()) return "Territory and governing jurisdiction are required.";
      } else if (activeStep === 4) {
        if (!docSettings.paymentCurrency?.trim() || !docSettings.noticePeriodSales?.trim()) return "Payment currency and notice period are required.";
      } else if (activeStep === 5 && !firstParty.signatureImg) return "The Founder approval signature is required.";
      return "";
    }

    if (isInternship) {
      if (activeStep === 1) {
        if (!p.fullName.trim()) return "Full Name is required.";
        if (!p.nidNumber.trim()) return "National ID (NID) is required.";
        if (!p.position.trim()) return "Internship position is required.";
        if (!p.email.trim()) return "Email address is required.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(p.email.trim())) return "Please enter a valid email address.";
        if (!p.mobileNumber.trim()) return "Phone number is required.";
      } else if (activeStep === 2) {
        if (!docSettings.date.trim()) return "Offer date is required.";
        if (!docSettings.internshipDuration?.trim()) return "Internship duration is required.";
        if (docSettings.isPaid === undefined) return "Please select paid or unpaid.";
        if (!docSettings.internIdSerial?.trim()) return "Intern ID serial is required.";
        if (!docSettings.internRefIdSerial?.trim()) return "Reference ID serial is required.";
      } else if (activeStep === 3) {
        if (!firstParty.signatureImg) return "Founder/CEO signature is required to issue the offer letter.";
      }
      return "";
    }

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
      if (!emailRegex.test(p.email.trim()))
        return "Please enter a valid email address.";
      if (!p.presentAddress.trim()) return "Present Address is required.";
      if (!p.permanentAddress.trim()) return "Permanent Address is required.";
    } else if (activeStep === 4) {
      if (!docSettings.date.trim()) return "Signing Date is required.";
      if (!secondParty.partnerIdSerial?.trim())
        return "Partner ID serial is required.";
      if (!docSettings.refIdSerial?.trim())
        return "Agreement ID serial is required.";
      if (!docSettings.equityShare) return "Equity Share is required.";
      if (docSettings.equityShare < 1 || docSettings.equityShare > 100)
        return "Equity Share must be between 1% and 100%.";
      if (!docSettings.minimumServicePeriod)
        return "Minimum Service Period is required.";
      if (!docSettings.noticePeriod) return "Notice Period is required.";
    } else if (activeStep === 5) {
      if (!firstParty.signatureImg)
        return "The Founder / CEO signature is required to complete the agreement.";
    }
    return "";
  };

  const ACTIVE_TOTAL_STEPS = agreementTemplate === "internship" ? 3 : TOTAL_STEPS;

  const handleNext = () => {
    const error = validateStep();
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError("");
    if (activeStep < ACTIVE_TOTAL_STEPS) {
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

  const handleAddressToggle = (checked: boolean) => {
    setSameAddress(checked);
    if (checked)
      setSecondParty((p) => ({ ...p, permanentAddress: p.presentAddress }));
  };

  const handleExportPDF = async () => {
    if (isExporting || (appState === "candidatePortal" && isCandidateSigned))
      return;
    setIsExporting(true);
    document.documentElement.classList.add("a4-exporting");
    try {
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
        compress: true,
      });
      const pages = previewRefs
        .map((ref) => ref.current)
        .filter(
          (el): el is HTMLDivElement =>
            el != null && el.style.display !== "none",
        );
      if (!pages.length) {
        throw new Error("No document pages were available for PDF generation.");
      }
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i] as HTMLElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: false,
          backgroundColor: "#ffffff",
        });
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.82),
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
      if (appState === "candidatePortal") {
        const pdfData = arrayBufferToBase64(pdf.output("arraybuffer"));

        const res = await fetch(`/api/offers/${offerId}/sign`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            signatureImg: secondParty.signatureImg,
            letterPDFdata: pdfData,
          }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(
            data?.error ||
              "Failed to finalize the agreement. Please try again.",
          );
        }

        if (data?.isPendingCSP) {
          setIsCandidateSigned(true);
          toast.success("CSP signature saved! Please send the agreement to the Sales Agent.");
          setCandidateLink(`${window.location.origin}${window.location.pathname}?candidateView=${offerId}`);
          setSalesAgentModalOpen(true);
          document.documentElement.classList.remove("a4-exporting");
          setIsExporting(false);
          return;
        }

        setIsCandidateSigned(true);
        toast.info("Signature applied! Preparing your documents…");

        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => resolve()),
        );

        const frontEl = candidateCardFrontRef.current?.current;
        const backEl = candidateCardBackRef.current?.current;
        if (frontEl && backEl) {
          try {
            const cardPDFdata = await buildIdCardPdfBase64(frontEl, backEl);
            if (cardPDFdata) {
              const cardRes = await fetch(`/api/offers/${offerId}/card-pdf`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cardPDFdata }),
              });
              const cardData = await cardRes.json().catch(() => null);
              toast.success(
                cardData?.message ||
                  "The fully executed documents have been emailed to you and the Founder.",
              );
            }
          } catch (cardErr) {
            console.warn("ID card PDF generation skipped:", cardErr);
            toast.success("Your signed documents have been saved.");
          }
        }
      } else {
        const partnerName = secondParty.fullName
          ? secondParty.fullName.trim()
          : "Partner";
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

  const getBackLabel = () => {
    if (appState === "form") return "← Back to Doc Select";
    if (appState === "workspace") return "← Back to Form";
    if (appState === "idCard") return "← Back to Doc Select";
    if (appState === "docTypeSelect") return "← Back to Home";
    if (appState === "adminDashboard") return "← Back to Doc Select";
    return null;
  };

  const handleHeaderBack = () => {
    if (appState === "form") {
      setAppState("docTypeSelect");
    } else if (appState === "workspace") {
      setAppState("form");
      setActiveStep(5);
    } else if (appState === "idCard") {
      setAppState("docTypeSelect");
    } else if (appState === "docTypeSelect") {
      setAppState("home");
    } else if (appState === "adminDashboard") {
      setAppState("docTypeSelect");
    }
  };

  return {
    appState,
    setAppState,
    docType,
    setDocType,
    agreementTemplate,
    setAgreementTemplate,
    salesAgreementType,
    setSalesAgreementType,
    activeStep,
    setActiveStep,
    isDemo,
    setIsDemo,
    firstParty,
    setFirstParty,
    secondParty,
    setSecondParty,
    docSettings,
    setDocSettings,
    employeeCard,
    setEmployeeCard,
    sameAddress,
    setSameAddress,
    isExporting,
    isOpeningModal,
    isLoadingOffer,
    activeWorkspaceTab,
    setActiveWorkspaceTab,
    validationError,
    setValidationError,
    isCandidateSigned,
    isOfferSent,
    setIsOfferSent,
    offerId,
    setOfferId,
    emailModalOpen,
    setEmailModalOpen,
    salesAgentModalOpen,
    setSalesAgentModalOpen,
    candidateLink,
    setCandidateLink,
    previewRefs,
    candidateCardFrontRef,
    candidateCardBackRef,
    handleTemplateSelect,
    getIdLabel,
    syncEmployeeCardFromForm,
    handleSendOffer,
    validateStep,
    handleNext,
    handlePrev,
    handleAddressToggle,
    handleExportPDF,
    getBackLabel,
    handleHeaderBack,
  };
}
