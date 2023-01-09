import { useEffect, useRef } from "react";
import "./App.scss";
import { createSetupStagePlayer } from "@common/model";
import {
  useClickOutside,
  useDeclarativeSoundPlayer,
  useHandleNominationUIEffects,
  useHandlePlayerCountChangeUIEffects,
  useToggle,
  useToggleWithExtraData,
  useWindowInnerWidth,
} from "./hooks";
import Background from "./components/Background";
import GameBoard from "./components/GameBoard/GameBoard";
import {
  calculateVotesRequired,
  isActiveNomination,
  isDay,
  isFinished,
  isNight,
  isSetup,
  playerCanBeNominated,
  playerCanNominate,
  playerCanVote,
} from "@common/gameLogic";
import Menu from "./components/Menu/Menu";
import InfoPanel from "./components/InfoPanel";
import VideoAnimation from "./components/VideoAnimation";
import NightToDay from "./assets/V_NightToDay.webm";
import DayToNight from "./assets/V_DayToNight.webm";
import AddPlayerModal from "./components/Player/AddPlayerModal";
import PlayerContextMenuModal from "./components/Player/PlayerContextMenuModal";
import VotingRoundModal, {
  VotingRoundState,
} from "./components/Player/VotingRoundModal";
import EditionModal from "./components/Menu/EditionModal";
import { useAtom, useAtomValue } from "jotai";
import { deathRemindersAtom, storyTellerModeAtom } from "./atoms/settingsAtoms";
import LoadingModal from "./components/LoadingModal";
import {
  actionsAtom,
  gameAtom,
  gameIdAtom,
  interactiveAtom,
  nominationAtom,
} from "./atoms/gameAtoms";
import { client, semaphore } from "./networking";
import { getGameStateText } from "./format";
import { pickRandomCharacter, pickRandomName } from "./devHelpers";

function App() {
  const [gameId] = useAtom(gameIdAtom);
  const [storyTellerMode] = useAtom(storyTellerModeAtom);
  const [deathReminders, setDeathReminders] = useAtom(deathRemindersAtom);
  const [interactive, setInteractive] = useAtom(interactiveAtom);

  const [game, setGame] = useAtom(gameAtom);
  const nomination = useAtomValue(nominationAtom);
  const actions = useAtomValue(actionsAtom);

  useEffect(() => {
    const unsub = client.onGameAction.subscribe(
      { gameId },
      {
        onData: (data) => {
          console.log("Got server state and action", data);
          setGame(data.game);

          if (!interactive) {
            setInteractive(true);
          }

          semaphore.unlock();
        },
        onError: (err) => {
          console.error(err);
        },
      }
    );
    return () => {
      unsub.unsubscribe();
    };
  }, [gameId, interactive, setInteractive, setGame]);

  const playerContextMenuToggle = useToggleWithExtraData<{ playerId: number }>({
    isOpen: false,
  });
  const votingRoundToggle = useToggleWithExtraData<VotingRoundState>({
    isOpen: false,
  });
  const addPlayerModalToggle = useToggle(false);
  const editionModalToggle = useToggle(false);

  const contextMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside(contextMenuRef, playerContextMenuToggle.close);
  const addPlayerModalRef = useRef<HTMLDivElement>(null);
  useClickOutside(addPlayerModalRef, addPlayerModalToggle.close);
  const votingRoundModalRef = useRef<HTMLDivElement>(null);
  useClickOutside(votingRoundModalRef, () => {
    if (isActiveNomination(game)) {
      actions.cancelNomination();
    }
  });

  useHandlePlayerCountChangeUIEffects(game.players);
  useHandleNominationUIEffects(nomination, game.players);
  useDeclarativeSoundPlayer(game);

  const addPlayer = (name: string) => {
    actions.addPlayer(createSetupStagePlayer(name, game.players));
    addPlayerModalToggle.close();
  };

  const removePlayer = (id: number) => {
    if (game.stage !== "setup") {
      return;
    }
    actions.removePlayer(id);
  };

  // set voting round state if storyteller mode is on and active nomination has just been set
  function startVotingRound() {
    if (
      !isActiveNomination(game) ||
      !storyTellerMode ||
      votingRoundToggle.isOpen
    ) {
      return;
    }
    // The first player to vote is the player who is next in the players array to the nominee.
    // If the nominee is the last player in the array, the first player to vote is the first player in the array.
    const nominee = game.phase.nomination.nominee;
    const nomineeIndex = game.players.findIndex(
      (player) => player.id === nominee.id
    );
    if (nomineeIndex === -1) {
      throw new Error("Nominee not found in players array");
    }
    const firstVoterIndex =
      nomineeIndex === game.players.length - 1 ? 0 : nomineeIndex + 1;

    const playerVotingOrder = game.players
      .slice(firstVoterIndex)
      .concat(game.players.slice(0, firstVoterIndex))
      .map((player) => player.id);

    votingRoundToggle.open({
      playerVotingOrder,
      currentIndex: 0,
    });
  }

  useEffect(() => {
    if (isActiveNomination(game)) {
      return;
    }

    votingRoundToggle.close();
  }, [game]);

  // handle keyboard and mouse shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // open the modal when pressing the "+" or Space key
      // but only when command key is not pressed
      if (e.key === "+" || e.key === " ") {
        if (e.metaKey) return;
        if (isSetup(game) && !addPlayerModalToggle.isOpen) {
          e.preventDefault();
          addPlayerModalToggle.open();
        }
      }
      // close the modal when pressing the "Escape" key
      // if modal is not open, cancel the current nomination
      if (e.key === "Escape") {
        e.preventDefault();
        if (isSetup(game)) {
          addPlayerModalToggle.close();
          editionModalToggle.close();
        }

        if (isDay(game)) {
          actions.cancelNomination();
        }
      }

      if (e.key === "a" && e.metaKey) {
        e.preventDefault();
        if (isSetup(game)) {
          addPlayer(pickRandomName());
        }
      }

      if (e.key === "c" && e.metaKey) {
        e.preventDefault();
        if (isSetup(game)) {
          actions.modifyPlayers(
            game.players.map((player) => {
            return { ...player, character: pickRandomCharacter(game) };
          })
        );
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [addPlayerModalToggle, editionModalToggle, game, actions]);

  function handleNomination(playerId: number) {
    if (!isDay(game)) return;
    const player = game.players.find((p) => p.id === playerId)!;
    if (nomination.state === "inactive") {
      if (!playerCanNominate(player, game)) {
        return;
      }
      actions.setNominator(player);
    } else if (nomination.state === "pending") {
      if (!playerCanBeNominated(player, game)) {
        return;
      }
      actions.setNominee(player);
    } else {
      // Count the player's vote if they can vote
      if (!playerCanVote(player, game)) {
        return;
      }
      actions.toggleVote(player);
    }
  }

  function toggleDeathReminder(playerId: number, onState?: boolean) {
    if (!storyTellerMode) {
      return;
    }

    const updatedDeathReminders =
      onState ?? !deathReminders.includes(playerId)
        ? [...deathReminders, playerId]
        : deathReminders.filter((id) => id !== playerId);

    setDeathReminders(updatedDeathReminders);
  }

  function handleSelectPlayer(playerId: number) {
    if (isDay(game)) {
      handleNomination(playerId);
      return;
    } else if (isNight(game)) {
      toggleDeathReminder(playerId);
    } else if (isFinished(game)) {
      actions.revealPlayer(playerId);
    }
  }

  const windowInnerWidth = useWindowInnerWidth();
  const MOBILE_THRESHOLD = 768;

  const onTheBlock = isDay(game) && game.phase.onTheBlock;

  const backgroundPhase =
    isNight(game) || (game.stage === "finished" && game.winningTeam === "evil")
      ? "night"
      : "day";

  return (
    <div className="App">
      {!interactive && <LoadingModal />}
      {editionModalToggle.isOpen && (
        <EditionModal
          onClose={editionModalToggle.close}
          onEditionChosen={(edition) => {
            actions.changeSettings({
              editionId: edition,
            });
          }}
        />
      )}

      <InfoPanel position={"top-left"}>
        <p>{getGameStateText(game)}</p>
      </InfoPanel>
      <Background phase={backgroundPhase} />
      <GameBoard
        onSelectPlayer={handleSelectPlayer}
        onModifyPlayers={actions.modifyPlayers}
        onCancelNomination={() => {
          if (playerContextMenuToggle.isOpen) {
            return;
          }

          if (nomination.state !== "inactive") {
            actions.cancelNomination();
          }
        }}
        onToggleContextMenu={(playerId: number, open: boolean) => {
          if (open) {
            playerContextMenuToggle.open({
              playerId,
            });
          } else {
            playerContextMenuToggle.close();
          }
        }}
        onAddPlayerButtonClick={addPlayerModalToggle.open}
      />

      <Menu
        votingRoundOngoing={votingRoundToggle.isOpen}
        onStartVotingRound={startVotingRound}
        onChooseEditionClick={editionModalToggle.open}
      />
      {addPlayerModalToggle.isOpen && (
        <AddPlayerModal
          onClose={addPlayerModalToggle.close}
          addPlayer={addPlayer}
          modalRef={addPlayerModalRef}
        />
      )}
      {playerContextMenuToggle.isOpen && (
        <PlayerContextMenuModal
          onKillOrResurrect={(playerId: number) => {
            if (!isNight(game) && !isDay(game)) return;
            const player = game.players.find((p) => p.id === playerId)!;
            actions.togglePlayerAliveStatus(player);
            toggleDeathReminder(playerId, false);
          }}
          onRemovePlayer={removePlayer}
          onModifyPlayer={(player) => {
            actions.modifyPlayers(
              game.players.map((p) => (p.id === player.id ? player : p))
            );
          }}
          onClose={playerContextMenuToggle.close}
          playerId={playerContextMenuToggle.data.playerId}
          modalRef={contextMenuRef}
        />
      )}
      {votingRoundToggle.isOpen && game.stage === "active" && (
        <VotingRoundModal
          votingRoundState={votingRoundToggle.data}
          onClose={() => {
            if (isActiveNomination(game)) {
              actions.cancelNomination();
            }
          }}
          onVoted={(voted: boolean) => {
            const { playerVotingOrder, currentIndex } = votingRoundToggle.data;
            const playerId = playerVotingOrder[currentIndex];
            const player = game.players.find((p) => p.id === playerId)!;
            if (voted) {
              actions.toggleVote(player);
            }

            const isLastIndex = currentIndex === playerVotingOrder.length - 1;

            if (isLastIndex) {
              actions.resolveVote();
            } else {
              votingRoundToggle.setData({
                ...votingRoundToggle.data,
                currentIndex: currentIndex + 1,
              });
            }
          }}
          modalRef={votingRoundModalRef}
        />
      )}
      {nomination.state === "active" && windowInnerWidth > MOBILE_THRESHOLD && (
        <>
          <InfoPanel position={"top-right"}>
            <p>Votes required: {calculateVotesRequired(game)}</p>
          </InfoPanel>

          <InfoPanel position={"top-right-2"}>
            {nomination.voters.length > 0 && (
              <p>{nomination.voters.length} votes given</p>
            )}
          </InfoPanel>
        </>
      )}
      {onTheBlock && windowInnerWidth > MOBILE_THRESHOLD && (
        <InfoPanel position={"bottom-right"}>
          {onTheBlock && (
            <p>
              {game.players.find((p) => p.id === onTheBlock.playerId)!.name} 💀
              with {onTheBlock.votes} votes
            </p>
          )}
        </InfoPanel>
      )}
      {isNight(game) && <VideoAnimation src={DayToNight} />}
      {isDay(game) && <VideoAnimation src={NightToDay} />}
    </div>
  );
}

export default App;
