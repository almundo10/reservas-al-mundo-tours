import { z } from "zod";

// Passenger schema
export const passengerSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1, "Nombre requerido"),
  numeroDocumento: z.string().min(1, "Documento requerido"),
  fechaNacimiento: z.string().min(1, "Fecha de nacimiento requerida"),
});

export type Passenger = z.infer<typeof passengerSchema>;

// Flight schema
export const flightSchema = z.object({
  id: z.string(),
  aerolinea: z.string().min(1, "Aerolínea requerida"),
  codigoReserva: z.string().min(1, "Código requerido"),
  salidaHora: z.string().min(1, "Hora de salida requerida"),
  llegadaHora: z.string().min(1, "Hora de llegada requerida"),
  salidaAeropuerto: z.string().min(1, "Aeropuerto de salida requerido"),
  llegadaAeropuerto: z.string().min(1, "Aeropuerto de llegada requerido"),
  fecha: z.string().min(1, "Fecha requerida"),
  duracion: z.string().optional(),
  escalas: z.number().default(0),
  logoAerolinea: z.string().optional(),
  equipajeFacturado: z.string().optional(),
  notas: z.string().optional(),
});

export type Flight = z.infer<typeof flightSchema>;

// Tour schema
export const tourSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1, "Nombre del tour requerido"),
  operador: z.string().optional(),
  descripcion: z.string().optional(),
  duracion: z.string().optional(),
  incluye: z.array(z.string()).default([]),
  noIncluye: z.array(z.string()).default([]),
  categoria: z.string().optional(),
  horaInicio: z.string().optional(),
});

export type Tour = z.infer<typeof tourSchema>;

// Transfer schema
export const transferSchema = z.object({
  id: z.string(),
  tipo: z.string().min(1, "Tipo de vehículo requerido"),
  desde: z.string().min(1, "Origen requerido"),
  hasta: z.string().min(1, "Destino requerido"),
  horaRecogida: z.string().optional(),
  imagenVehiculo: z.string().optional(),
  notas: z.string().optional(),
});

export type Transfer = z.infer<typeof transferSchema>;

// Hotel schema
export const hotelSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1, "Nombre del hotel requerido"),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  numeroReserva: z.string().optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  horaCheckIn: z.string().optional(),
  horaCheckOut: z.string().optional(),
  noches: z.number().default(1),
  numeroHabitaciones: z.number().default(1),
  tipoHabitacion: z.string().optional(),
  planAlimentacion: z.string().optional(),
  fotos: z.array(z.string()).default([]),
  notas: z.string().optional(),
});

export type Hotel = z.infer<typeof hotelSchema>;

// Destination schema
export const destinationSchema = z.object({
  id: z.string(),
  numero: z.number(),
  nombre: z.string().min(1, "Nombre del destino requerido"),
  pais: z.string().default("Colombia"),
  fechaInicio: z.string().min(1, "Fecha de inicio requerida"),
  fechaFin: z.string().min(1, "Fecha de fin requerida"),
  descripcion: z.string().optional(),
  puntosInteres: z.array(z.string()).default([]),
  imagenBanner: z.string().optional(),
  hotel: hotelSchema.optional(),
  tours: z.array(tourSchema).default([]),
  traslados: z.array(transferSchema).default([]),
});

export type Destination = z.infer<typeof destinationSchema>;

// Main reservation schema
export const reservationSchema = z.object({
  id: z.string().optional(),
  codigoReserva: z.string().min(1, "Código de reserva requerido"),
  fechaCreacion: z.string().min(1, "Fecha de creación requerida"),
  nombreCliente: z.string().min(1, "Nombre del cliente requerido"),
  documentoCliente: z.string().min(1, "Documento del cliente requerido"),
  telefonoResponsable: z.string().optional(),
  
  // Passenger counts
  cantidadAdultos: z.number().min(1, "Mínimo 1 adulto"),
  cantidadNinos: z.number().default(0),
  
  // Passengers
  pasajeros: z.array(passengerSchema).default([]),
  
  // Travel dates
  fechaInicioViaje: z.string().min(1, "Fecha de inicio requerida"),
  fechaFinViaje: z.string().min(1, "Fecha de fin requerida"),
  
  // Destinations
  destinos: z.array(destinationSchema).default([]),
  
  // Flights
  vuelos: z.array(flightSchema).default([]),
  
  // Package info
  incluye: z.array(z.string()).default([]),
  noIncluye: z.array(z.string()).default([]),
  
  // Terms and pricing
  terminosCondicionesUrl: z.string().url("URL válida requerida").optional(),
  precioTotal: z.string().optional(),
  abono: z.string().optional(),
  saldoPendiente: z.string().optional(),
  fechaPlazoPago: z.string().optional(),
  
  // Additional notes
  notasGenerales: z.string().optional(),
});

export type Reservation = z.infer<typeof reservationSchema>;

// Image library types
export const imageLibrarySchema = z.object({
  id: z.string(),
  nombre: z.string(),
  url: z.string(), // base64 data URL or external URL
  categoria: z.enum(["destino", "aerolinea", "vehiculo", "hotel"]),
  tags: z.array(z.string()).optional(), // for searching/filtering
  fechaCreacion: z.string(),
});

export type ImageLibrary = z.infer<typeof imageLibrarySchema>;

export const insertImageLibrarySchema = imageLibrarySchema.omit({ id: true, fechaCreacion: true });
export type InsertImageLibrary = z.infer<typeof insertImageLibrarySchema>;

// Agency configuration types
export const agencyConfigSchema = z.object({
  nombre: z.string().default("AL Mundo Tours"),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  email: z.string().email().optional(),
  telefono: z.string().optional(),
  logoUrl: z.string().optional(),
  logoUrlBlanco: z.string().optional(),
});

export type AgencyConfig = z.infer<typeof agencyConfigSchema>;

// Saved reservation types (for storing complete reservations in localStorage)
export const savedReservationSchema = z.object({
  id: z.string(),
  nombreReserva: z.string().optional(), // Optional friendly name for the saved reservation
  fechaGuardado: z.string().datetime(),
  fechaUltimaModificacion: z.string().datetime(),
  reserva: reservationSchema,
});

export type SavedReservation = z.infer<typeof savedReservationSchema>;

export const insertSavedReservationSchema = savedReservationSchema.omit({ 
  id: true, 
  fechaGuardado: true,
  fechaUltimaModificacion: true,
});
export type InsertSavedReservation = z.infer<typeof insertSavedReservationSchema>;
