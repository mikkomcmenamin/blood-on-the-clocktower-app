import { nextId } from "./util";

export type Player = {
  name: string;
  id: number;
};

export const createPlayer = (name: string): Player => ({
  name,
  id: nextId(),
});
