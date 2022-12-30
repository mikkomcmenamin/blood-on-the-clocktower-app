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

const SOUNDS = {
  nightloop: new Audio(NightLoop),
  death: [
    new Audio(DeathFemale1),
    new Audio(DeathFemale2),
    new Audio(DeathFemale3),
    new Audio(DeathMale1),
    new Audio(DeathMale2),
    new Audio(DeathMale3),
  ],
  deathDemon: new Audio(DeathDemon),
  nomination: new Audio(Nomination),
  nomination2: new Audio(Nomination2),
  nominationInitiated: new Audio(NominationInitiated),
  newDay: new Audio(NewDay),
  triumph: new Audio(Triumph),
  voteCountdown: new Audio(VoteCountdown),
  anticipation: new Audio(Anticipation),
  demonsWin: new Audio(DemonsWin),
} as const;

type SoundType = keyof typeof SOUNDS;

let isSoundsEnabled = true;

export function toggleSounds(enable: boolean) {
  isSoundsEnabled = enable;
}

export function playSound(soundType: SoundType, loop = false, volume = 1) {
  if (!isSoundsEnabled) return;

  const audio = getSound(soundType);
  audio.currentTime = 0;
  audio.loop = loop;
  audio.volume = volume;
  audio.play();
}

function getSound(type: SoundType): HTMLAudioElement {
  const sound = SOUNDS[type];
  if (Array.isArray(sound)) {
    return sound[Math.floor(Math.random() * sound.length)];
  } else if (sound instanceof HTMLAudioElement) {
    return sound;
  }

  throw new Error("Why doesnt typescript know this check is exhaustive");
}
