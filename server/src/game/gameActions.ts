import redisClient from "../redis/redisClient";
import { getCard } from "./gameService";
import { GameState } from "./gameTypes";
import { randomUUID } from "crypto";

export interface PlayCardResult {
  success: boolean;
  message: string;
  gameState?: GameState;
  winnerId?: string;
  loserId?: string;
}

const LOCK_TTL = 3000;
const MAX_LOCK_ATTEMPTS = 20;
const LOCK_RETRY_DELAY = 50;

const MAX_ENERGY = 5;
const ENERGY_REGEN = 3;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function acquireGameLock(
  lockKey: string,
  lockToken: string
): Promise<boolean> {
  for (
    let attempt = 0;
    attempt < MAX_LOCK_ATTEMPTS;
    attempt++
  ) {
    const result = await redisClient.set(
      lockKey,
      lockToken,
      {
        NX: true,
        PX: LOCK_TTL
      }
    );

    if (result === "OK") {
      return true;
    }

    await sleep(LOCK_RETRY_DELAY);
  }

  return false;
}

async function releaseGameLock(
  lockKey: string,
  lockToken: string
): Promise<void> {
  const currentToken =
    await redisClient.get(lockKey);

  if (currentToken === lockToken) {
    await redisClient.del(lockKey);
  }
}

function shuffleDeck(
  cards: string[]
): string[] {
  const shuffled = [...cards];

  for (
    let i = shuffled.length - 1;
    i > 0;
    i--
  ) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [
      shuffled[i],
      shuffled[j]
    ] = [
      shuffled[j],
      shuffled[i]
    ];
  }

  return shuffled;
}

function drawCard(
  player: {
    deck: string[];
    hand: string[];
    discard: string[];
  }
): void {
  if (player.deck.length === 0) {
    if (player.discard.length === 0) {
      return;
    }

    player.deck = shuffleDeck(
      player.discard
    );

    player.discard = [];
  }

  const card = player.deck.shift();

  if (card) {
    player.hand.push(card);
  }
}

function regenerateEnergy(
  player: {
    energy: number;
  }
): void {
  player.energy = Math.min(
    MAX_ENERGY,
    player.energy + ENERGY_REGEN
  );
}

export async function playCard(
  gameId: string,
  playerId: string,
  cardId: string
): Promise<PlayCardResult> {
  const gameKey = `game:${gameId}`;

  const lockKey =
    `lock:game:${gameId}`;

  const lockToken = randomUUID();

  const acquired =
    await acquireGameLock(
      lockKey,
      lockToken
    );

  if (!acquired) {
    return {
      success: false,
      message:
        "Game is busy. Please try again."
    };
  }

  try {
    const gameData =
      await redisClient.get(gameKey);

    if (!gameData) {
      return {
        success: false,
        message: "Game not found"
      };
    }

    const gameState =
      JSON.parse(gameData) as GameState;

    if (gameState.status !== "ACTIVE") {
      return {
        success: false,
        message: "Game is not active"
      };
    }

    if (
      gameState.currentTurn !== playerId
    ) {
      return {
        success: false,
        message:
          "It is not your turn"
      };
    }

    const player =
      gameState.players[playerId];

    if (!player) {
      return {
        success: false,
        message:
          "Player is not part of this game"
      };
    }

    const card = getCard(cardId);

    if (!card) {
      return {
        success: false,
        message: "Card does not exist"
      };
    }

    if (!player.hand.includes(cardId)) {
      return {
        success: false,
        message:
          "You do not have this card in your hand"
      };
    }

    if (
      player.energy < card.energyCost
    ) {
      return {
        success: false,
        message:
          `Not enough energy. You have ${player.energy}, but ${card.name} requires ${card.energyCost}.`
      };
    }

    const opponentId =
      Object.keys(
        gameState.players
      ).find(
        (id) => id !== playerId
      );

    if (!opponentId) {
      return {
        success: false,
        message:
          "Opponent not found"
      };
    }

    const opponent =
      gameState.players[opponentId];

    /*
     * PAY ENERGY
     */

    player.energy -=
      card.energyCost;

    /*
     * REMOVE ONE COPY
     * OF THE PLAYED CARD
     */

    const cardIndex =
      player.hand.indexOf(cardId);

    player.hand.splice(
      cardIndex,
      1
    );

    /*
     * MOVE CARD TO DISCARD
     */

    player.discard.push(cardId);

    /*
     * DEFENSE CARD
     */

    if (card.type === "DEFENSE") {
      player.shield += card.shield;

      drawCard(player);

      gameState.currentTurn =
        opponentId;

      gameState.turnNumber += 1;

      /*
       * REGENERATE THE NEW
       * ACTIVE PLAYER
       */

      regenerateEnergy(
        opponent
      );

      await redisClient.set(
        gameKey,
        JSON.stringify(gameState)
      );

      return {
        success: true,
        message:
          `${card.name} activated. Shield increased by ${card.shield}.`,
        gameState
      };
    }

    /*
     * ATTACK CARD
     */

    if (card.type === "ATTACK") {
      let remainingDamage =
        card.damage;

      /*
       * SHIELD ABSORBS DAMAGE
       */

      if (opponent.shield > 0) {
        const absorbedDamage =
          Math.min(
            opponent.shield,
            remainingDamage
          );

        opponent.shield -=
          absorbedDamage;

        remainingDamage -=
          absorbedDamage;
      }

      /*
       * REMAINING DAMAGE
       * GOES TO HP
       */

      if (remainingDamage > 0) {
        opponent.hp -=
          remainingDamage;
      }

      /*
       * GAME OVER
       */

      if (opponent.hp <= 0) {
        opponent.hp = 0;

        gameState.status =
          "FINISHED";

        await redisClient.set(
          gameKey,
          JSON.stringify(gameState)
        );

        return {
          success: true,
          message:
            `${card.name} defeated the opponent`,
          gameState,
          winnerId: playerId,
          loserId: opponentId
        };
      }
    }

    /*
     * DRAW ONE CARD
     */

    drawCard(player);

    /*
     * SWITCH TURN
     */

    gameState.currentTurn =
      opponentId;

    gameState.turnNumber += 1;

    /*
     * REGENERATE ENERGY
     * FOR NEW ACTIVE PLAYER
     */

    regenerateEnergy(
      opponent
    );

    /*
     * SAVE GAME
     */

    await redisClient.set(
      gameKey,
      JSON.stringify(gameState)
    );

    return {
      success: true,
      message:
        `${card.name} played successfully`,
      gameState
    };

  } finally {
    await releaseGameLock(
      lockKey,
      lockToken
    );
  }
}