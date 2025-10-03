import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Plane } from "lucide-react";
import { ImageLibrary } from "./ImageLibrary";
import type { Flight } from "@shared/schema";

interface FlightEditorProps {
  flight: Flight;
  onChange: (field: keyof Flight, value: any) => void;
}

export function FlightEditor({ flight, onChange }: FlightEditorProps) {
  const [showAirlineLibrary, setShowAirlineLibrary] = useState(false);

  const airlines = [
    "Avianca",
    "LATAM",
    "Wingo",
    "Viva Air",
    "Copa Airlines",
    "JetBlue",
    "American Airlines",
    "United Airlines",
  ];
  
  const [isCustomAirline, setIsCustomAirline] = useState(!airlines.includes(flight.aerolinea));

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Plane className="w-5 h-5" />
          <h4 className="font-semibold">Información del Vuelo</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label data-testid={`label-aerolinea-${flight.id}`}>Aerolínea</Label>
            {!isCustomAirline ? (
              <Select value={flight.aerolinea} onValueChange={(v) => onChange("aerolinea", v)}>
                <SelectTrigger data-testid={`select-aerolinea-${flight.id}`}>
                  <SelectValue placeholder="Seleccionar aerolínea" />
                </SelectTrigger>
                <SelectContent>
                  {airlines.map((airline) => (
                    <SelectItem key={airline} value={airline}>
                      {airline}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={flight.aerolinea}
                onChange={(e) => onChange("aerolinea", e.target.value)}
                placeholder="Ingrese el nombre de la aerolínea"
                data-testid={`input-aerolinea-personalizada-${flight.id}`}
              />
            )}
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`custom-airline-${flight.id}`}
                checked={isCustomAirline}
                onCheckedChange={(checked) => {
                  setIsCustomAirline(!!checked);
                  if (checked) {
                    onChange("aerolinea", "");
                  } else {
                    onChange("aerolinea", airlines[0]);
                  }
                }}
                data-testid={`checkbox-aerolinea-personalizada-${flight.id}`}
              />
              <label
                htmlFor={`custom-airline-${flight.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Aerolínea personalizada
              </label>
            </div>
          </div>

          <div>
            <Label data-testid={`label-codigo-reserva-vuelo-${flight.id}`}>Código de Reserva</Label>
            <Input
              value={flight.codigoReserva}
              onChange={(e) => onChange("codigoReserva", e.target.value)}
              placeholder="XY123A"
              data-testid={`input-codigo-reserva-vuelo-${flight.id}`}
            />
          </div>

          <div>
            <Label data-testid={`label-fecha-vuelo-${flight.id}`}>Fecha del Vuelo</Label>
            <Input
              type="date"
              value={flight.fecha}
              onChange={(e) => onChange("fecha", e.target.value)}
              data-testid={`input-fecha-vuelo-${flight.id}`}
            />
          </div>

          <div>
            <Label data-testid={`label-escalas-${flight.id}`}>Escalas</Label>
            <Input
              type="number"
              min="0"
              value={flight.escalas}
              onChange={(e) => onChange("escalas", parseInt(e.target.value) || 0)}
              data-testid={`input-escalas-${flight.id}`}
            />
          </div>

          <div>
            <Label data-testid={`label-salida-aeropuerto-${flight.id}`}>Aeropuerto de Salida</Label>
            <Input
              value={flight.salidaAeropuerto}
              onChange={(e) => onChange("salidaAeropuerto", e.target.value)}
              placeholder="BOG - El Dorado"
              data-testid={`input-salida-aeropuerto-${flight.id}`}
            />
          </div>

          <div>
            <Label data-testid={`label-salida-hora-${flight.id}`}>Hora de Salida</Label>
            <Input
              type="time"
              value={flight.salidaHora}
              onChange={(e) => onChange("salidaHora", e.target.value)}
              data-testid={`input-salida-hora-${flight.id}`}
            />
          </div>

          <div>
            <Label data-testid={`label-llegada-aeropuerto-${flight.id}`}>Aeropuerto de Llegada</Label>
            <Input
              value={flight.llegadaAeropuerto}
              onChange={(e) => onChange("llegadaAeropuerto", e.target.value)}
              placeholder="MIA - Miami International"
              data-testid={`input-llegada-aeropuerto-${flight.id}`}
            />
          </div>

          <div>
            <Label data-testid={`label-llegada-hora-${flight.id}`}>Hora de Llegada</Label>
            <Input
              type="time"
              value={flight.llegadaHora}
              onChange={(e) => onChange("llegadaHora", e.target.value)}
              data-testid={`input-llegada-hora-${flight.id}`}
            />
          </div>

          <div>
            <Label data-testid={`label-duracion-${flight.id}`}>Duración del Vuelo</Label>
            <Input
              value={flight.duracion || ""}
              onChange={(e) => onChange("duracion", e.target.value)}
              placeholder="2h 30m"
              data-testid={`input-duracion-${flight.id}`}
            />
          </div>

          <div>
            <Label data-testid={`label-equipaje-${flight.id}`}>Equipaje Facturado</Label>
            <Input
              value={flight.equipajeFacturado || ""}
              onChange={(e) => onChange("equipajeFacturado", e.target.value)}
              placeholder="23 kg"
              data-testid={`input-equipaje-${flight.id}`}
            />
          </div>
        </div>

        <div>
          <Label data-testid={`label-notas-vuelo-${flight.id}`}>Notas Adicionales</Label>
          <Textarea
            value={flight.notas || ""}
            onChange={(e) => onChange("notas", e.target.value)}
            placeholder="Información adicional sobre el vuelo..."
            rows={2}
            data-testid={`input-notas-vuelo-${flight.id}`}
          />
        </div>

        <div>
          <Label>Logo de la Aerolínea</Label>
          <div className="flex items-center gap-4 mt-2">
            {flight.logoAerolinea && (
              <div className="w-24 h-16 bg-muted rounded-md overflow-hidden">
                <img 
                  src={flight.logoAerolinea} 
                  alt="Logo de la aerolínea" 
                  className="w-full h-full object-contain p-1 bg-white"
                  data-testid={`img-logo-aerolinea-${flight.id}`}
                />
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAirlineLibrary(true)}
              data-testid={`button-seleccionar-logo-${flight.id}`}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Seleccionar Logo
            </Button>
          </div>
        </div>
      </div>

      <ImageLibrary
        open={showAirlineLibrary}
        onClose={() => setShowAirlineLibrary(false)}
        onSelect={(url) => onChange("logoAerolinea", url)}
        category="aerolinea"
      />
    </Card>
  );
}
