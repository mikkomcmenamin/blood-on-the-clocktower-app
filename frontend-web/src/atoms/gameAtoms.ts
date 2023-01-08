import { Game, initialGameState, Nomination } from "@common/model";
import { atom } from "jotai";
import { GameAction, isDay, isNight } from "@common/gameLogic";
import urlPathPart from "../utils";
import { client, semaphore } from "../networking";

export const gameAtom = atom<Game>(initialGameState);
export const nominationAtom = atom<Nomination>((get) => {
  const game = get(gameAtom);
  if (!isDay(game)) {
    return { state: "inactive" };
  }

  return game.phase.nomination;
});

export const isDayAtom = atom((get) => {
  return isDay(get(gameAtom));
});

export const isNightAtom = atom((get) => {
  return isNight(get(gameAtom));
});

export const gameIdAtom = atom(urlPathPart);
export const interactiveAtom = atom(false);

export const dispatchAtom = atom((get) => {
  const gameId = get(gameIdAtom);
  const interactive = get(interactiveAtom);
  const dispatch = async (action: GameAction) => {
    if (!interactive) {
      return;
    }
    await semaphore.lock;
    console.log("Dispatching action", action);

    try {
      semaphore.lock = new Promise((resolve) => {
        semaphore.unlock = resolve;
      });
      await client.gameAction.mutate({ gameId, action });
    } catch (e) {
      console.error(e);
      semaphore.unlock();
    }
  };

  return dispatch;
});
