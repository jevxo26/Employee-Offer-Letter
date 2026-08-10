"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { AgreementSummary } from "@/types";
import { useDataCache } from "@/context/DataCacheContext";

export type SortField = "createdAt" | "agreementId";
export type SortDir = "asc" | "desc";
export type StatusFilter = "all" | "pending" | "executed";
export type DocTypeFilter =
  | "all"
  | "partner"
  | "internship"
  | "internCertificate"
  | "countrySales"
  | "salesAgent"
  | "hrHiringNotice";

export interface RegistryFilters {
  search: string;
  status: StatusFilter;
  docType: DocTypeFilter;
  sortField: SortField;
  sortDir: SortDir;
  page: number;
}

const PAGE_SIZE = 25;

function matchesDocType(a: AgreementSummary, docType: DocTypeFilter): boolean {
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
      (a.docType?.includes("Intern") ||
        a.docType === "Intern Offerletter & ID Card") &&
      a.agreementTemplate !== "internCertificate" &&
      a.docType !== "Intern Certificate"
    );
  if (docType === "internCertificate")
    return (
      a.agreementTemplate === "internCertificate" ||
      a.docType === "Intern Certificate"
    );
  if (docType === "hrHiringNotice")
    return (
      a.agreementTemplate === "hrHiringNotice" ||
      a.docType === "HR Hiring Notice" ||
      a.docType?.includes("Hiring Notice")
    );
  if (docType === "partner")
    return (
      !a.salesAgreementType &&
      !a.docType?.includes("Intern") &&
      !a.docType?.includes("Hiring Notice") &&
      a.agreementTemplate !== "hrHiringNotice" &&
      (a.docType === "Partner Agreement & ID Card" ||
        a.agreementTemplate === "partner" ||
        a.docType === "appointment" ||
        a.docType === "both")
    );
  return true;
}

function matchesStatus(a: AgreementSummary, status: StatusFilter): boolean {
  if (status === "all") return true;
  // HR hiring notices have no signing flow — treat them as always executed
  const isHrHiring =
    a.agreementTemplate === "hrHiringNotice" ||
    a.docType === "HR Hiring Notice";
  if (status === "pending") return !isHrHiring && a.status !== "FULLY_EXECUTED";
  if (status === "executed") return isHrHiring || a.status === "FULLY_EXECUTED";
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
  const { cache, refreshAgreements, removeAgreement, isPrefetching } =
    useDataCache();

  // Local state is only used while the cache is still empty (first load race)
  const [localAgreements, setLocalAgreements] = useState<AgreementSummary[]>(
    [],
  );
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState<RegistryFilters>({
    search: "",
    status: "all",
    docType: "all",
    sortField: "createdAt",
    sortDir: "desc",
    page: 1,
  });

  // If cache already has data, use it; otherwise fall back to a local fetch
  const allAgreements: AgreementSummary[] = cache.agreements ?? localAgreements;

  const loading =
    cache.agreements === null ? isPrefetching || localLoading : false;

  // Only fetch locally when cache is empty AND prefetch hasn't started
  useEffect(() => {
    if (cache.agreements !== null || isPrefetching) return;
    setLocalLoading(true);
    setError("");
    fetch("/api/offers")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load agreements.");
        return res.json();
      })
      .then((data) => setLocalAgreements(data.agreements || []))
      .catch((e: unknown) =>
        setError((e as Error).message || "Failed to load agreements."),
      )
      .finally(() => setLocalLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reload = useCallback(async () => {
    setError("");
    try {
      await refreshAgreements();
    } catch (e: unknown) {
      setError((e as Error).message || "Failed to refresh agreements.");
    }
  }, [refreshAgreements]);

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
    reload,
    removeAgreement,
    PAGE_SIZE,
  };
}
