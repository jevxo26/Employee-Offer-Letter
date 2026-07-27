"use client";
import React from "react";
import { FirstParty, DocSettings } from "@/types";
import { A4_WIDTH } from "../../components/A4DocumentScaler";
import { buildVerifyUrl } from "@/lib/verifyUrl";
import DocumentLayout from "./DocumentLayout";
import DocumentHeader from "./DocumentHeader";
import DocumentMetadata from "./DocumentMetadata";
import DocumentFooter from "./DocumentFooter";
import Image from "next/image";

interface HRHiringNoticeDocumentProps {
    firstParty: FirstParty;
    settings: DocSettings;
    previewRefs?: React.RefObject<HTMLDivElement | null>[];
}

function V({ children }: { children: React.ReactNode }) {
    return <span className="text-violet-700 font-bold">{children}</span>;
}

function SkillBadge({ skill }: { skill: string }) {
    return (
        <span className="inline-block text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200">
            {skill}
        </span>
    );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <tr className="even:bg-slate-50/60">
            <td className="border border-slate-200 px-3 py-1.5 font-semibold text-slate-500 text-[11.5px] w-[38%]">{label}</td>
            <td className="border border-slate-200 px-3 py-1.5 text-slate-800 text-[11.5px] font-medium">{value || "—"}</td>
        </tr>
    );
}

/** Format ISO date (YYYY-MM-DD) to "July 23, 2026" */
function fmtDate(val: string): string {
    if (!val) return "—";
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
        try { return new Date(val + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }); }
        catch { return val; }
    }
    return val;
}

export default function HRHiringNoticeDocument({ firstParty, settings, previewRefs = [] }: HRHiringNoticeDocumentProps) {
    const d = {
        refId: settings.hrNoticeRefId || "JVX-HR-REF-26-001",
        date: fmtDate(settings.date) || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        recipientRole: (settings.hrRecipientRole === "Other" ? settings.hrRecipientRoleCustom : settings.hrRecipientRole) || "CEO",
        recipientName: settings.hrRecipientName || "",
        noticeTitle: settings.hrNoticeTitle || "Recruitment Notice",
        subject: settings.hrSubject || `Recruitment of ${settings.hrPositionName || "Open Position"}`,
        positionName: settings.hrPositionName || "Open Position",
        vacancies: settings.hrVacancies ?? 1,
        department: settings.hrDepartment || "General Department",
        employmentType: settings.hrEmploymentType || "Full-Time",
        workMode: settings.hrWorkMode || "Onsite",
        location: settings.hrLocation || "Rajshahi",
        startDate: fmtDate(settings.hrRecruitmentStartDate || ""),
        endDate: fmtDate(settings.hrRecruitmentEndDate || ""),
        skills: (settings.hrRequiredSkills?.length) ? settings.hrRequiredSkills : ["Communication", "Teamwork", "Problem Solving"],
        experienceRequired: settings.hrExperienceRequired || "",
        experienceNote: settings.hrExperienceNote || "",
        preparedByName: settings.hrPreparedByName || firstParty.hrName || "Juwel Khan Shanto",
        preparedByDesignation: settings.hrPreparedByDesignation || "Head of HR Department",
        organization: settings.hrOrganization || firstParty.companyName || "JEVXO",
        hrSig: firstParty.signatureImg || "",
        companyEmail: firstParty.email || "info@jevxo.com",
        companyWebsite: firstParty.website || "www.jevxo.com",
        companyAddress: firstParty.currentAddress || "9th floor, Silicon Tower, Hi-tech park, Rajshahi, Bangladesh",
    };

    const verifyUrl = buildVerifyUrl(d.refId);
    const recruitmentPeriod = (d.startDate !== "—" && d.endDate !== "—")
        ? `${d.startDate} — ${d.endDate}`
        : d.startDate !== "—" ? `From ${d.startDate}` : "To be announced";

    const toLine = d.recipientName ? `${d.recipientRole} — ${d.recipientName}` : d.recipientRole;

    return (
        <div id="hr-hiring-notice-container" className="flex flex-col select-text" style={{ width: A4_WIDTH }}>
            <DocumentLayout pageNum={1} refProp={previewRefs[0]}>
                <div className="z-10 flex flex-col px-10 pt-7 pb-4 gap-2.5">

                    {/* Header */}
                    <header className="flex justify-between items-center border-b-2 border-slate-900 pb-2 mb-0.5">
                        <DocumentHeader />
                        <DocumentMetadata
                            refId={d.refId}
                            idLabel="Type"
                            idValue="HR Recruitment Notice"
                            verifyUrl={verifyUrl}
                        />
                    </header>

                    {/* Document title */}
                    <div className="text-center mt-0.5 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600 bg-violet-50 border border-violet-200 px-3 py-0.5 rounded-full">
                            Internal HR Circular
                        </span>
                        <h1 className="font-extrabold text-[20px] uppercase tracking-wide text-slate-900 leading-wide mt-2 font-sans">
                            {d.noticeTitle}
                        </h1>
                        <div className="mt-1 mx-auto w-24 h-1 rounded bg-gradient-to-r from-violet-500 to-indigo-400" />
                    </div>

                    {/* To / Subject / Date */}
                    <div className="bg-slate-50/60 border border-slate-200 rounded-xl px-5 py-2.5 text-[12.5px] font-sans space-y-1">
                        <div className="grid grid-cols-[5rem_1fr]">
                            <span className="text-slate-400 font-semibold">Date:</span>
                            <span className="text-slate-700 font-medium">{d.date}</span>
                        </div>
                        <div className="grid grid-cols-[5rem_1fr]">
                            <span className="text-slate-400 font-semibold">To:</span>
                            <span className="text-slate-900 font-bold">{toLine}, {d.organization}</span>
                        </div>
                        <div className="grid grid-cols-[5rem_1fr]">
                            <span className="text-slate-400 font-semibold">Subject:</span>
                            <span className="text-slate-900 font-bold">{d.subject}</span>
                        </div>
                        <div className="grid grid-cols-[5rem_1fr]">
                            <span className="text-slate-400 font-semibold">From:</span>
                            <span className="text-slate-700 font-medium">{d.preparedByName}, {d.preparedByDesignation}</span>
                        </div>
                    </div>

                    {/* Salutation & body */}
                    <p className="text-[12.5px] text-slate-600 leading-relaxed font-sans">
                        Dear <strong className="text-slate-900">{d.recipientName || d.recipientRole}</strong>,
                    </p>
                    <div className="space-y-2.5">
                        <p className="text-[12.5px] text-slate-600 leading-relaxed font-sans text-justify">
                            I am writing to formally inform you that the <strong className="text-slate-800">{d.department}</strong> at{" "}
                            <strong className="text-slate-800">{d.organization}</strong> is initiating a recruitment drive for the position of{" "}
                            <V>{d.positionName}</V>. To meet operational demands and support project commitments, we intend to onboard{" "}
                            <V>{d.vacancies} {d.vacancies === 1 ? "qualified candidate" : "qualified candidates"}</V>
                            {d.experienceRequired ? (
                                <> with <V>{d.experienceRequired}</V>{d.experienceNote ? <> of experience <V>{d.experienceNote}</V></> : <> of relevant experience</>}</>
                            ) : null}.
                        </p>

                        <p className="text-[12.5px] text-slate-600 leading-relaxed font-sans text-justify">
                            The complete recruitment and evaluation process is scheduled to run from <V>{d.startDate !== "—" ? d.startDate : "the approved date"}</V> through{" "}
                            <V>{d.endDate !== "—" ? d.endDate : "official closure"}</V>. Kindly review the comprehensive recruitment specifications, position details, and candidate requirements outlined in the table below.
                        </p>
                    </div>
                    {/* Recruitment details table */}
                    <div className="mt-0.5">
                        <h4 className="font-bold text-[12.5px] uppercase tracking-wider text-violet-700 mb-1.5 font-sans flex items-center gap-1.5">
                            <span className="bg-violet-100 text-violet-800 text-[9px] font-mono px-1.5 py-0.5 rounded border border-violet-200">01</span>
                            Recruitment Details
                        </h4>
                        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-[11.5px] border-collapse font-sans">
                                <thead>
                                    <tr className="bg-violet-700">
                                        <th className="px-3 py-1.5 text-left font-bold text-white text-[10.5px] uppercase tracking-wide w-[38%]">Field</th>
                                        <th className="px-3 py-1.5 text-left font-bold text-white text-[10.5px] uppercase tracking-wide">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <DetailRow label="Position" value={<V>{d.positionName}</V>} />
                                    <DetailRow label="Number of Vacancies" value={<V>{d.vacancies}</V>} />
                                    <DetailRow label="Department" value={d.department} />
                                    <DetailRow label="Employment Type" value={d.employmentType} />
                                    <DetailRow label="Work Mode" value={d.workMode} />
                                    <DetailRow label="Location" value={d.location} />
                                    <DetailRow label="Recruitment Period" value={<V>{recruitmentPeriod}</V>} />
                                    {d.experienceRequired && (
                                        <DetailRow
                                            label="Experience Required"
                                            value={
                                                <V>
                                                    {d.experienceRequired}
                                                    {d.experienceNote ? ` — ${d.experienceNote}` : ""}
                                                </V>
                                            }
                                        />
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Required skills */}
                    <div className="mt-0.5">
                        <h4 className="font-bold text-[12.5px] uppercase tracking-wider text-violet-700 mb-1.5 font-sans flex items-center gap-1.5">
                            <span className="bg-violet-100 text-violet-800 text-[9px] font-mono px-1.5 py-0.5 rounded border border-violet-200">03</span>
                            Required Skills &amp; Competencies
                        </h4>
                        <div className="bg-violet-50/50 border border-violet-100 rounded-xl p-2.5 flex flex-wrap gap-1.5">
                            {d.skills.map((skill, i) => <SkillBadge key={i} skill={skill} />)}
                        </div>
                    </div>

                    {/* HR Signature only — no approval block */}
                    <div className="mt-8 pt-1 border-t border-slate-200">
                        <p className="text-[12px] text-slate-600 font-sans mb-1.5">Respectfully submitted,</p>
                        <div className="flex items-end gap-3">
                            <div>
                                <div className="h-10 mb-1 flex items-end">
                                    {d.hrSig ? (
                                        <Image src={d.hrSig} alt="HR Signature" width={140} height={44}
                                            className="max-h-10 max-w-[140px] object-contain object-left opacity-95 block" />
                                    ) : (
                                        <div className="text-amber-600 font-bold text-[8px] bg-amber-50 px-2 py-0.5 border border-amber-200 rounded uppercase animate-pulse">
                                            Awaiting HR Signature *
                                        </div>
                                    )}
                                </div>
                                <div className="border-t border-slate-400 pt-0.5 w-40" />
                                <p className="text-[12.5px] font-bold text-slate-900 mt-0.5">{d.preparedByName}</p>
                                <p className="text-[11px] text-slate-500">{d.preparedByDesignation}</p>
                                <p className="text-[11px] text-slate-500">{d.organization}</p>
                                {d.hrSig && <p className="text-[10px] text-slate-400 mt-0.5">Date: {d.date}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                <DocumentFooter email={d.companyEmail} website={d.companyWebsite} address={d.companyAddress} pageNum={1} totalPages={1} />
            </DocumentLayout>
        </div>
    );
}
