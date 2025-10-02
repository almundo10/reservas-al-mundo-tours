import { useState } from "react";
import { Header } from "@/components/Header";
import { ReservationForm } from "@/components/ReservationForm";
import { PDFPreview } from "@/components/PDFPreview";
import type { Reservation } from "@shared/schema";

export default function Home() {
  const [reservation, setReservation] = useState<Reservation | null>(null);

  const handleFormSubmit = (data: Reservation) => {
    console.log("Reserva creada:", data);
    setReservation(data);
  };

  const handleDownload = () => {
    console.log("PDF generado exitosamente");
  };

  const handleBack = () => {
    setReservation(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8">
        {!reservation ? (
          <ReservationForm onSubmit={handleFormSubmit} />
        ) : (
          <PDFPreview reservation={reservation} onDownload={handleDownload} onBack={handleBack} />
        )}
      </main>
    </div>
  );
}
