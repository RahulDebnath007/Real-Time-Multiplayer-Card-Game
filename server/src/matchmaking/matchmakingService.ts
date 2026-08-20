import { randomUUID } from "crypto";
import redisClient from "../redis/redisClient";

const MATCHMAKING_QUEUE = "matchmaking:queue";

interface QueuedPlayer {
  playerId: string;
  characterId: string;
}

export async function joinMatchmakingQueue(
  playerId: string,
  characterId: string
): Promise<{
  matched: boolean;
  opponentId?: string;
  opponentCharacterId?: string;
  gameId?: string;
}> {
  const waitingPlayerData =
    await redisClient.lPop(MATCHMAKING_QUEUE);

  /*
   * No player waiting.
   * Add current player to the queue.
   */

  if (!waitingPlayerData) {
    const queuedPlayer: QueuedPlayer = {
      playerId,
      characterId
    };

    await redisClient.rPush(
      MATCHMAKING_QUEUE,
      JSON.stringify(queuedPlayer)
    );

    return {
      matched: false
    };
  }

  /*
   * Read waiting player's information.
   */

  const waitingPlayer: QueuedPlayer =
    JSON.parse(waitingPlayerData);

  /*
   * Prevent matching the player with themselves.
   */

  if (waitingPlayer.playerId === playerId) {
    await redisClient.rPush(
      MATCHMAKING_QUEUE,
      waitingPlayerData
    );

    return {
      matched: false
    };
  }

  /*
   * Create a new game.
   */

  const gameId = `game-${randomUUID()}`;

  return {
    matched: true,
    opponentId: waitingPlayer.playerId,
    opponentCharacterId: waitingPlayer.characterId,
    gameId
  };
}