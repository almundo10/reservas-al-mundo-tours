import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Image as ImageIcon } from "lucide-react";
import { useImageLibrary } from "@/hooks/use-image-library";

interface ImageLibraryProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  category?: "destino" | "aerolinea" | "vehiculo" | "hotel";
}

export function ImageLibrary({ open, onClose, onSelect, category = "destino" }: ImageLibraryProps) {
  const [search, setSearch] = useState("");
  const { getImagesByCategory } = useImageLibrary();

  const images = getImagesByCategory(category);

  const handleSelect = (url: string) => {
    onSelect(url);
    onClose();
  };

  const filteredImages = images.filter(img => 
    search.trim() === "" || 
    img.nombre.toLowerCase().includes(search.toLowerCase()) ||
    img.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]" data-testid="dialog-biblioteca-imagenes">
        <DialogHeader>
          <DialogTitle>Biblioteca de Imágenes - {category === "destino" ? "Destinos" : category === "aerolinea" ? "Aerolíneas" : category === "vehiculo" ? "Vehículos" : "Hoteles"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              data-testid="input-buscar-imagen"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredImages.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {search ? "No se encontraron imágenes" : "No hay imágenes en esta categoría"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Agrega imágenes desde la biblioteca
                </p>
              </div>
            ) : (
              filteredImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => handleSelect(img.url)}
                  className="group relative aspect-video bg-muted rounded-lg overflow-hidden hover-elevate active-elevate-2 border"
                  data-testid={`image-item-${img.id}`}
                >
                  <img
                    src={img.url}
                    alt={img.nombre}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">
                    <p className="text-xs truncate">{img.nombre}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
