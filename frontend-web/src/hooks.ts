import { useEffect, useLayoutEffect } from "react";
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

export function useHandleNominationUIEffects(nomination: Nomination) {
  // Handle setting the hour and minute hands of the clock to point at the nominating and nominated players respectively
  useLayoutEffect(() => {
    if (nomination.state === "inactive") {
      document.body.style.setProperty("--nominator-id", "0");
      document.body.style.setProperty("--nominee-id", "0");
      return;
    }

    if (nomination.state === "pending") {
      document.body.style.setProperty(
        "--nominator-id",
        nomination.nominator.id.toString()
      );
      document.body.style.setProperty("--nominee-id", "0");
      return;
    }

    if (nomination.state === "active") {
      document.body.style.setProperty(
        "--nominator-id",
        nomination.nominator.id.toString()
      );
      document.body.style.setProperty(
        "--nominee-id",
        nomination.nominee.id.toString()
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
