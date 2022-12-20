import { Player } from "./model";

const randomSort = () => Math.random() - 0.5;

export const fakeNamesList = [
  "John",
  "TheScot",
  "Paul",
  "George",
  "Ringo",
  "Pete",
  "Mike",
  "Dave",
  "Nick",
  "Mick",
  "Keith",
  "Charlie",
  "Ronnie",
  "Ian",
  "Ron",
  "Bill",
  "Phil",
  "Bobby",
  "Bruce",
  "Eric",
  "Stevie",
  "Jimi",
  "Jimmy",
  "Robert",
  "Roger",
  "Freddie",
  "Elton",
  "Bono",
  "Chris",
  "Kurt",
  "Eddie",
  "Ozzy",

  "Linda",
  "Patti",
  "Janis",
  "Stevie",
  "Aretha",
  "Etta",
  "Diana",
  "Madonna",
  "Cher",
  "Janet",
  "Shania",
  "Celine",
  "Whitney",
  "Mariah",
  "Sheryl",
  "Dolly",
  "Carly",
  "Katy",
  "Taylor",
  "Beyonce",
  "Rihanna",
  "Lady Gaga",
  "Britney",
  "Christina",
  "Kesha",
  "Miley",
  "Adele",
  "Bjork",
  "Kylie",
  "Demi",
  "Katy",
  "Taylor",
].sort(randomSort);

export const nextId = (players: Player[]) => {
  const ids = players.map((player) => player.id);
  return Math.max(...ids, -1) + 1;
};

export const cat = (array: string[]) =>
  array.reduce((acc, cur) => (!cur ? acc : !acc ? cur : `${acc} ${cur}`), "");

export const classnames = (classes: Record<string, boolean>) =>
  cat(Object.entries(classes).map(([key, value]) => (value ? key : "")));
