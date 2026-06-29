import { io, type Socket } from "socket.io-client";

interface ServerToClientEvents {
  gameJoined: (payload: {
    gameId: string;
    status: "waiting" | "inProgress" | "finished";
  }) => void;
  gameStarted: (payload: {
    gameId: string;
    seekerId: string;
    hiderId?: string;
    role: "seeker" | "hider";
  }) => void;
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
