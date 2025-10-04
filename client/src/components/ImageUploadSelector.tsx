import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { ImageLibrary } from "@/components/ImageLibrary";

interface ImageUploadSelectorProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  helpText?: string;
  testId?: string;
  category?: "destino" | "aerolinea" | "vehiculo" | "hotel";
}

export function ImageUploadSelector({
  label,
  value,
  onChange,
  helpText,
  testId,
  category = "destino",
}: ImageUploadSelectorProps) {
  const [showLibrary, setShowLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (1MB limit)
    if (file.size > 1024 * 1024) {
      alert("El archivo es demasiado grande. El tamaño máximo es 1MB.");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido.");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onChange(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLibrarySelect = (url: string) => {
    onChange(url);
    setShowLibrary(false);
  };

  return (
    <div className="space-y-3">
      <Label data-testid={`${testId}-label`}>{label}</Label>
      
      {value && (
        <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden border">
          <img
            src={value}
            alt={label}
            className="w-full h-full object-contain"
            data-testid={`${testId}-preview`}
          />
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            data-testid={`${testId}-remove`}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          data-testid={`${testId}-file-input`}
        />
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => fileInputRef.current?.click()}
          data-testid={`${testId}-upload`}
        >
          <Upload className="w-4 h-4 mr-2" />
          Subir Imagen
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setShowLibrary(true)}
          data-testid={`${testId}-library`}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Biblioteca
        </Button>
      </div>

      {helpText && (
        <p className="text-sm text-muted-foreground" data-testid={`${testId}-help`}>
          {helpText}
        </p>
      )}

      <ImageLibrary
        open={showLibrary}
        onClose={() => setShowLibrary(false)}
        onSelect={handleLibrarySelect}
        category={category}
      />
    </div>
  );
}
