"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Copy,
  Trophy,
  Users,
  Plus,
  Minus,
  Check,
  Hash,
} from "lucide-react";
import type { Race, Participant, FoodType } from "@/types/database";
import { FoodIcon } from "@/components/food-icon";
import { getParticipantStorageKey } from "@/lib/utils/participant-storage";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.codigo as string;

  const [race, setRace] = useState<Race | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [currentParticipantId, setCurrentParticipantId] = useState<
    string | null
  >(null);

  const getItemLabel = (foodType: FoodType, count: number) => {
    const labels = {
      pizza: count === 1 ? "pedaço" : "pedaços",
      sushi: count === 1 ? "peça" : "peças",
      burger: count === 1 ? "burger" : "burgers",
    };
    return labels[foodType];
  };

  const loadRoomData = async () => {
    try {
      const supabase = createClient();
      const { data: raceData, error: raceError } = await supabase
        .from("races")
        .select()
        .eq("room_code", roomCode.toUpperCase())
        .eq("is_active", true)
        .single();

      if (raceError || !raceData) {
        router.push("/");
        return;
      }
      setRace(raceData);

      const { data: participantsData } = await supabase
        .from("participants")
        .select()
        .eq("race_id", raceData.id)
        .order("items_eaten", { ascending: false });

      if (participantsData) setParticipants(participantsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateCount = async (participantId: string, change: number) => {
    if (participantId !== currentParticipantId) return;
    const participant = participants.find((p) => p.id === participantId);
    if (!participant) return;

    const newCount = Math.max(0, participant.items_eaten + change);
    try {
      const supabase = createClient();
      await supabase
        .from("participants")
        .update({ items_eaten: newCount })
        .eq("id", participantId);
      setParticipants((prev) =>
        prev
          .map((p) =>
            p.id === participantId ? { ...p, items_eaten: newCount } : p
          )
          .sort((a, b) => b.items_eaten - a.items_eaten)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(roomCode.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    loadRoomData();
    const supabase = createClient();
    const channel = supabase
      .channel(`room:${roomCode}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "participants" },
        () => loadRoomData()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomCode]);

  useEffect(() => {
    setCurrentParticipantId(
      localStorage.getItem(getParticipantStorageKey(roomCode))
    );
  }, [roomCode]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full" />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Sintonizando arena...
          </span>
        </div>
      </div>
    );

  if (!race) return null;

  const currentParticipant = participants.find(
    (p) => p.id === currentParticipantId
  );

  const renderParticipantCard = (
    participant: Participant,
    index: number,
    isPersonal = false
  ) => {
    const isLeader = index === 0 && participant.items_eaten > 0;

    return (
      <Card
        className={`overflow-hidden border-none transition-all duration-300 ${
          isPersonal
            ? "ring-2 ring-primary shadow-xl scale-[1.02]"
            : "shadow-md bg-card/60"
        } ${
          isLeader ? "bg-gradient-to-r from-yellow-500/5 to-orange-500/5" : ""
        }`}
      >
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-xl font-black ${
                  isLeader
                    ? "bg-yellow-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isLeader ? <Trophy className="h-5 w-5" /> : index + 1}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{participant.name}</span>
                  {participant.id === currentParticipantId && !isPersonal && (
                    <Badge className="bg-primary/10 text-primary border-none text-[10px] h-5 uppercase">
                      Você
                    </Badge>
                  )}
                </div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-tight">
                  {participant.items_eaten}{" "}
                  {getItemLabel(race.food_type, participant.items_eaten)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {participant.id === currentParticipantId && (
                <div className="flex items-center gap-1 bg-background/50 p-1 rounded-2xl border border-muted">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => updateCount(participant.id, -1)}
                    disabled={participant.items_eaten === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-12 text-center text-2xl font-black">
                    {participant.items_eaten}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary"
                    onClick={() => updateCount(participant.id, 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {participant.id !== currentParticipantId && (
                <div className="text-3xl font-black text-muted-foreground/30 pr-2">
                  {participant.items_eaten}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-100/50 via-background to-background dark:from-orange-950/10 p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header Superior */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Sair da Sala
          </Button>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Código da Sala
              </p>
              <p className="font-mono font-bold text-lg leading-none">
                {race.room_code}
              </p>
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={copyRoomCode}
              className="h-10 w-10 rounded-xl"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Card Principal da Sala */}
        <div className="text-center space-y-4 py-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-card shadow-xl border border-muted mb-2">
            <FoodIcon
              type={race.food_type}
              className="h-10 w-10 text-primary"
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">
              Competição de
            </h2>
            <h1 className="text-4xl font-black capitalize">
              {race.food_type === "sushi" ? "Rodízio Japa" : race.food_type}
            </h1>
          </div>
          <div className="flex items-center justify-center gap-4 text-muted-foreground font-bold text-xs uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> {participants.length} Jogadores
            </span>
            <span className="w-1 h-1 bg-muted rounded-full" />
            <span className="text-primary animate-pulse">● Ao Vivo</span>
          </div>
        </div>

        {/* Contador Pessoal (Sticky Bottom em Mobile) */}
        {currentParticipant && (
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">
              Seu Progresso
            </Label>
            {renderParticipantCard(
              currentParticipant,
              participants.findIndex((p) => p.id === currentParticipantId),
              true
            )}
          </div>
        )}

        {/* Ranking */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between px-1">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Ranking Geral
            </Label>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </div>

          <div className="space-y-3">
            {participants.length <= 1 && (
              <div className="py-12 text-center bg-card/40 rounded-3xl border border-dashed border-muted">
                <p className="text-sm font-medium text-muted-foreground italic">
                  Aguardando rivais entrarem com o código...
                </p>
              </div>
            )}
            {participants.map((participant, index) => (
              <div
                key={participant.id}
                className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {renderParticipantCard(participant, index)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
