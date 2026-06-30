import type {
  GameActionPayload,
  GameActionResponse,
  GameData,
  PlayerRole,
} from "./game";

export interface ServerToClientEvents {
  gameJoined: (payload: {
    gameId: string;
    status: "waiting" | "inProgress" | "finished";
  }) => void;
  gameStarted: (payload: GameData) => void;
  gameAction: (payload: GameActionResponse) => void;
  gameFinished: (winner: PlayerRole) => void;
}

export interface ClientToServerEvents {
  joinGame: () => void;
  gameAction: (payload: GameActionPayload) => void;
}
