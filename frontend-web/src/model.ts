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
