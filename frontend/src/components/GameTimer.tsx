import { useEffect, useState } from "react";
import type { PlayerRole } from "../types/game";
import { calculateTimeLeft, formatTime } from "../utils/time";

type GameTimerProps = {
  start: number;
  duration: number;
  role: PlayerRole;
};

export default function GameTimer({ start, duration, role }: GameTimerProps) {
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

  return (
    <p>
      Role: {role} · Time left: {formatTime(timeLeft)}
    </p>
  );
}
