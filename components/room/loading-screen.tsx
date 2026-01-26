import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
          Sintonizando arena...
        </span>
      </div>
    </div>
  );
}
