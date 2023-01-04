import {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { createTRPCProxyClient, createWSClient, wsLink } from "@trpc/client";
import type { AppRouter } from "@common/router";
import "./App.scss";
import {
  createSetupStagePlayer,
  initialGameState,
  Player,
} from "@common/model";
import {
  useClickOutside,
  useDeclarativeSoundPlayer,
  useHandleNominationUIEffects,
  useHandlePlayerCountChangeUIEffects,
  useWindowInnerWidth,
} from "./hooks";
import Background from "./components/Background";
import GameBoard from "./components/GameBoard/GameBoard";
import {
  calculateVotesRequired,
  GameAction,
  gameStateReducer,
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
//import ReaperVideo from "./assets/V_Reaper.mp4";
import NightToDay from "./assets/V_NightToDay.webm";
import DayToNight from "./assets/V_DayToNight.webm";
import AddPlayerModal from "./components/Player/AddPlayerModal";
import { AppContext } from "./context";
import PlayerContextMenuModal from "./components/Player/PlayerContextMenuModal";
import VotingRoundModal, {
  VotingRoundState,
} from "./components/Player/VotingRoundModal";
import EditionModal from "./components/Menu/EditionModal";

// create persistent WebSocket connection
const wsClient = createWSClient({
  url:
    import.meta.env.VITE_BACKEND_URL ?? `ws://${window.location.hostname}:2022`,
});
// configure TRPCClient to use WebSockets transport
const client = createTRPCProxyClient<AppRouter>({
  links: [
    wsLink({
      client: wsClient,
    }),
  ],
});

type PlayerContextMenuState =
  | {
      open: false;
    }
  | {
      open: true;
      playerId: number;
    };

const semaphore = {
  lock: Promise.resolve(),
  unlock: () => {},
};

function App() {
  const globals = useContext(AppContext);
  const gameId = globals.value.gameId;

  useEffect(() => {
    const unsub = client.onGameAction.subscribe(
      { gameId },
      {
        onData: (data) => {
          console.log("Got server state and action", data);
          _dispatch({ type: "replaceState", payload: data.game });
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
  }, [gameId]);

  const [game, _dispatch] = useReducer(gameStateReducer, initialGameState);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [playerContextMenuOpen, setPlayerContextMenuOpen] =
    useState<PlayerContextMenuState>({ open: false });
  const [votingRoundState, setVotingRoundState] = useState<VotingRoundState>({
    open: false,
  });
  const [isEditionModalOpen, setIsEditionModalOpen] = useState(false);

  const contextMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(contextMenuRef, () =>
    setPlayerContextMenuOpen({ open: false })
  );

  const dispatch = useCallback(
    async (action: GameAction) => {
      await semaphore.lock;
      console.log("Dispatching action", action);
      _dispatch(action);
      client.gameAction.mutate({ gameId, action });
      semaphore.lock = new Promise((resolve) => {
        semaphore.unlock = resolve;
      });
    },
    [gameId]
  );

  const nomination = isDay(game)
    ? game.phase.nomination
    : { state: "inactive" as const };

  useHandlePlayerCountChangeUIEffects(game.players);
  useHandleNominationUIEffects(nomination, game.players);
  useDeclarativeSoundPlayer(game);

  const addPlayer = (name: string, existingPlayers: Player[]) => {
    dispatch({
      type: "addPlayer",
      stage: "setup",
      payload: createSetupStagePlayer(name, existingPlayers),
    });
    setIsAddPlayerModalOpen(false);
  };

  const removePlayer = (id: number) => {
    if (game.stage !== "setup") {
      return;
    }
    dispatch({ type: "removePlayer", stage: "setup", payload: id });
  };

  // close the modal when clicking outside of it
  const addPlayerModalRef = useRef<HTMLDivElement>(null);
  useClickOutside(addPlayerModalRef, () => setIsAddPlayerModalOpen(false));
  const votingRoundModalRef = useRef<HTMLDivElement>(null);
  useClickOutside(votingRoundModalRef, () => {
    if (isActiveNomination(game)) {
      dispatch({ type: "cancelNomination", stage: "active" });
    }
  });

  // set voting round state if storyteller mode is on and active nomination has just been set
  function startVotingRound() {
    if (
      !isActiveNomination(game) ||
      !globals.value.storytellerMode ||
      votingRoundState.open
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

    setVotingRoundState({
      open: true,
      playerVotingOrder,
      currentIndex: 0,
    });
  }

  useEffect(() => {
    if (isActiveNomination(game)) {
      return;
    }

    setVotingRoundState({ open: false });
  }, [game]);

  // handle keyboard and mouse shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // open the modal when pressing the "+" or Space key
      // but only when command key is not pressed
      if (e.key === "+" || e.key === " ") {
        if (e.metaKey) return;
        if (isSetup(game) && !isAddPlayerModalOpen) {
          e.preventDefault();
          setIsAddPlayerModalOpen(true);
        }
      }
      // close the modal when pressing the "Escape" key
      // if modal is not open, cancel the current nomination
      if (e.key === "Escape") {
        e.preventDefault();
        if (isSetup(game)) {
          setIsAddPlayerModalOpen(false);
        }

        if (isDay(game)) {
          dispatch({ type: "cancelNomination", stage: "active" });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAddPlayerModalOpen, game, dispatch, playerContextMenuOpen.open]);

  function handleNomination(playerId: number) {
    if (!isDay(game)) return;
    const player = game.players.find((p) => p.id === playerId)!;
    if (nomination.state === "inactive") {
      if (!playerCanNominate(player, game)) {
        return;
      }
      dispatch({
        type: "setNominator",
        stage: "active",
        payload: player,
      });
    } else if (nomination.state === "pending") {
      if (!playerCanBeNominated(player, game)) {
        return;
      }
      dispatch({
        type: "setNominee",
        stage: "active",
        payload: player,
      });
    } else {
      // Count the player's vote if they can vote
      if (!playerCanVote(player, game)) {
        return;
      }
      dispatch({
        type: "toggleVote",
        stage: "active",
        payload: player,
      });
    }
  }

  function toggleDeathReminder(playerId: number, onState?: boolean) {
    if (!globals.value.storytellerMode) {
      return;
    }

    const deathReminders = globals.value.deathReminders;

    const updatedDeathReminders =
      onState ?? !deathReminders.includes(playerId)
        ? [...deathReminders, playerId]
        : deathReminders.filter((id) => id !== playerId);

    globals.setValue({
      ...globals.value,
      deathReminders: updatedDeathReminders,
    });
  }

  function handleSelectPlayer(playerId: number) {
    if (isDay(game)) {
      handleNomination(playerId);
      return;
    } else if (isNight(game)) {
      toggleDeathReminder(playerId);
    } else if (isFinished(game)) {
      dispatch({
        type: "revealPlayer",
        stage: "finished",
        payload: playerId,
      });
    }
  }

  function getGameStateText(): string {
    switch (game.stage) {
      case "setup":
        return "Setup Players";
      case "active": {
        if (isDay(game)) {
          return `Day ${game.phase.dayNumber}`;
        } else if (isNight(game)) {
          return `Night ${game.phase.nightNumber}`;
        }
        return "";
      }
      case "finished":
        return game.winningTeam === "good" ? "Good Wins!" : "Evil Wins...";
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
      {isEditionModalOpen && (
        <EditionModal
          onClose={() => setIsEditionModalOpen(false)}
          onEditionChosen={(edition) => {
            dispatch({
              type: "changeSettings",
              stage: "setup",
              payload: {
                editionId: edition,
              },
            });
          }}
        />
      )}

      <InfoPanel position={"top-left"}>
        <p>{getGameStateText()}</p>
      </InfoPanel>
      <Background phase={backgroundPhase} />
      <GameBoard
        game={game}
        onSelectPlayer={handleSelectPlayer}
        onModifyPlayers={(players) => {
          dispatch({
            type: "modifyPlayers",
            payload: players,
          });
        }}
        onCancelNomination={() => {
          if (playerContextMenuOpen.open) {
            return;
          }

          if (nomination.state !== "inactive") {
            dispatch({ type: "cancelNomination", stage: "active" });
          }
        }}
        onToggleContextMenu={(playerId: number, open: boolean) => {
          if (open) {
            setPlayerContextMenuOpen({
              open: true,
              playerId,
            });
          } else {
            setPlayerContextMenuOpen({
              open: false,
            });
          }
        }}
        onAddPlayerButtonClick={() => {
          setIsAddPlayerModalOpen(true);
        }}
      />

      <Menu
        votingRoundState={votingRoundState}
        onStartVotingRound={() => {
          if (votingRoundState.open) return;
          startVotingRound();
        }}
        onChooseEditionClick={() => {
          setIsEditionModalOpen(true);
        }}
        game={game}
        dispatch={dispatch}
      />
      {isAddPlayerModalOpen && (
        <AddPlayerModal
          onClose={() => setIsAddPlayerModalOpen(false)}
          addPlayer={(p) => addPlayer(p, game.players)}
          modalRef={addPlayerModalRef}
        />
      )}
      {playerContextMenuOpen.open && (
        <PlayerContextMenuModal
          onKillOrResurrect={(playerId: number) => {
            if (!isNight(game) && !isDay(game)) return;
            const player = game.players.find((p) => p.id === playerId)!;
            dispatch({
              type: "togglePlayerAliveStatus",
              stage: "active",
              payload: player,
            });
            toggleDeathReminder(playerId, false);
          }}
          onRemovePlayer={removePlayer}
          onModifyPlayer={(player) => {
            dispatch({
              type: "modifyPlayers",
              payload: game.players.map((p) =>
                p.id === player.id ? player : p
              ),
            });
          }}
          onClose={() => setPlayerContextMenuOpen({ open: false })}
          playerId={playerContextMenuOpen.playerId}
          game={game}
          modalRef={contextMenuRef}
        />
      )}
      {votingRoundState.open && game.stage === "active" && (
        <VotingRoundModal
          votingRoundState={votingRoundState}
          game={game}
          onClose={() => {
            if (isActiveNomination(game)) {
              dispatch({ type: "cancelNomination", stage: "active" });
            }
          }}
          onVoted={(voted: boolean) => {
            const { playerVotingOrder, currentIndex } = votingRoundState;
            const playerId = playerVotingOrder[currentIndex];
            const player = game.players.find((p) => p.id === playerId)!;
            if (voted) {
              dispatch({
                type: "toggleVote",
                stage: "active",
                payload: player,
              });
            }

            const isLastIndex = currentIndex === playerVotingOrder.length - 1;

            if (isLastIndex) {
              dispatch({
                type: "resolveVote",
                stage: "active",
              });
            } else {
              setVotingRoundState({
                ...votingRoundState,
                currentIndex: currentIndex + 1,
              });
            }
          }}
          modalRef={votingRoundModalRef}
        />
      )}
      {nomination.state === "active" && windowInnerWidth > MOBILE_THRESHOLD && (
        <div>
          <InfoPanel position={"top-right"}>
            <p>Votes required: {calculateVotesRequired(game)}</p>
          </InfoPanel>
          {
            <InfoPanel position={"top-right-2"}>
              {nomination.voters.length > 0 && (
                <p>{nomination.voters.length} votes given</p>
              )}
            </InfoPanel>
          }
        </div>
      )}
      {onTheBlock && windowInnerWidth > MOBILE_THRESHOLD && (
        <div>
          {
            <InfoPanel position={"bottom-right"}>
              {onTheBlock && (
                <p>
                  {game.players.find((p) => p.id === onTheBlock.playerId)!.name}{" "}
                  💀 with {onTheBlock.votes} votes
                </p>
              )}
            </InfoPanel>
          }
        </div>
      )}
      {isNight(game) && <VideoAnimation src={DayToNight} type="video/webm" />}
      {isDay(game) && <VideoAnimation src={NightToDay} type="video/webm" />}
    </div>
  );
}

export default App;
