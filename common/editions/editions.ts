import TroubleBrewing from "./trouble-brewing";
import SectsAndViolets from "./sects-and-violets";
import BadMoonRising from "./bad-moon-rising";

export const CHARACTERS = {
  TROUBLE_BREWING: TroubleBrewing,
  SECTS_AND_VIOLETS: SectsAndViolets,
  BAD_MOON_RISING: BadMoonRising,
} as const;

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

export const formatCharacterName = (character: Character): string => {
  return character
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};
