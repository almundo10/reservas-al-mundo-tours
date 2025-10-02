import { PDFPreview } from '../PDFPreview';
import type { Reservation } from '@shared/schema';

export default function PDFPreviewExample() {
  //todo: remove mock functionality
  const mockReservation: Reservation = {
    id: '1',
    codigoReserva: 'AL4167',
    fechaCreacion: '30 de septiembre de 2025',
    nombreCliente: 'Jesus Hernando Castillo',
    documentoCliente: '1116245015',
    cantidadAdultos: 4,
    cantidadNinos: 1,
    pasajeros: [
      {
        id: '1',
        nombre: 'Jesus Hernando Castillo Vargas',
        numeroDocumento: '1116245015',
        fechaNacimiento: '28/09/1989'
      }
    ],
    fechaInicioViaje: '21 oct 2025',
    fechaFinViaje: '24 oct 2025',
    destinos: [
      {
        id: '1',
        numero: 1,
        nombre: 'San Andrés',
        pais: 'Colombia',
        fechaInicio: '21 oct 2025',
        fechaFin: '24 oct 2025',
        tours: [],
        traslados: [],
        puntosInteres: []
      }
    ],
    vuelos: [],
    incluye: [],
    noIncluye: []
  };

  const handleDownload = () => {
    console.log('Downloading PDF...');
  };

  return <PDFPreview reservation={mockReservation} onDownload={handleDownload} />;
}
