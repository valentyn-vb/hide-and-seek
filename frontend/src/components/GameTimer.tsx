import { useEffect, useState } from "react";
import { Clock3, Eye, Shield } from "lucide-react";
import type { PlayerRole } from "../types/game";
import { calculateTimeLeft, formatTime } from "../utils/time";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

type GameTimerProps = {
  start: number;
  duration: number;
  role: PlayerRole;
  gameId: string;
};

export default function GameTimer({
  start,
  duration,
  role,
  gameId,
}: GameTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() =>
    calculateTimeLeft(start, duration),
  );

  useEffect(() => {
    const tick = () => {
      setTimeLeft(calculateTimeLeft(start, duration));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [start, duration]);

  const isLowTime = timeLeft <= 60_000;

  return (
    <Card className="h-fit shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock3 className="size-4" />
          Match info
        </CardTitle>
        <CardDescription>Game {gameId.slice(0, 8)}…</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant={role === "seeker" ? "default" : "secondary"}>
            {role === "seeker" ? (
              <Eye className="size-3" />
            ) : (
              <Shield className="size-3" />
            )}
            {role === "seeker" ? "Seeker" : "Hider"}
          </Badge>
          <Badge variant="outline">Arrow keys to move</Badge>
        </div>

        <div className="rounded-xl border bg-muted/40 p-4 text-center">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Time left
          </p>
          <p
            className={`mt-1 font-heading text-4xl font-semibold tabular-nums ${
              isLowTime ? "text-destructive" : "text-foreground"
            }`}
          >
            {formatTime(timeLeft)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
