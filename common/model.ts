import { nextId } from "../frontend-web/src/util";

export type Team = "good" | "evil";

type OnTheBlock = {
  playerId: number;
  votes: number;
};

type NominationBookkeeping = {
  hasNominated: number[] /* player IDs */;
  hasBeenNominated: number[] /* player IDs */;
};

type Phase =
  | {
      phase: "day";
      nomination: Nomination;
      dayNumber: number;
      onTheBlock?: OnTheBlock;
      nominationBookkeeping: NominationBookkeeping;
    }
  | {
      phase: "night";
      nightDeaths: number[] /* player IDs */;
      nightNumber: number;
    };

type Character = string; // todo: make an union of all the BOTC characters

export type Player = {
  name: string;
  id: number;
};

export type SetupStagePlayer = Player;

type AliveState = { alive: true } | { alive: false; ghostVote: boolean };

type CharacterState = { character: Character; team: Team };

export type ActiveStagePlayer = Player & CharacterState & AliveState;

export type Nomination =
  | {
      state: "active";
      nominator: Player;
      nominee: Player;
      voters: number[] /* player IDs */;
    }
  | {
      state: "pending";
      nominator: Player;
    }
  | {
      state: "inactive";
    };

export type Game =
  | {
      stage: "setup";
      players: SetupStagePlayer[];
    }
  | {
      stage: "active";
      players: ActiveStagePlayer[];
      phase: Phase;
    }
  | {
      stage: "finished";
      players: ActiveStagePlayer[];
      winningTeam: Team;
    };

export type GameInPhase<P extends Phase["phase"]> = Extract<
  Game,
  { stage: "active" }
> extends infer G
  ? G & { phase: Extract<Phase, { phase: P }> }
  : never;

export const createSetupStagePlayer = (name: string): Player => ({
  name,
  id: nextId(),
});

export const createMockActiveStagePlayer = (
  name: string
): ActiveStagePlayer => ({
  name,
  id: nextId(),
  character: "character",
  team: "good",
  alive: true,
});

export const canNominate = (
  game: GameInPhase<"day">,
  player: ActiveStagePlayer
): boolean => {
  if (game.phase.nomination.state !== "inactive") {
    return false;
  }

  if (game.phase.nominationBookkeeping.hasNominated.includes(player.id)) {
    return false;
  }

  if (!player.alive) {
    return false;
  }

  return true;
};

export const canBeNominated = (
  game: GameInPhase<"day">,
  player: ActiveStagePlayer
): boolean => {
  if (game.phase.nomination.state !== "inactive") {
    return false;
  }

  if (game.phase.nominationBookkeeping.hasBeenNominated.includes(player.id)) {
    return false;
  }

  return true;
};
