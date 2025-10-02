import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Calendar, Users, Plane, Hotel, Map, FileText } from "lucide-react";
import type { Reservation, Passenger, Destination, Flight, Tour, Transfer } from "@shared/schema";

interface ReservationFormProps {
  onSubmit: (data: Reservation) => void;
}

export function ReservationForm({ onSubmit }: ReservationFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Reservation>>({
    cantidadAdultos: 1,
    cantidadNinos: 0,
    pasajeros: [],
    destinos: [],
    vuelos: [],
    incluye: [],
    noIncluye: [],
  });

  const steps = [
    { num: 1, name: "Información Básica", icon: FileText },
    { num: 2, name: "Pasajeros", icon: Users },
    { num: 3, name: "Destinos", icon: Map },
    { num: 4, name: "Vuelos", icon: Plane },
    { num: 5, name: "Detalles Finales", icon: Hotel },
  ];

  const addPassenger = () => {
    const newPassenger: Passenger = {
      id: Date.now().toString(),
      nombre: "",
      numeroDocumento: "",
      fechaNacimiento: "",
    };
    setFormData({
      ...formData,
      pasajeros: [...(formData.pasajeros || []), newPassenger],
    });
  };

  const removePassenger = (id: string) => {
    setFormData({
      ...formData,
      pasajeros: formData.pasajeros?.filter((p) => p.id !== id) || [],
    });
  };

  const updatePassenger = (id: string, field: keyof Passenger, value: string) => {
    setFormData({
      ...formData,
      pasajeros: formData.pasajeros?.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ) || [],
    });
  };

  const addDestination = () => {
    const numero = (formData.destinos?.length || 0) + 1;
    const newDestination: Destination = {
      id: Date.now().toString(),
      numero,
      nombre: "",
      pais: "Colombia",
      fechaInicio: "",
      fechaFin: "",
      tours: [],
      traslados: [],
      puntosInteres: [],
    };
    setFormData({
      ...formData,
      destinos: [...(formData.destinos || []), newDestination],
    });
  };

  const removeDestination = (id: string) => {
    setFormData({
      ...formData,
      destinos: formData.destinos?.filter((d) => d.id !== id) || [],
    });
  };

  const addFlight = () => {
    const newFlight: Flight = {
      id: Date.now().toString(),
      aerolinea: "",
      codigoReserva: "",
      salidaHora: "",
      llegadaHora: "",
      salidaAeropuerto: "",
      llegadaAeropuerto: "",
      fecha: "",
      escalas: 0,
    };
    setFormData({
      ...formData,
      vuelos: [...(formData.vuelos || []), newFlight],
    });
  };

  const removeFlight = (id: string) => {
    setFormData({
      ...formData,
      vuelos: formData.vuelos?.filter((f) => f.id !== id) || [],
    });
  };

  const handleSubmit = () => {
    console.log("Generando PDF con datos:", formData);
    onSubmit(formData as Reservation);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    step >= s.num
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <s.icon className="w-5 h-5" />
                </div>
                <p className="text-sm mt-2 text-center">{s.name}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-1 flex-1 ${step > s.num ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Información Básica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigoReserva" data-testid="label-codigo-reserva">Código de Reserva</Label>
              <Input
                id="codigoReserva"
                data-testid="input-codigo-reserva"
                placeholder="AL4167"
                value={formData.codigoReserva || ""}
                onChange={(e) => setFormData({ ...formData, codigoReserva: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="fechaCreacion" data-testid="label-fecha-creacion">Fecha de Creación</Label>
              <Input
                id="fechaCreacion"
                data-testid="input-fecha-creacion"
                type="date"
                value={formData.fechaCreacion || ""}
                onChange={(e) => setFormData({ ...formData, fechaCreacion: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="nombreCliente" data-testid="label-nombre-cliente">Nombre del Responsable</Label>
              <Input
                id="nombreCliente"
                data-testid="input-nombre-cliente"
                placeholder="Jesus Hernando Castillo"
                value={formData.nombreCliente || ""}
                onChange={(e) => setFormData({ ...formData, nombreCliente: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="documentoCliente" data-testid="label-documento-cliente">Documento del Responsable</Label>
              <Input
                id="documentoCliente"
                data-testid="input-documento-cliente"
                placeholder="1116245015"
                value={formData.documentoCliente || ""}
                onChange={(e) => setFormData({ ...formData, documentoCliente: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="cantidadAdultos" data-testid="label-cantidad-adultos">Cantidad de Adultos</Label>
              <Input
                id="cantidadAdultos"
                data-testid="input-cantidad-adultos"
                type="number"
                min="1"
                value={formData.cantidadAdultos || 1}
                onChange={(e) => setFormData({ ...formData, cantidadAdultos: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <Label htmlFor="cantidadNinos" data-testid="label-cantidad-ninos">Cantidad de Niños</Label>
              <Input
                id="cantidadNinos"
                data-testid="input-cantidad-ninos"
                type="number"
                min="0"
                value={formData.cantidadNinos || 0}
                onChange={(e) => setFormData({ ...formData, cantidadNinos: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="fechaInicioViaje" data-testid="label-fecha-inicio">Fecha de Inicio del Viaje</Label>
              <Input
                id="fechaInicioViaje"
                data-testid="input-fecha-inicio"
                type="date"
                value={formData.fechaInicioViaje || ""}
                onChange={(e) => setFormData({ ...formData, fechaInicioViaje: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="fechaFinViaje" data-testid="label-fecha-fin">Fecha de Fin del Viaje</Label>
              <Input
                id="fechaFinViaje"
                data-testid="input-fecha-fin"
                type="date"
                value={formData.fechaFinViaje || ""}
                onChange={(e) => setFormData({ ...formData, fechaFinViaje: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={() => setStep(2)} data-testid="button-siguiente-step1">
              Siguiente
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Passengers */}
      {step === 2 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Pasajeros</h2>
          <div className="space-y-4">
            {formData.pasajeros?.map((passenger) => (
              <div key={passenger.id} className="border rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label data-testid={`label-nombre-${passenger.id}`}>Nombre Completo</Label>
                    <Input
                      data-testid={`input-nombre-${passenger.id}`}
                      value={passenger.nombre}
                      onChange={(e) => updatePassenger(passenger.id, "nombre", e.target.value)}
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div>
                    <Label data-testid={`label-documento-${passenger.id}`}>Número de Documento</Label>
                    <Input
                      data-testid={`input-documento-${passenger.id}`}
                      value={passenger.numeroDocumento}
                      onChange={(e) => updatePassenger(passenger.id, "numeroDocumento", e.target.value)}
                      placeholder="Número de documento"
                    />
                  </div>
                  <div>
                    <Label data-testid={`label-fecha-${passenger.id}`}>Fecha de Nacimiento</Label>
                    <Input
                      data-testid={`input-fecha-${passenger.id}`}
                      type="date"
                      value={passenger.fechaNacimiento}
                      onChange={(e) => updatePassenger(passenger.id, "fechaNacimiento", e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removePassenger(passenger.id)}
                  data-testid={`button-eliminar-pasajero-${passenger.id}`}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar Pasajero
                </Button>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={addPassenger}
            className="mt-4"
            data-testid="button-agregar-pasajero"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Pasajero
          </Button>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep(1)} data-testid="button-atras-step2">
              Atrás
            </Button>
            <Button onClick={() => setStep(3)} data-testid="button-siguiente-step2">
              Siguiente
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Destinations */}
      {step === 3 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Destinos</h2>
          <div className="space-y-4">
            {formData.destinos?.map((destino) => (
              <div key={destino.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Destino {destino.numero}</h3>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeDestination(destino.id)}
                    data-testid={`button-eliminar-destino-${destino.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground" data-testid={`text-info-destino-${destino.id}`}>
                  Configuración del destino {destino.numero}
                </p>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={addDestination}
            className="mt-4"
            data-testid="button-agregar-destino"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Destino
          </Button>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep(2)} data-testid="button-atras-step3">
              Atrás
            </Button>
            <Button onClick={() => setStep(4)} data-testid="button-siguiente-step3">
              Siguiente
            </Button>
          </div>
        </Card>
      )}

      {/* Step 4: Flights */}
      {step === 4 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Vuelos</h2>
          <div className="space-y-4">
            {formData.vuelos?.map((vuelo) => (
              <div key={vuelo.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Vuelo - {vuelo.aerolinea || "Sin nombre"}</h3>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFlight(vuelo.id)}
                    data-testid={`button-eliminar-vuelo-${vuelo.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground" data-testid={`text-info-vuelo-${vuelo.id}`}>
                  Información del vuelo
                </p>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={addFlight}
            className="mt-4"
            data-testid="button-agregar-vuelo"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Vuelo
          </Button>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep(3)} data-testid="button-atras-step4">
              Atrás
            </Button>
            <Button onClick={() => setStep(5)} data-testid="button-siguiente-step4">
              Siguiente
            </Button>
          </div>
        </Card>
      )}

      {/* Step 5: Final Details */}
      {step === 5 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Detalles Finales</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="terminosUrl" data-testid="label-terminos-url">URL de Términos y Condiciones</Label>
              <Input
                id="terminosUrl"
                data-testid="input-terminos-url"
                type="url"
                placeholder="https://drive.google.com/..."
                value={formData.terminosCondicionesUrl || ""}
                onChange={(e) => setFormData({ ...formData, terminosCondicionesUrl: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="precioTotal" data-testid="label-precio-total">Precio Total</Label>
                <Input
                  id="precioTotal"
                  data-testid="input-precio-total"
                  placeholder="$ 4.351.028"
                  value={formData.precioTotal || ""}
                  onChange={(e) => setFormData({ ...formData, precioTotal: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="abono" data-testid="label-abono">Abono</Label>
                <Input
                  id="abono"
                  data-testid="input-abono"
                  placeholder="$ 2.300.000"
                  value={formData.abono || ""}
                  onChange={(e) => setFormData({ ...formData, abono: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="saldo" data-testid="label-saldo">Saldo Pendiente</Label>
                <Input
                  id="saldo"
                  data-testid="input-saldo"
                  placeholder="$ 2.051.028"
                  value={formData.saldoPendiente || ""}
                  onChange={(e) => setFormData({ ...formData, saldoPendiente: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notasGenerales" data-testid="label-notas">Notas Generales</Label>
              <Textarea
                id="notasGenerales"
                data-testid="input-notas"
                rows={4}
                placeholder="Notas adicionales sobre la reserva..."
                value={formData.notasGenerales || ""}
                onChange={(e) => setFormData({ ...formData, notasGenerales: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep(4)} data-testid="button-atras-step5">
              Atrás
            </Button>
            <Button onClick={handleSubmit} className="bg-primary" data-testid="button-generar-pdf">
              <FileText className="w-4 h-4 mr-2" />
              Generar Documento PDF
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
