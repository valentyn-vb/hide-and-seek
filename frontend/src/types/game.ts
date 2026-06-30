export type Coordinates = [number, number];
export type GameAction = "up" | "down" | "left" | "right";
export type PlayerRole = "seeker" | "hider";

export interface Player {
  id: string;
  coordinates: Coordinates;
}

export interface GameData {
  gameId: string;
  seeker: Player;
  hider?: Player;
  role: PlayerRole;
  start: number;
  duration: number;
}

export interface GameActionPayload {
  gameId: string;
  action: GameAction;
  role: PlayerRole;
}

export interface GameActionResponse {
  role: PlayerRole;
  newCoordinates: Coordinates;
}
