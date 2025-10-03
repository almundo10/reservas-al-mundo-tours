import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Calendar, Users, Plane, Hotel, Map, FileText } from "lucide-react";
import { DestinationEditor } from "./DestinationEditor";
import { FlightEditor } from "./FlightEditor";
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
    const updatedDestinos = formData.destinos?.filter((d) => d.id !== id) || [];
    const renumberedDestinos = updatedDestinos.map((d, idx) => ({ ...d, numero: idx + 1 }));
    setFormData({
      ...formData,
      destinos: renumberedDestinos,
    });
  };

  const updateDestination = (id: string, field: keyof Destination, value: any) => {
    setFormData({
      ...formData,
      destinos: formData.destinos?.map((d) =>
        d.id === id ? { ...d, [field]: value } : d
      ) || [],
    });
  };

  const addTourToDestination = (destinoId: string) => {
    const newTour: Tour = {
      id: Date.now().toString(),
      nombre: "",
      incluye: [],
      noIncluye: [],
    };
    setFormData({
      ...formData,
      destinos: formData.destinos?.map((d) =>
        d.id === destinoId ? { ...d, tours: [...d.tours, newTour] } : d
      ) || [],
    });
  };

  const removeTourFromDestination = (destinoId: string, tourId: string) => {
    setFormData({
      ...formData,
      destinos: formData.destinos?.map((d) =>
        d.id === destinoId ? { ...d, tours: d.tours.filter((t) => t.id !== tourId) } : d
      ) || [],
    });
  };

  const addTransferToDestination = (destinoId: string) => {
    const newTransfer: Transfer = {
      id: Date.now().toString(),
      tipo: "",
      desde: "",
      hasta: "",
    };
    setFormData({
      ...formData,
      destinos: formData.destinos?.map((d) =>
        d.id === destinoId ? { ...d, traslados: [...d.traslados, newTransfer] } : d
      ) || [],
    });
  };

  const removeTransferFromDestination = (destinoId: string, transferId: string) => {
    setFormData({
      ...formData,
      destinos: formData.destinos?.map((d) =>
        d.id === destinoId ? { ...d, traslados: d.traslados.filter((t) => t.id !== transferId) } : d
      ) || [],
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

  const updateFlight = (id: string, field: keyof Flight, value: any) => {
    setFormData({
      ...formData,
      vuelos: formData.vuelos?.map((f) =>
        f.id === id ? { ...f, [field]: value } : f
      ) || [],
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
              <Label htmlFor="telefonoResponsable" data-testid="label-telefono-responsable">Teléfono del Responsable</Label>
              <Input
                id="telefonoResponsable"
                data-testid="input-telefono-responsable"
                type="tel"
                placeholder="+57 300 123 4567"
                value={formData.telefonoResponsable || ""}
                onChange={(e) => setFormData({ ...formData, telefonoResponsable: e.target.value })}
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
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Destinos</h2>
              <Button
                variant="outline"
                onClick={addDestination}
                data-testid="button-agregar-destino"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Destino
              </Button>
            </div>
          </Card>

          {formData.destinos?.map((destino) => (
            <div key={destino.id}>
              <div className="flex items-center justify-between mb-2">
                <div></div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeDestination(destino.id)}
                  data-testid={`button-eliminar-destino-${destino.id}`}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar Destino {destino.numero}
                </Button>
              </div>
              <DestinationEditor
                destination={destino}
                onChange={(field, value) => updateDestination(destino.id, field, value)}
                onAddTour={() => addTourToDestination(destino.id)}
                onRemoveTour={(tourId) => removeTourFromDestination(destino.id, tourId)}
                onAddTransfer={() => addTransferToDestination(destino.id)}
                onRemoveTransfer={(transferId) => removeTransferFromDestination(destino.id, transferId)}
              />
            </div>
          ))}

          <Card className="p-6">
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)} data-testid="button-atras-step3">
                Atrás
              </Button>
              <Button onClick={() => setStep(4)} data-testid="button-siguiente-step3">
                Siguiente
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Step 4: Flights */}
      {step === 4 && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Vuelos</h2>
              <Button
                variant="outline"
                onClick={addFlight}
                data-testid="button-agregar-vuelo"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Vuelo
              </Button>
            </div>
          </Card>

          {formData.vuelos?.map((vuelo) => (
            <div key={vuelo.id}>
              <div className="flex items-center justify-between mb-2">
                <div></div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFlight(vuelo.id)}
                  data-testid={`button-eliminar-vuelo-${vuelo.id}`}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar Vuelo
                </Button>
              </div>
              <FlightEditor
                flight={vuelo}
                onChange={(field: keyof Flight, value: any) => updateFlight(vuelo.id, field, value)}
              />
            </div>
          ))}

          <Card className="p-6">
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)} data-testid="button-atras-step4">
                Atrás
              </Button>
              <Button onClick={() => setStep(5)} data-testid="button-siguiente-step4">
                Siguiente
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Step 5: Final Details */}
      {step === 5 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Detalles Finales</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h3 className="font-semibold mb-3 text-green-600">✓ El Paquete Incluye</h3>
                <div className="space-y-2">
                  {formData.incluye?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        value={item}
                        onChange={(e) => {
                          const newIncluye = [...(formData.incluye || [])];
                          newIncluye[idx] = e.target.value;
                          setFormData({ ...formData, incluye: newIncluye });
                        }}
                        placeholder="Elemento incluido"
                        data-testid={`input-incluye-${idx}`}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          const newIncluye = formData.incluye?.filter((_, i) => i !== idx) || [];
                          setFormData({ ...formData, incluye: newIncluye });
                        }}
                        data-testid={`button-eliminar-incluye-${idx}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        incluye: [...(formData.incluye || []), ""],
                      });
                    }}
                    data-testid="button-agregar-incluye"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar
                  </Button>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3 text-red-600">✗ El Paquete No Incluye</h3>
                <div className="space-y-2">
                  {formData.noIncluye?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        value={item}
                        onChange={(e) => {
                          const newNoIncluye = [...(formData.noIncluye || [])];
                          newNoIncluye[idx] = e.target.value;
                          setFormData({ ...formData, noIncluye: newNoIncluye });
                        }}
                        placeholder="Elemento no incluido"
                        data-testid={`input-no-incluye-${idx}`}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          const newNoIncluye = formData.noIncluye?.filter((_, i) => i !== idx) || [];
                          setFormData({ ...formData, noIncluye: newNoIncluye });
                        }}
                        data-testid={`button-eliminar-no-incluye-${idx}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        noIncluye: [...(formData.noIncluye || []), ""],
                      });
                    }}
                    data-testid="button-agregar-no-incluye"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar
                  </Button>
                </div>
              </Card>
            </div>

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
              <Label htmlFor="fechaPlazoPago" data-testid="label-fecha-plazo">Fecha de Plazo de Pago</Label>
              <Input
                id="fechaPlazoPago"
                data-testid="input-fecha-plazo"
                type="date"
                value={formData.fechaPlazoPago || ""}
                onChange={(e) => setFormData({ ...formData, fechaPlazoPago: e.target.value })}
              />
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
