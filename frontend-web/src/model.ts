import { nextId } from "./util";

type Team = "good" | "evil";

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
      nominationBookkeeping: {
        hasNominated: [],
        hasBeenNominated: [],
      },
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
  player: ActiveStagePlayer & { alive: false; ghostVote: true }
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
  player: ActiveStagePlayer & { alive: true }
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

export const executePlayerOnTheBlock = (
  game: GameInPhase<"day">
): Extract<Game, { stage: "active" }> => {
  if (!game.phase.onTheBlock) {
    throw new Error("No player on the block");
  }

  const executee = game.players[game.phase.onTheBlock.playerId];

  if (!executee.alive) {
    throw new Error("Player on the block is already dead");
  }

  return killPlayer(game, executee);
};

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

export const resolveNomination = (
  game: GameInPhase<"day">
): Extract<Game, { stage: "active" }> => {
  if (game.phase.nomination.state !== "active") {
    throw new Error("Nomination is not active");
  }

  const nominationBookkeeping = {
    hasNominated: [
      ...game.phase.nominationBookkeeping.hasNominated,
      game.phase.nomination.nominator.id,
    ],
    hasBeenNominated: [
      ...game.phase.nominationBookkeeping.hasBeenNominated,
      game.phase.nomination.nominee.id,
    ],
  };

  if (game.phase.onTheBlock) {
    const currentHighestVotes = game.phase.onTheBlock.votes;
    // Not enough votes to put the player on the block
    if (currentHighestVotes > game.phase.nomination.voters.length) {
      return {
        ...game,
        phase: {
          ...game.phase,
          nomination: { state: "inactive" },
          nominationBookkeeping,
        },
      };
    }
    // Tie, no player on the block
    if (currentHighestVotes === game.phase.nomination.voters.length) {
      return {
        ...game,
        phase: {
          ...game.phase,
          nomination: { state: "inactive" },
          nominationBookkeeping,
          onTheBlock: undefined,
        },
      };
    }
  }

  // New player on the block (no pun intended)
  return {
    ...game,
    phase: {
      ...game.phase,
      nomination: { state: "inactive" },
      nominationBookkeeping,
      onTheBlock: {
        playerId: game.phase.nomination.nominee.id,
        votes: game.phase.nomination.voters.length,
      },
    },
  };
};
