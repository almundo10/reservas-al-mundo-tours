import { useState, useEffect } from "react";
import type { AgencyConfig } from "@shared/schema";

const STORAGE_KEY = "almundo_agency_config";

const defaultConfig: AgencyConfig = {
  nombre: "AL Mundo Tours",
  direccion: "Cra. 5 #10-41, Oficina 501",
  ciudad: "Bogotá, Colombia",
  email: "contacto@almundotours.com",
  telefono: "+57 601 234 5678",
  logoUrl: "/attached_assets/logo_1759463703691.png",
};

export function useAgencyConfig() {
  const [config, setConfig] = useState<AgencyConfig>(defaultConfig);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConfig({ ...defaultConfig, ...parsed });
      } catch (error) {
        console.error("Error loading agency config:", error);
      }
    }
  }, []);

  const updateConfig = (newConfig: Partial<AgencyConfig>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    config,
    updateConfig,
    resetConfig,
  };
}
