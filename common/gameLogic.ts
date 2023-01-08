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
  globalSettingsSchema,
} from "./model";

// Actions are the things that can happen within a specific stage
const addPlayerActionSchema = z.object({
  type: z.literal("addPlayer"),
  payload: setupStagePlayerSchema,
});

const removePlayerActionSchema = z.object({
  type: z.literal("removePlayer"),
  payload: z.number(),
});

const changeSettingsSchema = z.object({
  type: z.literal("changeSettings"),
  payload: globalSettingsSchema,
});

const stageTransitionToActiveActionSchema = z.object({
  type: z.literal("stageTransitionToActive"),
});

const setupActionSchema = z.discriminatedUnion("type", [
  addPlayerActionSchema,
  removePlayerActionSchema,
  changeSettingsSchema,
  stageTransitionToActiveActionSchema,
]);

const setNominatorActionSchema = z.object({
  type: z.literal("setNominator"),
  payload: activeStagePlayerSchema,
});

const setNomineeActionSchema = z.object({
  type: z.literal("setNominee"),
  payload: activeStagePlayerSchema,
});

const cancelNominationActionSchema = z.object({
  type: z.literal("cancelNomination"),
});

const resolveVoteActionSchema = z.object({
  type: z.literal("resolveVote"),
});

const toggleVoteActionSchema = z.object({
  type: z.literal("toggleVote"),
  payload: activeStagePlayerSchema,
});

const togglePlayerAliveStatusActionSchema = z.object({
  type: z.literal("togglePlayerAliveStatus"),
  payload: activeStagePlayerSchema,
});

const phaseTransitionToNightActionSchema = z.object({
  type: z.literal("phaseTransitionToNight"),
});

const phaseTransitionToDayActionSchema = z.object({
  type: z.literal("phaseTransitionToDay"),
});

const stageTransitionToFinishedActionSchema = z.object({
  type: z.literal("stageTransitionToFinished"),
  payload: teamSchema,
});

const activeActionSchema = z.discriminatedUnion("type", [
  setNominatorActionSchema,
  setNomineeActionSchema,
  cancelNominationActionSchema,
  resolveVoteActionSchema,
  toggleVoteActionSchema,
  togglePlayerAliveStatusActionSchema,
  phaseTransitionToNightActionSchema,
  phaseTransitionToDayActionSchema,
  stageTransitionToFinishedActionSchema,
]);

const revealPlayerSchema = z.object({
  type: z.literal("revealPlayer"),
  payload: z.number(),
});

const revealAllPlayersSchema = z.object({
  type: z.literal("revealAllPlayers"),
});

const finishedActionSchema = z.discriminatedUnion("type", [
  revealPlayerSchema,
  revealAllPlayersSchema,
]);

const replaceStateSchema = z.object({
  type: z.literal("replaceState"),
  payload: gameSchema,
});

const resetToSetupSchema = z.object({
  type: z.literal("resetToSetup"),
});

const modifyPlayersSchema = z.object({
  type: z.literal("modifyPlayers"),
  payload: z.array(activeStagePlayerSchema).or(z.array(setupStagePlayerSchema)),
});

const anyStageActionSchema = z.discriminatedUnion("type", [
  replaceStateSchema,
  resetToSetupSchema,
  modifyPlayersSchema,
]);

export const gameActionSchema = setupActionSchema
  .or(activeActionSchema)
  .or(finishedActionSchema)
  .or(anyStageActionSchema);

export type SetupAction = z.infer<typeof setupActionSchema>;
export type ActiveAction = z.infer<typeof activeActionSchema>;
export type FinishedAction = z.infer<typeof finishedActionSchema>;
export type AnyStageAction = z.infer<typeof anyStageActionSchema>;

export type GameAction = z.infer<typeof gameActionSchema>;

function gameStateSetupReducer(
  state: Extract<Game, { stage: "setup" }>,
  action: SetupAction
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
    case "changeSettings":
      return {
        ...state,
        globalSettings: action.payload,
      };
  }
}

function gameStateActiveReducer(
  state: Extract<Game, { stage: "active" }>,
  action: ActiveAction
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

      const playersWithGhostVotesDeducted = game.players.map((player) =>
        !player.alive && game.phase.nomination.voters.includes(player.id)
          ? { ...player, ghostVote: false }
          : player
      );

      // No player on the block
      if (game.phase.nomination.voters.length < currentMaxVotes) {
        return {
          ...game,
          players: playersWithGhostVotesDeducted,
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
          players: playersWithGhostVotesDeducted,
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
        players: playersWithGhostVotesDeducted,
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
        revealedPlayers: [],
        winningTeam: action.payload,
      };
    }
  }
}

export function gameStateFinishedReducer(
  state: Extract<Game, { stage: "finished" }>,
  action: FinishedAction
): Extract<Game, { stage: "finished" }> {
  switch (action.type) {
    case "revealPlayer": {
      const playerId = action.payload;
      if (state.revealedPlayers.includes(playerId)) {
        return state;
      }
      return {
        ...state,
        revealedPlayers: state.revealedPlayers.concat(playerId),
      };
    }
    case "revealAllPlayers": {
      return {
        ...state,
        revealedPlayers: state.players.map((p) => p.id),
      };
    }
  }
}

export function gameStateReducer(state: Game, _action: GameAction): Game {
  const anyStageAction = anyStageActionSchema.safeParse(_action);
  if (anyStageAction.success) {
    const action = anyStageAction.data;
    if (action.type === "replaceState") {
      return action.payload;
    } else if (action.type === "resetToSetup") {
      return {
        stage: "setup",
        players: state.players.map(({ id, name }) => ({
          id,
          name,
        })),
        globalSettings: {
          editionId: "TROUBLE_BREWING",
        },
      };
    } else if (action.type === "modifyPlayers") {
      if (state.stage !== "setup") {
        const activeStagePlayers = z
          .array(activeStagePlayerSchema)
          .safeParse(action.payload);
        if (!activeStagePlayers.success) {
          throw new Error(
            "Cannot modify players to be setup stage players when game is not in setup stage"
          );
        }

        return {
          ...state,
          players: activeStagePlayers.data,
        };
      }

      return {
        ...state,
        players: action.payload,
      };
    }
  }

  const setupStageAction = setupActionSchema.safeParse(_action);
  if (setupStageAction.success) {
    if (state.stage !== "setup") {
      throw new Error(
        `Cannot perform setup stage action ${setupStageAction.data.type} when game is not in setup stage`
      );
    }
    return gameStateSetupReducer(state, setupStageAction.data);
  }

  const activeStageAction = activeActionSchema.safeParse(_action);
  if (activeStageAction.success) {
    if (state.stage !== "active") {
      throw new Error(
        `Cannot perform active stage action ${activeStageAction.data.type} when game is not in active stage`
      );
    }
    return gameStateActiveReducer(state, activeStageAction.data);
  }

  const finishedStageAction = finishedActionSchema.safeParse(_action);
  if (finishedStageAction.success) {
    if (state.stage !== "finished") {
      throw new Error(
        `Cannot perform finished stage action ${finishedStageAction.data.type} when game is not in finished stage`
      );
    }
    return gameStateFinishedReducer(state, finishedStageAction.data);
  }

  throw new Error("Unreachable");
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
    isDay(game) &&
    !game.phase.nominationBookkeeping.hasBeenNominated.includes(player.id)
  );
}

export function playerCanVote(player: Player, game: Game) {
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
    .map((player) => player.character)
    .filter((character): character is string => !!character);
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

export const getActions = (
  dispatch: (action: GameAction) => void
): {
  [T in GameAction["type"]]: (
    p: Extract<GameAction, { type: T }> extends { payload: infer P } ? P : void
  ) => void;
} => ({
  addPlayer: (payload) => {
    dispatch({
      type: "addPlayer",
      payload,
    });
  },
  removePlayer: (payload) => {
    dispatch({
      type: "removePlayer",
      payload,
    });
  },
  changeSettings: (payload) => {
    dispatch({
      type: "changeSettings",
      payload,
    });
  },
  stageTransitionToActive: () => {
    dispatch({
      type: "stageTransitionToActive",
    });
  },
  cancelNomination: () => {
    dispatch({
      type: "cancelNomination",
    });
  },
  modifyPlayers: (payload) => {
    dispatch({
      type: "modifyPlayers",
      payload,
    });
  },
  phaseTransitionToDay: () => {
    dispatch({
      type: "phaseTransitionToDay",
    });
  },
  phaseTransitionToNight: () => {
    dispatch({
      type: "phaseTransitionToNight",
    });
  },
  replaceState: (payload) => {
    dispatch({
      type: "replaceState",
      payload,
    });
  },
  resetToSetup: () => {
    dispatch({
      type: "resetToSetup",
    });
  },
  resolveVote: () => {
    dispatch({
      type: "resolveVote",
    });
  },
  revealAllPlayers: () => {
    dispatch({
      type: "revealAllPlayers",
    });
  },
  revealPlayer: (payload) => {
    dispatch({
      type: "revealPlayer",
      payload,
    });
  },
  setNominator: (payload) => {
    dispatch({
      type: "setNominator",
      payload,
    });
  },
  setNominee: (payload) => {
    dispatch({
      type: "setNominee",
      payload,
    });
  },
  stageTransitionToFinished: (payload) => {
    dispatch({
      type: "stageTransitionToFinished",
      payload,
    });
  },
  togglePlayerAliveStatus: (payload) => {
    dispatch({
      type: "togglePlayerAliveStatus",
      payload,
    });
  },
  toggleVote: (payload) => {
    dispatch({
      type: "toggleVote",
      payload,
    });
  },
});
