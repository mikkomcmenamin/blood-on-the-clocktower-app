import TroubleBrewing from "./trouble-brewing";
import SectsAndViolets from "./sects-and-violets";
import BadMoonRising from "./bad-moon-rising";

export const CHARACTERS = {
  TROUBLE_BREWING: TroubleBrewing,
  SECTS_AND_VIOLETS: SectsAndViolets,
  BAD_MOON_RISING: BadMoonRising,
} as const;

export const EDITIONS = {
  TROUBLE_BREWING: {
    id: "TROUBLE_BREWING",
    name: "Trouble Brewing",
    characters: CHARACTERS.TROUBLE_BREWING,
  },
  SECTS_AND_VIOLETS: {
    id: "SECTS_AND_VIOLETS",
    name: "Sects and Violets",
    characters: CHARACTERS.SECTS_AND_VIOLETS,
  },
  BAD_MOON_RISING: {
    id: "BAD_MOON_RISING",
    name: "Bad Moon Rising",
    characters: CHARACTERS.BAD_MOON_RISING,
  },
} as const;

export type Edition = typeof EDITIONS[keyof typeof EDITIONS];
export type EditionId = Edition["id"];

export type TroubleBrewingCharacter =
  typeof CHARACTERS.TROUBLE_BREWING[number]["id"];
export type SectsAndVioletsCharacter =
  typeof CHARACTERS.SECTS_AND_VIOLETS[number]["id"];
export type BadMoonRisingCharacter =
  typeof CHARACTERS.BAD_MOON_RISING[number]["id"];

export type Character =
  | TroubleBrewingCharacter
  | SectsAndVioletsCharacter
  | BadMoonRisingCharacter;

export const formatCharacterName = (character: string): string => {
  return character
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};
