import { useState, useEffect } from "react";
import type { ImageLibrary, InsertImageLibrary } from "@shared/schema";

const STORAGE_KEY = "almundo_image_library";

export function useImageLibrary() {
  const [images, setImages] = useState<ImageLibrary[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setImages(parsed);
      } catch (error) {
        console.error("Error loading image library:", error);
      }
    }
  }, []);

  const saveToStorage = (newImages: ImageLibrary[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newImages));
    setImages(newImages);
  };

  const addImage = (imageData: InsertImageLibrary): ImageLibrary => {
    const newImage: ImageLibrary = {
      ...imageData,
      id: Date.now().toString(),
      fechaCreacion: new Date().toISOString(),
    };
    const updated = [...images, newImage];
    saveToStorage(updated);
    return newImage;
  };

  const updateImage = (id: string, imageData: Partial<InsertImageLibrary>) => {
    const updated = images.map((img) =>
      img.id === id ? { ...img, ...imageData } : img
    );
    saveToStorage(updated);
  };

  const deleteImage = (id: string) => {
    const updated = images.filter((img) => img.id !== id);
    saveToStorage(updated);
  };

  const getImagesByCategory = (categoria: ImageLibrary["categoria"]) => {
    return images.filter((img) => img.categoria === categoria);
  };

  const getImageById = (id: string) => {
    return images.find((img) => img.id === id);
  };

  return {
    images,
    addImage,
    updateImage,
    deleteImage,
    getImagesByCategory,
    getImageById,
  };
}
