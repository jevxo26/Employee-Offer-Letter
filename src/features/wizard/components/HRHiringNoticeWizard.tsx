"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
    FileText,
    ChevronLeft,
    ChevronRight,
    Check,
    Plus,
    X,
} from "lucide-react";
import { FirstParty, DocSettings } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const STEP_LABELS = ["1. Recipient & Title", "2. Job Details", "3. Approval"];
const TOTAL_STEPS = 3;

const RECIPIENT_ROLES = ["CEO", "CTO", "Founder", "COO", "Director", "VP of Engineering", "Head of Product"];
const EMPLOYMENT_TYPES = ["Internship", "Part-Time", "Full-Time", "Contract", "Freelance"];
const WORK_MODES = ["Onsite", "Remote", "Hybrid"];

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface HRHiringNoticeWizardProps {
    activeStep: number;
    firstParty: FirstParty;
    setFirstParty: React.Dispatch<React.SetStateAction<FirstParty>>;
    validationError: string;
    onClearError: () => void;
    onNext: () => void;
    onPrev: () => void;
    docSettings: DocSettings;
    setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Small shared primitives
// ─────────────────────────────────────────────────────────────────────────────

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wide">
        {label}
        <span className="block mt-1.5">{children}</span>
    </label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className={`w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#7C3AED] rounded-xl py-3 px-4 text-sm text-[#0F172A] focus:outline-none transition ${props.className || ""}`}
    />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select
        {...props}
        className={`w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#7C3AED] rounded-xl py-3 px-4 text-sm text-[#0F172A] focus:outline-none transition cursor-pointer ${props.className || ""}`}
    />
);

// ─────────────────────────────────────────────────────────────────────────────
// Skill tag input
// ─────────────────────────────────────────────────────────────────────────────

function SkillTagInput({
    skills,
    onAdd,
    onRemove,
}: {
    skills: string[];
    onAdd: (skill: string) => void;
    onRemove: (index: number) => void;
}) {
    const [inputValue, setInputValue] = useState("");

    const handleAdd = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !skills.includes(trimmed)) {
            onAdd(trimmed);
            setInputValue("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Type a skill and press Enter or ","'
                    className="flex-1 bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#7C3AED] rounded-xl py-2.5 px-4 text-sm text-[#0F172A] focus:outline-none transition"
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    className="px-3.5 py-2.5 bg-[#7C3AED] text-white rounded-xl font-bold text-xs flex items-center gap-1 hover:bg-[#6D28D9] transition cursor-pointer shrink-0"
                >
                    <Plus className="w-3.5 h-3.5" /> Add
                </button>
            </div>
            {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-3 bg-violet-50/60 border border-violet-100 rounded-xl min-h-[44px]">
                    {skills.map((skill, i) => (
                        <span
                            key={i}
                            className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200"
                        >
                            {skill}
                            <button
                                type="button"
                                onClick={() => onRemove(i)}
                                className="ml-0.5 text-violet-500 hover:text-violet-900 transition cursor-pointer"
                            >
                                <X className="w-2.5 h-2.5" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Signature pad (inline, matching InternStep3 pattern)
// ─────────────────────────────────────────────────────────────────────────────

function SignatureStep({
    firstParty,
    setFirstParty,
    onClearError,
    docSettings,
    setDocSettings,
}: {
    firstParty: FirstParty;
    setFirstParty: React.Dispatch<React.SetStateAction<FirstParty>>;
    onClearError: () => void;
    docSettings: DocSettings;
    setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
}) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setFirstParty((p) => ({ ...p, signatureImg: reader.result as string }));
            onClearError();
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-5">
            <div className="space-y-1">
                <h3 className="text-[#0F172A] font-bold text-base">HR Approval &amp; Signature</h3>
                <p className="text-[#64748B] text-xs">
                    Upload the HR representative&apos;s signature to finalise the notice. This will appear
                    on the generated document.
                </p>
            </div>

            {/* HR sender info (editable) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Prepared By (Name) *">
                    <Input
                        value={docSettings.hrPreparedByName || firstParty.hrName || ""}
                        onChange={(e) => setDocSettings((p) => ({ ...p, hrPreparedByName: e.target.value }))}
                        placeholder="e.g. Juwel Khan Shanto"
                    />
                </Field>
                <Field label="Designation *">
                    <Input
                        value={docSettings.hrPreparedByDesignation || ""}
                        onChange={(e) => setDocSettings((p) => ({ ...p, hrPreparedByDesignation: e.target.value }))}
                        placeholder="e.g. Head of HR Department"
                    />
                </Field>
                <Field label="Organization">
                    <Input
                        value={docSettings.hrOrganization || firstParty.companyName || "JEVXO"}
                        onChange={(e) => setDocSettings((p) => ({ ...p, hrOrganization: e.target.value }))}
                    />
                </Field>
                <Field label="Notice Reference ID">
                    <Input value={docSettings.hrNoticeRefId || ""} readOnly className="font-mono text-xs" />
                </Field>
            </div>

            {/* Signature upload */}
            <div className="p-5 bg-[#F8FAFC] border-2 border-dashed border-[#7C3AED]/30 rounded-2xl space-y-3">
                <p className="text-xs font-bold text-[#334155] uppercase tracking-wide">
                    HR / Founder Approval Signature *
                </p>
                {firstParty.signatureImg ? (
                    <div className="flex flex-col gap-3">
                        <div className="bg-white border border-[#DBEAFE] rounded-xl p-4 flex items-center justify-center h-20">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={firstParty.signatureImg}
                                alt="Signature preview"
                                className="max-h-16 max-w-[240px] object-contain"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setFirstParty((p) => ({ ...p, signatureImg: "" }))}
                            className="text-xs text-rose-600 font-bold hover:underline cursor-pointer text-left"
                        >
                            Remove signature
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center gap-2 cursor-pointer py-6 rounded-xl border border-[#7C3AED]/20 hover:bg-violet-50/50 transition">
                        <div className="p-2.5 rounded-xl bg-[#7C3AED]/10">
                            <FileText className="w-5 h-5 text-[#7C3AED]" />
                        </div>
                        <span className="text-xs text-[#64748B] font-medium">
                            Click to upload signature image (PNG/JPG, transparent BG preferred)
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main wizard component
// ─────────────────────────────────────────────────────────────────────────────

export default function HRHiringNoticeWizard({
    activeStep,
    firstParty,
    setFirstParty,
    validationError,
    onClearError,
    onNext,
    onPrev,
    docSettings,
    setDocSettings,
}: HRHiringNoticeWizardProps) {
    const set = (patch: Partial<DocSettings>) => setDocSettings((p) => ({ ...p, ...patch }));

    const skills = docSettings.hrRequiredSkills || [];
    const addSkill = (skill: string) => set({ hrRequiredSkills: [...skills, skill] });
    const removeSkill = (index: number) => set({ hrRequiredSkills: skills.filter((_, i) => i !== index) });

    // ── Step 1: Recipient & Notice Title ──────────────────────────────────────
    const step1 = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
                <h3 className="text-[#0F172A] font-bold text-base">Recipient &amp; Notice Information</h3>
                <p className="text-[#64748B] text-xs mt-1">
                    Define who this hiring notice is addressed to and the formal title.
                </p>
            </div>

            <Field label="Recipient Role *">
                <Select
                    value={docSettings.hrRecipientRole || ""}
                    onChange={(e) => set({ hrRecipientRole: e.target.value })}
                >
                    <option value="">— Select Recipient Role —</option>
                    {RECIPIENT_ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                    <option value="__custom__">Other (type below)</option>
                </Select>
                {docSettings.hrRecipientRole === "__custom__" && (
                    <Input
                        className="mt-2"
                        placeholder="Enter custom recipient role"
                        value={docSettings.hrRecipientRole === "__custom__" ? "" : docSettings.hrRecipientRole}
                        onChange={(e) => set({ hrRecipientRole: e.target.value })}
                    />
                )}
            </Field>

            <Field label="Notice Title *">
                <Input
                    value={docSettings.hrNoticeTitle || ""}
                    onChange={(e) => set({ hrNoticeTitle: e.target.value })}
                    placeholder="e.g. UI/UX Designer Recruitment"
                />
            </Field>

            <div className="md:col-span-2">
                <Field label="Subject Line *">
                    <Input
                        value={docSettings.hrSubject || ""}
                        onChange={(e) => set({ hrSubject: e.target.value })}
                        placeholder={`e.g. Recruitment of ${docSettings.hrPositionName || "Open Position"} — ${docSettings.hrDepartment || "Department"}`}
                    />
                </Field>
            </div>

            <Field label="Notice Date *">
                <Input
                    value={docSettings.date || ""}
                    onChange={(e) => set({ date: e.target.value })}
                    placeholder="e.g. July 23, 2026"
                />
            </Field>

            <Field label="Notice Reference ID">
                <Input
                    value={docSettings.hrNoticeRefId || ""}
                    readOnly
                    className="font-mono text-xs"
                />
            </Field>
        </div>
    );

    // ── Step 2: Job Details & Skills ──────────────────────────────────────────
    const step2 = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
                <h3 className="text-[#0F172A] font-bold text-base">Recruitment &amp; Job Details</h3>
                <p className="text-[#64748B] text-xs mt-1">
                    Specify the position, department, employment terms, and required skills.
                </p>
            </div>

            <Field label="Position Name *">
                <Input
                    value={docSettings.hrPositionName || ""}
                    onChange={(e) => set({ hrPositionName: e.target.value })}
                    placeholder="e.g. UI/UX Designer"
                />
            </Field>

            <Field label="Number of Vacancies *">
                <Input
                    type="number"
                    min={1}
                    max={99}
                    value={docSettings.hrVacancies ?? 1}
                    onChange={(e) =>
                        set({ hrVacancies: Math.max(1, parseInt(e.target.value) || 1) })
                    }
                />
            </Field>

            <Field label="Department *">
                <Input
                    value={docSettings.hrDepartment || ""}
                    onChange={(e) => set({ hrDepartment: e.target.value })}
                    placeholder="e.g. Design Department"
                />
            </Field>

            <Field label="Employment Type *">
                <Select
                    value={docSettings.hrEmploymentType || ""}
                    onChange={(e) => set({ hrEmploymentType: e.target.value })}
                >
                    <option value="">— Select —</option>
                    {EMPLOYMENT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </Select>
            </Field>

            <Field label="Work Mode *">
                <Select
                    value={docSettings.hrWorkMode || ""}
                    onChange={(e) => set({ hrWorkMode: e.target.value })}
                >
                    <option value="">— Select —</option>
                    {WORK_MODES.map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </Select>
            </Field>

            <Field label="Location">
                <Input
                    value={docSettings.hrLocation || ""}
                    onChange={(e) => set({ hrLocation: e.target.value })}
                    placeholder="e.g. Rajshahi"
                />
            </Field>

            <Field label="Recruitment Start Date">
                <Input
                    value={docSettings.hrRecruitmentStartDate || ""}
                    onChange={(e) => set({ hrRecruitmentStartDate: e.target.value })}
                    placeholder="e.g. August 1, 2026"
                />
            </Field>

            <Field label="Recruitment End Date">
                <Input
                    value={docSettings.hrRecruitmentEndDate || ""}
                    onChange={(e) => set({ hrRecruitmentEndDate: e.target.value })}
                    placeholder="e.g. August 31, 2026"
                />
            </Field>

            <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wide mb-1.5">
                    Required Skills *
                </label>
                <SkillTagInput skills={skills} onAdd={addSkill} onRemove={removeSkill} />
                <p className="text-[10px] text-[#94A3B8] mt-1">
                    Press Enter or &ldquo;,&rdquo; after each skill to add it to the list.
                </p>
            </div>
        </div>
    );

    const stepContent = activeStep === 1 ? step1 : activeStep === 2 ? step2 : (
        <SignatureStep
            firstParty={firstParty}
            setFirstParty={setFirstParty}
            onClearError={onClearError}
            docSettings={docSettings}
            setDocSettings={setDocSettings}
        />
    );

    return (
        <motion.section
            key="hr-hiring-wizard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto w-full px-4 py-8 md:py-12"
        >
            {/* ── Header ── */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                        <FileText className="text-[#7C3AED] w-6 h-6" />
                        HR Hiring Notice
                    </h2>
                    <span className="text-xs bg-violet-50 border border-violet-200 px-3 py-1 rounded-full text-violet-700 font-bold">
                        Step {activeStep} of {TOTAL_STEPS}
                    </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-violet-100 h-2 rounded-full overflow-hidden flex">
                    {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-full flex-1 transition-all duration-300 ${idx + 1 <= activeStep ? "bg-[#7C3AED]" : "bg-violet-100"
                                } ${idx < TOTAL_STEPS - 1 ? "border-r border-white" : ""}`}
                        />
                    ))}
                </div>

                {/* Step pills */}
                <div className="flex gap-2 mt-4 flex-wrap">
                    {STEP_LABELS.map((label, idx) => (
                        <span
                            key={idx}
                            className={`text-[10px] font-bold px-3 py-1 rounded-full border transition ${idx + 1 === activeStep
                                    ? "bg-[#7C3AED] border-[#7C3AED] text-white"
                                    : idx + 1 < activeStep
                                        ? "bg-violet-50 border-[#7C3AED] text-[#7C3AED]"
                                        : "bg-white border-violet-200 text-[#94A3B8]"
                                }`}
                        >
                            {idx + 1 < activeStep ? (
                                <span className="inline-flex items-center gap-1">
                                    <Check className="w-2.5 h-2.5" />
                                    {label}
                                </span>
                            ) : (
                                label
                            )}
                        </span>
                    ))}
                </div>
            </div>

            {/* ── Content card ── */}
            <div className="bg-white border border-[#DBEAFE] rounded-3xl p-6 md:p-8 shadow-sm min-h-[340px]">
                {validationError && (
                    <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">
                        {validationError}
                    </div>
                )}
                {stepContent}
            </div>

            {/* ── Navigation ── */}
            <div className="flex justify-between mt-6 gap-3">
                <button
                    type="button"
                    onClick={onPrev}
                    disabled={activeStep === 1}
                    className="flex items-center gap-2 px-5 py-3 border border-[#DBEAFE] hover:border-[#7C3AED] text-[#334155] font-bold text-sm rounded-2xl transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                    <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    className="flex items-center gap-2 px-7 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm rounded-2xl transition shadow-md shadow-violet-500/20 cursor-pointer"
                >
                    {activeStep === TOTAL_STEPS ? (
                        <>
                            <Check className="w-4 h-4" /> Preview Notice
                        </>
                    ) : (
                        <>
                            Next <ChevronRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </motion.section>
    );
}
