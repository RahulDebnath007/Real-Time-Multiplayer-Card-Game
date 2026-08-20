import { useEffect, useRef, useState, type CSSProperties } from "react";

import {
  connectWebSocket,
  sendMessage,
  disconnectWebSocket,
} from "./services/websocket";

import type { GameState } from "./types/game";
import rasenganImage from "./assets/cards/rasengan.jpg";
import shadowCloneImage from "./assets/cards/shadow-clone.jpg";
import substitutionImage from "./assets/cards/substitution.jpg";
import chidoriImage from "./assets/cards/chidori.jpg";
import chidoriLightningImage from "./assets/cards/chidori-lightning.jpg";
import fireballImage from "./assets/cards/fireball.jpg";
import kamuiImage from "./assets/cards/kamui.jpg";
import genjutsuImage from "./assets/cards/genjutsu.jpg";
import infiniteTsukuyomiImage from "./assets/cards/infinite-tsukuyomi.jpg";
import leafHurricaneImage from "./assets/cards/leaf-hurricane.jpg";
import perfectSusanooImage from "./assets/cards/perfect-susanoo.jpg";
import sandCoffinImage from "./assets/cards/sand-coffin.jpg";
import sandStormImage from "./assets/cards/sand-storm.jpg";
import susanooImage from "./assets/cards/susanoo.jpg";
import eightGatesImage from "./assets/cards/eight-gates-of-death.jpg";

type CharacterId =
  | "naruto"
  | "sasuke"
  | "kakashi"
  | "itachi"
  | "gaara"
  | "madara"
  | "might_guy";

interface Character {
  id: CharacterId;
  name: string;
  shortName: string;
  moves: string[];
  color: string;
  description: string;
}

const CHARACTERS: Character[] = [
  {
    id: "naruto",
    name: "Naruto Uzumaki",
    shortName: "NARUTO",
    moves: ["rasengan", "shadow_clone", "substitution"],
    color: "orange",
    description: "The Hero of the Hidden Leaf",
  },
  {
    id: "sasuke",
    name: "Sasuke Uchiha",
    shortName: "SASUKE",
    moves: ["chidori", "fireball", "substitution"],
    color: "purple",
    description: "The Last Uchiha",
  },
  {
    id: "kakashi",
    name: "Kakashi Hatake",
    shortName: "KAKASHI",
    moves: ["chidori_lightning", "kamui", "substitution"],
    color: "blue",
    description: "The Copy Ninja of the Hidden Leaf.",
  },
  {
    id: "itachi",
    name: "Itachi Uchiha",
    shortName: "ITACHI",
    moves: ["genjutsu", "susanoo", "substitution"],
    color: "red",
    description: "The legendary Uchiha shinobi.",
  },
  {
    id: "gaara",
    name: "Gaara",
    shortName: "GAARA",
    moves: ["sand_storm", "sand_coffin", "substitution"],
    color: "sand",
    description: "The Kazekage who commands the sand.",
  },
  {
    id: "madara",
    name: "Madara Uchiha",
    shortName: "MADARA",
    moves: ["infinite_tsukuyomi", "perfect_susanoo", "substitution"],
    color: "purple",
    description: "The Ghost of the Uchiha",
  },
  {
    id: "might_guy",
    name: "Might Guy",
    shortName: "MIGHT GUY",
    moves: ["leaf_hurricane", "eight_gates_of_death", "substitution"],
    color: "green",
    description: "The Sublime Green Beast of the Leaf",
  },
];

const CHARACTER_IMAGES: Record<CharacterId, string> = {
  naruto: "/characters/naruto.jpg",
  sasuke: "/characters/sasuke.jpg",
  kakashi: "/characters/kakashi.jpg",
  itachi: "/characters/itachi.jpg",
  gaara: "/characters/gaara.jpg",
  madara: "/characters/madara.jpg",
  might_guy: "/characters/might-guy.jpg",
};

const CARD_IMAGES: Record<string, string> = {
  rasengan: rasenganImage,
  shadow_clone: shadowCloneImage,
  substitution: substitutionImage,

  chidori: chidoriImage,
  chidori_lightning: chidoriLightningImage,
  fireball: fireballImage,

  kamui: kamuiImage,
  genjutsu: genjutsuImage,

  infinite_tsukuyomi: infiniteTsukuyomiImage,
  leaf_hurricane: leafHurricaneImage,
  perfect_susanoo: perfectSusanooImage,

  sand_coffin: sandCoffinImage,
  sand_storm: sandStormImage,

  susanoo: susanooImage,
  eight_gates_of_death: eightGatesImage,
};

const CARD_INFO: Record<
  string,
  {
    name: string;
    type: "ATTACK" | "DEFENSE";
    damage: number;
    energy: number;
    shield: number;
  }
> = {
  rasengan: {
    name: "Rasengan",
    type: "ATTACK",
    damage: 40,
    energy: 3,
    shield: 0,
  },

  shadow_clone: {
    name: "Shadow Clone",
    type: "ATTACK",
    damage: 35,
    energy: 2,
    shield: 0,
  },

  chidori: {
    name: "Chidori",
    type: "ATTACK",
    damage: 40,
    energy: 3,
    shield: 0,
  },

  chidori_lightning: {
    name: "Chidori Lightning",
    type: "ATTACK",
    damage: 30,
    energy: 3,
    shield: 0,
  },

  fireball: {
    name: "Fireball",
    type: "ATTACK",
    damage: 35,
    energy: 2,
    shield: 0,
  },

  kamui: {
    name: "Kamui",
    type: "ATTACK",
    damage: 45,
    energy: 4,
    shield: 0,
  },

  genjutsu: {
    name: "Genjutsu",
    type: "ATTACK",
    damage: 30,
    energy: 2,
    shield: 0,
  },

  susanoo: {
    name: "Susanoo",
    type: "ATTACK",
    damage: 40,
    energy: 4,
    shield: 0,
  },

  sand_storm: {
    name: "Sand Storm",
    type: "ATTACK",
    damage: 30,
    energy: 2,
    shield: 0,
  },

  sand_coffin: {
    name: "Sand Coffin",
    type: "ATTACK",
    damage: 40,
    energy: 3,
    shield: 0,
  },

  infinite_tsukuyomi: {
    name: "Infinite Tsukuyomi",
    type: "ATTACK",
    damage: 40,
    energy: 3,
    shield: 0,
  },

  perfect_susanoo: {
    name: "Perfect Susanoo",
    type: "ATTACK",
    damage: 45,
    energy: 4,
    shield: 0,
  },

  leaf_hurricane: {
    name: "Leaf Hurricane",
    type: "ATTACK",
    damage: 30,
    energy: 2,
    shield: 0,
  },

  eight_gates_of_death: {
    name: "Eight Gates of Death",
    type: "ATTACK",
    damage: 45,
    energy: 5,
    shield: 0,
  },

  substitution: {
    name: "Substitution Jutsu",
    type: "DEFENSE",
    damage: 0,
    energy: 2,
    shield: 20,
  },
};

function formatMoveName(move: string): string {
  return move
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getCharacter(id: string | null): Character | null {
  if (!id) return null;

  return CHARACTERS.find((character) => character.id === id) ?? null;
}

function App() {
  const [connected, setConnected] = useState(false);

  const [playerId, setPlayerId] = useState<string | null>(null);

  const [gameState, setGameState] = useState<GameState | null>(null);

  const [gameId, setGameId] = useState<string | null>(null);

  const [message, setMessage] = useState("Connecting...");

  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterId>("naruto");

  const [opponentCharacterId, setOpponentCharacterId] =
    useState<CharacterId | null>(null);

  const [searching, setSearching] = useState(false);

  const [animatingCard, setAnimatingCard] = useState<string | null>(null);

  const [cardOrigin, setCardOrigin] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  const [cardAnimationKey, setCardAnimationKey] = useState(0);

  const animationTimer = useRef<number | null>(null);

  const [battleLog, setBattleLog] = useState<string[]>([]);

  const [combatFeedback, setCombatFeedback] = useState<{
    id: number;
    target: "YOU" | "OPPONENT";
    type: "ATTACK" | "DEFENSE";
    damage: number;
    absorbed: number;
    shieldGained: number;
    blocked: boolean;
    cardName: string;
  } | null>(null);

  const combatFeedbackId = useRef(0);
  const previousGameStateRef = useRef<GameState | null>(null);
  const combatFeedbackTimer = useRef<number | null>(null);

  const [gameResult, setGameResult] = useState<"WIN" | "LOSE" | null>(null);

  /*
   * =====================================================
   * MUSIC
   * =====================================================
   */

  const lobbyMusicRef = useRef<HTMLAudioElement | null>(null);
  const battleMusicRef = useRef<HTMLAudioElement | null>(null);

  const [musicEnabled, setMusicEnabled] = useState(true);

  /*
   * =====================================================
   * CREATE AUDIO
   * =====================================================
   */

  useEffect(() => {
    const lobbyMusic = new Audio("/audio/lobby.mp3");
    const battleMusic = new Audio("/audio/battle.mp3");

    lobbyMusic.loop = true;
    battleMusic.loop = true;

    lobbyMusic.volume = 0.6;
    battleMusic.volume = 0.7;

    lobbyMusicRef.current = lobbyMusic;
    battleMusicRef.current = battleMusic;

    return () => {
      lobbyMusic.pause();
      battleMusic.pause();

      lobbyMusic.currentTime = 0;
      battleMusic.currentTime = 0;

      lobbyMusicRef.current = null;
      battleMusicRef.current = null;

      if (animationTimer.current !== null) {
        window.clearTimeout(animationTimer.current);
      }
    };
  }, []);

  /*
   * =====================================================
   * SWITCH MUSIC BETWEEN LOBBY AND BATTLE
   * =====================================================
   */

  useEffect(() => {
    const lobbyMusic = lobbyMusicRef.current;
    const battleMusic = battleMusicRef.current;

    if (!lobbyMusic || !battleMusic) {
      return;
    }

    if (!musicEnabled) {
      lobbyMusic.pause();
      battleMusic.pause();
      return;
    }

    if (gameState) {
      lobbyMusic.pause();

      battleMusic.play().catch(() => {});
    } else if (!searching) {
      battleMusic.pause();
      battleMusic.currentTime = 0;

      lobbyMusic.play().catch(() => {});
    }
  }, [gameState, searching, musicEnabled]);

  /*
   * =====================================================
   * START LOBBY MUSIC AFTER USER INTERACTION
   * =====================================================
   */

  useEffect(() => {
    const startLobbyMusic = () => {
      if (!musicEnabled || gameState || !lobbyMusicRef.current) {
        return;
      }

      lobbyMusicRef.current.play().catch(() => {});
    };

    window.addEventListener("pointerdown", startLobbyMusic, {
      once: true,
    });

    return () => {
      window.removeEventListener("pointerdown", startLobbyMusic);
    };
  }, [musicEnabled, gameState]);

  /*
   * =====================================================
   * WEBSOCKET
   * =====================================================
   */

  useEffect(() => {
    const socket = connectWebSocket(
      (data) => {
        console.log("SERVER MESSAGE:", data);

        switch (data.type) {
          case "CONNECTED":
            setPlayerId(data.playerId);
            setMessage("Connected to server");
            break;

          case "QUEUE_JOINED":
            setSearching(true);
            setMessage("Searching for opponent...");
            break;

          case "MATCH_FOUND":
            setGameId(data.gameId);

            if (data.opponentCharacterId) {
              setOpponentCharacterId(data.opponentCharacterId as CharacterId);
            }

            setSearching(false);

            setMessage("Opponent found!");

            setBattleLog((previous) => [
              ...previous,
              `Opponent found — ${formatMoveName(data.opponentCharacterId)}`,
            ]);

            break;

          case "GAME_STARTED":
            setGameState(data.gameState);

            setGameId(data.gameState.gameId);

            setMessage("Battle started!");

            setSearching(false);

            setGameResult(null);

            setAnimatingCard(null);
            setCombatFeedback(null);
            previousGameStateRef.current = data.gameState;

            setBattleLog([
              `Battle started — ${
                getCharacter(selectedCharacter)?.name ?? "Your fighter"
              }`,
            ]);

            break;

          case "GAME_STATE_UPDATED": {
            const previousState = previousGameStateRef.current;
            const nextState = data.gameState as GameState;

            if (previousState && playerId) {
              const ids = Object.keys(nextState.players);

              for (const actorId of ids) {
                const before = previousState.players[actorId];
                const after = nextState.players[actorId];
                if (!before || !after) continue;

                const remaining = new Map<string, number>();
                for (const id of after.hand ?? []) remaining.set(id, (remaining.get(id) ?? 0) + 1);

                let playedCardId: string | null = null;
                for (const id of before.hand ?? []) {
                  const count = remaining.get(id) ?? 0;
                  if (count > 0) remaining.set(id, count - 1);
                  else { playedCardId = id; break; }
                }

                if (!playedCardId || !CARD_INFO[playedCardId]) continue;

                const card = CARD_INFO[playedCardId];
                const actorIsYou = actorId === playerId;
                const targetId = ids.find((id) => id !== actorId);

                if (card.type === "DEFENSE") {
                  const shieldGained = Math.max(0, (after.shield ?? 0) - (before.shield ?? 0));
                  const feedbackId = ++combatFeedbackId.current;
                  setCombatFeedback({ id: feedbackId, target: actorIsYou ? "YOU" : "OPPONENT", type: "DEFENSE", damage: 0, absorbed: 0, shieldGained, blocked: false, cardName: card.name });
                } else if (targetId) {
                  const targetBefore = previousState.players[targetId];
                  const targetAfter = nextState.players[targetId];
                  if (!targetBefore || !targetAfter) continue;
                  const damage = Math.max(0, (targetBefore.hp ?? 0) - (targetAfter.hp ?? 0));
                  const absorbed = Math.max(0, (targetBefore.shield ?? 0) - (targetAfter.shield ?? 0));
                  const feedbackId = ++combatFeedbackId.current;
                  setCombatFeedback({ id: feedbackId, target: targetId === playerId ? "YOU" : "OPPONENT", type: "ATTACK", damage, absorbed, shieldGained: 0, blocked: damage === 0 && absorbed > 0, cardName: card.name });

                  const resultText = [
                    damage > 0 ? `-${damage} HP` : "Blocked",
                    absorbed > 0 ? `${absorbed} shield absorbed` : "",
                  ].filter(Boolean).join(" · ");
                  setBattleLog((previous) => [...previous, `${actorIsYou ? "You" : "Opponent"} used ${card.name} — ${resultText}`]);
                } else {
                  const gained = Math.max(0, (after.shield ?? 0) - (before.shield ?? 0));
                  setBattleLog((previous) => [...previous, `${actorIsYou ? "You" : "Opponent"} used ${card.name} — +${gained} shield`]);
                }

                if (combatFeedbackTimer.current !== null) window.clearTimeout(combatFeedbackTimer.current);
                combatFeedbackTimer.current = window.setTimeout(() => {
                  setCombatFeedback(null);
                  combatFeedbackTimer.current = null;
                }, 1250);
                break;
              }
            }

            previousGameStateRef.current = nextState;
            setGameState(nextState);
            setMessage("Game state updated");
            setAnimatingCard(null);
            break;
          }

          case "GAME_OVER":
            setGameState(data.gameState);

            setGameResult(data.result);

            setMessage(data.result === "WIN" ? "Victory!" : "Defeat!");

            previousGameStateRef.current = data.gameState;
            setCombatFeedback(null);
            setAnimatingCard(null);

            setBattleLog((previous) => [
              ...previous,
              data.result === "WIN"
                ? "You defeated your opponent."
                : "You were defeated.",
            ]);

            break;

          case "ACTION_ERROR":
            setMessage(data.message);

            setAnimatingCard(null);

            break;

          default:
            console.log("Unknown message:", data);
        }
      },

      () => {
        setConnected(true);
        setMessage("Connected");
      },

      () => {
        setConnected(false);
        setMessage("Disconnected");
        setSearching(false);
      },
    );

    return () => {
      socket.close();
      disconnectWebSocket();
    };
  }, [selectedCharacter]);

  /*
   * =====================================================
   * JOIN QUEUE
   * =====================================================
   */

  function joinQueue() {
    if (!connected) {
      return;
    }

    setSearching(true);

    setMessage("Searching for opponent...");

    setBattleLog([]);

    /*
     * Make sure lobby music starts after the
     * user clicks FIND MATCH.
     */

    if (musicEnabled && lobbyMusicRef.current) {
      lobbyMusicRef.current.play().catch(() => {});
    }

    sendMessage({
      type: "JOIN_QUEUE",
      characterId: selectedCharacter,
    });
  }

  function leaveSelection() {
    setSearching(false);

    setMessage(connected ? "Connected to server" : "Connecting...");
  }

  /*
   * =====================================================
   * CARD PREVIEW
   * =====================================================
   */

  function previewCard(cardId: string, element: HTMLButtonElement) {
    if (!gameId || !gameState || !playerId) {
      return;
    }

    const myPlayer = gameState.players[playerId];

    const card = CARD_INFO[cardId];

    if (!myPlayer || !card) {
      return;
    }

    const disabled =
      gameState.currentTurn !== playerId || myPlayer.energy < card.energy;

    if (disabled || animatingCard) {
      return;
    }

    const rect = element.getBoundingClientRect();

    setCardOrigin({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    });

    if (animationTimer.current !== null) {
      window.clearTimeout(animationTimer.current);
    }

    setAnimatingCard(cardId);

    setCardAnimationKey((previous) => previous + 1);

    animationTimer.current = window.setTimeout(() => {
      playCard(cardId);

      animationTimer.current = null;
    }, 1350);
  }

  /*
   * =====================================================
   * PLAY CARD
   * =====================================================
   */

  function playCard(cardId: string) {
    if (!gameId || !gameState || !playerId) {
      return;
    }

    if (gameState.currentTurn !== playerId) {
      return;
    }

    setMessage(`${formatMoveName(cardId)} played...`);

    setBattleLog((previous) => [
      ...previous,
      `You used ${formatMoveName(cardId)}`,
    ]);

    setAnimatingCard(null);

    sendMessage({
      type: "PLAY_CARD",
      gameId,
      cardId,
    });
  }

  /*
   * =====================================================
   * RESET BATTLE
   * =====================================================
   */

  function resetBattle() {
    setGameState(null);
    setGameId(null);
    setOpponentCharacterId(null);
    setGameResult(null);
    setAnimatingCard(null);
    setCombatFeedback(null);
    previousGameStateRef.current = null;
    setBattleLog([]);
    setSearching(false);

    setMessage(connected ? "Choose your shinobi" : "Disconnected");
  }

  /*
   * =====================================================
   * CHARACTER SELECTION SCREEN
   * =====================================================
   */

  if (!gameState) {
    const currentCharacter = getCharacter(selectedCharacter);

    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,#241207_0%,#090909_35%,#050505_75%)]">
          <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090909]/90 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between">
              {/* LOGO / TITLE */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-500/40 bg-orange-500/10 text-lg sm:h-10 sm:w-10 sm:text-xl">
                    忍
                  </div>

                  <div className="min-w-0">
                    <h1 className="text-base font-black tracking-[0.16em] sm:text-xl sm:tracking-[0.2em]">
                      NARUTO CARD BATTLE
                    </h1>

                    <p className="mt-1 text-[8px] font-bold tracking-[0.22em] text-slate-500 sm:text-[9px] sm:tracking-[0.25em]">
                      REAL-TIME SHINOBI COMBAT
                    </p>
                  </div>
                </div>
              </div>

              {/* STATUS + MUSIC */}
              <div className="flex w-full items-center justify-end gap-2 sm:gap-3 md:w-auto">
                {/* ONLINE */}
                <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 sm:px-4">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      connected
                        ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                        : "bg-red-500"
                    }`}
                  />

                  <span className="text-[9px] font-black tracking-[0.18em] text-slate-400 sm:text-[10px] sm:tracking-[0.2em]">
                    {connected ? "ONLINE" : "OFFLINE"}
                  </span>
                </div>

                {/* MUSIC */}
                <button
                  type="button"
                  onClick={() => setMusicEnabled((previous) => !previous)}
                  className="flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[9px] font-black tracking-[0.15em] text-slate-400 transition hover:border-orange-500/30 hover:text-orange-400 sm:px-4 sm:text-[10px] sm:tracking-[0.18em]"
                  aria-label={musicEnabled ? "Mute music" : "Enable music"}
                >
                  {musicEnabled ? "♫ MUSIC ON" : "♫ MUSIC OFF"}
                </button>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-7xl px-6 py-10">
            <div className="mb-8">
              <p className="mb-2 text-[10px] font-black tracking-[0.35em] text-orange-500/70">
                SELECT YOUR SHINOBI
              </p>

              <h2 className="text-4xl font-black tracking-tight">
                Choose Your Character
              </h2>

              <p className="mt-3 max-w-2xl text-sm text-slate-500">
                Select a shinobi. Each character has a unique technique set and
                a different combat identity.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {CHARACTERS.map((character) => {
                  const selected = selectedCharacter === character.id;

                  return (
                    <button
                      key={character.id}
                      onClick={() => setSelectedCharacter(character.id)}
                      className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${
                        selected
                          ? character.color === "orange"
                            ? "border-orange-500/70 bg-orange-500/[0.07] shadow-[0_0_35px_rgba(249,115,22,0.12)]"
                            : character.color === "blue"
                              ? "border-blue-500/70 bg-blue-500/[0.07] shadow-[0_0_35px_rgba(59,130,246,0.12)]"
                              : character.color === "purple"
                                ? "border-purple-500/70 bg-purple-500/[0.07] shadow-[0_0_35px_rgba(168,85,247,0.12)]"
                                : character.color === "red"
                                  ? "border-red-500/70 bg-red-500/[0.07] shadow-[0_0_35px_rgba(239,68,68,0.12)]"
                                  : character.color === "sand"
                                    ? "border-yellow-500/70 bg-yellow-500/[0.07] shadow-[0_0_35px_rgba(234,179,8,0.12)]"
                                    : character.color === "green"
                                      ? "border-green-500/70 bg-green-500/[0.07] shadow-[0_0_35px_rgba(34,197,94,0.12)]"
                                      : "border-orange-500/70 bg-orange-500/[0.07]"
                          : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.045]"
                      }`}
                    >
                      {selected && (
                        <div className="absolute right-4 top-4 rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-1 text-[8px] font-black tracking-widest text-orange-400">
                          SELECTED
                        </div>
                      )}

                      <div className="mb-5 flex items-center gap-4">
                        <div
                          className={`h-16 w-16 shrink-0 overflow-hidden rounded-2xl border ${
                            selected
                              ? "border-orange-500/50 bg-orange-500/10"
                              : "border-white/10 bg-white/[0.04]"
                          }`}
                        >
                          <img
                            src={CHARACTER_IMAGES[character.id]}
                            alt={character.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>

                        <div>
                          <h3 className="text-lg font-black">
                            {character.name}
                          </h3>

                          <p className="mt-1 text-[9px] font-black tracking-[0.2em] text-slate-600">
                            {character.shortName}
                          </p>
                        </div>
                      </div>

                      <p className="mb-5 text-[10px] sm:text-xs leading-5 text-slate-500">
                        {character.description}
                      </p>

                      <div>
                        <p className="mb-3 text-[8px] font-black tracking-[0.25em] text-slate-600">
                          TECHNIQUES
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {character.moves.map((move) => (
                            <span
                              key={move}
                              className={`rounded-lg border px-2.5 py-1.5 text-[9px] font-bold ${
                                selected
                                  ? "border-orange-500/20 bg-orange-500/5 text-orange-300"
                                  : "border-white/10 bg-white/[0.03] text-slate-500"
                              }`}
                            >
                              {formatMoveName(move)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <aside className="h-fit rounded-2xl border border-orange-500/20 bg-[#0d0d0d] p-6 shadow-[0_0_60px_rgba(249,115,22,0.04)]">
                <p className="text-[9px] font-black tracking-[0.3em] text-slate-600">
                  SELECTED SHINOBI
                </p>

                <div className="mt-4 flex items-center gap-4">
                  {currentCharacter && (
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-orange-500/30">
                      <img
                        src={CHARACTER_IMAGES[currentCharacter.id]}
                        alt={currentCharacter.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <h3 className="text-2xl font-black">
                      {currentCharacter?.name}
                    </h3>

                    <p className="mt-2 text-[10px] sm:text-xs leading-5 text-slate-500">
                      {currentCharacter?.description}
                    </p>
                  </div>
                </div>

                <div className="my-6 h-px bg-white/10" />

                <p className="mb-4 text-[9px] font-black tracking-[0.25em] text-slate-600">
                  AVAILABLE MOVES
                </p>

                <div className="space-y-2">
                  {currentCharacter?.moves.map((move, index) => (
                    <div
                      key={move}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black text-orange-500">
                          0{index + 1}
                        </span>

                        <span className="text-[10px] sm:text-xs font-bold text-slate-300">
                          {formatMoveName(move)}
                        </span>
                      </div>

                      <span className="text-[8px] font-black tracking-widest text-slate-600">
                        MOVE
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black tracking-widest text-slate-600">
                      STATUS
                    </span>

                    <span className="text-[9px] font-black tracking-widest text-emerald-400">
                      {connected ? "READY" : "OFFLINE"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={joinQueue}
                  disabled={!connected || searching}
                  className="mt-5 w-full rounded-xl border border-orange-500/40 bg-orange-500 px-5 py-4 text-[10px] sm:text-xs font-black tracking-[0.2em] text-black transition-all duration-300 hover:bg-orange-400 hover:shadow-[0_0_30px_rgba(249,115,22,0.25)] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-slate-600 disabled:shadow-none"
                >
                  {searching ? "SEARCHING FOR OPPONENT..." : "FIND MATCH"}
                </button>

                {searching && (
                  <button
                    onClick={leaveSelection}
                    className="mt-3 w-full py-2 text-[9px] font-black tracking-[0.2em] text-slate-600 transition hover:text-slate-400"
                  >
                    CANCEL
                  </button>
                )}

                <p className="mt-4 text-center text-[9px] font-bold text-slate-700">
                  {message}
                </p>
              </aside>
            </div>
          </main>
        </div>
      </div>
    );
  }

  /*
   * =====================================================
   * BATTLE DATA
   * =====================================================
   */

  const myPlayer = playerId ? gameState.players[playerId] : null;

  const opponentId = playerId
    ? Object.keys(gameState.players).find((id) => id !== playerId)
    : null;

  const opponent = opponentId ? gameState.players[opponentId] : null;

  const isMyTurn = gameState.currentTurn === playerId;

  const myCharacter = getCharacter(selectedCharacter);

  const opponentCharacter = getCharacter(opponentCharacterId);

  const animatingCardIndex =
    animatingCard && myPlayer ? myPlayer.hand.indexOf(animatingCard) : -1;

  const previousCardId =
    animatingCardIndex >= 0 && myPlayer && myPlayer.hand.length > 1
      ? myPlayer.hand[
          (animatingCardIndex - 1 + myPlayer.hand.length) % myPlayer.hand.length
        ]
      : null;

  const nextCardId =
    animatingCardIndex >= 0 && myPlayer && myPlayer.hand.length > 1
      ? myPlayer.hand[(animatingCardIndex + 1) % myPlayer.hand.length]
      : null;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#241207_0%,#090909_35%,#050505_75%)]">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/40 bg-orange-500/10 text-xl">
                  忍
                </div>

                <div>
                  <h1 className="truncate text-base font-black tracking-[0.14em] sm:text-xl sm:tracking-[0.2em]">
                    NARUTO CARD BATTLE
                  </h1>

                  <p className="mt-1 text-[9px] font-bold tracking-[0.2em] text-slate-600">
                    GAME ID: {gameId}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex w-full items-center justify-end gap-2 md:w-auto">
              <button
                type="button"
                onClick={() => setMusicEnabled((previous) => !previous)}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[10px] font-black tracking-[0.18em] text-slate-400 transition hover:border-orange-500/30 hover:text-orange-400"
                aria-label={musicEnabled ? "Mute music" : "Enable music"}
              >
                {musicEnabled ? "♫ MUSIC ON" : "♫ MUSIC OFF"}
              </button>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    connected
                      ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                      : "bg-red-500"
                  }`}
                />

                <span className="text-[10px] font-black tracking-[0.2em] text-slate-400">
                  {connected ? "ONLINE" : "OFFLINE"}
                </span>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl space-y-4 px-3 py-4 sm:space-y-6 sm:px-6 sm:py-8">
          <section
            className={`relative overflow-hidden rounded-3xl border bg-[#090909] p-4 sm:p-6 ${
              isMyTurn
                ? "border-orange-500/30 shadow-[0_0_80px_rgba(249,115,22,0.06)]"
                : "border-white/10"
            }`}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.06),transparent_55%)]" />

            <div
              className={`relative rounded-2xl border border-red-500/15 bg-black/30 p-4 sm:p-5 ${
                combatFeedback?.target === "OPPONENT"
                  ? combatFeedback.type === "ATTACK" ? "combat-target-hit" : "combat-target-defense"
                  : ""
              }`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex min-w-0 items-center gap-3 md:min-w-[280px] md:gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-red-500/30 bg-red-500/5 sm:h-24 sm:w-24">
                    {opponentCharacter ? (
                      <img
                        src={CHARACTER_IMAGES[opponentCharacter.id]}
                        alt={opponentCharacter.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl">
                        忍
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] font-black tracking-[0.3em] text-red-400/70">
                      OPPONENT
                    </p>
                    <h2 className="mt-1 truncate text-xl font-black sm:text-2xl">
                      {opponentCharacter?.name ?? "Unknown Shinobi"}
                    </h2>
                    <p className="mt-1 text-[9px] font-black tracking-[0.2em] text-slate-600">
                      {opponentCharacter?.shortName ?? "UNKNOWN"}
                    </p>
                  </div>
                </div>

                {opponent && (
                  <div className="grid w-full flex-1 grid-cols-3 gap-2 sm:gap-3">
                    <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.025] p-2.5 sm:p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black tracking-[0.2em] text-slate-600">
                          HP
                        </span>
                        <span className="text-[10px] sm:text-xs font-black text-red-400">
                          {opponent.hp}/100
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-red-500 transition-all duration-500"
                          style={{
                            width: `${Math.max(0, Math.min(100, opponent.hp))}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.025] p-2.5 sm:p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black tracking-[0.2em] text-slate-600">
                          ENERGY
                        </span>
                        <span className="text-[10px] sm:text-xs font-black text-orange-400">
                          {opponent.energy}/5
                        </span>
                      </div>
                      <div className="mt-2 flex gap-1">
                        {[0, 1, 2, 3, 4].map((slot) => (
                          <div
                            key={slot}
                            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                              slot < opponent.energy
                                ? "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.45)]"
                                : "bg-white/10"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.025] p-2.5 sm:p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black tracking-[0.2em] text-slate-600">
                          SHIELD
                        </span>
                        <span className="text-[10px] sm:text-xs font-black text-blue-400">
                          {opponent.shield}
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-500"
                          style={{
                            width: `${Math.max(0, Math.min(100, opponent.shield * 5))}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex w-full shrink-0 items-center justify-between rounded-xl border border-red-500/15 bg-red-500/[0.04] px-4 py-2.5 md:w-auto md:min-w-[88px] md:block md:px-4 md:py-3 md:text-center">
                  <span className="text-[8px] font-black tracking-[0.2em] text-slate-600">
                    HAND
                  </span>
                  <span className="text-lg font-black text-slate-300 md:mt-1 md:block">
                    {opponent?.hand.length ?? 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-center py-4 sm:py-5">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div
                className={`mx-4 flex items-center gap-3 rounded-full border px-5 py-2.5 transition-all duration-500 sm:px-7 sm:py-3 ${
                  isMyTurn
                    ? "border-orange-400/60 bg-orange-500/10 text-orange-300 shadow-[0_0_35px_rgba(249,115,22,0.15)]"
                    : "border-white/10 bg-white/[0.03] text-slate-500"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isMyTurn
                      ? "animate-pulse bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.9)]"
                      : "bg-slate-600"
                  }`}
                />
                <div className="text-center">
                  <p className="text-[10px] font-black tracking-[0.25em]">
                    {isMyTurn ? "YOUR TURN" : "OPPONENT'S TURN"}
                  </p>
                  <p className="mt-0.5 text-[7px] font-bold tracking-[0.2em] text-slate-600">
                    TURN {gameState.turnNumber}
                  </p>
                </div>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {myPlayer && (
              <div
                className={`relative rounded-2xl border p-4 sm:p-5 ${
                  combatFeedback?.target === "YOU"
                    ? combatFeedback.type === "ATTACK" ? "combat-target-hit" : "combat-target-defense"
                    : isMyTurn
                      ? "border-orange-500/30 bg-orange-500/[0.025]"
                      : "border-white/10 bg-black/30"
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex min-w-0 items-center gap-3 md:min-w-[280px] md:gap-4">
                    <div
                      className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border sm:h-24 sm:w-24 ${
                        isMyTurn
                          ? "border-orange-500/50 shadow-[0_0_35px_rgba(249,115,22,0.12)]"
                          : "border-white/10"
                      }`}
                    >
                      {myCharacter ? (
                        <img
                          src={CHARACTER_IMAGES[myCharacter.id]}
                          alt={myCharacter.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-3xl">
                          忍
                        </div>
                      )}
                      {isMyTurn && (
                        <div className="absolute inset-x-0 bottom-0 bg-orange-500/90 py-1 text-center text-[7px] font-black tracking-[0.18em] text-black">
                          ACTIVE
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] font-black tracking-[0.3em] text-orange-400/70">
                        YOUR SHINOBI
                      </p>
                      <h2 className="mt-1 truncate text-xl font-black sm:text-2xl">
                        {myCharacter?.name ?? "Your Character"}
                      </h2>
                      <p className="mt-1 text-[9px] font-black tracking-[0.2em] text-slate-600">
                        {myCharacter?.shortName ?? "UNKNOWN"}
                      </p>
                    </div>
                  </div>

                  <div className="grid w-full flex-1 grid-cols-3 gap-2 sm:gap-3">
                    <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.025] p-2.5 sm:p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black tracking-[0.2em] text-slate-600">
                          HP
                        </span>
                        <span className="text-[10px] sm:text-xs font-black text-red-400">
                          {myPlayer.hp}/100
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-red-500 transition-all duration-500"
                          style={{
                            width: `${Math.max(0, Math.min(100, myPlayer.hp))}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div
                      className={`rounded-xl border p-3 ${
                        isMyTurn
                          ? "border-orange-500/20 bg-orange-500/[0.04]"
                          : "border-white/10 bg-white/[0.025]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black tracking-[0.2em] text-slate-600">
                          ENERGY
                        </span>
                        <span className="text-[10px] sm:text-xs font-black text-orange-400">
                          {myPlayer.energy}/5
                        </span>
                      </div>
                      <div className="mt-2 flex gap-1">
                        {[0, 1, 2, 3, 4].map((slot) => (
                          <div
                            key={slot}
                            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                              slot < myPlayer.energy
                                ? "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.45)]"
                                : "bg-white/10"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.025] p-2.5 sm:p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black tracking-[0.2em] text-slate-600">
                          SHIELD
                        </span>
                        <span className="text-[10px] sm:text-xs font-black text-blue-400">
                          {myPlayer.shield}
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-500"
                          style={{
                            width: `${Math.max(0, Math.min(100, myPlayer.shield * 5))}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full shrink-0 items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-4 py-2.5 md:w-auto md:min-w-[88px] md:block md:px-4 md:py-3 md:text-center">
                    <span className="text-[8px] font-black tracking-[0.2em] text-slate-600">
                      TURN
                    </span>
                    <span className="text-lg font-black text-orange-400 md:mt-1 md:block">
                      {gameState.turnNumber}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {myPlayer && (
            <section className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-4 sm:p-6">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[9px] font-black tracking-[0.3em] text-slate-600">
                    YOUR TECHNIQUES
                  </p>
                  <h3 className="mt-2 text-3xl font-black">Your Hand</h3>
                  <p className="mt-1 text-[10px] sm:text-xs text-slate-600">
                    {isMyTurn
                      ? "Choose a technique to attack or defend."
                      : "Wait for your turn to use a technique."}
                  </p>
                </div>

                <div
                  className={`rounded-full border px-4 py-2 text-[9px] font-black tracking-[0.18em] ${
                    isMyTurn
                      ? "border-orange-500/30 bg-orange-500/5 text-orange-400"
                      : "border-white/10 bg-white/[0.02] text-slate-600"
                  }`}
                >
                  {myPlayer.hand.length} CARDS
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {myPlayer.hand.map((cardId, index) => {
                  const card = CARD_INFO[cardId];

                  if (!card) {
                    return null;
                  }

                  const notEnoughEnergy = myPlayer.energy < card.energy;
                  const disabled = !isMyTurn || notEnoughEnergy;

                  return (
                    <button
                      key={`${cardId}-${index}`}
                      disabled={disabled}
                      title={
                        !isMyTurn
                          ? "Wait for your turn"
                          : notEnoughEnergy
                            ? `Need ${card.energy - myPlayer.energy} more energy`
                            : `Play ${card.name}`
                      }
                      onClick={(event) =>
                        previewCard(cardId, event.currentTarget)
                      }
                      className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
                        animatingCard === cardId ? "opacity-0" : ""
                      } ${
                        card.type === "DEFENSE"
                          ? "border-blue-500/30 bg-[#0c1118]"
                          : "border-orange-500/30 bg-[#120c09]"
                      } ${
                        disabled
                          ? "cursor-not-allowed opacity-35 grayscale-[0.35]"
                          : "cursor-pointer hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                      }`}
                    >
                      <div
                        className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ${
                          disabled
                            ? ""
                            : card.type === "DEFENSE"
                              ? "bg-blue-400/[0.035] group-hover:opacity-100"
                              : "bg-orange-400/[0.035] group-hover:opacity-100"
                        }`}
                      />

                      <div className="relative p-4 sm:p-5">
                        <div className="mb-4 flex items-center justify-between">
                          <span
                            className={`text-[8px] font-black tracking-[0.25em] ${
                              card.type === "DEFENSE"
                                ? "text-blue-400"
                                : "text-orange-400"
                            }`}
                          >
                            {card.type}
                          </span>

                          <span
                            className={`rounded-lg px-3 py-2 text-[10px] sm:text-xs font-black ${
                              notEnoughEnergy
                                ? "bg-red-500/10 text-red-400"
                                : "bg-white/[0.06] text-slate-300"
                            }`}
                          >
                            ⚡ {card.energy}
                          </span>
                        </div>

                        <div
                          className={`mb-4 flex h-40 items-center justify-center overflow-hidden rounded-xl bg-black/40 ${
                            disabled ? "brightness-75" : ""
                          }`}
                        >
                          {CARD_IMAGES[cardId] ? (
                            <img
                              src={CARD_IMAGES[cardId]}
                              alt={card.name}
                              className={`h-full w-full object-contain transition-transform duration-500 ${
                                disabled ? "" : "group-hover:scale-105"
                              }`}
                            />
                          ) : (
                            <div className="text-5xl">⚡</div>
                          )}
                        </div>

                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-lg font-black">{card.name}</h4>
                          <span className="shrink-0 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-[8px] font-black text-slate-600">
                            #{String(index + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <div className="mt-4 flex items-end gap-2">
                          {card.damage > 0 && (
                            <>
                              <span
                                className={`text-3xl font-black ${
                                  card.type === "DEFENSE"
                                    ? "text-blue-400"
                                    : "text-orange-400"
                                }`}
                              >
                                {card.damage}
                              </span>
                              <span className="mb-1 text-[8px] font-black tracking-widest text-slate-600">
                                DAMAGE
                              </span>
                            </>
                          )}

                          {card.shield > 0 && (
                            <>
                              <span className="text-3xl font-black text-blue-400">
                                +{card.shield}
                              </span>
                              <span className="mb-1 text-[8px] font-black tracking-widest text-slate-600">
                                SHIELD
                              </span>
                            </>
                          )}
                        </div>

                        <div
                          className={`mt-5 border-t border-white/10 pt-3 text-center text-[8px] font-black tracking-[0.18em] ${
                            disabled
                              ? notEnoughEnergy
                                ? "text-red-400/60"
                                : "text-slate-700"
                              : "text-slate-600 transition-colors group-hover:text-slate-300"
                          }`}
                        >
                          {!isMyTurn
                            ? "WAIT FOR YOUR TURN"
                            : notEnoughEnergy
                              ? `NEED ${card.energy - myPlayer.energy} MORE ENERGY`
                              : "CLICK TO PLAY"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          <section className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black tracking-[0.3em] text-slate-600">
                  COMBAT HISTORY
                </p>
                <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                  Battle Log
                </h2>
              </div>

              <div className="rounded-xl border border-white/10 px-4 py-3 text-[9px] font-black tracking-widest text-slate-500">
                {battleLog.length} EVENTS
              </div>
            </div>

            <div className="space-y-2">
              {battleLog.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-6 text-center text-[10px] sm:text-xs text-slate-600">
                  No combat events yet.
                </div>
              ) : (
                battleLog.map((event, index) => (
                  <div
                    key={`${event}-${index}`}
                    className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 sm:px-5 sm:py-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-base">
                      ⚔️
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] font-black tracking-widest text-slate-600">
                        EVENT {index + 1}
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-300">
                        {event}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
     
        {animatingCard && cardOrigin && CARD_INFO[animatingCard] && (
          <div
            key={cardAnimationKey}
            className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" />

            <div className="absolute inset-x-0 top-1/2 h-[min(460px,80vh)] -translate-y-1/2">
              {previousCardId && CARD_INFO[previousCardId] && (
                <div
                  className={`absolute left-1/2 top-1/2 h-[240px] w-[160px] sm:h-[280px] sm:w-[190px] overflow-hidden rounded-2xl border bg-[#090909]/90 ${
                    CARD_INFO[previousCardId].type === "DEFENSE"
                      ? "border-blue-400/30 shadow-[0_0_45px_rgba(59,130,246,0.18)]"
                      : "border-orange-400/30 shadow-[0_0_45px_rgba(249,115,22,0.18)]"
                  } card-side-left`}
                >
                  <div className="flex h-full flex-col opacity-55">
                    <div className="h-12 shrink-0 border-b border-white/10 px-4 py-3">
                      <span className="text-[8px] font-black tracking-[0.2em] text-slate-500">
                        {CARD_INFO[previousCardId].type}
                      </span>
                    </div>

                    <div className="flex flex-1 items-center justify-center overflow-hidden bg-black/40">
                      {CARD_IMAGES[previousCardId] ? (
                        <img
                          src={CARD_IMAGES[previousCardId]}
                          alt=""
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-5xl">⚡</span>
                      )}
                    </div>

                    <div className="border-t border-white/10 px-4 py-4">
                      <p className="truncate text-sm font-black text-slate-300">
                        {CARD_INFO[previousCardId].name}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {nextCardId && CARD_INFO[nextCardId] && (
                <div
                  className={`absolute left-1/2 top-1/2 h-[240px] w-[160px] sm:h-[280px] sm:w-[190px]overflow-hidden rounded-2xl border bg-[#090909]/90 ${
                    CARD_INFO[nextCardId].type === "DEFENSE"
                      ? "border-blue-400/30 shadow-[0_0_45px_rgba(59,130,246,0.18)]"
                      : "border-orange-400/30 shadow-[0_0_45px_rgba(249,115,22,0.18)]"
                  } card-side-right`}
                >
                  <div className="flex h-full flex-col opacity-55">
                    <div className="h-12 shrink-0 border-b border-white/10 px-4 py-3">
                      <span className="text-[8px] font-black tracking-[0.2em] text-slate-500">
                        {CARD_INFO[nextCardId].type}
                      </span>
                    </div>

                    <div className="flex flex-1 items-center justify-center overflow-hidden bg-black/40">
                      {CARD_IMAGES[nextCardId] ? (
                        <img
                          src={CARD_IMAGES[nextCardId]}
                          alt=""
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-5xl">⚡</span>
                      )}
                    </div>

                    <div className="border-t border-white/10 px-4 py-4">
                      <p className="truncate text-sm font-black text-slate-300">
                        {CARD_INFO[nextCardId].name}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div
                className={`absolute left-0 top-0 overflow-hidden rounded-2xl border bg-[#080808] ${
                  CARD_INFO[animatingCard].type === "DEFENSE"
                    ? "border-blue-400 shadow-[0_0_90px_rgba(59,130,246,0.55)]"
                    : "border-orange-400 shadow-[0_0_90px_rgba(249,115,22,0.55)]"
                } card-carousel-animation`}
                style={
                  {
                    left: cardOrigin.left,
                    top: cardOrigin.top,
                    width: cardOrigin.width,
                    height: cardOrigin.height,
                    "--origin-left": `${cardOrigin.left}px`,
                    "--origin-top": `${cardOrigin.top}px`,
                    "--origin-width": `${cardOrigin.width}px`,
                    "--origin-height": `${cardOrigin.height}px`,
                  } as CSSProperties
                }
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between px-5 py-4">
                    <span
                      className={`text-[9px] font-black tracking-[0.25em] ${
                        CARD_INFO[animatingCard].type === "DEFENSE"
                          ? "text-blue-400"
                          : "text-orange-400"
                      }`}
                    >
                      {CARD_INFO[animatingCard].type}
                    </span>

                    <span className="rounded-lg bg-white/[0.08] px-3 py-2 text-[10px] sm:text-xs font-black">
                      ⚡ {CARD_INFO[animatingCard].energy}
                    </span>
                  </div>

                  <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black/50">
                    <div
                      className={`absolute inset-0 ${
                        CARD_INFO[animatingCard].type === "DEFENSE"
                          ? "bg-blue-500/[0.06]"
                          : "bg-orange-500/[0.06]"
                      }`}
                    />

                    {CARD_IMAGES[animatingCard] ? (
                      <img
                        src={CARD_IMAGES[animatingCard]}
                        alt={CARD_INFO[animatingCard].name}
                        className="relative h-full w-full object-contain"
                      />
                    ) : (
                      <div className="relative text-6xl">⚡</div>
                    )}
                  </div>

                  <div className="border-t border-white/10 bg-black/30 px-5 py-5">
                    <p className="text-[8px] font-black tracking-[0.3em] text-slate-500">
                      TECHNIQUE
                    </p>

                    <h2 className="mt-2 text-xl font-black">
                      {CARD_INFO[animatingCard].name}
                    </h2>

                    <div className="mt-3 flex items-end gap-2">
                      {CARD_INFO[animatingCard].damage > 0 && (
                        <>
                          <span
                            className={`text-3xl font-black ${
                              CARD_INFO[animatingCard].type === "DEFENSE"
                                ? "text-blue-400"
                                : "text-orange-400"
                            }`}
                          >
                            {CARD_INFO[animatingCard].damage}
                          </span>

                          <span className="mb-1 text-[8px] font-black tracking-widest text-slate-600">
                            DAMAGE
                          </span>
                        </>
                      )}

                      {CARD_INFO[animatingCard].shield > 0 && (
                        <>
                          <span className="text-3xl font-black text-blue-400">
                            +{CARD_INFO[animatingCard].shield}
                          </span>

                          <span className="mb-1 text-[8px] font-black tracking-widest text-slate-600">
                            SHIELD
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-[-18px] left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/70 px-4 py-2 backdrop-blur-xl card-action-label">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    CARD_INFO[animatingCard].type === "DEFENSE"
                      ? "bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.9)]"
                      : "bg-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.9)]"
                  }`}
                />

                <span className="text-[8px] font-black tracking-[0.28em] text-slate-400">
                  {CARD_INFO[animatingCard].name.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}
        {combatFeedback && (
          <div key={combatFeedback.id} className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center overflow-hidden">
            <div className={combatFeedback.type === "DEFENSE" ? "combat-defense-flash" : "combat-hit-flash"} />
            <div className={`relative flex min-w-[230px] flex-col items-center rounded-2xl border bg-black/85 px-8 py-6 text-center shadow-2xl backdrop-blur-md ${combatFeedback.type === "DEFENSE" ? "border-blue-400/50 combat-feedback-defense" : "border-orange-400/50 combat-feedback-hit"}`}>
              <div className={`text-[9px] font-black tracking-[0.3em] ${combatFeedback.type === "DEFENSE" ? "text-blue-400" : "text-orange-400"}`}>
                {combatFeedback.type === "DEFENSE" ? "DEFENSE ACTIVATED" : "HIT CONFIRMED"}
              </div>
              <div className="mt-2 text-sm font-black text-white">{combatFeedback.cardName}</div>
              {combatFeedback.type === "ATTACK" ? (
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  {combatFeedback.damage > 0 && <span className="combat-number-damage text-4xl font-black text-red-400">-{combatFeedback.damage} HP</span>}
                  {combatFeedback.absorbed > 0 && <span className="combat-number-shield rounded-lg border border-blue-400/30 bg-blue-500/10 px-3 py-2 text-sm font-black text-blue-300">🛡 {combatFeedback.absorbed} ABSORBED</span>}
                  {combatFeedback.blocked && <span className="mt-1 w-full text-[9px] font-black tracking-[0.25em] text-blue-300">ATTACK BLOCKED</span>}
                </div>
              ) : (
                <div className="mt-3 text-3xl font-black text-blue-300">+{combatFeedback.shieldGained} SHIELD</div>
              )}
            </div>
          </div>
        )}

        {gameResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-md">
            <div
              className={`w-full max-w-md rounded-3xl border p-10 text-center shadow-2xl ${
                gameResult === "WIN"
                  ? "border-orange-500/40 bg-[#100d0a] shadow-orange-500/10"
                  : "border-red-500/30 bg-[#100909] shadow-red-500/10"
              }`}
            >
              <div className="mb-6 text-6xl">
                {gameResult === "WIN" ? "🏆" : "💀"}
              </div>

              <p className="text-[10px] font-black tracking-[0.35em] text-slate-500">
                BATTLE FINISHED
              </p>

              <h2
                className={`mt-4 text-5xl font-black ${
                  gameResult === "WIN" ? "text-orange-500" : "text-red-500"
                }`}
              >
                {gameResult === "WIN" ? "VICTORY" : "DEFEAT"}
              </h2>

              <p className="mt-4 text-sm text-slate-500">
                {gameResult === "WIN"
                  ? "Your opponent has been defeated."
                  : "Your shinobi has been defeated."}
              </p>

              <button
                onClick={resetBattle}
                className="mt-8 w-full rounded-xl border border-orange-500/40 bg-orange-500 px-6 py-4 text-[10px] sm:text-xs font-black tracking-[0.2em] text-black transition hover:bg-orange-400"
              >
                CHOOSE ANOTHER CHARACTER
              </button>
            </div>
          </div>
        )}
      </div>

<footer className="mt-20 w-full px-4 pb-8 sm:px-6">
  <div className="mb-6 h-px w-full bg-white/10" />

  <div className="flex flex-col items-center gap-2 text-center">
    <span className="text-[9px] font-bold tracking-[3px] text-orange-500 sm:text-[11px] sm:tracking-[4px]">
      NARUTO CARD BATTLE
    </span>

    <span className="text-[10px] tracking-[0.5px] text-slate-500 sm:text-[11px] sm:tracking-[1px]">
      © 2026 Rahul Debnath. All Rights Reserved.
    </span>

    <span className="max-w-[600px] text-[8px] leading-relaxed tracking-[0.5px] text-slate-600 sm:text-[9px] sm:tracking-[0.8px]">
      Fan-made project • Naruto and related characters belong to their
      respective owners.
    </span>
  </div>
</footer>

      <style>
        {`
          @keyframes combatHitFlash { 0%,100%{opacity:0} 18%{opacity:.22} 35%{opacity:.04} 55%{opacity:.12} 100%{opacity:0} }
          @keyframes combatDefenseFlash { 0%,100%{opacity:0} 25%{opacity:.18} 55%{opacity:.05} 100%{opacity:0} }
          @keyframes combatFeedbackHit { 0%{opacity:0;transform:translateY(14px) scale(.88)} 18%{opacity:1;transform:translateY(0) scale(1.03)} 78%{opacity:1;transform:translateY(-3px) scale(1)} 100%{opacity:0;transform:translateY(-18px) scale(.98)} }
          @keyframes combatFeedbackDefense { 0%{opacity:0;transform:translateY(12px) scale(.9)} 20%{opacity:1;transform:translateY(0) scale(1.03)} 78%{opacity:1;transform:translateY(-3px) scale(1)} 100%{opacity:0;transform:translateY(-16px) scale(.98)} }
          @keyframes combatDamageNumber { 0%{opacity:0;transform:scale(.7)} 20%{opacity:1;transform:scale(1.12)} 40%{transform:scale(1)} 100%{opacity:0;transform:translateY(-10px) scale(.98)} }
          @keyframes combatShieldNumber { 0%{opacity:0;transform:scale(.75)} 25%{opacity:1;transform:scale(1.06)} 100%{opacity:0;transform:translateY(-8px)} }
          @keyframes combatTargetHit { 0%,100%{transform:translateX(0);filter:none} 12%{transform:translateX(-6px);filter:brightness(1.3)} 24%{transform:translateX(6px)} 36%{transform:translateX(-4px)} 48%{transform:translateX(4px)} 60%{transform:translateX(0)} }
          @keyframes combatTargetDefense { 0%{box-shadow:0 0 0 rgba(59,130,246,0)} 35%{box-shadow:0 0 45px rgba(59,130,246,.28),inset 0 0 25px rgba(59,130,246,.07)} 100%{box-shadow:0 0 0 rgba(59,130,246,0)} }
          .combat-hit-flash,.combat-defense-flash{position:absolute;inset:0;pointer-events:none}
          .combat-hit-flash{background:radial-gradient(circle at center,rgba(239,68,68,.15),transparent 48%);animation:combatHitFlash 1.05s ease-out forwards}
          .combat-defense-flash{background:radial-gradient(circle at center,rgba(59,130,246,.15),transparent 48%);animation:combatDefenseFlash 1.05s ease-out forwards}
          .combat-feedback-hit{animation:combatFeedbackHit 1.25s cubic-bezier(.22,1,.36,1) forwards}
          .combat-feedback-defense{animation:combatFeedbackDefense 1.25s cubic-bezier(.22,1,.36,1) forwards}
          .combat-number-damage{animation:combatDamageNumber 1.05s cubic-bezier(.22,1,.36,1) forwards}
          .combat-number-shield{animation:combatShieldNumber 1.05s ease-out .05s forwards}
          .combat-target-hit{animation:combatTargetHit .62s cubic-bezier(.36,0,.66,1)}
          .combat-target-defense{animation:combatTargetDefense .95s ease-out}

          @keyframes cardCarouselFocus {
            0% {
              left: var(--origin-left);
              top: var(--origin-top);
              width: var(--origin-width);
              height: var(--origin-height);
              transform: translate(0, 0) scale(1) rotate(0deg);
              opacity: 1;
              filter: blur(0);
            }

         16% {
  left: 50%;
  top: 50%;
  width: min(280px, calc(100vw - 40px));
  height: min(420px, calc(100vh - 100px));
  transform: translate(-50%, -50%) scale(0.94) rotate(-1deg);
  opacity: 1;
  filter: blur(0);
}

34% {
  left: 50%;
  top: 50%;
  width: min(280px, calc(100vw - 40px));
  height: min(420px, calc(100vh - 100px));
  transform: translate(-50%, -50%) scale(1.04) rotate(0deg);
  opacity: 1;
  filter: blur(0);
}

58% {
  left: 50%;
  top: 50%;
  width: min(280px, calc(100vw - 40px));
  height: min(420px, calc(100vh - 100px));
  transform: translate(-50%, -50%) scale(1) rotate(0deg);
  opacity: 1;
  filter: blur(0);
}

76% {
  left: 50%;
  top: 50%;
  width: min(280px, calc(100vw - 40px));
  height: min(420px, calc(100vh - 100px));
  transform: translate(-50%, -50%) scale(1.025) rotate(0deg);
  opacity: 1;
  filter: blur(0);
}

            100% {
              left: 50%;
  top: 50%;
              width: min(280px, calc(100vw - 40px));
  height: min(420px, calc(100vh - 100px));
              transform:translate(-50%, -50%) scale(1.025) rotate(0deg);
              opacity: 1;
              filter: blur(0);
            }
          }

          @keyframes cardSideLeft {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) translateX(0) scale(0.72) rotate(-2deg);
              filter: blur(10px);
            }

            35% {
              opacity: 0.35;
              transform: translate(-50%, -50%) translateX(clamp(-155px, -42vw, -100px)) scale(0.82) rotate(-5deg);
              filter: blur(5px);
            }

            55% {
              opacity: 0.35;
              transform: translate(-50%, -50%) translateX(clamp(-185px, -48vw, -120px)) scale(0.82) rotate(-5deg);
              filter: blur(5px);
            }

            68% {
              opacity: 0;
              transform: translate(-50%, -50%) translateX(-185px) scale(0.82) rotate(-5deg);
              filter: blur(5px);
            }

            100% {
              opacity: 0;
              transform: translate(-50%, -50%) translateX(-185px) scale(0.82) rotate(-5deg);
              filter: blur(5px);
            }
          }

          @keyframes cardSideRight {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) translateX(0) scale(0.72) rotate(2deg);
              filter: blur(10px);
            }

            35% {
              opacity: 0.35;
              transform: translate(-50%, -50%) translateX(clamp(100px, 42vw, 155px)) scale(0.82) rotate(5deg);
              filter: blur(5px);
            }

            55% {
              opacity: 0.35;
              transform: translate(-50%, -50%) translateX(clamp(120px, 48vw, 185px)) scale(0.82) rotate(5deg);
              filter: blur(5px);
            }

            68% {
              opacity: 0;
              transform: translate(-50%, -50%) translateX(185px) scale(0.82) rotate(5deg);
              filter: blur(5px);
            }

            100% {
              opacity: 0;
              transform: translate(-50%, -50%) translateX(185px) scale(0.82) rotate(5deg);
              filter: blur(5px);
            }
          }

          @keyframes cardActionLabel {
            0% {
              opacity: 0;
              transform: translate(-50%, 8px);
            }

            35% {
              opacity: 0;
              transform: translate(-50%, 8px);
            }

            55% {
              opacity: 1;
              transform: translate(-50%, 0);
            }

            82% {
              opacity: 1;
              transform: translate(-50%, 0);
            }

            100% {
              opacity: 0;
              transform: translate(-50%, 5px);
            }
          }

          .card-carousel-animation {
            animation:
              cardCarouselFocus 1.35s
              cubic-bezier(0.22, 1, 0.36, 1)
              forwards;
          }

          .card-side-left {
            animation:
              cardSideLeft 1.35s
              cubic-bezier(0.22, 1, 0.36, 1)
              forwards;
          }

          .card-side-right {
            animation:
              cardSideRight 1.35s
              cubic-bezier(0.22, 1, 0.36, 1)
              forwards;
          }

          .card-action-label {
            animation:
              cardActionLabel 1.35s
              ease-out
              forwards;
          }
        `}
      </style>
    </div>
  );
}

export default App;