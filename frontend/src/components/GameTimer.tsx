import { useEffect, useState } from "react";

type GameTimerProps = {
  start: number;
  duration: number;
  role: string;
};

const calculateTimeLeft = (startTime: number, duration: number) =>
  Math.max(0, duration - (Date.now() - startTime));

const formatTime = (ms: number) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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
