import { FileText, Settings } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAgencyConfig } from "@/hooks/use-agency-config";

export function Header() {
  const { config } = useAgencyConfig();

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-3 hover-elevate rounded-lg p-2 -m-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold" data-testid="text-app-title">{config.nombre}</h1>
                <p className="text-sm text-muted-foreground" data-testid="text-app-subtitle">
                  Generador de Documentos de Reserva
                </p>
              </div>
            </a>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium" data-testid="text-agency-name">{config.nombre}</p>
              {config.ciudad && (
                <p className="text-xs text-muted-foreground" data-testid="text-agency-location">{config.ciudad}</p>
              )}
            </div>
            <Link href="/config">
              <Button variant="outline" size="icon" data-testid="button-config">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
