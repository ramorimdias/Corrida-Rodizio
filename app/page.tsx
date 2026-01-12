"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Pizza, Fish, Beef, Trophy, ArrowRight, Hash } from "lucide-react";
import type { FoodType } from "@/types/database";
import { generateRoomCode } from "@/lib/utils/room-code";
import { getParticipantStorageKey } from "@/lib/utils/participant-storage";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodType | null>(null);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);

  const foodTypes = [
    { type: "pizza" as FoodType, label: "Pizza", icon: Pizza },
    { type: "sushi" as FoodType, label: "Japa", icon: Fish },
    { type: "burger" as FoodType, label: "Burger", icon: Beef },
  ];

  // Lógica de Criação de Sala reconectada
  const handleCreateRoom = async () => {
    if (!playerName.trim() || !selectedFood) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const code = generateRoomCode();

      // Criar a corrida
      const { data: race, error: raceError } = await supabase
        .from("races")
        .insert({
          name: `Sala de ${playerName}`,
          food_type: selectedFood,
          room_code: code,
          is_active: true,
        })
        .select()
        .single();

      if (raceError) throw raceError;

      // Adicionar o criador como primeiro participante
      const { data: participant, error: participantError } = await supabase
        .from("participants")
        .insert({
          race_id: race.id,
          name: playerName,
          items_eaten: 0,
        })
        .select()
        .single();

      if (participantError) throw participantError;

      if (participant) {
        localStorage.setItem(getParticipantStorageKey(code), participant.id);
      }

      router.push(`/sala/${code}`);
    } catch (error) {
      console.error("Erro ao criar sala:", error);
      alert("Erro ao criar sala. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Lógica de Entrada em Sala reconectada
  const handleJoinRoom = async () => {
    if (!playerName.trim() || !roomCode.trim()) return;

    setLoading(true);
    try {
      const supabase = createClient();

      const { data: race, error: raceError } = await supabase
        .from("races")
        .select()
        .eq("room_code", roomCode.toUpperCase())
        .eq("is_active", true)
        .single();

      if (raceError || !race) {
        alert("Sala não encontrada. Verifique o código.");
        setLoading(false);
        return;
      }

      const { data: participant, error: participantError } = await supabase
        .from("participants")
        .insert({
          race_id: race.id,
          name: playerName,
          items_eaten: 0,
        })
        .select()
        .single();

      if (participantError) throw participantError;

      if (participant) {
        localStorage.setItem(
          getParticipantStorageKey(roomCode.toUpperCase()),
          participant.id
        );
      }

      router.push(`/sala/${roomCode.toUpperCase()}`);
    } catch (error) {
      console.error("Erro ao entrar na sala:", error);
      alert("Erro ao entrar na sala. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-100/50 via-background to-background dark:from-orange-950/10 p-6 md:p-12 transition-colors duration-500">
      <div className="mx-auto max-w-xl space-y-12">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        {/* Header Visual Premium */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-lg shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-300">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
              Rodízio<span className="text-primary">Race</span>
            </h1>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">
              A elite da comilança competitiva
            </p>
          </div>
        </div>

        <Card className="border-none shadow-2xl shadow-black/5 bg-card/80 backdrop-blur-md">
          <CardContent className="pt-8 space-y-8">
            {/* Nome do Jogador */}
            <div className="space-y-3">
              <Label
                htmlFor="playerName"
                className="text-xs uppercase tracking-widest font-bold text-muted-foreground px-1"
              >
                Seu Codinome
              </Label>
              <Input
                id="playerName"
                placeholder="Ex: Predador de Pizza"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="bg-background/50 border-muted focus:ring-primary/20 h-14 text-lg font-medium"
              />
            </div>

            {!showJoinRoom ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Seleção de Categoria */}
                <div className="space-y-4">
                  <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground px-1">
                    Escolha a Categoria
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {foodTypes.map(({ type, label, icon: Icon }) => (
                      <button
                        key={type}
                        onClick={() => setSelectedFood(type)}
                        className={`group relative flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                          selectedFood === type
                            ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                            : "bg-background hover:bg-muted text-muted-foreground border border-transparent hover:border-primary/20"
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 ${
                            selectedFood === type
                              ? "animate-pulse"
                              : "group-hover:text-primary"
                          }`}
                        />
                        <span className="text-[10px] font-black uppercase tracking-tighter">
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ações Criar */}
                <div className="pt-2 space-y-4">
                  <Button
                    size="lg"
                    className="w-full h-14 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:translate-y-[-2px] active:scale-95"
                    onClick={handleCreateRoom}
                    disabled={!playerName.trim() || !selectedFood || loading}
                  >
                    {loading ? "Preparando Mesa..." : "Criar Competição"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full h-12 font-semibold text-muted-foreground hover:text-primary"
                    onClick={() => setShowJoinRoom(true)}
                  >
                    Já tem um código? Entrar na sala
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                {/* Código da Sala */}
                <div className="space-y-3">
                  <Label
                    htmlFor="roomCode"
                    className="text-xs uppercase tracking-widest font-bold text-muted-foreground px-1"
                  >
                    Código da Arena
                  </Label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="roomCode"
                      placeholder="ABCDE"
                      value={roomCode}
                      onChange={(e) =>
                        setRoomCode(e.target.value.toUpperCase())
                      }
                      className="pl-12 h-14 text-2xl font-black tracking-[0.5em] uppercase border-primary/20"
                      maxLength={5}
                    />
                  </div>
                </div>
                {/* Ações Entrar */}
                <div className="space-y-3">
                  <Button
                    className="w-full h-14 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:translate-y-[-2px]"
                    onClick={handleJoinRoom}
                    disabled={!roomCode.trim() || loading}
                  >
                    {loading ? "Localizando..." : "Entrar na Arena"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-muted-foreground"
                    onClick={() => {
                      setShowJoinRoom(false);
                      setRoomCode("");
                    }}
                  >
                    Voltar para criação
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
