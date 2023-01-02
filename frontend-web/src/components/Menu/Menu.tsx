import React, { useContext } from "react";
import { Game } from "@common/model";
import {
  canTransitionToNight,
  GameAction,
  gameCanBeStarted,
  isActiveNomination,
  isNight,
} from "@common/gameLogic";
import "./Menu.scss";
import { AppContext } from "../../context";
import type { VotingRoundState } from "../Player/VotingRoundModal";

type Props = {
  game: Game;
  dispatch: (action: GameAction) => void;
  votingRoundState: VotingRoundState;
  onStartVotingRound: () => void;
};

const Menu: React.FC<Props> = ({
  game,
  dispatch,
  votingRoundState,
  onStartVotingRound,
}) => {
  const globals = useContext(AppContext);

  const toggleFullscreen = (isEnabled: boolean) => {
    if (document.fullscreenElement && !isEnabled) {
      document.exitFullscreen();
    } else if (isEnabled) {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <>
      <nav id="controls">
        <div aria-roledescription="navigation" id="menu">
          {game.stage === "setup" && (
            <button
              disabled={!gameCanBeStarted(game)}
              onClick={(e) => {
                e.preventDefault();
                dispatch({ type: "stageTransitionToActive", stage: "setup" });
                toggleFullscreen(true);
              }}
            >
              Start game
            </button>
          )}
          {game.stage === "active" && !isActiveNomination(game) && (
            <button
              onClick={(e) => {
                e.preventDefault();
                dispatch({
                  type: "stageTransitionToFinished",
                  stage: "active",
                  payload: "good",
                });
                toggleFullscreen(false);
              }}
            >
              Finish game
            </button>
          )}
          {game.stage === "active" &&
            isActiveNomination(game) &&
            !votingRoundState.open && (
              <button
                onClick={() => {
                  onStartVotingRound();
                }}
              >
                Voting round
              </button>
            )}
          {canTransitionToNight(game) && (
            <button
              onClick={(e) => {
                e.preventDefault();
                dispatch({ type: "phaseTransitionToNight", stage: "active" });
              }}
            >
              Transition to night
            </button>
          )}
          {isNight(game) && (
            <button
              onClick={(e) => {
                e.preventDefault();
                dispatch({ type: "phaseTransitionToDay", stage: "active" });
              }}
            >
              Transition to day
            </button>
          )}
          {isActiveNomination(game) && !votingRoundState.open && (
            <button
              onClick={(e) => {
                e.preventDefault();
                dispatch({ type: "resolveVote", stage: "active" });
              }}
            >
              Resolve vote
            </button>
          )}
          {game.stage !== "setup" && (
            <button
              onClick={(e) => {
                e.preventDefault();
                dispatch({ type: "resetToSetup" });
                toggleFullscreen(false);
              }}
            >
              Reset game
            </button>
          )}
          <button
            onClick={(e) => {
              // toggle storyteller mode
              e.preventDefault();
              globals.setValue({
                ...globals.value,
                storytellerMode: !globals.value.storytellerMode,
                soundVolume: globals.value.storytellerMode ? 1 : 0,
                video: globals.value.storytellerMode,
              });
            }}
          >
            {globals.value.storytellerMode
              ? "Disable ST mode"
              : "Enable ST mode"}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Menu;
