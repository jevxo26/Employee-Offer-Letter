"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Lock, Mail, ArrowRight, ShieldAlert } from "lucide-react";
import JevxoLogo from "./JevxoLogo";

interface LoginProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export default function Login({ onLoginSuccess, onBackToHome }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

const response = await fetch("/api/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email,
    password,
  }),
});

const data = await response.json();

if (!response.ok) {
  setError(data.message);
  return;
}

onLoginSuccess();
};

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="relative min-h-[calc(100vh-77px)] flex items-center justify-center px-4 overflow-hidden"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#DBEAFE_1px,transparent_1px),linear-gradient(to_bottom,#DBEAFE_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[250px] h-[250px] bg-[#2563EB]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-[#DBEAFE] shadow-xl rounded-3xl p-8 space-y-6 relative z-10">
        {/* Logo Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="cursor-pointer" onClick={onBackToHome}>
            <JevxoLogo />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] mt-4">CEO & Founder Login</h2>
          <p className="text-xs text-[#64748B]">
            Authenticate to generate and manage official partnership documents.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-800 flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[#334155] uppercase tracking-wide">
              Founder Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <input
                type="email"
                placeholder="e.g. founder@jevxo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#2563EB] rounded-xl py-3 pl-10 pr-4 text-sm text-[#0F172A] focus:outline-none transition font-medium"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[#334155] uppercase tracking-wide">
              Security Token / Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-[#F8FAFC] border border-[#DBEAFE] focus:border-[#2563EB] rounded-xl py-3 pl-10 pr-4 text-sm text-[#0F172A] focus:outline-none transition font-medium"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#2563EB]/70 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            {isSubmitting ? "Authenticating..." : "Login Portal"}
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={onBackToHome}
            className="text-xs text-[#64748B] hover:text-[#0F172A] font-semibold transition cursor-pointer"
          >
            Cancel and Return
          </button>
        </div>
      </div>
    </motion.section>
  );
}
