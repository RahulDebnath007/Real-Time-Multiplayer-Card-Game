export type GameStatus =
  | "WAITING"
  | "ACTIVE"
  | "FINISHED";

export interface PlayerState {
  characterId: string;

  hp: number;

  energy: number;

  deck: string[];

  hand: string[];

  discard: string[];

  shield: number;
}

export interface GameState {
  gameId: string;

  players: Record<string, PlayerState>;

  currentTurn: string;

  turnNumber: number;

  status: GameStatus;
}