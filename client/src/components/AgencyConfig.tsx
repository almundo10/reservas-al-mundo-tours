import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAgencyConfig } from "@/hooks/use-agency-config";
import { Building2, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AgencyConfig() {
  const { config, updateConfig, resetConfig } = useAgencyConfig();
  const { toast } = useToast();
  const [formData, setFormData] = useState(config);

  const handleSave = () => {
    updateConfig(formData);
    toast({
      title: "Configuración guardada",
      description: "Los cambios se han guardado correctamente",
    });
  };

  const handleReset = () => {
    if (confirm("¿Estás seguro de restablecer la configuración a los valores predeterminados?")) {
      resetConfig();
      setFormData(config);
      toast({
        title: "Configuración restablecida",
        description: "Se han restaurado los valores predeterminados",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Building2 className="w-8 h-8" />
          Configuración de Agencia
        </h1>
        <p className="text-muted-foreground mt-2">
          Personaliza la información de tu agencia que aparecerá en los documentos PDF
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="nombre" data-testid="label-nombre-agencia">Nombre de la Agencia</Label>
              <Input
                id="nombre"
                data-testid="input-nombre-agencia"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="AL Mundo Tours"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="direccion" data-testid="label-direccion-agencia">Dirección</Label>
              <Input
                id="direccion"
                data-testid="input-direccion-agencia"
                value={formData.direccion || ""}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                placeholder="Cra. 5 #10-41, Oficina 501"
              />
            </div>

            <div>
              <Label htmlFor="ciudad" data-testid="label-ciudad-agencia">Ciudad</Label>
              <Input
                id="ciudad"
                data-testid="input-ciudad-agencia"
                value={formData.ciudad || ""}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                placeholder="Bogotá, Colombia"
              />
            </div>

            <div>
              <Label htmlFor="telefono" data-testid="label-telefono-agencia">Teléfono</Label>
              <Input
                id="telefono"
                data-testid="input-telefono-agencia"
                value={formData.telefono || ""}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="+57 601 234 5678"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="email" data-testid="label-email-agencia">Email</Label>
              <Input
                id="email"
                data-testid="input-email-agencia"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contacto@almundotours.com"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="logoUrl" data-testid="label-logo-agencia">URL del Logo</Label>
              <Input
                id="logoUrl"
                data-testid="input-logo-agencia"
                value={formData.logoUrl || ""}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="/attached_assets/logo.png"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Ruta relativa del archivo de logo (ejemplo: /attached_assets/logo.png)
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={handleSave} 
              className="flex-1"
              data-testid="button-guardar-config"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Configuración
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
              data-testid="button-restablecer-config"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restablecer
            </Button>
          </div>
        </div>
      </Card>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Vista Previa</h3>
        <div className="space-y-1 text-sm">
          <p><strong>{formData.nombre}</strong></p>
          {formData.direccion && <p>{formData.direccion}</p>}
          {formData.ciudad && <p>{formData.ciudad}</p>}
          {formData.telefono && <p>Tel: {formData.telefono}</p>}
          {formData.email && <p>Email: {formData.email}</p>}
        </div>
      </div>
    </div>
  );
}
