import React from "react";
import {
  canTransitionToNight,
  gameCanBeStarted,
  isActiveNomination,
  isDay,
  isNight,
} from "@common/gameLogic";
import type { VotingRoundState } from "../Player/VotingRoundModal";
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

type Props = {
  votingRoundState: VotingRoundState;
  onStartVotingRound: () => void;
  onChooseEditionClick: () => void;
};

const Menu: React.FC<Props> = ({
  votingRoundState,
  onStartVotingRound,
  onChooseEditionClick,
}) => {
  const game = useAtomValue(gameAtom);
  const actions = useAtomValue(actionsAtom);
  const setVideo = useSetAtom(videoAtom);
  const setSoundVolume = useSetAtom(soundVolumeAtom);
  const [storyTellerMode, setStoryTellerMode] = useAtom(storyTellerModeAtom);

  const [finishGameModalOpen, setFinishGameModalOpen] = React.useState(false);
  const [errorRecoveryMenuModalOpen, setErrorRecoveryMenuModalOpen] =
    React.useState(false);
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
        <FinishGameModal onClose={() => setFinishGameModalOpen(false)} />
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
                actions.stageTransitionToActive();
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
          {game.stage === "active" &&
            isDay(game) &&
            errorRecoveryMenuModalOpen && (
              <ErrorRecoveryMenuModal
                onClose={() => setErrorRecoveryMenuModalOpen(false)}
                game={game}
              />
            )}
          {game.stage === "active" && isDay(game) && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setErrorRecoveryMenuModalOpen(true);
              }}
            >
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
          {isActiveNomination(game) && !votingRoundState.open && (
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
