import { useState, useEffect } from "react";
import type { SavedReservation, InsertSavedReservation } from "@shared/schema";

const STORAGE_KEY = "almundo_saved_reservations";

export function useSavedReservations() {
  const [reservations, setReservations] = useState<SavedReservation[]>([]);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setReservations(parsed);
      } catch (error) {
        console.error("Error loading saved reservations:", error);
        setStorageError("Error al cargar las reservas guardadas");
      }
    }
    setLoaded(true);
  }, []);

  const saveToStorage = (newReservations: SavedReservation[]): { success: boolean; error?: string } => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newReservations));
      setReservations(newReservations);
      setStorageError(null);
      return { success: true };
    } catch (error) {
      let errorMessage: string;
      if (error instanceof Error && error.name === "QuotaExceededError") {
        errorMessage = "No hay suficiente espacio de almacenamiento. Por favor elimina algunas reservas guardadas.";
      } else {
        errorMessage = "Error al guardar la reserva. Por favor intenta nuevamente.";
      }
      setStorageError(errorMessage);
      console.error("Error saving to localStorage:", error);
      return { success: false, error: errorMessage };
    }
  };

  const addReservation = (reservationData: InsertSavedReservation): { success: boolean; id?: string; reservation?: SavedReservation; error?: string } => {
    const now = new Date().toISOString();
    const newReservation: SavedReservation = {
      ...reservationData,
      id: Date.now().toString(),
      fechaGuardado: now,
      fechaUltimaModificacion: now,
    };
    const updated = [...reservations, newReservation];
    const result = saveToStorage(updated);
    return result.success ? { success: true, id: newReservation.id, reservation: newReservation } : { success: false, error: result.error };
  };

  const updateReservation = (id: string, reservationData: Partial<InsertSavedReservation>): { success: boolean; error?: string } => {
    const updated = reservations.map((res) =>
      res.id === id 
        ? { 
            ...res, 
            ...reservationData,
            fechaUltimaModificacion: new Date().toISOString(),
          } 
        : res
    );
    return saveToStorage(updated);
  };

  const deleteReservation = (id: string): { success: boolean; error?: string } => {
    const updated = reservations.filter((res) => res.id !== id);
    return saveToStorage(updated);
  };

  const getReservationById = (id: string) => {
    return reservations.find((res) => res.id === id);
  };

  const clearStorageError = () => {
    setStorageError(null);
  };

  return {
    reservations,
    loaded,
    addReservation,
    updateReservation,
    deleteReservation,
    getReservationById,
    storageError,
    clearStorageError,
  };
}
