"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { AgreementSummary } from "@/types";

export type SortField = "createdAt" | "agreementId";
export type SortDir = "asc" | "desc";
export type StatusFilter = "all" | "pending" | "executed";
export type DocTypeFilter =
  | "all"
  | "partner"
  | "internship"
  | "countrySales"
  | "salesAgent";

export interface RegistryFilters {
  search: string;
  status: StatusFilter;
  docType: DocTypeFilter;
  sortField: SortField;
  sortDir: SortDir;
  page: number;
}

const PAGE_SIZE = 25;

function matchesDocType(
  a: AgreementSummary,
  docType: DocTypeFilter,
): boolean {
  if (docType === "all") return true;
  if (docType === "countrySales")
    return (
      a.salesAgreementType === "countrySales" ||
      a.docType === "Country Sales Partner Agreement & ID Card"
    );
  if (docType === "salesAgent")
    return (
      a.salesAgreementType === "salesAgent" ||
      a.docType === "Sales Agent Agreement & ID Card"
    );
  if (docType === "internship")
    return (
      a.docType?.includes("Intern") ||
      a.docType === "Intern Offerletter & ID Card"
    );
  if (docType === "partner")
    return (
      !a.salesAgreementType &&
      !a.docType?.includes("Intern") &&
      (a.docType === "Partner Agreement & ID Card" ||
        a.agreementTemplate === "partner" ||
        a.docType === "appointment" ||
        a.docType === "both")
    );
  return true;
}

function matchesStatus(a: AgreementSummary, status: StatusFilter): boolean {
  if (status === "all") return true;
  if (status === "pending") return a.status !== "FULLY_EXECUTED";
  if (status === "executed") return a.status === "FULLY_EXECUTED";
  return true;
}

function matchesSearch(a: AgreementSummary, search: string): boolean {
  if (!search.trim()) return true;
  const q = search.toLowerCase().trim();
  return (
    a.agreementId?.toLowerCase().includes(q) ||
    a.partnerId?.toLowerCase().includes(q) ||
    a.partnerName?.toLowerCase().includes(q) ||
    a.partnerEmail?.toLowerCase().includes(q)
  );
}

export function useRegistryData() {
  const [allAgreements, setAllAgreements] = useState<AgreementSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState<RegistryFilters>({
    search: "",
    status: "all",
    docType: "all",
    sortField: "createdAt",
    sortDir: "desc",
    page: 1,
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/offers");
      if (!res.ok) throw new Error("Failed to load agreements.");
      const data = await res.json();
      setAllAgreements(data.agreements || []);
    } catch (e: unknown) {
      setError((e as Error).message || "Failed to load agreements.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(t);
  }, [load]);

  const patchFilter = useCallback(
    (patch: Partial<RegistryFilters>) =>
      setFilters((prev) => ({ ...prev, ...patch, page: patch.page ?? 1 })),
    [],
  );

  const processed = useMemo(() => {
    let list = allAgreements.filter(
      (a) =>
        matchesStatus(a, filters.status) &&
        matchesDocType(a, filters.docType) &&
        matchesSearch(a, filters.search),
    );

    list = [...list].sort((a, b) => {
      const dir = filters.sortDir === "asc" ? 1 : -1;
      if (filters.sortField === "createdAt") {
        return (
          dir *
          (new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime())
        );
      }
      // agreementId lexicographic
      return dir * (a.agreementId ?? "").localeCompare(b.agreementId ?? "");
    });

    const total = list.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const safePage = Math.min(filters.page, totalPages);
    const paginated = list.slice(
      (safePage - 1) * PAGE_SIZE,
      safePage * PAGE_SIZE,
    );

    return { list: paginated, total, totalPages, safePage };
  }, [allAgreements, filters]);

  const stats = useMemo(
    () => ({
      total: allAgreements.length,
      pending: allAgreements.filter((a) => a.status !== "FULLY_EXECUTED")
        .length,
      executed: allAgreements.filter((a) => a.status === "FULLY_EXECUTED")
        .length,
    }),
    [allAgreements],
  );

  return {
    loading,
    error,
    filters,
    patchFilter,
    processed,
    stats,
    reload: load,
    PAGE_SIZE,
  };
}
