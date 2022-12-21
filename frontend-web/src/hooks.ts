import { useEffect, useLayoutEffect, useState } from "react";
import { Nomination, Player } from "@common/model";

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
  }, [nomination]);
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