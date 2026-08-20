import redisClient from "../redis/redisClient";
import { CARDS } from "../cards/cardDefinitions";
import {
  CHARACTERS
} from "../characters/characterDefinitions";
import { GameState } from "./gameTypes";

function createPlayerDeck(
  cards: string[]
): string[] {
  return [...cards];
}

function drawCards(
  deck: string[],
  count: number
): {
  deck: string[];
  hand: string[];
} {
  const hand: string[] = [];
  const remainingDeck = [...deck];

  for (
    let i = 0;
    i < count && remainingDeck.length > 0;
    i++
  ) {
    const card = remainingDeck.shift();

    if (card) {
      hand.push(card);
    }
  }

  return {
    deck: remainingDeck,
    hand
  };
}

export async function createGame(
  gameId: string,
  player1Id: string,
  player2Id: string,
  player1CharacterId: string,
  player2CharacterId: string
): Promise<GameState> {

  /*
   * =====================================================
   * GET SELECTED CHARACTERS
   * =====================================================
   */

  const player1Character =
    CHARACTERS[player1CharacterId];

  const player2Character =
    CHARACTERS[player2CharacterId];

  /*
   * =====================================================
   * VALIDATE CHARACTERS
   * =====================================================
   */

  if (!player1Character) {
    throw new Error(
      `Invalid character for player 1: ${player1CharacterId}`
    );
  }

  if (!player2Character) {
    throw new Error(
      `Invalid character for player 2: ${player2CharacterId}`
    );
  }

  /*
   * =====================================================
   * CREATE DECKS FROM CHARACTER MOVES
   * =====================================================
   *
   * Each character gets their own moves.
   */

  const player1Deck = createPlayerDeck([
    ...player1Character.moves,
    ...player1Character.moves
  ]);

  const player2Deck = createPlayerDeck([
    ...player2Character.moves,
    ...player2Character.moves
  ]);

  /*
   * =====================================================
   * DRAW INITIAL HAND
   * =====================================================
   */

  const player1Draw = drawCards(
    player1Deck,
    3
  );

  const player2Draw = drawCards(
    player2Deck,
    3
  );

  /*
   * =====================================================
   * CREATE GAME STATE
   * =====================================================
   */

  const gameState: GameState = {
    gameId,

    status: "ACTIVE",

    currentTurn: player1Id,

    turnNumber: 1,

    players: {

      [player1Id]: {
        hp: 100,
        energy: 5,

        deck: player1Draw.deck,

        hand: player1Draw.hand,

        discard: [],

        shield: 0,

        characterId:
          player1Character.id
      },

      [player2Id]: {
        hp: 100,
        energy: 5,

        deck: player2Draw.deck,

        hand: player2Draw.hand,

        discard: [],

        shield: 0,

        characterId:
          player2Character.id
      }
    }
  };

  /*
   * =====================================================
   * SAVE GAME TO REDIS
   * =====================================================
   */

  const gameKey =
    `game:${gameId}`;

  await redisClient.set(
    gameKey,
    JSON.stringify(gameState)
  );

  /*
   * =====================================================
   * VERIFY REDIS SAVE
   * =====================================================
   */

  const savedGame =
    await redisClient.get(gameKey);

  if (!savedGame) {

    console.error(
      "ERROR: Game was not saved to Redis:",
      gameKey
    );

    throw new Error(
      "Failed to save game to Redis"
    );
  }

  console.log(
    `Game saved to Redis: ${gameKey}`
  );

  console.log(
    `Player 1 character: ${player1Character.name}`
  );

  console.log(
    `Player 2 character: ${player2Character.name}`
  );

  return gameState;
}

export async function getGame(
  gameId: string
): Promise<GameState | null> {

  const gameKey =
    `game:${gameId}`;

  const gameData =
    await redisClient.get(gameKey);

  if (!gameData) {

    console.log(
      `Game not found in Redis: ${gameKey}`
    );

    return null;
  }

  return JSON.parse(
    gameData
  ) as GameState;
}

export async function updateGame(
  gameState: GameState
): Promise<void> {

  const gameKey =
    `game:${gameState.gameId}`;

  await redisClient.set(
    gameKey,
    JSON.stringify(gameState)
  );

  console.log(
    `Game updated in Redis: ${gameKey}`
  );
}

export function getCard(
  cardId: string
) {
  return CARDS[cardId];
}