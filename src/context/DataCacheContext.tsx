"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
} from "react";
import { AgreementSummary } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NextIds {
    agreementId: string;
    partnerId: string;
}

export interface CspOption {
    salesPartnerId: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    salesRefId: string;
    territory: string;
}

export interface InternOption {
    agreementId: string;
    internId: string;
    fullName: string;
    email: string;
    position: string;
    department: string;
    startDate: string;
    endDate: string;
    performanceGrade: string;
}

interface DataCache {
    agreements: AgreementSummary[] | null;
    nextIds: NextIds | null;
    cspList: CspOption[] | null;
    internsList: InternOption[] | null;
}

interface DataCacheContextValue {
    cache: DataCache;
    /** Call this immediately after a successful login to warm the cache. */
    prefetch: () => Promise<void>;
    /** Refresh only the agreements list (after create/delete). */
    refreshAgreements: () => Promise<void>;
    /** Instantly remove one agreement from the cache (optimistic delete). */
    removeAgreement: (agreementId: string) => void;
    /** Refresh only the interns list (after a certificate is generated). */
    refreshInternsList: () => Promise<void>;
    isPrefetching: boolean;
    prefetchError: string | null;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const DataCacheContext = createContext<DataCacheContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function DataCacheProvider({ children }: { children: React.ReactNode }) {
    const [cache, setCache] = useState<DataCache>({
        agreements: null,
        nextIds: null,
        cspList: null,
        internsList: null,
    });
    const [isPrefetching, setIsPrefetching] = useState(false);
    const [prefetchError, setPrefetchError] = useState<string | null>(null);

    // Guard against double-firing in React StrictMode / concurrent renders
    const prefetchedRef = useRef(false);

    const fetchAgreements = useCallback(async (): Promise<AgreementSummary[]> => {
        const res = await fetch("/api/offers");
        if (!res.ok) throw new Error("Failed to load agreements.");
        const data = await res.json();
        return (data.agreements as AgreementSummary[]) || [];
    }, []);

    const fetchNextIds = useCallback(async (): Promise<NextIds> => {
        const res = await fetch("/api/check-id?action=next");
        if (!res.ok) throw new Error("Failed to fetch next IDs.");
        return res.json() as Promise<NextIds>;
    }, []);

    const fetchCspList = useCallback(async (): Promise<CspOption[]> => {
        const res = await fetch("/api/offers/csp-list");
        if (!res.ok) throw new Error("Failed to fetch CSP list.");
        const data = await res.json();
        return (data.cspList as CspOption[]) || [];
    }, []);

    const fetchInternsList = useCallback(async (): Promise<InternOption[]> => {
        const res = await fetch("/api/offers/interns-list");
        if (!res.ok) throw new Error("Failed to fetch interns list.");
        const data = await res.json();
        return (data.internsList as InternOption[]) || [];
    }, []);

    /** Fire all four requests in parallel right after login. */
    const prefetch = useCallback(async () => {
        if (prefetchedRef.current) return; // already done — don't re-fetch
        prefetchedRef.current = true;

        setIsPrefetching(true);
        setPrefetchError(null);

        try {
            const [agreements, nextIds, cspList, internsList] = await Promise.all([
                fetchAgreements(),
                fetchNextIds(),
                fetchCspList(),
                fetchInternsList(),
            ]);
            setCache({ agreements, nextIds, cspList, internsList });
        } catch (err: unknown) {
            setPrefetchError((err as Error).message ?? "Prefetch failed.");
            prefetchedRef.current = false; // allow retry on next attempt
        } finally {
            setIsPrefetching(false);
        }
    }, [fetchAgreements, fetchNextIds, fetchCspList, fetchInternsList]);

    /** Instantly remove one agreement from the cache (optimistic delete). */
    const removeAgreement = useCallback((agreementId: string) => {
        setCache((prev) => ({
            ...prev,
            agreements: prev.agreements
                ? prev.agreements.filter((a) => a.agreementId !== agreementId)
                : null,
        }));
    }, []);

    /** Targeted refresh — keeps all other cache entries intact. */
    const refreshAgreements = useCallback(async () => {
        try {
            const agreements = await fetchAgreements();
            setCache((prev) => ({ ...prev, agreements }));
            // Allow prefetch to re-run if called again (e.g. after logout/login)
            prefetchedRef.current = false;
        } catch (err: unknown) {
            setPrefetchError((err as Error).message ?? "Refresh failed.");
        }
    }, [fetchAgreements]);

    /** Refresh interns list after a certificate is issued. */
    const refreshInternsList = useCallback(async () => {
        try {
            const internsList = await fetchInternsList();
            setCache((prev) => ({ ...prev, internsList }));
        } catch (err: unknown) {
            setPrefetchError((err as Error).message ?? "Interns refresh failed.");
        }
    }, [fetchInternsList]);

    return (
        <DataCacheContext.Provider
            value={{ cache, prefetch, refreshAgreements, removeAgreement, refreshInternsList, isPrefetching, prefetchError }}
        >
            {children}
        </DataCacheContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDataCache(): DataCacheContextValue {
    const ctx = useContext(DataCacheContext);
    if (!ctx) {
        throw new Error("useDataCache must be used inside <DataCacheProvider>.");
    }
    return ctx;
}
