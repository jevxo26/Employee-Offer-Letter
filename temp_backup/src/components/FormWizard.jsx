import { motion } from "motion/react";
import { FileText, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Step1, Step2, Step3, Step4, Step5 } from "./WizardSteps";

const STEP_LABELS = [
  "1. Personal info",
  "2. Fam relation",
  "3. Contacts",
  "4. Agreement",
  "5. Signature",
];
const TOTAL_STEPS = 5;

export default function FormWizard({
  activeStep,
  secondParty,
  setSecondParty,
  firstParty,
  setFirstParty,
  sameAddress,
  onAddressToggle,
  validationError,
  onClearError,
  onNext,
  onPrev,
  docSettings,
  setDocSettings,
}) {
  return (
    <motion.section
      key="form"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto w-full px-4 py-8 md:py-12"
    >
      {/* Wizard Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <FileText className="text-[#2563EB] w-6 h-6" />
            Partner Details Form
          </h2>
          <span className="text-xs bg-[#EFF6FF] border border-[#DBEAFE] px-3 py-1 rounded-full text-[#2563EB] font-bold">
            Step {activeStep} of {TOTAL_STEPS}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#DBEAFE] h-2 rounded-full overflow-hidden flex">
          {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-300 ${
                idx + 1 <= activeStep ? "bg-[#2563EB]" : "bg-[#DBEAFE]"
              } ${idx < TOTAL_STEPS - 1 ? "border-r border-white" : ""}`}
            />
          ))}
        </div>

        {/* Step labels */}
        <div className="grid grid-cols-4 text-center mt-2.5 text-[10px] md:text-xs font-semibold uppercase tracking-wider text-[#64748B]">
          {STEP_LABELS.map((label, idx) => (
            <span
              key={label}
              className={
                activeStep === idx + 1 ? "text-[#2563EB] font-bold" : ""
              }
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-[#DBEAFE] shadow-sm rounded-3xl p-6 md:p-8 space-y-6">
        {validationError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-800">
            {validationError}
          </div>
        )}

        {activeStep === 1 && (
          <Step1 secondParty={secondParty} setSecondParty={setSecondParty} />
        )}
        {activeStep === 2 && (
          <Step2 secondParty={secondParty} setSecondParty={setSecondParty} />
        )}
        {activeStep === 3 && (
          <Step3
            secondParty={secondParty}
            setSecondParty={setSecondParty}
            sameAddress={sameAddress}
            onAddressToggle={onAddressToggle}
          />
        )}
        {activeStep === 4 && (
          <Step4
            docSettings={docSettings}
            setDocSettings={setDocSettings}
          />
        )}
        {activeStep === 5 && (
          <Step5
            firstParty={firstParty}
            setFirstParty={setFirstParty}
            onClearError={onClearError}
          />
        )}

        {/* Footer nav */}
        <div className="flex justify-between items-center pt-4 border-t border-[#DBEAFE] gap-4">
          <button
            type="button"
            onClick={onPrev}
            disabled={activeStep === 1}
            className={`px-5 py-3 font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
              activeStep === 1
                ? "opacity-30 cursor-not-allowed text-[#64748B] bg-transparent"
                : "bg-[#F8FAFC] border border-[#DBEAFE] hover:border-[#2563EB] hover:bg-white text-[#334155]"
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          <button
            type="button"
            onClick={onNext}
            className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] font-bold text-white rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            {activeStep === TOTAL_STEPS ? "Generate Document" : "Continue"}
            {activeStep < TOTAL_STEPS ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </motion.section>
  );
}
