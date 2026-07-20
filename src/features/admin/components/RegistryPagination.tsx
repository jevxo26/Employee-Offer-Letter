"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPage: (p: number) => void;
}

export default function RegistryPagination({
  page,
  totalPages,
  total,
  pageSize,
  onPage,
}: Props) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Build visible page numbers with ellipsis
  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    )
      pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  const btnCls = (active: boolean, disabled = false) =>
    `h-8 min-w-[32px] px-2 rounded-lg text-xs font-bold border transition flex items-center justify-center
    ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
    ${active ? "bg-[#2563EB] text-white border-[#2563EB]" : "bg-white border-[#DBEAFE] text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB]"}`;

  return (
    <div className="bg-white p-4 rounded-xl my-6 shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[#64748B] font-medium">
          Showing {from}–{to} of {total}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPage(page - 1)}
            disabled={page === 1}
            className={btnCls(false, page === 1)}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          {pages.map((p, i) =>
            p === "…" ? (
              <span key={`ellipsis-${i}`} className="text-xs text-[#94A3B8] px-1">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPage(p as number)}
                className={btnCls(page === p)}
              >
                {p}
              </button>
            ),
          )}
          <button
            onClick={() => onPage(page + 1)}
            disabled={page === totalPages}
            className={btnCls(false, page === totalPages)}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
