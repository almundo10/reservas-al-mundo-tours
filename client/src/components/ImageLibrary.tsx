import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Image as ImageIcon } from "lucide-react";

interface ImageLibraryProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  category?: "destino" | "aerolinea" | "vehiculo" | "hotel";
}

export function ImageLibrary({ open, onClose, onSelect, category = "destino" }: ImageLibraryProps) {
  const [search, setSearch] = useState("");

  //todo: remove mock functionality
  const mockImages = {
    destino: [
      { id: '1', name: 'San Andrés - Playa', url: '/images/san-andres.jpg', destination: 'San Andrés' },
      { id: '2', name: 'Cartagena - Centro Histórico', url: '/images/cartagena.jpg', destination: 'Cartagena' },
      { id: '3', name: 'Eje Cafetero - Paisaje', url: '/images/eje-cafetero.jpg', destination: 'Eje Cafetero' },
    ],
    aerolinea: [
      { id: '4', name: 'Avianca', url: '/images/avianca-logo.png' },
      { id: '5', name: 'LATAM', url: '/images/latam-logo.png' },
      { id: '6', name: 'Viva Air', url: '/images/viva-logo.png' },
    ],
    vehiculo: [
      { id: '7', name: 'Sedán Estándar', url: '/images/sedan.jpg' },
      { id: '8', name: 'Van Ejecutiva', url: '/images/van.jpg' },
      { id: '9', name: 'Bus Turístico', url: '/images/bus.jpg' },
    ],
    hotel: [
      { id: '10', name: 'Hotel Caribe - Exterior', url: '/images/hotel1.jpg' },
      { id: '11', name: 'Hotel Caribe - Habitación', url: '/images/hotel2.jpg' },
      { id: '12', name: 'Hotel Caribe - Piscina', url: '/images/hotel3.jpg' },
    ],
  };

  const images = mockImages[category] || [];

  const handleSelect = (url: string) => {
    onSelect(url);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]" data-testid="dialog-biblioteca-imagenes">
        <DialogHeader>
          <DialogTitle>Biblioteca de Imágenes</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar imágenes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              data-testid="input-buscar-imagen"
            />
          </div>

          <Tabs defaultValue={category} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="destino" data-testid="tab-destinos">Destinos</TabsTrigger>
              <TabsTrigger value="aerolinea" data-testid="tab-aerolineas">Aerolíneas</TabsTrigger>
              <TabsTrigger value="vehiculo" data-testid="tab-vehiculos">Vehículos</TabsTrigger>
              <TabsTrigger value="hotel" data-testid="tab-hoteles">Hoteles</TabsTrigger>
            </TabsList>

            <TabsContent value={category} className="mt-4">
              <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {images.map((img: any) => (
                  <button
                    key={img.id}
                    onClick={() => handleSelect(img.url)}
                    className="group relative aspect-video bg-muted rounded-lg overflow-hidden hover-elevate active-elevate-2 border"
                    data-testid={`image-item-${img.id}`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">
                      <p className="text-xs truncate">{img.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
