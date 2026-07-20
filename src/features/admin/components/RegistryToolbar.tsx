"use client";

import React from "react";
import { Search, ArrowUpDown } from "lucide-react";
import {
  RegistryFilters,
  SortField,
  SortDir,
  StatusFilter,
  DocTypeFilter,
} from "../hooks/useRegistryData";

interface Props {
  filters: RegistryFilters;
  onChange: (patch: Partial<RegistryFilters>) => void;
}

const STATUS_OPTS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "executed", label: "Executed" },
];

const DOCTYPE_OPTS: { value: DocTypeFilter; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "partner", label: "Partner" },
  { value: "internship", label: "Internship" },
  { value: "countrySales", label: "CSP" },
  { value: "salesAgent", label: "Sales Agent" },
];

const SORT_FIELDS: { value: SortField; label: string }[] = [
  { value: "createdAt", label: "Date" },
  { value: "agreementId", label: "Ref ID" },
];

const selectCls =
  "bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl py-2 px-3 text-xs font-semibold text-[#334155] focus:outline-none focus:border-[#2563EB] cursor-pointer";

export default function RegistryToolbar({ filters, onChange }: Props) {
  function toggleSort(field: SortField) {
    if (filters.sortField === field) {
      onChange({ sortDir: filters.sortDir === "asc" ? "desc" : "asc" });
    } else {
      onChange({ sortField: field, sortDir: "desc" });
    }
  }

  return (
    <div className="bg-white p-4 rounded-xl mb-6 shadow-lg">
      <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search by ID, name, or email…"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className="w-full pl-8 pr-3 py-2 bg-[#F8FAFC] border border-[#DBEAFE] rounded-xl text-xs font-medium text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        {/* Status filter */}
        <select
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value as StatusFilter })}
          className={selectCls}
        >
          {STATUS_OPTS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Doc type filter */}
        <select
          value={filters.docType}
          onChange={(e) => onChange({ docType: e.target.value as DocTypeFilter })}
          className={selectCls}
        >
          {DOCTYPE_OPTS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Sort controls */}
        <div className="flex gap-1">
          {SORT_FIELDS.map((f) => {
            const active = filters.sortField === f.value;
            const isAsc = active && filters.sortDir === "asc";
            return (
              <button
                key={f.value}
                onClick={() => toggleSort(f.value as SortField)}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  active
                    ? "bg-[#2563EB] text-white border-[#2563EB]"
                    : "bg-[#F8FAFC] text-[#64748B] border-[#DBEAFE] hover:border-[#2563EB]"
                }`}
              >
                <ArrowUpDown className="w-3 h-3" />
                {f.label}
                {active && (
                  <span className="text-[9px] font-black">
                    {isAsc ? "↑" : "↓"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
