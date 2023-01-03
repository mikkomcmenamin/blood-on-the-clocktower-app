import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Game, Nomination, Player } from "@common/model";
import {
  loopSound,
  playSound,
  stopAllSounds,
  stopSound,
} from "./components/soundManager";
import {
  isActiveNomination,
  isDay,
  isInactiveNomination,
  isNight,
} from "@common/gameLogic";

export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) {
  useEffect(() => {
    const handleClickOutside = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);

    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, [ref, callback]);
}

export function useHandleNominationUIEffects(
  nomination: Nomination,
  players: Player[]
) {
  // Handle setting the hour and minute hands of the clock to point at the nominating and nominated players respectively
  useLayoutEffect(() => {
    if (nomination.state === "inactive") {
      document.body.style.setProperty("--nominator-index", "0");
      document.body.style.setProperty("--nominee-index", "0");
      return;
    }

    if (nomination.state === "pending") {
      const nominatorIndex = players.findIndex(
        (player) => player.id === nomination.nominator.id
      )!;
      document.body.style.setProperty(
        "--nominator-index",
        nominatorIndex.toString()
      );
      document.body.style.setProperty("--nominee-index", "0");
      return;
    }

    if (nomination.state === "active") {
      const nominatorIndex = players.findIndex(
        (player) => player.id === nomination.nominator.id
      )!;
      const nomineeIndex = players.findIndex(
        (player) => player.id === nomination.nominee.id
      )!;
      document.body.style.setProperty(
        "--nominator-index",
        nominatorIndex.toString()
      );
      document.body.style.setProperty(
        "--nominee-index",
        nomineeIndex.toString()
      );
      return;
    }
  }, [nomination, players]);
}

export function useHandlePlayerCountChangeUIEffects(players: Player[]) {
  // set the --num-players css variable defined on .App to be the number of players
  // this is used to calculate the rotation angle per player
  useLayoutEffect(() => {
    document.body.style.setProperty("--num-players", players.length.toString());
  }, [players.length]);
}

export function useWindowInnerWidth(): number {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

export function useDropzone({
  ref,
  onDrop,
  exact = false,
}: {
  ref: React.RefObject<HTMLElement>;
  onDrop: (e: DragEvent) => void;
  exact?: boolean;
  deps?: any[];
}) {
  useEffect(() => {
    if (!ref.current) return;
    const handleDrop = (e: DragEvent) => {
      if (exact) {
        if (ref.current === (e.target as Node)) {
          onDrop(e);
        }
        return;
      }
      if (ref.current?.contains(e.target as Node)) {
        onDrop(e);
      }
    };

    const preventDefault = (e: DragEvent) => e.preventDefault();

    ref.current.addEventListener("drop", handleDrop);
    ref.current.addEventListener("dragover", preventDefault);

    const current = ref.current;

    return () => {
      current.removeEventListener("drop", handleDrop);
      current.removeEventListener("dragover", preventDefault);
    };
  }, [ref, onDrop, exact]);
}

type PressHandlers = {
  onShortPress?: (e: PointerEvent) => void;
  onLongPress?: (e: PointerEvent) => void;
};

// Should fire the callback when a long press is detected (e.g. at least 1 second)
// And another when a short press is detected (e.g. less than 1 second)
export function usePressDurationDependentHandlers(
  ref: React.RefObject<HTMLElement>,
  handlers: PressHandlers,
  timeout = 1000
) {
  const [longPressFired, setLongPressFired] = useState(false);
  useEffect(() => {
    if (!ref.current) return;

    let timer: NodeJS.Timeout;

    const handlePointerDown = (e: PointerEvent) => {
      timer = setTimeout(() => {
        handlers.onLongPress?.(e);
        setLongPressFired(true);
      }, timeout);
    };

    const handlePointerUp = (e: PointerEvent) => {
      !longPressFired && handlers.onShortPress?.(e);
      cancel();
    };

    const cancel = () => {
      setLongPressFired(false);
      clearTimeout(timer);
    };

    ref.current.addEventListener("pointerdown", handlePointerDown);
    ref.current.addEventListener("pointerup", handlePointerUp);
    // dragging should not count as a long press
    ref.current.addEventListener("dragstart", cancel);

    const current = ref.current;

    return () => {
      current.removeEventListener("pointerdown", handlePointerDown);
      current.removeEventListener("pointerup", handlePointerUp);
      current.removeEventListener("dragstart", cancel);
    };
  }, [ref, handlers, timeout, longPressFired]);
}

export function useWhilePressed(
  ref: React.RefObject<HTMLElement>,
  onPressStart: (e: PointerEvent) => void,
  onPressEnd: (e: PointerEvent) => void,
  enabled: boolean
) {
  useEffect(() => {
    if (!ref.current || !enabled) return;

    const handlePointerDown = (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onPressStart(e);
    };

    const handlePointerUp = (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onPressEnd(e);
    };

    ref.current.addEventListener("pointerdown", handlePointerDown);
    ref.current.addEventListener("pointerup", handlePointerUp);

    const current = ref.current;

    return () => {
      current.removeEventListener("pointerdown", handlePointerDown);
      current.removeEventListener("pointerup", handlePointerUp);
    };
  }, [ref, onPressStart, onPressEnd, enabled]);
}

export function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useDeclarativeSoundPlayer(game: Game) {
  // Victory music when the game is over
  // TODO: play a different sound if the evil team wins
  useEffect(() => {
    if (game.stage === "finished") {
      stopAllSounds();
      playSound(game.winningTeam === "good" ? "triumph" : "triumphEvil");
    } else if (game.stage === "setup") {
      stopAllSounds();
    }
  }, [game.stage, "winningTeam" in game ? game.winningTeam : null]);

  // Night music
  const night = isNight(game);
  useEffect(() => {
    if (night) {
      stopAllSounds();
      loopSound("demonsWin");
    }
  }, [night]);

  // Stop sounds when day starts
  // TODO: day ambience or a sound to indicate the start of the day?
  const day = isDay(game);
  useEffect(() => {
    if (day) {
      stopAllSounds();
    }
  }, [day]);

  // Nomination starts
  const activeNomination = isActiveNomination(game);
  useEffect(() => {
    if (activeNomination) {
      stopAllSounds();
      playSound("nomination");
    }
  }, [activeNomination]);

  // Player has died, play a random death sound
  const previousPlayers = usePrevious(game.players);
  useEffect(() => {
    if (!isDay(game)) return;

    const playerHasDied = game.players.some(
      (player) =>
        !player.alive &&
        previousPlayers?.some(
          (p) => "alive" in p && p.id === player.id && p.alive
        )
    );

    if (playerHasDied) {
      stopAllSounds();
      playSound("death");
    }
  }, [game, previousPlayers]);

  // There is an active nomination and a player votes, play a bojoing sound
  const previousNomination: Nomination | undefined = usePrevious(
    isActiveNomination(game) ? game.phase.nomination : { state: "inactive" }
  );
  useEffect(() => {
    if (!isActiveNomination(game)) return;

    const previousVoteCount =
      previousNomination?.state === "active"
        ? previousNomination.voters.length
        : 0;
    const playerHasVoted =
      game.phase.nomination.voters.length > previousVoteCount;

    if (playerHasVoted) {
      playSound("vote");
    }
  }, [game, previousNomination]);

  // A player is on the block, and there is no active nomination, play anticipatory music
  const onTheBlock =
    isDay(game) && isInactiveNomination(game) && !!game.phase.onTheBlock;
  useEffect(() => {
    if (onTheBlock) {
      stopSound("anticipation");
      loopSound("anticipation", 0.5);
    } else {
      stopSound("anticipation");
    }
  }, [onTheBlock]);
}
