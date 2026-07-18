"use client";

import React from "react";
import { AnimatePresence } from "motion/react";
import { Mail, RefreshCw, CreditCard, FileText } from "lucide-react";
import { useAppOrchestrator } from "@/hooks/useAppOrchestrator";
import { SAMPLE_SECOND_PARTY } from "@/shared/constants/defaults";

import JevxoLogo from "@/shared/layout/JevxoLogo";
import Hero from "@/shared/layout/Hero";
import Login from "@/features/auth/components/Login";
import DocTypeSelector from "@/features/doc-select/components/DocTypeSelector";
import FormWizard from "@/features/wizard/components/FormWizard";
import SalesFormWizard from "@/features/wizard/components/SalesFormWizard";
import InternshipFormWizard from "@/features/wizard/components/InternshipFormWizard";
import CeoWorkspace from "@/features/workspace/components/CeoWorkspace";
import CandidatePortal from "@/features/candidate-portal/components/CandidatePortal";
import EmailPortalModal from "@/features/email/components/EmailPortalModal";
import SalesAgentEmailModal from "@/features/email/components/SalesAgentEmailModal";
import IdCardWorkspace from "@/features/id-card/components/IdCardWorkspace";
import AdminDashboard from "@/features/admin/components/AdminDashboard";

export default function Home() {
  const {
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
    emailModalOpen,
    setEmailModalOpen,
    salesAgentModalOpen,
    setSalesAgentModalOpen,
    candidateLink,
    previewRefs,
    candidateCardFrontRef,
    candidateCardBackRef,
    handleTemplateSelect,
    getIdLabel,
    handleSendOffer,
    handleNext,
    handlePrev,
    handleAddressToggle,
    handleExportPDF,
    getBackLabel,
    handleHeaderBack,
  } = useAppOrchestrator();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#2563EB]/20">
      {/* ── Full-page loading overlay — shown while fetching the candidate offer ── */}
      {isLoadingOffer && (
        <div className="fixed inset-0 z-[9999] bg-[#F8FAFC]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <svg
            className="w-10 h-10 text-[#2563EB] animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="text-sm font-bold text-[#334155] uppercase tracking-wider">
            Loading your offer…
          </p>
        </div>
      )}

      {/* ── Finalize loading overlay — shown while generating + emailing PDFs ── */}
      {isExporting && appState === "candidatePortal" && (
        <div className="fixed inset-0 z-[9999] bg-[#0F172A]/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <svg
            className="w-12 h-12 text-white animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="text-sm font-bold text-white uppercase tracking-wider">
            Finalizing your documents…
          </p>
          <p className="text-xs text-white/60">
            Generating PDFs and sending to email. Please wait.
          </p>
        </div>
      )}
      {/* Header */}
      <header className="border-b border-[#DBEAFE] bg-[#F8FAFC]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-2 flex justify-between items-center">
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
                setDocType("both");
                setAgreementTemplate("partner");
                setDocSettings((prev) => ({
                  ...prev,
                  agreementTemplate: "partner",
                }));
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
              onSelect={handleTemplateSelect}
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
            agreementTemplate === "internship" ? (
              <InternshipFormWizard
                key="internshipForm"
                activeStep={activeStep}
                secondParty={secondParty}
                setSecondParty={setSecondParty}
                firstParty={firstParty}
                setFirstParty={setFirstParty}
                validationError={validationError}
                onClearError={() => setValidationError("")}
                onNext={handleNext}
                onPrev={handlePrev}
                docSettings={docSettings}
                setDocSettings={setDocSettings}
              />
            ) : salesAgreementType ? (
              <SalesFormWizard
                key={`sales-${salesAgreementType}`}
                activeStep={activeStep}
                secondParty={secondParty}
                setSecondParty={setSecondParty}
                firstParty={firstParty}
                setFirstParty={setFirstParty}
                validationError={validationError}
                onClearError={() => setValidationError("")}
                onNext={handleNext}
                onPrev={handlePrev}
                docSettings={docSettings}
                setDocSettings={setDocSettings}
                agreementType={salesAgreementType}
              />
            ) : (
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
            )
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
              isOpeningModal={isOpeningModal}
              onSendOffer={handleSendOffer}
              previewRefs={previewRefs}
              docType={docType}
              agreementTemplate={agreementTemplate}
              employeeCard={employeeCard}
              setEmployeeCard={setEmployeeCard}
              salesAgreementType={salesAgreementType}
              idLabel={getIdLabel()}
            />
          )}

          {appState === "idCard" && (
            <IdCardWorkspace
              key="idCard"
              initialData={{
                fullName: secondParty.fullName || employeeCard.fullName,
                position: salesAgreementType === "countrySales" ? "Country Sales Partner" : salesAgreementType === "salesAgent" ? "Sales Agent" : secondParty.position || employeeCard.position,
                bloodGroup: secondParty.bloodGroup || employeeCard.bloodGroup,
                employeeId: secondParty.partnerId || employeeCard.employeeId,
                issueDate: docSettings.date || employeeCard.issueDate,
                expiryDate: employeeCard.expiryDate,
              }}
              controlledPhotoUrl={employeeCard.photoUrl}
              onPhotoChange={(dataUrl) =>
                setEmployeeCard((prev) => ({ ...prev, photoUrl: dataUrl }))
              }
              hidePhotoUpload
            />
          )}

          {appState === "candidatePortal" && (
            <CandidatePortal
              firstParty={firstParty}
              secondParty={secondParty}
              setSecondParty={setSecondParty}
              docSettings={docSettings}
              setDocSettings={setDocSettings}
              isExporting={isExporting}
              isCompleted={isCandidateSigned}
              onExport={handleExportPDF}
              offerId={offerId}
              previewRefs={previewRefs}
              agreementTemplate={agreementTemplate}
              salesAgreementType={salesAgreementType}
              onIdCardRefsReady={(frontRef, backRef) => {
                candidateCardFrontRef.current = frontRef;
                candidateCardBackRef.current = backRef;
              }}
            />
          )}
        </AnimatePresence>
      </main>

      <SalesAgentEmailModal
        isOpen={salesAgentModalOpen}
        onClose={() => setSalesAgentModalOpen(false)}
        onSentSuccess={() => setIsOfferSent(true)}
        secondParty={secondParty}
        firstParty={firstParty}
        candidateLink={candidateLink}
        offerId={offerId}
        agreementTemplate={agreementTemplate}
        salesAgreementType={salesAgreementType}
        docSettings={docSettings}
      />

      <EmailPortalModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        onSentSuccess={() => setIsOfferSent(true)}
        secondParty={secondParty}
        firstParty={firstParty}
        candidateLink={candidateLink}
        offerId={offerId}
        agreementTemplate={agreementTemplate}
        salesAgreementType={salesAgreementType}
      />
    </div>
  );
}
