// This file contains the logic for the game state machine
// This should run on the server and the client so it should not contain any UI logic
// or any logic that is specific to a particular client

// TODO: a lot

import { ActiveStagePlayer, Game, SetupStagePlayer } from "./model";

export type GameAction =
  | {
      type: "addPlayer";
      stage: "setup";
      payload: SetupStagePlayer;
    }
  | {
      type: "removePlayer";
      stage: "setup";
      payload: SetupStagePlayer["id"];
    }
  | {
      type: "setNominator";
      stage: "active";
      payload: ActiveStagePlayer;
    }
  | {
      type: "setNominee";
      stage: "active";
      payload: ActiveStagePlayer;
    }
  | {
      type: "setVoters";
      stage: "active";
      payload: ActiveStagePlayer["id"][];
    };

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
    case "setVoters": {
      if (state.phase.phase !== "day") {
        throw new Error("Cannot set voters when phase is not day");
      }
      if (state.phase.nomination.state !== "active") {
        throw new Error("Cannot set voters when nomination is not active");
      }
      return {
        ...state,
        phase: {
          ...state.phase,
          nomination: {
            ...state.phase.nomination,
            voters: action.payload,
          },
        },
      };
    }
  }
}

export function gameStateReducer(state: Game, action: GameAction): Game {
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
