import { useState } from 'react';
import { ImageLibrary } from '../ImageLibrary';
import { Button } from '@/components/ui/button';

export default function ImageLibraryExample() {
  const [open, setOpen] = useState(true);

  const handleSelect = (url: string) => {
    console.log('Selected image:', url);
  };

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Abrir Biblioteca</Button>
      <ImageLibrary 
        open={open} 
        onClose={() => setOpen(false)} 
        onSelect={handleSelect}
        category="destino"
      />
    </div>
  );
}
