import { atom } from "jotai";
import urlPathPart from "./utils";

const isInitiallyMobile = window.innerWidth <= 768;

const initialDeathReminders: number[] = [];

export const storyTellerModeAtom = atom(isInitiallyMobile);
export const deathRemindersAtom = atom(initialDeathReminders);
export const soundVolumeAtom = atom(isInitiallyMobile ? 0 : 1);
export const videoAtom = atom(!isInitiallyMobile);
export const gameIdAtom = atom(urlPathPart);
