// components/language-toggle.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const cycleLanguage = () => {
    if (language === "pt") {
      setLanguage("en");
    } else if (language === "en") {
      setLanguage("es" as any);
    } else {
      setLanguage("pt");
    }
  };

  const labels = {
    pt: "BR",
    en: "EN",
    es: "ES",
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleLanguage}
      title="Alterar idioma / Change language"
      className="h-9 gap-2 rounded-xl border border-muted/50 bg-background/80 px-3 transition-all hover:bg-accent hover:text-accent-foreground"
    >
      <Globe className="h-4 w-4 text-muted-foreground" />
      <span className="text-xs font-bold">
        {labels[language as keyof typeof labels]}
      </span>
    </Button>
  );
}
