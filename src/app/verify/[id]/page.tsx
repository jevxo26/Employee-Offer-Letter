"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Loader2,
  FileText,
  Calendar,
  Building2,
  User,
  BadgeCheck,
} from "lucide-react";
import JevxoLogo from "../../../components/JevxoLogo";

interface VerifyResult {
  valid: boolean;
  status: string;
  agreementId?: string;
  partnerId?: string;
  docType?: string;
  companyName?: string;
  partnerName?: string;
  position?: string;
  signedAt?: string | null;
  createdAt?: string | null;
  founderSigned?: boolean;
  partnerSigned?: boolean;
  message?: string;
}

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function VerifyPage() {
  const params = useParams();
  const id = params?.id as string;
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/verify/${encodeURIComponent(id)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setNotFound(true);
          setResult(data);
        } else {
          setResult(data);
        }
      })
      .catch(() => {
        setNotFound(true);
        setResult({
          valid: false,
          status: "ERROR",
          message: "Unable to reach verification service.",
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const isValid = result?.valid === true;
  const isPending = result?.status === "PENDING_PARTNER_SIGNATURE";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <header className="border-b border-[#DBEAFE] bg-white/80 backdrop-blur-md px-6 py-2 flex items-center justify-between">
        <JevxoLogo />
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
          Document Verification Portal
        </span>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-white border border-[#DBEAFE] rounded-3xl shadow-xl overflow-hidden"
        >
          {loading ? (
            <div className="p-12 flex flex-col items-center gap-4 text-[#64748B]">
              <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
              <p className="text-sm font-medium">Verifying document against JEVXO registry…</p>
            </div>
          ) : (
            <>
              <div
                className={`p-8 text-center ${
                  isValid
                    ? "bg-emerald-50 border-b border-emerald-100"
                    : notFound
                      ? "bg-rose-50 border-b border-rose-100"
                      : isPending
                        ? "bg-amber-50 border-b border-amber-100"
                        : "bg-slate-50 border-b border-slate-100"
                }`}
              >
                {isValid ? (
                  <ShieldCheck className="w-14 h-14 text-emerald-600 mx-auto mb-3" />
                ) : notFound ? (
                  <ShieldX className="w-14 h-14 text-rose-600 mx-auto mb-3" />
                ) : isPending ? (
                  <ShieldAlert className="w-14 h-14 text-amber-600 mx-auto mb-3" />
                ) : (
                  <ShieldAlert className="w-14 h-14 text-slate-500 mx-auto mb-3" />
                )}
                <h1
                  className={`text-xl font-bold ${
                    isValid
                      ? "text-emerald-800"
                      : notFound
                        ? "text-rose-800"
                        : isPending
                          ? "text-amber-800"
                          : "text-slate-800"
                  }`}
                >
                  {isValid
                    ? "Document Verified"
                    : notFound
                      ? "Document Not Found"
                      : isPending
                        ? "Pending Execution"
                        : "Verification Incomplete"}
                </h1>
                <p className="text-sm text-[#64748B] mt-2">{result?.message}</p>
              </div>

              {result && !notFound && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Registry Details
                  </div>

                  <div className="grid gap-3">
                    {[
                      { icon: FileText, label: "Agreement ID", value: result.agreementId },
                      { icon: User, label: "Partner", value: result.partnerName },
                      { icon: Building2, label: "Company", value: result.companyName },
                      { icon: FileText, label: "Position", value: result.position },
                      { icon: Calendar, label: "Signed On", value: formatDate(result.signedAt) },
                    ].map(({ icon: Icon, label, value }) => (
                      <div
                        key={label}
                        className="flex items-start gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#DBEAFE]"
                      >
                        <Icon className="w-4 h-4 text-[#2563EB] mt-0.5 shrink-0" />
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                            {label}
                          </div>
                          <div className="text-sm font-semibold text-[#0F172A]">{value || "—"}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        result.founderSigned
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      Founder {result.founderSigned ? "Signed" : "Pending"}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        result.partnerSigned
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      Partner {result.partnerSigned ? "Signed" : "Pending"}
                    </span>
                  </div>
                </div>
              )}

              <div className="px-6 pb-6">
                <p className="text-[11px] text-center text-[#94A3B8]">
                  JEVXO HR Document Engine • Official Authenticity Registry
                </p>
              </div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
