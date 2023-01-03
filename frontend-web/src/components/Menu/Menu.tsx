import React, { useContext } from "react";
import { Game } from "@common/model";
import {
  canTransitionToNight,
  GameAction,
  gameCanBeStarted,
  isActiveNomination,
  isNight,
} from "@common/gameLogic";
import { AppContext } from "../../context";
import type { VotingRoundState } from "../Player/VotingRoundModal";
import styles from "./Menu.module.scss";
import SettingsButton from "./SettingsButton";
import SoundButton from "./SoundButton";
import Modal from "../Modal";
import { classnames } from "@common/util";

const FinishGameModal: React.FC<{
  dispatch: (action: GameAction) => void;
  onClose: () => void;
}> = ({ dispatch, onClose }) => {
  return (
    <Modal onClose={onClose}>
      <h2>Finish game</h2>
      <p>Which team won?</p>
      <div className={styles.finishGameModalButtons}>
        <button
          onClick={() => {
            dispatch({
              type: "stageTransitionToFinished",
              stage: "active",
              payload: "evil",
            });
            onClose();
          }}
        >
          Evil
        </button>
        <button
          onClick={() => {
            dispatch({
              type: "stageTransitionToFinished",
              stage: "active",
              payload: "good",
            });
            onClose();
          }}
        >
          Good
        </button>
      </div>
    </Modal>
  );
};

type Props = {
  game: Game;
  dispatch: (action: GameAction) => void;
  votingRoundState: VotingRoundState;
  onStartVotingRound: () => void;
  onChooseEditionClick: () => void;
};

const Menu: React.FC<Props> = ({
  game,
  dispatch,
  votingRoundState,
  onStartVotingRound,
  onChooseEditionClick,
}) => {
  const globals = useContext(AppContext);

  const [finishGameModalOpen, setFinishGameModalOpen] = React.useState(false);
  const [desktopMenuDrawerOpen, setDesktopMenuDrawerOpen] =
    React.useState(false);

  const toggleFullscreen = (isEnabled: boolean) => {
    if (document.fullscreenElement && !isEnabled) {
      document.exitFullscreen();
    } else if (isEnabled) {
      document.documentElement.requestFullscreen();
    }
  };

  const onSettingsButtonClick = () => {
    setDesktopMenuDrawerOpen(!desktopMenuDrawerOpen);
  };

  return (
    <>
      {finishGameModalOpen && (
        <FinishGameModal
          dispatch={dispatch}
          onClose={() => setFinishGameModalOpen(false)}
        />
      )}
      <nav
        className={classnames({
          [styles.controls]: true,
          [styles.desktopMenuDrawerOpen]: desktopMenuDrawerOpen,
        })}
      >
        <div className={styles.floatingButtons}>
          <SettingsButton handleClick={onSettingsButtonClick} />
          <SoundButton />
        </div>
        <div aria-roledescription="navigation" className={styles.menu}>
          {game.stage === "setup" && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onChooseEditionClick();
              }}
            >
              Choose edition
            </button>
          )}
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
                setFinishGameModalOpen(true);
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
