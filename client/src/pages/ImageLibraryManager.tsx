import { useState } from "react";
import { useImageLibrary } from "@/hooks/use-image-library";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ImageIcon, Upload, Trash2, Edit, Filter } from "lucide-react";
import type { ImageLibrary as ImageLibraryType } from "@shared/schema";

export default function ImageLibraryManager() {
  const { images, addImage, deleteImage, updateImage } = useImageLibrary();
  const { toast } = useToast();
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageLibraryType | null>(null);

  const [uploadForm, setUploadForm] = useState({
    nombre: "",
    categoria: "hotel" as ImageLibraryType["categoria"],
    tags: "",
    url: "",
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de imagen válido",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen no debe superar 2MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setUploadForm({ ...uploadForm, url: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!uploadForm.nombre || !uploadForm.url) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    addImage({
      nombre: uploadForm.nombre,
      categoria: uploadForm.categoria,
      url: uploadForm.url,
      tags: uploadForm.tags ? uploadForm.tags.split(",").map(t => t.trim()) : [],
    });

    toast({
      title: "Imagen agregada",
      description: "La imagen se ha agregado a la biblioteca",
    });

    setUploadForm({ nombre: "", categoria: "hotel", tags: "", url: "" });
    setUploadDialogOpen(false);
  };

  const handleEdit = () => {
    if (!selectedImage) return;

    updateImage(selectedImage.id, {
      nombre: selectedImage.nombre,
      tags: selectedImage.tags,
    });

    toast({
      title: "Imagen actualizada",
      description: "Los cambios se han guardado correctamente",
    });

    setEditDialogOpen(false);
    setSelectedImage(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta imagen?")) {
      deleteImage(id);
      toast({
        title: "Imagen eliminada",
        description: "La imagen se ha eliminado de la biblioteca",
      });
    }
  };

  const filteredImages = filterCategory === "all" 
    ? images 
    : images.filter(img => img.categoria === filterCategory);

  const categories = [
    { value: "all", label: "Todas" },
    { value: "hotel", label: "Hoteles" },
    { value: "destino", label: "Destinos" },
    { value: "aerolinea", label: "Aerolíneas" },
    { value: "vehiculo", label: "Vehículos" },
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ImageIcon className="w-8 h-8" />
          Biblioteca de Imágenes
        </h1>
        <p className="text-muted-foreground mt-2">
          Gestiona las imágenes para hoteles, destinos, aerolíneas y vehículos
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]" data-testid="select-filter-category">
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-upload-image">
              <Upload className="w-4 h-4 mr-2" />
              Subir Imagen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Subir Nueva Imagen</DialogTitle>
              <DialogDescription>Agrega una imagen a la biblioteca</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="upload-nombre">Nombre</Label>
                <Input
                  id="upload-nombre"
                  data-testid="input-upload-nombre"
                  value={uploadForm.nombre}
                  onChange={(e) => setUploadForm({ ...uploadForm, nombre: e.target.value })}
                  placeholder="Ej: Hotel Paradise - Piscina"
                />
              </div>

              <div>
                <Label htmlFor="upload-categoria">Categoría</Label>
                <Select
                  value={uploadForm.categoria}
                  onValueChange={(value) => setUploadForm({ ...uploadForm, categoria: value as any })}
                >
                  <SelectTrigger id="upload-categoria" data-testid="select-upload-categoria">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel">Hoteles</SelectItem>
                    <SelectItem value="destino">Destinos</SelectItem>
                    <SelectItem value="aerolinea">Aerolíneas</SelectItem>
                    <SelectItem value="vehiculo">Vehículos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="upload-tags">Tags (separados por comas)</Label>
                <Input
                  id="upload-tags"
                  data-testid="input-upload-tags"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                  placeholder="Ej: piscina, exterior, vista"
                />
              </div>

              <div>
                <Label htmlFor="upload-file">Archivo de Imagen (max 2MB)</Label>
                <Input
                  id="upload-file"
                  data-testid="input-upload-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>

              {uploadForm.url && (
                <div className="mt-2">
                  <img 
                    src={uploadForm.url} 
                    alt="Preview" 
                    className="w-full h-40 object-cover rounded-md"
                    data-testid="img-upload-preview"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)} data-testid="button-cancel-upload">
                Cancelar
              </Button>
              <Button onClick={handleUpload} data-testid="button-confirm-upload">
                Agregar Imagen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {filteredImages.length === 0 ? (
        <Card className="p-12 text-center">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No hay imágenes</h3>
          <p className="text-muted-foreground mb-4">
            {filterCategory === "all" 
              ? "Comienza subiendo tu primera imagen" 
              : "No hay imágenes en esta categoría"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <Card key={image.id} className="overflow-hidden" data-testid={`card-image-${image.id}`}>
              <div className="aspect-video relative bg-muted">
                <img
                  src={image.url}
                  alt={image.nombre}
                  className="w-full h-full object-cover"
                  data-testid={`img-${image.id}`}
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm mb-1 truncate" data-testid={`text-nombre-${image.id}`}>
                  {image.nombre}
                </h3>
                <p className="text-xs text-muted-foreground mb-2 capitalize">
                  {image.categoria}
                </p>
                {image.tags && image.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {image.tags.slice(0, 3).map((tag, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs bg-secondary px-2 py-0.5 rounded"
                        data-testid={`tag-${image.id}-${idx}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedImage(image);
                      setEditDialogOpen(true);
                    }}
                    data-testid={`button-edit-${image.id}`}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDelete(image.id)}
                    data-testid={`button-delete-${image.id}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Imagen</DialogTitle>
            <DialogDescription>Modifica el nombre y tags de la imagen</DialogDescription>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div>
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.nombre}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              </div>
              <div>
                <Label htmlFor="edit-nombre">Nombre</Label>
                <Input
                  id="edit-nombre"
                  data-testid="input-edit-nombre"
                  value={selectedImage.nombre}
                  onChange={(e) => setSelectedImage({ ...selectedImage, nombre: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-tags">Tags (separados por comas)</Label>
                <Input
                  id="edit-tags"
                  data-testid="input-edit-tags"
                  value={selectedImage.tags?.join(", ") || ""}
                  onChange={(e) => setSelectedImage({ 
                    ...selectedImage, 
                    tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean)
                  })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} data-testid="button-cancel-edit">
              Cancelar
            </Button>
            <Button onClick={handleEdit} data-testid="button-confirm-edit">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
