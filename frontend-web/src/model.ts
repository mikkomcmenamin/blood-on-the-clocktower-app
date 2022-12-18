import { nextId } from "./util";

export type Player = {
  name: string;
  id: number;
};

export type Nomination =
  | {
      state: "active";
      nominator: Player;
      nominee: Player;
    }
  | {
      state: "pending";
      nominator: Player;
    }
  | {
      state: "inactive";
    };

export const createPlayer = (name: string): Player => ({
  name,
  id: nextId(),
});

export const isNominator = (player: Player, nomination: Nomination) =>
  nomination.state !== "inactive" && nomination.nominator.id === player.id;

export const isNominee = (player: Player, nomination: Nomination) =>
  nomination.state === "active" && nomination.nominee.id === player.id;
