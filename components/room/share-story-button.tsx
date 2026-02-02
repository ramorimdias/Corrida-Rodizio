"use client";

import { useState, useRef } from "react";
import { toBlob } from "html-to-image";
import { Instagram, Loader2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Race, Participant } from "@/types/database";
import { getAvatarUrl, isImageAvatar } from "@/lib/utils/avatars";
import { useLanguage } from "@/contexts/language-context";

// Opções de time (copiado para manter consistência visual)
const TEAM_OPTIONS = [
  { id: "AZUL", shortLabel: "Azul", pillClass: "bg-blue-500/20 text-blue-300" },
  {
    id: "VERMELHA",
    shortLabel: "Vermelho",
    pillClass: "bg-red-500/20 text-red-300",
  },
  {
    id: "VERDE",
    shortLabel: "Verde",
    pillClass: "bg-emerald-500/20 text-emerald-300",
  },
  {
    id: "AMARELA",
    shortLabel: "Amarelo",
    pillClass: "bg-yellow-500/20 text-yellow-300",
  },
];

interface ShareStoryButtonProps {
  race: Race;
  participants: Participant[];
  maxScore: number;
  getItemLabel: (count: number) => string;
  className?: string;
}

export function ShareStoryButton({
  race,
  participants,
  maxScore,
  getItemLabel,
  className,
}: ShareStoryButtonProps) {
  const [loading, setLoading] = useState(false);
  const storyRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const MOTIVATIONAL_PHRASES = t.hall_of_fame.phrases;

  // Pegamos apenas os top 6 para caber na tela do story sem cortar
  const displayParticipants = participants.slice(0, 6);

  const handleShare = async () => {
    if (!storyRef.current) return;
    setLoading(true);

    try {
      // Gera a imagem com alta qualidade (pixelRatio 3 = qualidade retina/story)
      const blob = await toBlob(storyRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#09090b",
        width: 450, // Largura base para simular celular
        height: 800, // Altura base
      });

      if (!blob) throw new Error("Falha ao gerar imagem");

      const file = new File([blob], "hall-of-fame.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Hall of Fame - Corrida do Rodízio",
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "hall-of-fame.png";
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Erro ao compartilhar:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleShare}
        disabled={loading}
        className={`w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 ${className}`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Instagram className="h-4 w-4" />
        )}
        {loading ? "Loading" : t.hall_of_fame.share}
      </Button>

      <div className="fixed top-0 left-[-9999px] opacity-0 pointer-events-none">
        <div
          ref={storyRef}
          className="w-[450px] min-h-[800px] bg-zinc-950 text-white p-8 flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.15),transparent_50%)]" />

          <div className="w-full space-y-8 relative z-10">
            <div className="text-center space-y-4">
              <div className="inline-block p-4 bg-orange-500 rounded-2xl rotate-3 shadow-2xl shadow-orange-500/20">
                <Trophy className="h-12 w-12 text-zinc-950" />
              </div>
              <div className="space-y-1">
                <h1 className="text-5xl font-black italic tracking-tighter uppercase">
                  {t.hall_of_fame.title}
                </h1>
                <p className="text-orange-500 font-mono text-base tracking-widest">
                  {t.common.room}: {race.room_code}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {displayParticipants.map((p, i) => {
                const isWinner = p.items_eaten === maxScore && maxScore > 0;
                const team = TEAM_OPTIONS.find((t) => t.id === p.team);

                return (
                  <div
                    key={p.id}
                    className={`relative overflow-hidden flex items-center justify-between p-4 rounded-3xl border-2 ${
                      isWinner
                        ? "border-orange-500 bg-orange-500/10 scale-105 shadow-[0_0_30px_rgba(249,115,22,0.2)]"
                        : "border-white/5 bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-4 z-10">
                      <div className="text-3xl">
                        {isImageAvatar(p.avatar) ? (
                          <img
                            src={getAvatarUrl(p.avatar)}
                            alt=""
                            className="h-12 w-12 object-contain"
                            crossOrigin="anonymous"
                          />
                        ) : (
                          <span className="inline-block h-10 w-10 rounded-full bg-white/10" />
                        )}
                      </div>
                      <span
                        className={`text-2xl font-black ${
                          isWinner ? "text-orange-500" : "text-zinc-700"
                        }`}
                      >
                        #{i + 1}
                      </span>
                      <div>
                        <p className="font-bold text-xl leading-tight flex items-center gap-2">
                          {p.name}
                          {race.is_team_mode && team && (
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded ${team.pillClass}`}
                            >
                              {team.shortLabel}
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                          {isWinner
                            ? t.hall_of_fame.legendary
                            : MOTIVATIONAL_PHRASES[
                                i % MOTIVATIONAL_PHRASES.length
                              ]}
                        </p>
                      </div>
                    </div>
                    <div className="text-right z-10 pl-2">
                      <p className="text-3xl font-black leading-none">
                        {p.items_eaten}
                      </p>
                      <p className="text-[10px] uppercase font-bold text-zinc-500 mt-1">
                        {getItemLabel(p.items_eaten)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rodapé extra para o Story */}
            <div className="pt-4 text-center">
              <p className="text-[10px] text-zinc-600 font-mono tracking-widest">
                https://rodiziorace.mechama.eu/
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
