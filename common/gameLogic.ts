// This file contains the logic for the game state machine
// This should run on the server and the client so it should not contain any UI logic
// or any logic that is specific to a particular client

import { z } from "zod";
import {
  Game,
  setupStagePlayerSchema,
  activeStagePlayerSchema,
  teamSchema,
  gameSchema,
  Player,
  ActiveStagePlayer,
} from "./model";

// Stages mean the game is in a particular state (setup, active, finished)
const setupActionSchema = z.object({
  stage: z.literal("setup"),
});
const activeActionSchema = z.object({
  stage: z.literal("active"),
});

// Actions are the things that can happen within a specific stage
const addPlayerActionSchema = setupActionSchema.merge(
  z.object({
    type: z.literal("addPlayer"),
    payload: setupStagePlayerSchema,
  })
);
const removePlayerActionSchema = setupActionSchema.merge(
  z.object({
    type: z.literal("removePlayer"),
    payload: z.number(),
  })
);
const setNominatorActionSchema = activeActionSchema.merge(
  z.object({
    type: z.literal("setNominator"),
    payload: activeStagePlayerSchema,
  })
);
const setNomineeActionSchema = activeActionSchema.merge(
  z.object({
    type: z.literal("setNominee"),
    payload: activeStagePlayerSchema,
  })
);
const cancelNominationActionSchema = activeActionSchema.merge(
  z.object({
    type: z.literal("cancelNomination"),
  })
);
const resolveVoteActionSchema = activeActionSchema.merge(
  z.object({
    type: z.literal("resolveVote"),
  })
);
const toggleVoteActionSchema = activeActionSchema.merge(
  z.object({
    type: z.literal("toggleVote"),
    payload: activeStagePlayerSchema,
  })
);
const togglePlayerAliveStatusActionSchema = activeActionSchema.merge(
  z.object({
    type: z.literal("togglePlayerAliveStatus"),
    payload: activeStagePlayerSchema,
  })
);
const phaseTransitionToNightActionSchema = activeActionSchema.merge(
  z.object({
    type: z.literal("phaseTransitionToNight"),
  })
);
const phaseTransitionToDayActionSchema = activeActionSchema.merge(
  z.object({
    type: z.literal("phaseTransitionToDay"),
  })
);
const stageTransitionToActiveActionSchema = setupActionSchema.merge(
  z.object({
    type: z.literal("stageTransitionToActive"),
  })
);
const stageTransitionToFinishedActionSchema = activeActionSchema.merge(
  z.object({
    type: z.literal("stageTransitionToFinished"),
    payload: teamSchema,
  })
);
const replaceStateSchema = z.object({
  type: z.literal("replaceState"),
  payload: gameSchema,
});

const resetToSetupSchema = z.object({
  type: z.literal("resetToSetup"),
});

const modifyPlayersSchema = setupActionSchema.merge(
  z.object({
    type: z.literal("modifyPlayers"),
    payload: z.array(setupStagePlayerSchema),
  })
);

export const gameActionSchema = z.union([
  addPlayerActionSchema,
  removePlayerActionSchema,
  setNominatorActionSchema,
  setNomineeActionSchema,
  cancelNominationActionSchema,
  resolveVoteActionSchema,
  toggleVoteActionSchema,
  togglePlayerAliveStatusActionSchema,
  phaseTransitionToNightActionSchema,
  phaseTransitionToDayActionSchema,
  stageTransitionToActiveActionSchema,
  stageTransitionToFinishedActionSchema,
  replaceStateSchema,
  resetToSetupSchema,
  modifyPlayersSchema,
]);

export type GameAction = z.infer<typeof gameActionSchema>;

function gameStateSetupReducer(
  state: Extract<Game, { stage: "setup" }>,
  action: Extract<GameAction, { stage: "setup" }>
) {
  switch (action.type) {
    case "addPlayer":
      return {
        ...state,
        players: [...state.players, action.payload],
      };
    case "removePlayer":
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.payload),
      };
    case "stageTransitionToActive": {
      const game = state;
      if (!gameCanBeStarted(game)) {
        throw new Error(
          "Cannot start game: not enough players or not every player has a name & character"
        );
      }
      return {
        ...game,
        players: game.players.map((player) => ({
          ...player,
          character: player.character as string,
          alive: true as const,
          team: "good" as const, // TODO
        })),
        stage: "active" as const,
        phase: {
          phase: "night" as const,
          nightNumber: 1,
        },
      };
    }
    case "modifyPlayers": {
      return {
        ...state,
        players: action.payload,
      };
    }
  }
}

function gameStateActiveReducer(
  state: Extract<Game, { stage: "active" }>,
  action: Extract<GameAction, { stage: "active" }>
) {
  switch (action.type) {
    case "setNominator":
      if (state.phase.phase !== "day") {
        throw new Error("Cannot set nominator when phase is not day");
      }
      if (state.phase.nomination.state !== "inactive") {
        throw new Error("Cannot set nominator when nomination is not inactive");
      }

      return {
        ...state,
        phase: {
          ...state.phase,
          nomination: {
            ...state.phase.nomination,
            state: "pending" as const,
            nominator: action.payload,
          },
        },
      };
    case "setNominee": {
      if (state.phase.phase !== "day") {
        throw new Error("Cannot set nominee when phase is not day");
      }
      if (state.phase.nomination.state !== "pending") {
        throw new Error("Cannot set nominee when nomination is not pending");
      }
      return {
        ...state,
        phase: {
          ...state.phase,
          nomination: {
            ...state.phase.nomination,
            state: "active" as const,
            nominee: action.payload,
            voters: [],
          },
        },
      };
    }
    case "toggleVote": {
      if (!isActiveNomination(state)) {
        throw new Error("Cannot toggle vote when nomination is not active");
      }
      const player = action.payload;

      if (!player.alive && !player.ghostVote) {
        // toggle back
        if (state.phase.nomination.voters.includes(player.id)) {
          return {
            ...state,
            phase: {
              ...state.phase,
              nomination: {
                ...state.phase.nomination,
                voters: state.phase.nomination.voters.filter(
                  (voter) => voter !== player.id
                ),
              },
            },
          };
        }
        throw new Error(
          `Dead player ${player.name} has already spent their ghost vote on another nomination`
        );
      }

      if (state.phase.nomination.voters.includes(player.id)) {
        // toggle back
        return {
          ...state,
          players:
            !player.alive && !player.ghostVote
              ? state.players.map((p) =>
                  p.id === player.id ? { ...p, ghostVote: true } : p
                )
              : state.players.map((p) =>
                  p.id === player.id ? { ...p, ghostVote: false } : p
                ),
          phase: {
            ...state.phase,
            nomination: {
              ...state.phase.nomination,
              voters: state.phase.nomination.voters.filter(
                (voter) => voter !== player.id
              ),
            },
          },
        };
      }

      return {
        ...state,
        players:
          !player.alive && player.ghostVote
            ? state.players.map((p) =>
                p.id === player.id ? { ...p, ghostVote: false } : p
              )
            : state.players,
        phase: {
          ...state.phase,
          nomination: {
            ...state.phase.nomination,
            voters: state.phase.nomination.voters.concat(player.id),
          },
        },
      };
    }
    case "togglePlayerAliveStatus": {
      const player = action.payload;
      if (!player.alive) {
        return {
          ...state,
          players: state.players.map((p) =>
            p.id === player.id
              ? {
                  id: p.id,
                  name: p.name,
                  alive: true as const,
                  character: p.character,
                  team: p.team,
                }
              : p
          ),
        };
      }

      return {
        ...state,
        players: state.players.map((p) =>
          p.id === player.id ? { ...p, alive: false, ghostVote: true } : p
        ),
      };
    }
    case "cancelNomination": {
      if (state.phase.phase !== "day") {
        throw new Error("Cannot cancel nomination when phase is not day");
      }
      if (state.phase.nomination.state === "inactive") {
        throw new Error("Cannot cancel nomination when nomination is inactive");
      }
      return {
        ...state,
        phase: {
          ...state.phase,
          nomination: {
            ...state.phase.nomination,
            state: "inactive" as const,
          },
        },
      };
    }
    case "resolveVote": {
      const game = state;
      if (!isActiveNomination(game)) {
        throw new Error("Cannot resolve vote when nomination is not active");
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

      const currentMaxVotes = calculateVotesRequired(game) - 1;

      // No player on the block
      if (game.phase.nomination.voters.length < currentMaxVotes) {
        return {
          ...game,
          phase: {
            ...game.phase,
            nomination: { state: "inactive" as const },
            nominationBookkeeping,
          },
        };
      }
      // Tie, no player on the block
      if (currentMaxVotes === game.phase.nomination.voters.length) {
        return {
          ...game,
          phase: {
            ...game.phase,
            nomination: { state: "inactive" as const },
            nominationBookkeeping,
            onTheBlock: undefined,
          },
        };
      }

      // New player on the block (no pun intended)
      return {
        ...game,
        phase: {
          ...game.phase,
          nomination: { state: "inactive" as const },
          nominationBookkeeping,
          onTheBlock: {
            playerId: game.phase.nomination.nominee.id,
            votes: game.phase.nomination.voters.length,
          },
        },
      };
    }
    case "phaseTransitionToNight": {
      const game = state;
      if (!isDay(game)) {
        throw new Error("Cannot transition to night when phase is not day");
      }

      if (!isInactiveNomination(game)) {
        throw new Error(
          "Cannot transition to night when nomination is not inactive"
        );
      }

      return {
        ...game,
        phase: {
          phase: "night" as const,
          nightNumber: game.phase.dayNumber + 1,
        },
      };
    }
    case "phaseTransitionToDay": {
      const game = state;
      if (game.phase.phase !== "night") {
        throw new Error("Cannot transition to day when phase is not night");
      }
      return {
        ...game,
        phase: {
          phase: "day" as const,
          nomination: { state: "inactive" as const },
          nominationBookkeeping: {
            hasNominated: [],
            hasBeenNominated: [],
          },
          dayNumber: game.phase.nightNumber,
        },
      };
    }
    case "stageTransitionToFinished": {
      const game = state;
      return {
        ...game,
        stage: "finished" as const,
        winningTeam: action.payload,
      };
    }
  }
}

export function gameStateReducer(state: Game, action: GameAction): Game {
  if (action.type === "replaceState") {
    return action.payload;
  } else if (action.type === "resetToSetup") {
    return {
      ...state,
      stage: "setup",
      players: state.players.map(({ id, name }) => ({
        id,
        name,
      })),
    };
  }
  switch (action.stage) {
    case "setup":
      if (state.stage !== "setup") {
        throw new Error(
          `Cannot perform action ${action.type} when game is not in setup stage`
        );
      }
      return gameStateSetupReducer(state, action);
    case "active":
      if (state.stage !== "active") {
        throw new Error(
          `Cannot perform action ${action.type} when game is not in active stage`
        );
      }
      return gameStateActiveReducer(state, action);
  }
}

export function calculateVotesRequired(game: Game): number {
  if (game.stage !== "active" || game.phase.phase === "night") {
    return 0;
  }

  const currentVoteCount = game.phase.onTheBlock?.votes ?? 0;
  const alivePlayers = game.players.filter((player) => player.alive);
  return Math.max(currentVoteCount + 1, Math.ceil(alivePlayers.length / 2));
}

type DayPhase = Extract<
  Extract<Game, { stage: "active" }>["phase"],
  { phase: "day" }
>;

export function isSetup(g: Game): g is Game & { stage: "setup" } {
  return g.stage === "setup";
}

export function isDay(
  g: Game
): g is Game & { stage: "active"; phase: DayPhase } {
  return g.stage === "active" && g.phase.phase === "day";
}

export function isNight(
  g: Game
): g is Game & { stage: "active"; phase: { phase: "night" } } {
  return g.stage === "active" && g.phase.phase === "night";
}

export function isActiveNomination(g: Game): g is Game & {
  stage: "active";
  phase: DayPhase & { nomination: { state: "active" } };
} {
  return isDay(g) && g.phase.nomination.state === "active";
}

export function isPendingNomination(g: Game): g is Game & {
  stage: "active";
  phase: DayPhase & { nomination: { state: "pending" } };
} {
  return isDay(g) && g.phase.nomination.state === "pending";
}

export function isInactiveNomination(g: Game): g is Game & {
  stage: "active";
  phase: DayPhase & { nomination: { state: "inactive" } };
} {
  return isDay(g) && g.phase.nomination.state === "inactive";
}

export function isFinished(g: Game): g is Game & { stage: "finished" } {
  return g.stage === "finished";
}

export function playerCanNominate(
  player: Player,
  game: Game
): player is ActiveStagePlayer & { alive: true } {
  return (
    "alive" in player &&
    !!player.alive &&
    isInactiveNomination(game) &&
    !game.phase.nominationBookkeeping.hasNominated.includes(player.id)
  );
}

export function playerCanBeNominated(
  player: Player,
  game: Game
): player is ActiveStagePlayer {
  return (
    "alive" in player &&
    isPendingNomination(game) &&
    !game.phase.nominationBookkeeping.hasBeenNominated.includes(player.id)
  );
}

export function playerCanVote(
  player: Player,
  game: Game
): player is ActiveStagePlayer {
  return (
    "alive" in player &&
    isActiveNomination(game) &&
    (!!player.alive || ("ghostVote" in player && !!player.ghostVote))
  );
}

export function canTransitionToNight(game: Game): game is Game & {
  stage: "active";
  phase: DayPhase & { nomination: { state: "inactive" } };
} {
  return isDay(game) && game.phase.nomination.state === "inactive";
}

export function getCharactersInPlay(game: Game): string[] {
  return game.players
    .filter(
      (player): player is Player & { character: string } =>
        "character" in player && typeof player.character === "string"
    )
    .map((player) => player.character as string);
}

export function gameCanBeStarted(game: Game): game is Game & {
  players: (Player & { name: string; character: string })[];
} {
  if (game.stage !== "setup") {
    return false;
  }

  return (
    game.players.length >= 5 &&
    game.players.every((player) => !!player.name && !!player.character)
  );
}
