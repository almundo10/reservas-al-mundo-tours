import { useState, useEffect } from "react";
import type { ImageLibrary, InsertImageLibrary } from "@shared/schema";

const STORAGE_KEY = "almundo_image_library";

export function useImageLibrary() {
  const [images, setImages] = useState<ImageLibrary[]>([]);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setImages(parsed);
      } catch (error) {
        console.error("Error loading image library:", error);
        setStorageError("Error al cargar la biblioteca de imágenes");
      }
    }
  }, []);

  const saveToStorage = (newImages: ImageLibrary[]): { success: boolean; error?: string } => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newImages));
      setImages(newImages);
      setStorageError(null);
      return { success: true };
    } catch (error) {
      let errorMessage: string;
      if (error instanceof Error && error.name === "QuotaExceededError") {
        errorMessage = "No hay suficiente espacio de almacenamiento. Por favor elimina algunas imágenes o reduce su tamaño.";
      } else {
        errorMessage = "Error al guardar la imagen. Por favor intenta nuevamente.";
      }
      setStorageError(errorMessage);
      console.error("Error saving to localStorage:", error);
      return { success: false, error: errorMessage };
    }
  };

  const addImage = (imageData: InsertImageLibrary): { success: boolean; image?: ImageLibrary; error?: string } => {
    const newImage: ImageLibrary = {
      ...imageData,
      id: Date.now().toString(),
      fechaCreacion: new Date().toISOString(),
    };
    const updated = [...images, newImage];
    const result = saveToStorage(updated);
    return result.success ? { success: true, image: newImage } : { success: false, error: result.error };
  };

  const updateImage = (id: string, imageData: Partial<InsertImageLibrary>): { success: boolean; error?: string } => {
    const updated = images.map((img) =>
      img.id === id ? { ...img, ...imageData } : img
    );
    return saveToStorage(updated);
  };

  const deleteImage = (id: string): { success: boolean; error?: string } => {
    const updated = images.filter((img) => img.id !== id);
    return saveToStorage(updated);
  };

  const getImagesByCategory = (categoria: ImageLibrary["categoria"]) => {
    return images.filter((img) => img.categoria === categoria);
  };

  const getImageById = (id: string) => {
    return images.find((img) => img.id === id);
  };

  const clearStorageError = () => {
    setStorageError(null);
  };

  return {
    images,
    addImage,
    updateImage,
    deleteImage,
    getImagesByCategory,
    getImageById,
    storageError,
    clearStorageError,
  };
}
