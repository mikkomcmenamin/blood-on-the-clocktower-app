import { atom } from "jotai";

const isInitiallyMobile = window.innerWidth <= 768;

export const storyTellerModeAtom = atom(isInitiallyMobile);
export const deathRemindersAtom = atom<number[]>([]);
export const soundVolumeAtom = atom<0 | 1>(isInitiallyMobile ? 0 : 1);
export const videoAtom = atom(!isInitiallyMobile);
