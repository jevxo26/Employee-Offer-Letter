"use client";

import React from "react";
import { motion } from "motion/react";
import { Check, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Step5 } from "@/features/wizard/steps/partner/WizardSteps";
import {
  DocSettings,
  FirstParty,
  SalesAgreementType,
  SecondParty,
} from "@/types";

const labels = [
  "1. Agreement",
  "2. Parties",
  "3. Territory",
  "4. Commercials",
  "5. Approval",
];

interface Props {
  activeStep: number;
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  firstParty: FirstParty;
  setFirstParty: React.Dispatch<React.SetStateAction<FirstParty>>;
  validationError: string;
  onClearError: () => void;
  onNext: () => void;
  onPrev: () => void;
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
  agreementType: SalesAgreementType;
}

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wide">
    {label}
    <span className="block mt-1.5">{children}</span>
  </label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#2563EB] rounded-xl py-3 px-4 text-sm text-[#0F172A] focus:outline-none transition ${props.className || ""}`}
  />
);

function SliderControl({
  label,
  value,
  suffix = "%",
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  suffix?: string;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="p-4 bg-[#F8FAFC] border border-[#DBEAFE] rounded-2xl flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-[#334155] uppercase tracking-wide">
          {label}
        </label>
        <span className="text-sm text-[#2563EB] font-extrabold bg-[#EFF6FF] px-2 py-0.5 border border-[#DBEAFE] rounded-md">
          {value}
          {suffix}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-[#2563EB] cursor-pointer"
        />
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) =>
            onChange(Math.min(max, Math.max(min, Number(e.target.value) || min)))
          }
          className="w-[60px] text-center bg-white border border-[#DBEAFE] rounded-xl py-1.5 text-[#0F172A] text-xs font-bold focus:outline-none focus:border-[#2563EB]"
        />
      </div>
    </div>
  );
}

export default function SalesFormWizard(props: Props) {
  const {
    activeStep,
    secondParty,
    setSecondParty,
    firstParty,
    setFirstParty,
    validationError,
    onClearError,
    onNext,
    onPrev,
    docSettings,
    setDocSettings,
    agreementType,
  } = props;
  const isCSP = agreementType === "countrySales";
  const partner = docSettings.salesPartner || {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    partnerId: "",
  };
  const setPartner = (patch: Partial<typeof partner>) =>
    setDocSettings((p) => ({
      ...p,
      salesPartner: { ...(p.salesPartner || partner), ...patch },
    }));
  const setSettings = (patch: Partial<DocSettings>) =>
    setDocSettings((p) => ({ ...p, ...patch }));

  const content =
    activeStep === 1 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <h3 className="text-[#0F172A] font-bold text-base">Agreement details</h3>
          <p className="text-[#64748B] text-xs mt-1">
            Enter the reference and dates for this{" "}
            {isCSP ? "Country Sales Partner" : "Sales Agent"} agreement.
          </p>
        </div>
        <Field label="Agreement Reference Number">
          <Input value={docSettings.salesRefId || ""} readOnly />
        </Field>
        <Field label="Agreement Date *">
          <Input
            value={docSettings.date || ""}
            onChange={(e) => setSettings({ date: e.target.value })}
          />
        </Field>
      </div>
    ) : activeStep === 2 ? (
      isCSP ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <h3 className="text-[#0F172A] font-bold text-base">Country Sales Partner information</h3>
            <p className="text-[#64748B] text-xs mt-1">This is the contracting party with JEVXO.</p>
          </div>
          <Field label="Partner Full Name *">
            <Input value={secondParty.fullName} onChange={(e) => setSecondParty((p) => ({ ...p, fullName: e.target.value }))} />
          </Field>
          <Field label="Partner ID *">
            <Input value={secondParty.salesPartnerId || docSettings.salesPartnerId || ""} readOnly />
          </Field>
          <Field label="Partner Email *">
            <Input type="email" value={secondParty.email} onChange={(e) => setSecondParty((p) => ({ ...p, email: e.target.value }))} />
          </Field>
          <Field label="Partner Phone *">
            <Input value={secondParty.mobileNumber} onChange={(e) => setSecondParty((p) => ({ ...p, mobileNumber: e.target.value }))} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Partner Address *">
              <Input value={secondParty.presentAddress} onChange={(e) => setSecondParty((p) => ({ ...p, presentAddress: e.target.value, permanentAddress: e.target.value }))} />
            </Field>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <h3 className="text-[#0F172A] font-bold text-base">Contracting parties</h3>
            <p className="text-[#64748B] text-xs mt-1">
              The Country Sales Partner contracts with the Sales Agent. JEVXO approves the agreement.
            </p>
          </div>
          <Field label="Country Sales Partner Name *">
            <Input value={partner.fullName} onChange={(e) => setPartner({ fullName: e.target.value })} />
          </Field>
          <Field label="Partner Agreement Reference *">
            <Input value={docSettings.partnerAgreementRef || ""} onChange={(e) => setSettings({ partnerAgreementRef: e.target.value })} />
          </Field>
          <Field label="Partner Email *">
            <Input type="email" value={partner.email} onChange={(e) => setPartner({ email: e.target.value })} />
          </Field>
          <Field label="Partner Phone *">
            <Input value={partner.phone} onChange={(e) => setPartner({ phone: e.target.value })} />
          </Field>
          <Field label="Sales Agent Full Name *">
            <Input value={secondParty.fullName} onChange={(e) => setSecondParty((p) => ({ ...p, fullName: e.target.value }))} />
          </Field>
          <Field label="Sales Agent Email *">
            <Input type="email" value={secondParty.email} onChange={(e) => setSecondParty((p) => ({ ...p, email: e.target.value }))} />
          </Field>
          <Field label="Sales Agent Phone *">
            <Input value={secondParty.mobileNumber} onChange={(e) => setSecondParty((p) => ({ ...p, mobileNumber: e.target.value }))} />
          </Field>
          <Field label="Sales Agent ID">
            <Input value={secondParty.salesPartnerId || ""} readOnly />
          </Field>
        </div>
      )
    ) : activeStep === 3 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <h3 className="text-[#0F172A] font-bold text-base">Territory and governance</h3>
        </div>
        <Field label={isCSP ? "Country / Territory *" : "Assigned Territory / Region *"}>
          <Input value={docSettings.territory || ""} onChange={(e) => setSettings({ territory: e.target.value })} />
        </Field>
        <Field label="Governing Jurisdiction *">
          <Input value={docSettings.governingJurisdiction || "Hong Kong Special Administrative Region"} readOnly />
        </Field>
        {isCSP ? (
          <div className="md:col-span-2">
            <Field label="Exclusivity *">
              <select
                value={String(docSettings.isExclusive ?? false)}
                onChange={(e) => setSettings({ isExclusive: e.target.value === "true" })}
                className="w-full bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl py-3 px-4 text-sm"
              >
                <option value="false">Non-Exclusive</option>
                <option value="true">Exclusive</option>
              </select>
            </Field>
          </div>
        ) : (
          <>
            <Field label="Reporting Structure *">
              <Input value={docSettings.reportingStructure || "Country Sales Partner"} onChange={(e) => setSettings({ reportingStructure: e.target.value })} />
            </Field>
            <Field label="Partner Address">
              <Input value={partner.address} onChange={(e) => setPartner({ address: e.target.value })} />
            </Field>
          </>
        )}
      </div>
    ) : activeStep === 4 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
        <div className="md:col-span-2">
          <h3 className="text-[#0F172A] font-bold text-base">Commission and payment configuration</h3>
        </div>
        <SliderControl label={isCSP ? "Base Commission" : "Sales Commission"} value={docSettings.baseCommissionRate ?? 10} min={1} max={100} onChange={(value) => setSettings({ baseCommissionRate: value })} />
        <SliderControl label="Recurring Commission" value={docSettings.recurringCommissionRate ?? 10} min={1} max={100} onChange={(value) => setSettings({ recurringCommissionRate: value })} />
        {isCSP && (
          <SliderControl label="Override Commission" value={docSettings.overrideCommissionRate ?? 10} min={1} max={100} onChange={(value) => setSettings({ overrideCommissionRate: value })} />
        )}
        <Field label="Payment Currency *">
          <select value={docSettings.paymentCurrency || "USD"} onChange={(e) => setSettings({ paymentCurrency: e.target.value })} className="w-full bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl py-3 px-4 text-sm">
            {["USD", "EUR", "GBP", "BDT"].map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </Field>
        {isCSP && (
          <SliderControl label="Initial Term" value={docSettings.initialTerm ?? 1} suffix=" Year(s)" min={1} max={10} onChange={(value) => setSettings({ initialTerm: value })} />
        )}
            <SliderControl label="Notice Period" value={Number(docSettings.noticePeriodSales) || 30} suffix=" Days" min={1} max={90} onChange={(value) => setSettings({ noticePeriodSales: String(value) })} />
      </div>
    ) : (
      <Step5 firstParty={firstParty} setFirstParty={setFirstParty} onClearError={onClearError} />
    );

  return (
    <motion.section
      key="sales-form"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto w-full px-4 py-8 md:py-12"
    >
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <FileText className="text-[#2563EB] w-6 h-6" />
            {isCSP ? "Country Sales Partner Agreement" : "Sales Agent Agreement"}
          </h2>
          <span className="text-xs bg-[#EFF6FF] border border-[#DBEAFE] px-3 py-1 rounded-full text-[#2563EB] font-bold">
            Step {activeStep} of 5
          </span>
        </div>
        <div className="w-full bg-[#DBEAFE] h-2 rounded-full overflow-hidden flex">
          {labels.map((_, index) => (
            <div
              key={index}
              className={`h-full flex-1 ${index < activeStep ? "bg-[#2563EB]" : "bg-[#DBEAFE]"}`}
            />
          ))}
        </div>
        <div className="grid grid-cols-5 text-center mt-2.5 text-[10px] md:text-xs font-semibold uppercase tracking-wider text-[#64748B]">
          {labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
      <div className="bg-white border border-[#DBEAFE] shadow-sm rounded-3xl p-6 md:p-8 space-y-6">
        {validationError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-800">
            {validationError}
          </div>
        )}
        {content}
        <div className="flex justify-between items-center pt-4 border-t border-[#DBEAFE] gap-4">
          <button
            type="button"
            onClick={onPrev}
            disabled={activeStep === 1}
            className="px-5 py-3 font-semibold rounded-xl border border-[#DBEAFE] text-[#334155] disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4 inline" /> Back
          </button>
          <button
            type="button"
            onClick={onNext}
            className="px-6 py-3 bg-[#2563EB] font-bold cursor-pointer text-white rounded-xl"
          >
            {activeStep === 5 ? "Generate Document" : "Continue"}{" "}
            {activeStep === 5 ? (
              <Check className="w-4 h-4 inline" />
            ) : (
              <ChevronRight className="w-4 h-4 inline" />
            )}
          </button>
        </div>
      </div>
    </motion.section>
  );
}
