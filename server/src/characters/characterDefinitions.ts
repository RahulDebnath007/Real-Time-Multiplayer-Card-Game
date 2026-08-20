export interface Character {
  id: string;
  name: string;
  moves: string[];
}

export const CHARACTERS: Record<string, Character> = {
  naruto: {
    id: "naruto",
    name: "Naruto Uzumaki",
    moves: [
      "rasengan",
      "shadow_clone",
      "substitution"
    ]
  },

  sasuke: {
    id: "sasuke",
    name: "Sasuke Uchiha",
    moves: [
      "chidori",
      "fireball",
      "substitution"
    ]
  },

  kakashi: {
    id: "kakashi",
    name: "Kakashi Hatake",
    moves: [
      "chidori_lightning",
      "kamui",
      "substitution"
    ]
  },

  itachi: {
    id: "itachi",
    name: "Itachi Uchiha",
    moves: [
      "genjutsu",
      "susanoo",
      "substitution"
    ]
  },

  gaara: {
    id: "gaara",
    name: "Gaara",
    moves: [
      "sand_storm",
      "sand_coffin",
      "substitution"
    ]
  },

  madara: {
    id: "madara",
    name: "Madara Uchiha",
    moves: [
      "infinite_tsukuyomi",
      "perfect_susanoo",
      "substitution"
    ]
  },

  might_guy: {
    id: "might_guy",
    name: "Might Guy",
    moves: [
      "leaf_hurricane",
      "eight_gates_of_death",
      "substitution"
    ]
  }
};