import React from "react";
import { Game } from "@common/model";
import { GameAction } from "@common/gameLogic";
import "./Menu.scss";

type Props = {
  game: Game;
  dispatch: (action: GameAction) => void;
};

const Menu: React.FC<Props> = ({ game, dispatch }) => {
  return (
    <>
      <nav id="controls">
        <div aria-roledescription="navigation" id="menu">
          {game.stage === "setup" && (
            <button
              onClick={(e) => {
                e.preventDefault();
                dispatch({ type: "stageTransitionToActive", stage: "setup" });
              }}
            >
              Start game
            </button>
          )}
          {game.stage === "active" && (
            <button
              onClick={(e) => {
                e.preventDefault();
                dispatch({
                  type: "stageTransitionToFinished",
                  stage: "active",
                  payload: "good",
                });
              }}
            >
              Finish game
            </button>
          )}
          {game.stage === "active" && (
            <button
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  game.phase.phase === "day"
                    ? { type: "phaseTransitionToNight", stage: "active" }
                    : { type: "phaseTransitionToDay", stage: "active" }
                );
              }}
            >
              {game.phase.phase === "day"
                ? "Transition to night"
                : "Transition to day"}
            </button>
          )}
          {game.stage === "active" &&
            game.phase.phase === "day" &&
            game.phase.nomination.state === "active" && (
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
              }}
            >
              Reset game
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Menu;
