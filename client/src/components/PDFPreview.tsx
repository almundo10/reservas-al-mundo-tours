import { useState } from "react";
import { Download, Printer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateReservationPDF } from "@/lib/pdfGenerator";
import { useAgencyConfig } from "@/hooks/use-agency-config";
import type { Reservation } from "@shared/schema";

interface PDFPreviewProps {
  reservation: Reservation;
  onDownload: () => void;
  onBack?: () => void;
}

export function PDFPreview({ reservation, onDownload, onBack }: PDFPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { config } = useAgencyConfig();

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      console.log("Generando PDF con datos:", reservation);
      const pdfBlob = await generateReservationPDF(reservation, config);
      console.log("PDF generado exitosamente, tamaño:", pdfBlob.size);
      
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      const agencySlug = config.nombre.replace(/\s+/g, '_');
      link.download = `Reserva_${reservation.codigoReserva}_${agencySlug}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log("PDF descargado exitosamente");
      onDownload();
    } catch (error) {
      console.error("Error generando PDF:", error);
      console.error("Detalles del error:", error instanceof Error ? error.message : String(error));
      console.error("Stack trace:", error instanceof Error ? error.stack : "No stack available");
      alert(`Hubo un error al generar el PDF: ${error instanceof Error ? error.message : "Error desconocido"}. Por favor intente nuevamente.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card border rounded-lg p-6 mb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} data-testid="button-volver">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            )}
            <h2 className="text-2xl font-semibold">Vista Previa del Documento</h2>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleDownload} 
              disabled={isGenerating}
              data-testid="button-descargar"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? "Generando..." : "Descargar PDF"}
            </Button>
          </div>
        </div>

        {/* Document Preview - Simulated A4 Page */}
        <div className="bg-white text-black p-8 shadow-lg" style={{ aspectRatio: '210/297' }}>
          {/* Header with Logo */}
          <div className="mb-6">
            <div className="text-sm text-gray-600">{config.nombre}</div>
          </div>

          {/* Banner Placeholder */}
          <div className="w-full h-32 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mb-6 flex items-center justify-center">
            <p className="text-white text-lg font-semibold">Banner del Destino</p>
          </div>

          {/* Reservation Code */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary mb-2" data-testid="text-codigo-reserva">
              Reserva: {reservation.codigoReserva}
            </h1>
            <p className="text-sm text-gray-600" data-testid="text-fecha-creacion">
              Creado: {reservation.fechaCreacion}
            </p>
          </div>

          {/* Travel Info */}
          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold">Su Viaje</p>
                <p data-testid="text-cantidad-pasajeros">
                  En base a {reservation.cantidadAdultos} adultos
                  {reservation.cantidadNinos > 0 && `, ${reservation.cantidadNinos} niño(s)`}
                </p>
                <p data-testid="text-fechas-viaje">
                  {reservation.fechaInicioViaje} - {reservation.fechaFinViaje}
                </p>
              </div>
              <div>
                <p className="font-semibold">Contacto</p>
                <p data-testid="text-nombre-cliente">{reservation.nombreCliente}</p>
                <p className="text-xs text-gray-500" data-testid="text-documento-cliente">
                  Doc: {reservation.documentoCliente}
                </p>
              </div>
            </div>
          </div>

          {/* Glossary */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Glosario</h3>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="text-center">
                <p className="font-bold text-primary" data-testid="text-cant-destinos">
                  {reservation.destinos?.length || 0}
                </p>
                <p className="text-xs">Destinos</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-primary" data-testid="text-cant-vuelos">
                  {reservation.vuelos?.length || 0}
                </p>
                <p className="text-xs">Vuelos</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-primary" data-testid="text-cant-pasajeros-total">
                  {reservation.pasajeros?.length || 0}
                </p>
                <p className="text-xs">Pasajeros</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-primary">
                  {reservation.destinos?.reduce((acc, d) => acc + (d.tours?.length || 0), 0) || 0}
                </p>
                <p className="text-xs">Tours</p>
              </div>
            </div>
          </div>

          {/* Footer Simulation */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-xs text-gray-500 text-center">
            <p>{config.nombre} - {config.direccion}{config.ciudad ? `, ${config.ciudad}` : ''}</p>
            <p>{config.telefono && `Tel: ${config.telefono}`}{config.email && ` | ${config.email}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
