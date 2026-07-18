"use client";

import React from "react";
import { FirstParty, SecondParty, DocSettings, SalesAgreementType } from "@/types";
import { TextInput, TextArea } from "@/shared/ui/FormPrimitives";

interface FirstPartyTabProps {
  firstParty: FirstParty;
  setFirstParty: React.Dispatch<React.SetStateAction<FirstParty>>;
}

export function FirstPartyTab({ firstParty, setFirstParty }: FirstPartyTabProps) {
  const set =
    (key: keyof FirstParty) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFirstParty((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div className="space-y-4">
      <TextInput
        label="Company Name"
        value={firstParty.companyName}
        onChange={set("companyName")}
      />
      <TextInput
        label="Represented By (Founder)"
        value={firstParty.representedBy}
        onChange={set("representedBy")}
      />
      <TextInput
        label="Company Tel Line"
        value={firstParty.mobileNumber}
        onChange={set("mobileNumber")}
      />
      <TextArea
        label="Base Office Address"
        value={firstParty.currentAddress}
        onChange={set("currentAddress")}
      />
      <TextInput
        label="Company Website Domain"
        value={firstParty.website}
        onChange={set("website")}
      />
    </div>
  );
}

interface SecondPartyTabProps {
  secondParty: SecondParty;
  setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>;
}

export function SecondPartyTab({ secondParty, setSecondParty }: SecondPartyTabProps) {
  const set =
    (key: keyof SecondParty) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setSecondParty((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div className="space-y-4">
      <TextInput
        label="Candidate Full Name"
        value={secondParty.fullName}
        onChange={set("fullName")}
      />
      <TextInput
        label="Corporate Position Role Key"
        value={secondParty.position || ""}
        onChange={set("position")}
      />
      <TextInput
        label="National ID (NID)"
        value={secondParty.nidNumber}
        onChange={set("nidNumber")}
      />
      <TextInput
        label="Contact Telephone Line"
        value={secondParty.mobileNumber}
        onChange={set("mobileNumber")}
      />

      <div className="grid grid-cols-2 gap-2">
        <TextInput
          label="Guardian Name"
          value={secondParty.guardianName}
          onChange={set("guardianName")}
        />
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-[#334155] uppercase tracking-wide">
            Relation
          </label>
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

      <TextArea
        label="Present Address"
        value={secondParty.presentAddress}
        onChange={set("presentAddress")}
      />
      <TextArea
        label="Permanent Address"
        value={secondParty.permanentAddress}
        onChange={set("permanentAddress")}
      />

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#334155] uppercase tracking-wide">
          Blood Group
        </label>
        <select
          value={secondParty.bloodGroup || "Select"}
          onChange={set("bloodGroup")}
          className="w-full bg-[#F1F5F9] border border-[#DBEAFE] rounded-lg py-2 px-2 text-xs text-[#0F172A] font-semibold focus:outline-none focus:border-[#2563EB]"
        >
          {["Select", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function SalesPartyTab({ secondParty, setSecondParty, docSettings, setDocSettings, salesAgreementType }: {
  secondParty: SecondParty; setSecondParty: React.Dispatch<React.SetStateAction<SecondParty>>; docSettings: DocSettings; setDocSettings: React.Dispatch<React.SetStateAction<DocSettings>>; salesAgreementType: SalesAgreementType;
}) {
  const isCSP = salesAgreementType === "countrySales";
  const partner = docSettings.salesPartner || { fullName: "", email: "", phone: "", address: "", partnerId: "" };
  const setAgent = (key: keyof SecondParty) => (e: React.ChangeEvent<HTMLInputElement>) => setSecondParty((p) => ({ ...p, [key]: e.target.value }));
  const setPartner = (key: keyof typeof partner) => (e: React.ChangeEvent<HTMLInputElement>) => setDocSettings((p) => ({ ...p, salesPartner: { ...(p.salesPartner || partner), [key]: e.target.value } }));
  return (
    <div className="space-y-4">
      {!isCSP && (
        <>
          <p className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wide">Country Sales Partner</p>
          <TextInput label="Partner Full Name" value={partner.fullName} onChange={setPartner("fullName")} />
          <TextInput label="Partner Email" value={partner.email} onChange={setPartner("email")} />
          <TextInput label="Partner Phone" value={partner.phone} onChange={setPartner("phone")} />
          <TextInput label="Partner Agreement Reference" value={docSettings.partnerAgreementRef || ""} onChange={(e) => setDocSettings((p) => ({ ...p, partnerAgreementRef: e.target.value }))} />
          <div className="border-t border-[#DBEAFE]" />
        </>
      )}
      <p className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wide">{isCSP ? "Country Sales Partner" : "Sales Agent"}</p>
      <TextInput label="Full Name" value={secondParty.fullName} onChange={setAgent("fullName")} />
      <TextInput label="Email" value={secondParty.email} onChange={setAgent("email")} />
      <TextInput label="Phone" value={secondParty.mobileNumber} onChange={setAgent("mobileNumber")} />
      <TextInput label={isCSP ? "Partner ID" : "Sales Agent ID"} value={secondParty.salesPartnerId || ""} onChange={setAgent("salesPartnerId")} />
      <TextArea label="Address" value={secondParty.presentAddress} onChange={(e) => setSecondParty((p) => ({ ...p, presentAddress: e.target.value, permanentAddress: e.target.value }))} />
    </div>
  );
}
