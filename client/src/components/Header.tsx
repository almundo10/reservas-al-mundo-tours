import { FileText } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold" data-testid="text-app-title">AL Mundo Tours</h1>
              <p className="text-sm text-muted-foreground" data-testid="text-app-subtitle">
                Generador de Documentos de Reserva
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium" data-testid="text-agency-name">AL Mundo Tours</p>
            <p className="text-xs text-muted-foreground" data-testid="text-agency-location">Tuluá, Colombia</p>
          </div>
        </div>
      </div>
    </header>
  );
}
