import { useCallback, useEffect, useState } from "react";
import { Gamepad2, Users } from "lucide-react";
import GameBoard from "./components/GameBoard";
import GameTimer from "./components/GameTimer";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { socket, type GameData, type PlayerRole } from "./socket";

function App() {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [message, setMessage] = useState("Find an opponent and start hiding.");

  useEffect(() => {
    socket.connect();

    const disconnectOnLeave = () => {
      socket.disconnect();
    };
    window.addEventListener("pagehide", disconnectOnLeave);

    socket.on("gameJoined", ({ gameId, status }) => {
      setMessage(
        status === "waiting"
          ? `Room created. Waiting for another player…`
          : `Joined game ${gameId.slice(0, 8)}…`,
      );
    });

    socket.on("gameStarted", (gameInfo) => {
      setGameData(gameInfo);
      setMessage(
        `Game on! You are the ${gameInfo.role}. Use arrow keys to move.`,
      );
    });

    return () => {
      window.removeEventListener("pagehide", disconnectOnLeave);
      socket.off("gameJoined");
      socket.off("gameStarted");
      socket.disconnect();
    };
  }, []);

  const onGameFinished = useCallback(
    (winner: PlayerRole) => {
      const youWon = winner === gameData?.role;
      setMessage(
        youWon
          ? "You won! Head back to the lobby to play again."
          : "Opponent won. Head back to the lobby to play again.",
      );
      setGameData(null);
    },
    [gameData?.role],
  );

  return (
    <div className="min-h-svh bg-muted/40">
      <div className="mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-6 p-6 md:p-10">
        <header className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Gamepad2 className="size-5 text-primary" />
              <h1 className="font-heading text-2xl font-semibold tracking-tight">
                Hide & Seek
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          {gameData && (
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Match live
            </Badge>
          )}
        </header>

        {gameData ? (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <GameTimer
              start={gameData.start}
              duration={gameData.duration}
              role={gameData.role}
              gameId={gameData.gameId}
            />
            <GameBoard gameData={gameData} onGameFinished={onGameFinished} />
          </div>
        ) : (
          <Card className="mx-auto w-full max-w-md shadow-sm">
            <CardHeader>
              <CardTitle>Ready to play?</CardTitle>
              <CardDescription>
                Join the queue and get matched with another player. First player
                becomes the seeker, second becomes the hider.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
                <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                  <Users className="size-4" />
                  How it works
                </div>
                <ul className="list-inside list-disc space-y-1">
                  <li>10×10 grid, 10 minute rounds</li>
                  <li>Seeker finds the hider to win</li>
                  <li>Hider survives until time runs out</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={() => socket.emit("joinGame")}>
                Join Game
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}

export default App;
