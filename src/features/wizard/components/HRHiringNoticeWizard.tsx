"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { FileText, ChevronLeft, ChevronRight, Check, Plus, X, Upload } from "lucide-react";
import { FirstParty, DocSettings } from "@/types";
import SignaturePad from "@/features/candidate-portal/components/SignaturePad";
import { StepHeader } from "@/shared/ui/FormPrimitives";

const STEP_LABELS = ["1. Recipient & Title", "2. Job Details", "3. HR Signature"];
const TOTAL_STEPS = 3;
const RECIPIENT_ROLES = ["CEO", "CTO", "Founder", "CMO"];
const EMPLOYMENT_TYPES = ["Internship", "Part-Time", "Full-Time", "Contract", "Freelance"];
const WORK_MODES = ["Onsite", "Remote", "Hybrid"];

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

/** Native date picker that stores ISO value internally but can display formatted */
function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <Field label={label}>
            <Input
                type="date"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className="cursor-pointer"
            />
        </Field>
    );
}

function SkillTagInput({ skills, onAdd, onRemove }: { skills: string[]; onAdd: (s: string) => void; onRemove: (i: number) => void }) {
    const [val, setVal] = useState("");
    const add = () => { const t = val.trim(); if (t && !skills.includes(t)) { onAdd(t); setVal(""); } };
    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <input type="text" value={val} onChange={(e) => setVal(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
                    placeholder='Type a skill and press Enter or ","'
                    className="flex-1 bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#7C3AED] rounded-xl py-2.5 px-4 text-sm text-[#0F172A] focus:outline-none transition" />
                <button type="button" onClick={add} className="px-3.5 py-2.5 bg-[#7C3AED] text-white rounded-xl font-bold text-xs flex items-center gap-1 hover:bg-[#6D28D9] transition cursor-pointer shrink-0">
                    <Plus className="w-3.5 h-3.5" /> Add
                </button>
            </div>
            {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-3 bg-violet-50/60 border border-violet-100 rounded-xl min-h-[44px]">
                    {skills.map((s, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200">
                            {s}
                            <button type="button" onClick={() => onRemove(i)} className="ml-0.5 text-violet-500 hover:text-violet-900 transition cursor-pointer"><X className="w-2.5 h-2.5" /></button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Signature step — matches the same pattern as InternStep3 / Step5 ─────────
function HRSignatureStep({ firstParty, setFirstParty, onClearError, docSettings, setDocSettings }: {
    firstParty: FirstParty;
    setFirstParty: React.Dispatch<React.SetStateAction<FirstParty>>;
    onClearError: () => void;
    docSettings: DocSettings;
    setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
}) {
    const set = (patch: Partial<DocSettings>) => setDocSettings((p) => ({ ...p, ...patch }));

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            onClearError();
            if (typeof reader.result === "string") {
                setFirstParty((p) => ({ ...p, signatureImg: reader.result as string }));
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <StepHeader
                title="Section 3: HR Representative Authorization"
                desc="Sign the hiring notice as the issuing HR authority. This signature will appear on the issued document."
            />

            {/* HR meta fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wide mb-1.5">Prepared By (Name) *</label>
                    <input
                        value={docSettings.hrPreparedByName || firstParty.hrName || ""}
                        onChange={(e) => set({ hrPreparedByName: e.target.value })}
                        placeholder="e.g. Juwel Khan Shanto"
                        className="w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#7C3AED] rounded-xl py-3 px-4 text-sm text-[#0F172A] focus:outline-none transition"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wide mb-1.5">Designation *</label>
                    <input
                        value={docSettings.hrPreparedByDesignation || ""}
                        onChange={(e) => set({ hrPreparedByDesignation: e.target.value })}
                        placeholder="e.g. Head of HR Department"
                        className="w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#7C3AED] rounded-xl py-3 px-4 text-sm text-[#0F172A] focus:outline-none transition"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wide mb-1.5">Organization</label>
                    <input
                        value={docSettings.hrOrganization || firstParty.companyName || "JEVXO"}
                        onChange={(e) => set({ hrOrganization: e.target.value })}
                        className="w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#7C3AED] rounded-xl py-3 px-4 text-sm text-[#0F172A] focus:outline-none transition"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wide mb-1.5">Notice Reference ID</label>
                    <input
                        value={docSettings.hrNoticeRefId || ""}
                        readOnly
                        className="w-full bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl py-3 px-4 text-sm text-[#0F172A] font-mono opacity-70"
                    />
                </div>
            </div>

            {/* Signature pad — same component as all other wizards */}
            <SignaturePad
                onSave={(dataUrl) => {
                    onClearError();
                    setFirstParty((p) => ({ ...p, signatureImg: dataUrl }));
                }}
                onClear={() => setFirstParty((p) => ({ ...p, signatureImg: "" }))}
                savedImage={firstParty.signatureImg}
            />

            {/* OR divider */}
            <div className="flex items-center gap-4 my-2 text-[#64748B] text-xs font-bold uppercase tracking-wider">
                <div className="flex-1 h-[1px] bg-[#DBEAFE]" />
                <span>Or</span>
                <div className="flex-1 h-[1px] bg-[#DBEAFE]" />
            </div>

            {/* Upload drop zone */}
            <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">
                    Option B: Upload Signature Photo File
                </label>
                <div className="relative border-2 border-dashed border-[#DBEAFE] hover:border-[#7C3AED]/50 rounded-2xl p-6 bg-[#F8FAFC]/50 hover:bg-[#F8FAFC] transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group">
                    <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <Upload className="w-8 h-8 text-[#64748B] group-hover:text-[#7C3AED] transition transform group-hover:scale-105" />
                    <p className="text-xs text-[#334155] font-semibold uppercase tracking-wider">Drag &amp; drop image file or select</p>
                    <p className="text-[10px] text-[#64748B] leading-relaxed max-w-[280px]">Accepts PNG, JPG, or SVG — clear ink signature with high contrast background.</p>
                </div>

                {/* Active signature preview card */}
                {firstParty.signatureImg && (
                    <div className="mt-4 p-4 bg-[#F8FAFC] border border-[#DBEAFE] rounded-2xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white border border-[#DBEAFE] rounded-xl shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={firstParty.signatureImg} alt="HR Signature Preview" className="w-12 h-8 object-contain bg-white rounded-md" />
                            </div>
                            <div>
                                <p className="text-xs text-[#7C3AED] font-bold flex items-center gap-1">
                                    <Check className="w-3.5 h-3.5" /> HR Signature Active
                                </p>
                                <p className="text-[10px] text-[#64748B]">Export-ready image base64 synced</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFirstParty((p) => ({ ...p, signatureImg: "" }))}
                            className="text-xs text-rose-600 hover:text-rose-500 font-semibold px-2 py-1 cursor-pointer"
                        >
                            Remove
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ── Main wizard ───────────────────────────────────────────────────────────────
export default function HRHiringNoticeWizard({ activeStep, firstParty, setFirstParty, validationError, onClearError, onNext, onPrev, docSettings, setDocSettings }: HRHiringNoticeWizardProps) {
    const set = (patch: Partial<DocSettings>) => setDocSettings((p) => ({ ...p, ...patch }));
    const skills = docSettings.hrRequiredSkills || [];
    const addSkill = (s: string) => set({ hrRequiredSkills: [...skills, s] });
    const removeSkill = (i: number) => set({ hrRequiredSkills: skills.filter((_, idx) => idx !== i) });

    const step1 = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
                <h3 className="text-[#0F172A] font-bold text-base">Recipient &amp; Notice Information</h3>
                <p className="text-[#64748B] text-xs mt-1">Define who this notice is addressed to, their contact, and the formal title.</p>
            </div>
            <Field label="Recipient Role *">
                <Select value={docSettings.hrRecipientRole || ""} onChange={(e) => set({ hrRecipientRole: e.target.value })}>
                    <option value="">— Select Recipient Role —</option>
                    {RECIPIENT_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    <option value="Other">Other</option>
                </Select>
                {docSettings.hrRecipientRole === "Other" && (
                    <Input
                        className="mt-2"
                        value={docSettings.hrRecipientRoleCustom || ""}
                        onChange={(e) => set({ hrRecipientRoleCustom: e.target.value })}
                        placeholder="e.g. Managing Director"
                        autoFocus
                    />
                )}
            </Field>
            <Field label="Recipient Name *">
                <Input value={docSettings.hrRecipientName || ""} onChange={(e) => set({ hrRecipientName: e.target.value })} placeholder="e.g. Imtiaz Ahmed Tuhin" />
            </Field>
            <Field label="Recipient Email * (notice will be sent here)">
                <Input type="email" value={docSettings.hrRecipientEmail || ""} onChange={(e) => set({ hrRecipientEmail: e.target.value })} placeholder="e.g. ceo@jevxo.com" />
            </Field>
            <Field label="Notice Reference ID">
                <Input value={docSettings.hrNoticeRefId || ""} readOnly className="font-mono text-xs opacity-70" />
            </Field>
            <Field label="Notice Title *">
                <Input value={docSettings.hrNoticeTitle || ""} onChange={(e) => set({ hrNoticeTitle: e.target.value })} placeholder="e.g. UI/UX Designer Recruitment" />
            </Field>
            <Field label="Notice Date *">
                <Input type="date" value={docSettings.date || ""} onChange={(e) => set({ date: e.target.value })} className="cursor-pointer" />
            </Field>
            <div className="md:col-span-2">
                <Field label="Subject Line *">
                    <Input value={docSettings.hrSubject || ""} onChange={(e) => set({ hrSubject: e.target.value })} placeholder={`e.g. Recruitment of ${docSettings.hrPositionName || "Open Position"}`} />
                </Field>
            </div>
        </div>
    );

    const step2 = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
                <h3 className="text-[#0F172A] font-bold text-base">Recruitment &amp; Job Details</h3>
                <p className="text-[#64748B] text-xs mt-1">Specify position, department, employment terms, and required skills.</p>
            </div>
            <Field label="Position Name *">
                <Input value={docSettings.hrPositionName || ""} onChange={(e) => set({ hrPositionName: e.target.value })} placeholder="e.g. UI/UX Designer" />
            </Field>
            <Field label="Number of Vacancies *">
                <Input type="number" min={1} max={99} value={docSettings.hrVacancies ?? 1}
                    onChange={(e) => set({ hrVacancies: Math.max(1, parseInt(e.target.value) || 1) })} />
            </Field>
            <Field label="Department *">
                <Input value={docSettings.hrDepartment || ""} onChange={(e) => set({ hrDepartment: e.target.value })} placeholder="e.g. Design Department" />
            </Field>
            <Field label="Employment Type *">
                <Select value={docSettings.hrEmploymentType || ""} onChange={(e) => set({ hrEmploymentType: e.target.value })}>
                    <option value="">— Select —</option>
                    {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </Select>
            </Field>
            <Field label="Work Mode *">
                <Select value={docSettings.hrWorkMode || ""} onChange={(e) => set({ hrWorkMode: e.target.value })}>
                    <option value="">— Select —</option>
                    {WORK_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
                </Select>
            </Field>
            <Field label="Location">
                <Input value={docSettings.hrLocation || ""} onChange={(e) => set({ hrLocation: e.target.value })} placeholder="e.g. Rajshahi" />
            </Field>
            <DateField label="Recruitment Start Date" value={docSettings.hrRecruitmentStartDate || ""} onChange={(v) => set({ hrRecruitmentStartDate: v })} />
            <DateField label="Recruitment End Date" value={docSettings.hrRecruitmentEndDate || ""} onChange={(v) => set({ hrRecruitmentEndDate: v })} />
                <div>
                <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wide mb-1.5">Required Skills *</label>
                <SkillTagInput skills={skills} onAdd={addSkill} onRemove={removeSkill} />
                <p className="text-[10px] text-[#94A3B8] mt-1">Press Enter or &ldquo;,&rdquo; after each skill.</p>
                 </div>   
                    <Field label="Experience Required">
                        <Select
                            value={docSettings.hrExperienceRequired || ""}
                            onChange={(e) => set({ hrExperienceRequired: e.target.value })}
                        >
                            <option value="">— Select Level —</option>
                            <option value="Fresher / No Experience Required">Fresher / No Experience Required</option>
                            <option value="Less than 1 year">Less than 1 year</option>
                            <option value="1+ year">1+ year</option>
                            <option value="2+ years">2+ years</option>
                            <option value="3+ years">3+ years</option>
                            <option value="4+ years">4+ years</option>
                            <option value="5+ years">5+ years</option>
                            <option value="7+ years">7+ years</option>
                            <option value="10+ years">10+ years</option>
                        </Select>
                    </Field>
        </div>
    );

    const stepContent = activeStep === 1 ? step1 : activeStep === 2 ? step2 : (
        <HRSignatureStep firstParty={firstParty} setFirstParty={setFirstParty} onClearError={onClearError} docSettings={docSettings} setDocSettings={setDocSettings} />
    );

    return (
        <motion.section key="hr-hiring-wizard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto w-full px-4 py-8 md:py-12">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                        <FileText className="text-[#7C3AED] w-6 h-6" /> HR Hiring Notice
                    </h2>
                    <span className="text-xs bg-violet-50 border border-violet-200 px-3 py-1 rounded-full text-violet-700 font-bold">Step {activeStep} of {TOTAL_STEPS}</span>
                </div>
                <div className="w-full bg-violet-100 h-2 rounded-full overflow-hidden flex">
                    {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
                        <div key={idx} className={`h-full flex-1 transition-all duration-300 ${idx + 1 <= activeStep ? "bg-[#7C3AED]" : "bg-violet-100"} ${idx < TOTAL_STEPS - 1 ? "border-r border-white" : ""}`} />
                    ))}
                </div>
                <div className="flex gap-2 mt-4 flex-wrap">
                    {STEP_LABELS.map((label, idx) => (
                        <span key={idx} className={`text-[10px] font-bold px-3 py-1 rounded-full border transition ${idx + 1 === activeStep ? "bg-[#7C3AED] border-[#7C3AED] text-white" : idx + 1 < activeStep ? "bg-violet-50 border-[#7C3AED] text-[#7C3AED]" : "bg-white border-violet-200 text-[#94A3B8]"}`}>
                            {idx + 1 < activeStep ? <span className="inline-flex items-center gap-1"><Check className="w-2.5 h-2.5" />{label}</span> : label}
                        </span>
                    ))}
                </div>
            </div>
            <div className="bg-white border border-[#DBEAFE] rounded-3xl p-6 md:p-8 shadow-sm min-h-[340px]">
                {validationError && <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">{validationError}</div>}
                {stepContent}
            </div>
            <div className="flex justify-between mt-6 gap-3">
                <button type="button" onClick={onPrev} disabled={activeStep === 1} className="flex items-center gap-2 px-5 py-3 border border-[#DBEAFE] hover:border-[#7C3AED] text-[#334155] font-bold text-sm rounded-2xl transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                    <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button type="button" onClick={onNext} className="flex items-center gap-2 px-7 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm rounded-2xl transition shadow-md shadow-violet-500/20 cursor-pointer">
                    {activeStep === TOTAL_STEPS ? <><Check className="w-4 h-4" /> Preview Notice</> : <>Next <ChevronRight className="w-4 h-4" /></>}
                </button>
            </div>
        </motion.section>
    );
}
