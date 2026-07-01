import { cn } from "@/lib/utils";
import { memo, useEffect, useState } from "react";
import { BOARD } from "../constants/board";
import { socket, type GameData } from "../socket";
import type { GameActionResponse, PlayerRole } from "../types/game";
import PlayerToken from "./PlayerToken";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

function GameBoard({
  gameData,
  onGameFinished,
}: {
  gameData: GameData;
  onGameFinished: (winner: PlayerRole) => void;
}) {
  const { role, gameId } = gameData;
  const [seekerCoordinates, setSeekerCoordinates] = useState(
    gameData.seeker.coordinates,
  );
  const [hiderCoordinates, setHiderCoordinates] = useState(
    gameData.hider?.coordinates,
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          socket.emit("gameAction", { action: "up", gameId, role });
          break;
        case "ArrowDown":
          socket.emit("gameAction", { action: "down", gameId, role });
          break;
        case "ArrowLeft":
          socket.emit("gameAction", { action: "left", gameId, role });
          break;
        case "ArrowRight":
          socket.emit("gameAction", { action: "right", gameId, role });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameId, role]);

  useEffect(() => {
    const onGameAction = (res: GameActionResponse) => {
      if (res.role === "seeker") {
        setSeekerCoordinates(res.newCoordinates);
      } else if (res.role === "hider") {
        setHiderCoordinates(res.newCoordinates);
      }
    };

    socket.on("gameAction", onGameAction);
    return () => {
      socket.off("gameAction", onGameAction);
    };
  }, []);

  useEffect(() => {
    const onFinished = (winner: PlayerRole) => onGameFinished(winner);
    socket.on("gameFinished", onFinished);
    return () => {
      socket.off("gameFinished", onFinished);
    };
  }, [onGameFinished]);

  const getOccupant = (rowIndex: number, colIndex: number) => {
    const row = rowIndex + 1;
    const col = colIndex + 1;

    if (seekerCoordinates[0] === row && seekerCoordinates[1] === col) {
      return <PlayerToken role="seeker" isYou={role === "seeker"} />;
    }
    if (
      hiderCoordinates &&
      hiderCoordinates[0] === row &&
      hiderCoordinates[1] === col
    ) {
      return <PlayerToken role="hider" isYou={role === "hider"} />;
    }
    return null;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Game board</CardTitle>
        <CardDescription>
          {role === "seeker"
            ? "Hunt down the hider before time runs out."
            : "Stay hidden until the clock hits zero."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center overflow-x-auto pb-2">
        <div className="grid grid-cols-10 gap-1 rounded-xl border bg-muted/30 p-2">
          {BOARD.map((row, rowIndex) =>
            row.map((_, colIndex) => {
              const occupied = getOccupant(rowIndex, colIndex);
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-md border border-border/60 bg-background transition-colors sm:size-12",
                    occupied && "border-transparent bg-transparent shadow-none",
                    (rowIndex + colIndex) % 2 === 0 &&
                      !occupied &&
                      "bg-muted/20",
                  )}
                >
                  {occupied}
                </div>
              );
            }),
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(GameBoard);
