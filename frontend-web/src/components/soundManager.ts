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
import Vote from "../assets/sounds/S_Vote.mp3";
import Triumph from "../assets/sounds/S_Triumph.mp3";
import TriumphEvil from "../assets/sounds/S_TriumphEvil.mp3";
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
  vote: new Audio(Vote),
  newDay: new Audio(NewDay),
  triumph: new Audio(Triumph),
  triumphEvil: new Audio(TriumphEvil),
  voteCountdown: new Audio(VoteCountdown),
  anticipation: new Audio(Anticipation),
  demonsWin: new Audio(DemonsWin),
};

type SoundType = keyof typeof SOUNDS;

const isAnyPlaying = (s: SoundType) => {
  const audio = getSound(s);
  const sounds = audio instanceof Array ? audio : [audio];
  return sounds.some(isPlaying);
};

const isPlaying = (a: HTMLAudioElement) => !a.paused;

const noop = () => {};

let globalVolume = 1;
export function setGlobalVolume(volume: number) {
  globalVolume = volume;
  changeVolumeForAllSounds();
}

export function playSound(soundType: SoundType, loop = false, volume = 1) {
  const audio = pickSound(soundType);
  audio.currentTime = 0;
  audio.loop = loop;
  audio.volume = globalVolume * volume;
  if (!isAnyPlaying(soundType) && globalVolume > 0) {
    return audio.play().catch(noop);
  }
  return Promise.resolve();
}

export function loopSound(soundType: SoundType, volume = 1) {
  return playSound(soundType, true, volume);
}

export function stopSound(soundType: SoundType) {
  const audio = getSound(soundType);
  const sounds = audio instanceof Array ? audio : [audio];
  for (const s of sounds) {
    if (isPlaying(s)) {
      s.pause();
      s.currentTime = 0;
    }
  }
}

export function stopAllSounds() {
  const soundTypes = Object.keys(SOUNDS) as SoundType[];
  soundTypes.forEach(stopSound);
}

export function stopAllSoundsExcept(soundType: SoundType) {
  const soundTypes = Object.keys(SOUNDS) as SoundType[];
  soundTypes.forEach((type) => {
    if (type !== soundType) {
      stopSound(type);
    }
  });
}

export function changeVolumeForAllSounds() {
  const soundTypes = Object.keys(SOUNDS) as SoundType[];
  soundTypes.forEach((soundType) => {
    // Unfortunately Apple doesn't allow us to change the volume of a playing sound
    // So this hack instead:
    if (globalVolume === 0) {
      stopSound(soundType);
      return;
    }

    const sound = getSound(soundType);
    if (sound instanceof Array) {
      sound.forEach((s) => {
        s.volume = globalVolume;
      });
    } else {
      sound.volume = globalVolume;
    }
  });
}

function pickSound(type: SoundType): HTMLAudioElement {
  const sound = SOUNDS[type];
  if (sound instanceof Array) {
    return sound[Math.floor(Math.random() * sound.length)];
  } else {
    return sound;
  }
}

function getSound(type: SoundType): HTMLAudioElement | HTMLAudioElement[] {
  return SOUNDS[type];
}
