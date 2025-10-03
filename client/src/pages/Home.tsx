import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ReservationForm } from "@/components/ReservationForm";
import { PDFPreview } from "@/components/PDFPreview";
import { useSavedReservations } from "@/hooks/use-saved-reservations";
import { useLocation } from "wouter";
import type { Reservation } from "@shared/schema";

export default function Home() {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [initialReservation, setInitialReservation] = useState<Reservation | null>(null);
  const [savedReservationId, setSavedReservationId] = useState<string | null>(null);
  const { getReservationById, loaded } = useSavedReservations();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!loaded) return;
    
    const params = new URLSearchParams(window.location.search);
    const loadId = params.get("load");
    
    if (loadId) {
      const savedReservation = getReservationById(loadId);
      if (savedReservation) {
        const reservationWithId = { ...savedReservation.reserva, id: savedReservation.id };
        setInitialReservation(reservationWithId);
        setSavedReservationId(savedReservation.id);
      }
      setLocation("/");
    }
  }, [loaded, location, getReservationById, setLocation]);

  const handleFormSubmit = (data: Reservation) => {
    console.log("Reserva creada:", data);
    const reservationWithId = savedReservationId ? { ...data, id: savedReservationId } : data;
    setReservation(reservationWithId);
  };

  const handleDownload = () => {
    console.log("PDF generado exitosamente");
  };

  const handleBack = () => {
    setReservation(null);
  };

  const handleSaveSuccess = (id: string) => {
    setSavedReservationId(id);
    if (reservation) {
      setReservation({ ...reservation, id });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8">
        {!reservation ? (
          <ReservationForm 
            onSubmit={handleFormSubmit} 
            initialData={initialReservation}
            savedReservationId={savedReservationId}
          />
        ) : (
          <PDFPreview 
            reservation={reservation} 
            onDownload={handleDownload} 
            onBack={handleBack}
            onSaveSuccess={handleSaveSuccess}
          />
        )}
      </main>
    </div>
  );
}
