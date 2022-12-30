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

type Props = {
  game: Game;
  dispatch: (action: GameAction) => void;
};

const Menu: React.FC<Props> = ({ game, dispatch }) => {
  const globals = useContext(AppContext);
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
          {isActiveNomination(game) && (
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
          <button
            onClick={(e) => {
              // toggle storyteller mode
              e.preventDefault();
              globals.setValue({
                ...globals.value,
                storytellerMode: !globals.value.storytellerMode,
                sound: globals.value.storytellerMode,
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
