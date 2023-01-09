import React from "react";
import {
  canTransitionToNight,
  gameCanBeStarted,
  isActiveNomination,
  isDay,
  isNight,
} from "@common/gameLogic";
import styles from "./Menu.module.scss";
import SettingsButton from "./SettingsButton";
import SoundButton from "./SoundButton";
import { classnames } from "@common/util";
import FinishGameModal from "./FinishGameModal";
import ErrorRecoveryMenuModal from "./ErrorRecoveryMenuModal";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  soundVolumeAtom,
  storyTellerModeAtom,
  videoAtom,
} from "../../atoms/settingsAtoms";
import { actionsAtom, gameAtom } from "../../atoms/gameAtoms";
import { useToggle } from "src/hooks";

type Props = {
  votingRoundOngoing: boolean;
  onStartVotingRound: () => void;
  onChooseEditionClick: () => void;
};

const Menu: React.FC<Props> = ({
  votingRoundOngoing,
  onStartVotingRound,
  onChooseEditionClick,
}) => {
  const game = useAtomValue(gameAtom);
  const actions = useAtomValue(actionsAtom);
  const setVideo = useSetAtom(videoAtom);
  const setSoundVolume = useSetAtom(soundVolumeAtom);
  const [storyTellerMode, setStoryTellerMode] = useAtom(storyTellerModeAtom);

  const finishGameModalToggle = useToggle(false);
  const errorRecoveryMenuModalToggle = useToggle(false);
  const desktopMenuDrawerToggle = useToggle(false);

  const toggleFullscreen = (isEnabled: boolean) => {
    if (document.fullscreenElement && !isEnabled) {
      document.exitFullscreen();
    } else if (isEnabled) {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <>
      {finishGameModalToggle.isOpen && (
        <FinishGameModal onClose={finishGameModalToggle.close} />
      )}
      <nav
        className={classnames({
          [styles.controls]: true,
          [styles.desktopMenuDrawerOpen]: desktopMenuDrawerToggle.isOpen,
        })}
      >
        <div className={styles.floatingButtons}>
          <SettingsButton handleClick={desktopMenuDrawerToggle.toggle} />
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
          {game.stage === "setup" && (
            <button
              onClick={(e) => {
                e.preventDefault();
                const randomizedPlayers = game.players.sort(() =>
                  Math.random() > 0.5 ? 1 : -1
                );
                actions.replaceState({
                  ...game,
                  players: randomizedPlayers,
                });
              }}
            >
              Randomize seats
            </button>
          )}
          {game.stage === "setup" && gameCanBeStarted(game) && (
            <button
              onClick={(e) => {
                e.preventDefault();
                actions.stageTransitionToActive();
                toggleFullscreen(true);
              }}
            >
              Start game
            </button>
          )}
          {game.stage === "active" && !isActiveNomination(game) && (
            <button onClick={finishGameModalToggle.open}>Finish game</button>
          )}
          {game.stage === "active" &&
            isActiveNomination(game) &&
            !votingRoundOngoing && (
              <button onClick={onStartVotingRound}>Voting round</button>
            )}
          {game.stage === "active" &&
            isDay(game) &&
            errorRecoveryMenuModalToggle.isOpen && (
              <ErrorRecoveryMenuModal
                onClose={errorRecoveryMenuModalToggle.close}
                game={game}
              />
            )}
          {game.stage === "active" && isDay(game) && (
            <button onClick={errorRecoveryMenuModalToggle.open}>
              Error recovery
            </button>
          )}
          {canTransitionToNight(game) && (
            <button
              onClick={(e) => {
                e.preventDefault();
                actions.phaseTransitionToNight();
              }}
            >
              Transition to night
            </button>
          )}
          {isNight(game) && (
            <button
              onClick={(e) => {
                e.preventDefault();
                actions.phaseTransitionToDay();
              }}
            >
              Transition to day
            </button>
          )}
          {isActiveNomination(game) && !votingRoundOngoing && (
            <button
              onClick={(e) => {
                e.preventDefault();
                actions.resolveVote();
              }}
            >
              Resolve vote
            </button>
          )}
          {game.stage !== "setup" && (
            <button
              onClick={(e) => {
                e.preventDefault();
                actions.resetToSetup();
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
              setStoryTellerMode(!storyTellerMode);
              setSoundVolume(storyTellerMode ? 1 : 0);
              setVideo(storyTellerMode);
            }}
          >
            {storyTellerMode ? "Disable ST mode" : "Enable ST mode"}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Menu;
