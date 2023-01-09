import { CHARACTERS, TroubleBrewingCharacter } from "@common/editions/editions";
import { getCharactersInPlay } from "@common/gameLogic";
import { Game } from "@common/model";

const names: string[] = [
  "Jessie",
  "John",
  "Kathy",
  "Mikko",
  "Nicola",
  "David",
  "Richard",
  "Charles",
  "Jussi",
  "Thomas",
  "Stephen",
  "Daniel",
  "Matthew",
  "Anthony",
  "Donald",
  "Mark",
  "Iina",
  "Laurie",
  "Andrew",
  "Eva",
];

export function pickRandomName(): string {
  if (names.length === 0) {
    return `JohnDoe`;
  }

  const index = Math.floor(Math.random() * names.length);
  const name = names[index];
  names.splice(index, 1);
  return name;
}

export function pickRandomCharacter(game: Game): TroubleBrewingCharacter {
  const availableCharacters = CHARACTERS.TROUBLE_BREWING.filter(
    (character) => !getCharactersInPlay(game).includes(character.id)
  );

  const index = Math.floor(Math.random() * availableCharacters.length);
  const character = availableCharacters[index];
  return character.id;
}
