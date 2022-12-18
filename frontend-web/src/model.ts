import { nextId } from "./util";

type Team = "good" | "evil";

type Phase =
  | { phase: "day"; nomination: Nomination; dayNumber: number }
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

export const createPlayer = (name: string): Player => ({
  name,
  id: nextId(),
});

export const isNominator = (player: Player, nomination: Nomination) =>
  nomination.state !== "inactive" && nomination.nominator.id === player.id;

export const isNominee = (player: Player, nomination: Nomination) =>
  nomination.state === "active" && nomination.nominee.id === player.id;

export const transitionFromDayToNight = (
  game: GameInPhase<"day">
): GameInPhase<"night"> => {
  return {
    ...game,
    phase: {
      phase: "night",
      nightDeaths: [],
      nightNumber: game.phase.dayNumber + 1,
    },
  };
};

export const transitionFromNightToDay = (
  game: GameInPhase<"night">
): GameInPhase<"day"> => {
  return {
    ...game,
    phase: {
      phase: "day",
      nomination: { state: "inactive" },
      dayNumber: game.phase.nightNumber,
    },
    players: game.players.map((player) => {
      if (!player.alive) {
        return player;
      }

      const aliveAndGhostVote = game.phase.nightDeaths.includes(player.id)
        ? {
            alive: false as const,
            ghostVote: true,
          }
        : {
            alive: true as const,
          };

      return {
        ...player,
        ...aliveAndGhostVote,
      };
    }),
  };
};

export const transitionFromSetupToActive = (
  game: Extract<Game, { stage: "setup" }>
): GameInPhase<"night"> => {
  return {
    ...game,
    players: game.players.map((player) => ({
      ...player,
      alive: true,
      character: "Clockmaker", // TODO
      team: "good", // TODO
    })),
    stage: "active",
    phase: {
      phase: "night",
      nightDeaths: [],
      nightNumber: 1,
    },
  };
};

export const transitionFromActiveToFinished = (
  game: GameInPhase<"day">,
  winningTeam: Team
): Extract<Game, { stage: "finished" }> => {
  return {
    ...game,
    stage: "finished",
    winningTeam,
  };
};

export const spendPlayerGhostVote = (
  game: GameInPhase<"day">,
  player: Player
): GameInPhase<"day"> => {
  return {
    ...game,
    players: game.players.map((p) =>
      p.id === player.id
        ? {
            ...p,
            alive: false,
            ghostVote: false,
          }
        : p
    ),
  };
};

export const killPlayer = (
  game: Extract<Game, { stage: "active" }>,
  player: Player
): Extract<Game, { stage: "active" }> => {
  if (game.phase.phase === "night") {
    return {
      ...game,
      phase: {
        ...game.phase,
        nightDeaths: [...game.phase.nightDeaths, player.id],
      },
    };
  }

  return {
    ...game,
    players: game.players.map((p) =>
      p.id === player.id ? { ...p, alive: false, ghostVote: true } : p
    ),
  };
};
