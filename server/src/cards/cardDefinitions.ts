export interface Card {
  id: string;

  name: string;

  type: "ATTACK" | "DEFENSE";

  damage: number;

  energyCost: number;

  shield: number;
}

export const CARDS: Record<string, Card> = {
  /*
   * =====================================================
   * NARUTO
   * =====================================================
   */

  rasengan: {
    id: "rasengan",
    name: "Rasengan",
    type: "ATTACK",
    damage: 40,
    energyCost: 3,
    shield: 0
  },

  shadow_clone: {
    id: "shadow_clone",
    name: "Shadow Clone",
    type: "ATTACK",
    damage: 35,
    energyCost: 2,
    shield: 0
  },

  /*
   * =====================================================
   * SASUKE
   * =====================================================
   */

  chidori: {
    id: "chidori",
    name: "Chidori",
    type: "ATTACK",
    damage: 40,
    energyCost: 3,
    shield: 0
  },

  fireball: {
    id: "fireball",
    name: "Fireball",
    type: "ATTACK",
    damage: 35,
    energyCost: 2,
    shield: 0
  },

  /*
   * =====================================================
   * KAKASHI
   * =====================================================
   */

  kamui: {
    id: "kamui",
    name: "Kamui",
    type: "ATTACK",
    damage: 45,
    energyCost: 4,
    shield: 0
  },

  /*
   * =====================================================
   * ITACHI
   * =====================================================
   */

  genjutsu: {
    id: "genjutsu",
    name: "Genjutsu",
    type: "ATTACK",
    damage: 30,
    energyCost: 2,
    shield: 0
  },

  susanoo: {
    id: "susanoo",
    name: "Susanoo",
    type: "ATTACK",
    damage: 40,
    energyCost: 4,
    shield: 0
  },

  /*
   * =====================================================
   * GAARA
   * =====================================================
   */

  sand_storm: {
    id: "sand_storm",
    name: "Sand Storm",
    type: "ATTACK",
    damage: 30,
    energyCost: 2,
    shield: 0
  },

  sand_coffin: {
    id: "sand_coffin",
    name: "Sand Coffin",
    type: "ATTACK",
    damage: 40,
    energyCost: 3,
    shield: 0
  },

  /*
   * =====================================================
   * MADARA
   * =====================================================
   */

  infinite_tsukuyomi: {
    id: "infinite_tsukuyomi",
    name: "Infinite Tsukuyomi",
    type: "ATTACK",
    damage: 40,
    energyCost: 3,
    shield: 0
  },

  perfect_susanoo: {
    id: "perfect_susanoo",
    name: "Perfect Susanoo",
    type: "ATTACK",
    damage: 45,
    energyCost: 4,
    shield: 0
  },

  /*
   * =====================================================
   * MIGHT GUY
   * =====================================================
   */

  leaf_hurricane: {
    id: "leaf_hurricane",
    name: "Leaf Hurricane",
    type: "ATTACK",
    damage: 30,
    energyCost: 2,
    shield: 0
  },

  eight_gates_of_death: {
    id: "eight_gates_of_death",
    name: "Eight Gates of Death",
    type: "ATTACK",
    damage: 45,
    energyCost: 5,
    shield: 0
  },
  chidori_lightning: {
  id: "chidori_lightning",
  name: "Chidori",
  type: "ATTACK",
  damage: 30,
  energyCost: 3,
  shield: 0
},

  /*
   * =====================================================
   * COMMON DEFENSE
   * =====================================================
   */

  substitution: {
    id: "substitution",
    name: "Substitution Jutsu",
    type: "DEFENSE",
    damage: 0,
    energyCost: 2,
    shield: 20
  }
};