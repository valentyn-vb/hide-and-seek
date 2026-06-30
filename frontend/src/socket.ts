import { io, type Socket } from "socket.io-client";

interface ServerToClientEvents {
  gameJoined: (payload: {
    gameId: string;
    status: "waiting" | "inProgress" | "finished";
  }) => void;
  gameStarted: (payload: GameData) => void;
  gameAction: (payload: {
    role: PlayerRole;
    coordinate: [number, number];
  }) => void;
}

export interface GameData {
  gameId: string;
  seeker: Player;
  hider?: Player;
  role: PlayerRole;
  start: number;
  duration: number;
}

interface Player {
  id: string;
  coordinates: [number, number];
}

type PlayerRole = "seeker" | "hider";

interface ClientToServerEvents {
  joinGame: () => void;
  gameAction: (payload: {
    gameId: string;
    action: "up" | "down" | "left" | "right";
    role: PlayerRole;
  }) => void;
}

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  BASE_URL,
  {
    autoConnect: false,
  },
);
