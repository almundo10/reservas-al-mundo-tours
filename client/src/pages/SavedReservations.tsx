import { useSavedReservations } from "@/hooks/use-saved-reservations";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, Trash2, FileText, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useLocation } from "wouter";

export default function SavedReservations() {
  const { reservations, deleteReservation, storageError } = useSavedReservations();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleDelete = (id: string, nombreReserva?: string) => {
    if (confirm(`¿Estás seguro de eliminar la reserva${nombreReserva ? ` "${nombreReserva}"` : ""}?`)) {
      const result = deleteReservation(id);
      if (result.success) {
        toast({
          title: "Reserva eliminada",
          description: "La reserva se ha eliminado correctamente",
        });
      } else {
        toast({
          title: "Error al eliminar",
          description: result.error || "No se pudo eliminar la reserva",
          variant: "destructive",
        });
      }
    }
  };

  const handleLoad = (id: string) => {
    setLocation(`/?load=${id}`);
  };

  const sortedReservations = [...reservations].sort((a, b) => 
    new Date(b.fechaUltimaModificacion).getTime() - new Date(a.fechaUltimaModificacion).getTime()
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Save className="w-8 h-8" />
          Reservas Guardadas
        </h1>
        <p className="text-muted-foreground mt-2">
          Administra tus reservas guardadas
        </p>
      </div>

      {storageError && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">{storageError}</p>
        </div>
      )}

      {sortedReservations.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No hay reservas guardadas</h3>
          <p className="text-muted-foreground mb-4">
            Las reservas que guardes aparecerán aquí
          </p>
          <Button onClick={() => setLocation("/")} data-testid="button-create-reservation">
            Crear Nueva Reserva
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedReservations.map((savedRes) => {
            const { id, nombreReserva, fechaGuardado, fechaUltimaModificacion, reserva } = savedRes;
            const displayName = nombreReserva || reserva.codigoReserva;
            
            return (
              <Card key={id} className="p-4" data-testid={`card-reservation-${id}`}>
                <div className="mb-3">
                  <h3 className="font-semibold text-lg mb-1 truncate" data-testid={`text-nombre-${id}`}>
                    {displayName}
                  </h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span data-testid={`text-codigo-${id}`}>{reserva.codigoReserva}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span data-testid={`text-cliente-${id}`}>{reserva.nombreCliente}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span data-testid={`text-fechas-${id}`}>
                        {format(new Date(reserva.fechaInicioViaje), "dd MMM", { locale: es })} - {format(new Date(reserva.fechaFinViaje), "dd MMM yyyy", { locale: es })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground mb-3">
                  <p>Guardado: {format(new Date(fechaGuardado), "dd/MM/yyyy HH:mm", { locale: es })}</p>
                  {fechaGuardado !== fechaUltimaModificacion && (
                    <p>Modificado: {format(new Date(fechaUltimaModificacion), "dd/MM/yyyy HH:mm", { locale: es })}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleLoad(id)}
                    data-testid={`button-load-${id}`}
                  >
                    Cargar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(id, nombreReserva)}
                    data-testid={`button-delete-${id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
