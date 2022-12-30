import NightLoop from "../assets/sounds/S_NightLoop.mp3";
import Anticipation from "../assets/sounds/S_Anticipation.mp3";
import DeathDemon from "../assets/sounds/S_DeathDemon.mp3";
import DeathFemale1 from "../assets/sounds/S_DeathFemale1.mp3";
import DeathFemale2 from "../assets/sounds/S_DeathFemale2.mp3";
import DeathFemale3 from "../assets/sounds/S_DeathFemale3.mp3";
import DeathMale1 from "../assets/sounds/S_DeathMale1.mp3";
import DeathMale2 from "../assets/sounds/S_DeathMale2.mp3";
import DeathMale3 from "../assets/sounds/S_DeathMale3.mp3";
import DemonsWin from "../assets/sounds/S_DemonsWin.mp3";
import NewDay from "../assets/sounds/S_NewDay.mp3";
import Nomination from "../assets/sounds/S_Nomination1.mp3";
import Nomination2 from "../assets/sounds/S_Nomination2.mp3";
import NominationInitiated from "../assets/sounds/S_NominationInitiated.mp3";
import Triumph from "../assets/sounds/S_Triumph.mp3";
import VoteCountdown from "../assets/sounds/S_VoteCountdown.mp3";

type soundType =
  "nightloop"
  | "death"
  | "deathdemon"
  | "nomination"
  | "newday"
  | "triumph"
  | "votecountdown"
  | "anticipation"
  | "demonswin";


let isSoundsEnabled = true;

export function enableSounds(enable: boolean){
  isSoundsEnabled = enable;
}

//TODO: don't create a new audio object everytime
export function playSound(soundType: soundType, loop = false, volume = 1){

  if(!isSoundsEnabled) return;

  const audio = new Audio(getSource(soundType));
  audio.currentTime = 0;
  audio.loop = loop;
  audio.volume = 1;
  audio.play();
}

function getSource(soundType: soundType): string {
  switch (soundType) {
    case "nightloop":
      return NightLoop;
    case "death":
      return getRandomDeathSound();
    case "deathdemon":
      return DeathDemon;
    case "nomination":
      return Nomination;
    case "newday":
      return NewDay;
    case "triumph":
      return Triumph;
    case "votecountdown":
      return VoteCountdown;
    case "anticipation":
      return Anticipation;
    case "demonswin":
      return DemonsWin;
  }
}

function getRandomDeathSound(): string {

  const deathSounds: string[] = [
    DeathFemale1,
    DeathFemale2,
    DeathFemale3,
    DeathMale1,
    DeathMale2,
    DeathMale3,
    ];

  return deathSounds[Math.floor(Math.random() * deathSounds.length)];
}
