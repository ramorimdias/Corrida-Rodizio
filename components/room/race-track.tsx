"use client";

import { Participant } from "@/types/database";
import { Card } from "@/components/ui/card";
import { Trophy, Timer } from "lucide-react";

interface RaceTrackProps {
  participants: Participant[];
}

export function RaceTrack({ participants }: RaceTrackProps) {
  const maxScore = Math.max(...participants.map((p) => p.items_eaten), 1);

  const sortedByEntry = [...participants].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <div className="space-y-3 w-full overflow-hidden">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-primary font-black uppercase text-[9px] tracking-widest">
          <Timer className="h-3 w-3" />
          Live Race
        </div>
        <div className="text-[9px] font-bold text-muted-foreground uppercase bg-muted/50 px-2 py-0.5 rounded-full">
          Líder: {maxScore}
        </div>
      </div>

      <Card className="relative overflow-hidden border-none shadow-xl bg-[#1a1a1a]">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_8px,#fff_8px,#fff_16px)] opacity-30" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_8px,#fff_8px,#fff_16px)] opacity-30" />

        <div className="py-6 pl-2 pr-3 space-y-1 relative min-h-[160px] bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:15px_15px]">
          <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-white/10" />

          <div
            className="absolute right-0 top-0 bottom-0 w-8 md:w-12 opacity-20"
            style={{
              backgroundImage: `conic-gradient(#fff 0.25turn, #000 0.25turn 0.5turn, #fff 0.5turn 0.75turn, #000 0.75turn)`,
              backgroundSize: "12px 12px",
            }}
          />

          {sortedByEntry.map((participant, index) => {
            const progress = (participant.items_eaten / maxScore) * 100;
            const isLeader =
              participant.items_eaten === maxScore && maxScore > 0;

            return (
              <div
                key={participant.id}
                className="relative h-12 flex items-center"
              >
                <div className="absolute bottom-0 left-2 right-2 h-px bg-white/5" />

                <div
                  className="absolute transition-all duration-1000 ease-in-out flex items-center gap-2"
                  style={{
                    left: `${progress}%`,
                    transform: `translateX(-${progress}%)`,
                    zIndex: isLeader ? 20 : 10,
                  }}
                >
                  <div className="relative shrink-0">
                    <span
                      className={`text-2xl md:text-3xl transition-transform ${
                        participant.items_eaten > 0 ? "animate-bounce" : ""
                      }`}
                    >
                      {participant.avatar}
                    </span>
                    {isLeader && (
                      <Trophy className="absolute -top-3 -right-1 h-3 w-3 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>

                  <div className="flex flex-col min-w-0 bg-[#1a1a1a]/80 backdrop-blur-sm p-1 rounded border border-white/5">
                    <span className="text-[8px] font-black uppercase text-white leading-none truncate max-w-[60px] md:max-w-[100px]">
                      {participant.name.split(" ")[0]}
                    </span>
                    <span className="text-[10px] font-black text-primary italic leading-tight">
                      {participant.items_eaten}pts
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex justify-between px-2 opacity-30 text-[8px] font-bold uppercase">
        <span>Largada</span>
        <span>Chegada</span>
      </div>
    </div>
  );
}
