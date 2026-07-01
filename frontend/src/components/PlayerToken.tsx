import { cn } from "@/lib/utils";
import { Eye, Ghost } from "lucide-react";
import type { PlayerRole } from "../types/game";

type PlayerTokenProps = {
  role: PlayerRole;
  isYou?: boolean;
};

export default function PlayerToken({ role, isYou = false }: PlayerTokenProps) {
  const isSeeker = role === "seeker";

  return (
    <div
      title={`${isSeeker ? "Seeker" : "Hider"}${isYou ? " (you)" : ""}`}
      className={cn(
        "flex size-8 items-center justify-center rounded-full border-2 shadow-sm sm:size-9",
        isSeeker
          ? "border-amber-500/40 bg-amber-500/15 text-amber-700 dark:text-amber-300"
          : "border-violet-500/40 bg-violet-500/15 text-violet-700 dark:text-violet-300",
        isYou && "ring-2 ring-offset-1 ring-offset-background",
        isYou && (isSeeker ? "ring-amber-500" : "ring-violet-500"),
      )}
    >
      {isSeeker ? (
        <Eye className="size-4 sm:size-5" strokeWidth={2.25} />
      ) : (
        <Ghost className="size-4 sm:size-5" strokeWidth={2.25} />
      )}
    </div>
  );
}
