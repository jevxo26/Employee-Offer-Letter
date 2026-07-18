"use client";

import React from "react";

// ─── Field wrapper ─────────────────────────────────────────────────────────────
export interface FieldProps {
  label: string;
  children: React.ReactNode;
}

export function Field({ label, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#334155] uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Icon Input ────────────────────────────────────────────────────────────────
export interface IconInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ComponentType<{ className?: string }>;
}

export function IconInput({ icon: Icon, ...props }: IconInputProps) {
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

// ─── Text Input ────────────────────────────────────────────────────────────────
export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function TextInput({ label, value, onChange, ...rest }: TextInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold text-[#334155] uppercase tracking-wide">
        {label}
      </label>
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

// ─── Text Area ─────────────────────────────────────────────────────────────────
export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 2,
  ...rest
}: TextAreaProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold text-[#334155] uppercase tracking-wide">
        {label}
      </label>
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

// ─── Step Header ───────────────────────────────────────────────────────────────
export interface StepHeaderProps {
  title: string;
  desc: string;
}

export function StepHeader({ title, desc }: StepHeaderProps) {
  return (
    <div className="border-b border-[#DBEAFE] pb-2 mb-4">
      <h3 className="text-[#0F172A] font-bold text-base">{title}</h3>
      <p className="text-[#64748B] text-xs">{desc}</p>
    </div>
  );
}

// ─── Slider Field ──────────────────────────────────────────────────────────────
export interface SliderFieldProps {
  label: string;
  value: number;
  suffix?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  hint?: string;
}

export function SliderField({
  label,
  value,
  suffix = "",
  onChange,
  min,
  max,
  hint,
}: SliderFieldProps) {
  const numVal = Number(value) || 0;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label className="text-[11px] font-bold text-[#334155] uppercase tracking-wider">
          {label}
        </label>
        <span className="text-xs text-[#2563EB] font-extrabold">
          {numVal}
          {suffix}
        </span>
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
