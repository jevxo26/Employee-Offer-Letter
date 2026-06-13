"use client";

import React from "react";
import { Settings, User, BookOpen, Download, RefreshCw, Mail } from "lucide-react";
import { FirstParty, SecondParty, DocSettings } from "../types";

// ─── Small reusable input primitives ─────────────────────────────────────────
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function TextInput({ label, value, onChange, ...rest }: TextInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold text-[#334155] uppercase tracking-wide">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full bg-[#F1F5F9] border border-[#DBEAFE] rounded-lg py-2 px-3 text-xs text-[#0F172A] font-medium focus:outline-none focus:border-[#2563EB]"
        {...rest}
      />
    </div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

function TextArea({ label, value, onChange, rows = 2, ...rest }: TextAreaProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold text-[#334155] uppercase tracking-wide">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        className="w-full bg-[#F1F5F9] border border-[#DBEAFE] rounded-lg py-2 px-3 text-xs text-[#0F172A] font-medium focus:outline-none focus:border-[#2563EB]"
        {...rest}
      />
    </div>
  );
}

interface SliderFieldProps {
  label: string;
  value: number;
  suffix?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  hint?: string;
}

function SliderField({ label, value, suffix = "", onChange, min, max, hint }: SliderFieldProps) {
  const numVal = Number(value) || 0;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label className="text-[11px] font-bold text-[#334155] uppercase tracking-wider">{label}</label>
        <span className="text-xs text-[#2563EB] font-extrabold">{numVal}{suffix}</span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          value={numVal}
          onChange={onChange}
          className="flex-1 accent-[#2563EB] cursor-pointer"
        />
        <input
          type="number"
          min={min}
          max={max}
          value={numVal}
          onChange={onChange}
          className="w-[60px] text-center bg-[#F1F5F9] border border-[#DBEAFE] rounded-lg py-1 text-[#0F172A] text-xs font-bold"
        />
      </div>
      {hint && <p className="text-[10px] text-[#64748B] italic">{hint}</p>}
    </div>
  );
}

// ─── Tab content panels ───────────────────────────────────────────────────────
interface SettingsTabProps {
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
}

function SettingsTab({ docSettings, setDocSettings }: SettingsTabProps) {
  const numericSetter = (key: keyof DocSettings, min: number, max: number) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) =>
    setDocSettings((p) => ({
      ...p,
      [key]: Math.min(max, Math.max(min, parseInt(e.target.value) || min)),
    }));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-[#334155] uppercase tracking-wider">Signing Date</label>
        <input
          type="text"
          placeholder="e.g. June 10, 2026"
          value={docSettings.date}
          onChange={(e) => setDocSettings((p) => ({ ...p, date: e.target.value }))}
          className="w-full bg-[#F1F5F9] border border-[#DBEAFE] focus:border-[#2563EB] rounded-xl py-2.5 px-3 text-xs md:text-sm text-[#0F172A] focus:outline-none transition"
        />
      </div>

      <SliderField
        label="Equity Share Allocation"
        value={docSettings.equityShare}
        suffix="%"
        min={1}
        max={100}
        onChange={numericSetter("equityShare", 1, 100)}
        hint='Preformatted clause automatically updates to "seven (7) percent".'
      />

      <SliderField
        label="Minimum Probation Period"
        value={docSettings.minimumServicePeriod}
        suffix=" Months"
        min={1}
        max={24}
        onChange={numericSetter("minimumServicePeriod", 1, 24)}
        hint='Generates standard phrase string like "four (4) months" recursively.'
      />

      <SliderField
        label="Notice Period Days"
        value={docSettings.noticePeriod}
        suffix=" Days"
        min={1}
        max={90}
        onChange={numericSetter("noticePeriod", 1, 90)}
      />
    </div>
  );
}

interface SecondPartyTabProps {
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
}

function SecondPartyTab({ secondParty, setSecondParty }: SecondPartyTabProps) {
  const set = (key: keyof SecondParty) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setSecondParty((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div className="space-y-4">
      <TextInput label="Candidate Full Name" value={secondParty.fullName} onChange={set("fullName")} />
      <TextInput label="Corporate Position Role Key" value={secondParty.position || ""} onChange={set("position")} />
      <TextInput label="National ID (NID)" value={secondParty.nidNumber} onChange={set("nidNumber")} />
      <TextInput label="Contact Telephone Line" value={secondParty.mobileNumber} onChange={set("mobileNumber")} />

      <div className="grid grid-cols-2 gap-2">
        <TextInput label="Guardian Name" value={secondParty.guardianName} onChange={set("guardianName")} />
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-[#334155] uppercase tracking-wide">Relation</label>
          <select
            value={secondParty.guardianRelation}
            onChange={set("guardianRelation")}
            className="w-full bg-[#F1F5F9] border border-[#DBEAFE] rounded-lg py-2 px-2 text-xs text-[#0F172A] font-semibold focus:outline-none focus:border-[#2563EB]"
          >
            {["Father", "Mother", "Husband", "Guardian"].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <TextArea label="Present Address" value={secondParty.presentAddress} onChange={set("presentAddress")} />
      <TextArea label="Permanent Address" value={secondParty.permanentAddress} onChange={set("permanentAddress")} />

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#334155] uppercase tracking-wide">Blood Group</label>
        <select
          value={secondParty.bloodGroup || "A+"}
          onChange={set("bloodGroup")}
          className="w-full bg-[#F1F5F9] border border-[#DBEAFE] rounded-lg py-2 px-2 text-xs text-[#0F172A] font-semibold focus:outline-none focus:border-[#2563EB]"
        >
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

interface FirstPartyTabProps {
  firstParty: FirstParty;
  setFirstParty: React.Dispatch<React.SetStateAction<FirstParty>>;
}

function FirstPartyTab({ firstParty, setFirstParty }: FirstPartyTabProps) {
  const set = (key: keyof FirstParty) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFirstParty((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div className="space-y-4">
      <TextInput label="Company Name" value={firstParty.companyName} onChange={set("companyName")} />
      <TextInput label="Represented By (Founder)" value={firstParty.representedBy} onChange={set("representedBy")} />
      <TextInput label="Company Tel Line" value={firstParty.mobileNumber} onChange={set("mobileNumber")} />
      <TextArea label="Base Office Address" value={firstParty.currentAddress} onChange={set("currentAddress")} />
      <TextInput label="Company Website Domain" value={firstParty.website} onChange={set("website")} />
    </div>
  );
}

// ─── Main sidebar ─────────────────────────────────────────────────────────────
const TABS = [
  { id: "settings", label: "Agreement Cl.", icon: Settings },
  { id: "secondParty", label: "2nd Party (You)", icon: User },
  { id: "firstParty", label: "1st Party (Jevxo)", icon: BookOpen },
];

interface WorkspaceSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  docSettings: DocSettings;
  setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>;
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
  firstParty: FirstParty;
  setFirstParty: React.Dispatch<React.SetStateAction<FirstParty>>;
  isExporting: boolean;
  onExport: () => void;
  isDemo: boolean;
  onSendOffer: () => void;
}

export default function WorkspaceSidebar({
  activeTab,
  setActiveTab,
  docSettings,
  setDocSettings,
  secondParty,
  setSecondParty,
  firstParty,
  setFirstParty,
  isExporting,
  onExport,
  isDemo,
  onSendOffer,
}: WorkspaceSidebarProps) {
  return (
    <div className="w-full xl:w-[420px] bg-[#F8FAFC] border-r border-[#DBEAFE] flex flex-col justify-between overflow-y-auto shrink-0">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <span className="text-[10px] bg-[#EFF6FF] border border-[#DBEAFE]/50 text-[#1E3A8A] font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block">
            Agreement ready!
          </span>
          <h2 className="text-xl font-bold text-[#0F172A]">Document Workspace</h2>
          <p className="text-[#64748B] text-xs">Fine-tune standard clause parameters with real-time browser preview compilation.</p>
        </div>

        {/* Tab headers */}
        <div className="flex border-b border-[#DBEAFE]">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 pb-3 text-xs font-bold tracking-wide border-b-2 transition flex flex-col md:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === id
                  ? "border-[#2563EB] text-[#2563EB]"
                  : "border-transparent text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="space-y-5">
          {activeTab === "settings" && (
            <SettingsTab docSettings={docSettings} setDocSettings={setDocSettings} />
          )}
          {activeTab === "secondParty" && (
            <SecondPartyTab secondParty={secondParty} setSecondParty={setSecondParty} />
          )}
          {activeTab === "firstParty" && (
            <FirstPartyTab firstParty={firstParty} setFirstParty={setFirstParty} />
          )}
        </div>
      </div>

      {/* Export footer */}
      <div className="p-6 bg-[#F8FAFC] border-t border-[#DBEAFE] space-y-3 shrink-0">
        {isDemo ? (
          <div className="w-full py-4 px-6 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-2xl text-center">
            PDF Export Disabled in Demo Mode
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <button
              onClick={onSendOffer}
              className="w-full py-3.5 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] font-bold text-white text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-md shadow-[#2563EB]/10 hover:shadow-[#2563EB]/25 cursor-pointer"
            >
              <Mail className="w-4 h-4" /> Send Offer to Candidate
            </button>
            <button
              onClick={onExport}
              disabled={isExporting}
              className="w-full py-2.5 px-6 border border-[#DBEAFE] hover:border-[#2563EB] hover:bg-[#EFF6FF] text-[#2563EB] disabled:bg-[#64748B]/40 disabled:cursor-not-allowed font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {isExporting ? (
                <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Generating Draft...</>
              ) : (
                <><Download className="w-3.5 h-3.5" /> Download CEO-Signed Draft</>
              )}
            </button>
          </div>
        )}
        <div className="flex justify-between text-[11px] text-[#64748B] px-1 font-semibold">
          <span>A4 dimensions output</span>
          <span>{isDemo ? "1 page" : "2 pages"} automatic layout</span>
        </div>
      </div>
    </div>
  );
}
