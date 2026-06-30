import { io, type Socket } from "socket.io-client";

interface ServerToClientEvents {
  gameJoined: (payload: {
    gameId: string;
    status: "waiting" | "inProgress" | "finished";
  }) => void;
  gameStarted: (payload: GameData) => void;
}

export interface GameData {
  gameId: string;
  seeker: Player;
  hider?: Player;
  role: "seeker" | "hider";
  start: number;
  duration: number;
}

interface Player {
  id: string;
  coordinates: [number, number];
}

interface ClientToServerEvents {
  joinGame: () => void;
}

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  BASE_URL,
  {
    autoConnect: false,
  },
);
