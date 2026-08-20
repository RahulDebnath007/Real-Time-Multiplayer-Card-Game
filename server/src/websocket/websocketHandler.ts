import { WebSocketServer, WebSocket } from "ws";

import {
  addPlayer,
  removePlayer,
  getPlayer,
  getPlayerCount
} from "../players/playerManager";

import { joinMatchmakingQueue } from "../matchmaking/matchmakingService";

import { createGame } from "../game/gameService";

import { playCard } from "../game/gameActions";

export function initializeWebSocket(
  wss: WebSocketServer
): void {
  wss.on("connection", (socket: WebSocket) => {
    const playerId = addPlayer(socket);

    console.log(
      `Player connected: ${playerId}`
    );

    console.log(
      `Connected players: ${getPlayerCount()}`
    );

    socket.send(
      JSON.stringify({
        type: "CONNECTED",
        playerId,
        message: "Welcome to Naruto Card Battle"
      })
    );

    socket.on("message", async (message) => {
      try {
        const data = JSON.parse(
          message.toString()
        );

        console.log(
          `Message from ${playerId}:`,
          data
        );

        /*
         * =========================
         * JOIN MATCHMAKING QUEUE
         * =========================
         */

        if (data.type === "JOIN_QUEUE") {
          await handleJoinQueue(
            socket,
            playerId,
            data.characterId
          );

          return;
        }

        /*
         * =========================
         * PLAY CARD
         * =========================
         */

        if (data.type === "PLAY_CARD") {
          await handlePlayCard(
            socket,
            playerId,
            data.gameId,
            data.cardId
          );

          return;
        }

        /*
         * =========================
         * UNKNOWN MESSAGE
         * =========================
         */

        socket.send(
          JSON.stringify({
            type: "MESSAGE_RECEIVED",
            playerId,
            message: data
          })
        );

      } catch (error) {
        console.error(
          "Invalid message:",
          error
        );

        socket.send(
          JSON.stringify({
            type: "ERROR",
            message: "Invalid message format"
          })
        );
      }
    });

    /*
     * =========================
     * PLAYER DISCONNECTED
     * =========================
     */

    socket.on("close", () => {
      removePlayer(playerId);

      console.log(
        `Player disconnected: ${playerId}`
      );

      console.log(
        `Connected players: ${getPlayerCount()}`
      );
    });

    /*
     * =========================
     * WEBSOCKET ERROR
     * =========================
     */

    socket.on("error", (error) => {
      console.error(
        `WebSocket error for ${playerId}:`,
        error
      );
    });
  });
}


/*
 * =========================================================
 * MATCHMAKING
 * =========================================================
 */

async function handleJoinQueue(
  socket: WebSocket,
  playerId: string,
  characterId: string
): Promise<void> {

  /*
   * Validate character selection.
   */

  if (!characterId) {
    socket.send(
      JSON.stringify({
        type: "ACTION_ERROR",
        message: "Please select a character first"
      })
    );

    return;
  }

  /*
   * Join matchmaking queue.
   */

  const result =
    await joinMatchmakingQueue(
      playerId,
      characterId
    );

  /*
   * Player is waiting.
   */

  if (!result.matched) {
    socket.send(
      JSON.stringify({
        type: "QUEUE_JOINED",
        playerId,
        characterId,
        message: "Waiting for an opponent"
      })
    );

    return;
  }

  /*
   * Validate matchmaking result.
   */

  if (
    !result.gameId ||
    !result.opponentId ||
    !result.opponentCharacterId
  ) {
    socket.send(
      JSON.stringify({
        type: "ERROR",
        message:
          "Matchmaking returned an invalid result"
      })
    );

    return;
  }

  /*
   * Create game using both selected characters.
   *
   * IMPORTANT:
   * gameService.ts must be updated to accept
   * these 5 arguments.
   */

  const gameState =
    await createGame(
      result.gameId,
      playerId,
      result.opponentId,
      characterId,
      result.opponentCharacterId
    );

  /*
   * Get opponent socket.
   */

  const opponentSocket =
    getPlayer(
      result.opponentId
    );

  /*
   * Send MATCH_FOUND to Player 1.
   */

  socket.send(
    JSON.stringify({
      type: "MATCH_FOUND",
      gameId: result.gameId,
      playerId,
      opponentId: result.opponentId,
      characterId,
      opponentCharacterId:
        result.opponentCharacterId
    })
  );

  /*
   * Send MATCH_FOUND to Player 2.
   */

  opponentSocket?.send(
    JSON.stringify({
      type: "MATCH_FOUND",
      gameId: result.gameId,
      playerId: result.opponentId,
      opponentId: playerId,
      characterId:
        result.opponentCharacterId,
      opponentCharacterId: characterId
    })
  );

  /*
   * Send GAME_STARTED to Player 1.
   */

  socket.send(
    JSON.stringify({
      type: "GAME_STARTED",
      gameState
    })
  );

  /*
   * Send GAME_STARTED to Player 2.
   */

  opponentSocket?.send(
    JSON.stringify({
      type: "GAME_STARTED",
      gameState
    })
  );
}


/*
 * =========================================================
 * PLAY CARD
 * =========================================================
 */

async function handlePlayCard(
  socket: WebSocket,
  playerId: string,
  gameId: string,
  cardId: string
): Promise<void> {

  /*
   * Validate request.
   */

  if (!gameId || !cardId) {
    socket.send(
      JSON.stringify({
        type: "ACTION_ERROR",
        message:
          "gameId and cardId are required"
      })
    );

    return;
  }

  /*
   * Execute card action.
   */

  const result =
    await playCard(
      gameId,
      playerId,
      cardId
    );

  /*
   * Action failed.
   */

  if (!result.success) {
    socket.send(
      JSON.stringify({
        type: "ACTION_ERROR",
        message: result.message
      })
    );

    return;
  }

  /*
   * Game state returned by gameActions.
   */

  const gameState =
    result.gameState!;

  /*
   * =======================================================
   * GAME OVER
   * =======================================================
   */

  if (
    result.winnerId &&
    result.loserId
  ) {

    const winnerSocket =
      getPlayer(
        result.winnerId
      );

    const loserSocket =
      getPlayer(
        result.loserId
      );

    /*
     * Winner message.
     */

    winnerSocket?.send(
      JSON.stringify({
        type: "GAME_OVER",
        result: "WIN",
        winnerId: result.winnerId,
        loserId: result.loserId,
        gameState
      })
    );

    /*
     * Loser message.
     */

    loserSocket?.send(
      JSON.stringify({
        type: "GAME_OVER",
        result: "LOSE",
        winnerId: result.winnerId,
        loserId: result.loserId,
        gameState
      })
    );

    return;
  }

  /*
   * =======================================================
   * NORMAL GAME STATE UPDATE
   * =======================================================
   */

  const updateMessage =
    JSON.stringify({
      type: "GAME_STATE_UPDATED",
      gameState
    });

  /*
   * Send updated state to player.
   */

  socket.send(
    updateMessage
  );

  /*
   * Find opponent.
   */

  const opponentId =
    Object.keys(
      gameState.players
    ).find(
      (id) => id !== playerId
    );

  /*
   * Send updated state to opponent.
   */

  if (opponentId) {
    const opponentSocket =
      getPlayer(
        opponentId
      );

    opponentSocket?.send(
      updateMessage
    );
  }
}