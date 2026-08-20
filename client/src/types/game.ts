export type CardType =
  | "ATTACK"
  | "DEFENSE";

export interface PlayerState {
  hp: number;
  energy: number;
  deck: string[];
  hand: string[];
  discard: string[];
  shield: number;
}

export interface GameState {
  gameId: string;
  status: "ACTIVE" | "FINISHED";
  currentTurn: string;
  turnNumber: number;
  players: Record<string, PlayerState>;
}

export interface ConnectedMessage {
  type: "CONNECTED";
  playerId: string;
  message: string;
}

export interface MatchFoundMessage {
  type: "MATCH_FOUND";
  gameId: string;
  playerId: string;
  opponentId: string;
}

export interface GameStartedMessage {
  type: "GAME_STARTED";
  gameState: GameState;
}

export interface GameStateUpdatedMessage {
  type: "GAME_STATE_UPDATED";
  gameState: GameState;
}

export interface GameOverMessage {
  type: "GAME_OVER";
  result: "WIN" | "LOSE";
  winnerId: string;
  loserId: string;
  gameState: GameState;
}