import { WebSocket } from "ws";
import { randomUUID } from "crypto";

const players = new Map<string, WebSocket>();

export function addPlayer(socket: WebSocket): string {
  const playerId = randomUUID();

  players.set(playerId, socket);

  return playerId;
}

export function removePlayer(playerId: string): void {
  players.delete(playerId);
}

export function getPlayer(playerId: string): WebSocket | undefined {
  return players.get(playerId);
}

export function getPlayerCount(): number {
  return players.size;
}