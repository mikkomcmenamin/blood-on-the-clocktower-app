import React, { useContext } from "react";
import { Game } from "@common/model";
import {
  canTransitionToNight,
  GameAction,
  gameCanBeStarted,
  isActiveNomination,
  isNight,
  isSetup,
} from "@common/gameLogic";
import { AppContext } from "../../context";
import type { VotingRoundState } from "../Player/VotingRoundModal";
import styles from "./Menu.module.scss";
import SettingsButton from "./SettingsButton";
import SoundButton from "./SoundButton";

type Props = {
  game: Game;
  dispatch: (action: GameAction) => void;
  votingRoundState: VotingRoundState;
  onStartVotingRound: () => void;
  onSettingsButtonClick: () => void;
};

const Menu: React.FC<Props> = ({
  game,
  dispatch,
  votingRoundState,
  onStartVotingRound,
  onSettingsButtonClick,
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
      <nav className={styles.controls}>
        <div className={styles.floatingButtons}>
          {isSetup(game) && (
            <SettingsButton handleClick={onSettingsButtonClick} />
          )}
          <SoundButton />
        </div>
        <div aria-roledescription="navigation" className={styles.menu}>
          {game.stage === "setup" && gameCanBeStarted(game) && (
            <button
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
