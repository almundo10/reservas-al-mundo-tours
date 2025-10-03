import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Image as ImageIcon, Building2, Compass, Car } from "lucide-react";
import { ImageLibrary } from "./ImageLibrary";
import type { Destination, Hotel, Tour, Transfer } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DestinationEditorProps {
  destination: Destination;
  onChange: (field: keyof Destination, value: any) => void;
  onAddTour: () => void;
  onRemoveTour: (tourId: string) => void;
  onAddTransfer: () => void;
  onRemoveTransfer: (transferId: string) => void;
}

export function DestinationEditor({
  destination,
  onChange,
  onAddTour,
  onRemoveTour,
  onAddTransfer,
  onRemoveTransfer,
}: DestinationEditorProps) {
  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const [hotelImageLibraryOpen, setHotelImageLibraryOpen] = useState(false);
  
  const predefinedDestinations = ["San Andrés", "Cartagena", "Bogotá", "Medellín", "Eje Cafetero", "Santa Marta"];
  const [isCustomDestination, setIsCustomDestination] = useState(!predefinedDestinations.includes(destination.nombre));

  const updateHotel = (field: keyof Hotel, value: any) => {
    const updatedHotel = destination.hotel
      ? { ...destination.hotel, [field]: value }
      : {
          id: Date.now().toString(),
          nombre: "",
          fotos: [],
          noches: 1,
          [field]: value,
        };
    onChange("hotel", updatedHotel);
  };

  const addHotelPhoto = (url: string) => {
    const currentPhotos = destination.hotel?.fotos || [];
    updateHotel("fotos", [...currentPhotos, url]);
  };

  const removeHotelPhoto = (index: number) => {
    const currentPhotos = destination.hotel?.fotos || [];
    updateHotel("fotos", currentPhotos.filter((_, i) => i !== index));
  };

  const updateTour = (tourId: string, field: keyof Tour, value: any) => {
    const updatedTours = destination.tours.map((t) =>
      t.id === tourId ? { ...t, [field]: value } : t
    );
    onChange("tours", updatedTours);
  };

  const updateTransfer = (transferId: string, field: keyof Transfer, value: any) => {
    const updatedTransfers = destination.traslados.map((t) =>
      t.id === transferId ? { ...t, [field]: value } : t
    );
    onChange("traslados", updatedTransfers);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Destino {destination.numero}</h3>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info" data-testid={`tab-info-${destination.id}`}>
              <Compass className="w-4 h-4 mr-2" />
              Información
            </TabsTrigger>
            <TabsTrigger value="hotel" data-testid={`tab-hotel-${destination.id}`}>
              <Building2 className="w-4 h-4 mr-2" />
              Hotel
            </TabsTrigger>
            <TabsTrigger value="tours" data-testid={`tab-tours-${destination.id}`}>
              Tours ({destination.tours.length})
            </TabsTrigger>
            <TabsTrigger value="transfers" data-testid={`tab-transfers-${destination.id}`}>
              <Car className="w-4 h-4 mr-2" />
              Traslados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label data-testid={`label-nombre-destino-${destination.id}`}>Nombre del Destino</Label>
                {!isCustomDestination ? (
                  <Select value={destination.nombre} onValueChange={(v) => onChange("nombre", v)}>
                    <SelectTrigger data-testid={`select-nombre-destino-${destination.id}`}>
                      <SelectValue placeholder="Seleccionar destino" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="San Andrés">San Andrés</SelectItem>
                      <SelectItem value="Cartagena">Cartagena</SelectItem>
                      <SelectItem value="Bogotá">Bogotá</SelectItem>
                      <SelectItem value="Medellín">Medellín</SelectItem>
                      <SelectItem value="Eje Cafetero">Eje Cafetero</SelectItem>
                      <SelectItem value="Santa Marta">Santa Marta</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={destination.nombre}
                    onChange={(e) => onChange("nombre", e.target.value)}
                    placeholder="Ingrese el nombre del destino"
                    data-testid={`input-nombre-destino-personalizado-${destination.id}`}
                  />
                )}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`custom-destination-${destination.id}`}
                    checked={isCustomDestination}
                    onCheckedChange={(checked) => {
                      setIsCustomDestination(!!checked);
                      if (checked) {
                        onChange("nombre", "");
                      } else {
                        onChange("nombre", predefinedDestinations[0]);
                      }
                    }}
                    data-testid={`checkbox-destino-personalizado-${destination.id}`}
                  />
                  <label
                    htmlFor={`custom-destination-${destination.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Destino personalizado
                  </label>
                </div>
              </div>
              <div>
                <Label data-testid={`label-pais-${destination.id}`}>País</Label>
                <Input
                  value={destination.pais}
                  onChange={(e) => onChange("pais", e.target.value)}
                  placeholder="Colombia"
                  data-testid={`input-pais-${destination.id}`}
                />
              </div>
              <div>
                <Label data-testid={`label-fecha-inicio-dest-${destination.id}`}>Fecha de Inicio</Label>
                <Input
                  type="date"
                  value={destination.fechaInicio}
                  onChange={(e) => onChange("fechaInicio", e.target.value)}
                  data-testid={`input-fecha-inicio-dest-${destination.id}`}
                />
              </div>
              <div>
                <Label data-testid={`label-fecha-fin-dest-${destination.id}`}>Fecha de Fin</Label>
                <Input
                  type="date"
                  value={destination.fechaFin}
                  onChange={(e) => onChange("fechaFin", e.target.value)}
                  data-testid={`input-fecha-fin-dest-${destination.id}`}
                />
              </div>
            </div>

            <div>
              <Label data-testid={`label-descripcion-${destination.id}`}>Descripción</Label>
              <Textarea
                value={destination.descripcion || ""}
                onChange={(e) => onChange("descripcion", e.target.value)}
                placeholder="Descripción del destino..."
                rows={3}
                data-testid={`input-descripcion-${destination.id}`}
              />
            </div>

            <div>
              <Label>Banner del Destino</Label>
              <div className="flex items-center gap-4 mt-2">
                {destination.imagenBanner && (
                  <div className="w-32 h-20 bg-muted rounded-md overflow-hidden">
                    <img 
                      src={destination.imagenBanner} 
                      alt="Banner del destino" 
                      className="w-full h-full object-cover"
                      data-testid={`img-banner-${destination.id}`}
                    />
                  </div>
                )}
                <Button
                  variant="outline"
                  onClick={() => setShowImageLibrary(true)}
                  data-testid={`button-seleccionar-banner-${destination.id}`}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Seleccionar Banner
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hotel" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label data-testid={`label-hotel-nombre-${destination.id}`}>Nombre del Hotel</Label>
                <Input
                  value={destination.hotel?.nombre || ""}
                  onChange={(e) => updateHotel("nombre", e.target.value)}
                  placeholder="Hotel Las Américas"
                  data-testid={`input-hotel-nombre-${destination.id}`}
                />
              </div>
              <div>
                <Label data-testid={`label-hotel-direccion-${destination.id}`}>Dirección</Label>
                <Input
                  value={destination.hotel?.direccion || ""}
                  onChange={(e) => updateHotel("direccion", e.target.value)}
                  placeholder="Calle 123 #45-67"
                  data-testid={`input-hotel-direccion-${destination.id}`}
                />
              </div>
              <div>
                <Label data-testid={`label-hotel-telefono-${destination.id}`}>Teléfono</Label>
                <Input
                  value={destination.hotel?.telefono || ""}
                  onChange={(e) => updateHotel("telefono", e.target.value)}
                  placeholder="+57 300 123 4567"
                  data-testid={`input-hotel-telefono-${destination.id}`}
                />
              </div>
              <div>
                <Label data-testid={`label-hotel-reserva-${destination.id}`}>Número de Reserva</Label>
                <Input
                  value={destination.hotel?.numeroReserva || ""}
                  onChange={(e) => updateHotel("numeroReserva", e.target.value)}
                  placeholder="HTL123456"
                  data-testid={`input-hotel-reserva-${destination.id}`}
                />
              </div>
              <div>
                <Label data-testid={`label-hotel-tipo-${destination.id}`}>Tipo de Habitación</Label>
                <Input
                  value={destination.hotel?.tipoHabitacion || ""}
                  onChange={(e) => updateHotel("tipoHabitacion", e.target.value)}
                  placeholder="Doble estándar"
                  data-testid={`input-hotel-tipo-${destination.id}`}
                />
              </div>
              <div>
                <Label data-testid={`label-hotel-checkin-${destination.id}`}>Check-in</Label>
                <Input
                  type="date"
                  value={destination.hotel?.checkIn || ""}
                  onChange={(e) => updateHotel("checkIn", e.target.value)}
                  data-testid={`input-hotel-checkin-${destination.id}`}
                />
              </div>
              <div>
                <Label data-testid={`label-hotel-hora-checkin-${destination.id}`}>Hora Check-in</Label>
                <Input
                  type="time"
                  value={destination.hotel?.horaCheckIn || ""}
                  onChange={(e) => updateHotel("horaCheckIn", e.target.value)}
                  data-testid={`input-hotel-hora-checkin-${destination.id}`}
                />
              </div>
              <div>
                <Label data-testid={`label-hotel-checkout-${destination.id}`}>Check-out</Label>
                <Input
                  type="date"
                  value={destination.hotel?.checkOut || ""}
                  onChange={(e) => updateHotel("checkOut", e.target.value)}
                  data-testid={`input-hotel-checkout-${destination.id}`}
                />
              </div>
              <div>
                <Label data-testid={`label-hotel-hora-checkout-${destination.id}`}>Hora Check-out</Label>
                <Input
                  type="time"
                  value={destination.hotel?.horaCheckOut || ""}
                  onChange={(e) => updateHotel("horaCheckOut", e.target.value)}
                  data-testid={`input-hotel-hora-checkout-${destination.id}`}
                />
              </div>
              <div>
                <Label data-testid={`label-hotel-noches-${destination.id}`}>Número de Noches</Label>
                <Input
                  type="number"
                  min="1"
                  value={destination.hotel?.noches || 1}
                  onChange={(e) => updateHotel("noches", parseInt(e.target.value) || 1)}
                  data-testid={`input-hotel-noches-${destination.id}`}
                />
              </div>
              <div>
                <Label data-testid={`label-hotel-habitaciones-${destination.id}`}>Número de Habitaciones</Label>
                <Input
                  type="number"
                  min="1"
                  value={destination.hotel?.numeroHabitaciones || 1}
                  onChange={(e) => updateHotel("numeroHabitaciones", parseInt(e.target.value) || 1)}
                  data-testid={`input-hotel-habitaciones-${destination.id}`}
                />
              </div>
              <div>
                <Label data-testid={`label-hotel-plan-${destination.id}`}>Plan de Alimentación</Label>
                <Input
                  value={destination.hotel?.planAlimentacion || ""}
                  onChange={(e) => updateHotel("planAlimentacion", e.target.value)}
                  placeholder="Todo incluido"
                  data-testid={`input-hotel-plan-${destination.id}`}
                />
              </div>
            </div>

            <div>
              <Label>Fotos del Hotel</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {destination.hotel?.fotos?.map((foto, idx) => (
                  <div key={idx} className="relative aspect-video bg-muted rounded-md overflow-hidden">
                    <img 
                      src={foto} 
                      alt={`Hotel foto ${idx + 1}`} 
                      className="w-full h-full object-cover"
                      data-testid={`img-hotel-foto-${idx}`}
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removeHotelPhoto(idx)}
                      data-testid={`button-eliminar-foto-${idx}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHotelImageLibraryOpen(true)}
                className="mt-2"
                data-testid={`button-agregar-foto-hotel-${destination.id}`}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Foto
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="tours" className="space-y-4 mt-4">
            {destination.tours.map((tour) => (
              <Card key={tour.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Tour</h4>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onRemoveTour(tour.id)}
                    data-testid={`button-eliminar-tour-${tour.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <Label data-testid={`label-tour-nombre-${tour.id}`}>Nombre del Tour</Label>
                    <Input
                      value={tour.nombre}
                      onChange={(e) => updateTour(tour.id, "nombre", e.target.value)}
                      placeholder="City Tour"
                      data-testid={`input-tour-nombre-${tour.id}`}
                    />
                  </div>
                  <div>
                    <Label data-testid={`label-tour-operador-${tour.id}`}>Operador del Tour</Label>
                    <Input
                      value={tour.operador || ""}
                      onChange={(e) => updateTour(tour.id, "operador", e.target.value)}
                      placeholder="Nombre del operador"
                      data-testid={`input-tour-operador-${tour.id}`}
                    />
                  </div>
                  <div>
                    <Label data-testid={`label-tour-duracion-${tour.id}`}>Duración</Label>
                    <Input
                      value={tour.duracion || ""}
                      onChange={(e) => updateTour(tour.id, "duracion", e.target.value)}
                      placeholder="4 horas"
                      data-testid={`input-tour-duracion-${tour.id}`}
                    />
                  </div>
                  <div>
                    <Label data-testid={`label-tour-hora-${tour.id}`}>Hora de Inicio</Label>
                    <Input
                      type="time"
                      value={tour.horaInicio || ""}
                      onChange={(e) => updateTour(tour.id, "horaInicio", e.target.value)}
                      data-testid={`input-tour-hora-${tour.id}`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label data-testid={`label-tour-descripcion-${tour.id}`}>Descripción</Label>
                    <Textarea
                      value={tour.descripcion || ""}
                      onChange={(e) => updateTour(tour.id, "descripcion", e.target.value)}
                      placeholder="Descripción del tour..."
                      rows={2}
                      data-testid={`input-tour-descripcion-${tour.id}`}
                    />
                  </div>
                </div>
              </Card>
            ))}
            <Button
              variant="outline"
              onClick={onAddTour}
              data-testid={`button-agregar-tour-${destination.id}`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Tour
            </Button>
          </TabsContent>

          <TabsContent value="transfers" className="space-y-4 mt-4">
            {destination.traslados.map((transfer) => (
              <Card key={transfer.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Traslado</h4>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onRemoveTransfer(transfer.id)}
                    data-testid={`button-eliminar-transfer-${transfer.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label data-testid={`label-transfer-tipo-${transfer.id}`}>Tipo de Vehículo</Label>
                    <Input
                      value={transfer.tipo}
                      onChange={(e) => updateTransfer(transfer.id, "tipo", e.target.value)}
                      placeholder="Van ejecutiva"
                      data-testid={`input-transfer-tipo-${transfer.id}`}
                    />
                  </div>
                  <div>
                    <Label data-testid={`label-transfer-hora-${transfer.id}`}>Hora de Recogida</Label>
                    <Input
                      type="time"
                      value={transfer.horaRecogida || ""}
                      onChange={(e) => updateTransfer(transfer.id, "horaRecogida", e.target.value)}
                      data-testid={`input-transfer-hora-${transfer.id}`}
                    />
                  </div>
                  <div>
                    <Label data-testid={`label-transfer-desde-${transfer.id}`}>Desde</Label>
                    <Input
                      value={transfer.desde}
                      onChange={(e) => updateTransfer(transfer.id, "desde", e.target.value)}
                      placeholder="Aeropuerto"
                      data-testid={`input-transfer-desde-${transfer.id}`}
                    />
                  </div>
                  <div>
                    <Label data-testid={`label-transfer-hasta-${transfer.id}`}>Hasta</Label>
                    <Input
                      value={transfer.hasta}
                      onChange={(e) => updateTransfer(transfer.id, "hasta", e.target.value)}
                      placeholder="Hotel"
                      data-testid={`input-transfer-hasta-${transfer.id}`}
                    />
                  </div>
                </div>
              </Card>
            ))}
            <Button
              variant="outline"
              onClick={onAddTransfer}
              data-testid={`button-agregar-transfer-${destination.id}`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Traslado
            </Button>
          </TabsContent>
        </Tabs>
      </Card>

      <ImageLibrary
        open={showImageLibrary}
        onClose={() => setShowImageLibrary(false)}
        onSelect={(url) => onChange("imagenBanner", url)}
        category="destino"
      />

      <ImageLibrary
        open={hotelImageLibraryOpen}
        onClose={() => setHotelImageLibraryOpen(false)}
        onSelect={addHotelPhoto}
        category="hotel"
      />
    </div>
  );
}
