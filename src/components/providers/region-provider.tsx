"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { sdk } from "@/lib/sdk";
import type { StoreRegion } from "@/lib/types";

const REGION_STORAGE_KEY = "mg-region-id";
const NIGERIA_COUNTRY_CODE = "NG";

type RegionContextValue = {
  region: StoreRegion | null;
  regions: StoreRegion[];
  isLoading: boolean;
  error: string | null;
  setRegion: (regionId: string) => void;
};

const RegionContext = createContext<RegionContextValue | null>(null);

type RegionProviderProps = {
  children: React.ReactNode;
};

export function RegionProvider({ children }: RegionProviderProps) {
  const [regions, setRegions] = useState<StoreRegion[]>([]);
  const [region, setRegionState] = useState<StoreRegion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    sdk.store.region
      .list({ fields: "id,name,currency_code,*countries" })
      .then(({ regions: loadedRegions }) => {
        if (cancelled) return;
        const storedId = window.localStorage.getItem(REGION_STORAGE_KEY);
        const storedRegion = loadedRegions.find((r) => r.id === storedId);
        const nigeriaRegion = loadedRegions.find((r) =>
          r.countries?.some((c) => c.iso_2 === NIGERIA_COUNTRY_CODE),
        );
        const chosen = storedRegion ?? nigeriaRegion ?? loadedRegions[0] ?? null;

        setRegions(loadedRegions);
        setRegionState(chosen);
        if (chosen) {
          window.localStorage.setItem(REGION_STORAGE_KEY, chosen.id);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setError("Could not load regions. Check the Medusa backend connection.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const setRegion = useCallback(
    (regionId: string) => {
      const next = regions.find((r) => r.id === regionId);
      if (!next) return;
      setRegionState(next);
      window.localStorage.setItem(REGION_STORAGE_KEY, next.id);
    },
    [regions],
  );

  const value = useMemo(
    () => ({ region, regions, isLoading, error, setRegion }),
    [region, regions, isLoading, error, setRegion],
  );

  return (
    <RegionContext.Provider value={value}>{children}</RegionContext.Provider>
  );
}

export function useRegion(): RegionContextValue {
  const ctx = useContext(RegionContext);
  if (!ctx) {
    throw new Error("useRegion must be used within a RegionProvider");
  }
  return ctx;
}