// components/language-toggle.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const languages = [
    { code: "pt", label: "BR", title: "Mudar para Inglês ou Espanhol" },
    { code: "en", label: "EN", title: "Change to Portuguese or Spanish" },
    { code: "es", label: "ES", title: "Cambiar a Portugués o Inglés" },
  ];

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={language === lang.code ? "default" : "ghost"}
          size="icon"
          onClick={() => setLanguage(lang.code as any)}
          title={lang.title}
          className={`w-9 h-9 rounded-xl border border-muted/50 bg-background/80 ${language === lang.code ? "font-bold" : ""}`}
        >
          <span className="text-xs">{lang.label}</span>
        </Button>
      ))}
    </div>
  );
}
