import jsPDF from "jspdf";
import type { Reservation } from "@shared/schema";

export class PDFGenerator {
  private doc: jsPDF;
  private pageHeight: number;
  private pageWidth: number;
  private margin: number = 20;
  private currentY: number = 20;
  private primaryColor = "#242553";
  private orangeColor = "#F07E1A";
  private purpleColor = "#74388D";
  private cyanColor = "#50BFD6";
  private textColor = "#333333";
  private lightGray = "#f5f5f5";
  private logoData: string | null = null;
  private currentPageNumber: number = 1;

  constructor() {
    this.doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    this.pageHeight = this.doc.internal.pageSize.height;
    this.pageWidth = this.doc.internal.pageSize.width;
  }

  async generate(reservation: Reservation): Promise<Blob> {
    try {
      this.logoData = await this.loadImageAsDataURL("/attached_assets/logo_1759457415381.png");
    } catch (error) {
      console.warn("Could not load logo, will use text fallback", error);
    }

    await this.addCoverPage(reservation);
    
    await this.addItinerary(reservation);
    await this.addFlightsPage(reservation);
    await this.addPackageDetails(reservation);
    await this.addTermsAndConditions(reservation);

    return this.doc.output("blob");
  }

  private async addCoverPage(reservation: Reservation) {
    this.currentY = 20;
    this.currentPageNumber = 1;

    this.addHeader();

    if (reservation.destinos && reservation.destinos[0]?.imagenBanner) {
      this.currentY += 10;
      const bannerHeight = 50;
      const bannerWidth = this.pageWidth - 2 * this.margin;
      
      try {
        const bannerUrl = reservation.destinos[0].imagenBanner;
        if (bannerUrl && bannerUrl.startsWith('http')) {
          const imgData = await this.loadImageAsDataURL(bannerUrl);
          this.doc.addImage(imgData, 'JPEG', this.margin, this.currentY, bannerWidth, bannerHeight);
          
          this.doc.setFillColor(0, 0, 0, 0.4);
          this.doc.rect(this.margin, this.currentY, bannerWidth, bannerHeight, "F");
        } else {
          this.doc.setFillColor(this.primaryColor);
          this.doc.rect(this.margin, this.currentY, bannerWidth, bannerHeight, "F");
        }
      } catch (error) {
        console.warn("Could not load banner image, using fallback", error);
        this.doc.setFillColor(this.primaryColor);
        this.doc.rect(this.margin, this.currentY, bannerWidth, bannerHeight, "F");
      }
      
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(24);
      this.doc.setFont("helvetica", "bold");
      const destinoNombre = reservation.destinos[0]?.nombre || "Su Destino";
      this.doc.text(destinoNombre, this.pageWidth / 2, this.currentY + 30, { align: "center" });
      
      this.currentY += bannerHeight + 10;
    }

    this.doc.setTextColor(this.textColor);
    this.doc.setFontSize(28);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(`Reserva ${reservation.codigoReserva}`, this.pageWidth / 2, this.currentY + 10, {
      align: "center",
    });

    this.currentY += 20;
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(`Creado: ${reservation.fechaCreacion}`, this.pageWidth / 2, this.currentY, {
      align: "center",
    });

    this.currentY += 20;
    this.addTravelInfo(reservation);

    this.currentY += 15;
    this.addGlossary(reservation);

    this.currentY += 20;
    this.addPassengerList(reservation);

    this.addFooter();
  }

  private addHeader() {
    this.doc.setFillColor(this.primaryColor);
    this.doc.rect(0, 0, this.pageWidth, 15, "F");
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("AL Mundo Tours", this.margin, 10);
    
    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", "normal");
    this.doc.text("Tu viaje comienza aquí", this.pageWidth - this.margin, 10, { align: "right" });
  }

  private addTravelInfo(reservation: Reservation) {
    this.doc.setFillColor(this.lightGray);
    const boxHeight = 30;
    this.doc.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, boxHeight, "F");

    this.doc.setTextColor(this.textColor);
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Su Viaje", this.margin + 10, this.currentY + 8);

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(9);
    const travelInfo = `En base a ${reservation.cantidadAdultos} adulto(s)${
      reservation.cantidadNinos > 0 ? `, ${reservation.cantidadNinos} niño(s)` : ""
    }`;
    this.doc.text(travelInfo, this.margin + 10, this.currentY + 14);
    this.doc.text(
      `${reservation.fechaInicioViaje} - ${reservation.fechaFinViaje}`,
      this.margin + 10,
      this.currentY + 20
    );

    const midPoint = this.pageWidth / 2 + 10;
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Contacto", midPoint, this.currentY + 8);

    this.doc.setFont("helvetica", "normal");
    this.doc.text(reservation.nombreCliente, midPoint, this.currentY + 14);
    this.doc.setFontSize(9);
    this.doc.setTextColor(120, 120, 120);
    this.doc.text(`Doc: ${reservation.documentoCliente}`, midPoint, this.currentY + 20);

    this.currentY += boxHeight;
  }

  private addGlossary(reservation: Reservation) {
    this.doc.setTextColor(this.orangeColor);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Glosario", this.margin, this.currentY);

    this.currentY += 8;
    const itemWidth = (this.pageWidth - 2 * this.margin) / 4;
    const startX = this.margin;

    const glossaryItems = [
      { label: "Destinos", value: reservation.destinos?.length || 0, color: this.primaryColor },
      { label: "Vuelos", value: reservation.vuelos?.length || 0, color: this.orangeColor },
      { label: "Pasajeros", value: reservation.pasajeros?.length || 0, color: this.purpleColor },
      {
        label: "Tours",
        value: reservation.destinos?.reduce((acc, d) => acc + (d.tours?.length || 0), 0) || 0,
        color: this.cyanColor,
      },
    ];

    glossaryItems.forEach((item, idx) => {
      const x = startX + idx * itemWidth;
      
      this.doc.setFillColor(this.lightGray);
      this.doc.rect(x, this.currentY, itemWidth - 5, 20, "F");

      this.doc.setFontSize(18);
      this.doc.setFont("helvetica", "bold");
      this.doc.setTextColor(item.color);
      this.doc.text(item.value.toString(), x + itemWidth / 2 - 2.5, this.currentY + 10, {
        align: "center",
      });

      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      this.doc.setTextColor(this.textColor);
      this.doc.text(item.label, x + itemWidth / 2 - 2.5, this.currentY + 16, { align: "center" });
    });

    this.currentY += 20;
  }

  private addPassengerList(reservation: Reservation) {
    if (!reservation.pasajeros || reservation.pasajeros.length === 0) {
      return;
    }

    this.doc.setTextColor(this.textColor);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Lista de Pasajeros", this.margin, this.currentY);

    this.currentY += 8;

    reservation.pasajeros.forEach((pasajero, idx) => {
      if (this.currentY > this.pageHeight - 40) {
        this.addNewPage();
      }

      if (idx % 2 === 0) {
        this.doc.setFillColor(245, 245, 245);
      } else {
        this.doc.setFillColor(255, 255, 255);
      }
      this.doc.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 12, "F");

      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "normal");
      this.doc.setTextColor(this.textColor);
      this.doc.text(`${idx + 1}. ${pasajero.nombre}`, this.margin + 5, this.currentY + 6);

      this.doc.setFontSize(9);
      this.doc.setTextColor(120, 120, 120);
      this.doc.text(
        `Doc: ${pasajero.numeroDocumento} | F. Nac: ${pasajero.fechaNacimiento}`,
        this.margin + 5,
        this.currentY + 10
      );

      this.currentY += 12;
    });
  }

  private async addItinerary(reservation: Reservation) {
    if (!reservation.destinos || reservation.destinos.length === 0) {
      return;
    }

    this.addNewPage();

    this.doc.setTextColor(this.textColor);
    this.doc.setFontSize(16);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Itinerario del Viaje", this.margin, this.currentY);

    this.currentY += 10;

    for (const destino of reservation.destinos) {
      if (this.currentY > this.pageHeight - 80) {
        this.addNewPage();
      }

      this.doc.setFillColor(this.primaryColor);
      this.doc.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 10, "F");

      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(12);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(
        `${destino.numero}. ${destino.nombre}, ${destino.pais}`,
        this.margin + 5,
        this.currentY + 7
      );

      this.currentY += 15;

      this.doc.setTextColor(this.textColor);
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(
        `${destino.fechaInicio} - ${destino.fechaFin}`,
        this.margin + 5,
        this.currentY
      );

      if (destino.descripcion) {
        this.currentY += 6;
        const lines = this.doc.splitTextToSize(destino.descripcion, this.pageWidth - 2 * this.margin - 10);
        this.doc.text(lines, this.margin + 5, this.currentY);
        this.currentY += lines.length * 5;
      }

      this.currentY += 5;

      if (destino.hotel) {
        await this.addHotelSection(destino.hotel);
      }

      if (destino.tours && destino.tours.length > 0) {
        this.addToursSection(destino.tours);
      }

      if (destino.traslados && destino.traslados.length > 0) {
        this.addTransfersSection(destino.traslados);
      }

      this.currentY += 10;
    }
  }

  private async addHotelSection(hotel: any) {
    this.doc.setFillColor(240, 245, 255);
    this.doc.rect(this.margin + 5, this.currentY, this.pageWidth - 2 * this.margin - 10, 8, "F");

    this.doc.setTextColor(this.orangeColor);
    this.doc.setFontSize(11);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(`🏨 ${hotel.nombre}`, this.margin + 10, this.currentY + 5);

    this.currentY += 12;

    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(this.textColor);
    const hotelDetails = [];
    if (hotel.tipoHabitacion) hotelDetails.push(`Habitación: ${hotel.tipoHabitacion}`);
    if (hotel.planAlimentacion) hotelDetails.push(`Plan: ${hotel.planAlimentacion}`);
    if (hotel.noches) hotelDetails.push(`${hotel.noches} noche(s)`);

    if (hotelDetails.length > 0) {
      this.doc.text(hotelDetails.join(" | "), this.margin + 10, this.currentY);
      this.currentY += 5;
    }

    if (hotel.checkIn && hotel.checkOut) {
      this.doc.text(
        `Check-in: ${hotel.checkIn} | Check-out: ${hotel.checkOut}`,
        this.margin + 10,
        this.currentY
      );
      this.currentY += 5;
    }

    if (hotel.fotos && hotel.fotos.length > 0) {
      this.currentY += 3;
      const photoWidth = 30;
      const photoHeight = 20;
      const photosPerRow = 3;
      const gap = 3;

      for (let i = 0; i < Math.min(hotel.fotos.length, 6); i++) {
        const col = i % photosPerRow;
        const row = Math.floor(i / photosPerRow);
        const xPos = this.margin + 10 + col * (photoWidth + gap);
        const yPos = this.currentY + row * (photoHeight + gap);

        if (this.currentY + (row + 1) * (photoHeight + gap) > this.pageHeight - 40) {
          break;
        }

        try {
          const photoUrl = hotel.fotos[i];
          if (photoUrl && photoUrl.startsWith('http')) {
            const imgData = await this.loadImageAsDataURL(photoUrl);
            this.doc.addImage(imgData, 'JPEG', xPos, yPos, photoWidth, photoHeight);
          } else {
            this.doc.setFillColor(220, 220, 220);
            this.doc.rect(xPos, yPos, photoWidth, photoHeight, "F");
          }
        } catch (error) {
          console.warn("Could not load hotel photo", error);
          this.doc.setFillColor(220, 220, 220);
          this.doc.rect(xPos, yPos, photoWidth, photoHeight, "F");
        }
      }

      const rows = Math.ceil(Math.min(hotel.fotos.length, 6) / photosPerRow);
      this.currentY += rows * (photoHeight + gap) + 3;
    }

    this.currentY += 5;
  }

  private addToursSection(tours: any[]) {
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(this.purpleColor);
    this.doc.text("Tours y Excursiones", this.margin + 5, this.currentY);

    this.currentY += 6;

    tours.forEach((tour, idx) => {
      if (this.currentY > this.pageHeight - 40) {
        this.addNewPage();
      }

      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "bold");
      this.doc.setTextColor(this.textColor);
      this.doc.text(`• ${tour.nombre}`, this.margin + 10, this.currentY);

      this.currentY += 5;

      if (tour.descripcion) {
        this.doc.setFont("helvetica", "normal");
        this.doc.setFontSize(9);
        const lines = this.doc.splitTextToSize(tour.descripcion, this.pageWidth - 2 * this.margin - 20);
        this.doc.text(lines, this.margin + 12, this.currentY);
        this.currentY += lines.length * 4;
      }

      if (tour.duracion || tour.horaInicio) {
        this.doc.setFontSize(9);
        this.doc.setTextColor(120, 120, 120);
        const tourInfo = [];
        if (tour.duracion) tourInfo.push(`Duración: ${tour.duracion}`);
        if (tour.horaInicio) tourInfo.push(`Hora: ${tour.horaInicio}`);
        this.doc.text(tourInfo.join(" | "), this.margin + 12, this.currentY);
        this.currentY += 4;
      }

      this.currentY += 3;
    });

    this.currentY += 2;
  }

  private addTransfersSection(transfers: any[]) {
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(this.cyanColor);
    this.doc.text("Traslados", this.margin + 5, this.currentY);

    this.currentY += 6;

    transfers.forEach((transfer) => {
      if (this.currentY > this.pageHeight - 40) {
        this.addNewPage();
      }

      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      this.doc.setTextColor(this.textColor);
      this.doc.text(
        `🚗 ${transfer.tipo}: ${transfer.desde} → ${transfer.hasta}`,
        this.margin + 10,
        this.currentY
      );

      if (transfer.horaRecogida) {
        this.currentY += 4;
        this.doc.setFontSize(9);
        this.doc.setTextColor(120, 120, 120);
        this.doc.text(`Recogida: ${transfer.horaRecogida}`, this.margin + 12, this.currentY);
      }

      this.currentY += 6;
    });

    this.currentY += 2;
  }

  private async addFlightsPage(reservation: Reservation) {
    if (!reservation.vuelos || reservation.vuelos.length === 0) {
      return;
    }

    this.addNewPage();

    this.doc.setTextColor(this.purpleColor);
    this.doc.setFontSize(16);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Información de Vuelos", this.margin, this.currentY);

    this.currentY += 10;

    for (const vuelo of reservation.vuelos) {
      if (this.currentY > this.pageHeight - 70) {
        this.addNewPage();
      }

      this.doc.setFillColor(this.lightGray);
      const boxHeight = vuelo.logoAerolinea ? 55 : 45;
      this.doc.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, boxHeight, "F");

      if (vuelo.logoAerolinea) {
        try {
          const logoUrl = vuelo.logoAerolinea;
          if (logoUrl && logoUrl.startsWith('http')) {
            const imgData = await this.loadImageAsDataURL(logoUrl);
            this.doc.addImage(imgData, 'PNG', this.pageWidth - this.margin - 25, this.currentY + 5, 20, 10);
          }
        } catch (error) {
          console.warn("Could not load airline logo", error);
        }
      }

      this.doc.setFontSize(11);
      this.doc.setFont("helvetica", "bold");
      this.doc.setTextColor(this.primaryColor);
      this.doc.text(`✈ ${vuelo.aerolinea}`, this.margin + 5, this.currentY + 7);

      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      this.doc.setTextColor(this.textColor);
      this.doc.text(`Código de reserva: ${vuelo.codigoReserva}`, this.margin + 5, this.currentY + 13);
      this.doc.text(`Fecha: ${vuelo.fecha}`, this.margin + 5, this.currentY + 18);

      this.currentY += 23;

      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "bold");
      this.doc.text("Salida:", this.margin + 5, this.currentY);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(
        `${vuelo.salidaAeropuerto} - ${vuelo.salidaHora}`,
        this.margin + 25,
        this.currentY
      );

      this.currentY += 6;

      this.doc.setFont("helvetica", "bold");
      this.doc.text("Llegada:", this.margin + 5, this.currentY);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(
        `${vuelo.llegadaAeropuerto} - ${vuelo.llegadaHora}`,
        this.margin + 25,
        this.currentY
      );

      this.currentY += 6;

      const flightInfo = [];
      if (vuelo.duracion) flightInfo.push(`Duración: ${vuelo.duracion}`);
      if (vuelo.escalas !== undefined) flightInfo.push(`Escalas: ${vuelo.escalas}`);
      if (vuelo.equipajeFacturado) flightInfo.push(`Equipaje: ${vuelo.equipajeFacturado}`);

      if (flightInfo.length > 0) {
        this.doc.setFontSize(9);
        this.doc.setTextColor(120, 120, 120);
        this.doc.text(flightInfo.join(" | "), this.margin + 5, this.currentY);
      }

      this.currentY += 12;
    }
  }

  private async addPackageDetails(reservation: Reservation) {
    this.addNewPage();

    this.doc.setTextColor(this.textColor);
    this.doc.setFontSize(16);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Detalles del Paquete", this.margin, this.currentY);

    this.currentY += 15;

    const colWidth = (this.pageWidth - 2 * this.margin - 10) / 2;

    if (reservation.incluye && reservation.incluye.length > 0) {
      this.doc.setFillColor(220, 255, 220);
      this.doc.rect(this.margin, this.currentY, colWidth, 10, "F");

      this.doc.setFontSize(11);
      this.doc.setFont("helvetica", "bold");
      this.doc.setTextColor(0, 128, 0);
      this.doc.text("✓ El Paquete Incluye", this.margin + 5, this.currentY + 7);

      this.currentY += 15;

      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      this.doc.setTextColor(this.textColor);

      reservation.incluye.forEach((item) => {
        if (item && item.trim()) {
          if (this.currentY > this.pageHeight - 40) {
            this.addNewPage();
          }
          this.doc.text(`• ${item}`, this.margin + 5, this.currentY);
          this.currentY += 5;
        }
      });

      this.currentY += 5;
    }

    const noIncluyeStartY = 30 + 15;

    if (reservation.noIncluye && reservation.noIncluye.length > 0) {
      const xPos = this.margin + colWidth + 10;

      this.doc.setFillColor(255, 220, 220);
      this.doc.rect(xPos, noIncluyeStartY, colWidth, 10, "F");

      this.doc.setFontSize(11);
      this.doc.setFont("helvetica", "bold");
      this.doc.setTextColor(200, 0, 0);
      this.doc.text("✗ El Paquete No Incluye", xPos + 5, noIncluyeStartY + 7);

      let yPos = noIncluyeStartY + 15;

      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      this.doc.setTextColor(this.textColor);

      reservation.noIncluye.forEach((item) => {
        if (item && item.trim()) {
          this.doc.text(`• ${item}`, xPos + 5, yPos);
          yPos += 5;
        }
      });
    }

    if (reservation.precioTotal || reservation.abono || reservation.saldoPendiente) {
      this.currentY = Math.max(this.currentY, 140);

      this.doc.setFillColor(this.orangeColor);
      this.doc.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 10, "F");

      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(12);
      this.doc.setFont("helvetica", "bold");
      this.doc.text("Información de Pago", this.margin + 5, this.currentY + 7);

      this.currentY += 15;

      this.doc.setTextColor(this.textColor);
      this.doc.setFontSize(11);

      if (reservation.precioTotal) {
        this.doc.text("Precio Total:", this.margin + 10, this.currentY);
        this.doc.setFont("helvetica", "bold");
        this.doc.text(reservation.precioTotal, this.pageWidth - this.margin - 10, this.currentY, {
          align: "right",
        });
        this.currentY += 8;
      }

      if (reservation.abono) {
        this.doc.setFont("helvetica", "normal");
        this.doc.text("Abono:", this.margin + 10, this.currentY);
        this.doc.setFont("helvetica", "bold");
        this.doc.text(reservation.abono, this.pageWidth - this.margin - 10, this.currentY, {
          align: "right",
        });
        this.currentY += 8;
      }

      if (reservation.saldoPendiente) {
        this.doc.setFont("helvetica", "normal");
        this.doc.text("Saldo Pendiente:", this.margin + 10, this.currentY);
        this.doc.setFont("helvetica", "bold");
        this.doc.setTextColor(200, 0, 0);
        this.doc.text(reservation.saldoPendiente, this.pageWidth - this.margin - 10, this.currentY, {
          align: "right",
        });
      }
    }
  }

  private async addTermsAndConditions(reservation: Reservation) {
    this.addNewPage();

    this.doc.setTextColor(this.textColor);
    this.doc.setFontSize(16);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Términos y Condiciones", this.margin, this.currentY);

    this.currentY += 15;

    if (reservation.terminosCondicionesUrl) {
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(
        "Para ver los términos y condiciones completos, visite:",
        this.margin,
        this.currentY
      );

      this.currentY += 8;

      this.doc.setTextColor(this.primaryColor);
      this.doc.textWithLink(reservation.terminosCondicionesUrl, this.margin, this.currentY, {
        url: reservation.terminosCondicionesUrl,
      });

      this.currentY += 15;
    }

    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(this.textColor);

    const legalText =
      "AL Mundo Tours se acoge a la ley 679 del 2001 para la protección de los niños, niñas y adolescentes contra la explotación, la pornografía y el turismo sexual. La persona que atente contra los niños del país será denunciada a las autoridades. Advertimos a todos nuestros clientes que la explotación y abuso sexual de menores de edad en el país son sancionados penal y administrativamente.";

    const legalLines = this.doc.splitTextToSize(legalText, this.pageWidth - 2 * this.margin);
    this.doc.text(legalLines, this.margin, this.currentY);

    this.currentY += legalLines.length * 5 + 15;

    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(this.primaryColor);
    const closingMessage = "Gracias por viajar con AL Mundo Tours, tu viaje comienza aquí";
    this.doc.text(closingMessage, this.pageWidth / 2, this.currentY, { align: "center" });

    if (reservation.notasGenerales) {
      this.currentY += 15;

      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "bold");
      this.doc.setTextColor(this.textColor);
      this.doc.text("Notas Adicionales", this.margin, this.currentY);

      this.currentY += 7;

      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(9);
      const notasLines = this.doc.splitTextToSize(
        reservation.notasGenerales,
        this.pageWidth - 2 * this.margin
      );
      this.doc.text(notasLines, this.margin, this.currentY);
    }
  }

  private async loadImageAsDataURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/jpeg", 0.8);
        resolve(dataURL);
      };
      
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${url}`));
      };
      
      img.src = url;
    });
  }

  private addNewPage() {
    this.doc.addPage();
    this.currentPageNumber++;
    this.currentY = 30;
    this.addHeader();
    this.addFooter();
  }

  private addFooter() {
    const footerY = this.pageHeight - 18;

    this.doc.setDrawColor(this.orangeColor);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, footerY - 3, this.pageWidth - this.margin, footerY - 3);

    // Logo on the left
    if (this.logoData) {
      try {
        this.doc.addImage(this.logoData, 'PNG', this.margin, footerY - 2, 25, 12);
      } catch (error) {
        console.warn("Could not add logo to footer", error);
        this.doc.setFontSize(9);
        this.doc.setTextColor(100, 100, 100);
        this.doc.setFont("helvetica", "bold");
        this.doc.text("AL Mundo Tours", this.margin, footerY + 3);
      }
    } else {
      this.doc.setFontSize(9);
      this.doc.setTextColor(100, 100, 100);
      this.doc.setFont("helvetica", "bold");
      this.doc.text("AL Mundo Tours", this.margin, footerY + 3);
    }

    // Company info in center
    this.doc.setFontSize(9);
    this.doc.setTextColor(100, 100, 100);
    this.doc.setFont("helvetica", "normal");
    this.doc.text("Calle 38 No 21-31, Tuluá – Colombia", this.pageWidth / 2, footerY + 2, { align: "center" });
    this.doc.text("Tel: +57 (601) 745 89 00 | infos@almundotours.com", this.pageWidth / 2, footerY + 6, { align: "center" });

    // Page number on the right
    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(`Página ${this.currentPageNumber}`, this.pageWidth - this.margin, footerY + 4, { align: "right" });
  }
}

export async function generateReservationPDF(reservation: Reservation): Promise<Blob> {
  const generator = new PDFGenerator();
  return await generator.generate(reservation);
}
