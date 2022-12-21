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
const addVoteActionSchema = activeActionSchema.merge(
  z.object({
    type: z.literal("addVote"),
    payload: activeStagePlayerSchema,
  })
);
const killPlayerActionSchema = activeActionSchema.merge(
  z.object({
    type: z.literal("killPlayer"),
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

export const gameActionSchema = z.union([
  addPlayerActionSchema,
  removePlayerActionSchema,
  setNominatorActionSchema,
  setNomineeActionSchema,
  cancelNominationActionSchema,
  resolveVoteActionSchema,
  addVoteActionSchema,
  killPlayerActionSchema,
  phaseTransitionToNightActionSchema,
  phaseTransitionToDayActionSchema,
  stageTransitionToActiveActionSchema,
  stageTransitionToFinishedActionSchema,
  replaceStateSchema,
  resetToSetupSchema,
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
      return {
        ...game,
        players: game.players.map((player) => ({
          ...player,
          alive: true as const,
          character: "Clockmaker", // TODO
          team: "good" as const, // TODO
        })),
        stage: "active" as const,
        phase: {
          phase: "night" as const,
          nightDeaths: [],
          nightNumber: 1,
        },
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
    case "addVote": {
      if (state.phase.phase !== "day") {
        throw new Error("Cannot set voters when phase is not day");
      }
      if (state.phase.nomination.state !== "active") {
        throw new Error("Cannot set voters when nomination is not active");
      }
      const player = action.payload;
      if (state.phase.nomination.voters.includes(player.id)) {
        throw new Error("Cannot add vote for player who has already voted");
      }

      if (!player.alive && !player.ghostVote) {
        throw new Error(
          `Dead player ${player.name} has already spent their ghost vote`
        );
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
    case "killPlayer": {
      const player = action.payload;
      if (!player.alive) {
        throw new Error(
          `Cannot kill player ${player.name} who is already dead`
        );
      }
      if (state.phase.phase === "night") {
        if (state.phase.nightDeaths.includes(player.id)) {
          throw new Error(
            `Cannot kill player ${player.name} twice in the same night`
          );
        }
        return {
          ...state,
          phase: {
            ...state.phase,
            nightDeaths: [...state.phase.nightDeaths, player.id],
          },
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
      if (game.phase.phase !== "day") {
        throw new Error("Cannot resolve vote when phase is not day");
      }

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
              nomination: { state: "inactive" as const },
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
              nomination: { state: "inactive" as const },
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
      if (game.phase.phase !== "day") {
        throw new Error("Cannot transition to night when phase is not day");
      }
      return {
        ...game,
        phase: {
          phase: "night" as const,
          nightDeaths: [],
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
        players: game.players.map((player) => {
          if (!player.alive) {
            return player;
          }

          if (!("nightDeaths" in game.phase)) {
            throw new Error(
              "Bug: no night deaths in game phase even though phase is night"
            );
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
    if(game.stage == "active") {
        const alivePlayers = game.players.filter(player => player.alive);
        return Math.ceil(alivePlayers.length/2);
        //Also take into account previous highest vote.
    }

  return 0;
}
