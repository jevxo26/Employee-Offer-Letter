import { motion } from "motion/react";
import {
  User,
  Briefcase,
  Calendar,
  ShieldCheck,
  Phone,
  MapPin,
  Check,
  Upload,
} from "lucide-react";
import SignaturePad from "./SignaturePad";

// ─── Shared field wrapper ────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#334155] uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

function IconInput({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
      <input
        className="w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#2563EB] rounded-xl py-3 pl-10 pr-4 text-sm text-[#0F172A] focus:outline-none transition"
        {...props}
      />
    </div>
  );
}

// ─── Step 1 ──────────────────────────────────────────────────────────────────
export function Step1({ secondParty, setSecondParty }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      <StepHeader
        title="Section 1: Identity & Professional Role"
        desc="Specify the official legal name, age parameters, and specific role index in JEVXO."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Second Party Full Name *">
          <IconInput
            icon={User}
            type="text"
            placeholder="e.g. Md. Golam Rabbi"
            value={secondParty.fullName}
            onChange={(e) =>
              setSecondParty((p) => ({ ...p, fullName: e.target.value }))
            }
          />
        </Field>

        <Field label="Corporate Position *">
          <IconInput
            icon={Briefcase}
            type="text"
            placeholder="e.g. Full Stack Developer (React/Next.js)"
            value={secondParty.position}
            onChange={(e) =>
              setSecondParty((p) => ({ ...p, position: e.target.value }))
            }
          />
          <p className="text-[10px] text-[#64748B] italic">
            Adjust this dynamically to match appointment parameters.
          </p>
        </Field>

        <Field label="Date Of Birth *">
          <IconInput
            icon={Calendar}
            type="date"
            value={secondParty.dob}
            onChange={(e) =>
              setSecondParty((p) => ({ ...p, dob: e.target.value }))
            }
          />
        </Field>

        <Field label="National ID (NID) Number *">
          <IconInput
            icon={ShieldCheck}
            type="text"
            placeholder="e.g. 4229023884"
            value={secondParty.nidNumber}
            onChange={(e) =>
              setSecondParty((p) => ({
                ...p,
                nidNumber: e.target.value.replace(/\D/g, ""),
              }))
            }
          />
        </Field>
      </div>
    </motion.div>
  );
}

// ─── Step 2 ──────────────────────────────────────────────────────────────────
export function Step2({ secondParty, setSecondParty }) {
  const relations = ["Father", "Mother", "Husband", "Guardian"];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      <StepHeader
        title="Section 2: Family & Guardian Context"
        desc="Indicate guardian specifications and urgent contact parameters for the agreement file."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
          <label className="text-xs font-semibold text-[#334155] uppercase tracking-wide">
            Guardian Relationship *
          </label>
          <div className="grid grid-cols-4 gap-2">
            {relations.map((rel) => (
              <button
                key={rel}
                type="button"
                onClick={() =>
                  setSecondParty((p) => ({ ...p, guardianRelation: rel }))
                }
                className={`py-3 text-xs font-bold rounded-xl transition border text-center cursor-pointer ${
                  secondParty.guardianRelation === rel
                    ? "bg-[#2563EB]/10 border-[#2563EB] text-[#2563EB]"
                    : "bg-[#F8FAFC] border-[#DBEAFE] hover:border-[#2563EB] text-[#334155]"
                }`}
              >
                {rel}
              </button>
            ))}
          </div>
        </div>

        <Field label={`${secondParty.guardianRelation}'s Full Name *`}>
          <IconInput
            icon={User}
            type="text"
            placeholder="e.g. Md. Abdul Haque"
            value={secondParty.guardianName}
            onChange={(e) =>
              setSecondParty((p) => ({ ...p, guardianName: e.target.value }))
            }
          />
        </Field>

        <Field label={`${secondParty.guardianRelation}'s Mobile No *`}>
          <IconInput
            icon={Phone}
            type="text"
            placeholder="e.g. 01786809081"
            value={secondParty.guardianMobile}
            onChange={(e) =>
              setSecondParty((p) => ({ ...p, guardianMobile: e.target.value }))
            }
          />
        </Field>
      </div>
    </motion.div>
  );
}

// ─── Step 3 ──────────────────────────────────────────────────────────────────
export function Step3({
  secondParty,
  setSecondParty,
  sameAddress,
  onAddressToggle,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      <StepHeader
        title="Section 3: Contact Details & Residence"
        desc="Verify current telephone lines and housing documentation addresses."
      />

      <Field label="Candidate Mobile Number *">
        <IconInput
          icon={Phone}
          type="text"
          placeholder="e.g. 01558984151"
          value={secondParty.mobileNumber}
          onChange={(e) =>
            setSecondParty((p) => ({
              ...p,
              mobileNumber: e.target.value.replace(/[^\d+]/g, ""),
            }))
          }
        />
      </Field>

      <Field label="Present Address *">
        <div className="relative">
          <MapPin className="absolute left-3 top-[15px] w-4 h-4 text-[#64748B]" />
          <textarea
            placeholder="e.g. Savar-DOHS, Dhaka"
            rows={2}
            value={secondParty.presentAddress}
            onChange={(e) => {
              const val = e.target.value;
              setSecondParty((p) => ({
                ...p,
                presentAddress: val,
                permanentAddress: sameAddress ? val : p.permanentAddress,
              }));
            }}
            className="w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#2563EB] rounded-xl py-3 pl-10 pr-4 text-sm text-[#0F172A] focus:outline-none transition resize-none"
          />
        </div>
      </Field>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-[#334155] uppercase tracking-wide">
            Permanent Address *
          </label>
          <button
            type="button"
            onClick={() => onAddressToggle(!sameAddress)}
            className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1.5 select-none transition cursor-pointer"
          >
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                sameAddress
                  ? "bg-[#2563EB] border-[#2563EB] text-white"
                  : "border-[#DBEAFE] bg-[#F8FAFC]"
              }`}
            >
              {sameAddress && <Check className="w-3 h-3" />}
            </div>
            Same as Present Address
          </button>
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-[15px] w-4 h-4 text-[#64748B] pointer-events-none" />
          <textarea
            placeholder="e.g. Harodanga, Faridpur, Pabna"
            rows={2}
            disabled={sameAddress}
            value={
              sameAddress
                ? secondParty.presentAddress
                : secondParty.permanentAddress
            }
            onChange={(e) =>
              setSecondParty((p) => ({
                ...p,
                permanentAddress: e.target.value,
              }))
            }
            className={`w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#2563EB] rounded-xl py-3 pl-10 pr-4 text-sm text-[#0F172A] focus:outline-none transition resize-none ${
              sameAddress ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Step 4 ──────────────────────────────────────────────────────────────────
export function Step4({ secondParty, setSecondParty, onClearError }) {
  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onClearError();
      setSecondParty((p) => ({ ...p, signatureImg: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <StepHeader
        title="Section 4: Authorizations & Signoff"
        desc="Authorize agreement documents using an official handwritten stroke asset."
      />

      <SignaturePad
        onSave={(dataUrl) => {
          onClearError();
          setSecondParty((p) => ({ ...p, signatureImg: dataUrl }));
        }}
        onClear={() => setSecondParty((p) => ({ ...p, signatureImg: "" }))}
        savedImage={secondParty.signatureImg}
      />

      <div className="flex items-center gap-4 my-2 text-[#64748B] text-xs font-bold uppercase tracking-wider">
        <div className="flex-1 h-[1px] bg-[#DBEAFE]" />
        <span>Or</span>
        <div className="flex-1 h-[1px] bg-[#DBEAFE]" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">
          Option B: Upload Signature Photo File
        </label>
        <div className="relative border-2 border-dashed border-[#DBEAFE] hover:border-[#2563EB]/50 rounded-2xl p-6 bg-[#F8FAFC]/50 hover:bg-[#F8FAFC] transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
          />
          <Upload className="w-8 h-8 text-[#64748B] group-hover:text-[#2563EB] transition transform group-hover:scale-105" />
          <p className="text-xs text-[#334155] font-semibold uppercase tracking-wider">
            Drag & drop image file or select
          </p>
          <p className="text-[10px] text-[#64748B] leading-relaxed max-w-[280px]">
            Accepts PNG, JPG, or SVG formats containing clear black or blue ink
            signatures with high contrast backgrounds.
          </p>
        </div>

        {secondParty.signatureImg && (
          <div className="mt-4 p-4 bg-[#F8FAFC] border border-[#DBEAFE] rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white border border-[#DBEAFE] rounded-xl shrink-0">
                <img
                  src={secondParty.signatureImg}
                  alt="Signature Preview"
                  className="w-12 h-8 object-contain bg-white rounded-md"
                />
              </div>
              <div>
                <p className="text-xs text-[#2563EB] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Signature Active
                </p>
                <p className="text-[10px] text-[#64748B]">
                  Export-ready image base64 synced
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setSecondParty((p) => ({ ...p, signatureImg: "" }))
              }
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

// ─── Shared ──────────────────────────────────────────────────────────────────
function StepHeader({ title, desc }) {
  return (
    <div className="border-b border-[#DBEAFE] pb-2 mb-4">
      <h3 className="text-[#0F172A] font-bold text-base">{title}</h3>
      <p className="text-[#64748B] text-xs">{desc}</p>
    </div>
  );
}
